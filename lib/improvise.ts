/**
 * A short solo-piano piece, composed fresh on every call: 30 to 60 seconds
 * in E, D or B major, with a left-hand accompaniment under a right-hand
 * melody, a form that sets out, wanders and comes home, and the small
 * unevenness of a person playing.
 *
 * Nothing is borrowed note for note. Each piece rolls a texture, and with it
 * a handful of habits from a few pianists' toolkits:
 *
 * - waltz: a sparse slow-waltz left hand (a low bass, then a soft chord off
 *   the beat) under a plain, modal melody with lots of air.
 * - arpeggio: one broken-chord cell, repeated, that fills in and climbs as
 *   the piece builds over a clear pulse.
 * - loop: a gentle repeated right-hand figure, voice-led through warm major
 *   harmony, that a melody grows out of.
 * - planing: chord shapes sliding in parallel under the melody, added-sixth
 *   and ninth colour, pentatonic and whole-tone touches, a deep pedal bass.
 * - neosoul: rolled ninths and elevenths, upper-structure dyads, rubato,
 *   grace notes and quick fills.
 *
 * The contrasting middle may borrow another texture's left or right hand, and
 * colour (a mixolydian ♭VII, a borrowed iv or ♭VI, applied dominants, an
 * augmented V) is switched on piece by piece. The harmony comes from a small
 * grammar with real cadences; the melody from a motif that is stated,
 * answered, sequenced and brought back.
 *
 * Pure: pass a seeded `random` to get the same piece back (the tests do).
 * Playing it is the caller's job; see components/wustep/PianoPhrase.tsx.
 */

export type ImprovNote = {
  /** MIDI note number. */
  midi: number
  /** Seconds from the start of the piece. */
  start: number
  /**
   * How long the key, or the sustain pedal, holds the note, in seconds. The
   * voice lets a note ring at least this long.
   */
  duration: number
  /** 0–1. */
  velocity: number
  /**
   * Where the note sits across the right hand's range, 0 (lowest) to 1
   * (highest). `undefined` for the left hand, which has no key to light.
   */
  key?: number
}

export type ImprovKey = 'E' | 'D' | 'B'

export type ImprovTexture =
  | 'waltz'
  | 'arpeggio'
  | 'loop'
  | 'planing'
  | 'neosoul'

export type ImprovPhrase = {
  notes: ImprovNote[]
  /** Seconds until the last key is released. */
  duration: number
  /** The major key the piece is in. */
  keyName: ImprovKey
  /** The texture the piece leads with. */
  texture: ImprovTexture
  /** Beats per minute, before rubato. */
  bpm: number
}

export type ImproviseOptions = {
  /** Play in this key rather than a random one of the three. */
  key?: ImprovKey
  /** Lead with this texture rather than a random one. */
  texture?: ImprovTexture
}

export const IMPROV_KEYS: readonly ImprovKey[] = ['E', 'D', 'B']

export const IMPROV_TEXTURES: readonly ImprovTexture[] = [
  'waltz',
  'arpeggio',
  'loop',
  'planing',
  'neosoul'
]

/** A small seeded PRNG (mulberry32): the same seed gives the same piece. */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d_2b_79_f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

// ---------------------------------------------------------------------------
// Dice
// ---------------------------------------------------------------------------

type Dice = {
  chance: (p: number) => boolean
  between: (lo: number, hi: number) => number
  int: (lo: number, hi: number) => number
  pick: <T>(items: readonly T[]) => T
  /** One of `items`, each as likely as its weight. */
  weighted: <T>(items: readonly T[], weights: readonly number[]) => T
  /** One of a record's keys, each as likely as its value. */
  choose: <K extends string>(weights: Partial<Record<K, number>>) => K
  /** Roughly normal: mean 0, standard deviation `spread`, never past 3×. */
  jitter: (spread: number) => number
}

function makeDice(random: () => number): Dice {
  const next = () => {
    const value = random()
    return value >= 0 && value < 1 ? value : 0
  }
  const weighted = <T>(items: readonly T[], weights: readonly number[]) => {
    let total = 0
    for (const weight of weights) total += Math.max(0, weight)
    let roll = next() * total
    for (const [i, item] of items.entries()) {
      roll -= Math.max(0, weights[i] ?? 0)
      if (roll < 0) return item
    }
    return items.at(-1)!
  }
  return {
    chance: (p) => next() < p,
    between: (lo, hi) => lo + next() * (hi - lo),
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (items) => items[Math.floor(next() * items.length)]!,
    weighted,
    choose: (weights) => {
      const keys = Object.keys(weights) as Array<keyof typeof weights>
      return weighted(
        keys,
        keys.map((key) => weights[key] ?? 0)
      )
    },
    jitter: (spread) => (next() + next() + next() - 1.5) * 2 * spread
  }
}

const mod = (n: number, m: number) => ((n % m) + m) % m
const clamp = (x: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, x))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const anything = () => true

/** Whether two pitch classes are a step (one or two semitones) apart. */
function isStep(from: number, to: number) {
  const gap = mod(to - from, 12)
  return gap !== 0 && Math.min(gap, 12 - gap) <= 2
}

// ---------------------------------------------------------------------------
// Harmony
// ---------------------------------------------------------------------------

/** Pitch class of each key's tonic. */
const TONIC: Record<ImprovKey, number> = { E: 4, D: 2, B: 11 }

// Seven-note modes, in semitones above the tonic, one entry per scale
// degree. The melody reads its notes through the mode of the chord under it,
// so a borrowed chord bends the tune with it.
const MAJOR = [0, 2, 4, 5, 7, 9, 11]
const MIXOLYDIAN = [0, 2, 4, 5, 7, 9, 10] // ♭7, under ♭VII and V/IV
const HARMONIC_MAJOR = [0, 2, 4, 5, 7, 8, 11] // ♭6, under the borrowed iv
const AEOLIAN = [0, 2, 3, 5, 7, 8, 10] // under the borrowed ♭VI
const TOWARD_VI = [0, 2, 4, 5, 8, 9, 11] // ♯5, under V/vi
const LYDIAN = [0, 2, 4, 6, 7, 9, 11] // ♯4, under V/V
const TOWARD_II = [1, 2, 4, 5, 7, 9, 11] // ♯1, under V/ii
const WHOLE_TONE = [-1, 1, 3, 5, 7, 9, 11] // under the augmented V

// Chord kinds: semitones above the root, the root first and then the most
// characteristic tones, so a voicing of n notes takes the first n after it.
const MAJ = [0, 4, 7]
const ADD9 = [0, 4, 14, 7]
const MAJ7 = [0, 4, 11, 7]
const MAJ9 = [0, 4, 11, 14, 7]
const SIX9 = [0, 4, 9, 14, 7]
const MAJ9_SHARP11 = [0, 4, 11, 18, 14]
const MIN = [0, 3, 7]
const MIN7 = [0, 3, 10, 7]
const MIN9 = [0, 3, 10, 14, 7]
const MIN11 = [0, 3, 10, 17, 14]
const MIN7_11 = [0, 3, 10, 17, 7]
const MIN6 = [0, 3, 9, 7]
const MIN_ADD9 = [0, 3, 14, 7]
const DOM7 = [0, 4, 10, 7]
const DOM9 = [0, 4, 10, 14, 7]
const DOM13 = [0, 4, 10, 21, 14]
const SUS9 = [0, 5, 10, 14, 7]
const SUS13 = [0, 5, 10, 21, 14]
const AUG9 = [0, 4, 10, 8, 14]

type Flavour = 'plain' | 'lush' | 'jazzy'
type Colour = 'mixolydian' | 'mixture' | 'applied' | 'wholeTone'
type Degree =
  | 'I'
  | 'ii'
  | 'iii'
  | 'IV'
  | 'V'
  | 'vi'
  | 'bVII'
  | 'iv'
  | 'bVI'
  | 'V/vi'
  | 'V/V'
  | 'V/IV'
  | 'V/ii'
  | 'V+'

type DegreeSpec = {
  /** Semitones above the tonic. */
  root: number
  mode: readonly number[]
  /** Only in pieces that have this colour switched on. */
  colour?: Colour
  /** Kinds of chord to voice it as, by how rich the piece's harmony is. */
  kinds: Record<Flavour, ReadonlyArray<readonly number[]>>
}

const DEGREES: Record<Degree, DegreeSpec> = {
  I: {
    root: 0,
    mode: MAJOR,
    kinds: {
      plain: [ADD9, MAJ, MAJ7],
      lush: [MAJ9, SIX9, ADD9],
      jazzy: [MAJ9, SIX9]
    }
  },
  ii: {
    root: 2,
    mode: MAJOR,
    kinds: { plain: [MIN7, MIN], lush: [MIN9, MIN7], jazzy: [MIN9, MIN11] }
  },
  iii: {
    root: 4,
    mode: MAJOR,
    kinds: { plain: [MIN, MIN7], lush: [MIN7], jazzy: [MIN7, MIN7_11] }
  },
  IV: {
    root: 5,
    mode: MAJOR,
    kinds: {
      plain: [MAJ, ADD9, MAJ7],
      lush: [MAJ7, MAJ9, SIX9],
      jazzy: [MAJ9, MAJ9_SHARP11]
    }
  },
  V: {
    root: 7,
    mode: MAJOR,
    kinds: {
      plain: [MAJ, ADD9, DOM7],
      lush: [SUS9, DOM9, ADD9],
      jazzy: [SUS13, DOM13, SUS9]
    }
  },
  vi: {
    root: 9,
    mode: MAJOR,
    kinds: {
      plain: [MIN, MIN7],
      lush: [MIN9, MIN7, MIN_ADD9],
      jazzy: [MIN9, MIN11]
    }
  },
  bVII: {
    root: 10,
    mode: MIXOLYDIAN,
    colour: 'mixolydian',
    kinds: { plain: [MAJ, ADD9], lush: [ADD9, MAJ7], jazzy: [MAJ9, ADD9] }
  },
  iv: {
    root: 5,
    mode: HARMONIC_MAJOR,
    colour: 'mixture',
    kinds: {
      plain: [MIN, MIN_ADD9],
      lush: [MIN6, MIN_ADD9],
      jazzy: [MIN6, MIN_ADD9]
    }
  },
  bVI: {
    root: 8,
    mode: AEOLIAN,
    colour: 'mixture',
    kinds: { plain: [MAJ, ADD9], lush: [MAJ7, ADD9], jazzy: [MAJ7, MAJ9] }
  },
  'V/vi': {
    root: 4,
    mode: TOWARD_VI,
    colour: 'applied',
    kinds: { plain: [MAJ, DOM7], lush: [DOM7], jazzy: [DOM7] }
  },
  'V/V': {
    root: 2,
    mode: LYDIAN,
    colour: 'applied',
    kinds: { plain: [MAJ, DOM7], lush: [DOM9, DOM7], jazzy: [DOM13, DOM9] }
  },
  'V/IV': {
    root: 0,
    mode: MIXOLYDIAN,
    colour: 'applied',
    kinds: { plain: [DOM7], lush: [DOM9], jazzy: [DOM13, DOM9] }
  },
  'V/ii': {
    root: 9,
    mode: TOWARD_II,
    colour: 'applied',
    kinds: { plain: [MAJ, DOM7], lush: [DOM7], jazzy: [DOM9, DOM7] }
  },
  'V+': {
    root: 7,
    mode: WHOLE_TONE,
    colour: 'wholeTone',
    kinds: { plain: [AUG9], lush: [AUG9], jazzy: [AUG9] }
  }
}

