/**
 * A short solo-piano piece, composed fresh on every call: fifteen to thirty
 * seconds in E, D or B major, with a left-hand accompaniment under a
 * right-hand melody, a small form with a clear shape (it sets out, moves,
 * and comes home to a cadence), and the small unevenness of a person
 * playing.
 *
 * Nothing is borrowed note for note. Each piece rolls a texture, and with it
 * a handful of habits from a few pianists' toolkits:
 *
 * - waltz: a sparse slow-waltz left hand (a low bass, then a soft close chord
 *   off the beat, pedalled through the bar) under a plain, modal melody with
 *   lots of air.
 * - arpeggio: one broken-chord cell, repeated, that fills in and climbs as
 *   the piece builds over a clear pulse, the tune doubled in octaves at its
 *   height.
 * - loop: a gentle repeated right-hand figure, voice-led through warm major
 *   harmony, that a melody grows out of.
 * - planing: chord shapes sliding in parallel under the melody, added-sixth
 *   and ninth colour, pentatonic and whole-tone touches, a deep held bass.
 * - neosoul: rolled ninths and elevenths, upper-structure dyads, laid-back
 *   rubato, grace notes and quick fills.
 *
 * The forms are small enough to hear whole: a period (a phrase that asks,
 * one that answers), a sentence (an idea, the idea again, then a run to the
 * cadence), or out, away and back. The harmony comes from a small grammar
 * with real cadences, its colour (a mixolydian ♭VII, a borrowed iv or ♭VI,
 * applied dominants, an augmented V) switched on piece by piece. The melody
 * comes from a motif that is stated, repeated or sequenced, and brought
 * home; it may lean into its last note from a step away, and a soft, high
 * chime may answer it while the last chord rings.
 *
 * The left hand is voice-led and kept out of the low register's mud. The
 * sustain pedal changes with the harmony, catching the old chord a moment
 * into the new one, and lets passing notes go. The playing bends: phrases
 * lean in and broaden out, the tune sings a hair ahead of the hands (or, in
 * neo-soul, lays back), its high point lingers, and the end slows into a
 * last chord that is left to ring.
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

/**
 * A phrase's job: the opening idea (A), that idea again (A2), a contrast
 * (B), a continuation that runs to the cadence (C), or the return (R).
 */
type Role = 'intro' | 'A' | 'A2' | 'B' | 'C' | 'R'
type Cadence = 'authentic' | 'plagal' | 'half' | 'deceptive' | 'open'
type LeftMode = 'waltz' | 'arpeggio' | 'pulse' | 'deep' | 'shell'
type RightMode = 'melody' | 'figure' | 'planing' | 'upper'
type Borrowing = 'none' | LeftMode | 'planing'
type Dynamics = 'arc' | 'valley' | 'swell'
type Form = 'period' | 'sentence' | 'short' | 'ternary'

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
  /** Seconds the tune sits behind the hands (negative: it sings ahead). */
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
  /** Forms it likes, by weight; only those that fit the clock are played. */
  forms: Partial<Record<Form, number>>
  /** What a contrasting middle may borrow. */
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
  /** Chance the tune leans into its last note from a step away. */
  appoggiatura: number
  /** Chance of a soft, high chime over the last chord. */
  chime: number
}

const TEXTURES: Record<ImprovTexture, TextureSpec> = {
  waltz: {
    fourFour: 0,
    beat: [0.64, 0.82],
    rubato: 0.3,
    swing: 0,
    lag: -0.012,
    left: 'waltz',
    right: 'melody',
    flavours: { plain: 0.6, lush: 0.4 },
    colours: { mixolydian: 0.35, mixture: 0.2, applied: 0.15, wholeTone: 0 },
    taste: { iii: 1.6, ii: 1.3, V: 0.35, vi: 1.2, IV: 1.1 },
    hold: 0.5,
    splits: false,
    authentic: 0.4,
    density: [0.1, 0.35],
    introBars: [1, 1],
    forms: { period: 0.45, ternary: 0.35, sentence: 0.2 },
    borrow: { none: 0.4, arpeggio: 0.35, planing: 0.25 },
    pedal: 0.15,
    inversions: 0.25,
    ornament: 0.04,
    fills: 0.05,
    pentatonic: 0.3,
    appoggiatura: 0.35,
    chime: 0.3
  },
  arpeggio: {
    fourFour: 0.7,
    beat: [0.58, 0.74],
    rubato: 0.15,
    swing: 0,
    lag: -0.016,
    left: 'arpeggio',
    right: 'melody',
    flavours: { plain: 0.7, lush: 0.3 },
    colours: { mixolydian: 0.25, mixture: 0.25, applied: 0.2, wholeTone: 0 },
    taste: { vi: 1.5, IV: 1.3, iii: 1.2, ii: 0.8 },
    hold: 0.2,
    splits: false,
    authentic: 0.6,
    density: [0.3, 0.55],
    introBars: [0, 1],
    forms: { period: 0.4, sentence: 0.4, short: 0.2, ternary: 0.15 },
    borrow: { none: 0.5, planing: 0.25, pulse: 0.25 },
    pedal: 0.3,
    inversions: 0.5,
    ornament: 0.03,
    fills: 0.08,
    pentatonic: 0.25,
    appoggiatura: 0.3,
    chime: 0.25
  },
  loop: {
    fourFour: 0.75,
    beat: [0.54, 0.7],
    rubato: 0.15,
    swing: 0,
    lag: -0.01,
    left: 'pulse',
    right: 'figure',
    flavours: { plain: 0.5, lush: 0.5 },
    colours: { mixolydian: 0.45, mixture: 0.3, applied: 0.25, wholeTone: 0 },
    taste: { IV: 1.4, vi: 1.2, ii: 1.2, bVII: 1.3 },
    hold: 0.2,
    splits: false,
    authentic: 0.5,
    density: [0.1, 0.3],
    introBars: [1, 1],
    forms: { period: 0.35, sentence: 0.45, short: 0.2 },
    borrow: { none: 0.4, arpeggio: 0.4, deep: 0.2 },
    pedal: 0.35,
    inversions: 0.5,
    ornament: 0.04,
    fills: 0.1,
    pentatonic: 0.4,
    appoggiatura: 0.25,
    chime: 0.35
  },
  planing: {
    fourFour: 0.7,
    beat: [0.68, 0.88],
    rubato: 0.5,
    swing: 0,
    lag: -0.006,
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
    forms: { period: 0.35, short: 0.35, sentence: 0.3, ternary: 0.15 },
    borrow: { none: 0.45, shell: 0.3, arpeggio: 0.25 },
    pedal: 0.45,
    inversions: 0.2,
    ornament: 0.1,
    fills: 0.3,
    pentatonic: 0.5,
    appoggiatura: 0.3,
    chime: 0.45
  },
  neosoul: {
    fourFour: 1,
    beat: [0.68, 0.86],
    rubato: 0.5,
    swing: 0.06,
    lag: 0.016,
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
    forms: { short: 0.4, period: 0.35, sentence: 0.25 },
    borrow: { none: 0.5, planing: 0.35, arpeggio: 0.15 },
    pedal: 0.1,
    inversions: 0.3,
    ornament: 0.18,
    fills: 0.6,
    pentatonic: 0.2,
    appoggiatura: 0.4,
    chime: 0.3
  }
}

