import * as React from 'react'

/* ─────────────────────────────────────────────────────────
 * Animation storyboard
 *
 *    0ms   canvas fades in
 *  120ms   center "Lenses" card scales 0.9 → 1
 *  220ms   surrounding lens cards stagger in (35ms apart)
 *
 *  Side panel: slides in from right, 340ms
 *  Center dialog: scale 0.96 → 1 + fade, 280ms
 *  In-panel lens swap: cross-fade body 220ms; hero color 280ms
 * ───────────────────────────────────────────────────────── */
export const TIMING = {
  centerIn: 120,
  cardsIn: 220
}

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
