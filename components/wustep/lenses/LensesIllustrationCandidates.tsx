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
    notes:
      'A longbow at full draw releases a single accent arrow toward its line.',
    render: ({ fg, accent }) => (
      <svg {...SVG_BASE} aria-hidden='true' data-anim='candidate-expertise-bow'>
        <path
          d='M 64 18 Q 78 50 64 82'
          fill='none'
          stroke={fg}
          strokeWidth='2.4'
          strokeLinecap='round'
          opacity='0.78'
        />
        <circle cx='64' cy='18' r='1.6' fill={fg} opacity='0.78' />
        <circle cx='64' cy='82' r='1.6' fill={fg} opacity='0.78' />
        <line
          x1='72'
          y1='44'
          x2='72'
          y2='56'
          stroke={fg}
          strokeWidth='3.6'
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
            d='M 64 18 L 46 50 L 64 82'
            fill='none'
            stroke={fg}
            strokeWidth='1'
            strokeLinecap='round'
            opacity='0.75'
          />
        </g>
        <g data-anim-target='arrow'>
          <line
            x1='30'
            y1='50'
            x2='70'
            y2='50'
            stroke={accent}
            strokeWidth='2.4'
            strokeLinecap='round'
          />
          <polygon points='78,50 68,45 68,55' fill={accent} />
          <polygon points='30,50 24,46 24,50' fill={accent} opacity='0.85' />
          <polygon points='30,50 24,54 24,50' fill={accent} opacity='0.85' />
        </g>
      </svg>
    )
  },
  {
    /* Drawing the arrow — expertise as the single clean line a master
       lays down in three confident strokes: shaft, upper barb, lower
       barb. The animation literally draws the arrow on, then holds it
       a beat before resetting. The static read is a finished arrow,
       so the candidate works even with motion off. */
    id: 'expertise-drawn-arrow',
    lensId: 'expertise',
    label: 'Drawn Arrow',
    notes: 'A master draws a clean accent arrow in three confident strokes.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-drawn-arrow'
      >
        {/* Faint guide line — the apprentice's wobbly attempt the
            master is tracing over. Sits behind the accent arrow so the
            "expertise" reads as the clean overlay, not the rough draft. */}
        <path
          d='M 18 78 Q 32 70 44 60 Q 58 48 70 36 Q 76 30 80 26'
          fill='none'
          stroke={fg}
          strokeWidth='1'
          strokeLinecap='round'
          opacity='0.28'
          strokeDasharray='2 3'
        />
        {/* Tiny start mark — where the stroke begins. */}
        <circle cx='20' cy='76' r='1.6' fill={fg} opacity='0.45' />

        {/* The shaft — one long diagonal stroke. Drawn first. We use a
            stroke-dasharray trick at the CSS layer so the shaft draws
            from start to end. The path length here is ~78 units, which
            the keyframe targets via a generous dasharray. */}
        <path
          d='M 20 76 L 76 28'
          fill='none'
          stroke={accent}
          strokeWidth='3'
          strokeLinecap='round'
          data-anim-target='shaft'
          pathLength='100'
        />
        {/* Upper barb — second stroke of the arrowhead. */}
        <path
          d='M 76 28 L 64 30'
          fill='none'
          stroke={accent}
          strokeWidth='3'
          strokeLinecap='round'
          data-anim-target='barb-up'
          pathLength='100'
        />
        {/* Lower barb — third stroke of the arrowhead. */}
        <path
          d='M 76 28 L 74 40'
          fill='none'
          stroke={accent}
          strokeWidth='3'
          strokeLinecap='round'
          data-anim-target='barb-down'
          pathLength='100'
        />
      </svg>
    )
  },
  {
    /* Mastery score — five notes climbing a musical staff, the final
       note an accent fermata held above. Expertise is reading and
       writing in a notation that the untrained eye treats as decoration.
       A playhead sweeps the staff; each note lights as it's struck. */
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
      // The final accent note sits above the staff with a fermata —
      // the held mastery beat the rest of the line builds toward.
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

          {/* Finale — accent note with a fermata curve above. The held
              moment of mastery the score has been climbing toward. */}
          <g data-anim-target='finale'>
            {/* Fermata arc + dot — the symbol for "hold this note". */}
            <path
              d={`M ${finale.x - 6} ${finale.y - 8} Q ${finale.x} ${finale.y - 14} ${finale.x + 6} ${finale.y - 8}`}
              fill='none'
              stroke={accent}
              strokeWidth='1.2'
              strokeLinecap='round'
              opacity='0.85'
            />
            <circle cx={finale.x} cy={finale.y - 10} r='1' fill={accent} />
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
    notes: 'A belt knot cinches cleanly: rank earned through repeated tying.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-belt-knot'
      >
        <g data-anim-target='left-tail'>
          <rect
            x='10'
            y='45'
            width='36'
            height='10'
            rx='2'
            fill={fg}
            opacity='0.72'
          />
          <path
            d='M 42 54 C 36 62 35 72 39 84'
            fill='none'
            stroke={fg}
            strokeWidth='8'
            strokeLinecap='round'
            opacity='0.58'
          />
        </g>
        <g data-anim-target='right-tail'>
          <rect
            x='54'
            y='45'
            width='36'
            height='10'
            rx='2'
            fill={fg}
            opacity='0.72'
          />
          <path
            d='M 58 54 C 66 62 67 72 61 84'
            fill='none'
            stroke={fg}
            strokeWidth='8'
            strokeLinecap='round'
            opacity='0.5'
          />
        </g>
        <g data-anim-target='knot' style={{ transformOrigin: '50px 50px' }}>
          <rect
            x='40'
            y='40'
            width='20'
            height='20'
            rx='3'
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
          <path
            d='M 50 42 V 58'
            stroke={fg}
            strokeWidth='1'
            strokeLinecap='round'
            opacity='0.28'
          />
        </g>
        <g
          data-anim-target='cinch'
          stroke={accent}
          strokeLinecap='round'
          style={{ transformOrigin: '50px 50px' }}
        >
          <line x1='34' y1='39' x2='42' y2='44' strokeWidth='1.4' />
          <line x1='66' y1='39' x2='58' y2='44' strokeWidth='1.4' />
          <line x1='34' y1='61' x2='42' y2='56' strokeWidth='1.4' />
          <line x1='66' y1='61' x2='58' y2='56' strokeWidth='1.4' />
        </g>
      </svg>
    )
  }
]
