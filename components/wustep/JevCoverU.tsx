import { type CSSProperties } from 'react'

import styles from './JevCoverU.module.css'

/**
 * JevCoverU — "The waggle dance."
 *
 *   A cutaway hive on the left of a summer meadow, four flowers across the
 *   grass — one per room. Jev is the dancer on the comb: a bee's figure-8
 *   whose straight waggle run points at exactly one flower. At rest the
 *   dancer is poised at the start of its run, the faint figure-8 is chalked
 *   on the comb, and the foragers wait on the landing board. Hover runs the
 *   beat: two figure-8s, then the foragers lift off and fly to the gold
 *   flower, turn on its petals, and fly home.
 *
 *   The stage is 1600×360 sliced to the cover box; the beat lives inside the
 *   middle 640 units a 16:9 card shows, and the wings are only more meadow.
 */

const STAGE_W = 1600
const STAGE_H = 360

const INK = 'var(--ju-ink)'

const HIVE = { x: 470, y: 72, w: 300, h: 250 }
const COMB = { x: 490, y: 96, w: 260, h: 206 }
const DANCER = { x: 620, y: 206 }

const FLOWERS = [
  { x: 872, y: 206, petal: 'var(--ju-blue)', s: 0.85 },
  { x: 952, y: 160, petal: 'var(--ju-rose)', s: 0.95 },
  { x: 1036, y: 118, petal: 'var(--ju-gold)', s: 1.1 },
  { x: 1108, y: 184, petal: 'var(--ju-mint)', s: 0.85 }
]
const PICK_I = 2
const PICK = FLOWERS[PICK_I]!

/** The straight run points at the pick; that's the whole message. */
const RUN_DEG =
  (Math.atan2(PICK.y - DANCER.y, PICK.x - DANCER.x) * 180) / Math.PI

/** Local figure-8, run along +x: run, loop up, run, loop down. */
const EIGHT = 'M-46,0 L46,0 C104,-76 -104,-76 -46,0 L46,0 C104,76 -104,76 -46,0'

/** Foragers wait on the landing board and land around the gold flower. */
const FORAGERS = [
  { x: 792, y: 312, to: [1012, 102] },
  { x: 816, y: 314, to: [1060, 96] },
  { x: 840, y: 311, to: [1040, 132] }
] as const

function flightPath(x: number, y: number, tx: number, ty: number) {
  return `path('M${x},${y} C${x + 90},${y} ${tx - 150},${ty - 70} ${tx},${ty}')`
}

/** Pointy-top honeycomb, clipped to the comb frame. */
const HEX_R = 13
const HEX_W = Math.sqrt(3) * HEX_R
const CELLS: { cx: number; cy: number; kind: 'wax' | 'honey' | 'cap' }[] = []
for (let row = 0; row < 12; row++) {
  for (let col = 0; col < 13; col++) {
    const k = (col * 7 + row * 11) % 9
    CELLS.push({
      cx: COMB.x + col * HEX_W + (row % 2 ? HEX_W / 2 : 0),
      cy: COMB.y + row * 1.5 * HEX_R,
      kind: k < 2 ? 'honey' : k === 2 ? 'cap' : 'wax'
    })
  }
}
function hex(cx: number, cy: number) {
  let d = ''
  for (let k = 0; k < 6; k++) {
    const a = ((60 * k - 90) * Math.PI) / 180
    d += `${k ? 'L' : 'M'}${(cx + (HEX_R - 1) * Math.cos(a)).toFixed(1)},${(cy + (HEX_R - 1) * Math.sin(a)).toFixed(1)}`
  }
  return d + 'Z'
}
const CELL_FILL = {
  wax: 'var(--ju-comb)',
  honey: 'var(--ju-honey)',
  cap: 'var(--ju-cap)'
}

/** Bee facing +x, centered on the origin, ~34 long. */
function Bee() {
  return (
    <g stroke={INK} strokeWidth='2' strokeLinejoin='round'>
      <g className={styles.flutter}>
        <ellipse
          cx='-3'
          cy='-11'
          rx='9'
          ry='6'
          fill='var(--ju-wing)'
          transform='rotate(-24 -3 -11)'
        />
        <ellipse
          cx='3'
          cy='-12'
          rx='8'
          ry='5'
          fill='var(--ju-wing)'
          transform='rotate(-8 3 -12)'
        />
      </g>
      <path d='M-15,0 L-21,0' strokeWidth='2.5' strokeLinecap='round' />
      <ellipse cx='0' cy='0' rx='15' ry='9.5' fill='var(--ju-bee)' />
      <path d='M-5,-9 L-5,9 M3,-9.5 L3,9.5' strokeWidth='3.5' />
      <circle cx='15' cy='0' r='6.5' fill={INK} />
      <path d='M18,-5 q3,-8 9,-9' fill='none' strokeLinecap='round' />
    </g>
  )
}

function Flower({
  x,
  y,
  petal,
  s,
  pick
}: {
  x: number
  y: number
  petal: string
  s: number
  pick: boolean
}) {
  return (
    <g>
      <path
        d={`M${x},332 C${x - 10},${(332 + y) / 2 + 20} ${x + 10},${(332 + y) / 2 - 10} ${x},${y}`}
        stroke='var(--ju-stem)'
        strokeWidth='5'
        fill='none'
        strokeLinecap='round'
      />
      <path
        d={`M${x - 1},${y + 70} q-26,-10 -30,-28 q20,2 30,22 Z`}
        fill='var(--ju-stem)'
      />
      <g transform={`translate(${x}, ${y}) scale(${s})`}>
        <g className={pick ? styles.bloom : undefined}>
          <g fill={petal} stroke={INK} strokeWidth='2.5'>
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse
                key={a}
                cx='0'
                cy='-17'
                rx='10'
                ry='15'
                transform={`rotate(${a})`}
              />
            ))}
          </g>
          <circle
            cx='0'
            cy='0'
            r='10'
            fill='var(--ju-eye)'
            stroke={INK}
            strokeWidth='2.5'
          />
        </g>
      </g>
    </g>
  )
}