/** Each form's phrases, in bars. The last phrase closes on the tonic. */
const FORMS: Record<Form, ReadonlyArray<readonly [Role, number]>> = {
  // A phrase that asks, and one that answers.
  period: [
    ['A', 4],
    ['R', 4]
  ],
  // An idea, the idea again, then a longer run to the cadence.
  sentence: [
    ['A', 2],
    ['A2', 2],
    ['C', 4]
  ],
  // The same in two-bar breaths.
  short: [
    ['A', 2],
    ['A2', 2],
    ['C', 2]
  ],
  // Out, away and back.
  ternary: [
    ['A', 4],
    ['B', 2],
    ['R', 4]
  ]
}

/** How a phrase that doesn't close the piece may end. */
const CADENCES: Record<'A' | 'A2' | 'B', Partial<Record<Cadence, number>>> = {
  A: { half: 0.45, open: 0.3, deceptive: 0.25 },
  A2: { half: 0.5, open: 0.5 },
  B: { half: 0.55, deceptive: 0.45 }
}

/** Loudness at the start and end of each section, per dynamic shape. */
const LEVELS: Record<Dynamics, Record<Role, readonly [number, number]>> = {
  // Builds into the last phrase, then lets go.
  arc: {
    intro: [0.76, 0.8],
    A: [0.8, 0.92],
    A2: [0.9, 1.02],
    B: [1, 1.14],
    C: [1.12, 0.78],
    R: [1.1, 0.78]
  },
  // A quieter middle, then a fuller return.
  valley: {
    intro: [0.84, 0.88],
    A: [0.96, 1.04],
    A2: [1, 0.86],
    B: [0.76, 0.84],
    C: [1.08, 0.76],
    R: [1.08, 0.76]
  },
  // One long crescendo, let go only at the very end.
  swell: {
    intro: [0.7, 0.74],
    A: [0.74, 0.86],
    A2: [0.86, 0.98],
    B: [0.98, 1.1],
    C: [1.16, 0.8],
    R: [1.16, 0.8]
  }
}

/** How busy the accompaniment is in each section, per dynamic shape. */
const ENERGY: Record<Dynamics, Record<Role, number>> = {
  arc: { intro: 0.2, A: 0.3, A2: 0.45, B: 0.7, C: 0.6, R: 0.5 },
  valley: { intro: 0.25, A: 0.45, A2: 0.5, B: 0.3, C: 0.45, R: 0.55 },
  swell: { intro: 0.15, A: 0.25, A2: 0.4, B: 0.65, C: 0.8, R: 0.75 }
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
  /** Whether this phrase closes the piece. */
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
  form: Form
  sections: Section[]
  bars: number
  pentatonic: boolean
  density: number
  /** Whether the tune leans into its last note from a step away. */
  appoggiatura: boolean
  /** Whether a high chime answers it over the last chord. */
  chime: boolean
  /** Seconds the last chord rings before the hands and pedal lift. */
  ring: number
}

