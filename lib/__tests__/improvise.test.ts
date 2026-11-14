import { describe, expect, it } from 'vitest'

import { IMPROV_STEPS, improvise } from '../improvise'

// Small deterministic PRNG (a 32-bit LCG) so each seed is a repeatable phrase.
function seeded(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
    return state / 4_294_967_296
  }
}

const SEEDS = Array.from({ length: 200 }, (_, i) => i + 1)
const PENTATONIC = new Set([0, 2, 4, 7, 9])

describe('improvise', () => {
  it('returns the same phrase for the same seed', () => {
    expect(improvise(seeded(7))).toEqual(improvise(seeded(7)))
  })

  it('returns different phrases for different seeds', () => {
    const phrases = new Set(
      SEEDS.map((seed) =>
        improvise(seeded(seed))
          .notes.map((note) => note.midi)
          .join(' ')
      )
    )
    expect(phrases.size).toBeGreaterThan(SEEDS.length * 0.95)
  })

  it('keeps the right hand in the pentatonic and the left on root and fifth', () => {
    for (const seed of SEEDS) {
      const { notes } = improvise(seeded(seed))
      const root = Math.min(...notes.map((note) => note.midi)) + 12
      for (const note of notes) {
        const degree = (((note.midi - root) % 12) + 12) % 12
        if (note.key === undefined) {
          expect([0, 7]).toContain(degree)
        } else if (note.duration > 0.08) {
          expect(PENTATONIC.has(degree)).toBe(true)
        }
      }
    }
  })

  it('ends at home, on the root or the fifth', () => {
    for (const seed of SEEDS) {
      const { notes } = improvise(seeded(seed))
      const root = Math.min(...notes.map((note) => note.midi)) + 12
      const melody = notes.filter((note) => note.key !== undefined)
      const final = melody.at(-1)!
      expect([0, 7]).toContain((final.midi - root) % 12)
      // The final note is the long one.
      expect(final.duration).toBeGreaterThan(0.5)
    }
  })

  it('stays short, in range and in order', () => {
    for (const seed of SEEDS) {
      const { notes, duration } = improvise(seeded(seed))
      expect(duration).toBeGreaterThan(1.5)
      expect(duration).toBeLessThan(6)
      let previous = -Infinity
      for (const note of notes) {
        expect(note.start).toBeGreaterThanOrEqual(previous)
        previous = note.start
        expect(note.start).toBeGreaterThanOrEqual(0)
        expect(note.start + note.duration).toBeLessThanOrEqual(duration + 1e-9)
        expect(note.velocity).toBeGreaterThan(0)
        expect(note.velocity).toBeLessThanOrEqual(1)
        expect(note.midi).toBeGreaterThanOrEqual(43)
        expect(note.midi).toBeLessThanOrEqual(86)
        if (note.key !== undefined) {
          expect(note.key).toBeGreaterThanOrEqual(0)
          expect(note.key).toBeLessThanOrEqual(1)
          // Keys land exactly on a step of the right hand's range.
          const step = note.key * (IMPROV_STEPS - 1)
          expect(Math.abs(step - Math.round(step))).toBeLessThan(1e-9)
        }
      }
    }
  })
})
