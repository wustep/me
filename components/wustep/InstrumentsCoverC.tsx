import styles from './InstrumentsCoverC.module.css'

/**
 * InstrumentsCoverC — hammer, bow, breath: the three ways the app starts a
 * sound, side by side on one line.
 *
 *   Unshipped variant, kept for the covers-preview workbench.
 *
 *   The app has no samples; every note begins as a felt hammer leaving a
 *   string, a bow dragging one, or breath across an edge, and its scope
 *   panel plots exactly that ("hammer force, bow friction or air jet").
 *   This cover is those three close up, in the app's painted palette: one
 *   string runs in from the left, is struck, then bowed, and hands over to
 *   the bore of a flute, blown. Whatever is sounding shows the spindle of
 *   its vibration in the accent.
 *
 *   At rest the struck string is still ringing. Hover plays the three in
 *   turn: the hammer flies, the bow draws, the jet blows.
 *
 *   Apply-on-hover, as LensesCover does, so the rest frame is exact and
 *   every hover starts with the strike.
 */

// ---- stage -----------------------------------------------------------------

/**
 * An extra-wide stage (1800×360, 5:1) under `slice`, x = 0 at its centre.
 * The three stations sit at x −250, 0 and 250 and need ~720 between them,
 * so all three are in frame on any card at least ~380px wide. The string
 * runs off the left wing and the flute off the right, so a wide card only
 * ever shows more of the same two things.
 */
const STAGE_W = 1800
const STAGE_H = 360

/** The line everything sounds along: the string, then the flute's bore. */
const LINE_Y = 150

const HAMMER_X = -250
const BOW_X = 0
const FLUTE_X = 250

/** Where the string ends and the flute begins. */
const HITCH_X = 104
const FLUTE_L = 128
/** Half the height of the flute's bore. */
const BORE = 18

// ---- palette ---------------------------------------------------------------

// The app's painted-style :root tokens.
const INK_2 = '#c9bfab'
const MUTED = '#8a8172'
const RULE_2 = '#3d372d'
const IVORY = '#efe7d6'
const IVORY_EDGE = '#b9ae98'
const EBONY = '#15120f'
const BRASS = '#c9a35c'
const ACCENT = '#ff5e38'
/** Hammer shank and bow stick: the maple and pernambuco of the app's 2D. */
const WOOD = '#8a5a34'
const WOOD_DARK = '#5a3a22'

/**
 * The spindle a vibrating string (or air column) leaves in a long
 * exposure: widest in the middle, pinched at the ends.
 */
function spindle(cx: number, half: number, height: number): string {
  return `M${cx - half} ${LINE_Y} Q${cx} ${LINE_Y - height * 2} ${cx + half} ${LINE_Y} Q${cx} ${LINE_Y + height * 2} ${cx - half} ${LINE_Y} Z`
}

function Wave({
  cx,
  half,
  className
}: {
  cx: number
  half: number
  className?: string
}) {
  return (
    <g className={className}>
      <path className={styles.blur} d={spindle(cx, half, 13)} fill={ACCENT} />
      <line
        className={styles.lit}
        x1={cx - half}
        y1={LINE_Y}
        x2={cx + half}
        y2={LINE_Y}
        stroke={ACCENT}
        strokeWidth={2.4}
        strokeLinecap='round'
      />
    </g>
  )
}

/** Tone holes along the flute, out into the right wing. */
const TONE_HOLES = Array.from({ length: 9 }, (_, i) => FLUTE_X + 170 + i * 64)

