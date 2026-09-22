import { useId } from 'react'

import styles from './JevCoverQ.module.css'

/**
 * JevCoverQ — snow globes. Unshipped variant, kept for the covers-preview
 * workbench.
 *
 *   A sunny windowsill with four snow globes, one world each: a piano
 *   under falling notes, a post box, two snowmen on a bench, a tram under
 *   its wire. Jev is a cat's paw dangling from the shelf above — all it
 *   ever does is tap. Each tapped globe wobbles, its snow lifts and falls,
 *   and the little world inside plays by itself.
 *
 *   640×360, sliced to the 16:9 cover box; wall and window run past the
 *   edges.
 */

const W = 640
const H = 360
// Wings: the cover box is pinned ~190px tall while cards run ~300–900px
// wide, so the full 360 height always shows and wider cards reveal up to
// WING more units each side. The 640 middle is the designed frame (exactly
// what a 16:9 card shows); the wings only hold expendable scenery.
const WING = 540

const INK = '#2b2530'

// Globes sit on the sill at y=SILL, one every GAP units, centered.
const SILL = 290
const R = 56
const GAP = 140
// The worlds inside are drawn for a 46-unit globe and scaled to fit.
const WORLD_SCALE = R / 46
const GLOBES = [
  { id: 'music', glass: '#fbe3a4', ink: '#6b4412', base: '#8a5a2b' },
  { id: 'inbox', glass: '#cfe3f2', ink: '#24425f', base: '#3f5a74' },
  { id: 'match', glass: '#f7d3dc', ink: '#6a2440', base: '#8a3a56' },
  { id: 'trolley', glass: '#d3ecd0', ink: '#1f5236', base: '#2f6a4a' }
] as const

type GlobeId = (typeof GLOBES)[number]['id']

const globeX = (i: number) => W / 2 - GAP * 1.5 + GAP * i
// The paw's toes hover this far above the glass at rest; a tap closes it.
const PAW_LIFT = 26
// Globe center sits one radius plus the base height above the sill.
const GLOBE_Y = SILL - 22 - R + 6
const PAW_TIP = GLOBE_Y - R - PAW_LIFT

// Loose snow resting in the bottom of each globe, and the flakes that lift
// when it's tapped (relative to the globe center).
const FLAKES = [
  [-28, 20],
  [-14, 30],
  [2, 24],
  [18, 32],
  [30, 18],
  [-6, 36],
  [10, 14],
  [-22, 8]
]