/** Seconds the last chord rings: a slow bar and a half, within reason. */
function lastRing(meter: number, beat: number, rubato: number) {
  return clamp(meter * beat * 1.5, 3.2, 4.4) + 0.6 * rubato
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
  const closing = (): Cadence =>
    d.chance(spec.authentic) ? 'authentic' : 'plagal'

  // Seconds from the first note until the last chord is let go. A form is
  // picked from those that land near it at a tempo the texture likes, and
  // then the tempo bends to fit.
  const target = d.between(19.5, 27)
  const intro = d.int(spec.introBars[0], spec.introBars[1])
  // Phrase-end ritardandos, breaths and the slowing into the last chord.
  const stretch = 1.12 + spec.rubato * 0.2
  const preferred = d.between(spec.beat[0], spec.beat[1])
  const barsOf = (form: Form) =>
    intro + FORMS[form].reduce((sum, [, bars]) => sum + bars, 0)
  const estimate = (form: Form, beat: number) =>
    (barsOf(form) - 1) * meter * beat * stretch +
    lastRing(meter, beat, spec.rubato)
  const fits: Partial<Record<Form, number>> = {}
  for (const [form, weight] of Object.entries(spec.forms) as Array<
    [Form, number]
  >) {
    const miss = (estimate(form, preferred) - target) / (0.12 * target)
    fits[form] = weight * Math.exp(-miss * miss)
  }
  const form = d.choose(fits)
  const bars = barsOf(form)
  // A quieter middle needs a middle to be quiet in.
  const dynamics = d.choose<Dynamics>(
    form === 'ternary'
      ? { arc: 0.4, valley: 0.35, swell: 0.25 }
      : { arc: 0.55, swell: 0.45 }
  )
  let beat = preferred
  for (let i = 0; i < 3; i++) {
    beat =
      (target - lastRing(meter, beat, spec.rubato)) /
      ((bars - 1) * meter * stretch)
  }
  // Within a hair of the tempos the texture likes; the length gives instead.
  beat = clamp(beat, spec.beat[0] * 0.94, spec.beat[1] * 1.06)

  const sections: Section[] = []
  let bar = 0
  const add = (role: Role, length: number, extra: Partial<Section>) => {
    sections.push({
      role,
      bar,
      bars: length,
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
    bar += length
  }
  if (intro > 0) add('intro', intro, { melody: false })
  const pedal = d.chance(spec.pedal)
  const borrowed = BORROWINGS[d.choose(spec.borrow)]
  const phrases = FORMS[form]
  for (const [index, [role, length]] of phrases.entries()) {
    const final = index === phrases.length - 1
    let cadence: Cadence
    if (final) {
      cadence = closing()
    } else if (role === 'A' && length <= 2) {
      // Two bars can't open on a deceptive V.
      cadence = d.choose<Cadence>({ half: 0.55, open: 0.45 })
    } else {
      cadence = d.choose(CADENCES[role as keyof typeof CADENCES])
    }
    add(role, length, {
      cadence,
      ...(role === 'B' ? borrowed : {}),
      pedal: (role === 'A' || role === 'R') && pedal,
      final
    })
  }

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
    form,
    sections,
    bars: bar,
    pentatonic: d.chance(spec.pentatonic),
    density: d.between(spec.density[0], spec.density[1]),
    appoggiatura: d.chance(spec.appoggiatura),
    chime: d.chance(spec.chime),
    ring: lastRing(meter, beat, spec.rubato)
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
  // Satie-like textures hold a chord for a second bar now and then; not a
  // dominant, which in a piece this short would start to sound like home.
  if (
    plan.spec.hold > 0 &&
    history[n - 1] !== history[n - 2] &&
    from !== 'V' &&
    from !== 'V+'
  ) {
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
  const cadence = cadenceDegrees(d, plan, section.cadence)
  const arrival = cadence[1]
  let approach = cadence[0]
  // Straight after the same chord (a half cadence, then a two-bar close),
  // the approach moves under itself rather than sitting still.
  if (approach && length <= 2 && approach[0] === previous) {
    approach = [d.pick(['IV', 'ii'] as const), ...approach.slice(-1)]
  }
  bars[length - 1] = [arrival]
  if (approach) bars[length - 2] = approach

  if (opening) {
    // Begin as the opening phrase began, unless that would leave an applied
    // chord hanging.
    for (const [i, degrees] of opening.entries()) {
      if (bars[i] !== undefined) break
      const target = RESOLVES[degrees.at(-1)!]
      const following = bars[i + 1]?.[0]
      if (target && following !== undefined && following !== target) break
      // Nor run into the cadence on the chord it is about to play.
      if (following !== undefined && degrees.at(-1) === following) break
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
  let previous: Degree = 'I'
  for (const section of sections) {
    if (section.role === 'intro') continue
    // The return begins as the opening did; a repeated idea sometimes does,
    // and sometimes moves to new ground.
    const opening =
      section.role === 'R'
        ? a?.slice(0, 2)
        : section.role === 'A2' && d.chance(0.5)
          ? a?.slice(0, 1)
          : undefined
    const degrees = phraseDegrees(d, plan, section, previous, history, opening)
    degreesBySection.set(section, degrees)
    if (section.role === 'A') a = degrees
    previous = degrees.at(-1)!.at(-1)!
  }

  for (const section of sections) {
    if (section.role !== 'intro') continue
    // The intro previews the opening chords; the waltz vamps on the tonic.
    degreesBySection.set(
      section,
      Array.from({ length: section.bars }, (_, i) =>
        plan.texture === 'waltz' ? ['I'] : [...(a?.[i] ?? ['I'])]
      )
    )
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

  // The last chord, the one left to ring, gets the most colour.
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

/** A note in beats, before tempo, rubato, pedal and dynamics. */
type Event = {
  beat: number
  /** Beats the key is held down. */
  len: number
  midi: number
  velocity: number
  right: boolean
  /** Seconds to nudge the onset: rolls, graces, a pushed chord. */
  shift?: number
  /** The tune itself, which sings a touch ahead of the hands, or lays back. */
  lead?: boolean
  /**
   * Let go of by the pedal: a passing note, an ornament, a sliding chord. It
   * stops `ring` seconds after its key comes up rather than ringing on to the
   * next change of pedal.
   */
  dry?: boolean
  ring?: number
  /** Part of the last chord: held, with the pedal, until the piece ends. */
  final?: boolean
  /** Seconds it lingers before sounding: a phrase's high point. */
  lean?: number
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
  /** The left hand's last chord, for voice-leading the next. */
  leftVoices?: number[]
  /** Highest note for the left hand. */
  leftTop: number
  /** A lower ceiling for this bar, under the loop's figure. */
  ceiling?: number
  /** Lowest note for anything the right hand adds under the tune. */
  rightFloor: number
  /** The melody's range, in scale degrees from home. */
  melodyLo: number
  melodyHi: number
  /** The piece's arpeggio cell and right-hand figure. */
  cell: readonly number[]
  figure: readonly number[]
  figureVoices?: number[]
  /** A deep bass still held by the hand. */
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

// The lowest a pair of neighbouring voices this many semitones apart can sit
// before it turns to mud (index: the interval, up to a major ninth): a
// second no lower than E3, a third C3, a fifth B♭1. An octave goes anywhere.
const LOW_LIMITS = [
  Infinity,
  52,
  51,
  48,
  46,
  45,
  46,
  34,
  43,
  41,
  41,
  41,
  0,
  40,
  38
]

/** Whether `lower` and `upper`, sounding together, would muddy the bass. */
function muddy(lower: number, upper: number) {
  const gap = upper - lower
  if (gap <= 0) return true
  return gap < LOW_LIMITS.length && lower < LOW_LIMITS[gap]!
}

/** The highest the left hand may reach in this bar. */
function ceiling(ctx: Ctx) {
  return Math.min(ctx.leftTop, ctx.ceiling ?? Infinity)
}

const average = (notes: readonly number[]) =>
  notes.reduce((sum, n) => sum + n, 0) / notes.length

/**
 * `count` chord tones for the left hand, between `lo` and `hi` and clear of
 * the `bass` under them: the chord's most telling tones (not the root,
 * unless it runs short), each moving as little as it can from the last
 * chord, within a hand's span and never muddy.
 */
function voiceLeft(
  ctx: Ctx,
  chord: Chord,
  count: number,
  lo: number,
  hi: number,
  bass?: number
): number[] {
  const intervals = chord.tones.slice(1)
  if (intervals.length < count) intervals.push(0)
  const pcs = intervals
    .slice(0, count)
    .map((interval) => mod(ctx.plan.tonic + chord.root + interval, 12))
  const previous = ctx.leftVoices ?? []

  let best: number[] | undefined
  let bestScore = Infinity
  const consider = (notes: number[]) => {
    const sorted = notes.toSorted((x, y) => x - y)
    for (let k = 1; k < sorted.length; k++) {
      if (muddy(sorted[k - 1]!, sorted[k]!)) return
    }
    if (sorted.at(-1)! - sorted[0]! > 12) return
    if (bass !== undefined && muddy(bass, sorted[0]!)) return
    let score = 0.35 * Math.abs(average(sorted) - ctx.leftCenter)
    for (const note of sorted) {
      let move = 5
      for (const voice of previous)
        move = Math.min(move, Math.abs(voice - note))
      score += move
    }
    // A second is colour, best kept to one.
    for (let k = 1; k < sorted.length; k++) {
      if (sorted[k]! - sorted[k - 1]! <= 2) score += 3
    }
    if (score < bestScore) {
      best = sorted
      bestScore = score
    }
  }
  const choose = (i: number, chosen: number[]) => {
    if (i === pcs.length) {
      consider(chosen)
      return
    }
    for (let midi = lo; midi <= hi; midi++) {
      if (mod(midi, 12) === pcs[i] && !chosen.includes(midi)) {
        choose(i + 1, [...chosen, midi])
      }
    }
  }
  choose(0, [])

  if (!best) {
    // Too crowded for all of them: drop the least telling.
    return count > 1 ? voiceLeft(ctx, chord, count - 1, lo, hi, bass) : []
  }
  ctx.leftVoices = best
  // Follow the voicing, but drift back toward the middle of the hand.
  ctx.leftCenter =
    0.55 * ctx.leftCenter + 0.25 * average(best) + 0.2 * (ctx.leftTop - 8)
  return best
}

/**
 * The notes an arpeggio climbs through: the bass, then chord tones above,
 * the plain ones (root, third, fifth, sixth or seventh) up to the tenth and
 * the ninths and elevenths only above it.
 */
function ladder(ctx: Ctx, chord: Chord, bass: number, energy: number) {
  const all = chordPcs(ctx, chord)
  const plain = new Set(
    chord.tones
      .filter((interval) => interval < 12)
      .map((interval) => mod(ctx.plan.tonic + chord.root + interval, 12))
  )
  const top = Math.min(bass + (energy > 0.6 ? 26 : 21), ceiling(ctx) + 2)
  const rungs = [bass]
  for (let midi = bass + 3; midi <= top; midi++) {
    if (!(midi < bass + 16 ? plain : all).has(mod(midi, 12))) continue
    const below = rungs.at(-1)!
    if (midi - below < 3 || muddy(below, midi)) continue
    rungs.push(midi)
  }
  return rungs
}

// ---------------------------------------------------------------------------
// Left hand
// ---------------------------------------------------------------------------

/** A low bass on the beat, then a soft close chord on the next, pedalled. */
function leftWaltz(ctx: Ctx, bar: number, section: Section) {
  for (const span of spansInBar(ctx, bar)) {
    const end = span.beat + span.len
    const bass = bassFor(ctx, span)
    ctx.events.push({
      beat: span.beat,
      len: span.len,
      midi: bass,
      velocity: 0.46,
      right: false
    })
    if (span.len < 2) continue
    const at = span.beat + 1
    const voicing = voiceLeft(ctx, span.chord, 3, 50, ceiling(ctx), bass)
    for (const [i, midi] of voicing.entries()) {
      ctx.events.push({
        beat: at,
        len: end - at,
        midi,
        velocity: 0.27,
        right: false,
        shift: i * 0.008
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
          right: false
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
      const index = t === span.beat ? 0 : ctx.cell[i % ctx.cell.length]!
      ctx.events.push({
        beat: t,
        len: end - t,
        midi: rungs[Math.min(index, rungs.length - 1)]!,
        velocity: (t === span.beat ? 0.4 : 0.27) + 0.012 * index,
        right: false
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
      right: false
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
          right: false
        })
      }
    } else {
      const at = span.beat + (span.len >= 4 ? 2 : 1)
      const voicing = voiceLeft(ctx, span.chord, 2, 48, ceiling(ctx), bass)
      for (const [i, midi] of voicing.entries()) {
        ctx.events.push({
          beat: at,
          len: end - at,
          midi,
          velocity: 0.24,
          right: false,
          shift: i * 0.012
        })
      }
    }
  }
}

/** A deep bass in octaves, held while the harmony above it moves. */
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
        right: false
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
      const below = ctx.held!.at(-1)!.midi
      const voicing = voiceLeft(ctx, span.chord, 2, 52, ceiling(ctx), below)
      for (const [i, midi] of voicing.entries()) {
        ctx.events.push({
          beat: at,
          len: end - at,
          midi,
          velocity: 0.22,
          right: false,
          shift: 0.03 * i
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
    const voicing = voiceLeft(ctx, span.chord, count, 50, ceiling(ctx), bass)
    // Now and then the change arrives an eighth early.
    const push = span.beat > 0 && span.len >= 2 && d.chance(0.22) ? 0.5 : 0
    const at = span.beat - push
    const roll = d.between(0.025, 0.05)
    ctx.events.push({
      beat: at,
      len: end - at,
      midi: bass,
      velocity: 0.44,
      right: false
    })
    for (const [i, midi] of voicing.entries()) {
      ctx.events.push({
        beat: at,
        len: end - at,
        midi,
        velocity: 0.27,
        right: false,
        shift: roll * (i + 1)
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
          shift: 0.01 * i
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
  let lowest = Infinity
  for (const span of spansInBar(ctx, bar)) {
    const voices = figureVoices(ctx, span.chord, bloom)
    lowest = Math.min(lowest, voices[0]!)
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
        right: true
      })
    }
  }
  // The left hand keeps under it.
  ctx.ceiling = lowest - 2
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

type Line = Array<{
  beat: number
  len: number
  deg: number
  velocity: number
  /** The phrase's high point, which lingers a moment. */
  peak?: boolean
  /** Leaning into the last note from a step away. */
  appoggiatura?: boolean
  /** The piece's last melody note, the top of the last chord. */
  final?: boolean
}>

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

/**
 * A phrase's last bar. Mid-piece: a long note on the downbeat, then perhaps
 * a breath. At the very end: the last note on the downbeat, or a lean into
 * it from a step away.
 */
function cadenceCell(
  d: Dice,
  meter: 3 | 4,
  final: boolean,
  lean: boolean
): number[] {
  if (final) {
    if (!lean) return [meter]
    return meter === 3
      ? [1, 2]
      : d.pick([
          [1, 3],
          [2, 2]
        ])
  }
  return meter === 4 ? d.pick([[4], [3, -1], [2, -2]]) : d.pick([[3], [2, -1]])
}

function makeMotif(d: Dice, meter: 3 | 4, density: number): Motif {
  // An idea, not a held note: at least two notes in its first bar.
  let first = rhythmCell(d, meter, density + 0.1)
  for (let tries = 0; tries < 4; tries++) {
    if (first.filter((value) => value > 0).length >= 2) break
    first = rhythmCell(d, meter, density + 0.3 + 0.2 * tries)
  }
  const cells = [first]
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
  let start: number
  switch (section.role) {
    case 'A2':
      // The idea again: as it was, or a step or a third away.
      start = fit((a?.start ?? 2) + d.pick([0, 0, 1, 2, -1]))
      break
    case 'R': {
      const home = a?.start ?? fit(2)
      // Now and then the return comes back an octave up.
      start = d.chance(0.15) && fit(home + 7) === home + 7 ? home + 7 : home
      break
    }
    case 'B':
      start = fit((a?.start ?? 2) + d.pick([2, 3, 4, -3]))
      break
    case 'C':
      // A continuation climbs off the idea.
      start = fit((a?.start ?? 2) + d.pick([1, 2, 3]))
      break
    default:
      start = fit(d.pick([2, 4, 0, 4, 2, 1]))
  }
  const lift = section.role === 'B' || section.role === 'C' ? d.int(1, 2) : 0
  // The piece mostly ends on the tonic, now and then on its third or fifth.
  const goal = section.final
    ? d.weighted([0, 2, 4], [5, 1.2, 1])
    : d.pick(GOALS[section.cadence])
  // Come down to the goal a little below where the phrase began.
  const around = start - 1
  return {
    start,
    peak: Math.min(hi, start + Math.max(top, d.int(2, 4)) + lift),
    peakAt: d.between(0.45, 0.72),
    goal,
    end: clamp(around + mod(goal - around + 3, 7) - 3, lo, hi),
    pentatonic: ctx.plan.pentatonic && section.role !== 'B'
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
  const density = clamp(
    plan.density +
      (section.energy - 0.4) * 0.4 +
      (section.role === 'C' ? 0.12 : 0),
    0,
    1
  )
  const lean = section.final && plan.appoggiatura

  const cells: number[][] = []
  const free: number[] = []
  for (let k = 0; k < section.bars; k++) {
    if (k === section.bars - 1) {
      cells.push(cadenceCell(d, meter, section.final, lean))
    } else if (section.role === 'C' && k < 2 && useRhythm) {
      // A continuation breaks the idea down to its first bar, twice.
      cells.push(motif.cells[0]!)
    } else if (useRhythm && k < motif.cells.length) {
      cells.push(motif.cells[k]!)
    } else {
      cells.push(rhythmCell(d, meter, density))
      free.push(k)
    }
  }
  // A phrase this short can't spend itself on whole notes: at least five
  // notes in four bars, three in two.
  const count = () => cells.flat().filter((value) => value > 0).length
  const fewest = Math.ceil(section.bars * 1.25)
  for (const k of free) {
    if (count() >= fewest) break
    cells[k] = rhythmCell(d, meter, density + 0.35)
  }

  const slots: Array<{ beat: number; len: number }> = []
  for (const [k, cell] of cells.entries()) {
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
  let landing: number | undefined
  for (const [i, slot] of slots.entries()) {
    const p = (slot.beat - start) / total
    const target =
      p < shape.peakAt
        ? lerp(shape.start, shape.peak, p / shape.peakAt)
        : lerp(shape.peak, shape.end, (p - shape.peakAt) / (1 - shape.peakAt))
    const last = i === slots.length - 1
    const leaning = lean && i === slots.length - 2
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
    if (leaning || last) {
      // Land on the goal, in the octave nearest the note before; lean into
      // it from the step above, or up from the leading tone.
      if (landing === undefined) {
        landing = deg + mod(shape.goal - deg + 3, 7) - 3
        // Out of range, the same note an octave over.
        while (landing < lo) landing += 7
        while (landing > hi) landing -= 7
      }
      next = last
        ? landing
        : landing + (mod(landing, 7) === 0 && d.chance(0.3) ? -1 : 1)
    } else {
      next = reflect(next)
      const chord = chordAt(ctx, slot.beat)
      const inBar = mod(slot.beat, meter)
      const strong =
        inBar < 1e-9 ||
        (meter === 4 && Math.abs(inBar - 2) < 1e-9) ||
        slot.len >= 1.5
      if (strong || slot.len >= 1) {
        next = snap(ctx, next, chord, target - next, pentatonic)
      } else if (!pentatonic(next)) {
        next += next >= deg ? 1 : -1
      }
      // Never the same note three times running.
      if (line.length >= 2 && next === deg && line.at(-2)!.deg === deg) {
        const away = target >= deg ? 1 : -1
        const repeated = deg
        next = snap(ctx, deg + away, chord, away, (x) => x !== repeated)
        if (next === deg) next = deg + away
      }
      next = reflect(next)
    }

    // Louder toward the peak, softer into the cadence; strong beats lean,
    // and a lean onto the last note sighs into it.
    const inBar = mod(slot.beat, meter)
    const strong = inBar < 1e-9 || (meter === 4 && Math.abs(inBar - 2) < 1e-9)
    const reach =
      1 - Math.abs(p - shape.peakAt) / Math.max(shape.peakAt, 1 - shape.peakAt)
    const velocity =
      0.66 *
      (0.88 + 0.2 * reach) *
      (strong ? 1.05 : 0.93) *
      (leaning ? 1 : last ? (lean ? 0.8 : 0.9) : 1) *
      (1 + 0.012 * (next - shape.start))

    interval = next - deg
    deg = next
    line.push({
      beat: slot.beat,
      len: slot.len,
      deg,
      velocity,
      appoggiatura: leaning || undefined,
      final: (last && section.final) || undefined
    })
  }

  // The phrase's high point, if it isn't where it starts or ends.
  let top = 0
  for (const [i, note] of line.entries()) if (note.deg > line[top]!.deg) top = i
  if (top > 0 && top < line.length - 1) line[top]!.peak = true
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

/**
 * Play a phrase's tune, dressed for the section's right-hand mode. Returns
 * the last note's MIDI number when it is the piece's last.
 */
function playLine(
  ctx: Ctx,
  section: Section,
  line: Line,
  planing: Planing,
  fill: boolean
): number | undefined {
  const { d, plan } = ctx
  const { spec, texture } = plan
  const doubled =
    section.energy >= 0.75 && (texture === 'arpeggio' || texture === 'loop')
  let previous: Event | undefined
  let final: number | undefined

  for (const note of line) {
    const chord = chordAt(ctx, note.beat)
    const midi = degreeMidi(ctx, note.deg, chord)
    // Chord tones ring on with the pedal; passing notes, and a lean onto the
    // last note, are let go as the next note sounds.
    const passing = note.appoggiatura || !isStable(ctx, note.deg, chord)
    const event: Event = {
      beat: note.beat,
      len: note.len,
      midi,
      velocity: note.velocity * (note.peak ? 1.05 : 1),
      right: true,
      lead: true,
      dry: passing && !note.final,
      ring: 0.04,
      final: note.final,
      lean: note.peak ? 0.015 + 0.05 * spec.rubato : undefined
    }
    if (note.final) final = midi

    if (
      previous &&
      note.len >= 2 &&
      previous.len >= 1 &&
      Math.abs(previous.beat + previous.len - note.beat) < 1e-9 &&
      !note.final &&
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
          right: true,
          dry: true,
          ring: 0.03
        })
      }
    } else if (
      previous &&
      note.len >= 1 &&
      !note.final &&
      d.chance(spec.ornament)
    ) {
      // A grace note: a slip up from a semitone below, or down from above.
      ctx.events.push({
        beat: note.beat,
        len: 0,
        midi: d.chance(0.6) ? midi - 1 : degreeMidi(ctx, note.deg + 1, chord),
        velocity: note.velocity * 0.5,
        right: true,
        shift: -0.075,
        dry: true,
        ring: 0.05
      })
    }

    ctx.events.push(event)
    previous = event

    if (section.right === 'planing' && !note.final) {
      // Chord shapes sliding under the tune in parallel, each let go as the
      // next arrives.
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
            dry: true,
            ring: 0.06
          })
        }
      }
    } else if (section.right === 'upper' && note.len >= 1 && !note.final) {
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
          shift: d.chance(0.5) ? -0.02 : 0.015
        })
      }
    } else if (
      doubled &&
      note.len >= 1 &&
      !note.final &&
      midi - 12 >= ctx.rightFloor
    ) {
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
        right: true,
        dry: true,
        ring: 0.03
      })
    }
  }
  return final
}

/** Neo-soul comping: a soft off-beat dyad wherever the tune rests. */
function comp(ctx: Ctx, section: Section, line: Line) {
  const { meter, tonic, bars } = ctx.plan
  const start = section.bar * meter
  // Not over the last chord, which is left alone to ring.
  const end = Math.min(start + section.bars * meter, (bars - 1) * meter)
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
        right: true
      })
    }
  }
}

