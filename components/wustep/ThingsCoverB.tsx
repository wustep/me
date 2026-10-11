import { type CSSProperties, useId } from 'react'

import styles from './ThingsCoverB.module.css'

/**
 * ThingsCoverB — the name on the shelf.
 *
 *   Poster treatment for the Things playground entry: the word itself, set
 *   large in the app's serif, stands on a shelf lip like one more thing in
 *   the cabinet (its g hanging over the edge), with a tag on the lip below
 *   and the four cases' counts along the bottom in mono caps. At rest the
 *   lamp is low. Hovering switches it on — a short warm flicker up to full —
 *   while the word lifts off the lip the way the app lifts a thing you point
 *   at, its ink warms to paper, and the case counts come up one by one.
 *
 *   The stage is wide (1200×240, sliced to the cover box — 190px tall at
 *   every card width), so the full height always fits; the poster sits
 *   inside the middle ~550 units a grid card shows at laptop width, and the
 *   shelf just runs on into the dark either side.
 */

const STAGE_W = 1200
const STAGE_H = 240
const CENTER_X = 600
/** The top of the shelf lip: the word's baseline sits on it. */
const LIP = 140

/** data/items.json in wustep/things, one case per section, in shelf order. */
const CASES = [
  { label: 'Office', count: 10 },
  { label: 'Home', count: 31 },
  { label: 'Music', count: 5 },
  { label: 'Carry', count: 12 }
]
const CASE_STEP = 108

export function ThingsCoverB() {
  // Gradient ids must be unique per instance (and colon-free so they stay
  // valid inside url(#…) references).
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `tcb-${name}-${uid}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <radialGradient id={id('pool')} cx='0.5' cy='0.85' r='0.5'>
            <stop offset='0' stopColor='rgba(255, 216, 168, 0.22)' />
            <stop offset='0.5' stopColor='rgba(255, 213, 158, 0.07)' />
            <stop offset='1' stopColor='rgba(255, 213, 158, 0)' />
          </radialGradient>
          <linearGradient id={id('lip')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#3d362d' />
            <stop offset='0.12' stopColor='#3d362d' />
            <stop offset='0.13' stopColor='#221e19' />
            <stop offset='1' stopColor='#1a1713' />
          </linearGradient>
          <linearGradient id={id('drop')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='rgba(0, 0, 0, 0.55)' />
            <stop offset='1' stopColor='rgba(0, 0, 0, 0)' />
          </linearGradient>
          {/* The back wall: lamplight pools stop at the shelf lip, as the
              app's do, instead of spilling over the tags below. */}
          <clipPath id={id('wall')}>
            <rect x='0' y='0' width={STAGE_W} height={LIP} />
          </clipPath>
        </defs>

        {/* The lamp's pool on the back wall, brightest where the word
            stands. */}
        <ellipse
          className={styles.pool}
          clipPath={`url(#${id('wall')})`}
          cx={CENTER_X}
          cy={LIP - 50}
          rx='230'
          ry='150'
          fill={`url(#${id('pool')})`}
        />

        <rect
          x='0'
          y={LIP}
          width={STAGE_W}
          height='8'
          fill={`url(#${id('lip')})`}
        />
        <rect
          x='0'
          y={LIP + 8}
          width={STAGE_W}
          height='16'
          fill={`url(#${id('drop')})`}
        />

        {/* Where the word meets the lip. Thins as the word lifts. */}
        <ellipse
          className={styles.shadow}
          cx={CENTER_X}
          cy={LIP + 0.5}
          rx='120'
          ry='2.6'
          fill='#000'
        />

        <text className={styles.wordText} x={CENTER_X} y={LIP}>
          Things
        </text>

        {/* The word's tag on the lip, as every thing in the app has. */}
        <text className={styles.makerText} x={CENTER_X} y={LIP + 34}>
          WUSTEP
        </text>
        <text className={styles.nameText} x={CENTER_X} y={LIP + 49}>
          fifty-eight of them, desk to carry
        </text>

        {/* The cabinet's cases, as the app labels them. */}
        {CASES.map(({ label, count }, i) => (
          <text
            key={label}
            className={styles.caseText}
            // Its place in the hover's left-to-right stagger.
            style={{ '--i': i } as CSSProperties}
            x={CENTER_X + (i - (CASES.length - 1) / 2) * CASE_STEP}
            y='222'
          >
            {label.toUpperCase()}
            <tspan className={styles.caseCount}>{`  ${count}`}</tspan>
          </text>
        ))}
      </svg>
    </div>
  )
}
