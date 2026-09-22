import { type CSSProperties } from 'react'

import styles from './JevCoverV.module.css'

/**
 * JevCoverV — "The lighthouse."
 *
 *   A striped lighthouse on a rock at twilight, four painted buoys riding
 *   the swell across the bay — one per room. Jev is the lamp: its beam can
 *   only rest on one buoy at a time. At rest the beam already lies on the
 *   gold buoy and two little sailboats wait in the lee of the rock. Hover
 *   runs the beat: the beam swings back across the bay, sweeps every buoy,
 *   locks onto the gold one (its lamp answers), and the boats sail out to
 *   it, then home again.
 *
 *   The stage is 1600×360 sliced to the cover box; the beat lives inside the
 *   middle 640 units a 16:9 card shows, and the wings are only more sea.
 */

const STAGE_W = 1600
const STAGE_H = 360

const INK = 'var(--jv-ink)'

const LAMP = { x: 548, y: 82 }
const HORIZON = 214

const BUOYS = [
  { x: 744, y: 244, s: 0.72, color: 'var(--jv-blue)' },
  { x: 852, y: 304, s: 1.05, color: 'var(--jv-rose)' },
  { x: 968, y: 262, s: 0.9, color: 'var(--jv-gold)' },
  { x: 1080, y: 234, s: 0.66, color: 'var(--jv-mint)' }
]
const PICK_I = 2

/** Beam angle (deg) that lands on each buoy's lantern. */
const ANGLES = BUOYS.map(
  (b) => (Math.atan2(b.y - 40 * b.s - LAMP.y, b.x - LAMP.x) * 180) / Math.PI
)

/** Boats rest in the lee of the rock and sail to either side of the gold buoy. */
const BOATS = [
  { x: 704, y: 318, to: [918, 272], s: 1 },
  { x: 758, y: 338, to: [1014, 286], s: 1.1 }
] as const

const WAVES = [
  { y: 236, x0: 0, a: 0.5 },
  { y: 262, x0: 40, a: 0.6 },
  { y: 292, x0: 10, a: 0.75 },
  { y: 326, x0: 60, a: 0.9 }
]

function Buoy({ color, pick }: { color: string; pick: boolean }) {
  // Waterline at y = 0, lantern at y = -40.
  return (
    <g stroke={INK} strokeWidth='2.5' strokeLinejoin='round'>
      <path d='M-18,-2 L18,-2 L14,8 L-14,8 Z' fill={INK} />
      <path d='M-12,-2 L-7,-30 L7,-30 L12,-2 Z' fill={color} />
      <path d='M-10,-12 L10,-12' stroke='var(--jv-foam)' strokeWidth='4' />
      <rect x='-3' y='-40' width='6' height='10' fill={INK} />
      <circle
        className={pick ? styles.lantern : undefined}
        cx='0'
        cy='-42'
        r='5'
        fill={pick ? 'var(--jv-beam)' : 'var(--jv-lantern-off)'}
      />
    </g>
  )
}

function Boat() {
  // Little sloop facing right, waterline at y = 0.
  return (
    <g stroke={INK} strokeWidth='2.5' strokeLinejoin='round'>
      <path d='M-26,-8 L28,-8 L18,4 L-18,4 Z' fill='var(--jv-hull)' />
      <path d='M0,-10 L0,-58' strokeWidth='3' />
      <path d='M3,-56 L3,-14 L28,-14 Z' fill='var(--jv-sail)' />
      <path d='M-3,-50 L-3,-14 L-22,-14 Z' fill='var(--jv-sail)' />
      <path d='M0,-58 L10,-54 L0,-51' fill='var(--jv-gold)' />
    </g>
  )
}

