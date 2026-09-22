import { type CSSProperties, useId } from 'react'

import styles from './JevCoverO.module.css'

/**
 * JevCoverO — the dollhouse. Unshipped variant, kept for the covers-preview
 * workbench.
 *
 *   A house cut open at night: four lit rooms (music, match, inbox,
 *   trolley) under one attic where a firefly — Jev — rests. The firefly
 *   never does the work; it only touches a room's lamp, and the room plays
 *   itself: the piano throws notes, the couple on the sofa leans in, a
 *   letter slides into its cubby, the toy trolley rolls down its track.
 *
 *   The card is always 16:9, so the stage is 640×360 with `slice`; the sky
 *   and hill run past the edges so a rounding crop never shows a seam.
 */

const W = 640
const H = 360
// Wings: the cover box is pinned ~190px tall while cards run ~300–900px
// wide, so the full 360 height always shows and wider cards reveal up to
// WING more units each side. The 640 middle is the designed frame (exactly
// what a 16:9 card shows); the wings only hold expendable scenery.
const WING = 540

const INK = '#231f2b'
const SILHOUETTE = '#2a2433'

// House shell. Two floors of two rooms under a gabled attic, centered.
const HOUSE = { x: 184, w: 272, eave: 118, floor1: 126, floor2: 222, base: 316 }
const WALL = 8
const MID_X = HOUSE.x + HOUSE.w / 2
const ROOM_W = (HOUSE.w - WALL * 3) / 2
const ROOM_H = HOUSE.floor2 - HOUSE.floor1 - WALL

// `lamp` is the pendant's x as a fraction of the room, placed where the
// room's own business isn't (over the bench, past the sofa, above the
// desk, clear of the pennant) so the firefly never lands on the action.
const ROOMS = [
  {
    id: 'music',
    col: 0,
    row: 0,
    lamp: 0.78,
    paper: '#f4c96e',
    glow: '#ffe7a3'
  },
  {
    id: 'match',
    col: 1,
    row: 0,
    lamp: 0.84,
    paper: '#eaa6b5',
    glow: '#ffd6de'
  },
  { id: 'inbox', col: 0, row: 1, lamp: 0.3, paper: '#9fc4d8', glow: '#d9f0ff' },
  {
    id: 'trolley',
    col: 1,
    row: 1,
    lamp: 0.3,
    paper: '#aad49b',
    glow: '#e2ffd6'
  }
] as const

// Firefly perch in the attic; each stop is 12 units outboard of a lamp.
const PERCH = { x: HOUSE.x + HOUSE.w / 2, y: 98 }
function lampOf(room: (typeof ROOMS)[number]) {
  const b = roomBox(room.col, room.row)
  return { x: b.x + b.w * room.lamp, y: b.y + 18 }
}
const FLIGHT = Object.fromEntries(
  ROOMS.flatMap((room) => {
    const lamp = lampOf(room)
    const side = room.lamp > 0.5 ? 1 : -1
    return [
      [`--${room.id}-x`, `${lamp.x + side * 12 - PERCH.x}px`],
      [`--${room.id}-y`, `${lamp.y + 2 - PERCH.y}px`]
    ]
  })
) as CSSProperties

function roomBox(col: number, row: number) {
  return {
    x: HOUSE.x + WALL + col * (ROOM_W + WALL),
    y: (row === 0 ? HOUSE.floor1 : HOUSE.floor2) + WALL / 2,
    w: ROOM_W,
    h: ROOM_H
  }
}

// Neighbors down the lane, for the wings: [x, width, height, lit window?].
const NEIGHBORS = [
  [-470, 120, 110, true],
  [-300, 150, 140, false],
  [-150, 90, 90, true],
  [700, 110, 120, false],
  [850, 150, 100, true],
  [1020, 110, 130, true]
] as const

const WING_STARS = Array.from({ length: 30 }, (_, i) => [
  ((i * 137) % (W + WING * 2)) - WING,
  18 + ((i * 53) % 160)
]).filter(([x]) => (x ?? 0) < -10 || (x ?? 0) > W + 10)

