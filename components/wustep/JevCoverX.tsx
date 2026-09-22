import { type CSSProperties } from 'react'

import styles from './JevCoverX.module.css'

/**
 * JevCoverX — "The signal flags."
 *
 *   A railway junction under a cliff: one line comes in from the left and
 *   fans into four branches, each running into a tunnel with a painted
 *   portal — one per room. Jev is the flagman on the lookout tower: one arm,
 *   one flag, one route. At rest the gold flag already points at the gold
 *   tunnel and a little train waits on the main line. Hover runs the beat:
 *   the flagman signals (both flags up, crossed, up), sweeps the portals,
 *   points at gold, and the train rolls down the gold branch into the
 *   tunnel, then backs out home.
 *
 *   The stage is 1600×360 sliced to the cover box; the beat lives inside the
 *   middle 640 units a 16:9 card shows, and the wings are only more line.
 */

const STAGE_W = 1600
const STAGE_H = 360

const INK = 'var(--jx-ink)'

const MAIN_Y = 334
const FORK_X = 690
/** Portals sit on the slanted cliff face running (960,90) → (1100,360). */
const PORTALS = [112, 176, 240, 304].map((y, i) => ({
  x: Math.round(960 + ((y - 90) * 140) / 270),
  y,
  color: [
    'var(--jx-blue)',
    'var(--jx-rose)',
    'var(--jx-gold)',
    'var(--jx-mint)'
  ][i]!
}))
const PICK_I = 2
const PICK = PORTALS[PICK_I]!

function branch(px: number, py: number) {
  return `M${FORK_X},${MAIN_Y} C${FORK_X + 130},${MAIN_Y} ${px - 150},${py} ${px},${py}`
}
/** The train's route: the whole main line, the gold branch, and on into the dark. */
const ROUTE = `M160,${MAIN_Y} L${FORK_X},${MAIN_Y} C${FORK_X + 130},${MAIN_Y} ${PICK.x - 150},${PICK.y} ${PICK.x},${PICK.y} L${PICK.x + 140},${PICK.y}`
const TRAIN_REST = 500

const SHOULDER = { x: 578, y: 126 }
const ANGLES = PORTALS.map(
  (p) => (Math.atan2(p.y - 22 - SHOULDER.y, p.x - SHOULDER.x) * 180) / Math.PI
)

const CARS = [
  { lag: 0, kind: 'loco' },
  { lag: 62, kind: 'car' },
  { lag: 118, kind: 'car' }
] as const

function Rails({ d }: { d: string }) {
  // Sleepers, then two rails made from one fat ink stroke with a
  // ground-coloured core cut down its middle.
  return (
    <g fill='none'>
      <path
        d={d}
        stroke='var(--jx-tie)'
        strokeWidth='16'
        strokeDasharray='4 9'
      />
      <path d={d} stroke={INK} strokeWidth='9' />
      <path d={d} stroke='var(--jx-bed)' strokeWidth='4.5' />
    </g>
  )
}

function Car({ kind }: { kind: 'loco' | 'car' }) {
  // Facing +x, wheels on y = 0, centered on x = 0.
  return (
    <g stroke={INK} strokeWidth='2.5' strokeLinejoin='round'>
      {kind === 'loco' ? (
        <>
          <rect
            x='-26'
            y='-28'
            width='20'
            height='22'
            rx='2'
            fill='var(--jx-loco)'
          />
          <path
            d='M-6,-18 L22,-18 C26,-18 28,-14 28,-10 L28,-6 L-6,-6 Z'
            fill='var(--jx-loco)'
          />
          <rect x='12' y='-28' width='7' height='10' fill={INK} />
          <rect x='-22' y='-24' width='12' height='8' fill='var(--jx-window)' />
          <path d='M-29,-30 L-3,-30' strokeWidth='4' strokeLinecap='round' />
        </>
      ) : (
        <rect
          x='-24'
          y='-24'
          width='48'
          height='18'
          rx='3'
          fill='var(--jx-car)'
        />
      )}
      <circle cx='-14' cy='-4' r='5' fill={INK} />
      <circle cx='14' cy='-4' r='5' fill={INK} />
    </g>
  )
}

function Arch({ color }: { color: string }) {
  return (
    <path
      d='M-18,0 L-18,-30 A18,18 0 0 1 18,-30 L18,0'
      fill='none'
      stroke={color}
      strokeWidth='7'
      strokeLinejoin='round'
    />
  )
}