export function InstrumentsCoverC() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`${-STAGE_W / 2} 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        {/* The string: in from the left wing to its hitch pin. */}
        <line
          x1={-STAGE_W / 2}
          y1={LINE_Y}
          x2={HITCH_X}
          y2={LINE_Y}
          stroke={INK_2}
          strokeWidth={1.8}
          opacity={0.75}
        />
        <circle cx={HITCH_X} cy={LINE_Y} r={5} fill={BRASS} />

        {/* The flute: head joint at the left, body off into the wing. */}
        <rect
          x={FLUTE_L}
          y={LINE_Y - BORE}
          width={STAGE_W}
          height={BORE * 2}
          rx={3}
          fill='#191612'
          stroke={INK_2}
          strokeWidth={2}
        />
        {/* Crown and the tenon ring at the end of the head joint. */}
        <rect
          x={FLUTE_L - 12}
          y={LINE_Y - BORE - 3}
          width={18}
          height={BORE * 2 + 6}
          rx={4}
          fill={MUTED}
        />
        <rect
          x={FLUTE_X + 124}
          y={LINE_Y - BORE - 3}
          width={9}
          height={BORE * 2 + 6}
          rx={2}
          fill={MUTED}
        />
        {/* Lip plate and embouchure hole, seen from the side. */}
        <path
          d={`M${FLUTE_X - 62} ${LINE_Y - BORE} Q${FLUTE_X - 30} ${LINE_Y - BORE - 15} ${FLUTE_X + 2} ${LINE_Y - BORE} Z`}
          fill={INK_2}
        />
        <rect
          x={FLUTE_X - 38}
          y={LINE_Y - BORE - 9}
          width={16}
          height={10}
          fill='#191612'
        />
        {TONE_HOLES.map((x) => (
          <rect
            key={x}
            x={x - 11}
            y={LINE_Y - BORE - 6}
            width={22}
            height={6}
            rx={2}
            fill={MUTED}
          />
        ))}

        {/* What is sounding: one spindle per station. */}
        <Wave cx={HAMMER_X} half={104} className={styles.waveHammer} />
        <Wave cx={BOW_X} half={96} className={styles.waveBow} />
        <Wave cx={FLUTE_X + 40} half={84} className={styles.waveJet} />

        {/* Hammer: shank on its pivot, wooden moulding, felt. It rests
            ~26 units under the string and swings up about the pivot. */}
        <g className={styles.hammer}>
          <line
            x1={HAMMER_X - 96}
            y1={322}
            x2={HAMMER_X - 4}
            y2={270}
            stroke={WOOD}
            strokeWidth={7}
            strokeLinecap='round'
          />
          <circle cx={HAMMER_X - 96} cy={322} r={7} fill={BRASS} />
          <path
            d={`M${HAMMER_X - 14} 276 L${HAMMER_X + 6} 264 L${HAMMER_X + 8} 206 L${HAMMER_X - 8} 206 Z`}
            fill={WOOD_DARK}
          />
          <path
            d={`M${HAMMER_X - 20} 216 C${HAMMER_X - 23} 192 ${HAMMER_X - 10} 176 ${HAMMER_X} 176 C${HAMMER_X + 10} 176 ${HAMMER_X + 23} 192 ${HAMMER_X + 20} 216 C${HAMMER_X + 10} 223 ${HAMMER_X - 10} 223 ${HAMMER_X - 20} 216 Z`}
            fill={IVORY}
            stroke={IVORY_EDGE}
            strokeWidth={1.5}
          />
        </g>

        {/* Bow: stick, hair and frog, drawn lying along x and stood up
            64° so it crosses the string and runs off top and bottom. */}
        <g transform={`rotate(-64 ${BOW_X} ${LINE_Y})`}>
          <g className={styles.bow}>
            <line
              x1={BOW_X - 320}
              y1={LINE_Y - 15}
              x2={BOW_X + 320}
              y2={LINE_Y - 15}
              stroke={WOOD}
              strokeWidth={5}
            />
            <rect
              x={BOW_X - 320}
              y={LINE_Y - 4}
              width={640}
              height={7}
              fill={IVORY}
              opacity={0.92}
            />
            {/* Frog, with its pearl eye. */}
            <rect
              x={BOW_X - 196}
              y={LINE_Y - 17}
              width={38}
              height={17}
              rx={3}
              fill={EBONY}
              stroke={RULE_2}
              strokeWidth={1.5}
            />
            <circle cx={BOW_X - 177} cy={LINE_Y - 8.5} r={3.4} fill={IVORY} />
          </g>
        </g>

        {/* Air jet: three streaks from the player's lips to the far edge
            of the embouchure hole. */}
        <g className={styles.jet} stroke={IVORY} strokeLinecap='round'>
          <line
            x1={FLUTE_X - 96}
            y1={LINE_Y - 66}
            x2={FLUTE_X - 36}
            y2={LINE_Y - BORE - 12}
            strokeWidth={2.2}
          />
          <line
            x1={FLUTE_X - 104}
            y1={LINE_Y - 54}
            x2={FLUTE_X - 44}
            y2={LINE_Y - BORE - 4}
            strokeWidth={1.6}
          />
          <line
            x1={FLUTE_X - 86}
            y1={LINE_Y - 76}
            x2={FLUTE_X - 28}
            y2={LINE_Y - BORE - 20}
            strokeWidth={1.6}
          />
        </g>
      </svg>
    </div>
  )
}
