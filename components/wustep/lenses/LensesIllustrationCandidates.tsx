import type * as React from 'react'

import type { IllustrationId } from './types'

/**
 * LensesIllustrationCandidates — lab-only illustration sketches.
 *
 *   Each candidate is a self-contained SVG renderer keyed by its
 *   parent lens id (`lensId`). The lab's PreviewCard accepts these
 *   via `renderIllustration`, so candidates can sit alongside the
 *   real production switchboard without touching it.
 *
 *   Animation contract mirrors the production setup:
 *     • Root <svg> carries `data-anim="<id>"` so CSS keyframes
 *       can scope per-candidate. Lab CSS lives in
 *       LensesIllustrationLab.module.css; everything is paused
 *       at rest and only runs while a card is hovered/selected
 *       or playback is forced on.
 *     • Inner elements carry `data-anim-target="<n>"` to flag
 *       which element each keyframe drives.
 *     • Lab CSS already gates these on prefers-reduced-motion.
 */

export type CandidatePalette = {
  bg: string
  fg: string
  accent: string
}

export type IllustrationCandidate = {
  /** Stable id for the candidate, unique within `lensId`. */
  id: string
  /** The production lens this candidate is auditioning for. */
  lensId: IllustrationId
  /** Short human label for the candidate (used in selectors and cards). */
  label: string
  /** One-line note describing the metaphor / animation. */
  notes: string
  /** Render the candidate SVG inside the given palette. */
  render: (palette: CandidatePalette) => React.ReactNode
}

const SVG_BASE: React.SVGProps<SVGSVGElement> = {
  viewBox: '0 0 100 100',
  preserveAspectRatio: 'xMidYMid meet',
  xmlns: 'http://www.w3.org/2000/svg'
}

