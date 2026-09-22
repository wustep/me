import { useId } from 'react'

import styles from './JevCoverP.module.css'

/**
 * JevCoverP — the magic lantern. Unshipped variant, kept for the
 * covers-preview workbench.
 *
 *   A dark parlor. On the table, a brass magic lantern holds one small
 *   glass slide — Jev's whole contribution. The lantern throws it onto a
 *   hanging sheet as a big silhouette show, and a row of heads in the
 *   foreground watches. Hover swaps slides from the rack (music, inbox,
 *   match, trolley) and each one becomes a moving picture: a pianist's
 *   notes rise, letters flock home to a post box, two figures on a bench
 *   shuffle closer, a tram rolls under its wire.
 *
 *   640×360, sliced to the 16:9 cover box; the room runs past the edges.
 */

const W = 640
const H = 360
// Wings: the cover box is pinned ~190px tall while cards run ~300–900px
// wide, so the full 360 height always shows and wider cards reveal up to
// WING more units each side. The 640 middle is the designed frame (exactly
// what a 16:9 card shows); the wings only hold expendable scenery.
const WING = 540

const INK = '#1a1620'

// Projection disc on the sheet; every picture is drawn inside it.
const DISC = { x: 432, y: 160, r: 118 }
// Lens mouth, where the cone of light starts.
const LENS = { x: 170, y: 198 }

// Room palette: slide glass color + the picture's paper and silhouette.
const SLIDES = [
  { id: 'music', glass: '#e2a93a', paper: '#f8dc97', ink: '#5a3a10' },
  { id: 'inbox', glass: '#5d8fb8', paper: '#cfe2f0', ink: '#1f3a57' },
  { id: 'match', glass: '#c9637f', paper: '#f5ccd6', ink: '#5e1f36' },
  { id: 'trolley', glass: '#4e9a6a', paper: '#cfe8c9', ink: '#1d4a30' }
] as const

type SlideId = (typeof SLIDES)[number]['id']

