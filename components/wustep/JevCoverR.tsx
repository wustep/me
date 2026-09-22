import { useId } from 'react'

import styles from './JevCoverR.module.css'

/**
 * JevCoverR — the marionettes. Unshipped variant, kept for the
 * covers-preview workbench.
 *
 *   A little red puppet theater. One gold control cross — Jev — hangs
 *   above the stage, and every string fans down from it to four puppets:
 *   a violinist, a postman, a sweetheart with a heart balloon, and a
 *   conductor wearing a toy tram round the waist. The cross only tilts;
 *   the puppet at the end of that string does the performing. Hover tilts
 *   it toward each puppet in turn: a phrase of notes, a letter tossed, the
 *   balloon let up, a trot across the boards.
 *
 *   640×360, sliced to the 16:9 cover box; the wall runs past the edges.
 */

const W = 640
const H = 360
// Wings: the cover box is pinned ~190px tall while cards run ~300–900px
// wide, so the full 360 height always shows and wider cards reveal up to
// WING more units each side. The 640 middle is the designed frame (exactly
// what a 16:9 card shows); the wings only hold expendable scenery.
const WING = 540

const INK = '#2a1a1e'

// Stage opening and floor.
const STAGE = { x: 118, y: 72, w: 404, floor: 284 }
// Control cross: every string's top end sits at its center.
const CROSS = { x: 320, y: 30 }

// Puppets stand every 92 units across the stage (x is the feet center).
const PUPPETS = [
  { id: 'violin', x: 182, coat: '#d59a2a', trim: '#8a5a12' },
  { id: 'post', x: 274, coat: '#3d6a94', trim: '#223f5c' },
  { id: 'sweet', x: 366, coat: '#d0647f', trim: '#8a2f4a' },
  { id: 'tram', x: 458, coat: '#3f8a5c', trim: '#1f5236' }
] as const

type PuppetId = (typeof PUPPETS)[number]['id']

// Puppet proportions, from the floor up.
const HEAD_Y = STAGE.floor - 96
const SHOULDER_Y = STAGE.floor - 80
const HIP_Y = STAGE.floor - 40

