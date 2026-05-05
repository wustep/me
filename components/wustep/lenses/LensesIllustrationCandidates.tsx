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
    notes: 'A longbow draws back and releases a single accent arrow.',
    render: ({ fg, accent }) => (
      <svg {...SVG_BASE} aria-hidden='true' data-anim='candidate-expertise-bow'>
        <g transform='translate(-22 0)'>
          <path
            d='M 62 18 Q 94 50 62 82'
            fill='none'
            stroke={fg}
            strokeWidth='2.6'
            strokeLinecap='round'
            opacity='0.78'
          />
          <line
            x1='62'
            y1='15.5'
            x2='62'
            y2='20.5'
            stroke={fg}
            strokeWidth='4'
            strokeLinecap='round'
            opacity='0.78'
          />
          <line
            x1='62'
            y1='79.5'
            x2='62'
            y2='84.5'
            stroke={fg}
            strokeWidth='4'
            strokeLinecap='round'
            opacity='0.78'
          />
          <path
            d='M 62 18 L 62 50 L 62 82'
            fill='none'
            stroke={fg}
            strokeWidth='1'
            strokeLinecap='round'
            strokeLinejoin='round'
            opacity='0.75'
            data-anim-target='string'
          />
          <g data-anim-target='arrow'>
            <line
              x1='64'
              y1='50'
              x2='99'
              y2='50'
              stroke={accent}
              strokeWidth='2.4'
              strokeLinecap='round'
            />
            <polygon points='107,50 97,45 97,55' fill={accent} />
          </g>
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

export const LENSES_DECK_ILLUSTRATION_CANDIDATES: IllustrationCandidate[] = [
  {
    id: 'lenses-deck-stack',
    lensId: 'lenses-deck',
    label: 'Lens Stack',
    notes: 'Three glass discs slide into one shared optical axis.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-lenses-deck-stack'
      >
        <line
          x1='50'
          y1='14'
          x2='50'
          y2='86'
          stroke={fg}
          strokeWidth='0.8'
          opacity='0.28'
        />
        {[
          { cy: 28, target: 'disc-1', opacity: 0.72 },
          { cy: 50, target: 'disc-2', opacity: 0.9 },
          { cy: 72, target: 'disc-3', opacity: 0.72 }
        ].map((disc) => (
          <g
            key={disc.target}
            data-anim-target={disc.target}
            style={{ transformOrigin: `50px ${disc.cy}px` }}
          >
            <ellipse
              cx='50'
              cy={disc.cy}
              rx='29'
              ry='7'
              fill={disc.target === 'disc-2' ? accent : fg}
              opacity={disc.opacity}
            />
            <ellipse
              cx='50'
              cy={disc.cy}
              rx='29'
              ry='7'
              fill='none'
              stroke={fg}
              strokeWidth='1'
              opacity='0.54'
            />
            <ellipse
              cx='41'
              cy={disc.cy - 2}
              rx='6'
              ry='1.1'
              fill={fg}
              opacity='0.22'
            />
          </g>
        ))}
      </svg>
    )
  },
  {
    id: 'lenses-deck-aperture',
    lensId: 'lenses-deck',
    label: 'Aperture',
    notes: 'An aperture tightens around the view until it snaps into focus.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-lenses-deck-aperture'
      >
        <circle
          cx='50'
          cy='50'
          r='31'
          fill='none'
          stroke={fg}
          strokeWidth='1.2'
          opacity='0.34'
        />
        <g data-anim-target='iris' style={{ transformOrigin: '50px 50px' }}>
          {Array.from({ length: 6 }, (_, index) => (
            <path
              key={index}
              d='M 50 22 L 62 48 L 50 56 L 38 48 Z'
              fill={fg}
              opacity='0.22'
              transform={`rotate(${index * 60} 50 50)`}
            />
          ))}
        </g>
        <g data-anim-target='focus' style={{ transformOrigin: '50px 50px' }}>
          <circle cx='50' cy='50' r='9' fill={accent} opacity='0.2' />
          <circle cx='50' cy='50' r='4' fill={accent} />
        </g>
      </svg>
    )
  },
  {
    id: 'lenses-deck-contact-sheet',
    lensId: 'lenses-deck',
    label: 'Contact Sheet',
    notes: 'A sheet of possible lenses highlights one chosen frame.',
    render: ({ fg, accent }) => {
      const cells = [
        [22, 28],
        [40, 28],
        [58, 28],
        [76, 28],
        [22, 50],
        [40, 50],
        [58, 50],
        [76, 50],
        [22, 72],
        [40, 72],
        [58, 72],
        [76, 72]
      ] as const

      return (
        <svg
          {...SVG_BASE}
          aria-hidden='true'
          data-anim='candidate-lenses-deck-contact-sheet'
        >
          {cells.map(([x, y], index) => (
            <rect
              key={`${x}-${y}`}
              x={x - 6}
              y={y - 8}
              width='12'
              height='16'
              rx='2'
              fill={fg}
              opacity={index === 6 ? 0.2 : 0.12}
            />
          ))}
          <g data-anim-target='active' style={{ transformOrigin: '58px 50px' }}>
            <rect
              x='50'
              y='40'
              width='16'
              height='20'
              rx='3'
              fill='none'
              stroke={accent}
              strokeWidth='2'
            />
            <circle cx='58' cy='50' r='3.2' fill={accent} />
          </g>
          <line
            x1='16'
            y1='86'
            x2='84'
            y2='86'
            stroke={fg}
            strokeWidth='1'
            strokeLinecap='round'
            opacity='0.28'
          />
        </svg>
      )
    }
  },
  {
    id: 'lenses-deck-prism',
    lensId: 'lenses-deck',
    label: 'Prism Split',
    notes: 'One incoming view refracts into several useful ways of seeing.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-lenses-deck-prism'
      >
        <line
          x1='12'
          y1='50'
          x2='39'
          y2='50'
          stroke={fg}
          strokeWidth='2.2'
          strokeLinecap='round'
          opacity='0.58'
        />
        <path d='M 42 24 L 68 50 L 42 76 Z' fill={fg} opacity='0.14' />
        <path
          d='M 42 24 L 68 50 L 42 76 Z'
          fill='none'
          stroke={fg}
          strokeWidth='1.4'
          strokeLinejoin='round'
          opacity='0.52'
        />
        <g data-anim-target='split'>
          <line
            x1='68'
            y1='50'
            x2='88'
            y2='32'
            stroke={accent}
            strokeWidth='2'
            strokeLinecap='round'
          />
          <line
            x1='68'
            y1='50'
            x2='91'
            y2='50'
            stroke={fg}
            strokeWidth='1.7'
            strokeLinecap='round'
            opacity='0.78'
          />
          <line
            x1='68'
            y1='50'
            x2='88'
            y2='68'
            stroke={accent}
            strokeWidth='2'
            strokeLinecap='round'
            opacity='0.72'
          />
        </g>
      </svg>
    )
  },
  {
    id: 'lenses-deck-overlap',
    lensId: 'lenses-deck',
    label: 'Overlap',
    notes: 'Several lenses overlap to reveal the shared center.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-lenses-deck-overlap'
      >
        <g fill='none' stroke={fg} strokeWidth='2' opacity='0.58'>
          <circle data-anim-target='left' cx='38' cy='50' r='20' />
          <circle data-anim-target='right' cx='62' cy='50' r='20' />
          <circle data-anim-target='top' cx='50' cy='38' r='20' />
        </g>
        <g data-anim-target='center' style={{ transformOrigin: '50px 50px' }}>
          <circle cx='50' cy='50' r='8' fill={accent} opacity='0.24' />
          <circle cx='50' cy='50' r='3.6' fill={accent} />
        </g>
      </svg>
    )
  },
  {
    id: 'lenses-deck-viewfinder',
    lensId: 'lenses-deck',
    label: 'Viewfinder',
    notes: 'A focus frame locks onto one point of view.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-lenses-deck-viewfinder'
      >
        <g
          data-anim-target='frame'
          stroke={fg}
          strokeWidth='2'
          strokeLinecap='round'
          opacity='0.72'
        >
          <path d='M 24 40 V 24 H 40' fill='none' />
          <path d='M 60 24 H 76 V 40' fill='none' />
          <path d='M 76 60 V 76 H 60' fill='none' />
          <path d='M 40 76 H 24 V 60' fill='none' />
        </g>
        <g data-anim-target='focus' style={{ transformOrigin: '50px 50px' }}>
          <line
            x1='34'
            y1='50'
            x2='66'
            y2='50'
            stroke={accent}
            strokeWidth='1.6'
            strokeLinecap='round'
          />
          <line
            x1='50'
            y1='34'
            x2='50'
            y2='66'
            stroke={accent}
            strokeWidth='1.6'
            strokeLinecap='round'
          />
          <circle cx='50' cy='50' r='4' fill={accent} />
        </g>
      </svg>
    )
  }
]

export const LAB_ILLUSTRATION_CANDIDATES = [
  ...EXPERTISE_ILLUSTRATION_CANDIDATES,
  ...LENSES_DECK_ILLUSTRATION_CANDIDATES
]
