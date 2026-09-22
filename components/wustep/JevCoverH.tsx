import styles from './JevCoverH.module.css'
import { jevTypeClass } from './jevCoverType'

/**
 * JevCoverH — the lever. Unshipped variant, kept for the covers-preview
 * workbench.
 *
 *   The trolley room as one absurd dilemma on a switch: the straight track
 *   runs to five lobsters, the siding to one very old sandwich. Jev
 *   answers trolley.act and the lever is thrown to match. At rest the
 *   answer is in — lever at pull, the siding inked red, the trolley
 *   waiting at the points. Hover lets it go: the trolley takes the siding
 *   and leaves, the next one rolls in while the lever wavers wait / pull /
 *   wait, then it lands on pull again.
 *
 *   The stage is wide (1200×240, sliced to the cover box); the switch sits
 *   in the middle ~420 units a 16:9 card shows, and a wider card only
 *   reveals more track.
 */

const INK = '#16161a'
const SHEET = '#fbf8f1'
const LINE = '#d6cfbf'
const MUTED = '#7a756b'
const TROLLEY = '#b3261e'

const STAGE_W = 1200
const STAGE_H = 240

// Track: a main line into a switch, then straight on or up the siding.
const TRACK_Y = 170
const SIDING_Y = 112
const SWITCH_X = 590
const SIDING_PATH = `M${SWITCH_X} ${TRACK_Y} C${SWITCH_X + 50} ${TRACK_Y} ${
  SWITCH_X + 50
} ${SIDING_Y} ${SWITCH_X + 100} ${SIDING_Y} H${STAGE_W}`
const STRAIGHT_PATH = `M${SWITCH_X} ${TRACK_Y} H${STAGE_W}`
const RAIL_GAP = 3.5

// Lever pivot, just shy of the switch; its rotation lives in the CSS.
const LEVER = { x: 548, y: 206, len: 34 }

// Trolley car at rest, stopped before the points (center x 496).
const CAR = { x: 470, w: 52, h: 22 }

const TIE_XS = Array.from({ length: 34 }, (_, i) => 6 + i * 18).filter(
  (x) => x < SWITCH_X - 4
)
const STRAIGHT_TIES = Array.from(
  { length: 34 },
  (_, i) => SWITCH_X + 14 + i * 18
)
const SIDING_TIES = Array.from(
  { length: 28 },
  (_, i) => SWITCH_X + 110 + i * 18
)

function Rails({ d }: { d: string }) {
  return (
    <>
      <path
        d={d}
        fill='none'
        stroke={INK}
        strokeWidth='1.4'
        transform={`translate(0 ${-RAIL_GAP})`}
      />
      <path
        d={d}
        fill='none'
        stroke={INK}
        strokeWidth='1.4'
        transform={`translate(0 ${RAIL_GAP})`}
      />
    </>
  )
}

function Ties({ xs, y }: { xs: readonly number[]; y: number }) {
  return (
    <>
      {xs.map((x) => (
        <line
          key={x}
          x1={x}
          x2={x}
          y1={y - 8}
          y2={y + 8}
          stroke={LINE}
          strokeWidth='3'
        />
      ))}
    </>
  )
}

export function JevCoverH() {
  const carTop = TRACK_Y - 4 - CAR.h
  return (
    <div className={`${styles.cover} ${jevTypeClass}`} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <Ties xs={TIE_XS} y={TRACK_Y} />
        <Ties xs={STRAIGHT_TIES} y={TRACK_Y} />
        <Ties xs={SIDING_TIES} y={SIDING_Y} />

        {/* The chosen way, inked under the rails: the siding for pull,
            straight on for wait. */}
        <path
          className={`${styles.anim} ${styles.pullWay}`}
          d={SIDING_PATH}
          fill='none'
          stroke={TROLLEY}
          strokeWidth='7'
          strokeOpacity='0.35'
        />
        <path
          className={`${styles.anim} ${styles.waitWay}`}
          d={STRAIGHT_PATH}
          fill='none'
          stroke={TROLLEY}
          strokeWidth='7'
          strokeOpacity='0.35'
        />

        <Rails d={`M0 ${TRACK_Y} H${SWITCH_X}`} />
        <Rails d={STRAIGHT_PATH} />
        <Rails d={SIDING_PATH} />

        {/* Who's on each track. */}
        <text className={styles.who} x={712} y={SIDING_Y - 16} fill={INK}>
          1 very old sandwich
        </text>
        <text className={styles.who} x={712} y={TRACK_Y + 28} fill={INK}>
          5 lobsters
        </text>

        {/* Question and answer, top left and top right of the crop. */}
        <text className={styles.tag} x={404} y={40} fill={MUTED}>
          trolley.act
        </text>
        <text className={styles.ask} x={404} y={64} fill={INK}>
          Pull the lever?
        </text>
        <g className={`${styles.anim} ${styles.answer}`}>
          <text className={styles.prob} x={728} y={45} fill={TROLLEY}>
            .64
          </text>
          <rect x={736} y={26} width={60} height={28} rx='3' fill={TROLLEY} />
          <text className={styles.chip} x={766} y={45} fill={SHEET}>
            pull
          </text>
        </g>

        {/* The lever: base plate, then the handle on its pivot. */}
        <rect
          x={LEVER.x - 14}
          y={LEVER.y - 2}
          width='28'
          height='10'
          rx='2'
          fill={SHEET}
          stroke={INK}
          strokeWidth='1.4'
        />
        <g className={`${styles.anim} ${styles.lever}`}>
          <line
            x1={LEVER.x}
            x2={LEVER.x}
            y1={LEVER.y}
            y2={LEVER.y - LEVER.len}
            stroke={INK}
            strokeWidth='2.4'
            strokeLinecap='round'
          />
          <circle cx={LEVER.x} cy={LEVER.y - LEVER.len} r='5' fill={TROLLEY} />
        </g>
        <circle cx={LEVER.x} cy={LEVER.y} r='2.5' fill={INK} />

        {/* The trolley. */}
        <g className={`${styles.anim} ${styles.car}`}>
          <line
            x1={CAR.x + CAR.w / 2}
            x2={CAR.x + CAR.w / 2 + 10}
            y1={carTop}
            y2={carTop - 16}
            stroke={INK}
            strokeWidth='1.4'
          />
          <rect
            x={CAR.x}
            y={carTop}
            width={CAR.w}
            height={CAR.h}
            rx='4'
            fill={SHEET}
            stroke={INK}
            strokeWidth='1.5'
          />
          <rect
            x={CAR.x}
            y={carTop + 13}
            width={CAR.w}
            height='4'
            fill={TROLLEY}
          />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={CAR.x + 6 + i * 14.5}
              y={carTop + 4}
              width='11'
              height='7'
              rx='1'
              fill='none'
              stroke={INK}
              strokeWidth='1'
            />
          ))}
          <circle cx={CAR.x + 11} cy={TRACK_Y - 3} r='4' fill={INK} />
          <circle cx={CAR.x + CAR.w - 11} cy={TRACK_Y - 3} r='4' fill={INK} />
        </g>
      </svg>
    </div>
  )
}
