import type { IllustrationId } from './types'

/**
 * Illustration — switchboard mapping IllustrationId → SVG art component.
 *
 *   Each Art* component is a small, flat, Pip-deck-ish geometric SVG
 *   driven by `fg` (line / fill) and `accent` (highlight). Designed to
 *   look great at both card-size and thumbnail-size in the dialog list.
 *
 *   Animation contract:
 *     • The root <svg> carries `data-anim="<id>"` so CSS keyframes
 *       can scope per-lens.
 *     • One or more inner elements carry `data-anim-target="<n>"` to
 *       mark *which* element the keyframe should drive. The keyframe
 *       itself is defined in LensesPage.module.css and only runs while
 *       a card is :hover'd on a hover-capable pointer.
 *     • All animations honor prefers-reduced-motion via the global
 *       kill-switch in the same stylesheet.
 */

type IllustrationProps = {
  id: IllustrationId
  fg: string
  bg: string
  accent: string
}

export function Illustration({ id, fg, bg, accent }: IllustrationProps) {
  switch (id) {
    case 'great-man':
      return <ArtGreatMan fg={fg} accent={accent} />
    case 'evo-psych':
      return <ArtEvoPsych fg={fg} accent={accent} />
    case 'minimalism':
      return <ArtMinimalism fg={fg} accent={accent} />
    case 'utility':
      return <ArtUtility fg={fg} accent={accent} />
    case 'status':
      return <ArtStatus fg={fg} accent={accent} />
    case 'incentives':
      return <ArtIncentives fg={fg} accent={accent} />
    case 'game-theory':
      return <ArtGameTheory fg={fg} accent={accent} />
    case 'systems':
      return <ArtSystems fg={fg} accent={accent} />
    case 'headspace':
      return <ArtHeadspace fg={fg} accent={accent} />
    case 'legibility':
      return <ArtLegibility fg={fg} accent={accent} />
    case 'narrative':
      return <ArtNarrative fg={fg} accent={accent} />
    case 'constraint':
      return <ArtConstraint fg={fg} accent={accent} />
    case 'interface':
      return <ArtInterface fg={fg} accent={accent} />
    case 'energy':
      return <ArtEnergy fg={fg} accent={accent} />
    case 'epistemic':
      return <ArtEpistemic fg={fg} accent={accent} />
    case 'osmosis':
      return <ArtOsmosis fg={fg} accent={accent} />
    case 'probabilistic':
      return <ArtProbabilistic fg={fg} accent={accent} />
    case 'communication':
      return <ArtCommunication fg={fg} accent={accent} />
    case 'mimetics':
      return <ArtMimetics fg={fg} accent={accent} />
    case 'primitives':
      return <ArtPrimitives fg={fg} accent={accent} />
    case 'projection':
      return <ArtProjection fg={fg} accent={accent} />
    case 'attention':
      return <ArtAttention fg={fg} accent={accent} />
    case 'dopamine':
      return <ArtDopamine fg={fg} accent={accent} />
    case 'reps':
      return <ArtReps fg={fg} accent={accent} />
    case 'agency':
      return <ArtAgency fg={fg} accent={accent} />
    case 'expertise':
      return <ArtExpertise fg={fg} accent={accent} />
    case 'tempo':
      return <ArtTempo fg={fg} accent={accent} />
    case 'surface-area':
      return <ArtSurfaceArea fg={fg} accent={accent} />
    case 'lenses-deck':
      return <ArtLensesDeck fg={fg} accent={accent} bg={bg} />
  }
}

const SVG_BASE: React.SVGProps<SVGSVGElement> = {
  viewBox: '0 0 100 100',
  preserveAspectRatio: 'xMidYMid meet',
  xmlns: 'http://www.w3.org/2000/svg'
}

/** Great Man — the leader's bar + dot. On hover the dot bobs and pulses. */
function ArtGreatMan({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='great-man'>
      <rect x='14' y='62' width='12' height='22' fill={fg} opacity='0.5' />
      <rect x='30' y='52' width='12' height='32' fill={fg} opacity='0.5' />
      <rect x='46' y='28' width='12' height='56' fill={accent} />
      <circle
        cx='52'
        cy='20'
        r='6'
        fill={accent}
        data-anim-target='1'
      />
      <rect x='62' y='44' width='12' height='40' fill={fg} opacity='0.5' />
      <rect x='78' y='58' width='12' height='26' fill={fg} opacity='0.5' />
    </svg>
  )
}