/**
 * The last chord: a low tonic, rolled up through a fifth or octave and a
 * couple of chord tones, with one or two more under the tune's last note,
 * all held to the end.
 */
function playEnding(ctx: Ctx, top: number | undefined) {
  const { d, plan } = ctx
  const beat = (plan.bars - 1) * plan.meter
  const chord = chordAt(ctx, beat)
  const pcs = chordPcs(ctx, chord)
  const melody = top ?? degreeMidi(ctx, d.weighted([0, 2, 4], [3, 1, 1]), chord)

  const bass = place(plan.tonic, 40, 36, 47)
  const second = d.chance(0.6) ? bass + 7 : bass + 12
  const upper = voiceLeft(
    ctx,
    chord,
    2,
    second + 3,
    Math.min(ctx.leftTop, melody - 8),
    second
  )
  const left = [bass, second, ...upper]
  const roll = d.between(0.035, 0.06) * (1 + plan.spec.rubato)
  for (const [i, midi] of left.entries()) {
    ctx.events.push({
      beat,
      len: plan.meter,
      midi,
      velocity: i === 0 ? 0.44 : 0.27,
      right: false,
      shift: i * roll,
      final: true
    })
  }

  const right: number[] = []
  if (top === undefined) right.push(melody)
  let above = melody
  const under = top === undefined ? 3 : 2
  for (let m = melody - 3; m > left.at(-1)! + 2 && right.length < under; m--) {
    if (!pcs.has(mod(m, 12)) || above - m < 3) continue
    if (melody - m > 10) break
    right.push(m)
    above = m
  }
  for (const [i, midi] of right.entries()) {
    ctx.events.push({
      beat,
      len: plan.meter,
      midi,
      velocity: midi === melody ? 0.5 : 0.28,
      right: true,
      shift: left.length * roll + (right.length - i) * 0.03,
      final: true
    })
  }
}

