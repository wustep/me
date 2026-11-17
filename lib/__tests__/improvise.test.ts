import { describe, expect, it } from 'vitest'

import {
  IMPROV_KEYS,
  IMPROV_TEXTURES,
  improvise,
  type ImprovKey,
  type ImprovNote,
  type ImprovTexture,
  seededRandom
} from '../improvise'

const SEEDS = Array.from({ length: 120 }, (_, i) => i + 1)
const TONIC: Record<ImprovKey, number> = { E: 4, D: 2, B: 11 }
const MAJOR = new Set([0, 2, 4, 5, 7, 9, 11])

const mod12 = (n: number) => ((n % 12) + 12) % 12
const rightHand = (notes: ImprovNote[]) =>
  notes.filter((note) => note.key !== undefined)
const leftHand = (notes: ImprovNote[]) =>
  notes.filter((note) => note.key === undefined)
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
const averagePitch = (notes: ImprovNote[]) => mean(notes.map((n) => n.midi))

// Krumhansl–Kessler's major-key profile: how strongly each pitch class above
// the tonic says "this key".
const PROFILE = [
  6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88
]

function correlation(xs: number[], ys: number[]) {
  const mx = mean(xs)
  const my = mean(ys)
  let sum = 0
  let sx = 0
  let sy = 0
  for (const [i, x] of xs.entries()) {
    const y = ys[i]!
    sum += (x - mx) * (y - my)
    sx += (x - mx) ** 2
    sy += (y - my) ** 2
  }
  return sum / Math.sqrt(sx * sy)
}

/** The major key a piece's pitch classes, weighted by length, fit best. */
function keyCenter(notes: ImprovNote[]) {
  const weights = Array.from({ length: 12 }, () => 0)
  for (const note of notes) weights[mod12(note.midi)]! += note.duration
  let best = 0
  let bestScore = -Infinity
  for (let tonic = 0; tonic < 12; tonic++) {
    const profile = PROFILE.map((_, pc) => PROFILE[mod12(pc - tonic)]!)
    const score = correlation(weights, profile)
    if (score > bestScore) {
      best = tonic
      bestScore = score
    }
  }
  return best
}

/** The final chord: everything still held when the piece ends. */
function finalChord(notes: ImprovNote[], duration: number) {
  return notes
    .filter((note) => note.start + note.duration > duration - 0.5)
    .toSorted((a, b) => a.midi - b.midi)
}

