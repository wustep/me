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
    case 'taste':
      return <ArtTaste fg={fg} accent={accent} />
    case 'agency':
      return <ArtAgency fg={fg} accent={accent} />
    case 'expertise':
      return <ArtExpertise fg={fg} accent={accent} />
    case 'tempo':
      return <ArtTempo fg={fg} accent={accent} />
    case 'identity':
      return <ArtIdentity fg={fg} accent={accent} />
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
      <circle cx='52' cy='20' r='6' fill={accent} data-anim-target='1' />
      <rect x='62' y='44' width='12' height='40' fill={fg} opacity='0.5' />
      <rect x='78' y='58' width='12' height='26' fill={fg} opacity='0.5' />
    </svg>
  )
}

/** Evo psych — a stylized double helix. Two strands cross at four
 *  evenly-spaced bond points; bonds pulse in sequence from bottom
 *  to top on hover, like an old signal climbing inherited
 *  circuitry. The strands meet cleanly at the bonds so the figure
 *  reads as a helix rather than two squiggles next to four lines.
 *
 *    data-anim-target='1..4' = each bond dot, animated in sequence.
 */
function ArtEvoPsych({ fg, accent }: { fg: string; accent: string }) {
  // Bond y-positions, evenly spaced from top to bottom. The strands
  // weave through these four x-mirror points, swapping sides at each
  // one so the silhouette reads as a helix.
  const bondYs = [22, 44, 66, 88]
  const innerX = 42
  const outerX = 58
  const railsLeft =
    `M ${innerX} ${bondYs[0]} ` +
    `C ${innerX - 14} ${(bondYs[0] + bondYs[1]) / 2}, ` +
    `${outerX + 14} ${(bondYs[0] + bondYs[1]) / 2}, ` +
    `${outerX} ${bondYs[1]} ` +
    `C ${outerX + 14} ${(bondYs[1] + bondYs[2]) / 2}, ` +
    `${innerX - 14} ${(bondYs[1] + bondYs[2]) / 2}, ` +
    `${innerX} ${bondYs[2]} ` +
    `C ${innerX - 14} ${(bondYs[2] + bondYs[3]) / 2}, ` +
    `${outerX + 14} ${(bondYs[2] + bondYs[3]) / 2}, ` +
    `${outerX} ${bondYs[3]}`
  const railsRight =
    `M ${outerX} ${bondYs[0]} ` +
    `C ${outerX + 14} ${(bondYs[0] + bondYs[1]) / 2}, ` +
    `${innerX - 14} ${(bondYs[0] + bondYs[1]) / 2}, ` +
    `${innerX} ${bondYs[1]} ` +
    `C ${innerX - 14} ${(bondYs[1] + bondYs[2]) / 2}, ` +
    `${outerX + 14} ${(bondYs[1] + bondYs[2]) / 2}, ` +
    `${outerX} ${bondYs[2]} ` +
    `C ${outerX + 14} ${(bondYs[2] + bondYs[3]) / 2}, ` +
    `${innerX - 14} ${(bondYs[2] + bondYs[3]) / 2}, ` +
    `${innerX} ${bondYs[3]}`

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='evo-psych'>
      {/* Two strands that swap sides at each bond. The 'back'
          strand is drawn first at lower opacity so the 'front'
          strand reads in front; each pair of curves looks like a
          twist when overlaid. */}
      <path
        d={railsRight}
        fill='none'
        stroke={fg}
        strokeWidth='1.6'
        strokeLinecap='round'
        opacity='0.32'
      />
      <path
        d={railsLeft}
        fill='none'
        stroke={fg}
        strokeWidth='1.8'
        strokeLinecap='round'
        opacity='0.7'
      />

      {/* Four bond dots — anchor the helix and serve as the
          animation actors. Bottom-most fires first (`target='4'`),
          climbing upward, so the cycle reads as a signal travelling
          up the inherited code. */}
      <circle
        cx='50'
        cy={bondYs[0]}
        r='3'
        fill={fg}
        opacity='0.85'
        data-anim-target='1'
      />
      <circle
        cx='50'
        cy={bondYs[1]}
        r='3'
        fill={fg}
        opacity='0.85'
        data-anim-target='2'
      />
      <circle
        cx='50'
        cy={bondYs[2]}
        r='3'
        fill={fg}
        opacity='0.85'
        data-anim-target='3'
      />
      <circle
        cx='50'
        cy={bondYs[3]}
        r='3.6'
        fill={accent}
        data-anim-target='4'
      />
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
      <g style={{ transformOrigin: '50px 50px' }} data-anim-target='1'>
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
      <circle cx='75' cy='18' r='4.5' fill={accent} data-anim-target='1' />
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
      <g style={{ transformOrigin: '50px 50px' }} data-anim-target='1'>
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

/** Systems — three nodes in a directed cycle. The signal propagates
 *  around the loop: each node takes on the accent fill in sequence,
 *  so the eye reads the loop as flowing rather than as a static
 *  diagram or a meaningless rigid spin.
 *
 *  data-anim-target='1' / '2' / '3' — the three nodes, ordered
 *    A → B → C → A. CSS staggers the same pulse keyframe across
 *    them by ⅓ of the cycle so exactly one is "lit" at a time.
 *
 *  Geometry: equilateral triangle of nodes at the vertices of a
 *  ~28-radius circle around (50, 50). The connecting arcs are
 *  drawn with cubic Béziers so each edge bows gently outward,
 *  giving the loop a clear circular feel without a literal ring.
 *  Arrowheads sit just before each terminal node so the direction
 *  of flow reads at a glance. */
function ArtSystems({ fg, accent }: { fg: string; accent: string }) {
  // Vertex positions (radius 28 around 50,50, starting at the top
  // and going clockwise: top → bottom-right → bottom-left).
  const NODE_R = 7
  const A = { x: 50, y: 22 } // top
  const B = { x: 74.25, y: 64 } // bottom-right
  const C = { x: 25.75, y: 64 } // bottom-left

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='systems'>
      {/* Soft halo behind the loop — gives the composition some
          weight on light card backgrounds without hard chrome. */}
      <circle cx='50' cy='50' r='34' fill={fg} opacity='0.05' />

      {/* Three directed arcs, each from one node to the next. The
          control points pull each arc outward so the three together
          read as a closed circular flow, not a triangle. */}
      <g stroke={fg} strokeWidth='1.6' fill='none' opacity='0.55'>
        <path d={`M ${A.x} ${A.y} C 78 28, 84 50, ${B.x} ${B.y}`} />
        <path d={`M ${B.x} ${B.y} C 60 80, 40 80, ${C.x} ${C.y}`} />
        <path d={`M ${C.x} ${C.y} C 16 50, 22 28, ${A.x} ${A.y}`} />
      </g>

      {/* The three nodes. CSS gives each `data-anim-target` the
          same pulse keyframe but with staggered delays, so the
          accent fill walks around the cycle. */}
      <circle
        cx={A.x}
        cy={A.y}
        r={NODE_R}
        fill={fg}
        data-anim-target='1'
        style={{
          ['--node-fg' as string]: fg,
          ['--node-accent' as string]: accent
        }}
      />
      <circle
        cx={B.x}
        cy={B.y}
        r={NODE_R}
        fill={fg}
        data-anim-target='2'
        style={{
          ['--node-fg' as string]: fg,
          ['--node-accent' as string]: accent
        }}
      />
      <circle
        cx={C.x}
        cy={C.y}
        r={NODE_R}
        fill={fg}
        data-anim-target='3'
        style={{
          ['--node-fg' as string]: fg,
          ['--node-accent' as string]: accent
        }}
      />
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

/** Legibility — a name and its underline.
 *
 *  One headline bar (the name) sitting on a thin underline that draws
 *  itself in beneath it. That's the whole image: a word, underlined.
 *  The underline is the gesture of naming — a stroke of attention
 *  that says "this one, this is what we'll call it."
 *
 *  Animation (card hover): the underline draws in from left to right,
 *  rests, then resets. The headline stays still so the eye lands on
 *  the act of underlining.
 */
function ArtLegibility({ fg, accent }: { fg: string; accent: string }) {
  const X = 22 // shared left edge — anchors name and underline
  const W = 56 // shared width
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='legibility'>
      {/* The name. */}
      <rect x={X} y={46} width={W} height={6} rx={1} fill={fg} opacity={0.9} />

      {/* The underline. Animates via stroke-dashoffset so it draws
          in beneath the name like a pen-stroke of attention. */}
      <line
        data-anim-target='1'
        x1={X}
        y1={60}
        x2={X + W}
        y2={60}
        stroke={accent}
        strokeWidth={2}
        strokeLinecap='round'
        strokeDasharray={W}
        strokeDashoffset={W}
      />
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
      <circle cx='50' cy='28' r='6' fill={accent} data-anim-target='1' />
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
      <g style={{ transformOrigin: '26px 50px' }} data-anim-target='1'>
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

/** Osmosis — two clusters of fixed dots flank a permeable
 *  midline. Two accent dots sit just inside the line, one on
 *  each side; on hover each drifts outward into the cluster on
 *  its own side, fading as it joins. The story: absorb from
 *  whichever environment surrounds you.
 *
 *    data-anim-target='1' = the dot on the left half (drifts left).
 *    data-anim-target='2' = the dot on the right half (drifts right).
 */
function ArtOsmosis({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='osmosis'>
      {/* The permeable midline. Dashed so it reads as a soft
          boundary rather than a wall. */}
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

      {/* Left cluster — three fixed dots sitting at the left edge. */}
      <circle cx='22' cy='30' r='3' fill={fg} opacity='0.55' />
      <circle cx='16' cy='50' r='3' fill={fg} opacity='0.55' />
      <circle cx='24' cy='70' r='3' fill={fg} opacity='0.55' />

      {/* Right cluster — three fixed dots sitting at the right edge. */}
      <circle cx='78' cy='30' r='3' fill={fg} opacity='0.55' />
      <circle cx='84' cy='50' r='3' fill={fg} opacity='0.55' />
      <circle cx='76' cy='70' r='3' fill={fg} opacity='0.55' />

      {/* The two travellers — accent dots sitting just inside the
          midline on opposite halves. Each drifts outward into the
          cluster on its own side. */}
      <circle cx='40' cy='38' r='3.2' fill={accent} data-anim-target='1' />
      <circle cx='60' cy='62' r='3.2' fill={accent} data-anim-target='2' />
    </svg>
  )
}

/** Probabilistic — a bell curve with sample dots dropping under it.
 *
 *  Storyboard (one 3.2s loop, paused until hover/selection):
 *
 *     0ms   curve is drawn (steady), seven sample dots sit at baseline
 *           with low opacity. The "sampler" marker rests at far left.
 *   200ms   sampler glides left → right along the top of the curve,
 *           tracing the distribution.
 *   ~each
 *   400ms   as the sampler passes over a column, that column's dot
 *           "lights up" — bouncing up toward the curve at a height
 *           proportional to the curve's value (tall in the middle,
 *           short at the tails) — then settles. This visualises
 *           drawing samples: outcomes near the mean happen often and
 *           with conviction, outcomes in the tails are dim and rare.
 *  3000ms   sampler fades out at the right edge; column highlights
 *           decay back to baseline; loop restarts.
 *
 *  Implementation notes
 *  ────────────────────
 *  • The curve itself is static — the *interpretation* (the moving
 *    sampler + reactive columns) carries the meaning. A "breathing"
 *    curve felt arbitrary; sampling under a fixed distribution is
 *    what probabilistic thinking actually looks like.
 *  • Each column = a thin guide tick + a dot. The dot's CSS animation
 *    translates it up by a column-specific distance encoded as a CSS
 *    custom property (`--lift`), so we share one keyframe across all
 *    columns and stagger them with `animation-delay`.
 *  • The sampler is a small accent-coloured dot that rides along an
 *    invisible horizontal track at y≈40; its x is animated via
 *    `translateX`. We don't try to follow the curve precisely — the
 *    mental model ("scanning across outcomes") reads cleanly with a
 *    straight horizontal sweep. */
function ArtProbabilistic({ fg, accent }: { fg: string; accent: string }) {
  // Seven sample columns spanning x = 18..82. Lift heights mirror a
  // bell curve: tall in the middle (column 4 ≈ 36px lift), short at
  // the tails (≈ 6px). Stagger order is left-to-right so the bounce
  // chases the sampler.
  const columns = [
    { x: 18, lift: 6, delay: 0.2 },
    { x: 28, lift: 14, delay: 0.6 },
    { x: 38, lift: 26, delay: 1.0 },
    { x: 50, lift: 36, delay: 1.4 },
    { x: 62, lift: 26, delay: 1.8 },
    { x: 72, lift: 14, delay: 2.2 },
    { x: 82, lift: 6, delay: 2.6 }
  ]

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='probabilistic'>
      {/* Baseline */}
      <line
        x1='10'
        y1='76'
        x2='90'
        y2='76'
        stroke={fg}
        strokeWidth='1'
        opacity='0.35'
      />

      {/* Bell curve (static, drawn slightly thicker so it reads as
          the "underlying distribution" rather than a passing stroke). */}
      <path
        d='M 12 76 C 26 76, 32 76, 38 60 C 44 36, 56 36, 62 60 C 68 76, 74 76, 88 76'
        stroke={fg}
        strokeWidth='2'
        fill='none'
        opacity='0.55'
        strokeLinecap='round'
      />

      {/* Faint vertical ticks for each sample column — these give the
          eye a grid to register the bouncing dots against. */}
      {columns.map((c) => (
        <line
          key={`tick-${c.x}`}
          x1={c.x}
          y1='73'
          x2={c.x}
          y2='77'
          stroke={fg}
          strokeWidth='1'
          opacity='0.3'
        />
      ))}

      {/* Sample dots. Each one rides at baseline (cy=80) and uses a
          per-column `--lift` to translate upward toward the curve. */}
      {columns.map((c, i) => (
        <circle
          key={`dot-${c.x}`}
          cx={c.x}
          cy='80'
          r={i === 3 ? 2.8 : 2.2}
          fill={i === 3 ? accent : fg}
          opacity={i === 3 ? 1 : 0.55}
          data-anim-target='dot'
          style={
            {
              transformOrigin: `${c.x}px 80px`,
              animationDelay: `${c.delay}s`,
              ['--lift' as string]: `${c.lift}px`
            } as React.CSSProperties
          }
        />
      ))}

      {/* Sampler — the moving marker that "scans" across outcomes.
          Sits hidden at left, sweeps across, fades. transformOrigin
          centred so its subtle scale pulse stays put. */}
      <g data-anim-target='sampler' style={{ transformOrigin: '14px 40px' }}>
        <circle cx='14' cy='40' r='2.6' fill={accent} />
        <line
          x1='14'
          y1='42'
          x2='14'
          y2='74'
          stroke={accent}
          strokeWidth='1'
          opacity='0.45'
        />
      </g>
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
      <line
        x1='14'
        y1='72'
        x2='86'
        y2='72'
        stroke={fg}
        strokeWidth='1'
        opacity='0.3'
      />

      {/* The figure (head + torso). */}
      <circle cx='50' cy='34' r='8' fill={fg} opacity='0.6' />
      <path d='M 38 70 Q 38 50 50 50 Q 62 50 62 70 Z' fill={fg} opacity='0.6' />

      {/* The cast shadow — accent color, longer and slightly distorted
          relative to the figure, so it reads as a *projection* rather
          than a literal shadow. */}
      <g style={{ transformOrigin: '50px 72px' }} data-anim-target='1'>
        <ellipse
          cx='50'
          cy='73'
          rx='22'
          ry='2.4'
          fill={accent}
          opacity='0.85'
        />
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
        <path d='M 50 22 L 30 76 L 70 76 Z' fill={accent} opacity='0.45' />
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
        <circle
          cx='50'
          cy='50'
          r='8'
          fill='none'
          stroke={accent}
          strokeWidth='1.2'
          opacity='0.5'
        />
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
/** Taste — five small swatches in a row. One is the accent (the
 *  "chosen" one). On hover the choice walks across the row before
 *  settling on its true favorite — discrimination, comparison,
 *  picking. The story: taste is a filter you apply across options.
 *
 *    data-anim-target='1' = the chosen-marker (the accent dot above
 *      a swatch; slides between swatches and settles).
 */
function ArtTaste({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='taste'>
      {/* Five swatch tiles in a row. Slightly varied opacity reads
          as a curated palette rather than a gradient. */}
      <g fill={fg}>
        <rect x='14' y='44' width='12' height='16' opacity='0.5' rx='1.6' />
        <rect x='30' y='44' width='12' height='16' opacity='0.65' rx='1.6' />
        <rect x='46' y='44' width='12' height='16' opacity='0.45' rx='1.6' />
        <rect x='62' y='44' width='12' height='16' opacity='0.55' rx='1.6' />
        <rect x='78' y='44' width='12' height='16' opacity='0.4' rx='1.6' />
      </g>

      {/* A baseline — the ground of comparison. Subtle, just enough
          to anchor the row visually. */}
      <line
        x1='10'
        y1='66'
        x2='94'
        y2='66'
        stroke={fg}
        strokeWidth='0.8'
        opacity='0.32'
      />

      {/* The chosen-marker. Sits above the second swatch at rest;
          on hover it walks the row and lands on its real pick. */}
      <g data-anim-target='1'>
        <polygon points='36,32 30,38 42,38' fill={accent} />
        <circle cx='36' cy='28' r='3.2' fill={accent} />
      </g>
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
      {/* Shaft stops short of the tip so the triangular head sits
          flush at the arrow's point — together they read as one
          continuous arrow rather than a line with a notch. */}
      <g data-anim-target='1' style={{ transformOrigin: '50px 52px' }}>
        <line
          x1='32'
          y1='52'
          x2='78'
          y2='52'
          stroke={accent}
          strokeWidth='3.2'
          strokeLinecap='round'
        />
        <polygon points='86,52 74,45 74,59' fill={accent} />
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
      <line
        x1='14'
        y1='80'
        x2='86'
        y2='80'
        stroke={fg}
        strokeWidth='0.8'
        opacity='0.4'
      />
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
          swings around it on hover. The bob sits ~1/3 of the way down
          from the top of the arm, like a real metronome weight at a
          moderate-tempo setting. */}
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
        <circle cx='50' cy='44' r='4.6' fill={accent} />
      </g>
    </svg>
  )
}

/** Identity — a dashed outer ring (the loose, permeable "self")
 *  containing an inner shape that morphs between configurations. The
 *  story: identity is a construct, not a fact — the outer boundary
 *  is soft, and what fills it can change.
 *
 *    data-anim-target='1' = the morphing inner shape (rotates +
 *      scales between two configurations on hover, suggesting a
 *      self in flux).
 *    data-anim-target='2' = the dashed boundary (slowly rotates,
 *      reinforcing that the edge is not fixed).
 */
function ArtIdentity({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='identity'>
      {/* The outer "self" — dashed because the boundary is permeable
          and editable. Slowly rotates on hover. */}
      <g data-anim-target='2' style={{ transformOrigin: '50px 50px' }}>
        <circle
          cx='50'
          cy='50'
          r='30'
          fill='none'
          stroke={fg}
          strokeWidth='1.4'
          strokeDasharray='3 4'
          opacity='0.6'
        />
      </g>

      {/* The inner shape — what currently fills the self. A rotated
          square that morphs into a different orientation on hover,
          suggesting an updateable configuration. */}
      <g data-anim-target='1' style={{ transformOrigin: '50px 50px' }}>
        <rect
          x='34'
          y='34'
          width='32'
          height='32'
          fill={accent}
          opacity='0.85'
          transform='rotate(45 50 50)'
        />
      </g>

      {/* A small fixed core — the part that persists across edits. */}
      <circle cx='50' cy='50' r='3' fill={fg} opacity='0.75' />
    </svg>
  )
}
