import { useId } from 'react'

import styles from './ThingsCoverD.module.css'
import { THING_HALF_W, type ThingKind, ThingShape } from './thingsCoverObjects'

/**
 * ThingsCoverD — joins Music.
 *
 *   Wildcard for the Things playground entry: the collection growing, which
 *   is how the app is actually made (each commit reads "Jamcorder joins
 *   Music", "… joins Carry"). The Music case, labelled in mono caps, has the
 *   Nord, the loop station and the kalimba on its shelf and one place set at
 *   the end: its tag already on the lip and a faint glow of the newcomer's
 *   own colour where it will stand (the app's placeholder while a picture
 *   loads). The Jamcorder hangs just above that place at rest. Hovering
 *   lets it down onto the lip: it settles, its name warms, and the counts
 *   tick — MUSIC 4 → 5, THINGS · 57 → 58. It holds, fades, and is let down
 *   again.
 *
 *   The stage is wide (1200×240, sliced to the cover box — 190px tall at
 *   every card width), so the full height always fits; the case sits
 *   inside the middle ~550 units a grid card shows at laptop width, and its
 *   shelf just runs on into the dark either side.
 */

const STAGE_W = 1200
const STAGE_H = 240
/** The top of the shelf lip the things stand on. */
const LIP = 152
/** Where the newcomer's place is set. */
const NEW_X = 795

type Thing = { x: number; kind: ThingKind; maker: string; name: string }

const SHELF: Thing[] = [
  { x: 450, kind: 'nord', maker: 'Nord', name: 'Stage 4 88' },
  { x: 595, kind: 'loopStation', maker: 'BOSS', name: 'RC-505mkII' },
  { x: 695, kind: 'kalimba', maker: 'Newlam', name: 'Kalimba' }
]

/** Left edge of the case's labels, just inside a laptop grid card's view. */
const LABEL_X = 352
/**
 * Mono advance (0.6em + letter-spacing) × the characters before each
 * count, so the ticking digits sit where the label's text ends.
 */
const MARK_COUNT_X = LABEL_X + 9 * (7.5 * 0.6 + 1.5)
const CASE_COUNT_X = LABEL_X + 7 * (7 * 0.6 + 1.4)

export function ThingsCoverD() {
  // Gradient ids must be unique per instance (and colon-free so they stay
  // valid inside url(#…) references).
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `tcd-${name}-${uid}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <radialGradient id={id('lamp')} cx='0.5' cy='1' r='0.5'>
            <stop offset='0' stopColor='rgba(255, 213, 158, 0.1)' />
            <stop offset='1' stopColor='rgba(255, 213, 158, 0)' />
          </radialGradient>
          {/* The newcomer's own tone, amber from its recording light. */}
          <radialGradient id={id('tone')} cx='0.5' cy='1' r='0.5'>
            <stop offset='0' stopColor='rgba(240, 162, 74, 0.3)' />
            <stop offset='1' stopColor='rgba(240, 162, 74, 0)' />
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

        {/* The mark and the case label, each with a count that ticks. */}
        <text className={styles.markText} x={LABEL_X} y='30'>
          THINGS ·
        </text>
        <text
          className={`${styles.markCountText} ${styles.countBefore}`}
          x={MARK_COUNT_X}
          y='30'
        >
          57
        </text>
        <text
          className={`${styles.markCountText} ${styles.countAfter}`}
          x={MARK_COUNT_X}
          y='30'
        >
          58
        </text>
        <text className={styles.caseText} x={LABEL_X} y='58'>
          MUSIC
        </text>
        <text
          className={`${styles.caseText} ${styles.countBefore}`}
          x={CASE_COUNT_X}
          y='58'
        >
          4
        </text>
        <text
          className={`${styles.caseText} ${styles.countAfter}`}
          x={CASE_COUNT_X}
          y='58'
        >
          5
        </text>

        {/* ---- the shelf ---- */}
        <ellipse
          cx='620'
          cy={LIP}
          rx='380'
          ry='110'
          fill={`url(#${id('lamp')})`}
          clipPath={`url(#${id('wall')})`}
        />
        <ellipse
          className={styles.tone}
          clipPath={`url(#${id('wall')})`}
          cx={NEW_X}
          cy={LIP}
          rx='26'
          ry='22'
          fill={`url(#${id('tone')})`}
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
          height='14'
          fill={`url(#${id('drop')})`}
        />

        {SHELF.map(({ x, kind, maker, name }) => (
          <g key={x}>
            <ellipse
              cx={x}
              cy={LIP + 0.5}
              rx={THING_HALF_W[kind] * 0.9}
              ry='2.2'
              fill='#000'
              opacity='0.55'
            />
            <g transform={`translate(${x} ${LIP})`}>
              <ThingShape kind={kind} />
            </g>
            <text className={styles.makerText} x={x} y={LIP + 26}>
              {maker.toUpperCase()}
            </text>
            <text className={styles.nameText} x={x} y={LIP + 40}>
              {name}
            </text>
          </g>
        ))}

        {/* ---- the newcomer ---- */}
        <ellipse
          className={styles.newShadow}
          cx={NEW_X}
          cy={LIP + 0.5}
          rx={THING_HALF_W.jamcorder * 0.9}
          ry='2.2'
          fill='#000'
        />
        <g transform={`translate(${NEW_X} ${LIP})`}>
          <g className={styles.newThing}>
            <ThingShape kind='jamcorder' />
          </g>
        </g>
        <text className={styles.makerText} x={NEW_X} y={LIP + 26}>
          JAMCORDER
        </text>
        <text
          className={`${styles.nameText} ${styles.newName}`}
          x={NEW_X}
          y={LIP + 40}
        >
          Jamcorder
        </text>
      </svg>
    </div>
  )
}