/** Where each chord tends to go next, before a texture's taste. */
const NEXT: Record<Degree, Partial<Record<Degree, number>>> = {
  I: {
    IV: 3,
    vi: 2.4,
    ii: 1.4,
    iii: 0.7,
    V: 1.2,
    bVII: 1,
    'V/vi': 0.8,
    'V/IV': 0.7,
    bVI: 0.5,
    iv: 0.4
  },
  ii: { V: 3, IV: 0.6, vi: 0.5, iii: 0.6, 'V/V': 0.5, I: 0.4 },
  iii: { vi: 2, IV: 2, ii: 1 },
  IV: { I: 2, V: 1.8, ii: 1, iv: 1.2, vi: 1, iii: 0.6, bVII: 0.6, 'V/V': 0.6 },
  V: { I: 3, vi: 1.4, IV: 0.9, iii: 0.4 },
  vi: { IV: 2.4, ii: 2, V: 1, iii: 0.8, I: 0.4, 'V/V': 0.5, 'V/ii': 0.5 },
  bVII: { I: 2, IV: 1.5, iv: 0.6 },
  iv: { I: 3, bVII: 0.8, V: 0.6 },
  bVI: { bVII: 1.5, V: 1, I: 0.8, iv: 1 },
  'V/vi': { vi: 1 },
  'V/V': { V: 1 },
  'V/IV': { IV: 1 },
  'V/ii': { ii: 1 },
  'V+': { I: 1 }
}

/** Chords that must resolve to one particular chord. */
const RESOLVES: Partial<Record<Degree, Degree>> = {
  'V/vi': 'vi',
  'V/V': 'V',
  'V/IV': 'IV',
  'V/ii': 'ii',
  'V+': 'I'
}

type Chord = {
  degree: Degree
  /** Semitones above the tonic. */
  root: number
  /** Pitch class in the bass, in semitones above the tonic. */
  bass: number
  tones: readonly number[]
  mode: readonly number[]
  /** Chord tones plus the tensions a melody may rest on, above the tonic. */
  stable: ReadonlySet<number>
}

function makeChord(degree: Degree, tones: readonly number[]): Chord {
  const { root, mode } = DEGREES[degree]
  const pcs = new Set(tones.map((interval) => mod(root + interval, 12)))
  const scale = new Set(mode.map((step) => mod(step, 12)))
  // A melody may lean on a ninth and a sixth over a major chord, a ninth and
  // an eleventh over a minor one, as long as the mode has them and they are
  // not a semitone above a chord tone.
  const tensions = tones.includes(3) ? [2, 5] : tones.includes(8) ? [] : [2, 9]
  const stable = new Set(pcs)
  for (const tension of tensions) {
    const pc = mod(root + tension, 12)
    if (scale.has(pc) && !pcs.has(mod(pc - 1, 12))) stable.add(pc)
  }
  return { degree, root, bass: root, tones, mode, stable }
}

// ---------------------------------------------------------------------------
// Textures and form
// ---------------------------------------------------------------------------

type Role = 'intro' | 'A' | 'A2' | 'B' | 'B2' | 'R' | 'coda'
type Cadence = 'authentic' | 'plagal' | 'half' | 'deceptive' | 'open'
type LeftMode = 'waltz' | 'arpeggio' | 'pulse' | 'deep' | 'shell'
type RightMode = 'melody' | 'figure' | 'planing' | 'upper'
type Borrowing = 'none' | LeftMode | 'planing'
type Dynamics = 'arc' | 'valley' | 'swell'

/** What a contrasting section takes from another texture. */
const BORROWINGS: Record<Borrowing, { left?: LeftMode; right?: RightMode }> = {
  none: {},
  waltz: { left: 'waltz' },
  arpeggio: { left: 'arpeggio' },
  pulse: { left: 'pulse' },
  deep: { left: 'deep' },
  shell: { left: 'shell' },
  planing: { right: 'planing' }
}

type TextureSpec = {
  /** Chance of four beats to the bar rather than three. */
  fourFour: number
  /** Seconds per beat. */
  beat: readonly [number, number]
  /** 0–1: how far the tempo bends. */
  rubato: number
  /** Beats an off-beat eighth is held back. */
  swing: number
  /** Seconds the melody sits behind the beat. */
  lag: number
  left: LeftMode
  right: RightMode
  flavours: Partial<Record<Flavour, number>>
  /** Chance each colour is switched on for a piece. */
  colours: Record<Colour, number>
  /** Multipliers on NEXT. */
  taste: Partial<Record<Degree, number>>
  /** Weight for keeping a chord another bar. */
  hold: number
  /** Two chords to a bar now and then. */
  splits: boolean
  /** Chance a closing cadence is V–I rather than plagal. */
  authentic: number
  /** How busy the melody is, 0–1. */
  density: readonly [number, number]
  introBars: readonly [number, number]
  /** What the contrasting middle may borrow. */
  borrow: Partial<Record<Borrowing, number>>
  /** Chance of a tonic pedal under the opening. */
  pedal: number
  /** Chance of a first-inversion chord where it smooths the bass. */
  inversions: number
  /** Chance of a grace note or turn on a long note. */
  ornament: number
  /** Chance of a quick run at the end of a phrase. */
  fills: number
  /** Chance the opening melody keeps to the pentatonic. */
  pentatonic: number
}

const TEXTURES: Record<ImprovTexture, TextureSpec> = {
  waltz: {
    fourFour: 0,
    beat: [0.62, 0.8],
    rubato: 0.3,
    swing: 0,
    lag: 0,
    left: 'waltz',
    right: 'melody',
    flavours: { plain: 0.6, lush: 0.4 },
    colours: { mixolydian: 0.35, mixture: 0.2, applied: 0.15, wholeTone: 0 },
    taste: { iii: 1.6, ii: 1.3, V: 0.35, vi: 1.2, IV: 1.1 },
    hold: 0.5,
    splits: false,
    authentic: 0.4,
    density: [0.1, 0.35],
    introBars: [2, 2],
    borrow: { none: 0.4, arpeggio: 0.35, planing: 0.25 },
    pedal: 0.15,
    inversions: 0.25,
    ornament: 0.04,
    fills: 0.05,
    pentatonic: 0.3
  },
  arpeggio: {
    fourFour: 0.7,
    beat: [0.66, 0.84],
    rubato: 0.15,
    swing: 0,
    lag: 0,
    left: 'arpeggio',
    right: 'melody',
    flavours: { plain: 0.7, lush: 0.3 },
    colours: { mixolydian: 0.25, mixture: 0.25, applied: 0.2, wholeTone: 0 },
    taste: { vi: 1.5, IV: 1.3, iii: 1.2, ii: 0.8 },
    hold: 0.2,
    splits: false,
    authentic: 0.6,
    density: [0.25, 0.5],
    introBars: [1, 2],
    borrow: { none: 0.5, planing: 0.25, pulse: 0.25 },
    pedal: 0.3,
    inversions: 0.5,
    ornament: 0.03,
    fills: 0.08,
    pentatonic: 0.25
  },
  loop: {
    fourFour: 0.75,
    beat: [0.6, 0.76],
    rubato: 0.15,
    swing: 0,
    lag: 0,
    left: 'pulse',
    right: 'figure',
    flavours: { plain: 0.5, lush: 0.5 },
    colours: { mixolydian: 0.45, mixture: 0.3, applied: 0.25, wholeTone: 0 },
    taste: { IV: 1.4, vi: 1.2, ii: 1.2, bVII: 1.3 },
    hold: 0.2,
    splits: false,
    authentic: 0.5,
    density: [0.1, 0.3],
    introBars: [1, 2],
    borrow: { none: 0.4, arpeggio: 0.4, deep: 0.2 },
    pedal: 0.35,
    inversions: 0.5,
    ornament: 0.04,
    fills: 0.1,
    pentatonic: 0.4
  },
  planing: {
    fourFour: 0.7,
    beat: [0.78, 0.98],
    rubato: 0.5,
    swing: 0,
    lag: 0.008,
    left: 'deep',
    right: 'planing',
    flavours: { lush: 0.7, jazzy: 0.3 },
    colours: { mixolydian: 0.55, mixture: 0.45, applied: 0.25, wholeTone: 0.5 },
    taste: { bVII: 1.5, bVI: 1.5, iv: 1.3, ii: 1.2, iii: 1.2 },
    hold: 0.35,
    splits: true,
    authentic: 0.45,
    density: [0.25, 0.5],
    introBars: [0, 1],
    borrow: { none: 0.45, shell: 0.3, arpeggio: 0.25 },
    pedal: 0.45,
    inversions: 0.2,
    ornament: 0.1,
    fills: 0.3,
    pentatonic: 0.5
  },
  neosoul: {
    fourFour: 1,
    beat: [0.8, 0.98],
    rubato: 0.5,
    swing: 0.06,
    lag: 0.014,
    left: 'shell',
    right: 'upper',
    flavours: { jazzy: 0.8, lush: 0.2 },
    colours: { mixolydian: 0.4, mixture: 0.6, applied: 0.7, wholeTone: 0.2 },
    taste: { ii: 1.6, iv: 1.5, 'V/vi': 1.4, 'V/ii': 1.5, 'V/V': 1.4, bVI: 1.3 },
    hold: 0.1,
    splits: true,
    authentic: 0.7,
    density: [0.3, 0.55],
    introBars: [0, 1],
    borrow: { none: 0.5, planing: 0.35, arpeggio: 0.15 },
    pedal: 0.1,
    inversions: 0.3,
    ornament: 0.18,
    fills: 0.6,
    pentatonic: 0.2
  }
}