export function JevCoverP() {
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
          <linearGradient id={id('beam')} x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0' stopColor='#fff1c9' stopOpacity='0.55' />
            <stop offset='1' stopColor='#fff1c9' stopOpacity='0.08' />
          </linearGradient>
          <radialGradient id={id('vignette')}>
            <stop offset='0.72' stopColor='#000' stopOpacity='0' />
            <stop offset='1' stopColor='#000' stopOpacity='0.28' />
          </radialGradient>
          <radialGradient id={id('flame')}>
            <stop offset='0' stopColor='#ffe9a8' stopOpacity='0.9' />
            <stop offset='1' stopColor='#ffe9a8' stopOpacity='0' />
          </radialGradient>
          <clipPath id={id('disc')}>
            <circle cx={DISC.x} cy={DISC.y} r={DISC.r} />
          </clipPath>
        </defs>

        {/* Parlor: dark wallpaper, a wainscot rail, floorboards. */}
        <rect
          x={-WING - 20}
          y={-40}
          width={W + WING * 2 + 40}
          height={H + 80}
          fill='#2a2230'
        />
        {Array.from({ length: 36 }, (_, i) => (
          <path
            key={i}
            d={`M${-40 - WING + i * 52} -40V250`}
            stroke='#2f2736'
            strokeWidth='18'
          />
        ))}
        <rect
          x={-WING - 20}
          y={250}
          width={W + WING * 2 + 40}
          height={150}
          fill='#3a2a26'
        />
        <path
          d={`M${-WING - 20} 250H${W + WING + 20}`}
          stroke='#4c3830'
          strokeWidth='6'
        />

        {/* The sheet, pinned to a rail; the disc is projected onto it. */}
        <path d='M296 18H572' stroke='#15111a' strokeWidth='6' />
        <path
          d='M304 20H564V300Q540 294 520 300T476 300T432 300T388 300T344 300T304 300Z'
          fill='#e9e1d2'
        />
        <path
          d='M304 20V300M564 20V300'
          stroke='#cfc4b2'
          strokeWidth='2'
          opacity='0.7'
        />

        {/* Beam, from the lens to the disc's top and bottom tangents. */}
        <path
          className={`${styles.anim} ${styles.beam}`}
          d={`M${LENS.x} ${LENS.y - 8}L${DISC.x - 10} ${DISC.y - DISC.r}L${DISC.x - 10} ${DISC.y + DISC.r}L${LENS.x} ${LENS.y + 8}Z`}
          fill={`url(#${id('beam')})`}
        />

        {/* Each picture gets its own static clipped wrapper; the animated
            group sits inside it. Animating opacity on a child of one shared
            clip made Chrome composite the clip's bounding box as a solid
            rect. */}
        {SLIDES.map((slide) => (
          <g key={slide.id} clipPath={`url(#${id('disc')})`}>
            <g
              className={`${styles.anim} ${styles.show} ${styles[`show_${slide.id}`]}`}
            >
              <circle cx={DISC.x} cy={DISC.y} r={DISC.r} fill={slide.paper} />
              <Picture id={slide.id} ink={slide.ink} />
            </g>
          </g>
        ))}
        <circle
          cx={DISC.x}
          cy={DISC.y}
          r={DISC.r}
          fill={`url(#${id('vignette')})`}
        />
        {/* A brief dark blink between slides, like the real swap. */}
        <circle
          cx={DISC.x}
          cy={DISC.y}
          r={DISC.r}
          fill='#2a2230'
          className={`${styles.anim} ${styles.blink}`}
        />

        {/* Table, slide rack, lantern. */}
        <path d='M28 236H196' stroke='#5b3b2a' strokeWidth='10' />
        <path d='M44 240V330M180 240V330' stroke='#4a2f22' strokeWidth='8' />
        <Rack />
        <Lantern id={id} />

        {/* Audience: heads and shoulders along the bottom, facing the show. */}
        <g fill='#130f17'>
          {[
            [356, 330, 1],
            [430, 318, 1.15],
            [512, 332, 0.95],
            [590, 322, 1.05],
            [280, 338, 0.9],
            // Wing rows: the rest of the audience, for wide cards.
            [200, 330, 1],
            [120, 340, 0.95],
            [40, 326, 1.1],
            [-40, 336, 0.95],
            [-120, 324, 1.05],
            [-200, 338, 0.9],
            [-280, 328, 1],
            [-360, 334, 1.05],
            [-440, 326, 0.95],
            [-520, 336, 1],
            [670, 336, 0.95],
            [750, 326, 1.05],
            [830, 338, 0.9],
            [910, 328, 1],
            [990, 334, 1.1],
            [1070, 326, 0.95],
            [1150, 336, 1]
          ].map(([x, y, s]) => (
            <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
              <circle cx={0} cy={-26} r={17} />
              <path d='M-34 40V14Q-34-6 0-6T34 14V40Z' />
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

function Rack() {
  // Four spare slides stand in a little wooden rack; the one in the lantern
  // leaves a gap that moves as the show changes.
  return (
    <g>
      <rect x={42} y={214} width={62} height={22} rx={2} fill='#6b4632' />
      {SLIDES.map((slide, i) => (
        <g key={slide.id}>
          <rect
            x={48 + i * 14}
            y={196}
            width={9}
            height={30}
            rx={1.5}
            fill='#e7e0d2'
            className={`${styles.anim} ${styles.rackSlot} ${styles[`rack_${slide.id}`]}`}
          />
          <rect
            x={49.5 + i * 14}
            y={200}
            width={6}
            height={14}
            fill={slide.glass}
            className={`${styles.anim} ${styles.rackSlot} ${styles[`rack_${slide.id}`]}`}
          />
        </g>
      ))}
    </g>
  )
}

function Lantern({ id }: { id: (name: string) => string }) {
  return (
    <g>
      {/* Chimney glow: the lantern's own lamp, always warm. */}
      <circle
        cx={138}
        cy={140}
        r={20}
        fill={`url(#${id('flame')})`}
        className={styles.flicker}
      />
      <path
        d='M130 176V150H146V176'
        fill='#8a6320'
        stroke={INK}
        strokeWidth='3'
      />
      <path
        d='M124 150H152L146 142H130Z'
        fill='#b5842a'
        stroke={INK}
        strokeWidth='3'
      />
      {/* Body */}
      <rect
        x={112}
        y={174}
        width={52}
        height={50}
        rx={6}
        fill='#c4901a'
        stroke={INK}
        strokeWidth='3'
      />
      <circle
        cx={128}
        cy={199}
        r={7}
        fill='#ffd477'
        stroke={INK}
        strokeWidth='2'
      />
      <path
        d='M116 224H160V232H116Z'
        fill='#8a6320'
        stroke={INK}
        strokeWidth='3'
      />
      {/* Slide slot, with the chosen slide standing in it. */}
      <rect x={150} y={176} width={12} height={46} fill='#2a1f18' />
      {SLIDES.map((slide) => (
        <g
          key={slide.id}
          className={`${styles.anim} ${styles.inSlot} ${styles[`slot_${slide.id}`]}`}
        >
          <rect
            x={148}
            y={170}
            width={16}
            height={38}
            rx={1.5}
            fill='#e7e0d2'
            stroke={INK}
            strokeWidth='2'
          />
          <rect x={151} y={176} width={10} height={20} fill={slide.glass} />
        </g>
      ))}
      {/* Lens barrel */}
      <path
        d={`M162 188H${LENS.x + 4}V208H162Z`}
        fill='#3a2c20'
        stroke={INK}
        strokeWidth='3'
      />
      <ellipse cx={LENS.x + 4} cy={LENS.y} rx={3} ry={11} fill='#fff1c9' />
    </g>
  )
}

function Picture({ id, ink }: { id: SlideId; ink: string }) {
  const ground = DISC.y + 58
  switch (id) {
    case 'music':
      return (
        <g fill={ink} color={ink}>
          <rect x={DISC.x - 130} y={ground} width={260} height={80} />
          {/* Grand piano, lid up, pianist on the bench. */}
          <path
            d={`M${DISC.x - 36} ${ground - 44}H${DISC.x + 60}Q${DISC.x + 92} ${ground - 44} ${DISC.x + 84} ${ground - 26}L${DISC.x + 70} ${ground - 22}H${DISC.x - 36}Z`}
          />
          <path
            d={`M${DISC.x - 30} ${ground - 44}L${DISC.x + 44} ${ground - 92}L${DISC.x + 50} ${ground - 44}Z`}
          />
          <path
            d={`M${DISC.x - 30} ${ground - 22}V${ground}M${DISC.x + 64} ${ground - 22}V${ground}`}
            stroke={ink}
            strokeWidth='6'
          />
          <rect x={DISC.x - 78} y={ground - 22} width={30} height={6} />
          <path
            d={`M${DISC.x - 74} ${ground - 16}V${ground}M${DISC.x - 52} ${ground - 16}V${ground}`}
            stroke={ink}
            strokeWidth='4'
          />
          <circle cx={DISC.x - 62} cy={ground - 66} r={9} />
          <path
            d={`M${DISC.x - 72} ${ground - 22}Q${DISC.x - 76} ${ground - 54} ${DISC.x - 62} ${ground - 56}Q${DISC.x - 50} ${ground - 54} ${DISC.x - 50} ${ground - 40}L${DISC.x - 34} ${ground - 36}L${DISC.x - 36} ${ground - 30}L${DISC.x - 54} ${ground - 30}V${ground - 22}Z`}
          />
          <g className={`${styles.anim} ${styles.notesUp}`}>
            <BigNote x={DISC.x - 12} y={ground - 104} />
            <BigNote x={DISC.x + 30} y={ground - 132} small />
            <BigNote x={DISC.x + 70} y={ground - 112} />
          </g>
        </g>
      )
    case 'inbox':
      return (
        <g fill={ink} color={ink}>
          <rect x={DISC.x - 130} y={ground} width={260} height={80} />
          {/* Pillar post box; letters flock to its slot like birds. */}
          <path
            d={`M${DISC.x + 36} ${ground}V${ground - 70}Q${DISC.x + 36} ${ground - 96} ${DISC.x + 60} ${ground - 96}Q${DISC.x + 84} ${ground - 96} ${DISC.x + 84} ${ground - 70}V${ground}Z`}
          />
          <rect x={DISC.x + 30} y={ground - 100} width={60} height={8} rx={3} />
          <rect
            x={DISC.x + 46}
            y={ground - 72}
            width={28}
            height={4}
            fill='#cfe2f0'
          />
          <g className={`${styles.anim} ${styles.flock}`}>
            {[
              [-86, -70, 1],
              [-60, -98, 0.8],
              [-40, -58, 0.9],
              [-100, -118, 0.7],
              [-16, -88, 0.75]
            ].map(([dx, dy, s]) => (
              <g
                key={`${dx}`}
                transform={`translate(${DISC.x + (dx ?? 0)} ${ground + (dy ?? 0)}) scale(${s})`}
              >
                <rect x={-12} y={-8} width={24} height={16} rx={1.5} />
                <path
                  d='M-12 -8L0 1L12 -8'
                  stroke='#cfe2f0'
                  strokeWidth='2'
                  fill='none'
                />
              </g>
            ))}
          </g>
        </g>
      )
    case 'match':
      return (
        <g fill={ink} color={ink}>
          <rect x={DISC.x - 130} y={ground} width={260} height={80} />
          {/* Park bench under a street lamp and a big moon. */}
          <circle
            cx={DISC.x + 58}
            cy={DISC.y - 58}
            r={24}
            fill='#fff4f6'
            opacity='0.8'
          />
          <path
            d={`M${DISC.x + 70} ${ground}V${ground - 110}`}
            stroke={ink}
            strokeWidth='5'
          />
          <path
            d={`M${DISC.x + 58} ${ground - 110}H${DISC.x + 82}L${DISC.x + 76} ${ground - 122}H${DISC.x + 64}Z`}
          />
          <rect x={DISC.x - 60} y={ground - 26} width={100} height={6} />
          <rect x={DISC.x - 60} y={ground - 46} width={100} height={5} />
          <path
            d={`M${DISC.x - 52} ${ground - 20}V${ground}M${DISC.x + 32} ${ground - 20}V${ground}`}
            stroke={ink}
            strokeWidth='5'
          />
          <g className={`${styles.anim} ${styles.scootL}`}>
            <circle cx={DISC.x - 32} cy={ground - 62} r={10} />
            <path
              d={`M${DISC.x - 44} ${ground - 26}V${ground - 42}Q${DISC.x - 44} ${ground - 52} ${DISC.x - 32} ${ground - 52}Q${DISC.x - 20} ${ground - 52} ${DISC.x - 20} ${ground - 42}V${ground - 26}Z`}
            />
          </g>
          <g className={`${styles.anim} ${styles.scootR}`}>
            <circle cx={DISC.x + 14} cy={ground - 60} r={9} />
            <path
              d={`M${DISC.x + 3} ${ground - 26}V${ground - 40}Q${DISC.x + 3} ${ground - 50} ${DISC.x + 14} ${ground - 50}Q${DISC.x + 25} ${ground - 50} ${DISC.x + 25} ${ground - 40}V${ground - 26}Z`}
            />
          </g>
        </g>
      )
    case 'trolley':
      return (
        <g fill={ink} color={ink}>
          <rect x={DISC.x - 130} y={ground} width={260} height={80} />
          {/* Overhead wire on poles; the tram rolls under it. */}
          <path
            d={`M${DISC.x - 130} ${ground - 96}H${DISC.x + 130}`}
            stroke={ink}
            strokeWidth='2'
          />
          {[-80, 20, 110].map((dx) => (
            <path
              key={dx}
              d={`M${DISC.x + dx} ${ground}V${ground - 104}H${DISC.x + dx - 14}`}
              stroke={ink}
              strokeWidth='4'
              fill='none'
            />
          ))}
          <g className={`${styles.anim} ${styles.tram}`}>
            <path
              d={`M${DISC.x - 20} ${ground - 60}L${DISC.x - 4} ${ground - 96}`}
              stroke={ink}
              strokeWidth='3'
            />
            <rect
              x={DISC.x - 56}
              y={ground - 62}
              width={90}
              height={52}
              rx={10}
            />
            {[0, 1, 2, 3].map((i) => (
              <rect
                key={i}
                x={DISC.x - 48 + i * 20}
                y={ground - 54}
                width={14}
                height={16}
                rx={2}
                fill='#cfe8c9'
              />
            ))}
            <circle cx={DISC.x - 34} cy={ground - 6} r={7} />
            <circle cx={DISC.x + 12} cy={ground - 6} r={7} />
          </g>
          <path
            d={`M${DISC.x - 130} ${ground + 3}H${DISC.x + 130}`}
            stroke='#cfe8c9'
            strokeWidth='2'
            strokeDasharray='6 10'
          />
        </g>
      )
  }
}

function BigNote({ x, y, small }: { x: number; y: number; small?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${small ? 0.8 : 1.1})`}>
      <ellipse cx={0} cy={0} rx={8} ry={5.5} transform='rotate(-20)' />
      <path
        d='M7 -2V-28Q14 -22 18 -14'
        strokeWidth='3'
        stroke='currentColor'
        fill='none'
      />
    </g>
  )
}