export function JevCoverV() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <linearGradient
            id='jev-v-beam'
            gradientUnits='userSpaceOnUse'
            x1='0'
            y1='0'
            x2='620'
            y2='0'
          >
            <stop offset='0' stopColor='var(--jv-beam)' stopOpacity='0.85' />
            <stop offset='1' stopColor='var(--jv-beam)' stopOpacity='0' />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill='var(--jv-sky)' />
        <ellipse cx='800' cy={HORIZON} rx='900' ry='90' fill='var(--jv-dusk)' />
        <g fill='var(--jv-star)'>
          {[
            [380, 40],
            [700, 30],
            [860, 60],
            [1010, 26],
            [1150, 70],
            [1300, 36],
            [240, 90],
            [1460, 60]
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r='2' />
          ))}
        </g>
        <circle cx='1180' cy='74' r='20' fill='var(--jv-moon)' />
        <circle cx='1189' cy='68' r='18' fill='var(--jv-sky)' />

        {/* far headland, then the bay */}
        <path
          d={`M1100,${HORIZON} C1200,184 1320,176 1440,190 C1520,198 1560,206 1600,204 L1600,${HORIZON} Z`}
          fill='var(--jv-headland)'
        />
        <path
          d={`M0,${HORIZON} C60,200 140,196 220,${HORIZON} Z`}
          fill='var(--jv-headland)'
        />
        <rect
          x='0'
          y={HORIZON}
          width={STAGE_W}
          height={STAGE_H - HORIZON}
          fill='var(--jv-sea)'
        />
        <rect
          x='0'
          y={HORIZON}
          width={STAGE_W}
          height='26'
          fill='var(--jv-sea-far)'
        />
        <g
          className={styles.swell}
          fill='none'
          stroke='var(--jv-wave)'
          strokeWidth='3'
          strokeLinecap='round'
        >
          {WAVES.map((w) => (
            <path
              key={w.y}
              opacity={w.a}
              d={Array.from({ length: 22 }, (_, k) => {
                const x = w.x0 + k * 80 - 80
                return `M${x},${w.y} q12,-6 24,0`
              }).join(' ')}
            />
          ))}
        </g>

        {/* the beam: drawn along +x from the lamp, rotated onto a buoy */}
        <g transform={`translate(${LAMP.x}, ${LAMP.y})`}>
          <g
            className={styles.beam}
            style={
              {
                '--a0': `${ANGLES[0]}deg`,
                '--a1': `${ANGLES[1]}deg`,
                '--a2': `${ANGLES[2]}deg`,
                '--a3': `${ANGLES[3]}deg`
              } as CSSProperties
            }
          >
            <path d='M0,-4 L620,-58 L620,58 L0,4 Z' fill='url(#jev-v-beam)' />
          </g>
        </g>

        {BUOYS.map((b, i) => (
          <g key={b.x} transform={`translate(${b.x}, ${b.y}) scale(${b.s})`}>
            <g
              className={styles.bob}
              style={{ animationDelay: `${-i * 0.7}s` }}
            >
              <Buoy color={b.color} pick={i === PICK_I} />
            </g>
          </g>
        ))}

        {/* the rock and the lighthouse on it */}
        <path
          d='M430,360 L452,300 L486,272 L530,262 L600,266 L640,290 L662,330 L676,360 Z'
          fill='var(--jv-rock)'
          stroke={INK}
          strokeWidth='3'
          strokeLinejoin='round'
        />
        <g stroke={INK} strokeWidth='3' strokeLinejoin='round'>
          <path
            d={`M${LAMP.x - 30},268 L${LAMP.x - 19},108 L${LAMP.x + 19},108 L${LAMP.x + 30},268 Z`}
            fill='var(--jv-tower)'
          />
          <path
            d={`M${LAMP.x - 27},228 L${LAMP.x - 25},200 L${LAMP.x + 25},200 L${LAMP.x + 27},228 Z`}
            fill='var(--jv-stripe)'
          />
          <path
            d={`M${LAMP.x - 23},170 L${LAMP.x - 22},144 L${LAMP.x + 22},144 L${LAMP.x + 23},170 Z`}
            fill='var(--jv-stripe)'
          />
          <rect
            x={LAMP.x - 8}
            y='240'
            width='16'
            height='28'
            rx='8'
            fill={INK}
          />
          <rect
            x={LAMP.x - 30}
            y='100'
            width='60'
            height='9'
            rx='2'
            fill={INK}
          />
          <rect
            x={LAMP.x - 16}
            y='68'
            width='32'
            height='32'
            fill='var(--jv-glass)'
          />
          <path
            d={`M${LAMP.x - 22},68 C${LAMP.x - 22},46 ${LAMP.x + 22},46 ${LAMP.x + 22},68 Z`}
            fill='var(--jv-stripe)'
          />
          <path d={`M${LAMP.x},48 L${LAMP.x},38`} />
        </g>
        <circle
          className={styles.lamp}
          cx={LAMP.x}
          cy={LAMP.y}
          r='10'
          fill='var(--jv-beam)'
        />

        {/* the boats, waiting in the lee */}
        {BOATS.map((b, i) => (
          <g key={b.x} transform={`translate(${b.x}, ${b.y})`}>
            <g
              className={styles.boat}
              style={
                {
                  '--dx': `${b.to[0] - b.x}px`,
                  '--dy': `${b.to[1] - b.y}px`,
                  animationDelay: `${i * 0.3}s`
                } as CSSProperties
              }
            >
              <g transform={`scale(${b.s})`}>
                <g
                  className={styles.bob}
                  style={{ animationDelay: `${-i * 1.1}s` }}
                >
                  <Boat />
                </g>
              </g>
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}
