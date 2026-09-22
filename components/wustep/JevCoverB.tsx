import styles from './JevCoverB.module.css'
import { jevTypeClass } from './jevCoverType'

/**
 * JevCoverB — the poster. Unshipped variant, kept for the covers-preview
 * workbench.
 *
 *   OG-image energy in the app's paper and ink: an italic Fraunces "Jev",
 *   a gold rule, and the four demo names under their own accent ticks
 *   (Music gold, Trolley red, Inbox blue, Match purple — the landing
 *   cards' top borders). At rest every tick is lit and every name is ink,
 *   a finished poster. Hover reads the index: one name takes its accent
 *   and its tick thickens, then the next.
 */

const INK = '#16161a'
const ACCENT = '#9a6a1c'

const NAMES = [
  { name: 'Music', accent: '#9a6a1c', x: 480, on: styles.onMusic },
  { name: 'Trolley', accent: '#b3261e', x: 560, on: styles.onTrolley },
  { name: 'Inbox', accent: '#3d5a80', x: 640, on: styles.onInbox },
  { name: 'Match', accent: '#5c4a7a', x: 720, on: styles.onMatch }
] as const

export function JevCoverB() {
  return (
    <div className={`${styles.cover} ${jevTypeClass}`} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 1200 240'
        preserveAspectRatio='xMidYMid slice'
      >
        {/* Masthead rule, the app's 2px ink line. It runs into the wings so
            a wide card shows more of the page, not a bigger word. */}
        <line x1='48' y1='32' x2='1152' y2='32' stroke={INK} strokeWidth='2' />

        <text className={styles.kicker} x='600' y='48'>
          SYSTEM ONE
        </text>
        <text className={styles.wordmark} x='600' y='124'>
          Jev
        </text>
        <line
          x1='528'
          y1='140'
          x2='672'
          y2='140'
          stroke={ACCENT}
          strokeWidth='2'
        />

        {NAMES.map(({ name, accent, x, on }) => (
          <g key={name}>
            <line
              x1={x - 16}
              y1='166'
              x2={x + 16}
              y2='166'
              stroke={accent}
              strokeWidth='3'
              strokeLinecap='round'
            />
            <text className={styles.name} x={x} y='188'>
              {name}
            </text>
            {/* The reading: accent name plus a heavier tick, invisible at rest. */}
            <g className={on}>
              <line
                x1={x - 16}
                y1='166'
                x2={x + 16}
                y2='166'
                stroke={accent}
                strokeWidth='7'
                strokeLinecap='round'
              />
              <text className={styles.nameOn} x={x} y='188' fill={accent}>
                {name}
              </text>
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}