export function JevCoverR() {
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
          <linearGradient id={id('backdrop')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#f6e7c8' />
            <stop offset='1' stopColor='#ecd3a4' />
          </linearGradient>
          <radialGradient id={id('spot')} cx='0.5' cy='0.25' r='0.7'>
            <stop offset='0' stopColor='#fff8e6' stopOpacity='0.7' />
            <stop offset='1' stopColor='#fff8e6' stopOpacity='0' />
          </radialGradient>
        </defs>

        {/* Wall behind the theater. */}
        <rect
          x={-WING - 20}
          y={-40}
          width={W + WING * 2 + 40}
          height={H + 80}
          fill='#3c2229'
        />
        {Array.from({ length: 38 }, (_, i) => (
          <circle
            key={i}
            cx={-WING - 20 + (i % 19) * 96 + (i >= 19 ? 48 : 0)}
            cy={i >= 19 ? 250 : 120}
            r={3}
            fill='#51303a'
          />
        ))}
        {/* Wall sconces in the wings, for wide cards. */}
        {[-380, -130, 770, 1020].map((x) => (
          <g key={x}>
            <circle cx={x} cy={150} r={40} fill='#ffd98a' opacity='0.12' />
            <path
              d={`M${x - 12} 176H${x + 12}L${x + 6} 190H${x - 6}Z`}
              fill='#c4901a'
            />
            <path d={`M${x - 10} 170Q${x} 132 ${x + 10} 170Z`} fill='#ffe3a3' />
          </g>
        ))}

        {/* Stage: painted backdrop with rolling hills, spot of light. */}
        <rect
          x={STAGE.x}
          y={STAGE.y}
          width={STAGE.w}
          height={STAGE.floor - STAGE.y}
          fill={`url(#${id('backdrop')})`}
        />
        <path
          d={`M${STAGE.x} 236Q200 206 280 226T440 218T${STAGE.x + STAGE.w} 222V${STAGE.floor}H${STAGE.x}Z`}
          fill='#d9c08e'
        />
        <circle cx={462} cy={118} r={16} fill='#f2cf7a' />
        <rect
          x={STAGE.x}
          y={STAGE.y}
          width={STAGE.w}
          height={STAGE.floor - STAGE.y}
          fill={`url(#${id('spot')})`}
        />
        <rect
          x={STAGE.x - 10}
          y={STAGE.floor}
          width={STAGE.w + 20}
          height={12}
          fill='#8a5a36'
        />
        <rect
          x={STAGE.x - 24}
          y={STAGE.floor + 12}
          width={STAGE.w + 48}
          height={60}
          fill='#6e4428'
        />
        <path
          d={`M${STAGE.x - 24} ${STAGE.floor + 12}H${STAGE.x + STAGE.w + 24}`}
          stroke='#c4901a'
          strokeWidth='3'
        />
        {/* Footlights along the apron. */}
        {Array.from({ length: 9 }, (_, i) => {
          const fx = STAGE.x + 22 + i * ((STAGE.w - 44) / 8)
          return (
            <g key={i}>
              <circle
                cx={fx}
                cy={STAGE.floor + 30}
                r={10}
                fill='#ffd98a'
                opacity='0.25'
              />
              <path
                d={`M${fx - 7} ${STAGE.floor + 34}A7 7 0 0 1 ${fx + 7} ${STAGE.floor + 34}Z`}
                fill='#ffe3a3'
              />
              <path
                d={`M${fx - 9} ${STAGE.floor + 34}H${fx + 9}`}
                stroke={INK}
                strokeWidth='3'
              />
            </g>
          )
        })}

        {/* Strings, then puppets. Each puppet group carries its own strings
            so a lifted puppet's strings shorten with it; their top ends
            hide behind the cross. */}
        {PUPPETS.map((p) => (
          <g
            key={p.id}
            className={`${styles.anim} ${styles.lift} ${styles[`lift_${p.id}`]}`}
          >
            <path
              d={`M${CROSS.x} ${CROSS.y}L${p.x} ${HEAD_Y - 12}M${CROSS.x - 26} ${CROSS.y}L${p.x - 18} ${SHOULDER_Y + 18}M${CROSS.x + 26} ${CROSS.y}L${p.x + 18} ${SHOULDER_Y + 18}`}
              stroke='#7a5a3a'
              strokeWidth='1.2'
              opacity='0.6'
            />
            <Puppet id={p.id} x={p.x} coat={p.coat} trim={p.trim} />
          </g>
        ))}

        {/* Proscenium: curtains, scalloped valance, gold frame. */}
        <path
          d={`M${STAGE.x - 30} 40H${STAGE.x + 44}Q${STAGE.x + 20} 160 ${STAGE.x + 34} ${STAGE.floor}H${STAGE.x - 30}Z`}
          fill='#a32a2e'
        />
        <path
          d={`M${STAGE.x + STAGE.w + 30} 40H${STAGE.x + STAGE.w - 44}Q${STAGE.x + STAGE.w - 20} 160 ${STAGE.x + STAGE.w - 34} ${STAGE.floor}H${STAGE.x + STAGE.w + 30}Z`}
          fill='#a32a2e'
        />
        <path
          d={`M${STAGE.x - 4} 60Q${STAGE.x + 6} 150 ${STAGE.x + 18} ${STAGE.floor}M${STAGE.x + STAGE.w + 4} 60Q${STAGE.x + STAGE.w - 6} 150 ${STAGE.x + STAGE.w - 18} ${STAGE.floor}`}
          stroke='#7e1d22'
          strokeWidth='5'
          fill='none'
        />
        <path
          d={`M${STAGE.x - 34} 50H${STAGE.x + STAGE.w + 34}V76${Array.from(
            { length: 9 },
            (_, i) => {
              const step = (STAGE.w + 68) / 9
              const x1 = STAGE.x + STAGE.w + 34 - step * (i + 1)
              return `Q${x1 + step / 2} 98 ${x1} 76`
            }
          ).join('')}Z`}
          fill='#b8323a'
        />
        <path
          d={`M${STAGE.x - 34} 50H${STAGE.x + STAGE.w + 34}`}
          stroke='#c4901a'
          strokeWidth='6'
        />
        <path
          d={`M${STAGE.x - 40} ${STAGE.floor + 12}V44H${STAGE.x + STAGE.w + 40}V${STAGE.floor + 12}`}
          stroke='#c4901a'
          strokeWidth='8'
          fill='none'
        />

        {/* Jev: the control cross. It tilts; it never dances. */}
        <g className={`${styles.anim} ${styles.cross}`}>
          <path
            d={`M${CROSS.x - 40} ${CROSS.y}H${CROSS.x + 40}M${CROSS.x} ${CROSS.y - 22}V${CROSS.y + 18}`}
            stroke={INK}
            strokeWidth='11'
          />
          <path
            d={`M${CROSS.x - 40} ${CROSS.y}H${CROSS.x + 40}M${CROSS.x} ${CROSS.y - 22}V${CROSS.y + 18}`}
            stroke='#e0ae3e'
            strokeWidth='6'
          />
          <path
            d={`M${CROSS.x} ${CROSS.y - 22}V-40`}
            stroke='#f6e7c8'
            strokeWidth='1'
            opacity='0.6'
          />
        </g>
      </svg>
    </div>
  )
}

