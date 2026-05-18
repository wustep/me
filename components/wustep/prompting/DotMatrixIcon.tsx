'use client'

import { useEffect, useId, useState } from 'react'

/**
 * DotMatrixIcon — a 5×5 dot-matrix animation used as the "Thinking"
 * indicator in the prompting intro. Patterns are adapted from
 * https://github.com/icantcodefyi/dot-matrix-animations (MIT). We
 * keep just the five patterns that read well at the AI-thinking
 * moment, and a random one is selected per mount.
 */

const GRID = 5
const PAD = 6
const SPACING = 11
const VIEWBOX = PAD * 2 + SPACING * (GRID - 1) // 50
const DOT_R_BASE = 2.4
const DOT_R_LIT = 3.1
const CENTER = (GRID - 1) / 2

const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)'

const BREATH_KF =
  '0%{opacity:0.05;}20%{opacity:1;}55%{opacity:0.18;}100%{opacity:0.05;}'
const BLOOM_KF =
  '0%{opacity:0;}10%{opacity:1;}55%{opacity:0.85;}100%{opacity:0;}'
const LATTICE_KF =
  '0%{opacity:0.08;}30%{opacity:0.85;}60%{opacity:0.12;}100%{opacity:0.08;}'
const FILL_KF =
  '0%{opacity:0.08;}14%{opacity:1;}72%{opacity:0.95;}100%{opacity:0.08;}'
const PULSE_KF =
  '0%{opacity:0;}8%{opacity:1;}36%{opacity:0.05;}100%{opacity:0;}'

type Pattern = {
  slug: string
  title: string
  durationMs: number
  easing: string
  keyframes: string
  delay: (col: number, row: number) => number
}

const PATTERNS: ReadonlyArray<Pattern> = [
  {
    slug: 'wave',
    title: 'Wave',
    durationMs: 2400,
    easing: EASE_IN_OUT,
    keyframes: BREATH_KF,
    delay: (col, row) => col / 5 + row * 0.02
  },
  {
    slug: 'diamond',
    title: 'Diamond',
    durationMs: 2200,
    easing: EASE_OUT_EXPO,
    keyframes: BLOOM_KF,
    delay: (col, row) => (Math.abs(col - CENTER) + Math.abs(row - CENTER)) / 12
  },
  {
    slug: 'lattice',
    title: 'Lattice',
    durationMs: 2400,
    easing: EASE_IN_OUT,
    keyframes: LATTICE_KF,
    delay: (col, row) => ((col + row) % 2 === 0 ? 0 : 0.5)
  },
  {
    slug: 'compile',
    title: 'Compile',
    durationMs: 2400,
    easing: EASE_IN_OUT,
    keyframes: FILL_KF,
    delay: (col, row) => col * 0.04 + (GRID - 1 - row) * 0.1
  },
  {
    slug: 'mesh',
    title: 'Mesh',
    durationMs: 2400,
    easing: 'linear',
    keyframes: PULSE_KF,
    delay: (col, row) => {
      if (row === CENTER) return col / 8
      if (col === CENTER) return 0.5 + row / 8
      return -1
    }
  }
]

function dotPosition(col: number, row: number): [number, number] {
  return [PAD + col * SPACING, PAD + row * SPACING]
}

export function DotMatrixIcon({ className }: { className?: string }) {
  const rawId = useId()
  // Pick a random pattern once per mount. Defer to a client effect so
  // SSR and first client render agree on index 0 — otherwise we'd
  // hydration-mismatch on Math.random().
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    setIdx(Math.floor(Math.random() * PATTERNS.length))
  }, [])
  const pattern = PATTERNS[idx]!
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
