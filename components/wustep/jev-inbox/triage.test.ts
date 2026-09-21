import { describe, expect, it } from 'vitest'

import { gmailBase64UrlToUtf8 } from './gmail'
import { INBOX_SEED } from './messages'
import {
  argmaxAction,
  choiceConfidence,
  clamp01,
  cloneSettings,
  DEFAULT_REASON_SETTINGS,
  emptyActivations,
  scoreActions,
  softmax,
  triageItem
} from './triage'
import {
  REASON_IDS,
  type ReasonActivations,
  type ReasonSettings
} from './types'

function settingsWith(patch: Partial<ReasonSettings>): ReasonSettings {
  const next = cloneSettings(DEFAULT_REASON_SETTINGS)
  for (const id of REASON_IDS) {
    const override = patch[id]
    if (override) next[id] = override
  }
  return next
}

function activations(patch: Partial<ReasonActivations>): ReasonActivations {
  return { ...emptyActivations(), ...patch }
}

describe('softmax / confidence', () => {
  it('returns a distribution that sums to 1', () => {
    const out = softmax([2, 1, 0.2])
    const sum = out.reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(1, 8)
  })

  it('peaks on the largest logit', () => {
    const out = softmax([3, 0.4, 0.2])
    expect(out[0]).toBeGreaterThan(out[1] ?? 0)
    expect(out[0]).toBeGreaterThan(out[2] ?? 0)
  })

  it('treats a one-hot triad as high confidence', () => {
    expect(choiceConfidence([1, 0, 0])).toBeCloseTo(1, 5)
  })

  it('treats a flat triad as low confidence', () => {
    expect(choiceConfidence([1 / 3, 1 / 3, 1 / 3])).toBeCloseTo(0, 5)
  })

  it('clamps out-of-range values', () => {
    expect(clamp01(-2)).toBe(0)
    expect(clamp01(2)).toBe(1)
    expect(clamp01(Number.NaN)).toBe(0)
  })
})

describe('scoreActions', () => {
  it('recommends Delete for obvious spam', () => {
    const result = scoreActions(
      activations({ spam: 0.99 }),
      DEFAULT_REASON_SETTINGS
    )
    expect(result.recommended).toBe('Delete')
    expect(result.scores.Delete).toBeGreaterThan(0.7)
    expect(result.choice.choice).toBe('Delete')
  })

  it('recommends Leave for a real person with no other pull', () => {
    const result = scoreActions(
      activations({ person: 0.97 }),
      DEFAULT_REASON_SETTINGS
    )
    expect(result.recommended).toBe('Leave')
    expect(result.scores.Leave).toBeGreaterThan(0.6)
  })

  it('recommends Review for security mail', () => {
    const result = scoreActions(
      activations({ security: 0.97 }),
      DEFAULT_REASON_SETTINGS
    )
    expect(result.recommended).toBe('Review')
    expect(result.scores.Review).toBeGreaterThan(0.6)
  })

  it('gives every action its own 0–1 confidence and sums to 1', () => {
    const result = scoreActions(
      activations({ promotional: 0.8, person: 0.7 }),
      DEFAULT_REASON_SETTINGS
    )
    const { Delete, Review, Leave } = result.scores
    for (const value of [Delete, Review, Leave]) {
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThanOrEqual(1)
    }
    expect(Delete + Review + Leave).toBeCloseTo(1, 8)
    expect(argmaxAction(result.scores)).toBe(result.recommended)
  })

  it('moves a mixed promo-from-a-friend toward Delete when promo is upweighted', () => {
    const mixed = activations({ person: 0.88, promotional: 0.62 })
    const defaultResult = scoreActions(mixed, DEFAULT_REASON_SETTINGS)
    const promoHeavy = scoreActions(
      mixed,
      settingsWith({
        promotional: { enabled: true, weight: 2.4 },
        person: { enabled: true, weight: 0.2 }
      })
    )
    expect(promoHeavy.scores.Delete).toBeGreaterThan(
      defaultResult.scores.Delete
    )
  })

  it('moves the same mixed mail toward Leave when person is upweighted', () => {
    const mixed = activations({ person: 0.88, promotional: 0.62 })
    const defaultResult = scoreActions(mixed, DEFAULT_REASON_SETTINGS)
    const personHeavy = scoreActions(
      mixed,
      settingsWith({
        person: { enabled: true, weight: 2.4 },
        promotional: { enabled: true, weight: 0.15 }
      })
    )
    expect(personHeavy.scores.Leave).toBeGreaterThan(defaultResult.scores.Leave)
    expect(personHeavy.recommended).toBe('Leave')
  })

  it('falls back to a flat triad when every reason is disabled', () => {
    const off: ReasonSettings = cloneSettings(DEFAULT_REASON_SETTINGS)
    for (const id of REASON_IDS) {
      off[id] = { enabled: false, weight: 1 }
    }
    const result = scoreActions(activations({ spam: 1 }), off)
    expect(result.scores.Delete).toBeCloseTo(1 / 3, 5)
    expect(result.scores.Review).toBeCloseTo(1 / 3, 5)
    expect(result.scores.Leave).toBeCloseTo(1 / 3, 5)
  })
})

