import { useId } from 'react'

import styles from './JevMatchCover.module.css'

/**
 * JevMatchCover — two cards, one fit ring.
 *
 *   Rest: two portrait cards and an empty-ish ring. Hover: they lean in,
 *   the ring fills, a spark bridges the gap.
 */

function Face({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle className={styles.avatar} cx={cx} cy={cy} r='18' />
      <circle className={styles.mute} cx={cx - 6} cy={cy - 3} r='2.2' />
      <circle className={styles.mute} cx={cx + 6} cy={cy - 3} r='2.2' />
      <path
        className={styles.smile}
        d={`M ${cx - 7} ${cy + 7} Q ${cx} ${cy + 13} ${cx + 7} ${cy + 7}`}
      />
    </g>
  )
}

export function JevMatchCover() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `jm-${name}-${uid}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 1200 240'
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <filter
            id={id('shadow')}
            x='-20%'
            y='-20%'
            width='140%'
            height='160%'
          >
            <feDropShadow
              dx='0'
              dy='6'
              stdDeviation='8'
              floodColor='#000'
              floodOpacity='0.35'
            />
          </filter>
        </defs>

        <g className={styles.left} filter={`url(#${id('shadow')})`}>
          <rect
            className={styles.card}
            x='438'
            y='42'
            width='148'
            height='156'
            rx='16'
          />
          <Face cx={512} cy={92} />
          <rect
            className={styles.line}
            x='468'
            y='122'
            width='88'
            height='6'
            rx='3'
          />
          <rect
            className={styles.mute}
            x='478'
            y='136'
            width='68'
            height='5'
            rx='2.5'
          />
          <rect
            className={styles.mute}
            x='472'
            y='150'
            width='80'
            height='5'
            rx='2.5'
          />
        </g>

        <g className={styles.right} filter={`url(#${id('shadow')})`}>
          <rect
            className={styles.card}
            x='694'
            y='42'
            width='148'
            height='156'
            rx='16'
          />
          <Face cx={768} cy={92} />
          <rect
            className={styles.line}
            x='724'
            y='122'
            width='88'
            height='6'
            rx='3'
          />
          <rect
            className={styles.mute}
            x='734'
            y='136'
            width='68'
            height='5'
            rx='2.5'
          />
          <rect
            className={styles.mute}
            x='728'
            y='150'
            width='80'
            height='5'
            rx='2.5'
          />
        </g>

        <circle className={styles.ring} cx='640' cy='118' r='21' />
        <circle className={styles.ringFill} cx='640' cy='118' r='21' />
        <text className={styles.fitText} x='640' y='123'>
          78
        </text>
        <path className={styles.spark} d='M 586 90 C 610 70, 670 70, 694 90' />
      </svg>
    </div>
  )
}