function Puppet({
  id,
  x,
  coat,
  trim
}: {
  id: PuppetId
  x: number
  coat: string
  trim: string
}) {
  const foot = STAGE.floor - 2
  return (
    <g>
      {/* Legs dangle a little — they're wooden, not standing. */}
      <path
        d={`M${x - 7} ${HIP_Y}L${x - 9} ${foot}M${x + 7} ${HIP_Y}L${x + 9} ${foot}`}
        stroke={INK}
        strokeWidth='5'
      />
      <path
        d={`M${x - 13} ${foot}H${x - 5}M${x + 5} ${foot}H${x + 13}`}
        stroke={INK}
        strokeWidth='5'
      />
      {id !== 'tram' && (
        <path
          d={`M${x - 14} ${SHOULDER_Y}H${x + 14}L${x + 17} ${HIP_Y + 4}H${x - 17}Z`}
          fill={coat}
          stroke={INK}
          strokeWidth='2.5'
        />
      )}
      <circle
        cx={x}
        cy={HEAD_Y}
        r={12}
        fill='#f1cfa8'
        stroke={INK}
        strokeWidth='2.5'
      />
      <circle cx={x - 4} cy={HEAD_Y - 1} r={1.6} fill={INK} />
      <circle cx={x + 4} cy={HEAD_Y - 1} r={1.6} fill={INK} />
      <circle cx={x - 7} cy={HEAD_Y + 4} r={2.4} fill='#e79a8a' opacity='0.7' />
      <circle cx={x + 7} cy={HEAD_Y + 4} r={2.4} fill='#e79a8a' opacity='0.7' />
      <Costume id={id} x={x} coat={coat} trim={trim} />
    </g>
  )
}

