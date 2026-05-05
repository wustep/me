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
  },
  {
    /* The bow — a practiced instrument held at full draw. Expertise is
       the steady tension that beginners can't hold: bow arm locked,
       string at anchor, arrow trained on its line. The release is a
       single decisive event. */
    id: 'expertise-bow',
    lensId: 'expertise',
    label: 'Bow',
    notes:
      'A longbow at full draw releases a single accent arrow toward its line.',
    render: ({ fg, accent }) => (
      <svg {...SVG_BASE} aria-hidden='true' data-anim='candidate-expertise-bow'>
        {/* The bow's wooden limb — a tall arc bent into tension. The
            curve runs top to bottom so the limb reads as a vertical
            longbow rather than a recurve or a horizontal shortbow. */}
        <path
          d='M 36 18 Q 22 50 36 82'
          fill='none'
          stroke={fg}
          strokeWidth='2.4'
          strokeLinecap='round'
          opacity='0.78'
        />
        {/* Bow tips — small caps where the string ties on. */}
        <circle cx='36' cy='18' r='1.6' fill={fg} opacity='0.78' />
        <circle cx='36' cy='82' r='1.6' fill={fg} opacity='0.78' />
        {/* Grip — a short thicker band at the bow's center. */}
        <line
          x1='28'
          y1='44'
          x2='28'
          y2='56'
          stroke={fg}
          strokeWidth='3.6'
          strokeLinecap='round'
          opacity='0.55'
        />
        {/* Aim line — a faint horizontal showing the arrow's eventual
            flight, so the silhouette reads as "trained on a target"
            even at rest. */}
        <line
          x1='52'
          y1='50'
          x2='90'
          y2='50'
          stroke={fg}
          strokeWidth='0.8'
          opacity='0.22'
          strokeDasharray='2 3'
        />
        {/* The string — drawn back from both bow tips to the anchor
            point at the arrow's nock. Two segments forming a wedge.
            On release the whole string snaps forward toward the limb. */}
        <g data-anim-target='string'>
          <path
            d='M 36 18 L 52 50 L 36 82'
            fill='none'
            stroke={fg}
            strokeWidth='1'
            strokeLinecap='round'
            opacity='0.75'
          />
        </g>
        {/* The nocked arrow — accent shaft + head, held at the anchor
            and aimed along the aim line. On release it shoots forward
            then resets to the next draw. */}
        <g data-anim-target='arrow'>
          <line
            x1='44'
            y1='50'
            x2='66'
            y2='50'
            stroke={accent}
            strokeWidth='2.4'
            strokeLinecap='round'
          />
          <polygon points='72,50 62,45 62,55' fill={accent} />
          {/* Fletching at the nock — two tiny triangles. */}
          <polygon points='44,50 40,46 40,50' fill={accent} opacity='0.85' />
          <polygon points='44,50 40,54 40,50' fill={accent} opacity='0.85' />
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
    /* Whetstone — a blade honed against a stone. Expertise is the
       edge that emerges from steady, repeated contact with the right
       abrasive. The blade slides across the stone; tiny sparks brighten
       at the contact point. Both elements read at rest as a finished
       composition: blade resting on stone. */
    id: 'expertise-whetstone',
    lensId: 'expertise',
    label: 'Whetstone',
    notes: 'A blade hones against a stone; sparks flare at the edge.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-whetstone'
      >
        {/* The whetstone — a long, low slab. Slightly darker rim along
            the top so the eye reads "stone surface" rather than "bar". */}
        <rect
          x='14'
          y='62'
          width='72'
          height='14'
          rx='2'
          fill={fg}
          opacity='0.38'
        />
        <line
          x1='14'
          y1='62'
          x2='86'
          y2='62'
          stroke={fg}
          strokeWidth='1'
          opacity='0.55'
          strokeLinecap='round'
        />

        {/* The blade — a long isoceles triangle pointed left, with a
            short tang stub on the right. Sits flat against the stone
            so the bottom edge of the blade meets the stone's top edge.
            Slides along the stone on each cycle. */}
        <g data-anim-target='blade'>
          {/* Blade body. */}
          <polygon points='22,62 70,62 70,54' fill={fg} opacity='0.8' />
          {/* Cutting edge — slightly brighter line along the bottom. */}
          <line
            x1='22'
            y1='62'
            x2='70'
            y2='62'
            stroke={fg}
            strokeWidth='1.2'
            opacity='1'
            strokeLinecap='round'
          />
          {/* Tang + handle — a short rectangle past the heel of the
              blade so the silhouette reads as a proper knife. */}
          <rect
            x='70'
            y='56'
            width='12'
            height='6'
            rx='1.2'
            fill={fg}
            opacity='0.65'
          />
        </g>

        {/* Sparks — three tiny accent marks at the contact point near
            the blade's tip. Brighten and flicker as the blade slides. */}
        <g data-anim-target='sparks'>
          <circle cx='24' cy='60' r='1.4' fill={accent} />
          <circle cx='28' cy='58' r='1' fill={accent} />
          <circle cx='20' cy='58' r='0.9' fill={accent} />
          <line
            x1='22'
            y1='56'
            x2='26'
            y2='52'
            stroke={accent}
            strokeWidth='0.9'
            strokeLinecap='round'
          />
        </g>
      </svg>
    )
  },
  {
    /* Apprentice & Master — two figures tracing the same arc, the
       master cleanly and ahead, the apprentice slightly behind and
       dimmer. Expertise is visible as the gap between two attempts at
       the same shape. */
    id: 'expertise-apprentice',
    lensId: 'expertise',
    label: 'Apprentice & Master',
    notes:
      'Master traces a clean arc; apprentice follows the same shape, slightly behind.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-apprentice'
      >
        {/* Ground line — both figures stand on the same floor. */}
        <line
          x1='10'
          y1='82'
          x2='90'
          y2='82'
          stroke={fg}
          strokeWidth='0.8'
          opacity='0.32'
        />

        {/* The master's arc — clean accent stroke, drawn fully and
            sitting steady at the top of the composition. */}
        <path
          d='M 18 70 Q 50 22 82 70'
          fill='none'
          stroke={accent}
          strokeWidth='1.8'
          strokeLinecap='round'
          opacity='0.85'
        />

        {/* The apprentice's arc — same shape, dimmer, drawn just below
            the master's. Faintly dashed to read as "in progress." */}
        <path
          d='M 18 76 Q 50 32 82 76'
          fill='none'
          stroke={fg}
          strokeWidth='1.4'
          strokeLinecap='round'
          opacity='0.5'
          strokeDasharray='3 3'
        />

        {/* Master's traveller — accent dot riding the master arc. */}
        <circle
          cx='18'
          cy='70'
          r='3'
          fill={accent}
          data-anim-target='master-trace'
          style={{ offsetPath: 'path("M 18 70 Q 50 22 82 70")' }}
        />

        {/* Apprentice's traveller — fg dot riding the apprentice arc,
            slightly delayed so the master is always a beat ahead. */}
        <circle
          cx='18'
          cy='76'
          r='2.4'
          fill={fg}
          opacity='0.85'
          data-anim-target='apprentice-trace'
          style={{ offsetPath: 'path("M 18 76 Q 50 32 82 76")' }}
        />

        {/* Two small figure dots at the start of each arc — the people
            doing the work. Subtle, just enough to read as "two
            actors attempting the same skill." */}
        <circle cx='14' cy='70' r='2.2' fill={accent} opacity='0.9' />
        <circle cx='14' cy='76' r='1.8' fill={fg} opacity='0.6' />
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
    id: 'expertise-key-turn',
    lensId: 'expertise',
    label: 'Key Turn',
    notes: 'A key turns in the lock; one pin clicks cleanly into place.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-key-turn'
      >
        <rect
          x='48'
          y='24'
          width='34'
          height='52'
          rx='5'
          fill={fg}
          opacity='0.18'
        />
        <rect
          x='52'
          y='30'
          width='26'
          height='40'
          rx='3'
          fill='none'
          stroke={fg}
          strokeWidth='1.5'
          opacity='0.58'
        />
        <g stroke={fg} strokeWidth='1' strokeLinecap='round' opacity='0.36'>
          <line x1='58' y1='38' x2='72' y2='38' />
          <line x1='58' y1='46' x2='72' y2='46' />
          <line x1='58' y1='54' x2='72' y2='54' />
        </g>
        <line
          x1='59'
          y1='62'
          x2='73'
          y2='62'
          stroke={accent}
          strokeWidth='2'
          strokeLinecap='round'
          data-anim-target='click'
        />
        <circle cx='65' cy='50' r='9' fill={fg} opacity='0.2' />
        <circle cx='65' cy='50' r='4.5' fill={fg} opacity='0.62' />
        <g data-anim-target='turn' style={{ transformOrigin: '65px 50px' }}>
          <line
            x1='20'
            y1='50'
            x2='65'
            y2='50'
            stroke={fg}
            strokeWidth='4'
            strokeLinecap='round'
            opacity='0.86'
          />
          <circle
            cx='20'
            cy='50'
            r='10'
            fill='none'
            stroke={fg}
            strokeWidth='3'
            opacity='0.82'
          />
          <rect x='36' y='44' width='8' height='6' fill={fg} opacity='0.86' />
          <rect x='43' y='50' width='6' height='6' fill={fg} opacity='0.86' />
        </g>
        <circle cx='65' cy='50' r='2.2' fill={accent} />
      </svg>
    )
  },
  {
    id: 'expertise-chisel-cut',
    lensId: 'expertise',
    label: 'Chisel Cut',
    notes: 'A chisel bites into a block and lifts one clean accent chip.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-chisel-cut'
      >
        <polygon points='18,68 72,54 86,66 32,82' fill={fg} opacity='0.22' />
        <polyline
          points='18,68 72,54 86,66 32,82 18,68'
          fill='none'
          stroke={fg}
          strokeWidth='1.4'
          strokeLinejoin='round'
          opacity='0.58'
        />
        <polygon points='62,58 74,55 68,64' fill={accent} opacity='0.92' />
        <g data-anim-target='strike' style={{ transformOrigin: '54px 44px' }}>
          <rect
            x='42'
            y='16'
            width='10'
            height='40'
            rx='2'
            fill={fg}
            opacity='0.78'
            transform='rotate(34 47 36)'
          />
          <polygon points='56,48 69,54 58,60' fill={fg} opacity='0.9' />
          <line
            x1='59'
            y1='50'
            x2='70'
            y2='55'
            stroke={accent}
            strokeWidth='1.4'
            strokeLinecap='round'
          />
        </g>
        <g data-anim-target='chip' style={{ transformOrigin: '72px 50px' }}>
          <polygon points='72,48 78,45 77,52' fill={accent} />
          <circle cx='81' cy='47' r='1.1' fill={accent} opacity='0.78' />
        </g>
      </svg>
    )
  },
  {
    id: 'expertise-compass-arc',
    lensId: 'expertise',
    label: 'Compass Arc',
    notes: 'A drafting compass holds radius while an accent arc draws on.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-compass-arc'
      >
        <path
          d='M 28 76 A 34 34 0 0 1 78 34'
          fill='none'
          stroke={fg}
          strokeWidth='1'
          strokeDasharray='3 3'
          opacity='0.34'
        />
        <path
          d='M 28 76 A 34 34 0 0 1 78 34'
          fill='none'
          stroke={accent}
          strokeWidth='2.2'
          strokeLinecap='round'
          pathLength='100'
          data-anim-target='arc'
        />
        <circle cx='50' cy='28' r='4.2' fill={fg} opacity='0.76' />
        <circle cx='50' cy='28' r='1.8' fill={accent} />
        <line
          x1='50'
          y1='28'
          x2='34'
          y2='76'
          stroke={fg}
          strokeWidth='2'
          strokeLinecap='round'
          opacity='0.72'
        />
        <circle cx='34' cy='76' r='2.4' fill={fg} opacity='0.72' />
        <g data-anim-target='sweep' style={{ transformOrigin: '50px 28px' }}>
          <line
            x1='50'
            y1='28'
            x2='76'
            y2='40'
            stroke={fg}
            strokeWidth='2'
            strokeLinecap='round'
            opacity='0.82'
          />
          <polygon points='74,39 82,38 77,45' fill={fg} opacity='0.82' />
          <circle cx='76' cy='40' r='2.2' fill={accent} />
        </g>
      </svg>
    )
  },
  {
    id: 'expertise-joinery',
    lensId: 'expertise',
    label: 'Joinery',
    notes:
      'Two dovetail pieces slide together until the accent seam disappears.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-joinery'
      >
        <g data-anim-target='left'>
          <path
            d='M 14 34 H 44 L 52 42 L 44 50 L 52 58 L 44 66 H 14 Z'
            fill={fg}
            opacity='0.34'
          />
          <path
            d='M 14 34 H 44 L 52 42 L 44 50 L 52 58 L 44 66 H 14 Z'
            fill='none'
            stroke={fg}
            strokeWidth='1.3'
            strokeLinejoin='round'
            opacity='0.62'
          />
        </g>
        <g data-anim-target='right'>
          <path
            d='M 86 34 H 56 L 48 42 L 56 50 L 48 58 L 56 66 H 86 Z'
            fill={fg}
            opacity='0.24'
          />
          <path
            d='M 86 34 H 56 L 48 42 L 56 50 L 48 58 L 56 66 H 86 Z'
            fill='none'
            stroke={fg}
            strokeWidth='1.3'
            strokeLinejoin='round'
            opacity='0.58'
          />
        </g>
        <path
          d='M 50 36 L 56 42 L 50 50 L 56 58 L 50 64'
          fill='none'
          stroke={accent}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          data-anim-target='seam'
        />
      </svg>
    )
  },
  {
    id: 'expertise-belt-knot',
    lensId: 'expertise',
    label: 'Belt Knot',
    notes: 'A belt knot tightens: rank earned through repeated tying.',
    render: ({ fg, accent }) => (
      <svg
        {...SVG_BASE}
        aria-hidden='true'
        data-anim='candidate-expertise-belt-knot'
      >
        <g data-anim-target='tails'>
          <rect
            x='10'
            y='45'
            width='34'
            height='10'
            rx='2'
            fill={fg}
            opacity='0.72'
          />
          <rect
            x='56'
            y='45'
            width='34'
            height='10'
            rx='2'
            fill={fg}
            opacity='0.72'
          />
          <path
            d='M 42 54 C 38 62 37 70 39 82'
            fill='none'
            stroke={fg}
            strokeWidth='8'
            strokeLinecap='round'
            opacity='0.58'
          />
          <path
            d='M 58 54 C 64 62 65 71 61 84'
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
            d='M 43 50 H 57'
            stroke={fg}
            strokeWidth='1.4'
            strokeLinecap='round'
            opacity='0.45'
          />
        </g>
      </svg>
    )
  }
]
