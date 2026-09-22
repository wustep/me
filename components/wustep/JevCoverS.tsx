import { useId } from 'react'

import styles from './JevCoverS.module.css'

/**
 * JevCoverS — the pop-up book. Unshipped variant, kept for the
 * covers-preview workbench.
 *
 *   An open pop-up book on a desk. Four ribbon tabs stick out of its fore
 *   edge — music, inbox, match, trolley — and Jev is just the tab that's
 *   pulled. The book does everything else: a page turns and a paper world
 *   folds up out of the gutter. At rest the concert shell stands open;
 *   hover pulls each tab in turn and the post office, the couple under
 *   their tree, and the tram on its hill take their turns standing up.
 *
 *   640×360, sliced to the 16:9 cover box; the desk runs past the edges.
 */

const W = 640
const H = 360
// Wings: the cover box is pinned ~190px tall while cards run ~300–900px
// wide, so the full 360 height always shows and wider cards reveal up to
// WING more units each side. The 640 middle is the designed frame (exactly
// what a 16:9 card shows); the wings only hold expendable scenery.
const WING = 540

const INK = '#2b2530'
const PAPER = '#fbf5e8'

// The spread: a shallow trapezoid (a book seen from a little above).
const GUTTER = 320
const BOOK = { top: 226, bottom: 300, topHalf: 190, bottomHalf: 212 }
// Pop-ups hinge on this line across the gutter.
const BASE = 262

const PAGES = [
  { id: 'music', tab: '#e2a93a', light: '#f5cf74', dark: '#5a3a10' },
  { id: 'inbox', tab: '#4f86b8', light: '#a9c9e4', dark: '#1f3a57' },
  { id: 'match', tab: '#d0647f', light: '#f2b3c3', dark: '#5e1f36' },
  { id: 'trolley', tab: '#4e9a6a', light: '#a9d6a8', dark: '#1d4a30' }
] as const

type PageId = (typeof PAGES)[number]['id']

const leftPage = `M${GUTTER} ${BOOK.top + 6}Q${GUTTER - 90} ${BOOK.top - 10} ${GUTTER - BOOK.topHalf} ${BOOK.top}L${GUTTER - BOOK.bottomHalf} ${BOOK.bottom}Q${GUTTER - 100} ${BOOK.bottom - 12} ${GUTTER} ${BOOK.bottom + 4}Z`
const rightPage = `M${GUTTER} ${BOOK.top + 6}Q${GUTTER + 90} ${BOOK.top - 10} ${GUTTER + BOOK.topHalf} ${BOOK.top}L${GUTTER + BOOK.bottomHalf} ${BOOK.bottom}Q${GUTTER + 100} ${BOOK.bottom - 12} ${GUTTER} ${BOOK.bottom + 4}Z`