/** Evo psych — concentric rings ripple outward like inherited circuitry firing. */
function ArtEvoPsych({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='evo-psych'>
      <circle
        cx='50'
        cy='50'
        r='38'
        fill={fg}
        opacity='0.16'
        data-anim-target='3'
      />
      <circle
        cx='50'
        cy='50'
        r='28'
        fill={fg}
        opacity='0.3'
        data-anim-target='2'
      />
      <circle
        cx='50'
        cy='50'
        r='18'
        fill={fg}
        opacity='0.55'
        data-anim-target='1'
      />
      <circle cx='50' cy='50' r='8' fill={accent} />
    </svg>
  )
}

/** Minimalism — the lone red square breathes once you stop and look. */
function ArtMinimalism({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='minimalism'>
      <rect
        x='8'
        y='8'
        width='84'
        height='84'
        fill='none'
        stroke={fg}
        strokeWidth='1.2'
        opacity='0.32'
      />
      {/* Group with transform-origin centered for a calm scale-breath. */}
      <g
        style={{ transformOrigin: '50px 50px' }}
        data-anim-target='1'
      >
        <rect x='44' y='44' width='12' height='12' fill={accent} />
      </g>
    </svg>
  )
}

/** Utility — the winning bar's accent dot bounces (got the highest payoff). */
function ArtUtility({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='utility'>
      <rect x='14' y='66' width='14' height='18' fill={fg} opacity='0.42' />
      <rect x='32' y='54' width='14' height='30' fill={fg} opacity='0.58' />
      <rect x='50' y='40' width='14' height='44' fill={fg} opacity='0.76' />
      <rect x='68' y='22' width='14' height='62' fill={accent} />
      <circle
        cx='75'
        cy='18'
        r='4.5'
        fill={accent}
        data-anim-target='1'
      />
    </svg>
  )
}

/** Status — the high-status dot orbits the rings, slowly. */
function ArtStatus({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='status'>
      <circle
        cx='50'
        cy='50'
        r='38'
        fill='none'
        stroke={fg}
        strokeWidth='1.2'
        opacity='0.4'
      />
      <circle
        cx='50'
        cy='50'
        r='27'
        fill='none'
        stroke={fg}
        strokeWidth='1.2'
        opacity='0.55'
      />
      <circle
        cx='50'
        cy='50'
        r='16'
        fill='none'
        stroke={fg}
        strokeWidth='1.2'
        opacity='0.7'
      />
      <circle cx='50' cy='50' r='3' fill={fg} opacity='0.6' />
      {/* The orbiting status dot: a <g> centered at (50,50) with the
          dot painted at +24,-16 from origin so we can rotate the group. */}
      <g
        style={{ transformOrigin: '50px 50px' }}
        data-anim-target='1'
      >
        <circle cx='74' cy='34' r='6' fill={accent} />
      </g>
    </svg>
  )
}

/** Incentives — the arrow slides toward the target. */
function ArtIncentives({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='incentives'>
      <circle cx='58' cy='50' r='30' fill={fg} opacity='0.16' />
      <circle cx='58' cy='50' r='20' fill={fg} opacity='0.3' />
      <circle cx='58' cy='50' r='10' fill={fg} opacity='0.55' />
      <circle cx='58' cy='50' r='4' fill={accent} />
      <g data-anim-target='1'>
        <line
          x1='12'
          y1='50'
          x2='52'
          y2='50'
          stroke={accent}
          strokeWidth='3'
          strokeLinecap='round'
        />
        <polygon points='48,44 58,50 48,56' fill={accent} />
      </g>
    </svg>
  )
}

/** Game theory — each cell takes its turn pulsing (round-robin). */
function ArtGameTheory({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='game-theory'>
      <g stroke={fg} strokeWidth='1.4' fill='none' opacity='0.5'>
        <rect x='20' y='20' width='60' height='60' />
        <line x1='50' y1='20' x2='50' y2='80' />
        <line x1='20' y1='50' x2='80' y2='50' />
      </g>
      <g style={{ transformOrigin: '35px 35px' }} data-anim-target='1'>
        <circle cx='35' cy='35' r='5' fill={fg} opacity='0.55' />
      </g>
      <g style={{ transformOrigin: '65px 35px' }} data-anim-target='2'>
        <circle cx='65' cy='35' r='5' fill={fg} opacity='0.4' />
      </g>
      <g style={{ transformOrigin: '35px 65px' }} data-anim-target='3'>
        <circle cx='35' cy='65' r='5' fill={fg} opacity='0.4' />
      </g>
      <g style={{ transformOrigin: '65px 65px' }} data-anim-target='4'>
        <rect x='59' y='59' width='12' height='12' fill={accent} />
      </g>
    </svg>
  )
}