const STARS = [
  [40, 40],
  [96, 88],
  [140, 30],
  [520, 36],
  [566, 96],
  [604, 52],
  [470, 70],
  [22, 128],
  [612, 150],
  [250, 22]
]

export function JevCoverO() {
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
            <stop offset='0' stopColor='#1f2140' />
            <stop offset='0.7' stopColor='#3b3560' />
            <stop offset='1' stopColor='#5a4670' />
          </linearGradient>
          <radialGradient id={id('lamp')}>
            <stop offset='0' stopColor='#fff6d8' stopOpacity='0.95' />
            <stop offset='1' stopColor='#fff6d8' stopOpacity='0' />
          </radialGradient>
          <radialGradient id={id('fly')}>
            <stop offset='0' stopColor='#fff9c4' />
            <stop offset='0.35' stopColor='#f7e36a' stopOpacity='0.8' />
            <stop offset='1' stopColor='#f7e36a' stopOpacity='0' />
          </radialGradient>
          {ROOMS.map((room) => {
            const b = roomBox(room.col, room.row)
            return (
              <clipPath key={room.id} id={id(`clip-${room.id}`)}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} />
              </clipPath>
            )
          })}
        </defs>

        {/* Night, overdrawn past the stage so no crop shows an edge. */}
        <rect
          x={-WING - 20}
          y={-40}
          width={W + WING * 2 + 40}
          height={H + 80}
          fill={`url(#${id('sky')})`}
        />
        {STARS.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 1.8 : 1.2}
            fill='#f3eee4'
            className={styles.star}
            style={{ animationDelay: `${(i * 0.37) % 3}s` }}
          />
        ))}
        {WING_STARS.map(([x, y], i) => (
          <circle
            key={`w${i}`}
            cx={x}
            cy={y}
            r={i % 4 === 0 ? 1.8 : 1.2}
            fill='#f3eee4'
            className={styles.star}
            style={{ animationDelay: `${(i * 0.53) % 3}s` }}
          />
        ))}
        <circle cx={560} cy={62} r={20} fill='#f3eee4' opacity='0.92' />
        <circle cx={569} cy={55} r={18} fill='#232445' />

        {/* Hill and garden: expendable wings around the house. */}
        <path
          d={`M${-WING - 20} ${H + 40}V318C60 300 140 296 ${W / 2} 306S560 300 ${W + WING + 20} 312V${H + 40}Z`}
          fill='#2b2440'
        />
        {NEIGHBORS.map(([x, w, h, lit]) => (
          <g key={x}>
            <rect x={x} y={312 - h} width={w} height={h} fill='#2f2946' />
            <path
              d={`M${x - 8} ${312 - h}L${x + w / 2} ${312 - h - w * 0.4}L${x + w + 8} ${312 - h}Z`}
              fill='#28223d'
            />
            <rect
              x={x + w / 2 - 12}
              y={312 - h + 22}
              width={24}
              height={20}
              fill={lit ? '#f4c96e' : '#3b3358'}
              opacity={lit ? 0.85 : 1}
            />
          </g>
        ))}
        <path d='M86 316V252' stroke={SILHOUETTE} strokeWidth='6' />
        <circle cx={86} cy={232} r={30} fill='#2f2946' />
        <circle cx={66} cy={250} r={20} fill='#2f2946' />
        <circle cx={108} cy={248} r={22} fill='#2f2946' />
        {/* Streetlamp on the right, a second warm point to balance the house. */}
        <path
          d='M552 316V214M552 214H566'
          stroke={SILHOUETTE}
          strokeWidth='4'
        />
        <circle
          cx={568}
          cy={220}
          r={16}
          fill={`url(#${id('lamp')})`}
          opacity='0.6'
        />
        <circle cx={568} cy={220} r={4} fill='#ffe7a3' />
        {[500, 516, 532, 108, 124, 140, 156].map((x) => (
          <path key={x} d={`M${x} 318V300`} stroke='#3b3358' strokeWidth='4' />
        ))}
        <path d='M100 306H164M492 306H540' stroke='#3b3358' strokeWidth='3' />

        {/* Chimney smoke drifts even at rest — the house is lived in. */}
        <rect
          x={392}
          y={52}
          width={20}
          height={48}
          fill='#7a3b2e'
          stroke={INK}
          strokeWidth='3'
        />
        <g className={styles.smoke}>
          <circle cx={402} cy={40} r={7} fill='#8f86a8' opacity='0.5' />
          <circle cx={410} cy={26} r={9} fill='#8f86a8' opacity='0.35' />
          <circle cx={404} cy={10} r={11} fill='#8f86a8' opacity='0.2' />
        </g>

        {/* Shell: roof, attic, outer walls. */}
        <path
          d={`M${HOUSE.x - 16} ${HOUSE.eave}L${MID_X} 36L${HOUSE.x + HOUSE.w + 16} ${HOUSE.eave}Z`}
          fill='#8a4232'
          stroke={INK}
          strokeWidth='4'
        />
        <path
          d={`M${HOUSE.x + 14} ${HOUSE.eave - 4}L${MID_X} 56L${HOUSE.x + HOUSE.w - 14} ${HOUSE.eave - 4}Z`}
          fill='#3a2e45'
        />
        <circle
          cx={MID_X}
          cy={96}
          r={22}
          fill={`url(#${id('lamp')})`}
          opacity='0.35'
        />
        <rect
          x={HOUSE.x}
          y={HOUSE.eave}
          width={HOUSE.w}
          height={HOUSE.base - HOUSE.eave}
          fill='#e6d6bb'
          stroke={INK}
          strokeWidth='4'
        />

        {ROOMS.map((room) => {
          const b = roomBox(room.col, room.row)
          const lampX = lampOf(room).x
          return (
            <g key={room.id}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill={room.paper}
              />
              <g clipPath={`url(#${id(`clip-${room.id}`)})`}>
                {/* Wallpaper stripe and floorboards give each room depth. */}
                <rect
                  x={b.x}
                  y={b.y + b.h - 14}
                  width={b.w}
                  height={14}
                  fill='#6b4a3a'
                  opacity='0.55'
                />
                <circle
                  cx={lampX}
                  cy={b.y + 14}
                  r={52}
                  fill={`url(#${id('lamp')})`}
                  className={`${styles.anim} ${styles.glow} ${styles[`glow_${room.id}`]}`}
                />
                <Vignette room={room.id} x={b.x} y={b.y} w={b.w} h={b.h} />
              </g>
              {/* Pendant lamp: the one thing the firefly touches. */}
              <path
                d={`M${lampX} ${b.y}V${b.y + 10}`}
                stroke={INK}
                strokeWidth='2'
              />
              <path
                d={`M${lampX - 8} ${b.y + 17}Q${lampX} ${b.y + 6} ${lampX + 8} ${b.y + 17}Z`}
                fill={SILHOUETTE}
              />
              <circle cx={lampX} cy={b.y + 18} r={2.5} fill={room.glow} />
            </g>
          )
        })}

        {/* Floors and party wall drawn over the rooms so edges stay crisp. */}
        <path
          d={`M${HOUSE.x} ${HOUSE.floor1}H${HOUSE.x + HOUSE.w}M${HOUSE.x} ${HOUSE.floor2}H${HOUSE.x + HOUSE.w}M${MID_X} ${HOUSE.floor1}V${HOUSE.base}`}
          stroke={INK}
          strokeWidth={WALL}
          strokeLinecap='butt'
        />
        <path
          d={`M${HOUSE.x - 6} ${HOUSE.base}H${HOUSE.x + HOUSE.w + 6}`}
          stroke={INK}
          strokeWidth='6'
        />

        {/* Jev: a firefly resting in the attic, the one small bright thing. */}
        <g className={`${styles.anim} ${styles.fly}`} style={FLIGHT}>
          <g className={styles.flyBob}>
            <circle
              cx={PERCH.x}
              cy={PERCH.y}
              r={20}
              fill={`url(#${id('fly')})`}
            />
            <ellipse
              cx={PERCH.x - 5}
              cy={PERCH.y - 5}
              rx={5}
              ry={3}
              fill='#f3eee4'
              opacity='0.8'
              className={styles.wing}
            />
            <ellipse
              cx={PERCH.x + 5}
              cy={PERCH.y - 5}
              rx={5}
              ry={3}
              fill='#f3eee4'
              opacity='0.8'
              className={styles.wing}
            />
            <circle
              cx={PERCH.x}
              cy={PERCH.y}
              r={4.5}
              fill='#fff27a'
              stroke={INK}
              strokeWidth='1.5'
            />
          </g>
        </g>
      </svg>
    </div>
  )
}

