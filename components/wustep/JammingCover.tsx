import {
  createContext,
  type CSSProperties,
  type ReactNode,
  useContext,
  useId,
  useMemo
} from 'react'

import styles from './JammingCover.module.css'

/**
 * JammingCover — the trio.
 *
 *   Cover for the Jamming playground entry: three of the band on the app's
 *   stage, under its bunting, drawn the app's way (crayon outlines over a
 *   solid under-fill, hatching in the fur colour) from its own shapes and
 *   colours: Lily the frog on upright bass, Olive the sheep on cello, and
 *   Rusty the fox, the leader, on trumpet. At rest it is one beat of the
 *   tune, half way through Olive's down-bow, with a few of Rusty's notes
 *   in the air.
 *
 *   Awake, the band plays two bars on a loop: Olive draws the bow down one
 *   bar and back up the next, Lily plucks every beat and nods along, and
 *   Rusty rocks with the tune while his notes float up out of the bell.
 *
 *   An arm is an upper arm and a forearm of one fixed length, as in the app
 *   (art/arm.ts), drawn as a chain of turns (shoulder, elbow, wrist), each
 *   segment a fixed line in its own frame, so no keyframe can stretch one.
 *   The turns are solved for the paw's target at each keyframe. The bow
 *   rides in the wrist's frame, and the wrist turns back whatever the
 *   shoulder and elbow turn, so the bow keeps its angle across the strings.
 *
 *   Every motion is a CSS animation on one 3.8s loop (two bars at 126 bpm)
 *   or one beat of it, so the og:video recorder's virtual clock
 *   (scripts/og-video) poses it like the other covers, and fits it into
 *   its 7.6s loop at exactly live pace. The keyframes are generated below
 *   from the same functions as the rest pose, the way ContraptionsCover's
 *   are, so the paused frame, the reduced-motion frame and the recorder's
 *   frame 0 are one frame.
 */

// ---- stage -----------------------------------------------------------------

/**
 * The stage. The cover box is 190px tall at every card width and 1.8 to 2.3
 * times as wide on the grid, so `meet` fits the stage's height, and the
 * paper and bunting run on into the wings past its edges (the SVG doesn't
 * clip). A narrower box shrinks the whole stage instead of losing a player.
 */
const STAGE_W = 640
const STAGE_H = 360
/**
 * Each player is drawn in the app's own character space (240×260, ground at
 * y 246, centred on x 120: animals.tsx) and scaled into the stage by this.
 */
const K = 1
/** Where the players stand, in stage units. */
const FLOOR = 340
/**
 * Each player's centre line, in stage units. The band and Rusty's notes
 * span about 24–612: the whole stage a phone's card shows (its box is 190px
 * tall and about 1.8 times as wide), centred. Wider cards show more paper
 * and bunting either side.
 */
const AT = { lily: 84, olive: 253, rusty: 432 }

// ---- the tune --------------------------------------------------------------

/**
 * Two bars of 4/4 at 126 bpm. The og:video clock fits a whole number of
 * each loop into its own 7.6s (clock.js): this one twice, the beat 16
 * times, both at live pace.
 */
const LOOP = 3.8
const BEAT = LOOP / 8
/**
 * The rest pose: half way through the down-bow, Lily's finger just back on
 * the string, three notes in the air (low, mid and fading at the top).
 */
const T_POSE = 0.86

// ---- palette ---------------------------------------------------------------

// The app's own colours: art/sketch.tsx, music/instruments.ts and the rigs.
const PAPER = '#f6f0e1'
const PENCIL = '#2c2a35'
const BLUSH = '#f08c9a'
const WHITE = '#fffdf4'
const FROG = { ink: '#2f6b2a', fill: '#8cc56a', belly: '#e6efb6' }
const SHEEP = {
  ink: '#5a4636',
  fill: '#d9c7a3',
  wool: '#f6eedd',
  woolHatch: '#e3d3b0',
  face: '#a68b72',
  faceHatch: '#8a6f58',
  inner: '#e7a9a6',
  feet: '#4a3a2e',
  hoof: '#5a4636'
}
const FOX = {
  ink: '#b0461b',
  fill: '#f0954f',
  white: '#fbf3e4',
  feet: '#7a3a18',
  tip: '#4a2a1a'
}
const BASS = { wood: '#9a5424', hatch: '#c27a3d' }
const CELLO = { wood: '#c0712f', hatch: '#e29a55' }
const WOOD_INK = '#6b3a12'
const BOARD = '#2c2a35'
const STRING = '#efe6cf'
const BRIDGE = '#f1d9a8'
const HAIR = '#f6efdc'
const BOW_STICK = '#5a3418'
const STOOL = { ink: '#5b3a20', wood: '#b77b45' }
const BRASS = {
  fill: '#f2c14e',
  hatch: '#d9a12e',
  ink: '#8a6418',
  pearl: '#fffaf0'
}
/** The pennants take the app's five coloured pencils. */
const PENCILS = ['#c8463c', '#e2a93b', '#3b5bab', '#4f8a3a', '#5a4a9e']

/** Theme-dependent inks; the stylesheet swaps them for dark mode. */
const INK = 'var(--jc-ink)'
const NOTE = 'var(--jc-note)'

function mix(a: string, b: string, t: number): string {
  const ca = Number.parseInt(a.slice(1), 16)
  const cb = Number.parseInt(b.slice(1), 16)
  let out = '#'
  for (const shift of [16, 8, 0]) {
    const x = (ca >> shift) & 255
    const y = (cb >> shift) & 255
    out += Math.round(x + (y - x) * t)
      .toString(16)
      .padStart(2, '0')
  }
  return out
}

/** A lighter tint toward the paper, as the app under-fills its shapes. */
const tint = (c: string, t = 0.35) => mix(c, PAPER, t)

// ---- sketching -------------------------------------------------------------

/**
 * One decimal is plenty at card size, and rounding keeps the markup the
 * server sends identical to what the client computes — raw trig can differ
 * in the last digit between engines, which React reports as a hydration
 * mismatch.
 */
const n1 = (v: number) => String(Math.round(v * 10) / 10)
const n2 = (v: number) => String(Math.round(v * 100) / 100)

/**
 * Seeded noise in [-1, 1) (mulberry32): integer arithmetic only, so every
 * engine draws the same wobble.
 */
function noise(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d_2b_79_f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), a | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return (((t ^ (t >>> 14)) >>> 0) / 4_294_967_296) * 2 - 1
  }
}

/**
 * A path redrawn by hand: every coordinate nudged by up to `amount`, seeded.
 * Arc parameters are copied as they are, since their flags can't take a
 * nudge.
 */
function wobble(d: string, seed: number, amount = 1): string {
  const rnd = noise(seed)
  let arc = false
  return d
    .replaceAll(/[A-Za-z]|-?\d*\.?\d+/g, (token) => {
      if (/[A-Za-z]/.test(token)) {
        arc = token === 'a' || token === 'A'
        return ` ${token}`
      }
      return ` ${arc ? token : n1(Number(token) + rnd() * amount)}`
    })
    .trim()
}

/**
 * An ellipse as rough.js draws one, which the app's outlines are: eight
 * arcs, each radius a little off, starting anywhere. `run` past 1 carries
 * the line on past where it began, so the ends overlap instead of meeting.
 * The first turn is the same for every `run`, so an outline lands on its
 * own fill.
 */
function ellipse(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
  run = 1
): string {
  const rnd = noise(seed)
  const n = 8
  const step = (Math.PI * 2) / n
  const start = rnd() * Math.PI
  const count = Math.round(n * run)
  const rho: number[] = []
  for (let i = 0; i <= count; i++) {
    rho.push(i === n ? rho[0]! : 1 + rnd() * 0.045)
  }
  const at = (i: number) => {
    const th = start + i * step
    const r = rho[i]!
    return {
      x: cx + rx * r * Math.cos(th),
      y: cy + ry * r * Math.sin(th),
      tx: -rx * r * Math.sin(th),
      ty: ry * r * Math.cos(th)
    }
  }
  // Control-arm length for a circular arc of `step` radians.
  const arm = (4 / 3) * Math.tan(step / 4)
  const p0 = at(0)
  let d = `M${n1(p0.x)} ${n1(p0.y)}`
  for (let i = 1; i <= count; i++) {
    const a = at(i - 1)
    const b = at(i)
    d += `C${n1(a.x + arm * a.tx)} ${n1(a.y + arm * a.ty)} ${n1(b.x - arm * b.tx)} ${n1(b.y - arm * b.ty)} ${n1(b.x)} ${n1(b.y)}`
  }
  return run === 1 ? `${d}Z` : d
}