describe('seededRandom', () => {
  it('repeats for a seed and stays in [0, 1)', () => {
    const a = seededRandom(42)
    const b = seededRandom(42)
    for (let i = 0; i < 1000; i++) {
      const value = a()
      expect(value).toBe(b())
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('improvise', () => {
  it('returns the same piece for the same seed (and key)', () => {
    expect(improvise(seededRandom(7))).toEqual(improvise(seededRandom(7)))
    for (const key of IMPROV_KEYS) {
      expect(improvise(seededRandom(7), { key })).toEqual(
        improvise(seededRandom(7), { key })
      )
    }
  })

  it('asking for the key or texture a seed would pick changes nothing', () => {
    for (const seed of SEEDS.slice(0, 20)) {
      const piece = improvise(seededRandom(seed))
      expect(
        improvise(seededRandom(seed), {
          key: piece.keyName,
          texture: piece.texture
        })
      ).toEqual(piece)
    }
  })

  it('returns a different piece for each seed', () => {
    const seeds = Array.from({ length: 300 }, (_, i) => i + 1)
    const pieces = new Set(
      seeds.map((seed) =>
        improvise(seededRandom(seed))
          .notes.map((note) => note.midi)
          .join(' ')
      )
    )
    expect(pieces.size).toBe(seeds.length)

    // Even in one key and texture, the tunes differ.
    const tunes = new Set(
      SEEDS.map((seed) =>
        rightHand(
          improvise(seededRandom(seed), { key: 'E', texture: 'waltz' }).notes
        )
          .slice(0, 12)
          .map((note) => note.midi)
          .join(' ')
      )
    )
    expect(tunes.size).toBeGreaterThan(SEEDS.length * 0.95)
  })

  it('plays in the key it is asked for', () => {
    for (const key of IMPROV_KEYS) {
      let centered = 0
      for (const seed of SEEDS.slice(0, 60)) {
        const { notes, duration, keyName } = improvise(seededRandom(seed), {
          key
        })
        expect(keyName).toBe(key)

        // Mostly in the major scale, with room for colour.
        let inKey = 0
        let total = 0
        for (const note of notes) {
          total += note.duration
          if (MAJOR.has(mod12(note.midi - TONIC[key]))) inKey += note.duration
        }
        expect(inKey / total).toBeGreaterThan(0.8)

        // It ends on the tonic, with a tonic-triad note on top.
        const chord = finalChord(notes, duration)
        expect(mod12(chord[0]!.midi - TONIC[key])).toBe(0)
        expect([0, 4, 7]).toContain(mod12(chord.at(-1)!.midi - TONIC[key]))

        if (keyCenter(notes) === TONIC[key]) centered++
      }
      // A key-finding profile hears the requested key nearly every time.
      expect(centered).toBeGreaterThanOrEqual(57)
    }
  })

  it('picks each key, and each texture, about evenly', () => {
    const keys = new Map<ImprovKey, number>()
    const textures = new Map<ImprovTexture, number>()
    const seeds = Array.from({ length: 600 }, (_, i) => i + 1)
    for (const seed of seeds) {
      const { keyName, texture } = improvise(seededRandom(seed))
      keys.set(keyName, (keys.get(keyName) ?? 0) + 1)
      textures.set(texture, (textures.get(texture) ?? 0) + 1)
    }
    for (const key of IMPROV_KEYS) {
      expect(keys.get(key)! / seeds.length).toBeGreaterThan(0.25)
      expect(keys.get(key)! / seeds.length).toBeLessThan(0.42)
    }
    for (const texture of IMPROV_TEXTURES) {
      expect(textures.get(texture)! / seeds.length).toBeGreaterThan(0.12)
    }
  })

  it('lasts half a minute to a minute', () => {
    for (const seed of SEEDS) {
      for (const texture of IMPROV_TEXTURES) {
        const { duration } = improvise(seededRandom(seed), { texture })
        expect(duration).toBeGreaterThanOrEqual(30)
        expect(duration).toBeLessThanOrEqual(60)
      }
    }
  })

  it('keeps notes in order, in range and in touch', () => {
    for (const seed of SEEDS) {
      const { notes, duration } = improvise(seededRandom(seed))
      let previous = -Infinity
      let lowest = Infinity
      let highest = -Infinity
      for (const note of notes) {
        expect(note.start).toBeGreaterThanOrEqual(previous)
        previous = note.start
        expect(note.start).toBeGreaterThanOrEqual(0)
        expect(note.duration).toBeGreaterThan(0)
        expect(note.start + note.duration).toBeLessThanOrEqual(duration + 1e-9)
        expect(note.velocity).toBeGreaterThan(0)
        expect(note.velocity).toBeLessThanOrEqual(1)
        expect(Number.isInteger(note.midi)).toBe(true)
        // Well inside the piano (21–108), and kind to a small speaker.
        expect(note.midi).toBeGreaterThanOrEqual(36)
        expect(note.midi).toBeLessThanOrEqual(96)
        if (note.key !== undefined) {
          expect(note.key).toBeGreaterThanOrEqual(0)
          expect(note.key).toBeLessThanOrEqual(1)
          lowest = Math.min(lowest, note.key)
          highest = Math.max(highest, note.key)
        }
      }
      // The right hand lights the whole phrase, end to end.
      expect(lowest).toBe(0)
      expect(highest).toBe(1)
    }
  })

  it('plays with two hands, enough for a real piece', () => {
    for (const seed of SEEDS) {
      const { notes } = improvise(seededRandom(seed))
      const left = leftHand(notes)
      const right = rightHand(notes)
      expect(notes.length).toBeGreaterThan(80)
      expect(left.length).toBeGreaterThan(30)
      expect(right.length).toBeGreaterThan(20)
      // The left hand sits under the right.
      expect(averagePitch(left)).toBeLessThan(averagePitch(right) - 7)
    }
  })

  it('never strikes a key that is still held', () => {
    for (const seed of SEEDS) {
      const { notes } = improvise(seededRandom(seed))
      const last = new Map<number, ImprovNote>()
      for (const note of notes) {
        const before = last.get(note.midi)
        if (before) {
          expect(before.start + before.duration).toBeLessThanOrEqual(
            note.start + 1e-9
          )
        }
        last.set(note.midi, note)
      }
    }
  })

  it('breathes: off the grid, with dynamics that move', () => {
    for (const seed of SEEDS) {
      const { notes, duration } = improvise(seededRandom(seed))

      // Onsets are humanized, not quantized to a few even steps.
      const gaps = new Set<number>()
      for (let i = 1; i < notes.length; i++) {
        const gap = notes[i]!.start - notes[i - 1]!.start
        if (gap > 0.03) gaps.add(Math.round(gap * 1000))
      }
      expect(gaps.size).toBeGreaterThan(30)

      // Loudness changes across the piece, and it ends softer than its peak.
      const windows = Array.from({ length: 5 }, () => ({ sum: 0, count: 0 }))
      for (const note of rightHand(notes)) {
        const window =
          windows[Math.min(4, Math.floor((note.start / duration) * 5))]!
        window.sum += note.velocity
        window.count++
      }
      const levels = windows
        .filter((window) => window.count > 0)
        .map((window) => window.sum / window.count)
      expect(Math.max(...levels) - Math.min(...levels)).toBeGreaterThan(0.03)
      expect(levels.at(-1)!).toBeLessThan(Math.max(...levels))
    }
  })

  it('plays every texture when asked', () => {
    for (const texture of IMPROV_TEXTURES) {
      for (const seed of SEEDS.slice(0, 20)) {
        const piece = improvise(seededRandom(seed), { texture })
        expect(piece.texture).toBe(texture)
        expect(piece.bpm).toBeGreaterThan(40)
        expect(piece.bpm).toBeLessThan(120)
        expect(leftHand(piece.notes).length).toBeGreaterThan(0)
        expect(rightHand(piece.notes).length).toBeGreaterThan(0)
      }
    }
  })

  it('rejects a key or texture it does not know', () => {
    expect(() => improvise(seededRandom(1), { key: 'F' as ImprovKey })).toThrow(
      RangeError
    )
    expect(() =>
      improvise(seededRandom(1), { texture: 'polka' as ImprovTexture })
    ).toThrow(RangeError)
  })
})
