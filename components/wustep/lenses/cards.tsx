import * as React from 'react'

import { Illustration } from './illustrations'
import styles from './LensesPage.module.css'
import { GRID, type Lens, STAGE, type Stage,TIMING } from './types'

/* ─────────────────────────────────────────────────────────
 * Cards — staggered entrance after the center card lands.
 *
 *   Each lens card snaps to a (rowIndex, colIndex) on a 4×6 grid
 *   inferred from its (x, y) position via GRID.rowAnchors /
 *   GRID.colAnchors. We then apply a transition-delay sized like:
 *
 *     delay = TIMING.cardsInBase
 *           + rowIndex * TIMING.rowStaggerMs
 *           + colIndex * TIMING.colStaggerMs
 *
 *   This gives a soft top-to-bottom, left-to-right reveal that
 *   completes in ~640ms after the center card finishes.
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
  onOpen: () => void
}

export function LensCard({ lens, stage, onOpen }: LensCardProps) {
  const visible = stage >= STAGE.cards
  const rowIndex = indexOfClosest(lens.y, GRID.rowAnchors)
  const colIndex = indexOfClosest(lens.x, GRID.colAnchors)
  const delay =
    rowIndex * TIMING.rowStaggerMs + colIndex * TIMING.colStaggerMs

  const style: React.CSSProperties = {
    left: `${lens.x}%`,
    top: `${lens.y}%`,
    transitionDelay: visible ? `${delay}ms` : '0ms',
    ['--card-bg' as string]: lens.bg,
    ['--card-fg' as string]: lens.fg,
    ['--card-accent' as string]: lens.accent ?? lens.fg
  }

  return (
    <button
      type='button'
      className={`${styles.card} ${visible ? styles.cardVisible : ''}`}
      style={style}
      onClick={onOpen}
      aria-label={`Open lens: ${lens.title}`}
      data-lens-id={lens.id}
    >
      <span className={styles.cardArt} aria-hidden='true'>
        <Illustration
          id={lens.illustration}
          fg={lens.fg}
          bg={lens.bg}
          accent={lens.accent ?? lens.fg}
        />
      </span>
      <span className={styles.cardTitle}>{lens.title}</span>
    </button>
  )
}

type CenterCardProps = {
  stage: Stage
  onOpen: () => void
}

/**
 * CenterCard — the larger "Lenses" card that opens the index dialog.
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
          fg='#F5F1E8'
          bg='#0E0E10'
          accent='#F2C04A'
        />
      </span>
      <span className={styles.centerCardTitle}>Lenses</span>
    </button>
  )
}