/**
 * A puffy cloud outline, the app's scallopPath: `bumps` round lobes around
 * an ellipse. Wool, here.
 */
function scallop(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  bumps: number,
  puff: number,
  start = -Math.PI / 2
): string {
  const pt = (a: number, k: number) =>
    `${n1(cx + Math.cos(a) * rx * k)} ${n1(cy + Math.sin(a) * ry * k)}`
  const step = (Math.PI * 2) / bumps
  let d = `M${pt(start, 1)}`
  for (let i = 0; i < bumps; i++) {
    const a0 = start + i * step
    const a1 = a0 + step
    d += `C${pt(a0 + step * 0.12, 1 + puff * 1.15)} ${pt(a1 - step * 0.12, 1 + puff * 1.15)} ${pt(a1, 1)}`
  }
  return `${d}Z`
}

/** Little wool curls ("e" loops) at the given points (animals.tsx). */
function curls(points: [number, number][], r = 3.4): string {
  return points
    .map(([x, y], i) => {
      const k = i % 2 ? 1 : -1
      return `M${x - r} ${y + r * 0.2} a${r} ${r} 0 1 1 ${n1(r * 1.6)} ${n1(r * 0.9 * k)}`
    })
    .join(' ')
}

/** A shape's outline, drawn for a seed; `run` only matters to ellipses. */
type Outline = (seed: number, run: number) => string
const ell =
  (cx: number, cy: number, rx: number, ry: number): Outline =>
  (seed, run) =>
    ellipse(cx, cy, rx, ry, seed, run)
const pth =
  (d: string, amount = 1): Outline =>
  (seed) =>
    wobble(d, seed, amount)

/**
 * Hatching, as tiled strokes in the fill colour. Two strokes a tile, a
 * little unevenly spaced, so it reads as drawn rather than ruled. Tiles
 * are in the drawing's own units, so the hatch scales and turns with it.
 */
type Hatch = { color: string; gap?: number; w?: number; angle?: number }
const HATCHES = {
  shadow: { color: 'var(--jc-shadow)', gap: 3.4, w: 1.4, angle: 14 },
  blush: { color: BLUSH, gap: 2.8, w: 1.7, angle: 58 },
  frog: { color: FROG.fill },
  frogBelly: { color: mix(FROG.belly, FROG.fill, 0.35), gap: 6.5 },
  bass: { color: BASS.hatch },
  wool: { color: SHEEP.woolHatch },
  face: { color: SHEEP.face },
  ear: { color: SHEEP.faceHatch, gap: 4.2 },
  hoof: { color: mix(SHEEP.hoof, '#000000', 0.3), gap: 4 },
  sheepFeet: { color: SHEEP.feet, gap: 4.5 },
  stool: { color: STOOL.wood },
  cello: { color: CELLO.hatch },
  fox: { color: FOX.fill },
  foxFeet: { color: FOX.feet, gap: 4.5 },
  brass: { color: BRASS.hatch, gap: 4.5 }
} satisfies Record<string, Hatch>
type HatchName = keyof typeof HATCHES

/** Outline weight, in character units: the app's 2.1, thickened for card size. */
const W = 3
/** The app's crayon break-up of an outline. */
const CRAYON = '9 1.2 5 0.8 14 1.4'

// ---- the tracks ------------------------------------------------------------

type Pt = { x: number; y: number }

/** A pose of one moving part; only the fields a track sets are written. */
type Pose = {
  x?: number
  y?: number
  r?: number
  s?: number
  sy?: number
  o?: number
}

type Track = {
  /** Seconds a cycle: the loop, or one beat for what every beat does alike. */
  period: number
  /** Keyframe times within the period, in seconds. */
  times: number[]
  /** Where the part is at `t` seconds into its period. Periodic. */
  at: (t: number) => Pose
}

/** Where in its own period a track rests: the loop's rest moment. */
const restIn = (track: Track) =>
  Math.round((T_POSE % track.period) * 1000) / 1000

function transformOf(p: Pose, css: boolean): string {
  const px = css ? 'px' : ''
  const sep = css ? ',' : ' '
  const parts: string[] = []
  if (p.x !== undefined || p.y !== undefined) {
    parts.push(`translate(${n1(p.x ?? 0)}${px}${sep}${n1(p.y ?? 0)}${px})`)
  }
  if (p.r !== undefined) parts.push(`rotate(${n2(p.r)}${css ? 'deg' : ''})`)
  if (p.s !== undefined) parts.push(`scale(${n2(p.s)})`)
  if (p.sy !== undefined) parts.push(`scale(1${sep}${n2(p.sy)})`)
  return parts.join(' ')
}

function declarationsOf(p: Pose): string {
  const transform = transformOf(p, true)
  return [
    transform && `transform:${transform}`,
    p.o === undefined ? '' : `opacity:${n2(p.o)}`
  ]
    .filter(Boolean)
    .join(';')
}

/** Evenly spaced keyframe times across a period. */
const every = (period: number, count: number) =>
  Array.from({ length: count }, (_, i) => (period * i) / count)

/** The same offsets (seconds) after each of the loop's beats. */
const onBeats = (offsets: number[]) =>
  Array.from({ length: 8 }, (_, b) => offsets.map((o) => b * BEAT + o)).flat()

/** 0 → 1 → 0 across a period: a smooth bob. */
const bob = (t: number, period: number) =>
  (1 - Math.cos((2 * Math.PI * t) / period)) / 2