/** Phrases, by how many fit. */
const FORMS: Record<number, readonly Role[]> = {
  3: ['A', 'B', 'R'],
  4: ['A', 'A2', 'B', 'R'],
  5: ['A', 'A2', 'B', 'B2', 'R']
}

/** How a phrase that doesn't close the piece may end. */
const CADENCES: Record<'A' | 'B' | 'B2', Partial<Record<Cadence, number>>> = {
  A: { half: 0.5, open: 0.25, deceptive: 0.25 },
  B: { half: 0.45, deceptive: 0.3, open: 0.25 },
  B2: { half: 0.6, deceptive: 0.4 }
}

/** Loudness at the start and end of each section, per dynamic shape. */
const LEVELS: Record<Dynamics, Record<Role, readonly [number, number]>> = {
  // Builds to the middle, then a quieter return.
  arc: {
    intro: [0.76, 0.8],
    A: [0.85, 0.92],
    A2: [0.92, 1],
    B: [1, 1.16],
    B2: [1.12, 1.2],
    R: [0.96, 0.84],
    coda: [0.76, 0.64]
  },
  // A quieter middle, then a fuller return.
  valley: {
    intro: [0.82, 0.86],
    A: [0.96, 1],
    A2: [0.98, 0.92],
    B: [0.76, 0.82],
    B2: [0.84, 0.98],
    R: [1.05, 0.92],
    coda: [0.8, 0.64]
  },
  // One long crescendo, let go at the very end.
  swell: {
    intro: [0.7, 0.74],
    A: [0.76, 0.84],
    A2: [0.86, 0.96],
    B: [0.98, 1.08],
    B2: [1.08, 1.18],
    R: [1.12, 0.96],
    coda: [0.8, 0.62]
  }
}

/** How busy the accompaniment is in each section, per dynamic shape. */
const ENERGY: Record<Dynamics, Record<Role, number>> = {
  arc: { intro: 0.2, A: 0.3, A2: 0.45, B: 0.7, B2: 0.9, R: 0.35, coda: 0.15 },
  valley: {
    intro: 0.25,
    A: 0.45,
    A2: 0.5,
    B: 0.3,
    B2: 0.5,
    R: 0.6,
    coda: 0.15
  },
  swell: { intro: 0.15, A: 0.25, A2: 0.4, B: 0.6, B2: 0.8, R: 0.75, coda: 0.15 }
}

type Section = {
  role: Role
  /** First bar. */
  bar: number
  bars: number
  cadence: Cadence
  left: LeftMode
  right: RightMode
  /** Whether the right hand has a melody here. */
  melody: boolean
  /** 0–1: how busy the accompaniment is. */
  energy: number
  levels: readonly [number, number]
  /** A tonic pedal under the first two bars. */
  pedal: boolean
  /** Whether this is the last phrase before the coda. */
  final: boolean
}

type Plan = {
  texture: ImprovTexture
  spec: TextureSpec
  /** Pitch class of the tonic. */
  tonic: number
  /** MIDI note of the melody's home tonic. */
  home: number
  meter: 3 | 4
  /** Seconds per beat. */
  beat: number
  flavour: Flavour
  colours: ReadonlySet<Colour>
  sections: Section[]
  bars: number
  coda: 'hold' | 'echo' | 'tag'
  pentatonic: boolean
  density: number
}

function planPiece(d: Dice, keyName: ImprovKey, texture: ImprovTexture): Plan {
  const spec = TEXTURES[texture]
  const tonic = TONIC[keyName]
  const meter = d.chance(spec.fourFour) ? 4 : 3
  const flavour = d.choose(spec.flavours)
  const colours = new Set<Colour>()
  for (const colour of Object.keys(spec.colours) as Colour[]) {
    if (d.chance(spec.colours[colour])) colours.add(colour)
  }
  const dynamics = d.choose<Dynamics>({ arc: 0.45, valley: 0.25, swell: 0.3 })
  const closing = (): Cadence =>
    d.chance(spec.authentic) ? 'authentic' : 'plagal'

  // Seconds of music before the last chord rings out; the tempo bends to
  // land near it with whole four-bar phrases.
  const target = d.between(36, 50)
  const stretch = 1 + spec.rubato * 0.12
  const intro = d.int(spec.introBars[0], spec.introBars[1])
  const coda = d.choose<Plan['coda']>({ hold: 0.4, echo: 0.35, tag: 0.25 })
  const codaBars = coda === 'hold' ? 1 : 2
  const preferred = d.between(spec.beat[0], spec.beat[1])
  const fits = (target / (meter * preferred * stretch) - intro - codaBars) / 4
  // At least three phrases, for somewhere to go and come back from.
  const roles = FORMS[clamp(Math.round(fits), 3, 5)]!
  const borrowed = BORROWINGS[d.choose(spec.borrow)]

  const sections: Section[] = []
  let bar = 0
  const add = (role: Role, bars: number, extra: Partial<Section>) => {
    sections.push({
      role,
      bar,
      bars,
      cadence: 'authentic',
      left: spec.left,
      right: spec.right,
      melody: true,
      energy: ENERGY[dynamics][role],
      levels: LEVELS[dynamics][role],
      pedal: false,
      final: false,
      ...extra
    })
    bar += bars
  }
  if (intro > 0) add('intro', intro, { melody: false })
  const pedal = d.chance(spec.pedal)
  for (const [index, role] of roles.entries()) {
    const final = index === roles.length - 1
    const contrast = role === 'B' || role === 'B2'
    add(role, final && d.chance(0.3) ? 5 : 4, {
      cadence:
        final || role === 'A2'
          ? closing()
          : d.choose(CADENCES[role as keyof typeof CADENCES]),
      ...(contrast ? borrowed : {}),
      // The loop sometimes lets its figure play alone before a tune joins.
      melody: !(spec.right === 'figure' && role === 'A' && d.chance(0.4)),
      pedal: !contrast && pedal,
      final
    })
  }
  add('coda', codaBars, { melody: false })

  const beat = clamp(
    target / (bar * meter * stretch),
    spec.beat[0] * 0.88,
    spec.beat[1] * 1.12
  )

  return {
    texture,
    spec,
    tonic,
    // The tonic between A4 and E5.
    home: 69 + mod(tonic - 9, 12),
    meter,
    beat,
    flavour,
    colours,
    sections,
    bars: bar,
    coda,
    pentatonic: d.chance(spec.pentatonic),
    density: d.between(spec.density[0], spec.density[1])
  }
}

// ---------------------------------------------------------------------------
// Chord progression
// ---------------------------------------------------------------------------

type Span = {
  /** Beats from the top. */
  beat: number
  len: number
  chord: Chord
  section: Section
}

function nextDegree(
  d: Dice,
  plan: Plan,
  from: Degree,
  history: Degree[],
  ahead?: Degree,
  avoid?: Degree
): Degree {
  const resolution = RESOLVES[from]
  if (resolution) return resolution

  const n = history.length
  const items: Degree[] = []
  const weights: number[] = []
  for (const [to, weight] of Object.entries(NEXT[from]) as Array<
    [Degree, number]
  >) {
    const { colour } = DEGREES[to]
    if (colour && !plan.colours.has(colour)) continue
    if (to === avoid) continue
    // No A–B–A–B vamps, counting the chord already fixed ahead.
    if (n >= 3 && to === history[n - 2] && history[n - 1] === history[n - 3]) {
      continue
    }
    if (n >= 2 && to === history[n - 2] && ahead === history[n - 1]) continue
    // An applied chord has to land on its target.
    const target = RESOLVES[to]
    if (target && ahead !== undefined && target !== ahead) continue
    let w = weight * (plan.spec.taste[to] ?? 1) * (colour ? 1.6 : 1)
    if (ahead !== undefined) {
      w *= to === ahead ? 0.15 : NEXT[to][ahead] ? 1.6 : 0.6
    }
    items.push(to)
    weights.push(w)
  }
  // Satie-like textures hold a chord for a second bar now and then.
  if (plan.spec.hold > 0 && history[n - 1] !== history[n - 2]) {
    items.push(from)
    weights.push(plan.spec.hold * (ahead === from ? 0.2 : 1))
  }
  return items.length > 0 ? d.weighted(items, weights) : (ahead ?? 'I')
}

function cadenceDegrees(
  d: Dice,
  plan: Plan,
  cadence: Cadence
): [Degree[] | undefined, Degree] {
  const { colours, spec } = plan
  switch (cadence) {
    case 'authentic': {
      const dominant: Degree =
        colours.has('wholeTone') && d.chance(0.5) ? 'V+' : 'V'
      return [spec.splits && d.chance(0.5) ? ['ii', dominant] : [dominant], 'I']
    }
    case 'plagal': {
      const subdominant: Degree =
        colours.has('mixture') && d.chance(0.6)
          ? 'iv'
          : colours.has('mixolydian') && d.chance(0.4)
            ? 'bVII'
            : 'IV'
      return [[subdominant], 'I']
    }
    case 'half':
      return [undefined, 'V']
    case 'deceptive':
      return [['V'], 'vi']
    case 'open':
      return [undefined, 'IV']
  }
}

