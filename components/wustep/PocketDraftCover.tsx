import { useId } from 'react'

import styles from './PocketDraftCover.module.css'

/**
 * PocketDraftCover — "Draft table" (gameplay vignette).
 *
 *   A miniature slice of the velvet table: three ivory cards dealt in the
 *   center, a five-slot hand rail along the bottom, gold seed chip at the
 *   left. Hover runs one pick — the middle card lifts, the others recede,
 *   and a gold check lands on the choice before it settles back.
 */

const VELVET = '#1c1228'
const VELVET_MID = '#261830'
const IVORY = '#f3ead8'
const IVORY_DEEP = '#e7dcc6'
const GOLD = '#e8c36a'
const INK = '#1a1410'
const HARMONY = '#7eb8d4'
const RHYTHM = '#d4789a'

// Extra-wide stage so `slice` keeps full height and wide cards reveal more
// felt in the wings. Action is centered on 960.
const STAGE_W = 1920
const STAGE_H = 360

const CARDS = [
  { x: 744, y: 48, name: 'Pedal', suit: HARMONY, atk: '0', blk: '4' },
  { x: 896, y: 48, name: 'Trill', suit: GOLD, atk: '3', blk: '1' },
  { x: 1048, y: 48, name: 'Rest', suit: RHYTHM, atk: '0', blk: '3' }
] as const

const HAND = [
  { x: 820, name: 'Major', suit: HARMONY },
  { x: 888, name: 'Octave', suit: GOLD },
  { x: 956, name: '', suit: '' },
  { x: 1024, name: '', suit: '' },
  { x: 1092, name: '', suit: '' }
] as const

export function PocketDraftCover() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `pd-${name}-${uid}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <linearGradient id={id('felt')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#3a2448' />
            <stop offset='0.55' stopColor={VELVET_MID} />
            <stop offset='1' stopColor={VELVET} />
          </linearGradient>
          <linearGradient id={id('card')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#fbf6eb' />
            <stop offset='1' stopColor={IVORY_DEEP} />
          </linearGradient>
          <radialGradient id={id('lamp')} cx='0.5' cy='0.15' r='0.7'>
            <stop offset='0' stopColor='rgba(232,195,106,0.18)' />
            <stop offset='1' stopColor='rgba(28,18,40,0)' />
          </radialGradient>
        </defs>

        <rect width={STAGE_W} height={STAGE_H} fill={`url(#${id('felt')})`} />
        <rect width={STAGE_W} height={STAGE_H} fill={`url(#${id('lamp')})`} />

        {/* Wing filler: faint extra cards so wide crops aren't empty. */}
        {[420, 1368].map((x) => (
          <rect
            key={x}
            x={x}
            y='78'
            width='96'
            height='132'
            rx='10'
            fill={IVORY}
            opacity='0.18'
          />
        ))}

        <text className={styles.kicker} x='744' y='36'>
          ROUND 3 OF 5
        </text>
        <g className={styles.seedChip}>
          <rect x='1088' y='18' width='88' height='22' rx='11' fill='#120c1c' />
          <text className={styles.seedText} x='1132' y='33'>
            piano
          </text>
        </g>

        {CARDS.map((card, index) => (
          <g
            key={card.name}
            className={
              index === 1
                ? styles.pickCard
                : index === 0
                  ? styles.leftCard
                  : styles.rightCard
            }
          >
            <rect
              x={card.x}
              y={card.y}
              width='128'
              height='176'
              rx='12'
              fill={`url(#${id('card')})`}
            />
            <circle cx={card.x + 20} cy={card.y + 22} r='6' fill={card.suit} />
            <text className={styles.cardName} x={card.x + 18} y={card.y + 58}>
              {card.name}
            </text>
            <text className={styles.cardStat} x={card.x + 18} y={card.y + 150}>
              {card.atk} / {card.blk}
            </text>
          </g>
        ))}

        <g className={styles.check}>
          <circle cx='960' cy='136' r='16' fill={GOLD} />
          <path
            d='M952 136 l6 6 12 -14'
            fill='none'
            stroke={INK}
            strokeWidth='3'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>

        {HAND.map((slot, index) =>
          slot.name ? (
            <g key={slot.name}>
              <rect
                x={slot.x}
                y='268'
                width='56'
                height='76'
                rx='7'
                fill={`url(#${id('card')})`}
              />
              <circle cx={slot.x + 14} cy='282' r='4' fill={slot.suit} />
              <text className={styles.handName} x={slot.x + 8} y='328'>
                {slot.name}
              </text>
            </g>
          ) : (
            <rect
              key={`empty-${index}`}
              x={slot.x}
              y='268'
              width='56'
              height='76'
              rx='7'
              fill='none'
              stroke='rgba(243,234,216,0.22)'
              strokeDasharray='4 4'
            />
          )
        )}
      </svg>
    </div>
  )
}
