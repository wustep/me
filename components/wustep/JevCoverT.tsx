import { type CSSProperties } from 'react'

import styles from './JevCoverT.module.css'

/**
 * JevCoverT — "The sheepdog."
 *
 *   A hillside with four little stone folds along the ridge, each with a
 *   painted gate — one per room. Jev is the collie: it makes one small move
 *   and the flock does the rest. At rest the gold gate already stands open
 *   and the dog is crouched behind the sheep, eyes on them. Hover runs the
 *   beat: the dog slinks in behind the flock, the sheep stream uphill
 *   through the gold gate, the gate swings shut behind them, then opens
 *   again and the flock ambles back down while the dog trots home.
 *
 *   The stage is 1600×360 sliced to the cover box, so the full height
 *   always fits; the whole beat lives inside the middle 640 units a 16:9
 *   card shows, and the wings are only more hill.
 */

const STAGE_W = 1600
const STAGE_H = 360

const INK = 'var(--jt-ink)'

/** Pen centers along the ridge; the gold one (index 2) is the pick. */
const PEN_Y = 196
const PEN_W = 118
const PENS = [
  { x: 590, gate: 'var(--jt-blue)' },
  { x: 730, gate: 'var(--jt-rose)' },
  { x: 870, gate: 'var(--jt-gold)' },
  { x: 1010, gate: 'var(--jt-mint)' }
]
const PICK_I = 2
const PICK = PENS[PICK_I]!
/** Where the sheep funnel through on the way in and out. */
const MOUTH = { x: PICK.x, y: PEN_Y + 30 }

/**
 * The flock in the meadow (rest) and where each sheep ends up inside the
 * gold pen. The walk is a CSS translate through the gate mouth, staggered
 * per sheep so the flock streams instead of sliding as one block.
 */
const FLOCK = [
  { x: 744, y: 270, to: [840, 178], flip: false },
  { x: 800, y: 264, to: [868, 176], flip: false },
  { x: 856, y: 274, to: [898, 180], flip: true },
  { x: 718, y: 298, to: [846, 190], flip: false },
  { x: 774, y: 296, to: [872, 190], flip: false },
  { x: 830, y: 302, to: [900, 192], flip: true },
  { x: 884, y: 294, to: [856, 184], flip: true },
  { x: 800, y: 326, to: [888, 186], flip: false }
] as const

/** Scattered hill props, placed in mirror pairs about the stage center. */
const TUFTS = [
  { x: 520, y: 336 },
  { x: 1080, y: 336 },
  { x: 960, y: 270 },
  { x: 1120, y: 300 },
  { x: 380, y: 296 },
  { x: 1220, y: 296 },
  { x: 200, y: 322 },
  { x: 1400, y: 322 }
]
const TREES = [
  { x: 420, s: 1 },
  { x: 1180, s: 0.9 },
  { x: 250, s: 0.75 },
  { x: 1360, s: 0.8 }
]

function Sheep({ flip }: { flip: boolean }) {
  return (
    <g transform={flip ? 'scale(-1,1)' : undefined}>
      <g fill={INK}>
        <rect x='-14' y='6' width='5' height='14' rx='2' />
        <rect x='-5' y='8' width='5' height='13' rx='2' />
        <rect x='6' y='8' width='5' height='13' rx='2' />
        <rect x='13' y='6' width='5' height='14' rx='2' />
      </g>
      {/* fleece: a cloud of overlapping puffs */}
      <path
        d='M-20,4 a8,8 0 0 1 2,-14 a10,10 0 0 1 16,-6 a10,10 0 0 1 16,2 a8,8 0 0 1 8,14 a8,8 0 0 1 -8,10 a10,10 0 0 1 -16,0 a9,9 0 0 1 -18,-6 Z'
        fill='var(--jt-wool)'
        stroke={INK}
        strokeWidth='2.5'
        strokeLinejoin='round'
      />
      <ellipse cx='23' cy='-6' rx='8' ry='10' fill={INK} />
      <ellipse
        cx='17'
        cy='-13'
        rx='5'
        ry='2.6'
        fill={INK}
        transform='rotate(-25 17 -13)'
      />
      <circle cx='26' cy='-8' r='1.4' fill='var(--jt-wool)' />
    </g>
  )
}