/** Systems — the whole feedback loop slowly rotates (cycles cycling). */
function ArtSystems({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='systems'>
      <g style={{ transformOrigin: '50px 50px' }} data-anim-target='1'>
        <circle
          cx='50'
          cy='50'
          r='28'
          fill='none'
          stroke={fg}
          strokeWidth='2'
          opacity='0.55'
          strokeDasharray='66 8'
        />
        <circle cx='50' cy='22' r='6' fill={fg} opacity='0.7' />
        <circle cx='75' cy='62' r='6' fill={fg} opacity='0.7' />
        <circle cx='25' cy='62' r='6' fill={accent} />
        <polygon points='73,28 80,35 70,38' fill={fg} opacity='0.7' />
        <polygon points='52,77 60,80 56,72' fill={fg} opacity='0.7' />
        <polygon points='27,38 20,35 30,28' fill={accent} />
      </g>
    </svg>
  )
}

/** Headspace — the inner thought-dot ticks; the surrounding aura
 *  expands and contracts in counterpoint, like a mind ticking over.
 *
 *  data-anim-target='1' = the accent thought-dot (inner pulse).
 *  data-anim-target='2' = the soft aura ring around it (outer
 *    breath, offset in time so the two motions don't lock up).
 */
function ArtHeadspace({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='headspace'>
      <path
        d='M 32 80 L 32 48 Q 32 24 56 24 Q 76 24 76 44 Q 76 52 70 56 L 70 68 Q 70 74 64 74 L 56 74 L 56 80 Z'
        fill={fg}
        opacity='0.32'
      />
      <g style={{ transformOrigin: '56px 46px' }} data-anim-target='2'>
        <circle cx='56' cy='46' r='12' fill={fg} opacity='0.55' />
      </g>
      <g style={{ transformOrigin: '56px 46px' }} data-anim-target='1'>
        <circle cx='56' cy='46' r='5' fill={accent} />
      </g>
    </svg>
  )
}

/** Legibility — the accent label-bar grows out of the fog (named into being). */
function ArtLegibility({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='legibility'>
      <path
        d='M 12 28 Q 22 22 32 28 T 52 28'
        stroke={fg}
        strokeWidth='1.5'
        fill='none'
        opacity='0.35'
        strokeLinecap='round'
      />
      <path
        d='M 12 42 Q 22 36 32 42 T 52 42'
        stroke={fg}
        strokeWidth='1.5'
        fill='none'
        opacity='0.35'
        strokeLinecap='round'
      />
      <path
        d='M 12 56 Q 22 50 32 56 T 52 56'
        stroke={fg}
        strokeWidth='1.5'
        fill='none'
        opacity='0.35'
        strokeLinecap='round'
      />
      <rect
        x='56'
        y='30'
        width='32'
        height='32'
        fill='none'
        stroke={fg}
        strokeWidth='1.6'
        opacity='0.7'
      />
      {/* The accent label "draws in" from the left on hover. */}
      <g
        style={{ transformOrigin: '62px 42px' }}
        data-anim-target='1'
      >
        <rect x='62' y='40' width='20' height='4' fill={accent} />
      </g>
      <rect x='62' y='48' width='14' height='3' fill={fg} opacity='0.55' />
    </svg>
  )
}

/** Narrative — a beat travels along the arc, like a story moving. */
function ArtNarrative({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='narrative'>
      <path
        d='M 12 72 Q 50 12 88 72'
        stroke={fg}
        strokeWidth='2'
        fill='none'
        opacity='0.55'
        strokeLinecap='round'
      />
      <circle cx='12' cy='72' r='5' fill={fg} opacity='0.65' />
      <circle cx='88' cy='72' r='5' fill={fg} opacity='0.65' />
      {/* The bright story-beat dot. We translate it via offset-path
          along the same arc so it tracks the curve. */}
      <circle
        cx='50'
        cy='28'
        r='6'
        fill={accent}
        data-anim-target='1'
      />
    </svg>
  )
}

/** Constraint — the diagonal line tugs against the brackets (energy under limit). */
function ArtConstraint({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='constraint'>
      <path
        d='M 22 18 L 14 18 L 14 82 L 22 82'
        stroke={fg}
        strokeWidth='2.2'
        fill='none'
        opacity='0.55'
        strokeLinejoin='miter'
      />
      <path
        d='M 78 18 L 86 18 L 86 82 L 78 82'
        stroke={fg}
        strokeWidth='2.2'
        fill='none'
        opacity='0.55'
        strokeLinejoin='miter'
      />
      <g style={{ transformOrigin: '50px 50px' }} data-anim-target='1'>
        <line
          x1='28'
          y1='70'
          x2='72'
          y2='30'
          stroke={accent}
          strokeWidth='3'
          strokeLinecap='round'
        />
        <circle cx='28' cy='70' r='3' fill={accent} />
        <circle cx='72' cy='30' r='3' fill={accent} />
      </g>
    </svg>
  )
}

