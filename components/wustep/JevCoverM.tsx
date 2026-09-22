import styles from './JevCoverM.module.css'

/** Paper flight — one envelope finds its way out of the pile.. Preview only; no type or copy is painted into the artwork. */
export function JevCoverM() {
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
          cx='546'
          cy='212'
          rx='136'
          ry='10'
          fill='#3d5a80'
          opacity='.14'
        />
        <path
          d='M428 154 471 129H633L654 154 626 203H428Z'
          fill='#7596a5'
          stroke='#2c3d49'
          strokeWidth='2.5'
        />
        <path
          d='M446 149 470 134H616L639 149V183H446Z'
          fill='#b5cbd2'
          stroke='#2c3d49'
          strokeWidth='2'
        />
        {[0, 1, 2].map((i) => (
          <g
            key={i}
            transform={`translate(${532 + i * 7} ${157 - i * 16}) rotate(${-12 + i * 9})`}
          >
            <rect
              x='-70'
              y='-25'
              width='140'
              height='58'
              rx='3'
              fill={i === 2 ? '#f9f4df' : '#e3ddca'}
              stroke='#52616a'
              strokeWidth='2'
            />
            <path d='M-68-23 0 13 68-23' stroke='#a6a393' strokeWidth='2' />
          </g>
        ))}
        <path
          d='M428 165H486L497 178H554L565 165H626V203H428Z'
          fill='#608598'
          stroke='#2c3d49'
          strokeWidth='2.5'
        />
        <path
          d='M639 174C709 164 670 114 631 133C590 155 618 201 696 177C745 162 758 107 739 79'
          stroke='#7596a5'
          strokeWidth='2'
          strokeDasharray='4 7'
        />
        <g className={`${styles.anim} ${styles.plane}`}>
          <path
            d='M642 57 779 37 718 111 702 74Z'
            fill='#fffbeb'
            stroke='#2c3d49'
            strokeWidth='2.5'
          />
          <path
            d='M702 74 779 37 711 87 718 111Z'
            fill='#a7c4cf'
            stroke='#2c3d49'
            strokeWidth='2'
          />
          <path
            d='M702 74 696 96 711 87'
            fill='#608598'
            stroke='#2c3d49'
            strokeWidth='2'
          />
        </g>
        <path
          d='M481 64 487 52M461 75 449 70M505 56 505 43'
          stroke='#9fb6bd'
          strokeWidth='3'
        />
      </svg>
    </div>
  )
}