export function JevCoverX() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <clipPath id='jev-x-daylight'>
            <rect x='0' y='0' width={PICK.x} height={STAGE_H} />
          </clipPath>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill='var(--jx-sky)' />
        <circle cx='360' cy='62' r='26' fill='var(--jx-sun)' />
        <g fill='var(--jx-cloud)'>
          <ellipse cx='720' cy='60' rx='44' ry='11' />
          <ellipse cx='744' cy='50' rx='24' ry='11' />
          <ellipse cx='1360' cy='30' rx='36' ry='9' />
        </g>

        <path
          d='M0,250 C200,226 420,236 640,226 C760,220 860,226 960,224 L960,360 L0,360 Z'
          fill='var(--jx-hill)'
        />
        <path d='M0,300 L1600,300 L1600,360 L0,360 Z' fill='var(--jx-ground)' />

        {/* the cliff, with the tunnel mouths cut into its face */}
        <path
          d='M960,90 C990,70 1060,62 1140,66 C1300,74 1440,52 1600,58 L1600,360 L1100,360 Z'
          fill='var(--jx-cliff)'
          stroke={INK}
          strokeWidth='3'
          strokeLinejoin='round'
        />
        <g
          stroke='var(--jx-cliff-line)'
          strokeWidth='3'
          fill='none'
          strokeLinecap='round'
        >
          <path d='M1150,120 l60,-8 M1240,180 l80,6 M1180,260 l50,-6 M1360,140 l70,4 M1400,280 l60,-8' />
        </g>
        <circle
          className={styles.glow}
          cx={PICK.x}
          cy={PICK.y - 24}
          r='44'
          fill='var(--jx-gold)'
        />
        {PORTALS.map((p) => (
          <path
            key={p.y}
            d={`M${p.x - 18},${p.y} L${p.x - 18},${p.y - 30} A18,18 0 0 1 ${p.x + 18},${p.y - 30} L${p.x + 18},${p.y} Z`}
            fill='var(--jx-tunnel)'
          />
        ))}

        {/* track: the main line and its four branches */}
        <Rails d={`M0,${MAIN_Y} L${FORK_X + 2},${MAIN_Y}`} />
        {PORTALS.map((p) => (
          <Rails key={p.y} d={branch(p.x, p.y)} />
        ))}
        <path
          d={branch(PICK.x, PICK.y)}
          fill='none'
          stroke='var(--jx-gold)'
          strokeWidth='3'
          className={styles.lit}
        />

        {/* the train, which vanishes at the gold portal's face */}
        <g clipPath='url(#jev-x-daylight)'>
          {CARS.map((c) => (
            <g
              key={c.lag}
              className={styles.car}
              style={
                {
                  offsetPath: `path('${ROUTE}')`,
                  '--rest': `${TRAIN_REST - c.lag}px`,
                  '--lag': `${c.lag + 10}px`
                } as CSSProperties
              }
            >
              <Car kind={c.kind} />
            </g>
          ))}
        </g>
        {PORTALS.map((p) => (
          <g key={p.y} transform={`translate(${p.x}, ${p.y})`}>
            <Arch color={p.color} />
          </g>
        ))}

        {/* Jev: the flagman on the lookout tower */}
        <g
          stroke={INK}
          strokeWidth='3'
          strokeLinejoin='round'
          strokeLinecap='round'
        >
          <path
            d='M540,300 L556,168 M616,300 L600,168 M548,236 L608,236 M544,270 L612,270 M552,204 L604,204'
            fill='none'
          />
          <rect
            x='532'
            y='162'
            width='92'
            height='10'
            rx='2'
            fill='var(--jx-wood)'
          />
        </g>
        <g transform={`translate(${SHOULDER.x}, ${SHOULDER.y})`}>
          {/* left arm holds the plain flag */}
          <g transform='translate(-22, 0)'>
            <g className={styles.armL}>
              <path
                d='M0,0 L30,0'
                stroke={INK}
                strokeWidth='7'
                strokeLinecap='round'
              />
              <path d='M30,0 L52,0' stroke={INK} strokeWidth='2.5' />
              <path
                d='M52,-1 L52,-19 L70,-19 L70,-1 Z'
                fill='var(--jx-flag)'
                stroke={INK}
                strokeWidth='2'
                strokeLinejoin='round'
              />
            </g>
          </g>
          <g fill={INK}>
            <path d='M-24,36 L-20,-4 C-18,-10 -4,-10 0,-4 L4,36 Z' />
            <path d='M-22,36 L-24,34 L-26,48 L-18,48 Z M-2,36 L2,34 L4,48 L-4,48 Z' />
            <circle cx='-10' cy='-18' r='10' />
            <path d='M-22,-24 L2,-24 L-2,-32 L-18,-32 Z' fill='var(--jx-cap)' />
          </g>
          {/* right arm: the pointer, with the gold flag */}
          <g
            className={styles.armR}
            style={
              {
                '--a0': `${ANGLES[0]}deg`,
                '--a1': `${ANGLES[1]}deg`,
                '--a2': `${ANGLES[2]}deg`,
                '--a3': `${ANGLES[3]}deg`
              } as CSSProperties
            }
          >
            <path
              d='M0,0 L30,0'
              stroke={INK}
              strokeWidth='7'
              strokeLinecap='round'
            />
            <path d='M30,0 L56,0' stroke={INK} strokeWidth='2.5' />
            <g className={styles.flap}>
              <path
                d='M56,-1 L56,-23 L78,-23 L78,-1 Z'
                fill='var(--jx-gold)'
                stroke={INK}
                strokeWidth='2'
                strokeLinejoin='round'
              />
              <path d='M56,-1 L78,-23' stroke={INK} strokeWidth='2' />
              <path
                d='M56,-1 L78,-1 L78,-23 Z'
                fill='var(--jx-flag)'
                opacity='0.35'
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