const rad = (deg: number) => (deg * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI
/** An angle (degrees) brought within 180° of `to`, so no joint spins the long way. */
const near = (a: number, to = 0) => a - 360 * Math.round((a - to) / 360)

/** An instrument's own frame: its origin, tilt and scale in the player's space. */
type Frame = { at: Pt; tilt: number; scale: number }

function place(frame: Frame, p: Pt): Pt {
  const c = Math.cos(rad(frame.tilt))
  const s = Math.sin(rad(frame.tilt))
  const x = p.x * frame.scale
  const y = p.y * frame.scale
  return { x: frame.at.x + x * c - y * s, y: frame.at.y + x * s + y * c }
}

/** A frame standing on its endpin, tilted from upright, centre `lift` up. */
function standing(endpin: Pt, lift: number, tilt: number, scale = 1): Frame {
  return {
    at: {
      x: endpin.x + lift * scale * Math.sin(rad(tilt)),
      y: endpin.y - lift * scale * Math.cos(rad(tilt))
    },
    tilt,
    scale
  }
}

type Joints = { up: number; fore: number; wrist: number }

/**
 * The turns (degrees) that put a paw at `hand`: the upper arm from the
 * shoulder, the forearm from the elbow, and the paw from the wrist to `paw`
 * degrees on the page, as the app's rigs turn a paw (pawRot; 0 is fingers
 * up). Upper arm and forearm are both `len` long; a paw asked past the arm's
 * reach stops at the end of it, as in the app (the poses here never ask).
 * The elbow bends clockwise of the shoulder→paw line on the page, which
 * keeps every elbow here pointing out, away from the body.
 */
function reach(
  shoulder: Pt,
  hand: Pt,
  len: number,
  paw: number,
  upNear = 0
): Joints {
  const dx = hand.x - shoulder.x
  const dy = hand.y - shoulder.y
  const d = Math.min(Math.hypot(dx, dy), 2 * len * 0.995)
  const up = near(deg(Math.atan2(dy, dx) + Math.acos(d / (2 * len))), upNear)
  const ex = shoulder.x + len * Math.cos(rad(up))
  const ey = shoulder.y + len * Math.sin(rad(up))
  const fore = deg(Math.atan2(hand.y - ey, hand.x - ex))
  return { up, fore: near(fore - up), wrist: near(paw - fore) }
}

/** Three tracks for an arm whose paw follows `hand(t)`. */
function armTracks(
  period: number,
  times: number[],
  solve: (t: number) => Joints
): [Track, Track, Track] {
  return [
    { period, times, at: (t) => ({ r: solve(t).up }) },
    { period, times, at: (t) => ({ r: solve(t).fore }) },
    { period, times, at: (t) => ({ r: solve(t).wrist }) }
  ]
}

// ---- the band's anatomy (animals.tsx ANCHOR) --------------------------------

const SHOULDER_L = { x: 91, y: 170 }
const SHOULDER_R = { x: 149, y: 170 }
const NECK = { x: 120, y: 158 }
/** Arm thickness (half-widths) at the shoulder and the wrist (arm.ts). */
const ARM_W = { upper: 7, fore: 5.4 }

// ---- Lily's bass (rigs/strings.tsx) -----------------------------------------

/** The double bass, string 0 (E) on the viewer's right; neck along −y. */
const CB = {
  nut: -110,
  bridge: 30,
  fbEnd: 18,
  sx: (i: number, y: number) => {
    const t = (y + 110) / 140
    return 3.3 - 2.2 * i + (5.6 - 3.7 * i - (3.3 - 2.2 * i)) * t
  }
}
/** As tall as she is, standing just in front of her left side. */
const BASS_FRAME = standing({ x: 150, y: 251 }, 72, 2, 0.94)
/** A bass player's reach is long (the rig's 80): two segments of 40. */
const BASS_ARM = 40

/**
 * The plucking finger: rests on the string, pulls through on the beat,
 * drifts back, and is back on the string by the next one (the rig's pull,
 * `ready` and flick, a little gentler).
 */
function pluckFlick(t: number): number {
  const pull =
    t < 0.12
      ? Math.sin((t / 0.12) * (Math.PI / 2))
      : Math.exp(-(t - 0.12) / 0.12)
  const toNext = BEAT - t
  const ready = toNext < 0.15 ? 1 - toNext / 0.15 : 0
  return Math.max(0, pull * (1 - ready)) * 9
}
const lilyPluck = (t: number) => {
  const flick = pluckFlick(t)
  const y = CB.fbEnd + 3
  const hand = place(BASS_FRAME, {
    x: CB.sx(1.5, y) - 4 + flick * 0.45,
    y: y + flick * 0.75
  })
  return reach(SHOULDER_L, hand, BASS_ARM, 60, 60)
}
const stopFrac = (semis: number) => 1 - 2 ** (-semis / 12)
/** The stopping paw, behind the neck a little below the note (a D, 3 up the A string). */
const LILY_STOP = (() => {
  const y = CB.nut + (CB.bridge - CB.nut) * stopFrac(3) + 9
  return reach(
    SHOULDER_R,
    place(BASS_FRAME, { x: CB.sx(1.5, y) + 8, y }),
    BASS_ARM,
    -40,
    -40
  )
})()

// ---- Olive's cello ----------------------------------------------------------

/** The cello, neck along −y, string 0 (C) on the viewer's right. */
const VC = {
  nut: -86,
  bridge: 22,
  fbEnd: 10,
  sx: (i: number, y: number) => {
    const t = (y + 86) / 108
    return 3 - 2 * i + (4.5 - 3 * i - (3 - 2 * i)) * t
  }
}
/** Between her knees on its endpin, leaning so the scroll sits by her ear. */
const CELLO_FRAME = standing({ x: 110, y: 251 }, 60, 17)
const CELLO_ARM = 30
const BOW_LEN = 100
/** The bow crosses the strings square to them, so at the cello's own tilt. */
const BOW_ANGLE = CELLO_FRAME.tilt
/**
 * Her bowing hoof's turn: the app's mid-bow pawRot, held, so the bow (which
 * the wrist carries at BOW_ANGLE − BOW_PAW) keeps its angle all the way.
 */
const BOW_PAW = 10
/** Where the hair meets the middle strings, between the f-holes and the bridge. */
const CONTACT = place(CELLO_FRAME, { x: 0, y: 12 })

/**
 * How far along the bow the strings are (0 at the frog, 1 at the tip): one
 * down-bow a bar, then one up-bow, biting quickly and easing into the change
 * of bow so it is never a reversal at full speed (the app's bowCurve).
 */
function bowAt(t: number): number {
  const bar = LOOP / 2
  const p = (t % bar) / bar
  const k = 0.25 * p + 0.75 * (1 - (1 - p) ** 1.6)
  const [from, to] = t < bar ? [0.18, 0.82] : [0.82, 0.18]
  return from + (to - from) * k
}
/** The paw holds the frog, so it slides along the bow's own line. */
const bowHand = (t: number): Pt => {
  const along = bowAt(t) * BOW_LEN
  return {
    x: CONTACT.x - Math.cos(rad(BOW_ANGLE)) * along,
    y: CONTACT.y - Math.sin(rad(BOW_ANGLE)) * along
  }
}
const oliveBow = (t: number) =>
  reach(SHOULDER_L, bowHand(t), CELLO_ARM, BOW_PAW, 150)
const OLIVE_STOP = reach(
  SHOULDER_R,
  place(CELLO_FRAME, { x: 5, y: -58 }),
  CELLO_ARM,
  -30,
  -30
)

// ---- Rusty's trumpet (rigs/horns.tsx) ---------------------------------------

/** At the mouth, bell tipped up a little, as he plays a high note. */
const TRUMPET_FRAME: Frame = { at: { x: 120, y: 136 }, tilt: -8, scale: 1.12 }
const TRUMPET_ARM = 38
/** The right paw rests on the valves, the left cradles the leadpipe. */
const RUSTY_R = reach(
  SHOULDER_R,
  place(TRUMPET_FRAME, { x: 62, y: -8 }),
  TRUMPET_ARM,
  -10,
  -20
)
const RUSTY_L = reach(
  SHOULDER_L,
  place(TRUMPET_FRAME, { x: 22, y: 11 }),
  TRUMPET_ARM,
  30
)
const VALVES = [36, 44, 52]
/** Which valves are down on each beat of the two bars: a little riff. */
const RIFF = [
  [1, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [0, 0, 0],
  [1, 0, 1],
  [0, 1, 0],
  [1, 1, 0],
  [0, 0, 0]
]
const valveAt = (i: number) => (t: number) => {
  const beat = Math.floor(t / BEAT) % 8
  const into = t - Math.floor(t / BEAT) * BEAT
  const down = RIFF[beat]![i]!
  // down quickly on the beat, up again just before the next
  const press =
    into < 0.04 ? into / 0.04 : into > BEAT - 0.05 ? (BEAT - into) / 0.05 : 1
  return { y: down * press * 3.5 }
}

// ---- notes ------------------------------------------------------------------

/** Rusty's bell, in the stage's units, unswayed. */
const BELL = (() => {
  const p = place(TRUMPET_FRAME, { x: 106, y: -2 })
  return { x: AT.rusty + (p.x - 120) * K, y: FLOOR - (246 - p.y) * K }
})()
/** A note's flight, seconds. Four are let go a loop, so two or three are up at once. */
const NOTE_LIFE = 2.9
const NOTES = [
  { at: 0.1, kind: 'eighth', drift: 44, sway: 7, phase: 0 },
  { at: 1.05, kind: 'pair', drift: 30, sway: 5, phase: 0.4 },
  { at: 2, kind: 'quarter', drift: 52, sway: 8, phase: 0.75 },
  { at: 2.95, kind: 'eighth', drift: 36, sway: 6, phase: 0.2 }
] as const
const NOTE_STEPS = [
  0, 0.04, 0.08, 0.12, 0.17, 0.24, 0.32, 0.41, 0.5, 0.6, 0.7, 0.8, 0.9, 1
]

/** One note: out of the bell, up and away on a lazy S, fading as it goes. */
function noteTrack(note: (typeof NOTES)[number]): Track {
  const at = (t: number): Pose => {
    const age = (t - note.at + LOOP) % LOOP
    if (age > NOTE_LIFE) return { x: BELL.x, y: BELL.y, r: -12, s: 0.5, o: 0 }
    const u = age / NOTE_LIFE
    const wave = Math.sin(2 * Math.PI * (u * 1.1 + note.phase))
    return {
      x: BELL.x + 6 + note.drift * u + note.sway * wave,
      y: BELL.y - 4 - 150 * (1 - (1 - u) ** 1.4),
      r: -12 + 12 * wave,
      s: 0.5 + 0.5 * Math.min(1, u / 0.15),
      o: 0.9 * Math.min(1, u / 0.08, (1 - u) / 0.38)
    }
  }
  const flight = NOTE_STEPS.map((u) => (note.at + u * NOTE_LIFE) % LOOP)
  // back to the bell, unseen, the moment it has faded
  const home = (note.at + NOTE_LIFE + 0.02) % LOOP
  return { period: LOOP, times: [...flight, home], at }
}

// ---- every track -------------------------------------------------------------

const bowTimes = every(LOOP, 24)
const [oliveUp, oliveFore, oliveWrist] = armTracks(LOOP, bowTimes, oliveBow)
const pluckTimes = [0, 0.03, 0.06, 0.09, 0.12, 0.16, 0.2, 0.25, 0.3, 0.36, 0.42]
const [lilyUp, lilyFore, lilyWrist] = armTracks(BEAT, pluckTimes, (t) =>
  lilyPluck(t)
)

/** A blink at `when`: shut over 60ms, open over 90ms. */
const blink = (when: number): Track => ({
  period: LOOP,
  times: [when - 0.01, when + 0.06, when + 0.15],
  at: (t) => {
    const d = t - when
    if (d <= 0 || d >= 0.15) return { sy: 1 }
    return {
      sy: d < 0.06 ? 1 - (d / 0.06) * 0.9 : 0.1 + ((d - 0.06) / 0.09) * 0.9
    }
  }
})

const TRACKS = {
  // Lily nods into every beat.
  lilyHead: {
    period: BEAT,
    times: every(BEAT, 6),
    at: (t) => ({ y: 3 * (1 - bob(t, BEAT)) })
  },
  lilyUp,
  lilyFore,
  lilyWrist,
  lilyBlink: blink(2.62),
  // Olive's head leans away from the bow, and dips on beats 1 and 3.
  oliveHead: {
    period: LOOP,
    times: every(LOOP, 32),
    at: (t) => ({
      y: 1.6 * (1 - bob(t, BEAT * 2)),
      r: (bowAt(t) - 0.5) * -5
    })
  },
  oliveUp,
  oliveFore,
  oliveWrist,
  // Rusty rocks with the tune, one way a bar, his tail swinging after him.
  rustySway: {
    period: LOOP,
    times: every(LOOP, 16),
    at: (t) => ({ r: 2.2 * Math.sin((2 * Math.PI * t) / LOOP) })
  },
  rustyTail: {
    period: LOOP,
    times: every(LOOP, 16),
    at: (t) => ({ r: 5 * Math.sin((2 * Math.PI * t) / LOOP - 1) })
  },
  rustyBlink: blink(1.42),
  valve0: {
    period: LOOP,
    times: onBeats([0, 0.04, BEAT - 0.05]),
    at: valveAt(0)
  },
  valve1: {
    period: LOOP,
    times: onBeats([0, 0.04, BEAT - 0.05]),
    at: valveAt(1)
  },
  valve2: {
    period: LOOP,
    times: onBeats([0, 0.04, BEAT - 0.05]),
    at: valveAt(2)
  },
  note0: noteTrack(NOTES[0]),
  note1: noteTrack(NOTES[1]),
  note2: noteTrack(NOTES[2]),
  note3: noteTrack(NOTES[3])
} satisfies Record<string, Track>
type TrackName = keyof typeof TRACKS

const pct = (t: number, period: number) => `${n2((t / period) * 100)}%`

/**
 * Every keyframe in the scene. Each track is sampled at its times plus its
 * rest moment, and played linearly between them; names carry the instance
 * uid so two covers on one page never share a timeline.
 */
function buildKeyframes(id: (name: string) => string): string {
  return Object.entries(TRACKS)
    .map(([name, track]: [string, Track]) => {
      const times = [
        ...new Set(
          [0, ...track.times, restIn(track)].map(
            (t) =>
              Math.round(
                (((t % track.period) + track.period) % track.period) * 1000
              ) / 1000
          )
        )
      ].toSorted((a, b) => a - b)
      const stops = times.map(
        (t) => `${pct(t, track.period)}{${declarationsOf(track.at(t))}}`
      )
      stops.push(`100%{${declarationsOf(track.at(0))}}`)
      return `@keyframes ${id(name)}{${stops.join('')}}`
    })
    .join('\n')
}

// ---- drawing ---------------------------------------------------------------

type Scene = {
  id: (name: string) => string
  anim: (name: TrackName) => CSSProperties
}
const SceneContext = createContext<Scene>({
  id: (name) => name,
  anim: () => ({})
})

/** How a shape is drawn: outline ink and weight, under-fill, hatch. */
type Look = { ink?: string; base?: string; hatch?: HatchName; w?: number }

/**
 * A crayon shape, as the app's S draws one: a solid under-fill, hatching in
 * the fill colour, and a broken outline with a lighter second pass, the two
 * not quite agreeing.
 */
function Shape({
  o,
  seed,
  ink,
  base,
  hatch,
  w = W
}: Look & { o: Outline; seed: number }) {
  const { id } = useContext(SceneContext)
  const fill = o(seed, 1)
  return (
    <g>
      {base ? <path d={fill} fill={base} /> : null}
      {hatch ? <path d={fill} fill={`url(#${id(hatch)})`} /> : null}
      {ink ? (
        <g
          fill='none'
          stroke={ink}
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d={o(seed, 1.125)} strokeWidth={w} strokeDasharray={CRAYON} />
          <path
            d={o(seed + 5, 1.05)}
            strokeWidth={w * 0.5}
            strokeOpacity={0.6}
          />
        </g>
      ) : null}
    </g>
  )
}

/** Shapes in drawing order, back to front; the n-th is seeded `seed + 10n`. */
function Shapes({ seed, of }: { seed: number; of: [Outline, Look][] }) {
  return (
    <>
      {of.map(([o, look], i) => (
        <Shape key={i} o={o} seed={seed + 10 * i} {...look} />
      ))}
    </>
  )
}

type Stroke = [d: string, color: string, w: number]

/**
 * Pencil strokes. Seeded ones wobble, as the app's L does (curls, f-holes,
 * a smile); unseeded ones stay ruled, for the small hard parts: strings,
 * pegs, a bridge.
 */
function Strokes({ of, seed }: { of: Stroke[]; seed?: number }) {
  return (
    <g fill='none' strokeLinecap='round' strokeLinejoin='round'>
      {of.map(([d, color, w], i) => (
        <path
          key={i}
          d={seed === undefined ? d : wobble(d, seed + i, 0.5)}
          stroke={color}
          strokeWidth={w}
        />
      ))}
    </g>
  )
}

/**
 * A part that moves on one of the tracks: held at its rest pose by the
 * attributes, which the paused animation (and reduced motion) agree with.
 * `pivot` is the point it turns about, in its parent's units.
 */
function Moving({
  track,
  pivot,
  children
}: {
  track: TrackName
  pivot?: Pt
  children: ReactNode
}) {
  const { anim } = useContext(SceneContext)
  const t: Track = TRACKS[track]
  const rest = t.at(restIn(t))
  const part = (
    <g
      className={styles.run}
      style={anim(track)}
      transform={transformOf(rest, false) || undefined}
      opacity={rest.o}
    >
      {pivot ? (
        <g transform={`translate(${-pivot.x} ${-pivot.y})`}>{children}</g>
      ) : (
        children
      )}
    </g>
  )
  return pivot ? (
    <g transform={`translate(${pivot.x} ${pivot.y})`}>{part}</g>
  ) : (
    part
  )
}

/** A joint turned by a track, or held at a fixed angle. */
function Turn({
  by,
  children
}: {
  by: TrackName | number
  children: ReactNode
}) {
  return typeof by === 'number' ? (
    <g transform={`rotate(${n2(by)})`}>{children}</g>
  ) : (
    <Moving track={by}>{children}</Moving>
  )
}

type ArmJoints = Record<keyof Joints, TrackName | number>
type Layer = 'ink' | 'fill'

/** A light hatch mark across an arm `w` thick, at `x` along it. */
function across(x: number, w: number): string {
  const k = w * 0.6
  return `M${n1(x - 2)} ${n1(k)} L${n1(x + 2)} ${n1(-k)}`
}

/**
 * An arm, the app's way (arm.ts): a thick crayon-outlined stroke tapering
 * from shoulder to wrist, light hatch marks across it, a paw at the end.
 * Each segment is a fixed line in its joint's frame; the keyframes only
 * ever turn the joints, so the arm can't stretch.
 */
function Arm({
  layer,
  shoulder,
  len,
  ink,
  fill,
  joints,
  held,
  paw
}: {
  layer: Layer
  shoulder: Pt
  /** Upper arm and forearm alike. */
  len: number
  ink: string
  fill: string
  joints: ArmJoints
  /** Drawn on the wrist, under the paw: a bow. */
  held?: ReactNode
  paw: ReactNode
}) {
  const segment = (upper: boolean) => {
    const half = upper ? ARM_W.upper : ARM_W.fore
    // The upper arm's outline starts a little way down, so the arm melts
    // into the body at the shoulder.
    if (layer === 'ink') {
      return (
        <line
          x1={upper ? half + 1.2 : 0}
          x2={len}
          stroke={ink}
          strokeWidth={2 * half + 4.4}
          strokeLinecap='round'
        />
      )
    }
    const marks = upper
      ? across(len * 0.55, half)
      : `${across(len * 0.3, half)} ${across(len * 0.68, half)}`
    return (
      <Strokes
        of={[
          [`M0 0 H${len}`, mix(fill, PAPER, 0.18), 2 * half],
          [marks, fill, 1.8]
        ]}
      />
    )
  }
  return (
    <g transform={`translate(${n1(shoulder.x)} ${n1(shoulder.y)})`}>
      <Turn by={joints.up}>
        {segment(true)}
        <g transform={`translate(${len} 0)`}>
          <Turn by={joints.fore}>
            {segment(false)}
            {layer === 'fill' ? (
              <g transform={`translate(${len} 0)`}>
                <Turn by={joints.wrist}>
                  {held}
                  {paw}
                </Turn>
              </g>
            ) : null}
          </Turn>
        </g>
      </Turn>
    </g>
  )
}

/**
 * A player's arms, drawn in two passes, every outline and then every fill
 * (and paw), so an elbow reads as one bent arm rather than two overlapping
 * sticks. Both passes run the same tracks, so they never part.
 */
function Arms({
  len,
  ink,
  fill,
  paw,
  arms
}: {
  len: number
  ink: string
  fill: string
  paw: ReactNode
  arms: { shoulder: Pt; joints: ArmJoints; held?: ReactNode }[]
}) {
  return (
    <>
      {(['ink', 'fill'] as const).map((layer) =>
        arms.map((arm, i) => (
          <Arm
            key={`${layer}${i}`}
            layer={layer}
            len={len}
            ink={ink}
            fill={fill}
            paw={paw}
            {...arm}
          />
        ))
      )}
    </>
  )
}

/** A furred paw: a round hatched mitt with three finger marks. */
function Paw({
  ink,
  fill,
  hatch
}: {
  ink: string
  fill: string
  hatch: HatchName
}) {
  return (
    <>
      <Shape
        o={ell(0, 0, 8, 7.2)}
        seed={31}
        ink={ink}
        base={tint(fill, 0.25)}
        hatch={hatch}
        w={2.3}
      />
      <Strokes
        of={[['M-3 -4 v3 M0 -5 v3 M3 -4 v3', mix(ink, PAPER, 0.3), 1.4]]}
      />
    </>
  )
}

/** A hoof, the sheep's: dark, with a light line down the split. */
function Hoof() {
  return (
    <>
      <Shape
        o={ell(0, 0, 7.6, 7)}
        seed={41}
        ink={SHEEP.ink}
        base={SHEEP.hoof}
        hatch='hoof'
        w={2.3}
      />
      <Strokes of={[['M0 -6 v5', mix(SHEEP.hoof, PAPER, 0.5), 1.4]]} />
    </>
  )
}

/** A player, placed on the stage from the app's character space. */
function Player({ at, children }: { at: number; children: ReactNode }) {
  const x = n1(at - 120 * K)
  const y = n1(FLOOR - 246 * K)
  return <g transform={`translate(${x} ${y}) scale(${K})`}>{children}</g>
}

/** The pencil-hatched patch of floor each player stands on. */
function Floor() {
  return <Shape o={ell(120, 248, 66, 7)} seed={1} hatch='shadow' />
}

/** Feet, body and belly: the app's bodyAndFeet. */
function body(
  ink: string,
  fill: string,
  fur: HatchName,
  belly: Look,
  feet: Look
): [Outline, Look][] {
  return [
    [ell(101, 240, 15, 8), { ink, ...feet }],
    [ell(139, 240, 15, 8), { ink, ...feet }],
    [ell(120, 199, 45, 44), { ink, base: tint(fill), hatch: fur }],
    [ell(120, 206, 27, 29), { ink: mix(ink, fill, 0.4), w: 2.3, ...belly }]
  ]
}

/**
 * Cheeks and eyes: blush hatched on, and pencil-dot eyes with a glint (the
 * sprite's), or shut, as the app draws a player deep in a long note.
 */
function Face({
  blush,
  eyes,
  r,
  blink,
  shut
}: {
  blush: [Pt, Pt]
  eyes: [Pt, Pt]
  r: number
  blink?: TrackName
  shut?: boolean
}) {
  const eye = shut ? (
    <path
      d={`M${-r * 1.2} 0 Q0 ${r * 1.3} ${r * 1.2} 0`}
      stroke={PENCIL}
      strokeWidth={2.6}
      strokeLinecap='round'
      fill='none'
    />
  ) : (
    <>
      <ellipse rx={r} ry={r * 1.1} fill={PENCIL} />
      <circle cx={-r * 0.32} cy={-r * 0.38} r={r * 0.34} fill={WHITE} />
    </>
  )
  return (
    <>
      <Shapes
        seed={500}
        of={blush.map((b) => [ell(b.x, b.y, 9, 5.5), { hatch: 'blush' }])}
      />
      {eyes.map((e) => (
        <g key={e.x} transform={`translate(${e.x} ${e.y})`}>
          {blink ? <Moving track={blink}>{eye}</Moving> : eye}
        </g>
      ))}
    </>
  )
}

// ---- the players -------------------------------------------------------------

const LILY_PLUCK: ArmJoints = {
  up: 'lilyUp',
  fore: 'lilyFore',
  wrist: 'lilyWrist'
}
const OLIVE_BOW: ArmJoints = {
  up: 'oliveUp',
  fore: 'oliveFore',
  wrist: 'oliveWrist'
}

/** Lily the frog, on upright bass: plucks every beat, nods into it. */
function Lily() {
  const { ink, fill, belly } = FROG
  const fur: Look = { ink, base: tint(fill, 0.3), hatch: 'frog' }
  const eyeWhite: Look = { ink, base: WHITE, w: 2 }
  return (
    <Player at={AT.lily}>
      <Floor />
      <Shapes
        seed={100}
        of={body(
          ink,
          fill,
          'frog',
          { base: belly, hatch: 'frogBelly' },
          { base: tint(fill, 0.25), hatch: 'frog' }
        )}
      />
      <Moving track='lilyHead' pivot={NECK}>
        <Shapes
          seed={200}
          of={[
            [ell(90, 78, 21, 20), fur],
            [ell(150, 78, 21, 20), fur],
            [ell(120, 117, 60, 42), fur],
            [ell(90, 77, 12, 12), eyeWhite],
            [ell(150, 77, 12, 12), eyeWhite]
          ]}
        />
        <Strokes
          seed={300}
          of={[
            ['M106 108 q2 -2 4 0 M130 108 q2 -2 4 0', ink, 2],
            ['M98 127 Q120 140 142 127', PENCIL, 2.6]
          ]}
        />
        <Face
          blush={[
            { x: 82, y: 124 },
            { x: 158, y: 124 }
          ]}
          eyes={[
            { x: 91, y: 78 },
            { x: 149, y: 78 }
          ]}
          r={6}
          blink='lilyBlink'
        />
      </Moving>
      <UprightBass />
      <Arms
        len={BASS_ARM}
        ink={ink}
        fill={fill}
        paw={<Paw ink={ink} fill={fill} hatch='frog' />}
        arms={[
          { shoulder: SHOULDER_L, joints: LILY_PLUCK },
          { shoulder: SHOULDER_R, joints: LILY_STOP }
        ]}
      />
    </Player>
  )
}

const BASS_BODY =
  'M0 -60 C-10 -60 -15 -56 -19 -48 C-25 -38 -28 -26 -24 -16 C-21 -8 -21 0 -24 6 C-40 14 -43 40 -37 50 C-31 60 -15 62 0 62 C15 62 31 60 37 50 C43 40 40 14 24 6 C21 0 21 -8 24 -16 C28 -26 25 -38 19 -48 C15 -56 10 -60 0 -60 Z'

/** The double bass (rigs/strings.tsx), in its own frame: neck along −y. */
function UprightBass() {
  const { at, tilt, scale } = BASS_FRAME
  const sx = CB.sx
  const wood: Look = { ink: WOOD_INK, base: BASS.wood, w: 1.9 }
  const fingerboard = `M${n1(sx(3, CB.nut) - 1.8)} ${CB.nut} L${n1(sx(0, CB.nut) + 1.8)} ${CB.nut} L${n1(sx(0, CB.fbEnd) + 2.4)} ${CB.fbEnd} L${n1(sx(3, CB.fbEnd) - 2.4)} ${CB.fbEnd} Z`
  const strings: Stroke[] = [0, 1, 2, 3].map((i) => [
    `M${n1(sx(i, CB.nut))} ${CB.nut} L${n1(sx(i, CB.bridge))} ${CB.bridge} L${n1(sx(i, CB.bridge) * 0.6)} 40`,
    STRING,
    1.4 - i * 0.12
  ])
  return (
    <g
      transform={`translate(${n1(at.x)} ${n1(at.y)}) rotate(${tilt}) scale(${scale})`}
    >
      <Strokes of={[['M0 60 L0 72', '#6d6a75', 3]]} />
      <Shapes
        seed={600}
        of={[
          [
            pth(BASS_BODY),
            {
              ink: WOOD_INK,
              base: mix(BASS.wood, '#ffffff', 0.2),
              hatch: 'bass'
            }
          ],
          [
            pth('M-4.2 -60 L-3.4 -112 L3.4 -112 L4.2 -60 Z', 0),
            { base: mix(BASS.wood, '#000000', 0.25) }
          ],
          [pth(fingerboard, 0), { base: BOARD }],
          [pth('M-5.5 38 L5.5 38 L4 54 L-4 54 Z', 0), { base: BOARD }],
          [pth('M-4 -112 L-4.5 -128 L4.5 -128 L4 -112 Z', 0.4), wood],
          [ell(0, -134, 6, 6.2), wood]
        ]}
      />
      <Strokes
        seed={650}
        of={[
          [
            'M-12 2 q-4 8 0 15 q4 8 0 15 M12 2 q4 8 0 15 q-4 8 0 15',
            WOOD_INK,
            1.8
          ]
        ]}
      />
      <Strokes
        of={[
          ['M-11 30 H11', BRIDGE, 2.8],
          ...strings,
          [
            'M-5.5 -116 h-4 M-5.5 -123 h-4 M5.5 -117 h4 M5.5 -124 h4',
            '#c9c5d6',
            2.4
          ],
          ['M0 -134 m-2.4 0 a2.4 2.4 0 1 1 2.4 2.4', WOOD_INK, 1.3]
        ]}
      />
    </g>
  )
}

/** The bow, from the frog in her hoof, turned square to the strings. */
const BOW = (
  <g transform={`rotate(${BOW_ANGLE - BOW_PAW})`}>
    <Strokes
      of={[
        [`M0 0 H${BOW_LEN}`, HAIR, 2.6],
        [`M0 -3 L${BOW_LEN} -2`, BOW_STICK, 2.4]
      ]}
    />
    <circle cy={-2} r={3.4} fill={PENCIL} />
  </g>
)

const FACE_EGG =
  'M120 84 C96 84 86 102 88 122 C90 144 104 156 120 156 C136 156 150 144 152 122 C154 102 144 84 120 84 Z'

/** Olive the sheep, on cello: the long bow, eyes shut, lost in it. */
function Olive() {
  const { ink, wool, face, inner } = SHEEP
  const fleece: Look = { ink, base: wool, hatch: 'wool' }
  const ear: Look = { ink, base: face, hatch: 'ear' }
  const earInside: Look = { ink: mix(ink, inner, 0.5), base: inner, w: 1.5 }
  const curl = mix(ink, wool, 0.45)
  return (
    <Player at={AT.olive}>
      {/* the little stool behind her */}
      <Strokes
        seed={700}
        of={[
          [
            'M88 230 L80 252 M152 230 L160 252 M120 232 L120 252 M84 244 H156',
            STOOL.ink,
            3.6
          ]
        ]}
      />
      <Shapes
        seed={710}
        of={[
          [
            ell(120, 228, 42, 8),
            {
              ink: STOOL.ink,
              base: mix(STOOL.wood, '#ffffff', 0.2),
              hatch: 'stool'
            }
          ]
        ]}
      />
      <Floor />
      <Shapes
        seed={720}
        of={[
          [pth(scallop(166, 212, 11, 10, 6, 0.3), 0.6), { ...fleece, w: 2.3 }],
          [
            ell(101, 240, 15, 8),
            { ink, base: tint(SHEEP.feet, 0.25), hatch: 'sheepFeet' }
          ],
          [
            ell(139, 240, 15, 8),
            { ink, base: tint(SHEEP.feet, 0.25), hatch: 'sheepFeet' }
          ],
          [pth(scallop(120, 200, 43, 41, 13, 0.16), 0.8), fleece]
        ]}
      />
      <Strokes
        seed={760}
        of={[
          [
            curls([
              [100, 186],
              [138, 182],
              [118, 204],
              [96, 218],
              [142, 214],
              [121, 228],
              [108, 170],
              [134, 166]
            ]),
            curl,
            1.8
          ]
        ]}
      />
      <Moving track='oliveHead' pivot={NECK}>
        {/* floppy ears poke out sideways from under the wool */}
        <g transform='rotate(16 68 108)'>
          <Shapes
            seed={800}
            of={[
              [ell(62, 108, 22, 9), ear],
              [ell(60, 108, 13, 4.2), earInside]
            ]}
          />
        </g>
        <g transform='rotate(-16 172 108)'>
          <Shapes
            seed={820}
            of={[
              [ell(178, 108, 22, 9), ear],
              [ell(180, 108, 13, 4.2), earInside]
            ]}
          />
        </g>
        <Shapes
          seed={840}
          of={[[pth(scallop(120, 100, 52, 44, 12, 0.2), 0.8), fleece]]}
        />
        <Strokes
          seed={850}
          of={[
            [
              curls(
                [
                  [84, 82],
                  [158, 84],
                  [80, 112],
                  [162, 114],
                  [102, 66],
                  [140, 66]
                ],
                3
              ),
              curl,
              1.7
            ]
          ]}
        />
        <Shapes
          seed={860}
          of={[
            [
              pth(FACE_EGG),
              { ink, base: mix(face, '#ffffff', 0.25), hatch: 'face' }
            ],
            [
              pth(scallop(120, 84, 21, 10, 5, 0.42, Math.PI), 0.6),
              { ...fleece, w: 2.4 }
            ],
            [
              ell(120, 137, 14, 10),
              {
                ink: mix(ink, face, 0.35),
                base: mix(face, '#ffffff', 0.45),
                w: 1.9
              }
            ]
          ]}
        />
        <Face
          blush={[
            { x: 99, y: 132 },
            { x: 141, y: 132 }
          ]}
          eyes={[
            { x: 105, y: 115 },
            { x: 135, y: 115 }
          ]}
          r={5.2}
          shut
        />
        <Strokes
          seed={890}
          of={[
            [
              'M115 130 q5 4 10 0 M120 132 v4 M112 139 q4 4 8 1 q4 3 8 -1',
              PENCIL,
              2.2
            ]
          ]}
        />
      </Moving>
      <Cello />
      <Arms
        len={CELLO_ARM}
        ink={ink}
        fill={SHEEP.fill}
        paw={<Hoof />}
        arms={[
          { shoulder: SHOULDER_L, joints: OLIVE_BOW, held: BOW },
          { shoulder: SHOULDER_R, joints: OLIVE_STOP }
        ]}
      />
    </Player>
  )
}

const CELLO_BODY =
  'M0 -46 C-14 -46 -25 -40 -25 -27 C-25 -16 -17 -14 -17 -4 C-17 6 -31 8 -31 24 C-31 40 -16 46 0 46 C16 46 31 40 31 24 C31 8 17 6 17 -4 C17 -14 25 -16 25 -27 C25 -40 14 -46 0 -46 Z'

/** The cello (rigs/strings.tsx), in its own frame: neck along −y. */
function Cello() {
  const { at, tilt } = CELLO_FRAME
  const sx = VC.sx
  const wood: Look = { ink: WOOD_INK, base: CELLO.wood, w: 1.8 }
  const fingerboard = `M${n1(sx(3, VC.nut) - 1.6)} ${VC.nut} L${n1(sx(0, VC.nut) + 1.6)} ${VC.nut} L${n1(sx(0, VC.fbEnd) + 2.2)} ${VC.fbEnd} L${n1(sx(3, VC.fbEnd) - 2.2)} ${VC.fbEnd} Z`
  const strings: Stroke[] = [0, 1, 2, 3].map((i) => [
    `M${n1(sx(i, VC.nut))} ${VC.nut} L${n1(sx(i, VC.bridge))} ${VC.bridge} L${n1(sx(i, VC.bridge) * 0.6)} 31`,
    STRING,
    i === 0 ? 1.3 : 1.05 - i * 0.05
  ])
  return (
    <g transform={`translate(${n1(at.x)} ${n1(at.y)}) rotate(${tilt})`}>
      <Strokes of={[['M0 46 L0 60', '#6d6a75', 2.8]]} />
      <Shapes
        seed={900}
        of={[
          [
            pth(CELLO_BODY),
            {
              ink: WOOD_INK,
              base: mix(CELLO.wood, '#ffffff', 0.18),
              hatch: 'cello'
            }
          ],
          [
            pth('M-3.6 -46 L-3 -86 L3 -86 L3.6 -46 Z', 0),
            { base: mix(CELLO.wood, '#000000', 0.25) }
          ],
          [pth(fingerboard, 0), { base: BOARD }],
          [pth('M-4.5 30 L4.5 30 L3.2 42 L-3.2 42 Z', 0), { base: BOARD }],
          [pth('M-3.5 -86 L-4 -100 L4 -100 L3.5 -86 Z', 0.4), wood],
          [ell(0, -105, 5.4, 5.6), wood]
        ]}
      />
      <Strokes
        seed={950}
        of={[
          [
            'M-9 -2 q-3 6 0 11 q3 5 0 11 M9 -2 q3 6 0 11 q-3 5 0 11',
            WOOD_INK,
            1.8
          ]
        ]}
      />
      <Strokes
        of={[
          ['M-9 22 H9', BRIDGE, 2.6],
          ...strings,
          ['M-5 -90 h-3 M-5 -95 h-3 M5 -91 h3 M5 -96 h3', WOOD_INK, 2.4],
          ['M0 -105 m-2 0 a2 2 0 1 1 2 2', WOOD_INK, 1.3]
        ]}
      />
    </g>
  )
}

const FOX_TAIL =
  'M92 228 C60 236 30 214 36 180 C40 158 58 150 66 156 C60 176 70 204 100 214 Z'
const FOX_TAIL_TIP =
  'M36 180 C40 158 58 150 66 156 C62 166 60 174 62 182 C52 186 42 186 36 180 Z'
const FOX_MASK =
  'M68 112 Q90 156 120 150 Q150 156 172 112 Q148 128 120 122 Q92 128 68 112 Z'

/** Rusty the fox, the leader, on trumpet: rocks with the tune. */
function Rusty() {
  const { ink, fill, white } = FOX
  const fur: Look = { ink, base: tint(fill, 0.3), hatch: 'fox' }
  const tip: Look = { ink: PENCIL, base: FOX.tip, w: 1.4 }
  return (
    <Player at={AT.rusty}>
      <Floor />
      {/* He rocks from the feet, all of him at once, so his paws stay on the horn. */}
      <Moving track='rustySway' pivot={{ x: 120, y: 244 }}>
        <Moving track='rustyTail' pivot={{ x: 98, y: 222 }}>
          <Shapes
            seed={1000}
            of={[
              [pth(FOX_TAIL), fur],
              [pth(FOX_TAIL_TIP, 0.6), { ink, base: white, w: 2.2 }]
            ]}
          />
        </Moving>
        <Shapes
          seed={1100}
          of={[
            ...body(
              ink,
              fill,
              'fox',
              { base: white, hatch: 'fox' },
              { base: tint(FOX.feet, 0.25), hatch: 'foxFeet' }
            ),
            [pth('M70 92 L76 40 L108 70 Z'), fur],
            [pth('M76 44 L80 60 L88 56 Z', 0.5), tip],
            [pth('M170 92 L164 40 L132 70 Z'), fur],
            [pth('M164 44 L160 60 L152 56 Z', 0.5), tip],
            [ell(120, 110, 55, 47), fur],
            [pth(FOX_MASK), { ink: mix(ink, white, 0.3), base: white, w: 2 }]
          ]}
        />
        <Face
          blush={[
            { x: 84, y: 124 },
            { x: 156, y: 124 }
          ]}
          eyes={[
            { x: 100, y: 106 },
            { x: 140, y: 106 }
          ]}
          r={5.5}
          blink='rustyBlink'
        />
        <Shapes
          seed={1200}
          of={[[ell(120, 126, 6, 4.5), { ink: PENCIL, base: PENCIL, w: 1.7 }]]}
        />
        {/* cheeks puffed round the mouthpiece */}
        {[104, 136].map((x) => (
          <g key={x}>
            <circle
              cx={x}
              cy={136}
              r={9}
              fill={tint(fill, 0.3)}
              stroke={ink}
              strokeWidth={2.1}
            />
            <circle
              cx={x + (x < 120 ? -2 : 2)}
              cy={138}
              r={3.6}
              fill={BLUSH}
              opacity={0.5}
            />
          </g>
        ))}
        <Trumpet />
        <Arms
          len={TRUMPET_ARM}
          ink={ink}
          fill={fill}
          paw={<Paw ink={ink} fill={fill} hatch='fox' />}
          arms={[
            { shoulder: SHOULDER_L, joints: RUSTY_L },
            { shoulder: SHOULDER_R, joints: RUSTY_R }
          ]}
        />
      </Moving>
    </Player>
  )
}

/** The trumpet (rigs/horns.tsx), in its own frame: bell along +x. */
function Trumpet() {
  const { at, tilt, scale } = TRUMPET_FRAME
  const brass: Look = {
    ink: BRASS.ink,
    base: BRASS.fill,
    hatch: 'brass',
    w: 1.8
  }
  return (
    <g transform={`translate(${at.x} ${at.y}) rotate(${tilt}) scale(${scale})`}>
      <Strokes
        seed={1300}
        of={[['M30 6 Q26 18 40 18 H58 Q66 18 64 8', BRASS.ink, 3.2]]}
      />
      <Shapes
        seed={1310}
        of={[
          [
            pth('M0 -2 H82 V2 H0 Z', 0.3),
            { ink: BRASS.ink, base: BRASS.fill, w: 2 }
          ],
          [
            pth('M80 -3 Q94 -5 104 -17 L104 17 Q94 5 80 3 Z', 0.6),
            { ...brass, w: 2.4 }
          ],
          [
            ell(104, 0, 3.5, 17),
            { ink: BRASS.ink, base: mix(BRASS.fill, '#ffffff', 0.4), w: 2 }
          ],
          [
            pth('M-2 -3 H8 V3 H-2 Z', 0.3),
            { ink: '#6d6a75', base: '#d8d8e0', w: 1.6 }
          ]
        ]}
      />
      {VALVES.map((x, i) => (
        <g key={x}>
          <Shapes
            seed={1400 + 10 * i}
            of={[[pth(`M${x} -12 h6 v24 h-6 Z`, 0.4), brass]]}
          />
          <Moving track={`valve${i}` as TrackName}>
            <Strokes of={[[`M${x + 3} -12 V-17`, BRASS.ink, 1.8]]} />
            <Shapes
              seed={1450 + 10 * i}
              of={[
                [
                  ell(x + 3, -18, 4, 2.4),
                  { ink: BRASS.ink, base: BRASS.pearl, w: 1.6 }
                ]
              ]}
            />
          </Moving>
        </g>
      ))}
    </g>
  )
}

// ---- the stage ---------------------------------------------------------------

/**
 * The stage's string of hand-coloured pennants (stage/Bunting.tsx). Over
 * the stage it sags once, as in the app; past it, it is pinned up at the
 * stage's edges and festooned on, so a wide card shows more of it instead
 * of a string that stops short.
 */
const FESTOONS = [-1, 0, 1]
const FLAGS_PER_FESTOON = 12
/** The bunting's own strip of the stage: pennants hang to about y 57. */
const BUNTING_H = 64

/** Pinned at the top of every festoon, lowest in its middle. */
const sag = (x: number) => 4 + Math.abs(Math.sin((Math.PI * x) / STAGE_W)) * 18

function Bunting() {
  const rnd = noise(7)
  const flags = FESTOONS.flatMap((festoon) =>
    Array.from({ length: FLAGS_PER_FESTOON }, (_, i) => {
      const n = festoon * FLAGS_PER_FESTOON + i
      const at = (f: number) => {
        const x = (festoon + (i + f) / FLAGS_PER_FESTOON) * STAGE_W
        return { x, y: sag(x) }
      }
      const a = at(0.15)
      const b = at(0.85)
      const tip = {
        x: (a.x + b.x) / 2 + rnd() * 3,
        y: (a.y + b.y) / 2 + 30 + rnd() * 3
      }
      // a few hatch strokes across each pennant
      const hatch = [0.3, 0.55, 0.8]
        .map((f) => {
          const p = { x: a.x + (tip.x - a.x) * f, y: a.y + (tip.y - a.y) * f }
          const q = { x: b.x + (tip.x - b.x) * f, y: b.y + (tip.y - b.y) * f }
          return `M${n1(p.x)} ${n1(p.y)} L${n1(q.x)} ${n1(q.y - 3)}`
        })
        .join(' ')
      const outline = `M${n1(a.x)} ${n1(a.y)} L${n1(b.x)} ${n1(b.y)} L${n1(tip.x)} ${n1(tip.y)} Z`
      return {
        d: wobble(outline, 30 + n, 0.8),
        hatch,
        color: PENCILS[(n + 15) % PENCILS.length]!
      }
    })
  )
  const from = FESTOONS[0]! * STAGE_W
  const to = (FESTOONS.at(-1)! + 1) * STAGE_W
  const line = Array.from({ length: 121 }, (_, i) => {
    const x = from + ((to - from) * i) / 120
    return `${i ? 'L' : 'M'}${n1(x)} ${n1(sag(x) + rnd() * 0.6)}`
  }).join(' ')
  return (
    <g strokeLinejoin='round' strokeLinecap='round' fill='none'>
      <path d={line} stroke={INK} strokeWidth={1.6} strokeOpacity={0.55} />
      {/* the tacks it hangs from */}
      {[0, STAGE_W].map((x) => (
        <circle
          key={x}
          cx={x}
          cy={sag(x)}
          r={2.6}
          fill={INK}
          fillOpacity={0.6}
        />
      ))}
      {flags.map((f) => (
        <g key={f.d}>
          <path
            d={f.d}
            fill={f.color}
            className={styles.pennant}
            stroke={INK}
            strokeOpacity={0.55}
            strokeWidth={1.4}
          />
          <path
            d={f.hatch}
            stroke={f.color}
            strokeWidth={1.9}
            strokeOpacity={0.8}
          />
        </g>
      ))}
    </g>
  )
}

const STEMS = {
  eighth: 'M4.1 -1 V-17 q5 2.6 6.4 9.5',
  quarter: 'M4.1 -1 V-17',
  pair: 'M4.1 -1 V-17 M17.1 -4 V-20'
}

/** A hand-drawn note: an eighth, a quarter, or a beamed pair. */
function Glyph({ kind }: { kind: (typeof NOTES)[number]['kind'] }) {
  const head = (x: number, y: number) => (
    <ellipse
      cx={x}
      cy={y}
      rx={4.6}
      ry={3.4}
      transform={`rotate(-22 ${x} ${y})`}
    />
  )
  return (
    <g
      fill={NOTE}
      stroke={NOTE}
      strokeLinecap='round'
      strokeLinejoin='round'
      transform='scale(1.2)'
    >
      {head(0, 0)}
      {kind === 'pair' ? head(13, -3) : null}
      <path d={STEMS[kind]} strokeWidth={1.7} fill='none' />
      {kind === 'pair' ? (
        <path d='M4.1 -17.5 L17.1 -20.5' strokeWidth={3.4} />
      ) : null}
    </g>
  )
}

export function JammingCover() {
  // Keyframe and pattern names must be unique per instance (and colon-free
  // so they stay valid identifiers).
  const uid = useId().replaceAll(':', '')
  const scene = useMemo<Scene>(() => {
    const id = (name: string) => `jc-${name}-${uid}`
    return {
      id,
      // Every part runs its track's period from the rest moment, so the
      // whole band is in time with itself wherever the loop is.
      anim: (name) => {
        const track: Track = TRACKS[name]
        return {
          animationName: id(name),
          animationDuration: `${track.period}s`,
          animationDelay: `${-restIn(track)}s`
        }
      }
    }
  }, [uid])
  const keyframes = useMemo(() => buildKeyframes(scene.id), [scene])

  // Two layers at one scale: the bunting hangs from the top of the box and
  // the band stands on its floor. They meet as one stage at grid widths; a
  // narrower box shrinks both and leaves the air between them to the notes.
  return (
    <div className={styles.cover} aria-hidden='true'>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <svg
        className={styles.bunting}
        viewBox={`0 0 ${STAGE_W} ${BUNTING_H}`}
        preserveAspectRatio='xMidYMin meet'
      >
        <Bunting />
      </svg>
      <SceneContext.Provider value={scene}>
        <svg
          className={styles.stage}
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          preserveAspectRatio='xMidYMax meet'
        >
          <defs>
            {Object.entries(HATCHES).map(([name, h]: [string, Hatch]) => {
              const gap = h.gap ?? 5.5
              return (
                <pattern
                  key={name}
                  id={scene.id(name)}
                  width={gap * 2}
                  height={gap * 2}
                  patternUnits='userSpaceOnUse'
                  patternTransform={`rotate(${h.angle ?? 35})`}
                >
                  <path
                    d={`M${n1(gap * 0.3)} 0 V${gap * 2} M${n1(gap * 1.35)} 0 V${gap * 2}`}
                    stroke={h.color}
                    strokeWidth={h.w ?? 1.6}
                    strokeOpacity={0.8}
                  />
                </pattern>
              )
            })}
          </defs>
          <Lily />
          <Olive />
          <Rusty />
          {NOTES.map((note, i) => (
            <Moving key={note.at} track={`note${i}` as TrackName}>
              <Glyph kind={note.kind} />
            </Moving>
          ))}
        </svg>
      </SceneContext.Provider>
    </div>
  )
}