export const EXPERTISE_ILLUSTRATION_CANDIDATES: IllustrationCandidate[] = [
  {
    id: 'expertise-topography',
    lensId: 'expertise',
    label: 'Topography',
    notes: 'A populated landscape with one precise peak: expertise as terrain.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-topography'
      >
        <path
          d='M 18 70 C 27 54 37 64 45 50 C 54 34 64 39 82 22'
          fill='none'
          stroke={fg}
          strokeWidth='1.5'
          strokeLinecap='round'
          opacity='0.6'
        />
        <g fill='none' stroke={fg} strokeWidth='0.9' opacity='0.3'>
          <path d='M 20 76 C 32 66 39 75 50 64 C 59 55 67 57 82 48' />
          <path d='M 21 62 C 30 53 38 56 46 45 C 56 31 67 34 78 28' />
          <path d='M 33 82 C 45 75 53 78 63 68 C 70 61 78 62 86 56' />
        </g>
        <g fill={fg} opacity='0.55'>
          <circle cx='24' cy='68' r='1.8' />
          <circle cx='34' cy='61' r='1.7' />
          <circle cx='43' cy='53' r='1.9' />
          <circle cx='54' cy='40' r='1.6' />
          <circle cx='66' cy='35' r='1.7' />
        </g>
        <path
          d='M 18 70 C 27 54 37 64 45 50 C 54 34 64 39 82 22'
          fill='none'
          stroke={accent}
          strokeWidth='2'
          strokeLinecap='round'
          strokeDasharray='12 78'
          data-anim-target='trace'
        />
        <g data-anim-target='mark' style={{ transformOrigin: '82px 22px' }}>
          <circle cx='82' cy='22' r='6' fill={accent} opacity='0.2' />
          <circle cx='82' cy='22' r='3.2' fill={accent} />
        </g>
      </svg>
    )
  },
  {
    id: 'expertise-calibration',
    lensId: 'expertise',
    label: 'Calibration',
    notes:
      'Loose attempts tighten into a small target: expertise as precision.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-calibration'
      >
        <g fill='none' stroke={fg} strokeWidth='1' opacity='0.32'>
          <circle cx='62' cy='42' r='26' />
          <circle cx='62' cy='42' r='17' />
          <circle cx='62' cy='42' r='8' />
        </g>
        <g fill={fg} opacity='0.5' data-anim-target='scatter'>
          <circle cx='24' cy='71' r='2' />
          <circle cx='35' cy='56' r='1.8' />
          <circle cx='42' cy='76' r='1.7' />
          <circle cx='54' cy='62' r='1.9' />
          <circle cx='68' cy='58' r='1.7' />
          <circle cx='76' cy='35' r='1.8' />
        </g>
        <path
          d='M 18 82 C 34 64 46 52 58 45'
          fill='none'
          stroke={fg}
          strokeWidth='1.2'
          strokeLinecap='round'
          opacity='0.45'
        />
        <g data-anim-target='lock' style={{ transformOrigin: '62px 42px' }}>
          <circle cx='62' cy='42' r='5.4' fill={accent} opacity='0.24' />
          <path
            d='M 54 42 H 70 M 62 34 V 50'
            stroke={accent}
            strokeWidth='1.8'
            strokeLinecap='round'
          />
          <circle cx='62' cy='42' r='2.4' fill={accent} />
        </g>
      </svg>
    )
  },
  {
    id: 'expertise-compression',
    lensId: 'expertise',
    label: 'Compression',
    notes: 'Many messy inputs collapse into one clean move.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-compression'
      >
        <g
          fill='none'
          stroke={fg}
          strokeWidth='1.2'
          strokeLinecap='round'
          opacity='0.46'
        >
          <path d='M 14 28 C 30 30 35 38 46 47' />
          <path d='M 14 42 C 29 42 37 45 46 49' />
          <path d='M 14 56 C 28 54 36 52 46 51' />
          <path d='M 14 70 C 31 66 37 58 46 53' />
        </g>
        <polygon
          points='50,30 66,50 50,70 34,50'
          fill='none'
          stroke={fg}
          strokeWidth='1.3'
          opacity='0.58'
        />
        <g data-anim-target='core' style={{ transformOrigin: '50px 50px' }}>
          <circle cx='50' cy='50' r='5' fill={accent} opacity='0.24' />
          <circle cx='50' cy='50' r='2.4' fill={accent} />
        </g>
        <g data-anim-target='beam'>
          <line
            x1='58'
            y1='50'
            x2='84'
            y2='50'
            stroke={accent}
            strokeWidth='2.6'
            strokeLinecap='round'
          />
          <polygon points='89,50 80,44 80,56' fill={accent} />
        </g>
      </svg>
    )
  },
  {
    id: 'expertise-deliberate-practice',
    lensId: 'expertise',
    label: 'Deliberate Practice',
    notes: 'A ladder bends into a curve: repeated rungs become fluency.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-deliberate-practice'
      >
        <path
          d='M 24 78 C 32 66 37 58 43 52 C 51 43 61 34 78 24'
          fill='none'
          stroke={fg}
          strokeWidth='1.4'
          strokeLinecap='round'
          opacity='0.55'
        />
        <g stroke={fg} strokeWidth='1.1' strokeLinecap='round' opacity='0.5'>
          <line x1='20' y1='72' x2='31' y2='80' />
          <line x1='28' y1='62' x2='39' y2='71' />
          <line x1='37' y1='53' x2='48' y2='62' />
          <line x1='48' y1='43' x2='58' y2='52' />
          <line x1='61' y1='33' x2='70' y2='43' />
        </g>
        <g fill={fg} opacity='0.42' data-anim-target='rungs'>
          <circle cx='24' cy='78' r='1.9' />
          <circle cx='34' cy='66' r='1.8' />
          <circle cx='44' cy='55' r='1.7' />
          <circle cx='56' cy='42' r='1.6' />
          <circle cx='68' cy='31' r='1.5' />
        </g>
        <g data-anim-target='step' style={{ transformOrigin: '78px 24px' }}>
          <path
            d='M 73 25 L 78 20 L 83 25 L 78 30 Z'
            fill={accent}
            opacity='0.92'
          />
          <circle
            cx='78'
            cy='24'
            r='8'
            fill='none'
            stroke={accent}
            opacity='0.28'
          />
        </g>
      </svg>
    )
  }
]