/** Interface — the cursor "clicks" the button (small bounce). */
function ArtInterface({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='interface'>
      <rect
        x='14'
        y='22'
        width='72'
        height='52'
        rx='4'
        fill='none'
        stroke={fg}
        strokeWidth='1.6'
        opacity='0.5'
      />
      <line
        x1='14'
        y1='32'
        x2='86'
        y2='32'
        stroke={fg}
        strokeWidth='1.6'
        opacity='0.5'
      />
      <g style={{ transformOrigin: '42px 52px' }} data-anim-target='2'>
        <rect
          x='28'
          y='46'
          width='28'
          height='12'
          rx='3'
          fill={fg}
          opacity='0.55'
        />
      </g>
      <g style={{ transformOrigin: '54px 60px' }} data-anim-target='1'>
        <polygon
          points='52,52 64,58 58,62 60,68 56,68 54,62 49,64'
          fill={accent}
        />
      </g>
    </svg>
  )
}

/** Energy — the charge bar fills and drains, the bolt glows softly.
 *
 *   data-anim-target='1' = the yellow fill bar (scales horizontally
 *     from the battery's negative terminal, like a charge meter
 *     rising and falling).
 *   data-anim-target='2' = the lightning bolt (a soft opacity pulse,
 *     so it reads as ambient current rather than a strobe).
 */
function ArtEnergy({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='energy'>
      {/* Battery body. */}
      <rect
        x='22'
        y='30'
        width='52'
        height='40'
        rx='4'
        fill='none'
        stroke={fg}
        strokeWidth='1.6'
        opacity='0.55'
      />
      {/* Positive terminal nub. */}
      <rect
        x='74'
        y='42'
        width='6'
        height='16'
        rx='1'
        fill={fg}
        opacity='0.55'
      />
      {/* The yellow fill bar. We anchor scaleX at the left edge of
          the battery interior so the bar grows toward the positive
          terminal — like a charging meter — when the keyframe runs. */}
      <g
        style={{ transformOrigin: '26px 50px' }}
        data-anim-target='1'
      >
        <rect x='26' y='34' width='44' height='32' rx='1' fill={accent} />
      </g>
      {/* Lightning bolt — centered on the battery body (cx=48, cy=50)
          so it reads as the force inside the cell, not as a separate
          icon. Slightly translucent so the charge level shows through.
          Animated subtly via opacity, no scale. */}
      <polygon
        points='52,38 42,52 48,52 44,62 54,48 48,48 52,38'
        fill={fg}
        opacity='0.78'
        data-anim-target='2'
      />
    </svg>
  )
}

/** Epistemic pragmatism — the dashed path flows forward (map → action). */
function ArtEpistemic({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='epistemic'>
      <path
        d='M 14 26 L 38 22 L 62 28 L 86 24 L 86 76 L 62 80 L 38 74 L 14 78 Z'
        fill={fg}
        opacity='0.18'
        stroke={fg}
        strokeWidth='1.2'
        strokeOpacity='0.5'
      />
      <line
        x1='38'
        y1='22'
        x2='38'
        y2='74'
        stroke={fg}
        strokeWidth='1'
        opacity='0.35'
      />
      <line
        x1='62'
        y1='28'
        x2='62'
        y2='80'
        stroke={fg}
        strokeWidth='1'
        opacity='0.35'
      />
      <path
        d='M 22 64 Q 36 48 50 54 T 80 38'
        stroke={accent}
        strokeWidth='2.2'
        fill='none'
        strokeLinecap='round'
        strokeDasharray='3 3'
        data-anim-target='1'
      />
      <circle cx='22' cy='64' r='3.2' fill={accent} />
      <circle cx='80' cy='38' r='3.2' fill={accent} />
    </svg>
  )
}

/** Osmosis — the crossing dots drift gently to the absorbed side. */
function ArtOsmosis({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='osmosis'>
      <line
        x1='50'
        y1='14'
        x2='50'
        y2='86'
        stroke={fg}
        strokeWidth='1.4'
        opacity='0.4'
        strokeDasharray='3 4'
      />
      <circle cx='72' cy='28' r='3' fill={fg} opacity='0.45' />
      <circle cx='80' cy='44' r='3' fill={fg} opacity='0.45' />
      <circle cx='70' cy='62' r='3' fill={fg} opacity='0.45' />
      <circle cx='80' cy='76' r='3' fill={fg} opacity='0.45' />
      <circle
        cx='56'
        cy='38'
        r='3'
        fill={accent}
        data-anim-target='1'
      />
      <circle
        cx='44'
        cy='54'
        r='3'
        fill={accent}
        data-anim-target='2'
      />
      <circle cx='28' cy='30' r='3' fill={fg} opacity='0.7' />
      <circle cx='22' cy='50' r='3' fill={fg} opacity='0.7' />
      <circle cx='30' cy='70' r='3' fill={fg} opacity='0.7' />
    </svg>
  )
}

