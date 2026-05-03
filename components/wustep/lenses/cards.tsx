import * as React from 'react'

import { Illustration } from './illustrations'
import styles from './LensesPage.module.css'
import { GRID, type Lens, STAGE, type Stage, TIMING } from './types'

/* ─────────────────────────────────────────────────────────
 * Cards — placed by row/col in the .cards CSS grid.
 *
 *   Each lens has an (x, y) anchor in viewport-percent. We translate
 *   that to a (rowIndex, colIndex) pair via the GRID anchors, then
 *   place the card into the corresponding grid cell. The same
 *   indices drive the entrance stagger:
 *
 *     delay = rowIndex * TIMING.rowStaggerMs
 *           + colIndex * TIMING.colStaggerMs
 *
 *   On narrow viewports the parent grid switches to auto-fit and
 *   our explicit row/col is ignored — the cards just flow in
 *   document order, which is fine because the registry already
 *   reads roughly left-to-right, top-to-bottom.
 * ───────────────────────────────────────────────────────── */

function indexOfClosest(value: number, anchors: readonly number[]) {
  let bestIndex = 0
  let bestDelta = Infinity
  for (const [i, anchor] of anchors.entries()) {
    const delta = Math.abs(value - anchor!)
    if (delta < bestDelta) {
      bestDelta = delta
      bestIndex = i
    }
  }
  return bestIndex
}

type LensCardProps = {
  lens: Lens
  stage: Stage
  selected: boolean
  onOpen: () => void
}

export function LensCard({ lens, stage, selected, onOpen }: LensCardProps) {
  const visible = stage >= STAGE.cards
  const rowIndex = indexOfClosest(lens.y, GRID.rowAnchors)
  const colIndex = indexOfClosest(lens.x, GRID.colAnchors)
  const delay = rowIndex * TIMING.rowStaggerMs + colIndex * TIMING.colStaggerMs

  const style: React.CSSProperties = {
    // CSS grid is 1-indexed for grid-column/grid-row.
    gridColumn: `${colIndex + 1} / span 1`,
    gridRow: `${rowIndex + 1} / span 1`,
    // Per-card entrance stagger expressed as a CSS variable so it
    // ONLY applies to the entrance transition (see `.card` rule),
    // not to every subsequent hover/select transition. Inline
    // `transition-delay` would win specificity and add 100s of ms
    // of delay to hover-in on every card past the first row.
    ['--card-enter-delay' as string]: `${delay}ms`,
    ['--card-bg' as string]: lens.bg,
    ['--card-fg' as string]: lens.fg,
    ['--card-accent' as string]: lens.accent ?? lens.fg
  }

  const className = [
    styles.card,
    visible && styles.cardVisible,
    selected && styles.cardSelected
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type='button'
      className={className}
      style={style}
      onClick={onOpen}
      aria-label={`Open lens: ${lens.title}`}
      aria-pressed={selected}
      data-lens-id={lens.id}
      data-lens-category={lens.category}
      data-lens-selected={selected ? 'true' : undefined}
    >
      {/* Hidden by default; the design panel can flip a data
          attribute on <html> to reveal it. Keeps the markup
          uniform between standard/dev modes. */}
      <span className={styles.cardEyebrow} aria-hidden='true'>
        {lens.category}
      </span>
      <span className={styles.cardArt} aria-hidden='true'>
        <Illustration
          id={lens.illustration}
          fg={lens.fg}
          bg={lens.bg}
          accent={lens.accent ?? lens.fg}
        />
      </span>
      <span className={styles.cardTitle}>{lens.title}</span>
      {/* Tagline preview only renders in design-panel mode. Sits
          absolute so it doesn't affect layout when hidden. */}
      <span className={styles.cardHoverTagline} aria-hidden='true'>
        {lens.tagline}
      </span>
    </button>
  )
}

type CenterCardProps = {
  stage: Stage
  onOpen: () => void
}

/**
 * CenterCard — the larger "Lenses" card that opens the index dialog.
 *
 *   At 1200px+ this is a 2×2 spanning card centered in the grid:
 *   illustration above, title below. At narrower widths (where it
 *   can't span 2×2) it becomes a full-width hero pinned to the top
 *   of the grid: illustration on the left, title + tagline on the
 *   right. The tagline is hidden in 2×2 mode via CSS so the
 *   markup is the same in both states.
 */
export function CenterCard({ stage, onOpen }: CenterCardProps) {
  const visible = stage >= STAGE.center

  return (
    <button
      type='button'
      className={`${styles.centerCard} ${visible ? styles.centerCardVisible : ''}`}
      onClick={onOpen}
      aria-label='Open: Lenses index'
      data-lens-id='__center__'
    >
      <span className={styles.cardArt} aria-hidden='true'>
        <Illustration
          id='lenses-deck'
          fg='#EDE4D1'
          bg='#1A1F2A'
          accent='#C99E5B'
        />
      </span>
      <span className={styles.centerCardTextWrap}>
        <span className={styles.centerCardTitle}>Lenses</span>
        <span className={styles.centerCardTagline}>
          A way of looking. Pick one. Try it on.
        </span>
      </span>
    </button>
  )
}
