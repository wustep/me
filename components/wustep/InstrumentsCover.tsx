import { type CSSProperties, useId } from 'react'

import styles from './InstrumentsCover.module.css'

/**
 * InstrumentsCover — the grand, from above.
 *
 *   Cover for the Instruments playground entry: the app's 2D piano view in
 *   miniature. The case is seen in plan, keyboard at the bottom, with its
 *   88 strings running back from the hammers to the bentside: copper-wound
 *   bass on the left, steel treble shortening toward the right, the plate's
 *   struts in shadow underneath. The palette is the app's own (its :root
 *   tokens: ground, ivory, ebony, brass, amber, accent).
 *
 *   At rest one string, C3, is still ringing: lit in the accent, with the
 *   soft blur a vibrating string leaves in a long exposure. Hover strikes
 *   a rolled C major chord from the bass up; each key warms, its hammer
 *   flashes and its string lights and blurs, then rings down.
 *
 *   Apply-on-hover, as LensesCover does: the animations are assigned only
 *   while the card is awake, so the rest frame is exact and every hover
 *   starts the roll from its first note.
 */

// ---- stage -----------------------------------------------------------------

/**
 * The piano is drawn in a 640×360 frame. The cover box is ~190px tall at
 * every card width and 1.6 to 4.6 times as wide, so the viewBox is an
 * extra-wide stage around that frame (1800 wide, 5:1) under `slice`: the
 * full height always fits, a narrow card crops the empty wings, and a wide
 * one shows more of the dark stage either side. The case and cheek blocks
 * span x 14–626 (612 wide), so the whole piano is in frame on any card at
 * least 1.7 times as wide as it is tall (~325px on the grid).
 */
const FRAME_W = 640
const STAGE_W = 1800
const STAGE_H = 360
const STAGE_X = (FRAME_W - STAGE_W) / 2

const KEYS = 88
/** The keyboard's left and right ends; the strings share the same span. */
const KB_L = 28
const KB_R = 612
const WHITE_KEYS = 52
const WHITE_W = (KB_R - KB_L) / WHITE_KEYS
/** Black keys are a little over half a white key wide, as on a real keybed. */
const BLACK_W = WHITE_W * 0.58
const KEY_TOP = 286
/** White keys run past the bottom edge so the keyboard reads as cropped. */
const WHITE_BOTTOM = 376
/** Black keys are about 0.62 of a white key's visible length (the app's). */
const BLACK_BOTTOM = 341

/** Where the strings start, just behind the key rail (the agraffe line). */
const FRONT = 270
const HAMMER_Y = 258
const DAMPER_Y = 248
/** The top two octaves and a bit ring undamped, as on a real grand. */
const LAST_DAMPER = 68
/** The longest (lowest) string, in stage units. */
const SPAN = 230
/** Strings sit on an even pitch; keys fan to meet them, as a real action does. */
const STRING_PITCH = (KB_R - KB_L) / KEYS

/**
 * Geometry is rounded to hundredths: Node and the browser disagree in the
 * last digits of Math.exp, and an unrounded attribute fails hydration.
 */
const r2 = (v: number) => Math.round(v * 100) / 100

const stringX = (n: number) => r2(KB_L + (n + 0.5) * STRING_PITCH)

/**
 * Where the bass bridge ends and the tenor bridge starts, as a fraction of
 * the keyboard. Below it the wound strings shorten slowly; above it the
 * plain strings halve roughly every octave. Fitted to the app's 2D view:
 * lengths 1 → 0.76 at the break, 0.35 at mid-keyboard, ~0.06 at C8.
 */
const BREAK = 0.29
function reach(t: number): number {
  return t < BREAK
    ? 1 - 0.24 * (t / BREAK)
    : 0.76 * Math.exp(-3.69 * (t - BREAK))
}
const stringTop = (n: number) => r2(FRONT - SPAN * reach(n / (KEYS - 1)))
const isBass = (n: number) => n / (KEYS - 1) < BREAK

// ---- keyboard --------------------------------------------------------------

/** A0 is key 0; its pitch class is 9 (A). */
const pitchClass = (n: number) => (n + 9) % 12
const BLACK_PCS = new Set([1, 3, 6, 8, 10])
const isBlack = (n: number) => BLACK_PCS.has(pitchClass(n))

type Key = { n: number; x: number; w: number; black: boolean }

const KEYBOARD: Key[] = (() => {
  const keys: Key[] = []
  let whites = 0
  for (let n = 0; n < KEYS; n++) {
    if (isBlack(n)) {
      // Centred on the seam between the white keys either side.
      const seam = KB_L + whites * WHITE_W
      keys.push({ n, x: r2(seam - BLACK_W / 2), w: r2(BLACK_W), black: true })
    } else {
      keys.push({
        n,
        x: r2(KB_L + whites * WHITE_W),
        w: r2(WHITE_W),
        black: false
      })
      whites++
    }
  }
  return keys
})()