/** Probabilistic — the bell curve gently breathes vertically. */
function ArtProbabilistic({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='probabilistic'>
      <g style={{ transformOrigin: '50px 76px' }} data-anim-target='1'>
        <path
          d='M 12 76 C 26 76, 32 76, 38 60 C 44 36, 56 36, 62 60 C 68 76, 74 76, 88 76'
          stroke={fg}
          strokeWidth='2'
          fill='none'
          opacity='0.6'
          strokeLinecap='round'
        />
      </g>
      <line
        x1='50'
        y1='44'
        x2='50'
        y2='76'
        stroke={fg}
        strokeWidth='1'
        opacity='0.35'
        strokeDasharray='2 3'
      />
      <circle cx='50' cy='80' r='3' fill={accent} />
      <circle cx='44' cy='80' r='2.4' fill={fg} opacity='0.7' />
      <circle cx='56' cy='80' r='2.4' fill={fg} opacity='0.7' />
      <circle cx='38' cy='84' r='2' fill={fg} opacity='0.5' />
      <circle cx='62' cy='84' r='2' fill={fg} opacity='0.5' />
      <circle cx='28' cy='86' r='1.6' fill={fg} opacity='0.35' />
      <circle cx='72' cy='86' r='1.6' fill={fg} opacity='0.35' />
      <circle cx='18' cy='88' r='1.4' fill={fg} opacity='0.25' />
      <circle cx='82' cy='88' r='1.4' fill={fg} opacity='0.25' />
    </svg>
  )
}

/** Communication — the speech bubble pulses; the misalignment crack flickers. */
function ArtCommunication({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='communication'>
      <path
        d='M 26 78 L 26 50 Q 26 36 36 36 Q 44 36 44 46 Q 44 50 40 52 L 40 60 Q 40 64 36 64 L 32 64 L 32 78 Z'
        fill={fg}
        opacity='0.55'
      />
      <path
        d='M 74 78 L 74 50 Q 74 36 64 36 Q 56 36 56 46 Q 56 50 60 52 L 60 60 Q 60 64 64 64 L 68 64 L 68 78 Z'
        fill={fg}
        opacity='0.55'
      />
      <g style={{ transformOrigin: '50px 28px' }} data-anim-target='1'>
        <ellipse cx='50' cy='28' rx='18' ry='10' fill={accent} />
        <polygon points='44,38 50,32 47,42' fill={accent} />
        <polygon points='56,38 50,32 53,42' fill={accent} />
      </g>
      <line
        x1='50'
        y1='52'
        x2='50'
        y2='80'
        stroke={fg}
        strokeWidth='1.4'
        opacity='0.45'
        strokeDasharray='3 3'
        data-anim-target='2'
      />
    </svg>
  )
}

/** Mimetics — copies twinkle outward in waves (idea spreading). */
function ArtMimetics({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='mimetics'>
      <g
        stroke={fg}
        strokeWidth='1.2'
        opacity='0.45'
        fill='none'
        strokeLinecap='round'
      >
        <line x1='30' y1='50' x2='52' y2='28' />
        <line x1='30' y1='50' x2='52' y2='50' />
        <line x1='30' y1='50' x2='52' y2='72' />
        <line x1='52' y1='28' x2='78' y2='18' />
        <line x1='52' y1='28' x2='78' y2='38' />
        <line x1='52' y1='72' x2='78' y2='62' />
        <line x1='52' y1='72' x2='78' y2='82' />
      </g>
      <circle cx='30' cy='50' r='8' fill={accent} data-anim-target='0' />
      <circle
        cx='52'
        cy='28'
        r='5'
        fill={fg}
        opacity='0.75'
        data-anim-target='1'
      />
      <circle
        cx='52'
        cy='50'
        r='5'
        fill={fg}
        opacity='0.6'
        data-anim-target='1'
      />
      <circle
        cx='52'
        cy='72'
        r='5'
        fill={fg}
        opacity='0.75'
        data-anim-target='1'
      />
      <circle
        cx='78'
        cy='18'
        r='3.5'
        fill={fg}
        opacity='0.55'
        data-anim-target='2'
      />
      <circle
        cx='78'
        cy='38'
        r='3.5'
        fill={fg}
        opacity='0.55'
        data-anim-target='2'
      />
      <circle
        cx='78'
        cy='62'
        r='3.5'
        fill={fg}
        opacity='0.55'
        data-anim-target='2'
      />
      <circle
        cx='78'
        cy='82'
        r='3.5'
        fill={fg}
        opacity='0.55'
        data-anim-target='2'
      />
    </svg>
  )
}