function phraseDegrees(
  d: Dice,
  plan: Plan,
  section: Section,
  previous: Degree,
  history: Degree[],
  opening?: Degree[][]
): Degree[][] {
  const length = section.bars
  const bars: Array<Degree[] | undefined> = Array.from({ length })
  const [approach, arrival] = cadenceDegrees(d, plan, section.cadence)
  bars[length - 1] = [arrival]
  if (approach) bars[length - 2] = approach

  if (opening) {
    // Answer the opening phrase with its first bars, unless that would leave
    // an applied chord hanging.
    for (const [i, degrees] of opening.entries()) {
      if (bars[i] !== undefined) break
      const target = RESOLVES[degrees.at(-1)!]
      const following = bars[i + 1]?.[0]
      if (target && following !== undefined && following !== target) break
      bars[i] = [...degrees]
    }
  }
  if (bars[0] === undefined) {
    if (section.role === 'A') {
      bars[0] = ['I']
    } else {
      const options: Partial<Record<Degree, number>> = {
        vi: 3,
        IV: 2.5,
        ii: 1.5,
        iii: 1,
        bVI: plan.colours.has('mixture') ? 1.5 : 0,
        bVII: plan.colours.has('mixolydian') ? 1.5 : 0
      }
      delete options[previous]
      bars[0] = [d.choose(options)]
    }
  }

  let before = previous
  for (let i = 0; i < length; i++) {
    const fixed = bars[i]
    if (fixed) {
      history.push(...fixed)
      before = fixed.at(-1)!
      continue
    }
    const ahead = bars[i + 1]?.[0]
    // Satie's waltz rocks between I and IV; don't open with that rocking.
    const avoid =
      plan.texture === 'waltz' && section.role === 'A' && i === 1
        ? 'IV'
        : undefined
    if (plan.spec.splits && d.chance(0.18)) {
      const first = nextDegree(d, plan, before, history)
      history.push(first)
      const second = nextDegree(d, plan, first, history, ahead)
      history.push(second)
      bars[i] = first === second ? [first] : [first, second]
      before = second
    } else {
      const degree = nextDegree(d, plan, before, history, ahead, avoid)
      history.push(degree)
      bars[i] = [degree]
      before = degree
    }
  }

  // A two-chord bar that starts on the chord already sounding is one chord.
  for (let i = 1; i < length; i++) {
    const inBar = bars[i]!
    if (inBar.length > 1 && inBar[0] === bars[i - 1]!.at(-1)) {
      bars[i] = inBar.slice(1)
    }
  }
  return bars as Degree[][]
}

function composeHarmony(d: Dice, plan: Plan): Span[] {
  const { meter, sections, flavour, spec } = plan

  const history: Degree[] = []
  const degreesBySection = new Map<Section, Degree[][]>()
  let a: Degree[][] | undefined
  let b: Degree[][] | undefined
  let previous: Degree = 'I'
  for (const section of sections) {
    if (section.role === 'intro' || section.role === 'coda') continue
    const opening =
      section.role === 'A2' || section.role === 'R'
        ? a?.slice(0, 2)
        : section.role === 'B2'
          ? b?.slice(0, 2)
          : undefined
    const degrees = phraseDegrees(d, plan, section, previous, history, opening)
    degreesBySection.set(section, degrees)
    if (section.role === 'A') a = degrees
    if (section.role === 'B') b = degrees
    previous = degrees.at(-1)!.at(-1)!
  }

  for (const section of sections) {
    if (section.role === 'intro') {
      // The intro previews the opening chords; the waltz vamps on the tonic.
      degreesBySection.set(
        section,
        Array.from({ length: section.bars }, (_, i) =>
          plan.texture === 'waltz' ? ['I'] : [...(a?.[i] ?? ['I'])]
        )
      )
    } else if (section.role === 'coda') {
      const tag: Degree =
        plan.colours.has('mixture') && d.chance(0.5)
          ? 'iv'
          : plan.colours.has('mixolydian') && d.chance(0.5)
            ? 'bVII'
            : 'IV'
      degreesBySection.set(
        section,
        section.bars === 1
          ? [['I']]
          : [[plan.coda === 'tag' ? tag : 'I'], ['I']]
      )
    }
  }

  // Each chord keeps one voicing for the piece, now and then another.
  const kinds = new Map<Degree, readonly number[]>()
  const kindOf = (degree: Degree) => {
    const options = DEGREES[degree].kinds[flavour]
    let kind = kinds.get(degree)
    if (!kind) {
      kind = d.pick(options)
      kinds.set(degree, kind)
    }
    return d.chance(0.25) ? d.pick(options) : kind
  }

  const spans: Span[] = []
  for (const section of sections) {
    const degrees = degreesBySection.get(section)!
    for (let k = 0; k < section.bars; k++) {
      const bar = section.bar + k
      const inBar = degrees[k]!
      const first = inBar.length > 1 ? Math.ceil(meter / 2) : meter
      for (const [j, degree] of inBar.entries()) {
        spans.push({
          beat: bar * meter + (j === 0 ? 0 : first),
          len: j === 0 ? first : meter - first,
          chord: makeChord(degree, kindOf(degree)),
          section
        })
      }
    }
  }

  // The last chord gets the most colour.
  spans.at(-1)!.chord = makeChord(
    'I',
    flavour === 'plain'
      ? ADD9
      : d.pick(flavour === 'lush' ? [SIX9, MAJ9, ADD9] : [MAJ9, SIX9])
  )

  // A tonic pedal under the opening bars.
  for (const span of spans) {
    const { section } = span
    if (
      section.pedal &&
      span.beat < (section.bar + 2) * meter &&
      span.chord.degree !== 'V+'
    ) {
      span.chord = { ...span.chord, bass: 0 }
    }
  }

  // First inversions where they turn a leap in the bass into a step.
  for (let i = 1; i < spans.length - 1; i++) {
    const span = spans[i]!
    const { section, chord } = span
    const bar = Math.floor(span.beat / meter)
    if (
      section.role === 'coda' ||
      bar >= section.bar + section.bars - 2 ||
      chord.bass !== chord.root ||
      (chord.tones[1] !== 3 && chord.tones[1] !== 4) ||
      !d.chance(spec.inversions)
    ) {
      continue
    }
    const third = mod(chord.root + chord.tones[1], 12)
    if (
      isStep(spans[i - 1]!.chord.bass, third) &&
      isStep(third, spans[i + 1]!.chord.bass)
    ) {
      span.chord = { ...chord, bass: third }
    }
  }

  return spans
}

// ---------------------------------------------------------------------------
// Playing it: shared state and helpers
// ---------------------------------------------------------------------------

/** A note in beats, before tempo, rubato and dynamics. */
type Event = {
  beat: number
  /** Beats the key or the pedal holds it. */
  len: number
  midi: number
  velocity: number
  right: boolean
  /** Seconds to nudge the onset: rolls, graces, a leading melody. */
  shift?: number
  /** Extra seconds the pedal holds it past `len`. */
  ring?: number
  /** The tune itself, which sits a touch behind the beat in some styles. */
  lead?: boolean
}

type Ctx = {
  d: Dice
  plan: Plan
  spans: Span[]
  events: Event[]
  /** The last bass note, so the bass moves by the shortest way. */
  lastBass: number
  /** Where the left hand's chords sit, so they move smoothly. */
  leftCenter: number
  /** Highest note for the left hand. */
  leftTop: number
  /** Lowest note for anything the right hand adds under the tune. */
  rightFloor: number
  /** The melody's range, in scale degrees from home. */
  melodyLo: number
  melodyHi: number
  /** The piece's arpeggio cell and right-hand figure. */
  cell: readonly number[]
  figure: readonly number[]
  figureVoices?: number[]
  /** A deep bass still held by the pedal. */
  held?: Event[]
}

function chordAt(ctx: Ctx, beat: number): Chord {
  const { spans } = ctx
  let lo = 0
  let hi = spans.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (spans[mid]!.beat <= beat + 1e-9) lo = mid
    else hi = mid - 1
  }
  return spans[lo]!.chord
}

function spansInBar(ctx: Ctx, bar: number): Span[] {
  const { meter } = ctx.plan
  return ctx.spans.filter(
    (span) => Math.floor(span.beat / meter + 1e-9) === bar
  )
}

/** The MIDI note of pitch class `pc` nearest `target`, inside [lo, hi]. */
function place(pc: number, target: number, lo = 21, hi = 108) {
  let best = -1
  for (let midi = lo; midi <= hi; midi++) {
    if (mod(midi, 12) !== pc) continue
    if (best < 0 || Math.abs(midi - target) < Math.abs(best - target)) {
      best = midi
    }
  }
  if (best >= 0) return best
  const below = target - mod(target - pc, 12)
  return target - below <= 6 ? below : below + 12
}

/** A chord's pitch classes. */
function chordPcs(ctx: Ctx, chord: Chord) {
  return new Set(
    chord.tones.map((interval) =>
      mod(ctx.plan.tonic + chord.root + interval, 12)
    )
  )
}

/** The MIDI note of scale degree `deg` (0 = home) under `chord`. */
function degreeMidi(ctx: Ctx, deg: number, chord: Chord) {
  return ctx.plan.home + 12 * Math.floor(deg / 7) + chord.mode[mod(deg, 7)]!
}

function isStable(ctx: Ctx, deg: number, chord: Chord) {
  return chord.stable.has(mod(degreeMidi(ctx, deg, chord) - ctx.plan.home, 12))
}

/** The nearest degree the melody can rest on over `chord`. */
function snap(
  ctx: Ctx,
  deg: number,
  chord: Chord,
  direction: number,
  allowed: (deg: number) => boolean
) {
  const dir = direction >= 0 ? 1 : -1
  for (const offset of [0, dir, -dir, 2 * dir, -2 * dir, 3 * dir, -3 * dir]) {
    const candidate = deg + offset
    if (allowed(candidate) && isStable(ctx, candidate, chord)) return candidate
  }
  return deg
}