/**
 * Over the last chord, once it has settled: a soft, high chime that climbs
 * the tonic's pentatonic to rest on a note of its triad, above the tune.
 */
function playChime(ctx: Ctx, above: number) {
  const { d, plan } = ctx
  const { meter, tonic } = plan
  const start = (plan.bars - 1) * meter
  const triad = new Set([0, 4, 7].map((interval) => mod(tonic + interval, 12)))
  const pentatonic = new Set(
    [0, 2, 4, 7, 9].map((interval) => mod(tonic + interval, 12))
  )
  let top = above + 5
  while (top <= 91 && !triad.has(mod(top, 12))) top++
  if (top > 91) return

  const count = d.int(1, 3)
  const notes = [top]
  for (let m = top - 2; m >= top - 9 && notes.length <= count; m--) {
    if (pentatonic.has(mod(m, 12)) && notes.at(-1)! - m >= 2) notes.push(m)
  }
  notes.reverse()
  // After the lean has resolved, and before the bar is out.
  const from = start + (plan.appoggiatura ? 2.5 : d.pick([1.5, 2]))
  const step = Math.min(1, (start + meter + 0.75 - from) / notes.length)
  for (const [i, midi] of notes.entries()) {
    ctx.events.push({
      beat: from + i * step,
      len: meter,
      midi,
      velocity: i === notes.length - 1 ? 0.32 : 0.27,
      right: true,
      final: true
    })
  }
}

