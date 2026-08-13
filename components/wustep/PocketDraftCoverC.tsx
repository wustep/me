import { useId } from 'react'

import styles from './PocketDraftCoverC.module.css'

/**
 * PocketDraftCoverC — "Pick 1 of 3" (mechanic close-up). Unshipped variant,
 * kept for the covers-preview workbench.
 *
 *   Three oversized cards fill the frame. Rest: the center card is the
 *   pick (lifted, gold rim). Hover slides the choice to the right card —
 *   the actual interaction, made huge.
 */

const GOLD = '#e8c36a'
const HARMONY = '#7eb8d4'
const RHYTHM = '#d4789a'
const IVORY_DEEP = '#e7dcc6'

const STAGE_W = 1920
const STAGE_H = 360

const CARDS = [
  {
    x: 486,
    name: 'Cluster',
    suit: HARMONY,
    label: 'HARMONY',
    hint: 'Too many notes.',
    cls: 'left' as const
  },
  {
    x: 812,
    name: 'Arpeggio',
    suit: GOLD,
    label: 'MELODY',
    hint: 'Climb the chord.',
    cls: 'mid' as const
  },
  {
    x: 1138,
    name: 'Fermata',
    suit: RHYTHM,
    label: 'RHYTHM',
    hint: 'Hold.',
    cls: 'right' as const
  }
]

export function PocketDraftCoverC() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `pdc-${name}-${uid}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <linearGradient id={id('card')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#fbf6eb' />
            <stop offset='1' stopColor={IVORY_DEEP} />
          </linearGradient>
        </defs>

        <rect width={STAGE_W} height={STAGE_H} fill='#1c1228' />
        <text className={styles.prompt} x='960' y='38'>
          PICK 1 OF 3
        </text>

        {CARDS.map((card) => (
          <g
            key={card.name}
            className={
              card.cls === 'left'
                ? styles.left
                : card.cls === 'mid'
                  ? styles.mid
                  : styles.right
            }
            style={{ transformOrigin: `${card.x + 148}px 196px` }}
          >
            <rect
              className={styles.rim}
              x={card.x - 4}
              y='54'
              width='304'
              height='288'
              rx='22'
              fill={GOLD}
            />
            <rect
              x={card.x}
              y='58'
              width='296'
              height='280'
              rx='18'
              fill={`url(#${id('card')})`}
            />
            <circle cx={card.x + 28} cy='90' r='8' fill={card.suit} />
            <text className={styles.suit} x={card.x + 44} y='96'>
              {card.label}
            </text>
            <text className={styles.name} x={card.x + 24} y='168'>
              {card.name}
            </text>
            <text className={styles.hint} x={card.x + 24} y='204'>
              {card.hint}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