function bassFor(ctx: Ctx, span: Span) {
  const pc = mod(ctx.plan.tonic + span.chord.bass, 12)
  const midi = place(pc, ctx.lastBass * 0.7 + 44 * 0.3, 36, 52)
  ctx.lastBass = midi
  ctx.held = undefined
  return midi
}

/** `count` chord tones for the left hand: not the root, unless it runs short. */
function voiceLeft(
  ctx: Ctx,
  chord: Chord,
  count: number,
  lo: number,
  hi: number
): number[] {
  const intervals = chord.tones.slice(1)
  if (intervals.length < count) intervals.push(0)
  const notes: number[] = []
  // Low voices need room; and no unisons.
  const crowded = (m: number) =>
    notes.some((n) => Math.abs(n - m) < (Math.min(n, m) < 55 ? 3 : 2))
  for (const interval of intervals.slice(0, count)) {
    const pc = mod(ctx.plan.tonic + chord.root + interval, 12)
    let midi = place(pc, ctx.leftCenter, lo, hi)
    if (crowded(midi) && midi + 12 <= hi && !crowded(midi + 12)) midi += 12
    else if (crowded(midi) && midi - 12 >= lo && !crowded(midi - 12)) {
      midi -= 12
    }
    if (!crowded(midi)) notes.push(midi)
  }
  notes.sort((x, y) => x - y)
  if (notes.length > 0) {
    const average = notes.reduce((sum, n) => sum + n, 0) / notes.length
    // Follow the voicing, but drift back toward the middle of the hand.
    ctx.leftCenter =
      0.45 * ctx.leftCenter + 0.35 * average + 0.2 * (ctx.leftTop - 8)
  }
  return notes
}

/** The notes an arpeggio climbs through: the bass, then chord tones above. */
function ladder(ctx: Ctx, chord: Chord, bass: number, energy: number) {
  const pcs = chordPcs(ctx, chord)
  const top = Math.min(bass + (energy > 0.6 ? 26 : 21), ctx.leftTop)
  const rungs = [bass]
  for (let midi = bass + 5; midi <= top; midi++) {
    if (!pcs.has(mod(midi, 12))) continue
    if (midi - rungs.at(-1)! < (midi < 57 ? 3 : 2)) continue
    rungs.push(midi)
  }
  return rungs
}

// ---------------------------------------------------------------------------
// Left hand
// ---------------------------------------------------------------------------

/** A low bass on the beat, then a soft chord on the next, held by the pedal. */
function leftWaltz(ctx: Ctx, bar: number, section: Section) {
  for (const span of spansInBar(ctx, bar)) {
    const end = span.beat + span.len
    ctx.events.push({
      beat: span.beat,
      len: span.len,
      midi: bassFor(ctx, span),
      velocity: 0.46,
      right: false,
      ring: 0.3
    })
    if (span.len < 2) continue
    const at = span.beat + 1
    const voicing = voiceLeft(ctx, span.chord, 3, 50, ctx.leftTop)
    for (const [i, midi] of voicing.entries()) {
      ctx.events.push({
        beat: at,
        len: end - at,
        midi,
        velocity: 0.27,
        right: false,
        shift: i * 0.008,
        ring: 0.25
      })
    }
    // Busier: the chord again, softer, on the last beat.
    if (section.energy > 0.5 && span.len >= 3) {
      for (const midi of voicing) {
        ctx.events.push({
          beat: end - 1,
          len: 1,
          midi,
          velocity: 0.2,
          right: false,
          ring: 0.25
        })
      }
    }
  }
}

/** One broken-chord cell, every bar: sparse, then eighths, then sixteenths. */
function leftArpeggio(ctx: Ctx, bar: number, section: Section) {
  const { meter } = ctx.plan
  const start = bar * meter
  const step = section.energy < 0.28 ? 1 : section.energy >= 0.82 ? 0.25 : 0.5
  for (const span of spansInBar(ctx, bar)) {
    const end = span.beat + span.len
    const bass = bassFor(ctx, span)
    const rungs = ladder(ctx, span.chord, bass, section.energy)
    for (let t = span.beat; t < end - 1e-9; t += step) {
      const i = Math.round((t - start) / step)
      const index =
        t === span.beat
          ? 0
          : ctx.cell[((step === 1 ? 2 : 1) * i) % ctx.cell.length]!
      ctx.events.push({
        beat: t,
        len: end - t,
        midi: rungs[Math.min(index, rungs.length - 1)]!,
        velocity: (t === span.beat ? 0.4 : 0.27) + 0.012 * index,
        right: false,
        ring: 0.15
      })
    }
  }
}

/** A held bass under a soft dyad, warming into a slow walk up the chord. */
function leftPulse(ctx: Ctx, bar: number, section: Section) {
  for (const span of spansInBar(ctx, bar)) {
    const end = span.beat + span.len
    const bass = bassFor(ctx, span)
    ctx.events.push({
      beat: span.beat,
      len: span.len,
      midi: bass,
      velocity: 0.44,
      right: false,
      ring: 0.35
    })
    if (span.len < 2) continue
    if (section.energy >= 0.7) {
      const rungs = ladder(ctx, span.chord, bass, 0)
      const walk = [1, 2, 1, 3]
      for (let t = span.beat + 1, i = 0; t < end - 1e-9; t++, i++) {
        ctx.events.push({
          beat: t,
          len: end - t,
          midi: rungs[Math.min(walk[i % walk.length]!, rungs.length - 1)]!,
          velocity: 0.26,
          right: false,
          ring: 0.15
        })
      }
    } else {
      const at = span.beat + (span.len >= 4 ? 2 : 1)
      const voicing = voiceLeft(ctx, span.chord, 2, 50, ctx.leftTop)
      for (const [i, midi] of voicing.entries()) {
        ctx.events.push({
          beat: at,
          len: end - at,
          midi,
          velocity: 0.24,
          right: false,
          shift: i * 0.012,
          ring: 0.2
        })
      }
    }
  }
}

/** A deep bass in octaves, left ringing while the harmony above it moves. */
function leftDeep(ctx: Ctx, bar: number, section: Section) {
  const { meter, tonic } = ctx.plan
  for (const span of spansInBar(ctx, bar)) {
    const end = span.beat + span.len
    const pc = mod(tonic + span.chord.bass, 12)
    const held = ctx.held
    if (
      held &&
      mod(held[0]!.midi, 12) === pc &&
      span.beat - held[0]!.beat < 2 * meter
    ) {
      for (const event of held) event.len = end - event.beat
    } else {
      const bass = place(pc, ctx.lastBass * 0.6 + 41 * 0.4, 36, 48)
      ctx.lastBass = bass
      const low: Event = {
        beat: span.beat,
        len: span.len,
        midi: bass,
        velocity: 0.42,
        right: false,
        ring: 0.4
      }
      ctx.events.push(low)
      ctx.held = [low]
      if (bass + 12 <= 60) {
        const octave = { ...low, midi: bass + 12, velocity: 0.28, shift: 0.018 }
        ctx.events.push(octave)
        ctx.held.push(octave)
      }
    }
    if (section.energy >= 0.25 && span.len >= 2) {
      const at = span.beat + (span.len >= 4 ? 2 : 1)
      const voicing = voiceLeft(ctx, span.chord, 2, 52, ctx.leftTop)
      for (const [i, midi] of voicing.entries()) {
        ctx.events.push({
          beat: at,
          len: end - at,
          midi,
          velocity: 0.22,
          right: false,
          shift: 0.03 * i,
          ring: 0.3
        })
      }
    }
  }
}

/** Rolled shell voicings (root, seventh, tenth, ninth) that lean early. */
function leftShell(ctx: Ctx, bar: number, section: Section) {
  const { d } = ctx
  for (const span of spansInBar(ctx, bar)) {
    const end = span.beat + span.len
    const bass = bassFor(ctx, span)
    const count = span.chord.tones.length >= 5 ? 3 : 2
    const voicing = voiceLeft(ctx, span.chord, count, 50, ctx.leftTop)
    // Now and then the change arrives an eighth early.
    const push = span.beat > 0 && span.len >= 2 && d.chance(0.22) ? 0.5 : 0
    const at = span.beat - push
    const roll = d.between(0.025, 0.05)
    ctx.events.push({
      beat: at,
      len: end - at,
      midi: bass,
      velocity: 0.44,
      right: false,
      ring: 0.4
    })
    for (const [i, midi] of voicing.entries()) {
      ctx.events.push({
        beat: at,
        len: end - at,
        midi,
        velocity: 0.27,
        right: false,
        shift: roll * (i + 1),
        ring: 0.4
      })
    }
    if (section.energy >= 0.6 && span.len >= 3) {
      const again = span.beat + 2.5
      for (const [i, midi] of voicing.entries()) {
        ctx.events.push({
          beat: again,
          len: end - again,
          midi,
          velocity: 0.17,
          right: false,
          shift: 0.01 * i,
          ring: 0.3
        })
      }
    }
  }
}

const LEFT: Record<LeftMode, (ctx: Ctx, bar: number, s: Section) => void> = {
  waltz: leftWaltz,
  arpeggio: leftArpeggio,
  pulse: leftPulse,
  deep: leftDeep,
  shell: leftShell
}

// Broken-chord cells, as rungs of the ladder, one eighth note each.
const CELLS: Record<3 | 4, ReadonlyArray<readonly number[]>> = {
  4: [
    [0, 1, 2, 3, 4, 3, 2, 1],
    [0, 2, 1, 2, 3, 2, 1, 2],
    [0, 1, 2, 1, 3, 1, 2, 1],
    [0, 1, 2, 3, 2, 1, 2, 3],
    [0, 2, 3, 4, 3, 2, 3, 1]
  ],
  3: [
    [0, 1, 2, 3, 2, 1],
    [0, 2, 1, 3, 2, 1],
    [0, 1, 2, 1, 3, 1],
    [0, 1, 3, 2, 4, 2]
  ]
}

