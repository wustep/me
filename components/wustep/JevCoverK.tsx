import styles from './JevCoverK.module.css'
import { JevObject } from './JevCoverObjects'

/** Paper piano — one punched pattern becomes music.. Preview only; no type or copy is painted into the artwork. */
export function JevCoverK() {
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
          cx='606'
          cy='211'
          rx='173'
          ry='12'
          fill='#302c32'
          opacity='.12'
        />
        <path
          d='M432 158C460 158 454 56 496 56H679V78H496C475 78 484 177 444 177H410V158Z'
          fill='#fff9e9'
          stroke='#726856'
          strokeWidth='2'
        />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i} fill='#c4af79'>
            <circle cx={499 + i * 23} cy='64' r='2' />
            <circle cx={499 + i * 23} cy='73' r='2' />
          </g>
        ))}
        <path
          d='M478 124 529 93H714L750 126 704 197H478Z'
          fill='#bb714f'
          stroke='#302c32'
          strokeWidth='3'
        />
        <path
          d='M478 124H704V197H478Z'
          fill='#d99965'
          stroke='#302c32'
          strokeWidth='3'
        />
        <path
          d='M704 124 750 96V170L704 197Z'
          fill='#8c5141'
          stroke='#302c32'
          strokeWidth='3'
        />
        <path
          d='M478 124 525 96H750L704 124Z'
          fill='#f0c994'
          stroke='#302c32'
          strokeWidth='3'
        />
        <rect x='508' y='131' width='174' height='48' rx='5' fill='#443b35' />
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`translate(${515 + i * 13} 137)`}>
            <rect width='9' height={31 - (i % 4) * 4} rx='2' fill='#ded7bd' />
            <circle cx='4.5' cy='6' r='1.7' fill='#77634e' />
          </g>
        ))}
        <g className={`${styles.anim} ${styles.cylinder}`}>
          <rect
            x='516'
            y='85'
            width='179'
            height='27'
            rx='13'
            fill='#d4ad50'
            stroke='#302c32'
            strokeWidth='2.5'
          />
          {Array.from({ length: 13 }, (_, i) => (
            <path
              key={i}
              d={`M${526 + i * 12} 91v14`}
              stroke='#fff0b3'
              strokeWidth='3'
            />
          ))}
        </g>
        <path d='M745 143H771V122H787' stroke='#302c32' strokeWidth='5' />
        <circle
          cx='790'
          cy='122'
          r='7'
          fill='#b36146'
          stroke='#302c32'
          strokeWidth='2'
        />
        <g className={`${styles.anim} ${styles.notes}`} color='#a07728'>
          <g transform='translate(578 44) scale(.7)'>
            <JevObject kind='music' />
          </g>
          <g transform='translate(680 35) scale(.45) rotate(15)'>
            <JevObject kind='music' />
          </g>
        </g>
        <path
          d='M446 192H461M452 185V199M733 53H747M740 46V60'
          stroke='#b5a781'
          strokeWidth='2'
        />
      </svg>
    </div>
  )
}