/** Primitives — the three atoms below rotate in place (composable units). */
function ArtPrimitives({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='primitives'>
      <rect
        x='28'
        y='18'
        width='44'
        height='10'
        rx='2'
        fill={fg}
        opacity='0.55'
      />
      <rect
        x='28'
        y='30'
        width='20'
        height='10'
        rx='2'
        fill={fg}
        opacity='0.7'
      />
      <rect
        x='52'
        y='30'
        width='20'
        height='10'
        rx='2'
        fill={fg}
        opacity='0.4'
      />
      <line
        x1='50'
        y1='46'
        x2='50'
        y2='58'
        stroke={fg}
        strokeWidth='1.2'
        opacity='0.45'
        strokeDasharray='2 3'
      />
      <g style={{ transformOrigin: '28px 72px' }} data-anim-target='1'>
        <circle cx='28' cy='72' r='8' fill={accent} />
      </g>
      <g style={{ transformOrigin: '51px 71px' }} data-anim-target='2'>
        <rect
          x='44'
          y='64'
          width='14'
          height='14'
          rx='2'
          fill={fg}
          opacity='0.7'
        />
      </g>
      <g style={{ transformOrigin: '72px 73px' }} data-anim-target='3'>
        <polygon points='72,80 80,66 64,66' fill={fg} opacity='0.7' />
      </g>
    </svg>
  )
}

/** Center "Lenses" card: three lenses seen edge-on, stacked.
 *
 *   Side view of three discs of optical glass — the kind you'd pull
 *   from a kit and place in front of the eye, one at a time. Each
 *   ellipse is a different lens (amber, teal, rose) drawn slim so
 *   they read as *the edges* of physical lenses rather than as
 *   filled circles. A single thin sight-line passes through their
 *   centers — this is where the metaphor lives: line up three
 *   lenses on the same axis, look through, and what they reveal
 *   together is more than any one shows alone.
 *
 *   Quieter than the previous trefoil. The three colors persist as
 *   continuity with the deck palette but the composition is just
 *   three horizontal strokes + a vertical axis — almost diagrammatic.
 *
 *   On hover the three lenses drift left/right by a few pixels,
 *   like an instrument settling into focus.
 */
function ArtLensesDeck({
  accent,
  bg
}: {
  fg: string
  accent: string
  bg: string
}) {
  const LENS_AMBER = '#F2C04A'
  const LENS_TEAL = '#5CB8C8'
  const LENS_ROSE = '#E55A8E'

  const lenses = [
    { cy: 28, fill: LENS_AMBER, target: '1' },
    { cy: 50, fill: LENS_TEAL, target: '2' },
    { cy: 72, fill: LENS_ROSE, target: '3' }
  ] as const

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='lenses-deck'>
      {/* The optical axis — a single hairline that all three lenses
          align to. Reads as "you look down this line." */}
      <line
        x1='50'
        y1='14'
        x2='50'
        y2='86'
        stroke='currentColor'
        strokeWidth='0.4'
        opacity='0.22'
      />

      {/* Each lens is rendered as a thin ellipse (the edge profile of
          a glass disc) plus two short lines for the meridians, so it
          reads as a 3D lens rather than a filled oval. */}
      {lenses.map((l) => (
        <g
          key={`lens-${l.target}`}
          style={{ transformOrigin: `50px ${l.cy}px` }}
          data-anim-target={l.target}
        >
          <ellipse
            cx='50'
            cy={l.cy}
            rx='28'
            ry='6'
            fill={l.fill}
            opacity='0.85'
          />
          <ellipse
            cx='50'
            cy={l.cy}
            rx='28'
            ry='6'
            fill='none'
            stroke={l.fill}
            strokeWidth='0.8'
          />
          {/* A tiny inner highlight on the upper edge — pure white at
              low alpha so it reads as polished glass, not paint. */}
          <ellipse
            cx='42'
            cy={l.cy - 2}
            rx='6'
            ry='1.2'
            fill='#FFFFFF'
            opacity='0.32'
          />
        </g>
      ))}

      {/* Suppress 'unused' warnings from the bg/accent props — we
          deliberately don't render them here, but the prop contract
          is shared with the regular cards. */}
      <rect x='0' y='0' width='0' height='0' fill={bg} />
      <rect x='0' y='0' width='0' height='0' fill={accent} />
    </svg>
  )
}

/** Projection — a figure casts a long shadow that doesn't quite match
 *  it. The shadow is the projection: what gets seen is the speaker,
 *  refracted onto the world.
 *
 *    data-anim-target='1' = the cast shadow (subtle sway, suggesting
 *      it isn't a faithful copy of the figure above it).
 */