describe('seed inbox', () => {
  it('uses Gmail users.messages field names and flattened helpers', () => {
    const first = INBOX_SEED[0]?.message
    expect(first).toBeTruthy()
    if (!first) return
    expect(first.id).toMatch(/^[0-9a-f]+$/u)
    expect(first.threadId).toBeTruthy()
    expect(first.labelIds).toContain('INBOX')
    expect(first.snippet.length).toBeGreaterThan(0)
    expect(first.historyId).toBeTruthy()
    expect(first.internalDate).toMatch(/^\d+$/u)
    expect(first.sizeEstimate).toBeGreaterThan(100)
    expect(first.payload.headers.some((h) => h.name === 'From')).toBe(true)
    expect(first.payload.headers.some((h) => h.name === 'Subject')).toBe(true)
    expect(first.payload.parts?.some((p) => p.mimeType === 'text/plain')).toBe(
      true
    )
    expect(first.payload.parts?.some((p) => p.mimeType === 'text/html')).toBe(
      true
    )
    expect(first.subject).toBeTruthy()
    expect(first.sender).toContain('@')
    expect(first.toRecipients.length).toBeGreaterThan(0)
    expect(first.date).toMatch(/^\d{4}-\d{2}-\d{2}T/u)
    expect(first.plaintextBody.length).toBeGreaterThan(0)
    const plain = first.payload.parts?.find((p) => p.mimeType === 'text/plain')
    expect(plain?.body?.data).toBeTruthy()
    if (plain?.body?.data) {
      expect(gmailBase64UrlToUtf8(plain.body.data)).toBe(first.plaintextBody)
    }
  })

  it('covers the demo genres', () => {
    expect(INBOX_SEED.length).toBeGreaterThanOrEqual(12)
    expect(INBOX_SEED.length).toBeLessThanOrEqual(20)
    const subjects = INBOX_SEED.map((entry) => entry.message.subject)
    expect(subjects.some((s) => /sale/i.test(s))).toBe(true)
    expect(subjects.some((s) => /pledged|dentist|reminder/i.test(s))).toBe(true)
    expect(subjects.some((s) => /engineer|founding/i.test(s))).toBe(true)
    expect(subjects.some((s) => /citation|parking/i.test(s))).toBe(true)
    expect(subjects.some((s) => /widget|batch/i.test(s))).toBe(true)
    expect(subjects.some((s) => /sign-in|security|dependabot/i.test(s))).toBe(
      true
    )
  })

  it('triages the seed with default settings without throwing', () => {
    for (const entry of INBOX_SEED) {
      const result = triageItem(entry, DEFAULT_REASON_SETTINGS)
      expect(TRIAGE_ACTIONS_SET.has(result.recommended)).toBe(true)
      expect(
        result.scores.Delete + result.scores.Review + result.scores.Leave
      ).toBeCloseTo(1, 8)
    }
  })
})

const TRIAGE_ACTIONS_SET = new Set(['Delete', 'Review', 'Leave'])
