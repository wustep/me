import styles from './JevCoverN.module.css'
import { JevObject } from './JevCoverObjects'

/** Magnetic chemistry — affinity becomes a physical pull.. Preview only; no type or copy is painted into the artwork. */
export function JevCoverN() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 1200 240'
        preserveAspectRatio='xMidYMid slice'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <ellipse
          cx='596'
          cy='211'
          rx='177'
          ry='12'
          fill='#65455b'
          opacity='.1'
        />
        <path d='M422 204H783' stroke='#c5aeb4' strokeWidth='2' />
        <g transform='translate(459 180) rotate(-9)' color='#bdb5b0'>
          <JevObject kind='match' />
        </g>
        <g transform='translate(524 180) rotate(8)' color='#d0a08b'>
          <JevObject kind='match' />
        </g>
        <g transform='translate(686 180) rotate(-8)' color='#9aadb0'>
          <JevObject kind='match' />
        </g>
        <g transform='translate(751 180) rotate(10)' color='#b5a0ad'>
          <JevObject kind='match' />
        </g>
        <path
          d='M558 75V56C558 4 642 4 642 56V75H617V56C617 34 583 34 583 56V75Z'
          fill='#a9718d'
          stroke='#302c32'
          strokeWidth='3'
        />
        <path
          d='M558 62H583V85H558ZM617 62H642V85H617Z'
          fill='#f9ecdf'
          stroke='#302c32'
          strokeWidth='3'
        />
        <g className={`${styles.anim} ${styles.attraction}`}>
          <path
            d='M571 97 568 105M600 89V100M629 97 632 105'
            stroke='#a9718d'
            strokeWidth='2.5'
          />
        </g>
        <ellipse
          cx='600'
          cy='202'
          rx='23'
          ry='5'
          fill='#a9718d'
          opacity='.22'
        />
        <g className={`${styles.anim} ${styles.chosen}`}>
          <g transform='translate(600 145)' color='#8c5f9f'>
            <JevObject kind='match' />
          </g>
          <path
            d='M572 154 566 147M628 154 634 147'
            stroke='#8c5f9f'
            strokeWidth='2'
          />
        </g>
        <circle cx='600' cy='27' r='4' fill='#edc9b6' />
      </svg>
    </div>
  )
}