// ---- case ------------------------------------------------------------------

/** How far the rim stands off the string ends. */
const RIM_GAP = 9
const CASE_L = 20
const CASE_R = 620
const CASE_BOTTOM = 278

/**
 * The rim: a smooth curve a little outside the string ends. Sampled at a
 * dozen points and joined with a Catmull-Rom spline, which rounds off the
 * bass break the way a real bentside does (the strings keep their kink).
 */
const CASE_PATH = (() => {
  const pts: Array<[number, number]> = []
  const samples = 12
  for (let i = 0; i <= samples; i++) {
    const x = CASE_L + ((CASE_R - CASE_L) * i) / samples
    const t = Math.min(
      1,
      Math.max(0, (x - stringX(0)) / (stringX(KEYS - 1) - stringX(0)))
    )
    pts.push([x, r2(FRONT - SPAN * reach(t) - RIM_GAP)])
  }
  let d = `M ${CASE_L} ${CASE_BOTTOM} L ${pts[0]![0]} ${pts[0]![1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!
    const p1 = pts[i]!
    const p2 = pts[i + 1]!
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return `${d} L ${CASE_R} ${CASE_BOTTOM} Z`
})()

/**
 * The plate's struts, read off the app's 2D view and mapped into the
 * stage: they run from the back of the case down toward the treble.
 */
const STRUTS: Array<[number, number, number, number]> = [
  [91, 76, 124, 265],
  [147, 92, 239, 268],
  [203, 104, 328, 266],
  [264, 164, 437, 262]
]

// ---- the chord -------------------------------------------------------------

/** One loop: the roll, the ring-down, and a breath before it rolls again. */
const LOOP = 4.2
/** Gap between the notes of the roll — a quick, unhurried spread. */
const ROLL = 0.24
/** A rolled C major, bass to treble: C2, G2, E3, C4, G4. */
const CHORD = [15, 22, 31, 39, 46]
/** The string still ringing at rest. */
const REST_NOTE = 27 // C3

// ---- palette ---------------------------------------------------------------

// The app's :root tokens (instruments-wustep.vercel.app).
const RULE = '#2a261f'
const RULE_2 = '#3d372d'
const MUTED = '#8a8172'
const INK_2 = '#c9bfab'
const IVORY = '#efe7d6'
const IVORY_EDGE = '#b9ae98'
const EBONY = '#15120f'
const LACQUER = '#120f0c'
const BRASS = '#c9a35c'
const AMBER = '#f2a646'
const ACCENT = '#ff5e38'
/** Wound bass strings, as the app draws them. */
const COPPER = '#b06a32'

/** The blur around a vibrating string: widest at the middle, pinched at the ends. */
function spindle(n: number, width: number): string {
  const x = stringX(n)
  const top = stringTop(n)
  const mid = r2((top + FRONT) / 2)
  return `M ${x} ${FRONT} Q ${x + width} ${mid} ${x} ${top} Q ${x - width} ${mid} ${x} ${FRONT} Z`
}

function keyFor(n: number): Key {
  return KEYBOARD[n]!
}

function Note({
  n,
  id,
  className,
  style
}: {
  n: number
  id: (name: string) => string
  className: string
  style?: CSSProperties
}) {
  const key = keyFor(n)
  const x = stringX(n)
  return (
    <g className={className} style={style}>
      <rect
        className={styles.keyLit}
        x={key.x + 0.4}
        y={KEY_TOP}
        width={key.w - 0.8}
        height={(key.black ? BLACK_BOTTOM : WHITE_BOTTOM) - KEY_TOP}
        rx={1}
        fill={AMBER}
      />
      <path
        className={styles.ring}
        d={spindle(n, 6.5)}
        fill={ACCENT}
        filter={`url(#${id('blur')})`}
      />
      <line
        className={styles.lit}
        x1={x}
        y1={FRONT}
        x2={x}
        y2={stringTop(n)}
        stroke={ACCENT}
        strokeWidth={2}
        strokeLinecap='round'
      />
      <rect
        className={styles.strike}
        x={x - 2.4}
        y={HAMMER_Y - 0.4}
        width={4.8}
        height={3.6}
        rx={1}
        fill={ACCENT}
      />
    </g>
  )
}

export function InstrumentsCover() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `ic-${uid}-${name}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`${STAGE_X} 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <linearGradient id={id('board')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#1c1913' />
            <stop offset='1' stopColor={LACQUER} />
          </linearGradient>
          <linearGradient id={id('ivory')} x1='0' y1='0' x2='0' y2='1'>
            {/* The rail's shadow falls across the top of the keys. */}
            <stop offset='0' stopColor='#cfc5b1' />
            <stop offset='0.14' stopColor={IVORY} />
            <stop offset='1' stopColor={IVORY} />
          </linearGradient>
          <linearGradient id={id('ebony')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#0b0a08' />
            <stop offset='0.8' stopColor={EBONY} />
            <stop offset='1' stopColor='#3a342b' />
          </linearGradient>
          {/* Generous region: the spindle is ~13 units wide and the blur
              would be clipped by the default 10% margin. */}
          <filter id={id('blur')} x='-300%' y='-10%' width='700%' height='120%'>
            <feGaussianBlur stdDeviation='2.6' />
          </filter>
        </defs>

        {/* Case and soundboard */}
        <path
          d={CASE_PATH}
          fill={`url(#${id('board')})`}
          stroke={RULE_2}
          strokeWidth={2.4}
          strokeLinejoin='round'
        />
        <g stroke={RULE} strokeWidth={7} strokeLinecap='round' opacity={0.9}>
          {STRUTS.map(([x1, y1, x2, y2]) => (
            <line key={x1} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>

        {/* Strings */}
        <g strokeLinecap='round'>
          {Array.from({ length: KEYS }, (_, n) => (
            <line
              key={n}
              x1={stringX(n)}
              y1={FRONT}
              x2={stringX(n)}
              y2={stringTop(n)}
              stroke={isBass(n) ? COPPER : MUTED}
              strokeWidth={isBass(n) ? 1.5 : 1}
              opacity={isBass(n) ? 0.85 : 0.6}
            />
          ))}
        </g>

        {/* Agraffe line, dampers and hammers */}
        <line
          x1={CASE_L + 4}
          y1={FRONT}
          x2={CASE_R - 4}
          y2={FRONT}
          stroke={BRASS}
          strokeWidth={1}
          opacity={0.45}
        />
        {Array.from({ length: LAST_DAMPER + 1 }, (_, n) => (
          <rect
            key={`d${n}`}
            x={stringX(n) - 2.2}
            y={DAMPER_Y}
            width={4.4}
            height={2.6}
            rx={0.8}
            fill={RULE_2}
          />
        ))}
        {Array.from({ length: KEYS }, (_, n) => (
          <rect
            key={`h${n}`}
            x={stringX(n) - 2.2}
            y={HAMMER_Y}
            width={4.4}
            height={2.8}
            rx={0.8}
            fill={INK_2}
            opacity={0.38}
          />
        ))}

        {/* Key rail and cheek blocks */}
        <rect
          x={CASE_L - 6}
          y={CASE_BOTTOM}
          width={CASE_R - CASE_L + 12}
          height={KEY_TOP - CASE_BOTTOM}
          fill={LACQUER}
        />
        <rect
          x={CASE_L - 6}
          y={CASE_BOTTOM}
          width={13}
          height={STAGE_H}
          rx={2}
          fill={LACQUER}
          stroke={RULE}
        />
        <rect
          x={CASE_R - 7}
          y={CASE_BOTTOM}
          width={13}
          height={STAGE_H}
          rx={2}
          fill={LACQUER}
          stroke={RULE}
        />

        {/* Keyboard */}
        <rect
          x={KB_L}
          y={KEY_TOP}
          width={KB_R - KB_L}
          height={WHITE_BOTTOM - KEY_TOP}
          fill={IVORY_EDGE}
        />
        {KEYBOARD.filter((k) => !k.black).map((k) => (
          <rect
            key={k.n}
            x={k.x + 0.4}
            y={KEY_TOP}
            width={k.w - 0.8}
            height={WHITE_BOTTOM - KEY_TOP}
            rx={1}
            fill={`url(#${id('ivory')})`}
          />
        ))}

        {/* The notes: the one still ringing at rest, then the roll. Drawn
            between the white and black keys so a lit white key's glow
            sits under its black neighbours. */}
        <Note
          n={REST_NOTE}
          id={id}
          className={`${styles.note} ${styles.restNote}`}
        />
        {CHORD.map((n, i) => (
          <Note
            key={n}
            n={n}
            id={id}
            className={`${styles.note} ${styles.rollNote}`}
            style={
              {
                '--ic-delay': `${(i * ROLL).toFixed(2)}s`,
                '--ic-loop': `${LOOP}s`
              } as CSSProperties
            }
          />
        ))}

        {KEYBOARD.filter((k) => k.black).map((k) => (
          <rect
            key={k.n}
            x={k.x}
            y={KEY_TOP - 0.5}
            width={k.w}
            height={BLACK_BOTTOM - KEY_TOP + 0.5}
            rx={1}
            fill={`url(#${id('ebony')})`}
          />
        ))}
      </svg>
    </div>
  )
}
