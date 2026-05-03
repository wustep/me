import * as React from 'react'

import { CenterCard, LensCard } from './cards'
import { LENSES } from './registry'

import styles from './LensesPage.module.css'

/**
 * Canvas — viewport-sized clipping container.
 *
 *   The cards live in a `.cards` virtual canvas that is *larger* than the
 *   viewport (extending past each edge by ~12%). As the cursor moves, the
 *   `.cards` container pans in the inverse direction, so cards near the
 *   right edge "peek in" when the user moves toward the right side, etc.
 *
 *   Pan is bounded to ±PAN_RANGE_PX in each axis and smoothly interpolated
 *   via a CSS transition on `transform`. We do not animate per-card
 *   parallax — every card pans by the same amount so the grid stays
 *   uniform, just shifted.
 */
const PAN_RANGE_PX = 80

type CanvasProps = {
  mounted: boolean
  prefersReducedMotion: boolean
  onOpenCenter: () => void
  onOpenLens: (id: string) => void
}

export function Canvas({
  mounted,
  prefersReducedMotion,
  onOpenCenter,
  onOpenLens
}: CanvasProps) {
  const canvasRef = React.useRef<HTMLDivElement | null>(null)
  const [pan, setPan] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      // Range -1..1 across the viewport.
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      // Pan in the *inverse* direction so the cursor "pulls" hidden cards
      // into view. Multiplied by PAN_RANGE_PX for a gentle sweep.
      setPan({ x: -nx * PAN_RANGE_PX, y: -ny * PAN_RANGE_PX })
    },
    [prefersReducedMotion]
  )

  const handleMouseLeave = React.useCallback(() => {
    setPan({ x: 0, y: 0 })
  }, [])

  const cardsStyle: React.CSSProperties = {
    ['--pan-x' as string]: `${pan.x.toFixed(2)}px`,
    ['--pan-y' as string]: `${pan.y.toFixed(2)}px`
  }

  return (
    <div
      ref={canvasRef}
      className={`${styles.canvas} ${mounted ? styles.canvasVisible : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <BackgroundField />

      <div className={styles.cards} style={cardsStyle}>
        {LENSES.map((lens, i) => (
          <LensCard
            key={lens.id}
            lens={lens}
            index={i}
            visible={mounted}
            onOpen={() => onOpenLens(lens.id)}
          />
        ))}

        <CenterCard visible={mounted} onOpen={onOpenCenter} />
      </div>
    </div>
  )
}

function BackgroundField() {
  return (
    <div className={styles.bgWrap} aria-hidden='true'>
      <div className={styles.bgGrid} />
    </div>
  )
}
