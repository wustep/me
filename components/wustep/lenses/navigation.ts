import { LENSES } from './registry'

/* ────────────────────────────────────────────────────────────────
 * Arrow-key navigation across the canvas of lenses.
 *
 *   Each lens has a normalized (x, y) on the canvas. Given a "from"
 *   lens (or pseudo-anchor) and a direction, we find the closest
 *   lens whose center sits in the half-plane that direction points
 *   to. We weight the perpendicular axis 2× harder than the
 *   parallel axis so cards in the *same row/column* are preferred,
 *   matching the user's visual expectation that ← steps to the next
 *   card on the same row, not a diagonal one.
 *
 *   Used by both the canvas (focus the next card button) and the
 *   side panel (swap to the next lens).
 * ──────────────────────────────────────────────────────────────── */

export type Direction = 'left' | 'right' | 'up' | 'down'

type Anchor = { x: number; y: number }

/** Center of the "Lenses" card on the canvas. */
const CENTER_ANCHOR: Anchor = { x: 50, y: 50 }

const PERP_WEIGHT = 2

/**
 * Find the spatial neighbor of `fromId` in the given direction.
 * Returns the neighbor lens id, or `null` if nothing lies in that
 * half-plane (e.g. asked for "left" from the leftmost lens).
 *
 * If `fromId` is null, navigation starts from the canvas center —
 * this is what canvas-arrow-with-no-focus uses to seed a sensible
 * first hop.
 */
export function neighborInDirection(
  fromId: string | null,
  direction: Direction
): string | null {
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

    switch (direction) {
      case 'left':
        if (dx >= 0) continue
        parallel = -dx
        perp = Math.abs(dy)
        break
      case 'right':
        if (dx <= 0) continue
        parallel = dx
        perp = Math.abs(dy)
        break
      case 'up':
        if (dy >= 0) continue
        parallel = -dy
        perp = Math.abs(dx)
        break
      case 'down':
        if (dy <= 0) continue
        parallel = dy
        perp = Math.abs(dx)
        break
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