// The loop's right-hand figures: which of three voices, one eighth each.
const FIGURES: Record<3 | 4, ReadonlyArray<readonly number[]>> = {
  4: [
    [2, 1, 0, 1, 2, 1, 0, 1],
    [0, 1, 2, 1, 0, 1, 2, 1],
    [0, 2, 1, 2, 0, 2, 1, 2],
    [2, 1, 0, 2, 1, 0, 2, 1],
    [1, 2, 0, 2, 1, 2, 0, 2]
  ],
  3: [
    [2, 1, 0, 1, 2, 1],
    [0, 1, 2, 1, 2, 1],
    [0, 2, 1, 2, 1, 2],
    [2, 1, 0, 2, 1, 0]
  ]
}

// ---------------------------------------------------------------------------
// Right hand
// ---------------------------------------------------------------------------

/** Three chord tones under the tune, each moving to the nearest new one. */
function figureVoices(ctx: Ctx, chord: Chord, bloom: boolean): number[] {
  const pcs = chordPcs(ctx, chord)
  const lo = ctx.plan.home - 15
  const hi = ctx.plan.home - 4
  const candidates: number[] = []
  for (let midi = lo; midi <= hi; midi++) {
    if (pcs.has(mod(midi, 12))) candidates.push(midi)
  }
  const previous = ctx.figureVoices
  let voices: number[]
  if (previous) {
    voices = []
    for (const voice of previous) {
      let best: number | undefined
      for (const candidate of candidates) {
        if (voices.includes(candidate)) continue
        if (
          best === undefined ||
          Math.abs(candidate - voice) < Math.abs(best - voice)
        ) {
          best = candidate
        }
      }
      if (best !== undefined) voices.push(best)
    }
  } else {
    const center = (lo + hi) / 2
    voices = candidates
      .toSorted((x, y) => Math.abs(x - center) - Math.abs(y - center))
      .slice(0, 3)
  }
  voices.sort((x, y) => x - y)
  while (voices.length < 3) voices.push(voices.at(-1)! + 12)
  voices = voices.slice(0, 3)
  ctx.figureVoices = voices
  if (bloom) {
    // A fourth voice above, from the chord.
    for (let midi = voices[2]! + 2; midi <= voices[2]! + 9; midi++) {
      if (pcs.has(mod(midi, 12))) return [...voices, midi]
    }
  }
  return voices
}

/** The loop's repeated eighth-note figure, voice-led through the chords. */
function rightFigure(ctx: Ctx, bar: number, section: Section) {
  const { meter } = ctx.plan
  const start = bar * meter
  const bloom = section.energy >= 0.75
  for (const span of spansInBar(ctx, bar)) {
    const voices = figureVoices(ctx, span.chord, bloom)
    for (let t = span.beat; t < span.beat + span.len - 1e-9; t += 0.5) {
      const i = Math.round((t - start) * 2)
      const index =
        voices.length > 3 && i % 4 === 3
          ? 3
          : ctx.figure[i % ctx.figure.length]!
      ctx.events.push({
        beat: t,
        len: 0.75,
        midi: voices[index]!,
        velocity: 0.3 + (i === 0 ? 0.07 : i % 2 === 0 ? 0.025 : 0),
        right: true,
        ring: 0.1
      })
    }
  }
}

type Motif = {
  /** One or two bars of rhythm: positive values are notes, negative rests. */
  cells: number[][]
  /** Scale steps from each note to the next; the first is 0. */
  steps: number[]
}

type Shape = {
  /** Degree the phrase starts on. */
  start: number
  /** Degree it climbs to, and where (0–1 through the phrase). */
  peak: number
  peakAt: number
  /** Degree (0–6) it comes to rest on, and roughly where. */
  goal: number
  end: number
  pentatonic: boolean
}

type Line = Array<{ beat: number; len: number; deg: number; velocity: number }>

// Bar rhythms, sparse to busy. Negative values are rests.
const RHYTHMS: Record<
  3 | 4,
  ReadonlyArray<ReadonlyArray<readonly number[]>>
> = {
  4: [
    [[4], [3, 1], [2, 2], [-1, 3], [-2, 2], [1, 3]],
    [
      [2, 1, 1],
      [1, 1, 2],
      [1.5, 0.5, 2],
      [-1, 1, 2],
      [2, 2],
      [3, 1],
      [1, 2, 1],
      [-0.5, 0.5, 1, 2]
    ],
    [
      [1, 1, 1, 1],
      [0.5, 0.5, 1, 2],
      [1, 0.5, 0.5, 2],
      [1.5, 0.5, 1, 1],
      [-0.5, 0.5, 0.5, 0.5, 2],
      [2, 0.5, 0.5, 1]
    ]
  ],
  3: [
    [[3], [2, 1], [-1, 2], [1, 2]],
    [
      [1, 2],
      [2, 1],
      [1, 1, 1],
      [1.5, 0.5, 1],
      [-1, 1, 1]
    ],
    [
      [1, 0.5, 0.5, 1],
      [0.5, 0.5, 1, 1],
      [1, 1, 0.5, 0.5],
      [-0.5, 0.5, 1, 1]
    ]
  ]
}

function rhythmCell(d: Dice, meter: 3 | 4, density: number): number[] {
  const tiers = RHYTHMS[meter]
  const tier = d.weighted(tiers, [
    Math.max(0, 1 - 2 * density) + 0.15,
    1 - Math.abs(density - 0.5) * 1.4,
    Math.max(0, 2 * density - 1) + 0.05
  ])
  return [...d.pick(tier)]
}

/** The phrase's last bar: a long note on the downbeat, then perhaps a breath. */
function cadenceCell(d: Dice, meter: 3 | 4, final: boolean): number[] {
  if (final) return [meter]
  return meter === 4 ? d.pick([[4], [3, -1], [2, -2]]) : d.pick([[3], [2, -1]])
}

function makeMotif(d: Dice, meter: 3 | 4, density: number): Motif {
  const cells = [rhythmCell(d, meter, density + 0.1)]
  if (d.chance(0.55)) cells.push(rhythmCell(d, meter, density - 0.1))
  const count = () => cells.flat().filter((value) => value > 0).length
  while (count() < 3 && cells.length < 2) {
    cells.push(rhythmCell(d, meter, density + 0.3))
  }
  if (count() < 3) cells[cells.length - 1] = rhythmCell(d, meter, 1)

  const n = count()
  const shape = d.pick(['rise', 'arch', 'fall', 'turn', 'leap'] as const)
  const leap = d.pick([3, 4, -3])
  const steps = [0]
  for (let i = 1; i < n; i++) {
    const p = i / Math.max(1, n - 1)
    switch (shape) {
      case 'rise':
        steps.push(d.weighted([1, 2, 0], [6, 2, 1]))
        break
      case 'arch':
        steps.push(
          p <= 0.5 ? d.weighted([1, 2], [5, 3]) : d.weighted([-1, -2], [6, 2])
        )
        break
      case 'fall':
        steps.push(i === 1 ? d.int(2, 4) : d.weighted([-1, -2, 0], [6, 1, 1]))
        break
      case 'turn':
        steps.push([1, -1, -1, 1][(i - 1) % 4]! * (d.chance(0.2) ? 2 : 1))
        break
      case 'leap':
        steps.push(
          i === 1 ? leap : -Math.sign(leap) * d.weighted([1, 0], [5, 1])
        )
        break
    }
  }
  return { cells, steps }
}

function motifRange(motif: Motif) {
  let at = 0
  let top = 0
  let bottom = 0
  for (const step of motif.steps) {
    at += step
    top = Math.max(top, at)
    bottom = Math.min(bottom, at)
  }
  return { top, bottom }
}

/** Degrees (0–6) a phrase can come to rest on, by how it ends. */
const GOALS: Record<Cadence, readonly number[]> = {
  authentic: [0, 0, 0, 2],
  plagal: [0, 0, 2, 4],
  half: [4, 1, 1, 6],
  deceptive: [0, 0, 5],
  open: [0, 3, 5]
}

function planShape(
  ctx: Ctx,
  section: Section,
  motif: Motif,
  earlier: Map<Role, Shape>
): Shape {
  const { d, melodyLo: lo, melodyHi: hi } = ctx
  const { top, bottom } = motifRange(motif)
  const fit = (deg: number) => clamp(deg, lo - bottom, hi - 1 - top)
  const a = earlier.get('A')
  const b = earlier.get('B')
  let start: number
  switch (section.role) {
    case 'A2':
      start = a?.start ?? fit(2)
      break
    case 'R': {
      const home = a?.start ?? fit(2)
      // Now and then the return comes back an octave up.
      start = d.chance(0.2) && fit(home + 7) === home + 7 ? home + 7 : home
      break
    }
    case 'B':
      start = fit((a?.start ?? 2) + d.pick([2, 3, 4, -3]))
      break
    case 'B2':
      start = fit((b?.start ?? 4) + d.pick([1, 2]))
      break
    default:
      start = fit(d.pick([2, 4, 0, 4, 2, 1]))
  }
  const contrast = section.role === 'B' || section.role === 'B2'
  const lift = contrast ? d.int(1, 2) : 0
  const goal = section.final ? 0 : d.pick(GOALS[section.cadence])
  // Come down to the goal a little below where the phrase began.
  const around = start - 1
  return {
    start,
    peak: Math.min(hi, start + Math.max(top, d.int(2, 4)) + lift),
    peakAt: d.between(0.45, 0.75),
    goal,
    end: clamp(around + mod(goal - around + 3, 7) - 3, lo, hi),
    pentatonic: ctx.plan.pentatonic && !contrast
  }
}

