import * as React from 'react'

import { Illustration } from './illustrations'
import { TIMING, type Lens } from './types'

import styles from './LensesPage.module.css'

/**
 * LensCard — a single lens card on the canvas.
 *
 *   Position is read from the lens (`x`, `y` as viewport-percent).
 *   Entrance is staggered by row then column so the reveal sweeps
 *   roughly top-to-bottom, left-to-right after the center card lands.
 */

type LensCardProps = {
  lens: Lens
  index: number
  visible: boolean
  onOpen: () => void
}

export function LensCard({ lens, index, visible, onOpen }: LensCardProps) {
  // Stagger entrance by row (y) then column (x). Cards in the same row
  // come in within ~60ms; rows are ~110ms apart. The whole reveal
  // wraps in roughly 500ms after `cardsIn`.
  const rowIndex = Math.round(lens.y / 28) // 0..3 across rows at y=8,36,64,92
  const colIndex = Math.round((lens.x - 3) / 19) // 0..5 across cols at x=3,22,41,59,78,97
  const delay = TIMING.cardsIn + rowIndex * 110 + colIndex * 25 + (index % 3) * 8

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
  visible: boolean
  onOpen: () => void
}

/**
 * CenterCard — the larger "Lenses" card that opens the index dialog.
 */
export function CenterCard({ visible, onOpen }: CenterCardProps) {
  const style: React.CSSProperties = {
    transitionDelay: visible ? `${TIMING.centerIn}ms` : '0ms'
  }

  return (
    <button
      type='button'
      className={`${styles.centerCard} ${visible ? styles.centerCardVisible : ''}`}
      style={style}
      onClick={onOpen}
      aria-label='Open: Lenses index'
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