function Vignette({
  room,
  x,
  y,
  w,
  h
}: {
  room: (typeof ROOMS)[number]['id']
  x: number
  y: number
  w: number
  h: number
}) {
  const floor = y + h - 14
  switch (room) {
    case 'music':
      return (
        <g>
          {/* Upright piano, side-on, with a bench. */}
          <path
            d={`M${x + 14} ${floor}V${floor - 44}Q${x + 14} ${floor - 50} ${x + 20} ${floor - 50}H${x + 62}V${floor}Z`}
            fill={SILHOUETTE}
          />
          <rect
            x={x + 58}
            y={floor - 28}
            width={14}
            height={5}
            fill={SILHOUETTE}
          />
          <rect
            x={x + 60}
            y={floor - 30}
            width={12}
            height={2}
            fill='#f3eee4'
          />
          <path
            d={`M${x + 80} ${floor}V${floor - 16}H${x + 100}V${floor}`}
            stroke={SILHOUETTE}
            strokeWidth='4'
            fill='none'
          />
          <path
            d={`M${x + 78} ${floor - 18}H${x + 102}`}
            stroke={SILHOUETTE}
            strokeWidth='5'
          />
          <g className={`${styles.anim} ${styles.notes}`}>
            <Note x={x + 24} y={floor - 56} small />
            <Note x={x + 42} y={floor - 64} />
            <Note x={x + 62} y={floor - 54} small />
          </g>
        </g>
      )
    case 'match':
      return (
        <g>
          {/* Sofa, two sitters. Heads tilt together on their visit. */}
          <path
            d={`M${x + 16} ${floor}V${floor - 24}Q${x + 16} ${floor - 34} ${x + 26} ${floor - 34}H${x + w - 26}Q${x + w - 16} ${floor - 34} ${x + w - 16} ${floor - 24}V${floor}Z`}
            fill='#7d3a58'
          />
          <rect
            x={x + 10}
            y={floor - 22}
            width={14}
            height={20}
            rx={5}
            fill='#6a2f4a'
          />
          <rect
            x={x + w - 24}
            y={floor - 22}
            width={14}
            height={20}
            rx={5}
            fill='#6a2f4a'
          />
          <g className={`${styles.anim} ${styles.leanLeft}`}>
            <path
              d={`M${x + 30} ${floor - 18}V${floor - 38}Q${x + 30} ${floor - 48} ${x + 41} ${floor - 48}Q${x + 52} ${floor - 48} ${x + 52} ${floor - 38}V${floor - 18}Z`}
              fill={SILHOUETTE}
            />
            <circle cx={x + 41} cy={floor - 56} r={9} fill={SILHOUETTE} />
          </g>
          <g className={`${styles.anim} ${styles.leanRight}`}>
            <path
              d={`M${x + 72} ${floor - 18}V${floor - 38}Q${x + 72} ${floor - 48} ${x + 83} ${floor - 48}Q${x + 94} ${floor - 48} ${x + 94} ${floor - 38}V${floor - 18}Z`}
              fill={SILHOUETTE}
            />
            <circle cx={x + 83} cy={floor - 56} r={9} fill={SILHOUETTE} />
          </g>
          <path
            className={`${styles.anim} ${styles.heart}`}
            d={`M${x + 62} ${floor - 60}c-6-6-14-1-9 5l9 8 9-8c5-6-3-11-9-5Z`}
            fill='#c2375a'
          />
        </g>
      )
    case 'inbox':
      return (
        <g>
          {/* Wall of pigeonholes; one letter in flight, one slot empty. */}
          <rect
            x={x + w - 64}
            y={y + 20}
            width={52}
            height={50}
            fill='#3d4f69'
          />
          {[0, 1, 2].map((c) =>
            [0, 1].map((r) => (
              <rect
                key={`${c}-${r}`}
                x={x + w - 60 + c * 16}
                y={y + 24 + r * 22}
                width={13}
                height={19}
                fill='#23324a'
              />
            ))
          )}
          {[
            [0, 0],
            [1, 1],
            [2, 0],
            [0, 1]
          ].map(([c, r]) => (
            <rect
              key={`l${c}${r}`}
              x={x + w - 58 + (c ?? 0) * 16}
              y={y + 34 + (r ?? 0) * 22}
              width={9}
              height={8}
              fill='#f3eee4'
            />
          ))}
          <rect
            x={x + 12}
            y={floor - 30}
            width={34}
            height={30}
            fill={SILHOUETTE}
          />
          <path
            d={`M${x + 8} ${floor - 30}H${x + 50}`}
            stroke={SILHOUETTE}
            strokeWidth='4'
          />
          <g className={`${styles.anim} ${styles.letter}`}>
            <rect
              x={x + 18}
              y={floor - 44}
              width={20}
              height={13}
              fill='#f3eee4'
              stroke={INK}
              strokeWidth='1.5'
            />
            <path
              d={`M${x + 18} ${floor - 44}l10 7 10-7`}
              stroke={INK}
              strokeWidth='1.5'
              fill='none'
            />
          </g>
        </g>
      )
    case 'trolley':
      return (
        <g>
          {/* Toy rails fork on the floor; the car takes the lower branch. */}
          <path
            d={`M${x + 8} ${floor - 4}H${x + w - 8}`}
            stroke='#4a3a30'
            strokeWidth='3'
          />
          <path
            d={`M${x + 56} ${floor - 4}Q${x + 82} ${floor - 4} ${x + 100} ${floor - 14}L${x + w - 6} ${floor - 18}`}
            stroke='#4a3a30'
            strokeWidth='3'
            fill='none'
          />
          {[18, 34, 50, 66, 82, 98, 114].map((dx) => (
            <path
              key={dx}
              d={`M${x + dx} ${floor - 7}V${floor - 1}`}
              stroke='#4a3a30'
              strokeWidth='2'
            />
          ))}
          <g className={`${styles.anim} ${styles.trolley}`}>
            <path
              d={`M${x + 30} ${floor - 36}l6-8h8`}
              stroke={SILHOUETTE}
              strokeWidth='2'
              fill='none'
            />
            <rect
              x={x + 16}
              y={floor - 34}
              width={34}
              height={24}
              rx={4}
              fill='#2f7a5b'
              stroke={SILHOUETTE}
              strokeWidth='2'
            />
            <rect
              x={x + 21}
              y={floor - 29}
              width={10}
              height={8}
              fill='#f3eee4'
            />
            <rect
              x={x + 35}
              y={floor - 29}
              width={10}
              height={8}
              fill='#f3eee4'
            />
            <circle cx={x + 24} cy={floor - 8} r={4} fill={SILHOUETTE} />
            <circle cx={x + 42} cy={floor - 8} r={4} fill={SILHOUETTE} />
          </g>
          {/* Wall-hung pennant so the room reads as a kid's room. */}
          <path d={`M${x + 78} ${y + 10}h34l-7 7 7 7h-34Z`} fill='#e0b64e' />
        </g>
      )
  }
}

function Note({ x, y, small }: { x: number; y: number; small?: boolean }) {
  const s = small ? 0.8 : 1
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill='#3d2a12'>
      <ellipse cx={0} cy={0} rx={5} ry={3.6} transform='rotate(-20)' />
      <path d='M4 -1V-17L10 -13' stroke='#3d2a12' strokeWidth='2' fill='none' />
    </g>
  )
}
