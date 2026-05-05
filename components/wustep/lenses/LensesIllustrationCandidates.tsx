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
    id: 'expertise-bow',
    lensId: 'expertise',
    label: 'Bow',
    notes: 'A longbow releases a single accent arrow from a steady draw.',
    render: ({ fg, accent }) => (
      <svg {...SVG_BASE} aria-hidden='true' data-anim='candidate-expertise-bow'>
        <path
          d='M 62 18 Q 76 50 62 82'
          fill='none'
          stroke={fg}
          strokeWidth='2.6'
          strokeLinecap='round'
          opacity='0.78'
        />
        <circle cx='62' cy='18' r='1.6' fill={fg} opacity='0.78' />
        <circle cx='62' cy='82' r='1.6' fill={fg} opacity='0.78' />
        <line
          x1='69'
          y1='44'
          x2='69'
          y2='56'
          stroke={fg}
          strokeWidth='3.2'
          strokeLinecap='round'
          opacity='0.55'
        />
        <line
          x1='42'
          y1='50'
          x2='88'
          y2='50'
          stroke={fg}
          strokeWidth='0.8'
          opacity='0.22'
          strokeDasharray='2 3'
        />
        <g data-anim-target='string'>
          <path
            d='M 62 18 L 38 50 L 62 82'
            fill='none'
            stroke={fg}
            strokeWidth='1'
            strokeLinecap='round'
            opacity='0.75'
          />
        </g>
        <g data-anim-target='arrow'>
          <line
            x1='38'
            y1='50'
            x2='72'
            y2='50'
            stroke={accent}
            strokeWidth='2.4'
            strokeLinecap='round'
          />
          <polygon points='80,50 70,45 70,55' fill={accent} />
          <polygon points='38,50 31,46 31,50' fill={accent} opacity='0.85' />
          <polygon points='38,50 31,54 31,50' fill={accent} opacity='0.85' />
        </g>
      </svg>
    )
  },
  {
    id: 'expertise-depth-gauge',
    lensId: 'expertise',
    label: 'Depth Gauge',
    notes: 'A measuring probe settles on one exact mark.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-depth-gauge'
      >
        <rect
          x='22'
          y='20'
          width='56'
          height='62'
          rx='6'
          fill={fg}
          opacity='0.12'
        />
        <path
          d='M 34 24 V 78'
          fill='none'
          stroke={fg}
          strokeWidth='1.4'
          strokeLinecap='round'
          opacity='0.62'
        />
        <g stroke={fg} strokeLinecap='round' opacity='0.56'>
          <line x1='34' y1='30' x2='48' y2='30' strokeWidth='1.2' />
          <line x1='34' y1='40' x2='44' y2='40' strokeWidth='1' />
          <line x1='34' y1='50' x2='48' y2='50' strokeWidth='1.2' />
          <line x1='34' y1='60' x2='44' y2='60' strokeWidth='1' />
          <line x1='34' y1='70' x2='48' y2='70' strokeWidth='1.2' />
        </g>
        <g data-anim-target='probe'>
          <line
            x1='62'
            y1='24'
            x2='62'
            y2='50'
            stroke={fg}
            strokeWidth='2.2'
            strokeLinecap='round'
          />
          <polygon points='62,58 56,48 68,48' fill={accent} />
        </g>
        <g data-anim-target='target' style={{ transformOrigin: '34px 50px' }}>
          <line
            x1='28'
            y1='50'
            x2='74'
            y2='50'
            stroke={accent}
            strokeWidth='2'
            strokeLinecap='round'
            opacity='0.9'
          />
          <circle cx='34' cy='50' r='3.2' fill={accent} />
        </g>
      </svg>
    )
  },
  {
    id: 'expertise-score',
    lensId: 'expertise',
    label: 'Mastery Score',
    notes: 'Notes climb a staff; a playhead lights each one in turn.',
    render: ({ fg, accent }) => {
      const STAFF_TOP = 36
      const STAFF_GAP = 6
      const STAFF_X1 = 12
      const STAFF_X2 = 88
      const lines = [0, 1, 2, 3, 4].map((i) => STAFF_TOP + i * STAFF_GAP)
      // Notes climb from bottom-left to top-right across the staff.
      const notes = [
        { x: 22, y: 60, target: 'note-1' },
        { x: 36, y: 54, target: 'note-2' },
        { x: 50, y: 48, target: 'note-3' },
        { x: 64, y: 42, target: 'note-4' }
      ] as const
      const finale = { x: 78, y: 30 }

      return (
        <svg
          {...SVG_BASE}
          aria-hidden='true'
          data-anim='candidate-expertise-score'
        >
          {/* Staff — five horizontal lines. */}
          <g stroke={fg} strokeWidth='0.8' opacity='0.45'>
            {lines.map((y) => (
              <line
                key={`staff-${y}`}
                x1={STAFF_X1}
                y1={y}
                x2={STAFF_X2}
                y2={y}
              />
            ))}
          </g>
          {/* Bar lines at each end — quietly cap the staff. */}
          <line
            x1={STAFF_X1}
            y1={STAFF_TOP}
            x2={STAFF_X1}
            y2={STAFF_TOP + 4 * STAFF_GAP}
            stroke={fg}
            strokeWidth='1'
            opacity='0.55'
          />
          <line
            x1={STAFF_X2}
            y1={STAFF_TOP}
            x2={STAFF_X2}
            y2={STAFF_TOP + 4 * STAFF_GAP}
            stroke={fg}
            strokeWidth='1'
            opacity='0.55'
          />

          {/* Climbing notes — fg ovals on short stems. Each is its own
              animation target so they can light in sequence. Drawn
              slightly tilted so they read as quarter notes. */}
          {notes.map((n) => (
            <g key={n.target} data-anim-target={n.target}>
              <ellipse
                cx={n.x}
                cy={n.y}
                rx='3.2'
                ry='2.4'
                fill={fg}
                opacity='0.78'
                transform={`rotate(-18 ${n.x} ${n.y})`}
              />
              <line
                x1={n.x + 3}
                y1={n.y - 0.4}
                x2={n.x + 3}
                y2={n.y - 14}
                stroke={fg}
                strokeWidth='1'
                opacity='0.78'
                strokeLinecap='round'
              />
            </g>
          ))}

          <g data-anim-target='finale'>
            <ellipse
              cx={finale.x}
              cy={finale.y}
              rx='3.6'
              ry='2.8'
              fill={accent}
              transform={`rotate(-18 ${finale.x} ${finale.y})`}
            />
            <line
              x1={finale.x + 3.4}
              y1={finale.y - 0.4}
              x2={finale.x + 3.4}
              y2={finale.y - 16}
              stroke={accent}
              strokeWidth='1.4'
              strokeLinecap='round'
            />
          </g>

          {/* Playhead — a thin vertical line that sweeps the staff
              left-to-right, lighting each note as it passes. */}
          <line
            x1={STAFF_X1}
            y1={STAFF_TOP - 4}
            x2={STAFF_X1}
            y2={STAFF_TOP + 4 * STAFF_GAP + 4}
            stroke={accent}
            strokeWidth='1'
            opacity='0.7'
            data-anim-target='playhead'
          />
        </svg>
      )
    }
  },
  {
    id: 'expertise-belt-knot',
    lensId: 'expertise',
    label: 'Belt Knot',
    notes: 'Two belt ends cinch into a single clean knot.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-belt-knot'
      >
        <g fill={fg} opacity='0.64'>
          <rect
            x='14'
            y='45'
            width='31'
            height='10'
            rx='2'
            data-anim-target='left-tail'
          />
          <rect
            x='55'
            y='45'
            width='31'
            height='10'
            rx='2'
            data-anim-target='right-tail'
          />
        </g>
        <g data-anim-target='knot' style={{ transformOrigin: '50px 50px' }}>
          <rect
            x='38'
            y='38'
            width='24'
            height='24'
            rx='4'
            fill={accent}
            transform='rotate(45 50 50)'
          />
          <path
            d='M 42 50 H 58'
            stroke={fg}
            strokeWidth='1.4'
            strokeLinecap='round'
            opacity='0.45'
          />
        </g>
        <g
          data-anim-target='cinch'
          stroke={accent}
          strokeLinecap='round'
          style={{ transformOrigin: '50px 50px' }}
        >
          <line x1='37' y1='38' x2='43' y2='44' strokeWidth='1.5' />
          <line x1='63' y1='38' x2='57' y2='44' strokeWidth='1.5' />
          <line x1='37' y1='62' x2='43' y2='56' strokeWidth='1.5' />
          <line x1='63' y1='62' x2='57' y2='56' strokeWidth='1.5' />
        </g>
      </svg>
    )
  }
]