function ArtProjection({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='projection'>
      {/* Ground plane. */}
      <line x1='14' y1='72' x2='86' y2='72' stroke={fg} strokeWidth='1' opacity='0.3' />

      {/* The figure (head + torso). */}
      <circle cx='50' cy='34' r='8' fill={fg} opacity='0.6' />
      <path
        d='M 38 70 Q 38 50 50 50 Q 62 50 62 70 Z'
        fill={fg}
        opacity='0.6'
      />

      {/* The cast shadow — accent color, longer and slightly distorted
          relative to the figure, so it reads as a *projection* rather
          than a literal shadow. */}
      <g style={{ transformOrigin: '50px 72px' }} data-anim-target='1'>
        <ellipse cx='50' cy='73' rx='30' ry='3.5' fill={accent} opacity='0.55' />
        <ellipse cx='50' cy='73' rx='22' ry='2.4' fill={accent} opacity='0.85' />
      </g>
    </svg>
  )
}

/** Attention — a narrow cone of light singling out a single dot from
 *  among many possibles. Hover sweeps the cone left-right, brushing
 *  past inattentive dots before settling.
 *
 *    data-anim-target='1' = the cone group (rotates around its apex).
 */
function ArtAttention({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='attention'>
      {/* The unattended field — small dim dots scattered. */}
      <g fill={fg} opacity='0.28'>
        <circle cx='22' cy='70' r='2.4' />
        <circle cx='34' cy='78' r='2.4' />
        <circle cx='66' cy='78' r='2.4' />
        <circle cx='78' cy='70' r='2.4' />
      </g>

      {/* The cone of attention, hinged at apex (50, 22). */}
      <g style={{ transformOrigin: '50px 22px' }} data-anim-target='1'>
        <path
          d='M 50 22 L 30 76 L 70 76 Z'
          fill={accent}
          opacity='0.45'
        />
        <path
          d='M 50 22 L 30 76 L 70 76 Z'
          fill='none'
          stroke={accent}
          strokeWidth='0.8'
          opacity='0.85'
        />
        {/* The illuminated dot under the cone. */}
        <circle cx='50' cy='74' r='3.4' fill={accent} />
      </g>

      {/* The eye / source at the apex. */}
      <circle cx='50' cy='22' r='3' fill={fg} opacity='0.7' />
    </svg>
  )
}

/** Dopamine — a chase loop: a small dot orbits around a brighter
 *  attractor. The reward (the bright center) pulses as the seeker
 *  circles, never quite catching up.
 *
 *    data-anim-target='1' = the chasing dot's orbit (rotates).
 *    data-anim-target='2' = the attractor center (gentle pulse).
 */
function ArtDopamine({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='dopamine'>
      {/* Orbit ring — dashed so the path of the chase reads. */}
      <circle
        cx='50'
        cy='50'
        r='24'
        fill='none'
        stroke={fg}
        strokeWidth='0.8'
        strokeDasharray='2 3'
        opacity='0.35'
      />

      {/* The reward / attractor. */}
      <g style={{ transformOrigin: '50px 50px' }} data-anim-target='2'>
        <circle cx='50' cy='50' r='8' fill={accent} />
        <circle cx='50' cy='50' r='8' fill='none' stroke={accent} strokeWidth='1.2' opacity='0.5' />
      </g>

      {/* The chasing dot, sits at 12 o'clock of the orbit ring. The
          group rotates around the center to drag it around the loop. */}
      <g style={{ transformOrigin: '50px 50px' }} data-anim-target='1'>
        <circle cx='50' cy='26' r='3.6' fill={fg} opacity='0.85' />
      </g>
    </svg>
  )
}

/** Reps — five tally marks stacked on a baseline. The fifth strikes
 *  diagonally across the four — the unit of mastery is volume, and
 *  the cross is the moment a count completes.
 *
 *    data-anim-target='1' = the diagonal stroke (animates draw-on
 *      via stroke-dashoffset, completing then resetting).
 */
function ArtReps({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='reps'>
      {/* Baseline. */}
      <line x1='18' y1='80' x2='82' y2='80' stroke={fg} strokeWidth='0.8' opacity='0.4' />

      {/* The four upright tally marks. */}
      <g stroke={fg} strokeWidth='3' strokeLinecap='round' opacity='0.65'>
        <line x1='30' y1='34' x2='30' y2='74' />
        <line x1='42' y1='34' x2='42' y2='74' />
        <line x1='54' y1='34' x2='54' y2='74' />
        <line x1='66' y1='34' x2='66' y2='74' />
      </g>

      {/* The diagonal closing stroke, in accent. dasharray ≈ stroke
          length so the keyframe can animate dashoffset to redraw it. */}
      <line
        x1='24'
        y1='72'
        x2='72'
        y2='34'
        stroke={accent}
        strokeWidth='3.4'
        strokeLinecap='round'
        strokeDasharray='62'
        strokeDashoffset='0'
        data-anim-target='1'
      />
    </svg>
  )
}