export function JevCoverS() {
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
          <radialGradient id={id('lamp')} cx='0.5' cy='0.35' r='0.65'>
            <stop offset='0' stopColor='#3f7478' />
            <stop offset='1' stopColor='#244a4e' />
          </radialGradient>
          <linearGradient id={id('fold')} x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0.42' stopColor='#000' stopOpacity='0' />
            <stop offset='0.5' stopColor='#000' stopOpacity='0.12' />
            <stop offset='0.58' stopColor='#000' stopOpacity='0' />
          </linearGradient>
        </defs>

        {/* Desk under a lamp; a pencil and, further back, a teacup. */}
        <rect
          x={-WING - 20}
          y={-40}
          width={W + WING * 2 + 40}
          height={H + 80}
          fill={`url(#${id('lamp')})`}
        />
        <path d='M28 300L118 262' stroke='#e2a93a' strokeWidth='8' />
        <path d='M118 262L128 258' stroke='#f1cfa8' strokeWidth='8' />
        <path d='M22 302L28 300' stroke='#e79a8a' strokeWidth='8' />
        <ellipse cx={574} cy={126} rx={34} ry={9} fill='#1c3a3d' />
        <path
          d='M550 90H598L592 122Q574 130 556 122Z'
          fill='#f3eee4'
          stroke={INK}
          strokeWidth='3'
        />
        <path
          d='M598 98Q612 102 604 114L594 116'
          stroke={INK}
          strokeWidth='3'
          fill='none'
        />
        <ellipse
          cx={574}
          cy={90}
          rx={24}
          ry={5}
          fill='#9a6a3a'
          stroke={INK}
          strokeWidth='3'
        />

        {/* Wings: more desk — a stack of closed books, loose sheets, a
            second pencil — for wide cards. */}
        {[
          [-300, 250, '#5d8fb8'],
          [-296, 232, '#c9637f'],
          [-304, 214, '#e2a93a']
        ].map(([x, y, fill]) => (
          <rect
            key={String(y)}
            x={Number(x) - 70}
            y={Number(y)}
            width={140}
            height={18}
            rx={3}
            fill={String(fill)}
            stroke={INK}
            strokeWidth='3'
          />
        ))}
        <path d='M-520 140l90-14 14 70-90 14Z' fill='#f3eee4' opacity='0.85' />
        <path d='M860 170l96 6-4 72-96-6Z' fill='#f3eee4' opacity='0.85' />
        <path d='M840 300L960 266' stroke='#4e9a6a' strokeWidth='8' />
        <path d='M960 266L972 262' stroke='#f1cfa8' strokeWidth='8' />

        {/* Everything on the book is drawn at 1× and enlarged about the
            spine's foot so the spread fills the card. */}
        <g
          transform={`translate(${GUTTER} 318) scale(1.16) translate(${-GUTTER} -318)`}
        >
          {/* Book: cover boards, page block, spread. */}
          <path
            d={`M${GUTTER - BOOK.bottomHalf - 12} ${BOOK.bottom + 14}L${GUTTER - BOOK.topHalf - 10} ${BOOK.top + 8}H${GUTTER + BOOK.topHalf + 10}L${GUTTER + BOOK.bottomHalf + 12} ${BOOK.bottom + 14}Z`}
            fill='#8a3a2e'
            stroke={INK}
            strokeWidth='3'
          />
          <path
            d={`M${GUTTER - BOOK.bottomHalf} ${BOOK.bottom}L${GUTTER - BOOK.bottomHalf} ${BOOK.bottom + 8}Q${GUTTER - 100} ${BOOK.bottom - 4} ${GUTTER} ${BOOK.bottom + 12}Q${GUTTER + 100} ${BOOK.bottom - 4} ${GUTTER + BOOK.bottomHalf} ${BOOK.bottom + 8}V${BOOK.bottom}Z`}
            fill='#e8dcc4'
            stroke={INK}
            strokeWidth='2'
          />

          {/* Ribbon tabs out of the fore edge; the pulled one slides out. */}
          {PAGES.map((page, i) => (
            <g
              key={page.id}
              className={`${styles.anim} ${styles.tab} ${styles[`tab_${page.id}`]}`}
            >
              <path
                d={`M${GUTTER + BOOK.topHalf + 4 + i * 5} ${BOOK.top + 10 + i * 16}h26l-6 6 6 6h-26Z`}
                fill={page.tab}
                stroke={INK}
                strokeWidth='2'
              />
            </g>
          ))}

          <path d={leftPage} fill={PAPER} stroke={INK} strokeWidth='3' />
          <path d={rightPage} fill={PAPER} stroke={INK} strokeWidth='3' />
          <rect
            x={GUTTER - BOOK.bottomHalf}
            y={BOOK.top - 10}
            width={BOOK.bottomHalf * 2}
            height={BOOK.bottom - BOOK.top + 20}
            fill={`url(#${id('fold')})`}
          />
          {/* Faint printed lines on the pages. */}
          {[0, 1, 2].map((k) => (
            <path
              key={k}
              d={`M${GUTTER - 170 + k * 6} ${BOOK.top + 26 + k * 16}H${GUTTER - 118 + k * 4}M${GUTTER + 118 - k * 4} ${BOOK.top + 26 + k * 16}H${GUTTER + 170 - k * 6}`}
              stroke='#d9ccb2'
              strokeWidth='3'
            />
          ))}

          {/* The pop-ups, each hinged on the gutter line. */}
          {PAGES.map((page) => (
            <g
              key={page.id}
              className={`${styles.anim} ${styles.pop} ${styles[`pop_${page.id}`]}`}
            >
              <PopUp id={page.id} light={page.light} dark={page.dark} />
            </g>
          ))}

          {/* The turning leaf, folded flat at rest (scaleX 0 at the gutter). */}
          <path
            d={rightPage}
            fill={PAPER}
            stroke={INK}
            strokeWidth='3'
            className={`${styles.anim} ${styles.leaf}`}
          />
        </g>
      </svg>
    </div>
  )
}

