import { LENSES } from './registry'
import { GRID } from './types'

/* ────────────────────────────────────────────────────────────────
 * Arrow-key navigation across the canvas of lenses.
 *
 *   Two different traversal models:
 *
 *   ← / →  Reading order. Cards are sorted into rows (by quantizing
 *          y to the nearest row anchor) and then by x within a row.
 *          The arrow steps to the next card in that flat sequence
 *          and *wraps* across row ends — like a book. This matches
 *          how people scan a deck and avoids the dead-end feeling
 *          of "← from the leftmost card does nothing."
 *
 *   ↑ / ↓  Spatial neighbor. We pick the closest card in the
 *          half-plane above/below, weighting horizontal distance
 *          2× harder than vertical so the result feels like "the
 *          card directly above/below," not a diagonal jump.
 *
 *   Used by both the canvas (focus the next card button) and the
 *   side panel (swap to the next lens).
 * ──────────────────────────────────────────────────────────────── */

export type Direction = 'left' | 'right' | 'up' | 'down'

type Anchor = { x: number; y: number }

/** Center of the "Lenses" card on the canvas. */
const CENTER_ANCHOR: Anchor = { x: 50, y: 50 }

const PERP_WEIGHT = 2

/** Quantize a y-coordinate to the nearest row anchor index, so two
 *  lenses on the same visual row group together regardless of any
 *  small per-card y jitter. */
function rowOf(y: number): number {
  let bestIdx = 0
  let bestDist = Number.POSITIVE_INFINITY
  for (const [idx, anchor] of GRID.rowAnchors.entries()) {
    const d = Math.abs(y - anchor)
    if (d < bestDist) {
      bestDist = d
      bestIdx = idx
    }
  }
  return bestIdx
}

/** Cards in reading order: row by row, left to right within a row. */
const READING_ORDER: readonly string[] = [...LENSES]
  .sort((a, b) => {
    const ra = rowOf(a.y)
    const rb = rowOf(b.y)
    if (ra !== rb) return ra - rb
    return a.x - b.x
  })
  .map((l) => l.id)

/**
 * Find the next lens to navigate to from `fromId` in `direction`.
 *
 *   - left/right walks `READING_ORDER` and wraps at either end.
 *   - up/down picks the spatial neighbor in that half-plane.
 *
 * If `fromId` is null, navigation starts from the canvas center —
 * which gives the canvas-arrow-with-no-focus case a sensible seed.
 */
export function neighborInDirection(
  fromId: string | null,
  direction: Direction
): string | null {
  // Reading-order traversal for horizontal arrows.
  if (direction === 'left' || direction === 'right') {
    if (READING_ORDER.length === 0) return null

    // From the canvas center (no current selection): seed at the
    // start of reading order for → and the end for ←, so the first
    // keypress always lands on a sensible card.
    if (!fromId) {
      return direction === 'right'
        ? READING_ORDER[0]
        : READING_ORDER[READING_ORDER.length - 1]
    }

    const idx = READING_ORDER.indexOf(fromId)
    if (idx === -1) return READING_ORDER[0]

    const step = direction === 'right' ? 1 : -1
    const nextIdx =
      (idx + step + READING_ORDER.length) % READING_ORDER.length
    return READING_ORDER[nextIdx]
  }

  // Spatial-neighbor traversal for vertical arrows.
  const from: Anchor = fromId
    ? (LENSES.find((l) => l.id === fromId) ?? CENTER_ANCHOR)
    : CENTER_ANCHOR

  let best: { id: string; score: number } | null = null

  for (const lens of LENSES) {
    if (lens.id === fromId) continue

    const dx = lens.x - from.x
    const dy = lens.y - from.y

    let parallel: number
    let perp: number

    if (direction === 'up') {
      if (dy >= 0) continue
      parallel = -dy
      perp = Math.abs(dx)
    } else {
      if (dy <= 0) continue
      parallel = dy
      perp = Math.abs(dx)
    }

    const score = parallel + perp * PERP_WEIGHT

    if (best == null || score < best.score) {
      best = { id: lens.id, score }
    }
  }

  return best?.id ?? null
}

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down'
}

/** Map a keyboard event's `key` to a Direction, or null if irrelevant. */
export function keyToDirection(key: string): Direction | null {
  return KEY_TO_DIRECTION[key] ?? null
}