export function JevCoverQ() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `${uid}-${name}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`${-WING} 0 ${W + WING * 2} ${H}`}
        preserveAspectRatio='xMidYMid slice'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <defs>
          <linearGradient id={id('sky')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#9fd0ec' />
            <stop offset='1' stopColor='#e6f3f8' />
          </linearGradient>
          <radialGradient id={id('sheen')} cx='0.35' cy='0.3' r='0.75'>
            <stop offset='0' stopColor='#fff' stopOpacity='0.55' />
            <stop offset='0.5' stopColor='#fff' stopOpacity='0.08' />
            <stop offset='1' stopColor='#fff' stopOpacity='0.25' />
          </radialGradient>
          {GLOBES.map((globe, i) => (
            <clipPath key={globe.id} id={id(`clip-${globe.id}`)}>
              <circle cx={globeX(i)} cy={GLOBE_Y} r={R - 2} />
            </clipPath>
          ))}
        </defs>

        {/* Wall, window with sky and a cloud, curtains in the wings. */}
        <rect
          x={-WING - 20}
          y={-40}
          width={W + WING * 2 + 40}
          height={H + 80}
          fill='#f1e4cf'
        />
        <rect
          x={70}
          y={-10}
          width={500}
          height={SILL - 4}
          fill={`url(#${id('sky')})`}
        />
        <g className={styles.cloud}>
          <path
            d='M150 96a22 22 0 0 1 40-12a18 18 0 0 1 30 8a14 14 0 0 1 2 28h-66a14 14 0 0 1-6-24Z'
            fill='#fff'
            opacity='0.9'
          />
          <path
            d='M420 60a16 16 0 0 1 30-8a13 13 0 0 1 22 6a10 10 0 0 1 1 20h-48a10 10 0 0 1-5-18Z'
            fill='#fff'
            opacity='0.75'
          />
        </g>
        <path
          d={`M320 -10V${SILL - 4}M70 120H570`}
          stroke='#f7efe2'
          strokeWidth='8'
        />
        <rect
          x={70}
          y={-10}
          width={500}
          height={SILL - 4}
          fill='none'
          stroke='#f7efe2'
          strokeWidth='12'
        />
        <path d='M-20 -20H96Q84 120 104 260H-20Z' fill='#d97c5b' />
        <path d='M660 -20H544Q556 120 536 260H660Z' fill='#d97c5b' />
        <path
          d='M40 -20Q34 120 52 260M600 -20Q606 120 588 260'
          stroke='#c46a4a'
          strokeWidth='6'
          fill='none'
        />

        {/* Shelf above the window: the cat's perch, only its edge visible. */}
        <rect
          x={-WING - 20}
          y={-40}
          width={W + WING * 2 + 40}
          height={40}
          fill='#8a5a36'
        />
        <path
          d={`M${-WING - 20} 0H${W + WING + 20}`}
          stroke='#6e4428'
          strokeWidth='6'
        />
        {/* Tail dangling off the far end, swaying at rest. */}
        <path
          className={styles.tail}
          d='M606 2C612 34 590 52 600 80C606 96 620 96 616 108'
          stroke='#d9893d'
          strokeWidth='12'
          fill='none'
        />

        {/* Wings: framed pictures on the wall, pots on the sill. */}
        {[
          [-320, 70, '#a9c9e4'],
          [-150, 110, '#f5cf74'],
          [800, 90, '#f2b3c3'],
          [980, 60, '#a9d6a8']
        ].map(([x, y, fill]) => (
          <g key={x}>
            <rect
              x={Number(x) - 40}
              y={Number(y)}
              width={80}
              height={60}
              fill='#fbf5e8'
              stroke={INK}
              strokeWidth='4'
            />
            <rect
              x={Number(x) - 30}
              y={Number(y) + 10}
              width={60}
              height={40}
              fill={String(fill)}
            />
          </g>
        ))}
        {[-440, -230, -60, 700, 890, 1080].map((x, i) => (
          <g key={x}>
            <path
              d={`M${x} ${SILL - 36}q-18-28 -6-50M${x} ${SILL - 36}q4-34 22-44M${x} ${SILL - 36}q-4-20 -26-30`}
              stroke='#4e9a6a'
              strokeWidth='6'
              fill='none'
            />
            <path
              d={`M${x - 18} ${SILL - 36}H${x + 18}L${x + 13} ${SILL}H${x - 13}Z`}
              fill={i % 2 ? '#c46a4a' : '#d98a5b'}
              stroke={INK}
              strokeWidth='3'
            />
          </g>
        ))}

        {/* Sill */}
        <rect
          x={-WING - 20}
          y={SILL}
          width={W + WING * 2 + 40}
          height={18}
          fill='#b98552'
        />
        <rect
          x={-WING - 20}
          y={SILL + 18}
          width={W + WING * 2 + 40}
          height={H}
          fill='#e8d6ba'
        />
        <path
          d={`M${-WING - 20} ${SILL + 18}H${W + WING + 20}`}
          stroke='#8f6238'
          strokeWidth='4'
        />

        {GLOBES.map((globe, i) => {
          const x = globeX(i)
          return (
            <g
              key={globe.id}
              className={`${styles.anim} ${styles.wobble} ${styles[`wobble_${globe.id}`]}`}
              style={{ transformOrigin: `${x}px ${SILL}px` }}
            >
              <ellipse
                cx={x}
                cy={SILL + 1}
                rx={R + 4}
                ry={5}
                fill='#8f6238'
                opacity='0.35'
              />
              <path
                d={`M${x - R + 2} ${SILL}L${x - R + 10} ${SILL - 22}H${x + R - 10}L${x + R - 2} ${SILL}Z`}
                fill={globe.base}
                stroke={INK}
                strokeWidth='3'
              />
              <circle
                cx={x}
                cy={GLOBE_Y}
                r={R}
                fill={globe.glass}
                stroke={INK}
                strokeWidth='3'
              />
              <g clipPath={`url(#${id(`clip-${globe.id}`)})`}>
                <g
                  transform={`translate(${x} ${GLOBE_Y}) scale(${WORLD_SCALE}) translate(${-x} ${-GLOBE_Y})`}
                >
                  <World id={globe.id} x={x} y={GLOBE_Y} ink={globe.ink} />
                </g>
                {/* Snow drift at the bottom of the globe. */}
                <ellipse
                  cx={x}
                  cy={GLOBE_Y + R + 4}
                  rx={R}
                  ry={20}
                  fill='#fff'
                />
                <g
                  className={`${styles.anim} ${styles.snow} ${styles[`snow_${globe.id}`]}`}
                >
                  {FLAKES.map(([dx, dy], j) => (
                    <circle
                      key={j}
                      cx={x + (dx ?? 0) * WORLD_SCALE}
                      cy={GLOBE_Y + (dy ?? 0) * WORLD_SCALE - 44}
                      r={j % 3 === 0 ? 2.6 : 1.8}
                      fill='#fff'
                    />
                  ))}
                </g>
              </g>
              <circle cx={x} cy={GLOBE_Y} r={R} fill={`url(#${id('sheen')})`} />
              <path
                d={`M${x - 30} ${GLOBE_Y - 22}A36 36 0 0 1 ${x - 8} ${GLOBE_Y - 38}`}
                stroke='#fff'
                strokeWidth='4'
                opacity='0.8'
                fill='none'
              />
            </g>
          )
        })}

        {/* Jev: a cat's paw hanging from the shelf. It only ever taps. */}
        <g className={`${styles.anim} ${styles.paw}`}>
          <g className={`${styles.anim} ${styles.tap}`}>
            <Paw x={globeX(0)} tip={PAW_TIP} />
          </g>
        </g>
      </svg>
    </div>
  )
}