function Dog() {
  // Border-collie silhouette, ~90 wide, facing right, feet on y = 0,
  // crouched low with the head out front: the herding eye.
  return (
    <g stroke={INK} strokeWidth='2.5' strokeLinejoin='round'>
      <path
        d='M-30,-22 C-44,-24 -52,-14 -48,-2 C-42,-10 -36,-14 -28,-14 Z'
        fill='var(--jt-dog)'
      />
      <circle cx='-47' cy='-4' r='4' fill='var(--jt-wool)' stroke='none' />
      <g fill='var(--jt-dog)'>
        <path d='M-24,-14 L-32,0 L-24,0 L-16,-12 Z' />
        <path d='M-14,-14 L-12,0 L-6,0 L-8,-14 Z' />
        <path d='M10,-14 L6,0 L12,0 L16,-12 Z' />
        <path d='M18,-14 L26,0 L32,0 L24,-14 Z' />
      </g>
      <path
        d='M-30,-24 C-20,-30 10,-30 22,-26 L30,-14 C20,-10 -10,-8 -28,-12 Z'
        fill='var(--jt-dog)'
      />
      <path
        d='M16,-28 C24,-28 30,-22 30,-12 C24,-12 18,-16 14,-24 Z'
        fill='var(--jt-wool)'
      />
      <path
        d='M20,-28 C24,-38 36,-38 40,-30 L50,-26 C50,-22 44,-20 38,-20 C30,-18 22,-20 20,-28 Z'
        fill='var(--jt-dog)'
      />
      <path d='M24,-34 L26,-44 L32,-36 Z' fill='var(--jt-dog)' />
      <path d='M40,-30 L50,-26' stroke='var(--jt-wool)' strokeWidth='2' />
      <circle cx='37' cy='-29' r='1.8' fill='var(--jt-wool)' stroke='none' />
    </g>
  )
}

const STONE = {
  fill: 'var(--jt-stone)',
  stroke: INK,
  strokeWidth: 2.5,
  strokeLinejoin: 'round'
} as const

/** Back wall and sides of a fold, drawn behind anything inside it. */
function PenBack({ x }: { x: number }) {
  const h = PEN_W / 2
  return (
    <g transform={`translate(${x}, ${PEN_Y})`}>
      <ellipse cx='0' cy='-14' rx={h - 4} ry='20' fill='var(--jt-pen-floor)' />
      <path
        d={`M${-h + 8},-40 L${h - 8},-40 L${h - 8},-30 L${-h + 8},-30 Z`}
        {...STONE}
      />
      <path
        d={`M${-h + 8},-40 L${-h},0 L${-h + 8},0 L${-h + 14},-32 Z`}
        {...STONE}
      />
      <path
        d={`M${h - 8},-40 L${h},0 L${h - 8},0 L${h - 14},-32 Z`}
        {...STONE}
      />
    </g>
  )
}

/** Front wall with its painted gate, drawn over anything inside the fold. */
function PenFront({
  x,
  gate,
  pick
}: {
  x: number
  gate: string
  pick: boolean
}) {
  const h = PEN_W / 2
  return (
    <g transform={`translate(${x}, ${PEN_Y})`}>
      <rect x={-h} y='-2' width={h - 22} height='14' rx='4' {...STONE} />
      <rect x='22' y='-2' width={h - 22} height='14' rx='4' {...STONE} />
      {/* gate: two rails and a brace, hinged at the left post */}
      <g transform='translate(-20, 0)'>
        <g className={pick ? styles.gate : undefined}>
          <g stroke={INK} strokeWidth='2' fill={gate}>
            <rect x='0' y='-4' width='40' height='6' rx='2' />
            <rect x='0' y='6' width='40' height='6' rx='2' />
            <rect x='-1' y='-6' width='5' height='20' rx='2' />
            <rect x='36' y='-6' width='5' height='20' rx='2' />
          </g>
        </g>
      </g>
      <rect x='-26' y='-12' width='7' height='28' rx='2' fill={INK} />
      <rect x='19' y='-12' width='7' height='28' rx='2' fill={INK} />
      {pick && (
        <g className={styles.pennant}>
          <line
            x1='22'
            y1='-12'
            x2='22'
            y2='-44'
            stroke={INK}
            strokeWidth='2.5'
          />
          <path
            d='M22,-44 L44,-38 L22,-31 Z'
            fill={gate}
            stroke={INK}
            strokeWidth='2'
            strokeLinejoin='round'
          />
        </g>
      )}
    </g>
  )
}