/** Agency — an arrow breaking out of a frame. The frame is the
 *  default. The arrow is the move that exceeds it.
 *
 *    data-anim-target='1' = the breakout arrow head + shaft (slides
 *      further outside the frame on hover, like an action being
 *      taken).
 */
function ArtAgency({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='agency'>
      {/* The frame (the default world). */}
      <rect
        x='20'
        y='26'
        width='52'
        height='52'
        fill='none'
        stroke={fg}
        strokeWidth='1.4'
        opacity='0.55'
      />

      {/* The breakout arrow — its tail starts inside the frame, its
          head pierces the right wall. The whole group translates a few
          px on hover so the head drives further out. */}
      <g data-anim-target='1' style={{ transformOrigin: '50px 52px' }}>
        <line
          x1='32'
          y1='52'
          x2='80'
          y2='52'
          stroke={accent}
          strokeWidth='3.2'
          strokeLinecap='round'
        />
        <polygon points='80,52 70,46 70,58' fill={accent} />
      </g>

      {/* A small origin dot inside the frame (the seat of choice). */}
      <circle cx='32' cy='52' r='3' fill={fg} opacity='0.7' />
    </svg>
  )
}

/** Expertise — a staircase of skill, each step taller than the last.
 *  A small marker rests on the top step. Hover steps the marker up
 *  and down the stair like progress accumulating.
 *
 *    data-anim-target='1' = the climbing marker.
 */
function ArtExpertise({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='expertise'>
      {/* Three ascending steps, drawn as filled rects sharing a
          baseline. Heights climb so the silhouette reads as a stair. */}
      <g fill={fg} opacity='0.5'>
        <rect x='18' y='62' width='18' height='18' />
        <rect x='38' y='50' width='18' height='30' />
        <rect x='58' y='34' width='18' height='46' />
      </g>

      {/* The climbing marker — sits atop the tallest step at rest. */}
      <g data-anim-target='1' style={{ transformOrigin: '67px 30px' }}>
        <circle cx='67' cy='30' r='4.5' fill={accent} />
      </g>

      {/* Baseline. */}
      <line x1='14' y1='80' x2='86' y2='80' stroke={fg} strokeWidth='0.8' opacity='0.4' />
    </svg>
  )
}

/** Tempo — a metronome. The triangular body sits still; the pendulum
 *  arm swings side to side at a steady cadence. The story: when
 *  matters as much as what.
 *
 *    data-anim-target='1' = the pendulum arm + bob (swings).
 */
function ArtTempo({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='tempo'>
      {/* The metronome body — a tall isoceles triangle. */}
      <polygon
        points='50,18 28,82 72,82'
        fill='none'
        stroke={fg}
        strokeWidth='1.6'
        opacity='0.55'
      />

      {/* Pivot dot at the bottom-center of the triangle. */}
      <circle cx='50' cy='80' r='2.6' fill={fg} opacity='0.7' />

      {/* The pendulum — arm + weight bob — anchored at the pivot so it
          swings around it on hover. */}
      <g style={{ transformOrigin: '50px 80px' }} data-anim-target='1'>
        <line
          x1='50'
          y1='80'
          x2='50'
          y2='28'
          stroke={accent}
          strokeWidth='1.8'
          strokeLinecap='round'
        />
        <circle cx='50' cy='32' r='4.6' fill={accent} />
      </g>
    </svg>
  )
}

/** Surface area — a central self with short rays poking outward into
 *  the surrounding world. Hover lengthens the rays: more exposure,
 *  more chances for serendipity.
 *
 *    data-anim-target='1' = the rays group (each ray scales out from
 *      the center on hover, reaches further into the world).
 */
function ArtSurfaceArea({ fg, accent }: { fg: string; accent: string }) {
  // 8 rays at uniform angles. Pre-compute end coordinates so the path
  // strings stay readable in the markup.
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4
    const r1 = 18
    const r2 = 36
    const x1 = 50 + r1 * Math.cos(angle)
    const y1 = 50 + r1 * Math.sin(angle)
    const x2 = 50 + r2 * Math.cos(angle)
    const y2 = 50 + r2 * Math.sin(angle)
    return { key: i, x1, y1, x2, y2 }
  })
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='surface-area'>
      {/* The rays (exposure). Animated via scale around the center. */}
      <g style={{ transformOrigin: '50px 50px' }} data-anim-target='1'>
        {rays.map((r) => (
          <line
            key={r.key}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke={accent}
            strokeWidth='2.2'
            strokeLinecap='round'
            opacity='0.85'
          />
        ))}
      </g>

      {/* The self at the center. */}
      <circle cx='50' cy='50' r='12' fill={fg} opacity='0.6' />
      <circle cx='50' cy='50' r='6' fill={accent} />
    </svg>
  )
}