function Paw({ x, tip }: { x: number; tip: number }) {
  // A ginger foreleg hanging from the shelf, ending in a round mitten with
  // two toe creases — seen from the front, beans just peeking under.
  return (
    <g stroke={INK} strokeWidth='3'>
      <path d={`M${x - 14} -10V${tip - 26}H${x + 14}V-10Z`} fill='#d9893d' />
      {[24, 50, 76].map((y) => (
        <path
          key={y}
          d={`M${x - 13} ${y}q7 5 14 0`}
          stroke='#b0652a'
          strokeWidth='4'
          fill='none'
        />
      ))}
      <path
        d={`M${x - 18} ${tip - 26}Q${x - 22} ${tip} ${x} ${tip}Q${x + 22} ${tip} ${x + 18} ${tip - 26}Z`}
        fill='#f2c28f'
      />
      <path
        d={`M${x - 6} ${tip - 1}V${tip - 10}M${x + 6} ${tip - 1}V${tip - 10}`}
        strokeWidth='2'
        fill='none'
      />
      {[-11, 0, 11].map((dx) => (
        <ellipse
          key={dx}
          cx={x + dx}
          cy={tip + 1}
          rx={4}
          ry={2}
          fill='#f0a7a0'
          strokeWidth='1.5'
        />
      ))}
    </g>
  )
}