export function JevCoverT() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <rect width={STAGE_W} height={STAGE_H} fill='var(--jt-sky)' />
        <circle cx='1040' cy='64' r='28' fill='var(--jt-sun)' />
        <g fill='var(--jt-cloud)'>
          <ellipse cx='600' cy='72' rx='46' ry='12' />
          <ellipse cx='628' cy='62' rx='26' ry='12' />
          <ellipse cx='1260' cy='92' rx='40' ry='10' />
          <ellipse cx='240' cy='50' rx='36' ry='9' />
        </g>

        {/* far hills, then the ridge the folds sit on */}
        <path
          d='M0,150 C200,118 400,132 600,116 C800,100 1000,128 1200,110 C1400,96 1500,120 1600,112 L1600,360 L0,360 Z'
          fill='var(--jt-hill-far)'
        />
        <path
          d='M0,200 C260,160 560,150 800,146 C1040,142 1340,160 1600,156 L1600,360 L0,360 Z'
          fill='var(--jt-hill)'
        />

        {TREES.map(({ x, s }) => (
          <g key={x} transform={`translate(${x}, 176) scale(${s})`}>
            <rect x='-4' y='-10' width='8' height='22' fill={INK} />
            <circle
              cx='0'
              cy='-30'
              r='24'
              fill='var(--jt-tree)'
              stroke={INK}
              strokeWidth='2.5'
            />
          </g>
        ))}

        {/* the pick's fold sits in a faint gold glow */}
        <ellipse
          className={styles.glow}
          cx={PICK.x}
          cy={PEN_Y - 16}
          rx='84'
          ry='40'
          fill='var(--jt-gold)'
        />
        {PENS.map((pen) => (
          <PenBack key={pen.x} x={pen.x} />
        ))}

        {/* the near meadow the flock grazes on, and the trodden path up */}
        <path
          d='M0,244 C300,230 560,236 800,232 C1040,228 1320,242 1600,232 L1600,360 L0,360 Z'
          fill='var(--jt-meadow)'
        />
        <path
          d={`M${MOUTH.x - 26},${PEN_Y + 12} C${MOUTH.x - 30},250 ${MOUTH.x - 90},262 ${MOUTH.x - 110},290 L${MOUTH.x - 40},290 C${MOUTH.x - 20},262 ${MOUTH.x + 12},250 ${MOUTH.x + 26},${PEN_Y + 12} Z`}
          fill='var(--jt-path)'
        />
        <g
          stroke='var(--jt-tuft)'
          strokeWidth='3'
          strokeLinecap='round'
          fill='none'
        >
          {TUFTS.map(({ x, y }) => (
            <g key={`${x}-${y}`}>
              <path d={`M${x - 6},${y} q1,-8 -1,-12`} />
              <path d={`M${x},${y} q0,-10 3,-14`} />
              <path d={`M${x + 6},${y} q-1,-7 2,-10`} />
            </g>
          ))}
        </g>

        {/* the flock; back rows first so the front sheep overlap them */}
        {FLOCK.map((s, i) => (
          <g key={i} transform={`translate(${s.x}, ${s.y})`}>
            <g
              className={styles.sheep}
              style={
                {
                  '--mx': `${MOUTH.x - s.x}px`,
                  '--my': `${MOUTH.y - s.y}px`,
                  '--dx': `${s.to[0] - s.x}px`,
                  '--dy': `${s.to[1] - s.y}px`,
                  animationDelay: `${(i % 4) * 0.14 + Math.floor(i / 4) * 0.24}s`
                } as CSSProperties
              }
            >
              <ellipse cx='2' cy='20' rx='20' ry='4' fill='var(--jt-shadow)' />
              <g className={styles.trot}>
                <Sheep flip={s.flip} />
              </g>
            </g>
          </g>
        ))}

        {PENS.map((pen, i) => (
          <PenFront key={pen.x} x={pen.x} gate={pen.gate} pick={i === PICK_I} />
        ))}

        {/* Jev: the collie, crouched behind the flock */}
        <g transform='translate(640, 334)'>
          <g className={styles.dog}>
            <ellipse cx='0' cy='1' rx='38' ry='5' fill='var(--jt-shadow)' />
            <g className={styles.trot}>
              <Dog />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