export function JevCoverU() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <clipPath id='jev-u-comb'>
            <rect x={COMB.x} y={COMB.y} width={COMB.w} height={COMB.h} rx='6' />
          </clipPath>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill='var(--ju-sky)' />
        <circle cx='1210' cy='70' r='30' fill='var(--ju-sun)' />
        <g fill='var(--ju-cloud)'>
          <ellipse cx='900' cy='56' rx='48' ry='12' />
          <ellipse cx='926' cy='46' rx='26' ry='12' />
          <ellipse cx='330' cy='80' rx='40' ry='10' />
          <ellipse cx='1420' cy='44' rx='34' ry='9' />
        </g>

        {/* far hedge, then the meadow */}
        <path
          d='M0,236 C220,214 420,226 640,214 C860,202 1080,222 1300,210 C1440,204 1520,214 1600,210 L1600,360 L0,360 Z'
          fill='var(--ju-hill)'
        />
        <path
          d='M0,300 C300,288 560,296 800,290 C1040,284 1300,298 1600,290 L1600,360 L0,360 Z'
          fill='var(--ju-meadow)'
        />

        {/* the gold flower sits in a soft glow */}
        <circle
          className={styles.glow}
          cx={PICK.x}
          cy={PICK.y}
          r='54'
          fill='var(--ju-gold)'
        />
        {FLOWERS.map((f, i) => (
          <Flower key={f.x} {...f} pick={i === PICK_I} />
        ))}
        {/* wing flowers: small, dim, just more meadow */}
        {[
          { x: 300, y: 250, petal: 'var(--ju-rose)', s: 0.6 },
          { x: 1300, y: 244, petal: 'var(--ju-blue)', s: 0.6 },
          { x: 1440, y: 262, petal: 'var(--ju-mint)', s: 0.5 },
          { x: 160, y: 266, petal: 'var(--ju-gold)', s: 0.5 }
        ].map((f) => (
          <g key={f.x} opacity='0.55'>
            <Flower {...f} pick={false} />
          </g>
        ))}

        {/* the hive: a cutaway box on a stand */}
        <g stroke={INK} strokeWidth='3' strokeLinejoin='round'>
          <rect
            x={HIVE.x + 30}
            y={HIVE.y + HIVE.h}
            width='12'
            height='24'
            fill={INK}
          />
          <rect
            x={HIVE.x + HIVE.w - 42}
            y={HIVE.y + HIVE.h}
            width='12'
            height='24'
            fill={INK}
          />
          <path
            d={`M${HIVE.x - 18},${HIVE.y} L${HIVE.x + 20},${HIVE.y - 30} L${HIVE.x + HIVE.w - 20},${HIVE.y - 30} L${HIVE.x + HIVE.w + 18},${HIVE.y} Z`}
            fill='var(--ju-roof)'
          />
          <rect
            x={HIVE.x}
            y={HIVE.y}
            width={HIVE.w}
            height={HIVE.h}
            rx='6'
            fill='var(--ju-wood)'
          />
          <path
            d={`M${HIVE.x + HIVE.w - 4},${HIVE.y + HIVE.h - 8} L${HIVE.x + HIVE.w + 84},${HIVE.y + HIVE.h - 8} L${HIVE.x + HIVE.w + 84},${HIVE.y + HIVE.h + 2} L${HIVE.x + HIVE.w - 4},${HIVE.y + HIVE.h + 2} Z`}
            fill='var(--ju-wood)'
          />
        </g>
        <g clipPath='url(#jev-u-comb)'>
          <rect
            x={COMB.x}
            y={COMB.y}
            width={COMB.w}
            height={COMB.h}
            fill='var(--ju-comb-deep)'
          />
          {CELLS.map((c, i) => (
            <path
              key={i}
              d={hex(c.cx, c.cy)}
              fill={CELL_FILL[c.kind]}
              stroke='var(--ju-comb-line)'
              strokeWidth='1.5'
            />
          ))}
        </g>
        <rect
          x={COMB.x}
          y={COMB.y}
          width={COMB.w}
          height={COMB.h}
          rx='6'
          fill='none'
          stroke={INK}
          strokeWidth='3'
        />

        {/* Jev: the dancer, and the figure-8 chalked where it dances */}
        <g transform={`translate(${DANCER.x}, ${DANCER.y}) rotate(${RUN_DEG})`}>
          <path
            d={EIGHT}
            fill='none'
            stroke='var(--ju-trail)'
            strokeWidth='3'
            strokeDasharray='2 7'
            strokeLinecap='round'
          />
          <path
            d='M52,0 L70,0 M62,-7 L70,0 L62,7'
            fill='none'
            stroke='var(--ju-trail)'
            strokeWidth='3'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <g
            className={styles.dancer}
            style={{ offsetPath: `path('${EIGHT}')` }}
          >
            <g className={styles.waggle}>
              <Bee />
            </g>
          </g>
        </g>

        {/* the foragers: waiting on the board, then off to the gold flower */}
        {FORAGERS.map((f, i) => (
          <g
            key={i}
            className={styles.forager}
            style={
              {
                offsetPath: flightPath(f.x, f.y, f.to[0], f.to[1]),
                animationDelay: `${i * 0.22}s`
              } as CSSProperties
            }
          >
            <g transform='scale(0.72)'>
              <Bee />
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}