function World({
  id,
  x,
  y,
  ink
}: {
  id: GlobeId
  x: number
  y: number
  ink: string
}) {
  switch (id) {
    case 'music':
      return (
        <g fill={ink} color={ink}>
          {/* Grand piano with its lid up; notes drift like the snow. */}
          <path
            d={`M${x - 26} ${y + 8}H${x + 16}Q${x + 30} ${y + 8} ${x + 26} ${y + 18}H${x - 26}Z`}
          />
          <path
            d={`M${x - 24} ${y + 8}L${x + 8} ${y - 14}L${x + 12} ${y + 8}Z`}
          />
          <path
            d={`M${x - 20} ${y + 18}V${y + 32}M${x + 20} ${y + 18}V${y + 32}`}
            stroke={ink}
            strokeWidth='4'
          />
          <g className={`${styles.anim} ${styles.bounce_music}`}>
            <Note x={x - 16} y={y - 20} />
            <Note x={x + 20} y={y - 26} />
          </g>
        </g>
      )
    case 'inbox':
      return (
        <g fill={ink}>
          {/* Pillar post box with letters fluttering toward the slot. */}
          <path
            d={`M${x + 2} ${y + 34}V${y - 4}Q${x + 2} ${y - 20} ${x + 16} ${y - 20}Q${x + 30} ${y - 20} ${x + 30} ${y - 4}V${y + 34}Z`}
          />
          <rect x={x - 2} y={y - 24} width={36} height={6} rx={2} />
          <rect x={x + 9} y={y - 4} width={14} height={3} fill='#cfe3f2' />
          <g className={`${styles.anim} ${styles.bounce_inbox}`}>
            {[
              [-26, -14],
              [-16, 4],
              [-30, 14]
            ].map(([dx, dy]) => (
              <g key={dx + '' + dy}>
                <rect
                  x={x + (dx ?? 0) - 7}
                  y={y + (dy ?? 0) - 5}
                  width={14}
                  height={10}
                  rx={1}
                  fill='#fff'
                  stroke={ink}
                  strokeWidth='2'
                />
                <path
                  d={`M${x + (dx ?? 0) - 7} ${y + (dy ?? 0) - 5}l7 5 7-5`}
                  stroke={ink}
                  strokeWidth='1.5'
                  fill='none'
                />
              </g>
            ))}
          </g>
        </g>
      )
    case 'match':
      return (
        <g>
          {/* Two snowmen on a bench, leaning in when their globe is tapped. */}
          <rect x={x - 30} y={y + 18} width={60} height={4} fill={ink} />
          <path
            d={`M${x - 24} ${y + 22}V${y + 34}M${x + 24} ${y + 22}V${y + 34}`}
            stroke={ink}
            strokeWidth='3'
          />
          <g
            className={`${styles.anim} ${styles.leanL}`}
            style={{ transformOrigin: `${x - 14}px ${y + 18}px` }}
          >
            <circle
              cx={x - 14}
              cy={y + 8}
              r={11}
              fill='#fff'
              stroke={ink}
              strokeWidth='2'
            />
            <circle
              cx={x - 14}
              cy={y - 10}
              r={8}
              fill='#fff'
              stroke={ink}
              strokeWidth='2'
            />
            <path d={`M${x - 22} ${y - 17}h16l-3-9h-10Z`} fill={ink} />
            <path
              d={`M${x - 12} ${y - 9}l5 1`}
              stroke='#e0782e'
              strokeWidth='2.5'
            />
          </g>
          <g
            className={`${styles.anim} ${styles.leanR}`}
            style={{ transformOrigin: `${x + 14}px ${y + 18}px` }}
          >
            <circle
              cx={x + 14}
              cy={y + 8}
              r={11}
              fill='#fff'
              stroke={ink}
              strokeWidth='2'
            />
            <circle
              cx={x + 14}
              cy={y - 10}
              r={8}
              fill='#fff'
              stroke={ink}
              strokeWidth='2'
            />
            <path d={`M${x + 8} ${y - 16}q6-8 12 0`} fill='#c9637f' />
            <path
              d={`M${x + 12} ${y - 9}l-5 1`}
              stroke='#e0782e'
              strokeWidth='2.5'
            />
          </g>
        </g>
      )
    case 'trolley':
      return (
        <g fill={ink}>
          {/* Tram under its wire, rolling across the globe. */}
          <path
            d={`M${x - 50} ${y - 22}H${x + 50}`}
            stroke={ink}
            strokeWidth='1.5'
          />
          <g className={`${styles.anim} ${styles.bounce_trolley}`}>
            <path
              d={`M${x - 4} ${y - 4}L${x + 4} ${y - 22}`}
              stroke={ink}
              strokeWidth='2'
            />
            <rect x={x - 24} y={y - 4} width={46} height={28} rx={6} />
            {[0, 1, 2].map((k) => (
              <rect
                key={k}
                x={x - 19 + k * 13}
                y={y + 1}
                width={10}
                height={9}
                rx={1.5}
                fill='#d3ecd0'
              />
            ))}
            <circle cx={x - 12} cy={y + 26} r={4} />
            <circle cx={x + 10} cy={y + 26} r={4} />
          </g>
        </g>
      )
  }
}

function Note({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={0} rx={4.5} ry={3.2} transform='rotate(-20)' />
      <path d='M4 -1V-14' stroke='currentColor' strokeWidth='2' />
    </g>
  )
}
