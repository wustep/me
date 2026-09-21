import { useId } from 'react'

import styles from './JevInboxCover.module.css'

/**
 * JevInboxCover — triad vignette.
 *
 *   Three inbox rows and a Delete / Review / Leave meter. Rest is quiet
 *   paper. Hover fills Review, stamps the recommended action, and lifts
 *   the middle row — the demo's one moment, not a screenshot.
 */

export function JevInboxCover() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `ji-${name}-${uid}`

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
            x='-10%'
            y='-20%'
            width='130%'
            height='160%'
          >
            <feDropShadow
              dx='0'
              dy='3'
              stdDeviation='3'
              floodColor='#2a2622'
              floodOpacity='0.12'
            />
          </filter>
        </defs>

        {/* Left filler: faint extra rows so a wide card still reads as an inbox. */}
        <g opacity='0.35'>
          <rect
            className={styles.row}
            x='210'
            y='52'
            width='200'
            height='40'
            rx='8'
          />
          <rect
            className={styles.row}
            x='210'
            y='100'
            width='200'
            height='40'
            rx='8'
          />
          <rect
            className={styles.row}
            x='210'
            y='148'
            width='200'
            height='40'
            rx='8'
          />
        </g>
        <g opacity='0.28'>
          <rect
            className={styles.row}
            x='900'
            y='70'
            width='170'
            height='36'
            rx='8'
          />
          <rect
            className={styles.row}
            x='900'
            y='116'
            width='170'
            height='36'
            rx='8'
          />
        </g>

        <g filter={`url(#${id('shadow')})`}>
          <g>
            <rect
              className={styles.row}
              x='430'
              y='44'
              width='268'
              height='48'
              rx='9'
            />
            <circle
              className={`${styles.dot} ${styles.dotLive}`}
              cx='448'
              cy='68'
              r='4'
            />
            <rect
              className={styles.line}
              x='462'
              y='58'
              width='96'
              height='6'
              rx='3'
            />
            <rect
              className={styles.mute}
              x='462'
              y='72'
              width='168'
              height='5'
              rx='2.5'
            />
          </g>

          <g className={styles.midRow}>
            <rect
              className={styles.row}
              x='430'
              y='100'
              width='268'
              height='48'
              rx='9'
            />
            <circle
              className={`${styles.dot} ${styles.dotLive}`}
              cx='448'
              cy='124'
              r='4'
            />
            <rect
              className={styles.line}
              x='462'
              y='114'
              width='118'
              height='6'
              rx='3'
            />
            <rect
              className={styles.mute}
              x='462'
              y='128'
              width='150'
              height='5'
              rx='2.5'
            />
          </g>

          <g>
            <rect
              className={styles.row}
              x='430'
              y='156'
              width='268'
              height='48'
              rx='9'
            />
            <circle
              className={styles.dot}
              cx='448'
              cy='180'
              r='4'
              opacity='0.25'
            />
            <rect
              className={styles.line}
              x='462'
              y='170'
              width='88'
              height='6'
              rx='3'
            />
            <rect
              className={styles.mute}
              x='462'
              y='184'
              width='176'
              height='5'
              rx='2.5'
            />
          </g>
        </g>

        <text className={styles.label} x='724' y='70'>
          DELETE
        </text>
        <rect
          className={styles.track}
          x='788'
          y='61'
          width='150'
          height='8'
          rx='4'
        />
        <rect
          className={`${styles.fill} ${styles.fillDelete}`}
          x='788'
          y='61'
          width='150'
          height='8'
          rx='4'
        />

        <text className={styles.label} x='724' y='102'>
          REVIEW
        </text>
        <rect
          className={styles.track}
          x='788'
          y='93'
          width='150'
          height='8'
          rx='4'
        />
        <rect
          className={`${styles.fill} ${styles.fillReview}`}
          x='788'
          y='93'
          width='150'
          height='8'
          rx='4'
        />

        <text className={styles.label} x='724' y='134'>
          LEAVE
        </text>
        <rect
          className={styles.track}
          x='788'
          y='125'
          width='150'
          height='8'
          rx='4'
        />
        <rect
          className={`${styles.fill} ${styles.fillLeave}`}
          x='788'
          y='125'
          width='150'
          height='8'
          rx='4'
        />

        <text className={styles.stamp} x='788' y='168'>
          REVIEW
        </text>
      </svg>
    </div>
  )
}