/** Write a phrase's tune, in scale degrees. */
function composeLine(
  ctx: Ctx,
  section: Section,
  motif: Motif,
  shape: Shape,
  useRhythm: boolean,
  useSteps: boolean
): Line {
  const { d, plan } = ctx
  const { meter } = plan
  const start = section.bar * meter
  const total = section.bars * meter
  const density = clamp(plan.density + (section.energy - 0.4) * 0.4, 0, 1)

  const slots: Array<{ beat: number; len: number }> = []
  for (let k = 0; k < section.bars; k++) {
    const cell =
      k === section.bars - 1
        ? cadenceCell(d, meter, section.final)
        : useRhythm && k < motif.cells.length
          ? motif.cells[k]!
          : rhythmCell(d, meter, density)
    let t = start + k * meter
    for (const value of cell) {
      if (value > 0) slots.push({ beat: t, len: value })
      t += Math.abs(value)
    }
  }

  const pentatonic = (deg: number) =>
    !shape.pentatonic || (mod(deg, 7) !== 3 && mod(deg, 7) !== 6)
  const { melodyLo: lo, melodyHi: hi } = ctx
  const reflect = (deg: number) =>
    deg < lo
      ? Math.min(hi, 2 * lo - deg)
      : deg > hi
        ? Math.max(lo, 2 * hi - deg)
        : deg

  const line: Line = []
  let deg = shape.start
  let interval = 0
  for (const [i, slot] of slots.entries()) {
    const p = (slot.beat - start) / total
    const target =
      p < shape.peakAt
        ? lerp(shape.start, shape.peak, p / shape.peakAt)
        : lerp(shape.peak, shape.end, (p - shape.peakAt) / (1 - shape.peakAt))
    const last = i === slots.length - 1
    let next: number
    if (i === 0) {
      next = shape.start
    } else if (useSteps && i < motif.steps.length) {
      next = deg + motif.steps[i]!
    } else if (Math.abs(interval) >= 3) {
      // After a leap, step back the other way.
      next = deg - Math.sign(interval)
    } else {
      const gap = target - deg
      const toward = gap >= 0 ? 1 : -1
      const dir =
        Math.abs(gap) < 0.5
          ? d.pick([1, -1])
          : d.chance(0.78)
            ? toward
            : -toward
      const size = d.weighted(
        [0, 1, 2, 3, 4],
        [0.8, 6, 2.2, Math.abs(gap) > 3 ? 1.6 : 0.6, 0.3]
      )
      next = deg + dir * size
    }
    if (last) {
      // Land on the goal, in the octave nearest the note before.
      next = deg + mod(shape.goal - deg + 3, 7) - 3
    }
    next = reflect(next)

    const chord = chordAt(ctx, slot.beat)
    const inBar = mod(slot.beat, meter)
    const strong =
      inBar < 1e-9 ||
      (meter === 4 && Math.abs(inBar - 2) < 1e-9) ||
      slot.len >= 1.5
    if (!last) {
      if (strong || slot.len >= 1) {
        next = snap(ctx, next, chord, target - next, pentatonic)
      } else if (!pentatonic(next)) {
        next += next >= deg ? 1 : -1
      }
      // Never the same note three times running.
      if (line.length >= 2 && next === deg && line.at(-2)!.deg === deg) {
        next = snap(
          ctx,
          deg + (target >= deg ? 1 : -1),
          chord,
          target - deg,
          anything
        )
      }
      next = reflect(next)
    }

    // Louder toward the peak, softer into the cadence; strong beats lean.
    const reach =
      1 - Math.abs(p - shape.peakAt) / Math.max(shape.peakAt, 1 - shape.peakAt)
    const velocity =
      0.66 *
      (0.88 + 0.2 * reach) *
      (strong ? 1.05 : 0.93) *
      (last ? 0.92 : 1) *
      (1 + 0.012 * (next - shape.start))

    interval = next - deg
    deg = next
    line.push({ beat: slot.beat, len: slot.len, deg, velocity })
  }
  return line
}

const DIATONIC_SHAPES: ReadonlyArray<readonly number[]> = [
  [-2],
  [-5],
  [-2, -4],
  [-3, -7],
  [-2, -4, -6],
  [-3, -6],
  [-2, -5]
]
// Exact semitones, for real (chromatic) planing.
const REAL_SHAPES: ReadonlyArray<readonly number[]> = [
  [-3, -7],
  [-4, -7, -11],
  [-5, -10],
  [-4, -7]
]

type Planing = { shape: readonly number[]; real: boolean }

/** Play a phrase's tune, dressed for the section's right-hand mode. */
function playLine(
  ctx: Ctx,
  section: Section,
  line: Line,
  planing: Planing,
  fill: boolean
) {
  const { d, plan } = ctx
  const { spec, texture } = plan
  const doubled =
    section.energy >= 0.75 && (texture === 'arpeggio' || texture === 'loop')
  let previous: Event | undefined

  for (const note of line) {
    const chord = chordAt(ctx, note.beat)
    const midi = degreeMidi(ctx, note.deg, chord)
    const event: Event = {
      beat: note.beat,
      len: note.len,
      midi,
      velocity: note.velocity,
      right: true,
      ring: 0.05,
      lead: true
    }

    if (
      previous &&
      note.len >= 2 &&
      previous.len >= 1 &&
      Math.abs(previous.beat + previous.len - note.beat) < 1e-9 &&
      d.chance(spec.ornament)
    ) {
      // A turn into a long note: above, on, below, then the note.
      previous.len -= 0.5
      const before = chordAt(ctx, note.beat - 0.5)
      for (const [j, offset] of [1, 0, -1].entries()) {
        ctx.events.push({
          beat: note.beat - 0.5 + j / 6,
          len: 1 / 6,
          midi: degreeMidi(ctx, note.deg + offset, before),
          velocity: note.velocity * 0.6,
          right: true
        })
      }
    } else if (previous && note.len >= 1 && d.chance(spec.ornament)) {
      // A grace note: a slip up from a semitone below, or down from above.
      ctx.events.push({
        beat: note.beat,
        len: 0,
        midi: d.chance(0.6) ? midi - 1 : degreeMidi(ctx, note.deg + 1, chord),
        velocity: note.velocity * 0.5,
        right: true,
        shift: -0.075
      })
    }

    ctx.events.push(event)
    previous = event

    if (section.right === 'planing') {
      // Chord shapes sliding under the tune in parallel.
      const strong = mod(note.beat, 1) < 1e-9 || note.len >= 1
      if (planing.real ? note.len >= 0.5 : strong) {
        for (const [j, offset] of planing.shape.entries()) {
          const under = planing.real
            ? midi + offset
            : degreeMidi(ctx, note.deg + offset, chord)
          if (under < ctx.rightFloor) continue
          ctx.events.push({
            beat: note.beat,
            len: note.len,
            midi: under,
            velocity: note.velocity * 0.5,
            right: true,
            shift: 0.01 + 0.004 * j,
            ring: 0.05
          })
        }
      }
    } else if (section.right === 'upper' && note.len >= 1) {
      // Upper-structure colour: one or two chord tones a little below.
      const pcs = chordPcs(ctx, chord)
      const under: number[] = []
      for (let m = midi - 3; m >= midi - 9 && under.length < 2; m--) {
        if (m < ctx.rightFloor || !pcs.has(mod(m, 12))) continue
        if (under.every((u) => u - m >= 3)) under.push(m)
      }
      for (const m of under) {
        ctx.events.push({
          beat: note.beat,
          len: note.len,
          midi: m,
          velocity: note.velocity * 0.48,
          right: true,
          shift: d.chance(0.5) ? -0.02 : 0.015,
          ring: 0.05
        })
      }
    } else if (doubled && note.len >= 1 && midi - 12 >= ctx.rightFloor) {
      // The climax in octaves.
      ctx.events.push({
        ...event,
        midi: midi - 12,
        velocity: note.velocity * 0.7,
        lead: false
      })
    }
  }

  if (section.right === 'upper') comp(ctx, section, line)

  // A quick run up out of the cadence, into whatever comes next.
  const last = line.at(-1)
  if (fill && last && last.len >= 2 && !section.final) {
    const count = d.int(4, 6)
    const from = last.beat + last.len - 1
    const chord = chordAt(ctx, from)
    let deg = last.deg
    for (let j = 0; j < count; j++) {
      deg += 1
      while (mod(deg, 7) === 3 || mod(deg, 7) === 6) deg += 1
      if (deg > ctx.melodyHi) break
      ctx.events.push({
        beat: from + j / count,
        len: 1 / count,
        midi: degreeMidi(ctx, deg, chord),
        velocity: 0.3 + (0.16 * j) / count,
        right: true
      })
    }
  }
}

/** Neo-soul comping: a soft off-beat dyad wherever the tune rests. */
function comp(ctx: Ctx, section: Section, line: Line) {
  const { meter, tonic } = ctx.plan
  const start = section.bar * meter
  const end = start + section.bars * meter
  const gaps: Array<[number, number]> = []
  let cursor = start
  for (const note of line) {
    if (note.beat - cursor >= 1.5) gaps.push([cursor, note.beat])
    cursor = Math.max(cursor, note.beat + note.len)
  }
  if (end - cursor >= 1.5) gaps.push([cursor, end])

  for (const [from, to] of gaps) {
    // The first off-beat eighth in the gap.
    const at = Math.ceil(from - 0.5) + 0.5
    if (at + 0.75 > to) continue
    const chord = chordAt(ctx, at)
    for (const interval of chord.tones.slice(1, 3)) {
      ctx.events.push({
        beat: at,
        len: Math.min(1, to - at),
        midi: place(
          mod(tonic + chord.root + interval, 12),
          ctx.rightFloor + 5,
          ctx.rightFloor,
          ctx.rightFloor + 12
        ),
        velocity: 0.28,
        right: true,
        ring: 0.05
      })
    }
  }
}

/** Two bars from the end: the opening motif again, high and soft. */
function playEcho(ctx: Ctx, bar: number, motif: Motif, start: number) {
  const { meter } = ctx.plan
  let t = bar * meter
  const up =
    degreeMidi(ctx, start + 7 + motifRange(motif).top, chordAt(ctx, t)) <= 91
  let deg = start
  let i = 0
  for (const value of motif.cells[0]!) {
    if (value > 0 && i < motif.steps.length) {
      deg += motif.steps[i]!
      i++
      const chord = chordAt(ctx, t)
      const snapped = snap(ctx, deg, chord, 0, anything)
      ctx.events.push({
        beat: t,
        len: value,
        midi: degreeMidi(ctx, snapped + (up ? 7 : 0), chord),
        velocity: 0.34 - 0.03 * i,
        right: true,
        ring: 0.2
      })
    }
    t += Math.abs(value)
  }
}

