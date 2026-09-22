import styles from './JevCoverJ.module.css'
import { JevObject } from './JevCoverObjects'

/** Shape sorter — a finite set of shapes makes a little world move.. Preview only; no type or copy is painted into the artwork. */
export function JevCoverJ() {
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
          cx='602'
          cy='213'
          rx='181'
          ry='13'
          fill='#302c32'
          opacity='.1'
        />
        <path
          d='M436 112 470 88H782L758 112V193L436 193Z'
          fill='#b27c51'
          stroke='#302c32'
          strokeWidth='3'
        />
        <path
          d='M436 112H758V193H436Z'
          fill='#d4a671'
          stroke='#302c32'
          strokeWidth='3'
        />
        <path
          d='M758 112 782 88V169L758 193Z'
          fill='#9b674b'
          stroke='#302c32'
          strokeWidth='3'
        />
        {[478, 558, 638, 718].map((x) => (
          <g key={x}>
            <circle cx={x} cy='152' r='25' fill='#6e4c3c' />
            <circle cx={x} cy='154' r='20' fill='#302c32' />
          </g>
        ))}
        <g transform='translate(478 151) scale(.65)' color='#e6b44b'>
          <JevObject kind='music' />
        </g>
        <g transform='translate(558 151) scale(.64)' color='#d86953'>
          <JevObject kind='trolley' />
        </g>
        <g transform='translate(638 151) scale(.64)' color='#82aab9'>
          <JevObject kind='inbox' />
        </g>
        <g transform='translate(718 151) scale(.64)' color='#b6a0c7'>
          <JevObject kind='match' />
        </g>
        <path
          d='M486 67V99M478 91 486 99 494 91'
          stroke='#9b674b'
          strokeWidth='2'
          strokeDasharray='3 5'
        />
        <g className={`${styles.anim} ${styles.block}`}>
          <path
            d='M459 35 472 25H516L503 35V70H459Z'
            fill='#f0c66c'
            stroke='#302c32'
            strokeWidth='2.5'
          />
          <path
            d='M503 35 516 25V60L503 70Z'
            fill='#b98c33'
            stroke='#302c32'
            strokeWidth='2.5'
          />
          <g transform='translate(480 50) scale(.5)' color='#302c32'>
            <JevObject kind='music' />
          </g>
        </g>
        <g transform='translate(580 57) rotate(14)'>
          <path
            d='M-17-17H17V17H-17Z'
            fill='#cb6959'
            stroke='#302c32'
            strokeWidth='2.5'
          />
          <path d='M-9-7H9M-9 0H9M-9 7H9' stroke='#f6ddba' strokeWidth='3' />
        </g>
        <path
          d='M665 39 687 76H643Z'
          fill='#7c9ead'
          stroke='#302c32'
          strokeWidth='2.5'
        />
        <circle
          cx='739'
          cy='48'
          r='19'
          fill='#ab91bb'
          stroke='#302c32'
          strokeWidth='2.5'
        />
        <circle cx='450' cy='181' r='3' fill='#6e4c3c' />
        <circle cx='744' cy='181' r='3' fill='#6e4c3c' />
      </svg>
    </div>
  )
}
