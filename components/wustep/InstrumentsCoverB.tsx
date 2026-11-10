import styles from './InstrumentsCoverB.module.css'
import { GlyphBody, VIOLIN_STRINGS } from './instrumentsCoverGlyphs'

/**
 * InstrumentsCoverB — the bow: one violin in vector lines, bowed, its
 * string ringing.
 *
 *   Unshipped variant, kept for the covers-preview workbench.
 *
 *   The app's best screen, close up: the violin from above in its "vector
 *   lines" style, lying scroll-left the way the app lays every string
 *   instrument, inside the dashed frame it draws round the one in view. A
 *   bow crosses just short of the bridge, the green target the app puts
 *   at the contact point sits under it, and the bowed string is amber.
 *   The cello and viola of an Orchestra-mode trio wait in the wings, where
 *   only a wide card sees them.
 *
 *   Hover draws the bow: down and back up, the string widening into the
 *   blur of its vibration as the bow speeds up and narrowing as it turns.
 *
 *   Paused timeline, as StageBenchCover does: hovering out stops the bow
 *   mid-stroke and hovering back carries on.
 */

// ---- stage -----------------------------------------------------------------

/**
 * An extra-wide stage (1800×360, 5:1) under `slice`, x = 0 at its centre.
 * The violin is ~670 long, so it is whole on any card at least ~360px
 * wide; narrower crops the scroll first.
 */
const STAGE_W = 1800
const STAGE_H = 360
const MID_Y = STAGE_H / 2

/** Hundredths: keeps server and client attribute strings identical. */
const r2 = (v: number) => Math.round(v * 100) / 100

/**
 * Lays a glyph on its side, scroll to the left. Rotating −90° sends the
 * glyph's y (scroll at the top) along the stage's x, so a glyph point
 * (gx, gy) lands at (tx + s·gy, MID_Y + s·(24 − gx)): 24 is the glyph's
 * centre line, which ends up on the stage's.
 */
function lay(scale: number, tx: number): string {
  return `translate(${r2(tx)} ${r2(MID_Y + scale * 24)}) rotate(-90) scale(${scale})`
}

/** The violin: 21 stage units per glyph unit, so its body is ~245 across. */
const SCALE = 21
/** Puts the middle of the instrument (glyph y 31) just left of centre. */
const TX = -656

/** Stage x of a glyph y on the violin. */
const sx = (gy: number) => r2(TX + SCALE * gy)

/** Where the bow meets the strings: between fingerboard end and bridge. */
const CONTACT_GY = 35.9
const CONTACT_X = sx(CONTACT_GY)

/** The bowed string (the D), and its sounding length from nut to bridge. */
const BOWED = 1
const NUT_GY = 19.3
const BRIDGE_GY = 37.5

/**
 * The blur of the bowed string: a spindle from nut to bridge, in glyph
 * units, 0.3 either side at its widest (~6 stage units).
 */
const SPINDLE = (() => {
  // The D string runs from x 23.78 at the nut to 23.56 at the bridge.
  const x0 = 23.78
  const x1 = 23.56
  const mid = (NUT_GY + BRIDGE_GY) / 2
  const xm = (x0 + x1) / 2
  const w = 0.6
  return `M${x0} ${NUT_GY} Q${xm + w} ${mid} ${x1} ${BRIDGE_GY} Q${xm - w} ${mid} ${x0} ${NUT_GY} Z`
})()

/** The frame the app draws round the instrument in view. */
const FRAME = { x: -372, y: 34, w: 728, h: 292 }
const BRACKET = 16
/** Where the bow's head sits at the top of a down-bow: just inside the frame. */
const BOW_TOP = FRAME.y + 12

function brackets(x: number, y: number, w: number, h: number): string {
  const b = BRACKET
  return [
    `M${x} ${y + b} V${y} H${x + b}`,
    `M${x + w - b} ${y} H${x + w} V${y + b}`,
    `M${x + w} ${y + h - b} V${y + h} H${x + w - b}`,
    `M${x + b} ${y + h} H${x} V${y + h - b}`
  ].join(' ')
}

/** Peg heads: a small paddle on each end of the two peg lines. */
const PEGS: Array<[number, number]> = [
  [21.5, 18.5],
  [26.5, 18.5],
  [21.5, 17.38],
  [26.5, 17.38]
]

export function InstrumentsCoverB() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`${-STAGE_W / 2} 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        {/* The drafting axis every instrument lies along. */}
        <line
          className={styles.axis}
          x1={-STAGE_W / 2}
          y1={MID_Y}
          x2={STAGE_W / 2}
          y2={MID_Y}
        />

        {/* The rest of the trio, in the wings: the cello's lower bout
            ends at x −470, the viola's scroll starts at x 470. */}
        <g className={styles.wing} transform={lay(31, -470 - 31 * 46.5)}>
          <GlyphBody kind='cello' />
        </g>
        <g className={styles.wing} transform={lay(24, 470 - 24 * 14.7)}>
          <GlyphBody kind='viola' />
        </g>

        <rect
          className={styles.frameDash}
          x={FRAME.x}
          y={FRAME.y}
          width={FRAME.w}
          height={FRAME.h}
        />
        <path
          className={styles.frameCorners}
          d={brackets(FRAME.x, FRAME.y, FRAME.w, FRAME.h)}
        />

        {/* The violin */}
        <g className={styles.violin} transform={lay(SCALE, TX)}>
          <GlyphBody kind='violin' />
          {PEGS.map(([x, y]) => (
            <ellipse
              key={`${x}-${y}`}
              data-part='thin'
              cx={x}
              cy={y}
              rx={0.42}
              ry={0.3}
            />
          ))}
        </g>

        {/* The bowed string: its blur, then the string itself in amber. */}
        <g className={styles.sounding} transform={lay(SCALE, TX)}>
          <path className={styles.spindle} d={SPINDLE} />
          <path className={styles.string} d={VIOLIN_STRINGS[BOWED]} />
        </g>

        {/* The bow: hair on the strings, the stick beside it, the head at
            the top. It runs off the bottom of the stage, so only the head
            shows that it is moving. Tilted 3° as a player holds it. */}
        <g transform={`rotate(3 ${CONTACT_X} ${MID_Y})`}>
          <g className={styles.bow}>
            <line
              className={styles.hair}
              x1={CONTACT_X - 3}
              y1={BOW_TOP + 18}
              x2={CONTACT_X - 3}
              y2={560}
            />
            <path
              className={styles.stick}
              d={`M${CONTACT_X - 3} ${BOW_TOP + 18} V${BOW_TOP + 8} L${CONTACT_X + 5} ${BOW_TOP} V560`}
            />
          </g>
        </g>

        {/* The contact point, marked as the app marks it. */}
        <g className={styles.target}>
          <circle cx={CONTACT_X} cy={MID_Y + 8} r={8} />
          <path
            d={`M${CONTACT_X - 12} ${MID_Y + 8} H${CONTACT_X + 12} M${CONTACT_X} ${MID_Y - 4} V${MID_Y + 20}`}
          />
        </g>
      </svg>
    </div>
  )
}
