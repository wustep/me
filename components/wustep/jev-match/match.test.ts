import { describe, expect, it } from 'vitest'

import type { YouProfile } from './types'
import { matchPerson, rankPeople, toggleIn } from './match'
import { DEFAULT_YOU, PEOPLE } from './people'

describe('matchPerson', () => {
  it('ranks a climbing Oakland neighbor above a thin SF match', () => {
    const nia = PEOPLE.find((p) => p.id === 'nia-calder')
    const noor = PEOPLE.find((p) => p.id === 'noor-hale')
    expect(nia && noor).toBeTruthy()
    if (!nia || !noor) return
    const niaMatch = matchPerson(DEFAULT_YOU, nia)
    const noorMatch = matchPerson(DEFAULT_YOU, noor)
    expect(niaMatch.fit).toBeGreaterThan(noorMatch.fit)
    expect(niaMatch.hypothesis.toLowerCase()).toContain('climb')
  })

  it('returns fit and confidence in 0–1 with structured reasons', () => {
    const person = PEOPLE[0]
    expect(person).toBeTruthy()
    if (!person) return
    const result = matchPerson(DEFAULT_YOU, person)
    expect(result.fit).toBeGreaterThanOrEqual(0)
    expect(result.fit).toBeLessThanOrEqual(1)
    expect(result.confidence).toBeGreaterThanOrEqual(0)
    expect(result.confidence).toBeLessThanOrEqual(1)
    expect(result.reasons.length).toBeGreaterThanOrEqual(4)
    expect(result.hypothesis.length).toBeGreaterThan(10)
  })

  it('recomputes when the you-profile hobbies change', () => {
    const nia = PEOPLE.find((p) => p.id === 'nia-calder')
    expect(nia).toBeTruthy()
    if (!nia) return
    const climbing = matchPerson(DEFAULT_YOU, nia)
    const jazzOnly: YouProfile = {
      ...DEFAULT_YOU,
      hobbies: ['jazz'],
      lookingFor: ['a bandmate']
    }
    const jazz = matchPerson(jazzOnly, nia)
    expect(climbing.fit).toBeGreaterThan(jazz.fit)
  })

  it('sorts the pool by fit', () => {
    const ranked = rankPeople(DEFAULT_YOU, PEOPLE)
    expect(ranked).toHaveLength(PEOPLE.length)
    for (let i = 1; i < ranked.length; i++) {
      const prev = ranked[i - 1]
      const cur = ranked[i]
      if (!prev || !cur) continue
      expect(prev.fit).toBeGreaterThanOrEqual(cur.fit)
    }
  })
})

describe('toggleIn', () => {
  it('adds and removes', () => {
    expect(toggleIn(['a'], 'b')).toEqual(['a', 'b'])
    expect(toggleIn(['a', 'b'], 'a')).toEqual(['b'])
  })
})