/** The last chord: rolled up from a low tonic, and left to ring. */
function playEnding(ctx: Ctx) {
  const { d, plan } = ctx
  const beat = (plan.bars - 1) * plan.meter
  const chord = chordAt(ctx, beat)
  const bass = place(plan.tonic, 40, 36, 47)
  const left = [
    bass,
    bass + 7,
    ...voiceLeft(ctx, chord, 2, bass + 10, ctx.leftTop)
  ]
  const roll = d.between(0.045, 0.07)
  for (const [i, midi] of left.entries()) {
    ctx.events.push({
      beat,
      len: plan.meter,
      midi,
      velocity: i === 0 ? 0.44 : 0.28,
      right: false,
      shift: i * roll,
      ring: 1.6
    })
  }
  const top = degreeMidi(ctx, d.weighted([0, 2, 4], [3, 1, 1]), chord)
  const pcs = chordPcs(ctx, chord)
  const right = [top]
  for (let m = top - 2; m >= top - 10 && right.length < 3; m--) {
    if (pcs.has(mod(m, 12)) && right.at(-1)! - m >= 3) right.push(m)
  }
  right.reverse()
  for (const [i, midi] of right.entries()) {
    ctx.events.push({
      beat,
      len: plan.meter,
      midi,
      velocity: i === right.length - 1 ? 0.46 : 0.3,
      right: true,
      shift: left.length * roll + i * 0.035,
      ring: 1.6
    })
  }
}

// ---------------------------------------------------------------------------
// Performance: tempo, rubato, dynamics, touch
// ---------------------------------------------------------------------------

/** Seconds at each beat, with each phrase leaning in and broadening out. */
function tempoMap(ctx: Ctx): (beat: number) => number {
  const { d, plan } = ctx
  const { meter, beat, spec } = plan
  const r = spec.rubato
  const starts = [0]
  const from: number[] = []
  const to: number[] = []
  for (const section of plan.sections) {
    for (let k = 0; k < section.bars; k++) {
      const bar = section.bar + k
      const last = k === section.bars - 1
      let s = 1 + d.jitter(r * 0.02)
      let e = 1 + d.jitter(r * 0.02)
      if (k === 0) s += r * 0.06
      if (last && section.role !== 'intro') {
        e += 0.04 + r * d.between(0.2, 0.4)
      } else {
        e -= r * 0.06 * Math.sin((Math.PI * (k + 1)) / section.bars)
      }
      if (bar === plan.bars - 2) e += 0.08
      if (bar === plan.bars - 1) {
        s += 0.1
        e += d.between(0.45, 0.8)
      }
      from.push(s)
      to.push(e)
      // A breath between phrases.
      const breath =
        last && section.role !== 'coda'
          ? beat * d.between(0.05, 0.12 + r * 0.35)
          : 0
      starts.push(starts[bar]! + (meter * beat * (s + e)) / 2 + breath)
    }
  }
  return (position) => {
    const bar = clamp(Math.floor(position / meter), 0, from.length - 1)
    const x = position / meter - bar
    const s = from[bar]!
    const e = to[bar]!
    return starts[bar]! + meter * beat * (s * x + ((e - s) * x * x) / 2)
  }
}

function levelAt(ctx: Ctx, beat: number) {
  const { sections, meter } = ctx.plan
  const bar = beat / meter
  const section = sections.find((s) => bar < s.bar + s.bars) ?? sections.at(-1)!
  const x = clamp((bar - section.bar) / section.bars, 0, 1)
  // Each section swells a little through its middle.
  return (
    lerp(section.levels[0], section.levels[1], x) *
    (1 + 0.05 * Math.sin(Math.PI * x))
  )
}

type Performed = ImprovNote & { right: boolean }

function perform(ctx: Ctx) {
  const { d, plan } = ctx
  const { spec } = plan
  const time = tempoMap(ctx)
  const spread = 0.005 + 0.012 * spec.rubato

  const played: Performed[] = []
  for (const event of ctx.events) {
    const offbeat = Math.abs(mod(event.beat, 1) - 0.5) < 1e-6
    const beat = event.beat + (offbeat ? spec.swing : 0)
    const start =
      time(beat) +
      (event.shift ?? 0) +
      (event.lead ? spec.lag : 0) +
      d.jitter(spread)
    const release = time(beat + event.len) + (event.ring ?? 0)
    played.push({
      midi: event.midi,
      start,
      duration: Math.max(0.06, release - start),
      velocity: clamp(
        event.velocity * levelAt(ctx, event.beat) * (1 + d.jitter(0.035)),
        0.04,
        1
      ),
      right: event.right
    })
  }

  played.sort((x, y) => x.start - y.start || x.midi - y.midi)
  const origin = played[0]?.start ?? 0

  // One key can't sound twice at once: merge doubled strikes, and lift a
  // held key when it is struck again.
  const notes: Performed[] = []
  const lastOf = new Map<number, Performed>()
  for (const note of played) {
    note.start -= origin
    const before = lastOf.get(note.midi)
    if (before && note.start - before.start < 0.04) {
      before.velocity = Math.max(before.velocity, note.velocity)
      before.duration = Math.max(
        before.duration,
        note.start + note.duration - before.start
      )
      before.right ||= note.right
      continue
    }
    if (before && before.start + before.duration > note.start) {
      before.duration = note.start - before.start
    }
    lastOf.set(note.midi, note)
    notes.push(note)
  }

  // Keep the whole piece inside half a minute to a minute.
  let end = 0
  for (const note of notes) end = Math.max(end, note.start + note.duration)
  const scale = end > 57 ? 57 / end : end < 33 ? 33 / end : 1
  if (scale !== 1) {
    for (const note of notes) {
      note.start *= scale
      note.duration *= scale
    }
    end *= scale
  }

  // Light the letters across the right hand's whole range.
  let lo = Infinity
  let hi = -Infinity
  for (const note of notes) {
    if (!note.right) continue
    lo = Math.min(lo, note.midi)
    hi = Math.max(hi, note.midi)
  }
  const span = hi - lo
  return {
    notes: notes.map(
      ({ right, ...note }): ImprovNote =>
        right
          ? { ...note, key: span > 0 ? (note.midi - lo) / span : 0.5 }
          : note
    ),
    duration: end,
    scale
  }
}

// ---------------------------------------------------------------------------
// The piece
// ---------------------------------------------------------------------------

export function improvise(
  random: () => number = Math.random,
  options: ImproviseOptions = {}
): ImprovPhrase {
  const d = makeDice(random)
  // Always roll both, so a seed is the same piece whether or not the caller
  // asks for the key or texture it would have picked anyway.
  const rolledKey = d.pick(IMPROV_KEYS)
  const rolledTexture = d.pick(IMPROV_TEXTURES)
  const keyName = options.key ?? rolledKey
  const texture = options.texture ?? rolledTexture
  if (!(keyName in TONIC)) throw new RangeError(`Unknown key: ${keyName}`)
  if (!(texture in TEXTURES)) {
    throw new RangeError(`Unknown texture: ${texture}`)
  }

  const plan = planPiece(d, keyName, texture)
  const { home, meter } = plan
  // The melody's range: from a fifth or so under home (or just under it,
  // above the loop's figure) up to D6.
  const major = (deg: number) =>
    home + 12 * Math.floor(deg / 7) + MAJOR[mod(deg, 7)]!
  let melodyHi = 0
  while (major(melodyHi + 1) <= 86) melodyHi++
  const floor = texture === 'loop' ? home - 2 : home - 7
  let melodyLo = 0
  while (major(melodyLo - 1) >= floor) melodyLo--

  const ctx: Ctx = {
    d,
    plan,
    spans: composeHarmony(d, plan),
    events: [],
    lastBass: 44,
    leftCenter: home - 14,
    leftTop: home - 6,
    rightFloor: home - 14,
    melodyLo,
    melodyHi,
    cell: d.pick(CELLS[meter]),
    figure: d.pick(FIGURES[meter])
  }

  // The accompaniment, bar by bar; the last bar is the final chord.
  for (const section of plan.sections) {
    for (let k = 0; k < section.bars; k++) {
      const bar = section.bar + k
      if (bar === plan.bars - 1) continue
      LEFT[section.left](ctx, bar, section)
      if (section.right === 'figure') rightFigure(ctx, bar, section)
    }
  }

  // The tune: a motif, stated, answered, sequenced and brought back.
  const motif = makeMotif(d, meter, plan.density)
  const shapes = new Map<Role, Shape>()
  const planings = new Map<'A' | 'B', Planing>()
  for (const section of plan.sections) {
    if (section.role === 'intro' || section.role === 'coda') continue
    const shape = planShape(ctx, section, motif, shapes)
    if (!shapes.has(section.role)) shapes.set(section.role, shape)
    if (!section.melody) continue

    const contrast = section.role === 'B' || section.role === 'B2'
    const group = contrast ? 'B' : 'A'
    let planing = planings.get(group)
    if (!planing) {
      const real = contrast && texture === 'planing' && d.chance(0.45)
      planing = { shape: d.pick(real ? REAL_SHAPES : DIATONIC_SHAPES), real }
      planings.set(group, planing)
    }
    const line = composeLine(
      ctx,
      section,
      motif,
      shape,
      !contrast || d.chance(0.5),
      !contrast || d.chance(0.7)
    )
    playLine(ctx, section, line, planing, d.chance(plan.spec.fills))
  }

  const coda = plan.sections.at(-1)!
  if (plan.coda === 'echo' && coda.bars > 1) {
    playEcho(ctx, coda.bar, motif, shapes.get('A')?.start ?? 2)
  }
  playEnding(ctx)

  const { notes, duration, scale } = perform(ctx)
  return {
    notes,
    duration,
    keyName,
    texture,
    bpm: Math.round(60 / (plan.beat * scale))
  }
}
