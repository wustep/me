'use client'

import { useId } from 'react'

/**
 * DotMatrixIcon — a 5×5 dot-matrix animation used as the "Thinking"
 * indicator in the prompting intro. Adapted from
 * https://github.com/icantcodefyi/dot-matrix-animations (MIT). A single
 * "bloom" pattern: dots light up from the center outward, so it starts
 * as a "+" and grows into a filled diamond.
 */

const GRID = 5
const PAD = 6
const SPACING = 11
const VIEWBOX = PAD * 2 + SPACING * (GRID - 1) // 50
const DOT_R_BASE = 2.4
const DOT_R_LIT = 3.1
const CENTER = (GRID - 1) / 2

const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'
const BLOOM_KF =
  '0%{opacity:0;}10%{opacity:1;}55%{opacity:0.85;}100%{opacity:0;}'

type Pattern = {
  slug: string
  title: string
  durationMs: number
  easing: string
  keyframes: string
  delay: (col: number, row: number) => number
}

const PATTERN: Pattern = {
  slug: 'diamond',
  title: 'Diamond',
  durationMs: 1500,
  easing: EASE_OUT_EXPO,
  keyframes: BLOOM_KF,
  delay: (col, row) => (Math.abs(col - CENTER) + Math.abs(row - CENTER)) / 12
}

function dotPosition(col: number, row: number): [number, number] {
  return [PAD + col * SPACING, PAD + row * SPACING]
}

/**
 * The time the pattern needs to finish one full cycle: its base duration
 * plus the largest per-dot start delay. The intro reveal waits this long
 * so the matrix completes a clean loop before the title takes over
 * (rather than getting cut off mid-bloom). Kept comfortably under 3s by
 * the duration above.
 */
function patternCycleMs(pattern: Pattern): number {
  let maxDelay = 0
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const delay = pattern.delay(col, row)
      if (delay > maxDelay) maxDelay = delay
    }
  }
  return Math.round(pattern.durationMs * (1 + maxDelay))
}

export const DOT_MATRIX_MAX_CYCLE_MS = patternCycleMs(PATTERN)

export function DotMatrixIcon({ className }: { className?: string }) {
  const rawId = useId()
  const pattern = PATTERN
  const id = `dm-${rawId.replaceAll(/[:]/g, '')}-${pattern.slug}`

  const styleSheet = `
    .${id}-bg { fill: currentColor; opacity: 0.12; }
    .${id}-lit { fill: currentColor; opacity: 0; animation: ${id}-kf ${pattern.durationMs}ms ${pattern.easing} infinite both; }
    @keyframes ${id}-kf {${pattern.keyframes}}
    @media (prefers-reduced-motion: reduce) {
      .${id}-lit { animation: none; opacity: 0.45; }
    }
  `

  const dots: React.ReactNode[] = []
  const litDots: React.ReactNode[] = []
  const cellRules: string[] = []

  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const [cx, cy] = dotPosition(col, row)
      dots.push(
        <circle
          key={`bg-${row}-${col}`}
          className={`${id}-bg`}
          cx={cx}
          cy={cy}
          r={DOT_R_BASE}
        />
      )
      const delay = pattern.delay(col, row)
      if (delay < 0) continue
      const delayMs = Math.round(delay * pattern.durationMs)
      const dotClass = `${id}-d${row}${col}`
      cellRules.push(`.${dotClass} { animation-delay: ${delayMs}ms; }`)
      litDots.push(
        <circle
          key={`lit-${row}-${col}`}
          className={`${id}-lit ${dotClass}`}
          cx={cx}
          cy={cy}
          r={DOT_R_LIT}
        />
      )
    }
  }

  return (
    <svg
      className={className}
      role='img'
      aria-label={`Thinking — ${pattern.title}`}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
    >
      <style>{styleSheet + cellRules.join('\n')}</style>
      {dots}
      {litDots}
    </svg>
  )
}
