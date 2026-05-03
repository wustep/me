import type * as React from 'react'

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD — Lenses
 *
 * Read top-to-bottom. Each `at` is ms after the page mounts.
 *
 *    0ms   waiting for mount
 *   60ms   canvas fades in (opacity 0 → 1)
 *  180ms   center "Lenses" card scales 0.9 → 1 (ease-spring)
 *  280ms   surrounding cards begin staggering in:
 *            • by row (top → bottom), 90ms per row
 *            • inside each row, 22ms per column
 *            • full reveal wraps in ~640ms
 *
 * ── User interactions ─────────────────────────────────────
 *  hover card        scale 0.92 → 1.13, lift 14px, accent ring
 *  click center      open index dialog (scale 0.96 → 1, 280ms)
 *  click side card   open side panel (slide from right, 340ms)
 *  swap inside panel cross-fade body 220ms; hero color 280ms
 *
 * All timings live in TIMING and DURATION below — no magic
 * numbers in JSX or component bodies.
 * ───────────────────────────────────────────────────────── */
export const TIMING = {
  canvasIn: 60,
  centerIn: 180,
  cardsInBase: 280,
  rowStaggerMs: 90,
  colStaggerMs: 22
} as const

export const DURATION = {
  canvasFade: 700,
  cardEntrance: 600,
  cardTransform: 320,
  panelSlide: 340,
  panelFade: 200,
  dialogScale: 280,
  bodyFade: 220
} as const

/** Spatial constants that the canvas uses to stagger cards by row+col.
 *  Cards' `y` values come from a 4-row grid at 12/38/62/88, and `x`
 *  from an 8-column grid at 6/19/31/44/56/69/81/94 — eight cards
 *  spaced at uniform 12.5% intervals. The deck grew past what six
 *  columns could hold, and the wider canvas leans into the
 *  "looking through many lenses" thesis: the eye picks up two
 *  edge cards on either side, and the rest unfold inward. */
export const GRID = {
  rowAnchors: [12, 38, 62, 88],
  colAnchors: [6.25, 18.75, 31.25, 43.75, 56.25, 68.75, 81.25, 93.75]
} as const

export type IllustrationId =
  | 'great-man'
  | 'evo-psych'
  | 'minimalism'
  | 'utility'
  | 'status'
  | 'incentives'
  | 'game-theory'
  | 'systems'
  | 'headspace'
  | 'legibility'
  | 'narrative'
  | 'constraint'
  | 'interface'
  | 'energy'
  | 'epistemic'
  | 'osmosis'
  | 'probabilistic'
  | 'communication'
  | 'mimetics'
  | 'primitives'
  | 'projection'
  | 'attention'
  | 'dopamine'
  | 'reps'
  | 'agency'
  | 'expertise'
  | 'tempo'
  | 'surface-area'
  | 'lenses-deck'

export type Lens = {
  id: string
  category: string
  title: string
  tagline: string
  /** Card position on the virtual canvas: 0–100 (center of card). */
  x: number
  y: number
  bg: string
  fg: string
  accent?: string
  illustration: IllustrationId
  body: React.ReactNode
  related?: string[]
}

export type LensesPageProps = {
  embedded?: boolean
}

/** Animation stage. A single integer drives the whole entrance — no
 *  scattered booleans. Components check `stage >= N` so stages are
 *  additive. */
export const STAGE = {
  hidden: 0,
  canvas: 1,
  center: 2,
  cards: 3
} as const

export type Stage = (typeof STAGE)[keyof typeof STAGE]