function Costume({
  id,
  x,
  coat,
  trim
}: {
  id: PuppetId
  x: number
  coat: string
  trim: string
}) {
  switch (id) {
    case 'violin':
      return (
        <g>
          <path
            d={`M${x - 12} ${HEAD_Y - 8}Q${x} ${HEAD_Y - 22} ${x + 12} ${HEAD_Y - 8}`}
            fill={trim}
          />
          {/* Violin under the chin, bow arm working. */}
          <path
            d={`M${x - 14} ${SHOULDER_Y + 4}L${x - 20} ${SHOULDER_Y + 18}`}
            stroke={INK}
            strokeWidth='4'
          />
          <ellipse
            cx={x + 12}
            cy={SHOULDER_Y + 6}
            rx={11}
            ry={6}
            transform={`rotate(-24 ${x + 12} ${SHOULDER_Y + 6})`}
            fill='#8a4a1a'
            stroke={INK}
            strokeWidth='2'
          />
          <g
            className={`${styles.anim} ${styles.bow}`}
            style={{ transformOrigin: `${x - 20}px ${SHOULDER_Y + 18}px` }}
          >
            <path
              d={`M${x - 26} ${SHOULDER_Y + 24}L${x + 30} ${SHOULDER_Y - 6}`}
              stroke={INK}
              strokeWidth='2'
            />
          </g>
          <g className={`${styles.anim} ${styles.notes}`} fill={trim}>
            <ellipse
              cx={x + 30}
              cy={HEAD_Y - 18}
              rx={4.5}
              ry={3.2}
              transform={`rotate(-20 ${x + 30} ${HEAD_Y - 18})`}
            />
            <path
              d={`M${x + 34} ${HEAD_Y - 19}V${HEAD_Y - 32}`}
              stroke={trim}
              strokeWidth='2'
            />
            <ellipse
              cx={x + 44}
              cy={HEAD_Y - 32}
              rx={4.5}
              ry={3.2}
              transform={`rotate(-20 ${x + 44} ${HEAD_Y - 32})`}
            />
            <path
              d={`M${x + 48} ${HEAD_Y - 33}V${HEAD_Y - 46}`}
              stroke={trim}
              strokeWidth='2'
            />
          </g>
        </g>
      )
    case 'post':
      return (
        <g>
          {/* Peaked cap, satchel, and a letter ready to toss. */}
          <path
            d={`M${x - 12} ${HEAD_Y - 6}H${x + 12}V${HEAD_Y - 14}H${x - 12}Z`}
            fill={trim}
            stroke={INK}
            strokeWidth='2'
          />
          <path
            d={`M${x - 14} ${HEAD_Y - 6}H${x + 4}`}
            stroke={INK}
            strokeWidth='3'
          />
          <path
            d={`M${x - 12} ${SHOULDER_Y}L${x + 12} ${HIP_Y - 8}`}
            stroke='#6b4a2a'
            strokeWidth='3'
          />
          <rect
            x={x + 6}
            y={HIP_Y - 14}
            width={16}
            height={14}
            rx={2}
            fill='#8a5a2b'
            stroke={INK}
            strokeWidth='2'
          />
          <path
            d={`M${x - 14} ${SHOULDER_Y + 4}L${x - 20} ${SHOULDER_Y + 18}`}
            stroke={INK}
            strokeWidth='4'
          />
          <g
            className={`${styles.anim} ${styles.toss}`}
            style={{ transformOrigin: `${x + 14}px ${SHOULDER_Y + 4}px` }}
          >
            <path
              d={`M${x + 14} ${SHOULDER_Y + 4}L${x + 20} ${SHOULDER_Y + 18}`}
              stroke={INK}
              strokeWidth='4'
            />
          </g>
          <g className={`${styles.anim} ${styles.letter}`}>
            <rect
              x={x + 16}
              y={SHOULDER_Y + 14}
              width={16}
              height={11}
              rx={1}
              fill='#fbf6ea'
              stroke={INK}
              strokeWidth='1.8'
            />
            <path
              d={`M${x + 16} ${SHOULDER_Y + 14}l8 6 8-6`}
              stroke={INK}
              strokeWidth='1.5'
              fill='none'
            />
          </g>
        </g>
      )
    case 'sweet':
      return (
        <g>
          {/* Bob of hair, skirt flare, and a heart balloon on a string. */}
          <path
            d={`M${x - 13} ${HEAD_Y + 4}Q${x - 16} ${HEAD_Y - 16} ${x} ${HEAD_Y - 14}Q${x + 16} ${HEAD_Y - 16} ${x + 13} ${HEAD_Y + 4}Q${x + 10} ${HEAD_Y - 6} ${x} ${HEAD_Y - 8}Q${x - 10} ${HEAD_Y - 6} ${x - 13} ${HEAD_Y + 4}Z`}
            fill='#5a2a1e'
          />
          <path
            d={`M${x - 17} ${HIP_Y + 4}L${x - 22} ${HIP_Y + 16}H${x + 22}L${x + 17} ${HIP_Y + 4}Z`}
            fill={coat}
            stroke={INK}
            strokeWidth='2.5'
          />
          <path
            d={`M${x - 14} ${SHOULDER_Y + 4}L${x - 20} ${SHOULDER_Y + 18}`}
            stroke={INK}
            strokeWidth='4'
          />
          <path
            d={`M${x + 14} ${SHOULDER_Y + 4}L${x + 22} ${SHOULDER_Y - 6}`}
            stroke={INK}
            strokeWidth='4'
          />
          <g className={`${styles.anim} ${styles.balloon}`}>
            <path
              d={`M${x + 22} ${SHOULDER_Y - 6}Q${x + 30} ${HEAD_Y - 20} ${x + 26} ${HEAD_Y - 32}`}
              stroke={INK}
              strokeWidth='1.2'
              fill='none'
            />
            <path
              d={`M${x + 26} ${HEAD_Y - 32}c-10-10-24-2-15 9l15 13 15-13c9-11-5-19-15-9Z`}
              fill='#e0435e'
              stroke={INK}
              strokeWidth='2'
            />
          </g>
        </g>
      )
    case 'tram':
      return (
        <g>
          {/* Conductor's cap; a hobby-horse tram hung from the shoulders. */}
          <path
            d={`M${x - 11} ${HEAD_Y - 7}H${x + 11}L${x + 9} ${HEAD_Y - 15}H${x - 9}Z`}
            fill={trim}
            stroke={INK}
            strokeWidth='2'
          />
          <path
            d={`M${x - 10} ${SHOULDER_Y}H${x + 10}V${HIP_Y - 10}H${x - 10}Z`}
            fill={coat}
            stroke={INK}
            strokeWidth='2.5'
          />
          <path
            d={`M${x - 10} ${SHOULDER_Y + 2}L${x - 16} ${HIP_Y - 12}M${x + 10} ${SHOULDER_Y + 2}L${x + 16} ${HIP_Y - 12}`}
            stroke={INK}
            strokeWidth='2'
          />
          <path
            d={`M${x + 2} ${HIP_Y - 16}L${x + 12} ${HEAD_Y - 24}`}
            stroke={INK}
            strokeWidth='2'
          />
          <rect
            x={x - 30}
            y={HIP_Y - 16}
            width={60}
            height={30}
            rx={7}
            fill={coat}
            stroke={INK}
            strokeWidth='2.5'
          />
          {[0, 1, 2].map((k) => (
            <rect
              key={k}
              x={x - 24 + k * 17}
              y={HIP_Y - 11}
              width={12}
              height={10}
              rx={2}
              fill='#fbf6ea'
              stroke={INK}
              strokeWidth='1.5'
            />
          ))}
          <circle cx={x - 18} cy={HIP_Y + 16} r={5} fill={INK} />
          <circle cx={x + 18} cy={HIP_Y + 16} r={5} fill={INK} />
        </g>
      )
  }
}
