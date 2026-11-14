/**
 * A short piano improvisation, generated fresh on every call.
 *
 * The right hand wanders a two-octave major pentatonic — every note of it
 * sits well over the left hand's open fifth, so a random walk cannot land on
 * a wrong note — and comes home to the root or the fifth at the end.
 *
 * Pure: pass a seeded `random` to get the same phrase back (the tests do).
 * Playing it is the caller's job; see components/wustep/PianoPhrase.tsx.
 */

export type ImprovNote = {
  /** MIDI note number. */
  midi: number
  /** Seconds from the start of the phrase. */
  start: number
  /** How long the key is held, in seconds. */
  duration: number
  /** 0–1. */
  velocity: number
  /**
   * Where the note sits across the right hand's range, 0 (lowest) to 1
   * (highest). `undefined` for the left hand, which has no key to light.
   */
  key?: number
}

export type ImprovPhrase = {
  notes: ImprovNote[]
  /** Seconds until the last key is released. */
  duration: number
}

// Major pentatonic, in semitones above the root.
const SCALE = [0, 2, 4, 7, 9]
// Right-hand range: two octaves of the scale plus the root on top.
export const IMPROV_STEPS = SCALE.length * 2 + 1
// Steps the phrase may end on: roots, then fifths.
const ROOT_STEPS = [0, 5, 10]
const FIFTH_STEPS = [3, 8]

function stepToMidi(root: number, step: number) {
  return (
    root + 12 * Math.floor(step / SCALE.length) + SCALE[step % SCALE.length]!
  )
}

function nearest(steps: number[], to: number) {
  let best = steps[0]!
  for (const step of steps) {
    if (Math.abs(step - to) < Math.abs(best - to)) best = step
  }
  return best
}

export function improvise(random: () => number = Math.random): ImprovPhrase {
  // Root between G3 and D4, so the melody tops out around C6.
  const root = 55 + Math.floor(random() * 8)
  // Length of an eighth note, in seconds.
  const beat = 0.15 + random() * 0.06
  const count = 8 + Math.floor(random() * 4)

  const notes: ImprovNote[] = []
  let step = 3 + Math.floor(random() * 4)
  let direction = random() < 0.5 ? -1 : 1
  let time = 0

  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1

    if (isLast) {
      // Come home: the nearest root, unless a fifth is clearly closer.
      const home = nearest(ROOT_STEPS, step)
      const fifth = nearest(FIFTH_STEPS, step)
      step = Math.abs(fifth - step) + 1 < Math.abs(home - step) ? fifth : home
    } else if (i > 0) {
      if (random() < 0.28) direction = -direction
      const roll = random()
      const size = roll < 0.68 ? 1 : roll < 0.92 ? 2 : 3
      step += direction * size
      // Bounce off the ends of the range.
      if (step < 0) {
        step = -step
        direction = 1
      } else if (step > IMPROV_STEPS - 1) {
        step = 2 * (IMPROV_STEPS - 1) - step
        direction = -1
      }
    }

    const roll = random()
    const beats = isLast ? 4 : roll < 0.58 ? 1 : roll < 0.9 ? 2 : 3
    const duration = beats * beat
    const midi = stepToMidi(root, step)
    const key = step / (IMPROV_STEPS - 1)
    // Longer notes lean in a little; everything else varies by touch.
    const velocity = Math.min(1, 0.55 + random() * 0.3 + (beats > 1 ? 0.1 : 0))

    // An occasional grace note: a quick slide in from the semitone below.
    if (i > 0 && !isLast && random() < 0.14) {
      notes.push({
        midi: midi - 1,
        start: time - 0.07,
        duration: 0.07,
        velocity: velocity * 0.5,
        key
      })
    }

    notes.push({ midi, start: time, duration, velocity, key })
    time += duration
  }

  // Left hand: an open fifth under the opening, and the root again under
  // the final note.
  const last = notes.at(-1)!
  notes.push(
    { midi: root - 12, start: 0, duration: time, velocity: 0.42 },
    { midi: root - 5, start: 0, duration: time, velocity: 0.34 },
    {
      midi: root - 12,
      start: last.start,
      duration: last.duration,
      velocity: 0.36
    }
  )

  notes.sort((a, b) => a.start - b.start)
  return { notes, duration: time }
}