function PopUp({
  id,
  light,
  dark
}: {
  id: PageId
  light: string
  dark: string
}) {
  switch (id) {
    case 'music':
      return (
        <g stroke={INK} strokeWidth='2.5'>
          {/* Concert shell, grand piano, notes on paper stalks. */}
          <path
            d={`M${GUTTER - 118} ${BASE}A118 118 0 0 1 ${GUTTER + 118} ${BASE}Z`}
            fill={light}
          />
          <path
            d={`M${GUTTER - 84} ${BASE}A84 84 0 0 1 ${GUTTER + 84} ${BASE}`}
            fill='none'
            stroke={dark}
            strokeWidth='2'
            opacity='0.35'
          />
          <path
            d={`M${GUTTER - 50} ${BASE}A50 50 0 0 1 ${GUTTER + 50} ${BASE}`}
            fill='none'
            stroke={dark}
            strokeWidth='2'
            opacity='0.35'
          />
          <g fill={dark}>
            <path
              d={`M${GUTTER - 46} ${BASE - 40}H${GUTTER + 32}Q${GUTTER + 60} ${BASE - 40} ${GUTTER + 54} ${BASE - 24}H${GUTTER - 46}Z`}
            />
            <path
              d={`M${GUTTER - 42} ${BASE - 40}L${GUTTER + 20} ${BASE - 82}L${GUTTER + 24} ${BASE - 40}Z`}
            />
            <path
              d={`M${GUTTER - 40} ${BASE - 24}V${BASE}M${GUTTER + 44} ${BASE - 24}V${BASE}`}
              strokeWidth='5'
              stroke={dark}
            />
          </g>
          {[
            [-86, -120],
            [72, -134],
            [104, -98]
          ].map(([dx, dy]) => (
            <g key={dx}>
              <path
                d={`M${GUTTER + (dx ?? 0)} ${BASE}V${BASE + (dy ?? 0) + 8}`}
                stroke={dark}
                strokeWidth='1.5'
                opacity='0.5'
              />
              <ellipse
                cx={GUTTER + (dx ?? 0)}
                cy={BASE + (dy ?? 0) + 8}
                rx={8}
                ry={5.5}
                transform={`rotate(-20 ${GUTTER + (dx ?? 0)} ${BASE + (dy ?? 0) + 8})`}
                fill={dark}
              />
              <path
                d={`M${GUTTER + (dx ?? 0) + 7} ${BASE + (dy ?? 0) + 6}V${BASE + (dy ?? 0) - 18}L${GUTTER + (dx ?? 0) + 16} ${BASE + (dy ?? 0) - 12}`}
                stroke={dark}
                strokeWidth='3'
                fill='none'
              />
            </g>
          ))}
        </g>
      )
    case 'inbox':
      return (
        <g stroke={INK} strokeWidth='2.5'>
          {/* Post office front with a pillar box; letters on springs. */}
          <path
            d={`M${GUTTER - 96} ${BASE}V${BASE - 96}L${GUTTER} ${BASE - 150}L${GUTTER + 96} ${BASE - 96}V${BASE}Z`}
            fill={light}
          />
          <rect
            x={GUTTER - 22}
            y={BASE - 56}
            width={44}
            height={56}
            fill={dark}
          />
          <rect
            x={GUTTER - 76}
            y={BASE - 80}
            width={30}
            height={30}
            fill={PAPER}
          />
          <rect
            x={GUTTER + 46}
            y={BASE - 80}
            width={30}
            height={30}
            fill={PAPER}
          />
          <circle cx={GUTTER} cy={BASE - 112} r={12} fill={PAPER} />
          <path
            d={`M${GUTTER + 112} ${BASE}V${BASE - 44}Q${GUTTER + 112} ${BASE - 62} ${GUTTER + 128} ${BASE - 62}Q${GUTTER + 144} ${BASE - 62} ${GUTTER + 144} ${BASE - 44}V${BASE}Z`}
            fill='#c0392b'
          />
          {[
            [-140, -120],
            [-120, -60],
            [150, -120]
          ].map(([dx, dy]) => (
            <g key={dx}>
              <path
                d={`M${GUTTER + (dx ?? 0) * 0.7} ${BASE}l${(dx ?? 0) * 0.1} -10l${-(dx ?? 0) * 0.08} -10l${(dx ?? 0) * 0.1} -10L${GUTTER + (dx ?? 0)} ${BASE + (dy ?? 0) + 10}`}
                stroke={dark}
                strokeWidth='1.5'
                fill='none'
                opacity='0.5'
              />
              <rect
                x={GUTTER + (dx ?? 0) - 14}
                y={BASE + (dy ?? 0)}
                width={28}
                height={19}
                rx={2}
                fill={PAPER}
              />
              <path
                d={`M${GUTTER + (dx ?? 0) - 14} ${BASE + (dy ?? 0)}l14 10 14-10`}
                fill='none'
                strokeWidth='2'
              />
            </g>
          ))}
        </g>
      )
    case 'match':
      return (
        <g stroke={INK} strokeWidth='2.5'>
          {/* A big tree, two figures facing each other under it. */}
          <path
            d={`M${GUTTER - 8} ${BASE}V${BASE - 80}H${GUTTER + 8}V${BASE}Z`}
            fill='#7a4a2a'
          />
          <path
            d={`M${GUTTER - 100} ${BASE - 96}a44 44 0 0 1 40 -58a54 54 0 0 1 104 -4a44 44 0 0 1 56 58a36 36 0 0 1 -26 50h-150a36 36 0 0 1 -24 -46Z`}
            fill={light}
          />
          <g fill={dark} stroke='none'>
            <circle cx={GUTTER - 54} cy={BASE - 70} r={12} />
            <path
              d={`M${GUTTER - 72} ${BASE}V${BASE - 42}Q${GUTTER - 72} ${BASE - 58} ${GUTTER - 54} ${BASE - 58}Q${GUTTER - 36} ${BASE - 58} ${GUTTER - 36} ${BASE - 42}V${BASE}Z`}
            />
            <circle cx={GUTTER + 54} cy={BASE - 66} r={11} />
            <path
              d={`M${GUTTER + 36} ${BASE}L${GUTTER + 40} ${BASE - 40}Q${GUTTER + 42} ${BASE - 54} ${GUTTER + 54} ${BASE - 54}Q${GUTTER + 66} ${BASE - 54} ${GUTTER + 68} ${BASE - 40}L${GUTTER + 74} ${BASE}Z`}
            />
          </g>
          <path
            d={`M${GUTTER} ${BASE - 96}c-8-8-20-1-12 8l12 11 12-11c8-9-4-16-12-8Z`}
            fill='#e0435e'
          />
        </g>
      )
    case 'trolley':
      return (
        <g stroke={INK} strokeWidth='2.5'>
          {/* Green hill, wire on poles, the tram cresting it. */}
          <path
            d={`M${GUTTER - 150} ${BASE}Q${GUTTER - 60} ${BASE - 110} ${GUTTER + 40} ${BASE - 86}T${GUTTER + 150} ${BASE}Z`}
            fill={light}
          />
          <path
            d={`M${GUTTER - 120} ${BASE - 118}Q${GUTTER} ${BASE - 146} ${GUTTER + 130} ${BASE - 112}`}
            fill='none'
            strokeWidth='1.5'
          />
          {[-110, 120].map((dx) => (
            <path
              key={dx}
              d={`M${GUTTER + dx} ${BASE}V${BASE - 124}`}
              strokeWidth='4'
              stroke={dark}
            />
          ))}
          <path
            d={`M${GUTTER - 4} ${BASE - 90}L${GUTTER + 8} ${BASE - 136}`}
            strokeWidth='2.5'
          />
          <rect
            x={GUTTER - 50}
            y={BASE - 96}
            width={96}
            height={52}
            rx={10}
            fill={dark}
          />
          {[0, 1, 2, 3].map((k) => (
            <rect
              key={k}
              x={GUTTER - 42 + k * 22}
              y={BASE - 88}
              width={16}
              height={16}
              rx={2}
              fill={PAPER}
              strokeWidth='2'
            />
          ))}
          <circle cx={GUTTER - 26} cy={BASE - 42} r={8} fill={INK} />
          <circle cx={GUTTER + 24} cy={BASE - 42} r={8} fill={INK} />
        </g>
      )
  }
}
