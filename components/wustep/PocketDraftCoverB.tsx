import { useId } from 'react'

import styles from './PocketDraftCoverB.module.css'

/**
 * PocketDraftCoverB — "Poster" (brand treatment). Unshipped variant, kept
 * for the covers-preview workbench.
 *
 *   A recital poster: giant serif wordmark, one oversized Melody card with
 *   a treble clef, gold foil rule. Hover shimmers the foil and tilts the
 *   card as if it were being drawn from a program.
 */

const GOLD = '#e8c36a'
const IVORY_DEEP = '#e7dcc6'

const STAGE_W = 1920
const STAGE_H = 360

export function PocketDraftCoverB() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `pdb-${name}-${uid}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <linearGradient id={id('stage')} x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0' stopColor='#2a1838' />
            <stop offset='0.5' stopColor='#1c1228' />
            <stop offset='1' stopColor='#120c1c' />
          </linearGradient>
          <linearGradient id={id('card')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#fbf6eb' />
            <stop offset='1' stopColor={IVORY_DEEP} />
          </linearGradient>
          <linearGradient id={id('foil')} x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0' stopColor={GOLD} />
            <stop offset='0.45' stopColor='#fff3c4' />
            <stop offset='1' stopColor={GOLD} />
          </linearGradient>
        </defs>

        <rect width={STAGE_W} height={STAGE_H} fill={`url(#${id('stage')})`} />

        <text className={styles.kicker} x='430' y='86'>
          A POCKET RECITAL
        </text>
        <text className={styles.wordmark} x='430' y='168'>
          Pocket
        </text>
        <text className={styles.wordmark} x='430' y='248'>
          Draft
        </text>
        <rect
          className={styles.foil}
          x='430'
          y='268'
          width='320'
          height='4'
          rx='2'
          fill={`url(#${id('foil')})`}
        />
        <text className={styles.sub} x='430' y='308'>
          PICK 1 OF 3 · FIVE ROUNDS · ONE CLASH
        </text>

        <g className={styles.heroCard}>
          <rect
            x='1088'
            y='42'
            width='196'
            height='276'
            rx='18'
            fill={`url(#${id('card')})`}
          />
          <circle cx='1116' cy='76' r='9' fill={GOLD} />
          <text className={styles.heroSuit} x='1134' y='82'>
            MELODY
          </text>
          <text className={styles.clef} x='1186' y='200'>
            𝄞
          </text>
          <text className={styles.heroName} x='1112' y='268'>
            Octave
          </text>
        </g>
        <g className={styles.peekCard}>
          <rect
            x='1268'
            y='78'
            width='150'
            height='210'
            rx='14'
            fill={`url(#${id('card')})`}
            opacity='0.92'
          />
          <circle cx='1294' cy='108' r='8' fill='#7eb8d4' />
          <text className={styles.peekName} x='1288' y='168'>
            Cadence
          </text>
        </g>
      </svg>
    </div>
  )
}