// ---------------------------------------------------------------------------
// Performance: tempo, rubato, pedal, dynamics, touch
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
      // The approach to the last chord broadens, and it arrives late.
      let breath = 0
      if (bar === plan.bars - 2) {
        e += d.between(0.12, 0.25) + r * 0.2
        breath = beat * d.between(0.12, 0.3 + r * 0.3)
      } else if (last && bar < plan.bars - 1) {
        // A breath between phrases.
        breath = beat * d.between(0.05, 0.12 + r * 0.35)
      }
      if (bar === plan.bars - 1) {
        s += 0.12
        e += d.between(0.45, 0.8)
      }
      from.push(s)
      to.push(e)
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
  const { sections, meter, bars } = ctx.plan
  const bar = beat / meter
  const section = sections.find((s) => bar < s.bar + s.bars) ?? sections.at(-1)!
  // The last chord is played at the quiet the piece has come down to.
  if (bar >= bars - 1) return section.levels[1]
  // Each section swells a little through its middle; the last one holds
  // its level, then lets go into the cadence.
  const length = section.final ? section.bars - 1 : section.bars
  const x = clamp((bar - section.bar) / length, 0, 1)
  const t = section.final ? x ** 1.8 : x
  return (
    lerp(section.levels[0], section.levels[1], t) *
    (1 + 0.05 * Math.sin(Math.PI * x))
  )
}

