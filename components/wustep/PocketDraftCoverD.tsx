import { useId } from 'react'

import styles from './PocketDraftCoverD.module.css'

/**
 * PocketDraftCoverD — "Keybed table" (wildcard). Unshipped variant, kept
 * for the covers-preview workbench.
 *
 *   A piano keybed as the draft table: three ivory cards sit on white keys.
 *   Hover dips the middle key (StageBench press) and lifts its card into
 *   the hand.
 */

const GOLD = '#e8c36a'
const HARMONY = '#7eb8d4'
const RHYTHM = '#d4789a'
const IVORY_DEEP = '#e7dcc6'
const BLACK = '#1a1410'

const STAGE_W = 1920
const STAGE_H = 360
const WHITE_KEYS = 24
const KEYS_X = 0
const KEYS_Y = 168
const KEYS_W = STAGE_W
const WHITE_H = 192
const BLACK_AFTER = new Set([0, 1, 3, 4, 5])

const CARDS = [
  { key: 8, name: 'Minor', suit: HARMONY, cls: 'left' as const },
  { key: 11, name: 'Trill', suit: GOLD, cls: 'mid' as const },
  { key: 14, name: 'Rest', suit: RHYTHM, cls: 'right' as const }
]

export function PocketDraftCoverD() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `pdd-${name}-${uid}`
  const whiteW = KEYS_W / WHITE_KEYS
  const blackW = whiteW * 0.58
  const blackKeys: number[] = []
  for (let i = 0; i < WHITE_KEYS - 1; i++) {
    if (BLACK_AFTER.has(i % 7)) blackKeys.push(i)
  }

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
          <linearGradient id={id('wkey')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#f7f3ea' />
            <stop offset='1' stopColor='#e4dccb' />
          </linearGradient>
        </defs>

        <rect width={STAGE_W} height={STAGE_H} fill='#1c1228' />
        <text className={styles.kicker} x='960' y='48'>
          DRAFT ON THE KEYBED
        </text>

        {Array.from({ length: WHITE_KEYS }).map((_, i) => (
          <rect
            key={`w-${i}`}
            className={i === 11 ? styles.pressKey : undefined}
            x={KEYS_X + i * whiteW + 1}
            y={KEYS_Y}
            width={whiteW - 2}
            height={WHITE_H}
            rx='3'
            fill={`url(#${id('wkey')})`}
          />
        ))}

        {blackKeys.map((offset) => (
          <rect
            key={`b-${offset}`}
            x={KEYS_X + (offset + 1) * whiteW - blackW / 2}
            y={KEYS_Y}
            width={blackW}
            height='112'
            rx='3'
            fill={BLACK}
          />
        ))}

        {CARDS.map((card) => {
          const x = KEYS_X + card.key * whiteW + whiteW / 2 - 54
          return (
            <g
              key={card.name}
              className={card.cls === 'mid' ? styles.midCard : styles.sideCard}
              style={{ transformOrigin: `${x + 54}px 150px` }}
            >
              <rect
                x={x}
                y='72'
                width='108'
                height='148'
                rx='10'
                fill={`url(#${id('card')})`}
              />
              <circle cx={x + 18} cy='94' r='6' fill={card.suit} />
              <text className={styles.cardName} x={x + 14} y='132'>
                {card.name}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
