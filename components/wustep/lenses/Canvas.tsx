import * as React from 'react'

import { CenterCard, LensCard } from './cards'
import styles from './LensesPage.module.css'
import { keyToDirection, neighborInDirection } from './navigation'
import { LENSES } from './registry'
import { STAGE, type Stage } from './types'

/* ─────────────────────────────────────────────────────────
 * Canvas — viewport-sized clipping container.
 *
 *   The cards live in a `.cards` virtual canvas that is *larger* than
 *   the viewport (extending past each edge by ~12%). As the cursor
 *   moves, the `.cards` container pans in the inverse direction, so
 *   cards near the right edge "peek in" when the user moves toward
 *   the right side, etc.
 *
 *   Pan is bounded to ±PAN_RANGE_PX in each axis and smoothly
 *   interpolated via a CSS transition on `transform`. We do not
 *   animate per-card parallax — every card pans by the same amount
 *   so the grid stays uniform, just shifted.
 *
 *   `will-change: transform` is toggled on only while the user is
 *   actively moving the cursor over the canvas — keeping it on
 *   permanently bloats the compositor for a static page.
 * ───────────────────────────────────────────────────────── */
const PAN = {
  rangePx: 80,
  /** ms the will-change hint persists after the cursor stops. */
  willChangeIdleMs: 600
} as const

type CanvasProps = {
  stage: Stage
  prefersReducedMotion: boolean
  onOpenCenter: () => void
  onOpenLens: (id: string) => void
}

export function Canvas({
  stage,
  prefersReducedMotion,
  onOpenCenter,
  onOpenLens
}: CanvasProps) {
  const canvasRef = React.useRef<HTMLDivElement | null>(null)
  const [pan, setPan] = React.useState({ x: 0, y: 0 })
  const [panActive, setPanActive] = React.useState(false)
  const idleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      setPan({ x: -nx * PAN.rangePx, y: -ny * PAN.rangePx })

      setPanActive(true)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(
        () => setPanActive(false),
        PAN.willChangeIdleMs
      )
    },
    [prefersReducedMotion]
  )

  const handleMouseLeave = React.useCallback(() => {
    setPan({ x: 0, y: 0 })
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(
      () => setPanActive(false),
      PAN.willChangeIdleMs
    )
  }, [])

  React.useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  /* Arrow-key navigation across the canvas. Triggered only when a card
     button currently has focus — we don't want to steal arrows from
     scroll, modals, or text editing. We compute the spatial neighbor
     in `navigation.ts` and call `.focus()` on the matching button. */
  React.useEffect(() => {
    const root = canvasRef.current
    if (!root) return
    const onKey = (event: KeyboardEvent) => {
      const dir = keyToDirection(event.key)
      if (!dir) return
      const active = document.activeElement as HTMLElement | null
      if (!active || !root.contains(active)) return

      const fromId = active.dataset.lensId ?? null
      // active is the center card if it has no data-lens-id but is a
      // card; treat it as the canvas center.
      const next = neighborInDirection(fromId, dir)
      if (!next) return
      const target = root.querySelector<HTMLElement>(
        `[data-lens-id="${next}"]`
      )
      if (!target) return
      event.preventDefault()
      target.focus()
    }
    root.addEventListener('keydown', onKey)
    return () => root.removeEventListener('keydown', onKey)
  }, [])

  const cardsStyle: React.CSSProperties = {
    ['--pan-x' as string]: `${pan.x.toFixed(2)}px`,
    ['--pan-y' as string]: `${pan.y.toFixed(2)}px`
  }

  return (
    <div
      ref={canvasRef}
      className={`${styles.canvas} ${stage >= STAGE.canvas ? styles.canvasVisible : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <BackgroundField />

      <div
        className={`${styles.cards} ${panActive ? styles.cardsPanning : ''}`}
        style={cardsStyle}
      >
        {LENSES.map((lens) => (
          <LensCard
            key={lens.id}
            lens={lens}
            stage={stage}
            onOpen={() => onOpenLens(lens.id)}
          />
        ))}

        <CenterCard stage={stage} onOpen={onOpenCenter} />
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