type Performed = ImprovNote & { right: boolean }

/** Fifteen to thirty seconds, until the last key is let go. */
const SHORTEST = 15.5
const LONGEST = 29.5

function perform(ctx: Ctx) {
  const { d, plan } = ctx
  const { spec, meter } = plan
  const time = tempoMap(ctx)
  const last = (plan.bars - 1) * meter

  // The pedal comes up a moment after each new chord (or bass) is struck,
  // so the old harmony is caught just into the new, then goes straight back
  // down. Over the last chord it stays down until the end.
  const lifts: number[] = []
  for (const [i, span] of ctx.spans.entries()) {
    if (i === 0) continue
    lifts.push(time(span.beat) + d.between(0.06, 0.12) * (1 + spec.rubato))
  }
  const liftAfter = (t: number) => {
    let lo = 0
    let hi = lifts.length
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (lifts[mid]! < t) lo = mid + 1
      else hi = mid
    }
    return lifts[lo]
  }

  // A shared, wandering push and pull on each beat, so the hands move
  // together, then a little looseness of their own.
  const drift: number[] = [0]
  for (let i = 1; i <= plan.bars * meter + 1; i++) {
    drift.push(0.65 * drift[i - 1]! + d.jitter(0.006 * (1 + spec.rubato)))
  }
  const driftAt = (beat: number) => {
    const i = clamp(Math.floor(beat), 0, drift.length - 2)
    return lerp(drift[i]!, drift[i + 1]!, clamp(beat - i, 0, 1))
  }
  const spread = 0.004 + 0.008 * spec.rubato

  const clear = liftAfter(time(last)) ?? time(last)

  // Where the last chord lands, and how long it rings (past any chime).
  let end = time(last) + plan.ring
  for (const event of ctx.events) {
    if (event.final && event.beat > last + 1e-9) {
      end = Math.max(end, time(event.beat) + 2.4)
    }
  }

  const played: Performed[] = []
  for (const event of ctx.events) {
    const offbeat = Math.abs(mod(event.beat, 1) - 0.5) < 1e-6
    const beat = event.beat + (offbeat ? spec.swing : 0)
    const start =
      time(beat) +
      driftAt(event.beat) +
      (event.shift ?? 0) +
      (event.lead ? spec.lag : 0) +
      (event.lean ?? 0) +
      d.jitter(spread)
    let release: number
    if (event.final) {
      release = end
    } else {
      const up = time(beat + event.len)
      release = event.dry
        ? up + (event.ring ?? 0.03)
        : (liftAfter(Math.max(up, start + 0.05)) ?? end)
      // The pedal change under the last chord clears everything before it.
      if (event.beat < last) release = Math.min(release, Math.max(up, clear))
    }
    played.push({
      midi: event.midi,
      start,
      duration: Math.max(0.06, release - start),
      velocity: clamp(
        event.velocity * levelAt(ctx, event.beat) * (1 + d.jitter(0.03)),
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

  // Keep the whole piece inside fifteen to thirty seconds; the plan aims for
  // the middle, so this rarely has much to do.
  let length = 0
  for (const note of notes)
    length = Math.max(length, note.start + note.duration)
  const scale =
    length > LONGEST
      ? LONGEST / length
      : length < SHORTEST
        ? SHORTEST / length
        : 1
  if (scale !== 1) {
    for (const note of notes) {
      note.start *= scale
      note.duration *= scale
    }
    length *= scale
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
    duration: length,
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
    leftCenter: home - 15,
    leftTop: home - 8,
    rightFloor: home - 14,
    melodyLo,
    melodyHi,
    cell: d.pick(CELLS[meter]),
    figure: d.pick(FIGURES[meter])
  }

  // The accompaniment, bar by bar, the right hand's figure first so the left
  // can keep under it. The approach to the end calms down; the last bar is
  // the final chord.
  for (const section of plan.sections) {
    for (let k = 0; k < section.bars; k++) {
      const bar = section.bar + k
      if (bar === plan.bars - 1) continue
      const calm =
        bar === plan.bars - 2
          ? { ...section, energy: section.energy * 0.6 }
          : section
      ctx.ceiling = undefined
      if (section.right === 'figure') rightFigure(ctx, bar, calm)
      LEFT[section.left](ctx, bar, calm)
    }
  }
  ctx.ceiling = undefined

  // The tune: a motif, stated, repeated or sequenced, and brought home.
  const motif = makeMotif(d, meter, plan.density)
  const shapes = new Map<Role, Shape>()
  const planings = new Map<'A' | 'B', Planing>()
  let top: number | undefined
  for (const section of plan.sections) {
    if (section.role === 'intro') continue
    const shape = planShape(ctx, section, motif, shapes)
    if (!shapes.has(section.role)) shapes.set(section.role, shape)
    if (!section.melody) continue

    const away = section.role === 'B' || section.role === 'C'
    const group = section.role === 'B' ? 'B' : 'A'
    let planing = planings.get(group)
    if (!planing) {
      const real = group === 'B' && texture === 'planing' && d.chance(0.45)
      planing = { shape: d.pick(real ? REAL_SHAPES : DIATONIC_SHAPES), real }
      planings.set(group, planing)
    }
    const line = composeLine(
      ctx,
      section,
      motif,
      shape,
      !away || d.chance(0.6),
      !away || d.chance(0.7)
    )
    top =
      playLine(ctx, section, line, planing, d.chance(plan.spec.fills)) ?? top
  }

  playEnding(ctx, top)
  if (plan.chime) playChime(ctx, top ?? home)

  const { notes, duration, scale } = perform(ctx)
  return {
    notes,
    duration,
    keyName,
    texture,
    bpm: Math.round(60 / (plan.beat * scale))
  }
}
