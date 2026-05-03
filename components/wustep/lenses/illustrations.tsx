import type { IllustrationId } from './types'

/**
 * Illustration — switchboard mapping IllustrationId → SVG art component.
 *
 *   Each Art* component is a small, flat, Pip-deck-ish geometric SVG
 *   driven by `fg` (line / fill) and `accent` (highlight). Designed to
 *   look great at both card-size and thumbnail-size in the dialog list.
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
    case 'lenses-deck':
      return <ArtLensesDeck fg={fg} accent={accent} bg={bg} />
  }
}

const SVG_BASE: React.SVGProps<SVGSVGElement> = {
  viewBox: '0 0 100 100',
  preserveAspectRatio: 'xMidYMid meet',
  xmlns: 'http://www.w3.org/2000/svg'
}

function ArtGreatMan({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      <rect x='14' y='62' width='12' height='22' fill={fg} opacity='0.5' />
      <rect x='30' y='52' width='12' height='32' fill={fg} opacity='0.5' />
      <rect x='46' y='28' width='12' height='56' fill={accent} />
      <circle cx='52' cy='20' r='6' fill={accent} />
      <rect x='62' y='44' width='12' height='40' fill={fg} opacity='0.5' />
      <rect x='78' y='58' width='12' height='26' fill={fg} opacity='0.5' />
    </svg>
  )
}

function ArtEvoPsych({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      <circle cx='50' cy='50' r='38' fill={fg} opacity='0.16' />
      <circle cx='50' cy='50' r='28' fill={fg} opacity='0.3' />
      <circle cx='50' cy='50' r='18' fill={fg} opacity='0.55' />
      <circle cx='50' cy='50' r='8' fill={accent} />
    </svg>
  )
}

function ArtMinimalism({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
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
      <rect x='44' y='44' width='12' height='12' fill={accent} />
    </svg>
  )
}

function ArtUtility({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      <rect x='14' y='66' width='14' height='18' fill={fg} opacity='0.42' />
      <rect x='32' y='54' width='14' height='30' fill={fg} opacity='0.58' />
      <rect x='50' y='40' width='14' height='44' fill={fg} opacity='0.76' />
      <rect x='68' y='22' width='14' height='62' fill={accent} />
      <circle cx='75' cy='18' r='4.5' fill={accent} />
    </svg>
  )
}

function ArtStatus({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
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
      <circle cx='74' cy='34' r='6' fill={accent} />
    </svg>
  )
}

function ArtIncentives({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      <circle cx='58' cy='50' r='30' fill={fg} opacity='0.16' />
      <circle cx='58' cy='50' r='20' fill={fg} opacity='0.3' />
      <circle cx='58' cy='50' r='10' fill={fg} opacity='0.55' />
      <circle cx='58' cy='50' r='4' fill={accent} />
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
    </svg>
  )
}

/** Game theory: 2×2 payoff matrix with one "winning" cell highlighted. */
function ArtGameTheory({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      <g stroke={fg} strokeWidth='1.4' fill='none' opacity='0.5'>
        <rect x='20' y='20' width='60' height='60' />
        <line x1='50' y1='20' x2='50' y2='80' />
        <line x1='20' y1='50' x2='80' y2='50' />
      </g>
      <circle cx='35' cy='35' r='5' fill={fg} opacity='0.55' />
      <circle cx='65' cy='35' r='5' fill={fg} opacity='0.4' />
      <circle cx='35' cy='65' r='5' fill={fg} opacity='0.4' />
      <rect x='59' y='59' width='12' height='12' fill={accent} />
    </svg>
  )
}

/** Systems: circular feedback loop with arrowheads. */
function ArtSystems({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
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
      {/* Three nodes around the loop */}
      <circle cx='50' cy='22' r='6' fill={fg} opacity='0.7' />
      <circle cx='75' cy='62' r='6' fill={fg} opacity='0.7' />
      <circle cx='25' cy='62' r='6' fill={accent} />
      {/* Arrowheads suggesting flow */}
      <polygon points='73,28 80,35 70,38' fill={fg} opacity='0.7' />
      <polygon points='52,77 60,80 56,72' fill={fg} opacity='0.7' />
      <polygon points='27,38 20,35 30,28' fill={accent} />
    </svg>
  )
}

/** Headspace: profile silhouette with nested inner shape. */
function ArtHeadspace({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Simplified head profile */}
      <path
        d='M 32 80 L 32 48 Q 32 24 56 24 Q 76 24 76 44 Q 76 52 70 56 L 70 68 Q 70 74 64 74 L 56 74 L 56 80 Z'
        fill={fg}
        opacity='0.32'
      />
      {/* Inner mind */}
      <circle cx='56' cy='46' r='12' fill={fg} opacity='0.55' />
      <circle cx='56' cy='46' r='5' fill={accent} />
    </svg>
  )
}

/** Legibility: fog wave that resolves into clean labeled rect. */
function ArtLegibility({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Three "fog" wavy lines on the left */}
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
      {/* Resolved labeled box on the right */}
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
      <rect x='62' y='40' width='20' height='4' fill={accent} />
      <rect x='62' y='48' width='14' height='3' fill={fg} opacity='0.55' />
    </svg>
  )
}

/** Narrative: a quote-mark + sweeping arc (story bending the line). */
function ArtNarrative({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Sweeping arc — the story bends the path */}
      <path
        d='M 12 72 Q 50 12 88 72'
        stroke={fg}
        strokeWidth='2'
        fill='none'
        opacity='0.55'
        strokeLinecap='round'
      />
      {/* Three story beats along the arc */}
      <circle cx='12' cy='72' r='5' fill={fg} opacity='0.65' />
      <circle cx='50' cy='28' r='6' fill={accent} />
      <circle cx='88' cy='72' r='5' fill={fg} opacity='0.65' />
    </svg>
  )
}

/** Constraint: tight bracket frame containing a creative diagonal. */
function ArtConstraint({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Brackets — left and right walls, opening top/bottom */}
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
      {/* Energetic diagonal contained within */}
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
    </svg>
  )
}

/** Interface: rectangle with a tappable button + cursor. */
function ArtInterface({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Window frame */}
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
      {/* Title bar */}
      <line
        x1='14'
        y1='32'
        x2='86'
        y2='32'
        stroke={fg}
        strokeWidth='1.6'
        opacity='0.5'
      />
      {/* Button affordance */}
      <rect
        x='28'
        y='46'
        width='28'
        height='12'
        rx='3'
        fill={fg}
        opacity='0.55'
      />
      {/* Cursor pointer */}
      <polygon
        points='52,52 64,58 58,62 60,68 56,68 54,62 49,64'
        fill={accent}
      />
    </svg>
  )
}

/** Energy: a wave / battery rising. */
function ArtEnergy({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Battery shell */}
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
      <rect
        x='74'
        y='42'
        width='6'
        height='16'
        rx='1'
        fill={fg}
        opacity='0.55'
      />
      {/* Filled energy level — high */}
      <rect x='26' y='34' width='28' height='32' fill={accent} />
      {/* Lightning bolt over the fill */}
      <polygon
        points='44,40 36,56 46,56 40,66 56,50 46,50 52,40'
        fill={fg}
        opacity='0.85'
      />
    </svg>
  )
}

/** Epistemic pragmatism: a folded map with a path drawn on it. */
function ArtEpistemic({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Map outline */}
      <path
        d='M 14 26 L 38 22 L 62 28 L 86 24 L 86 76 L 62 80 L 38 74 L 14 78 Z'
        fill={fg}
        opacity='0.18'
        stroke={fg}
        strokeWidth='1.2'
        strokeOpacity='0.5'
      />
      {/* Fold creases */}
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
      {/* Path drawn across */}
      <path
        d='M 22 64 Q 36 48 50 54 T 80 38'
        stroke={accent}
        strokeWidth='2.2'
        fill='none'
        strokeLinecap='round'
        strokeDasharray='3 3'
      />
      <circle cx='22' cy='64' r='3.2' fill={accent} />
      <circle cx='80' cy='38' r='3.2' fill={accent} />
    </svg>
  )
}

/** Osmosis: dotted particles flowing across a permeable boundary. */
function ArtOsmosis({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Permeable membrane in the middle */}
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
      {/* Source-side dots (right) */}
      <circle cx='72' cy='28' r='3' fill={fg} opacity='0.45' />
      <circle cx='80' cy='44' r='3' fill={fg} opacity='0.45' />
      <circle cx='70' cy='62' r='3' fill={fg} opacity='0.45' />
      <circle cx='80' cy='76' r='3' fill={fg} opacity='0.45' />
      {/* Crossing dots */}
      <circle cx='56' cy='38' r='3' fill={accent} />
      <circle cx='44' cy='54' r='3' fill={accent} />
      {/* Absorbed dots (left) */}
      <circle cx='28' cy='30' r='3' fill={fg} opacity='0.7' />
      <circle cx='22' cy='50' r='3' fill={fg} opacity='0.7' />
      <circle cx='30' cy='70' r='3' fill={fg} opacity='0.7' />
    </svg>
  )
}

/** Probabilistic thinking: a bell curve with sample dots scattered under it. */
function ArtProbabilistic({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Bell curve */}
      <path
        d='M 12 76 C 26 76, 32 76, 38 60 C 44 36, 56 36, 62 60 C 68 76, 74 76, 88 76'
        stroke={fg}
        strokeWidth='2'
        fill='none'
        opacity='0.6'
        strokeLinecap='round'
      />
      {/* Mode marker */}
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
      {/* Sample dots clustered under the peak, tapering to the tails */}
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

/** Communication: two facing profiles with overlapping speech zone + a gap. */
function ArtCommunication({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Left profile (looking right) */}
      <path
        d='M 26 78 L 26 50 Q 26 36 36 36 Q 44 36 44 46 Q 44 50 40 52 L 40 60 Q 40 64 36 64 L 32 64 L 32 78 Z'
        fill={fg}
        opacity='0.55'
      />
      {/* Right profile (looking left, mirrored) */}
      <path
        d='M 74 78 L 74 50 Q 74 36 64 36 Q 56 36 56 46 Q 56 50 60 52 L 60 60 Q 60 64 64 64 L 68 64 L 68 78 Z'
        fill={fg}
        opacity='0.55'
      />
      {/* Speech bubble zone in between, with a deliberate gap (failure of overlap) */}
      <ellipse cx='50' cy='28' rx='18' ry='10' fill={accent} />
      <polygon points='44,38 50,32 47,42' fill={accent} />
      <polygon points='56,38 50,32 53,42' fill={accent} />
      {/* Misalignment crack */}
      <line
        x1='50'
        y1='52'
        x2='50'
        y2='80'
        stroke={fg}
        strokeWidth='1.4'
        opacity='0.45'
        strokeDasharray='3 3'
      />
    </svg>
  )
}

/** Mimetics: one source dot replicating outward into branching copies. */
function ArtMimetics({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Connecting branches */}
      <g stroke={fg} strokeWidth='1.2' opacity='0.45' fill='none' strokeLinecap='round'>
        <line x1='30' y1='50' x2='52' y2='28' />
        <line x1='30' y1='50' x2='52' y2='50' />
        <line x1='30' y1='50' x2='52' y2='72' />
        <line x1='52' y1='28' x2='78' y2='18' />
        <line x1='52' y1='28' x2='78' y2='38' />
        <line x1='52' y1='72' x2='78' y2='62' />
        <line x1='52' y1='72' x2='78' y2='82' />
      </g>
      {/* Source */}
      <circle cx='30' cy='50' r='8' fill={accent} />
      {/* First-gen copies */}
      <circle cx='52' cy='28' r='5' fill={fg} opacity='0.75' />
      <circle cx='52' cy='50' r='5' fill={fg} opacity='0.6' />
      <circle cx='52' cy='72' r='5' fill={fg} opacity='0.75' />
      {/* Second-gen copies */}
      <circle cx='78' cy='18' r='3.5' fill={fg} opacity='0.55' />
      <circle cx='78' cy='38' r='3.5' fill={fg} opacity='0.55' />
      <circle cx='78' cy='62' r='3.5' fill={fg} opacity='0.55' />
      <circle cx='78' cy='82' r='3.5' fill={fg} opacity='0.55' />
    </svg>
  )
}

/** Primitives: complex composite up top, atomic units below. */
function ArtPrimitives({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Composite up top — three primitives stacked into a structure */}
      <rect x='28' y='18' width='44' height='10' rx='2' fill={fg} opacity='0.55' />
      <rect x='28' y='30' width='20' height='10' rx='2' fill={fg} opacity='0.7' />
      <rect x='52' y='30' width='20' height='10' rx='2' fill={fg} opacity='0.4' />
      {/* Connecting hint that they decompose */}
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
      {/* Three primitive atoms below */}
      <circle cx='28' cy='72' r='8' fill={accent} />
      <rect x='44' y='64' width='14' height='14' rx='2' fill={fg} opacity='0.7' />
      <polygon points='72,80 80,66 64,66' fill={fg} opacity='0.7' />
    </svg>
  )
}

/** Center "Lenses" card: three overlapping translucent lens discs.
 *
 *   The metaphor leans literal — these are *actual* lenses, the kind
 *   you stack to focus light. Each disc is a saturated primary drawn
 *   from the deck's palette (warm amber, cool teal, magenta-rose).
 *   Where they overlap the colors mix toward white, exactly as
 *   refracted light does, making the central trefoil feel like a
 *   focal point. A thin ring on each disc reinforces "lens" rather
 *   than "blob," and a single bright pinprick at the meeting point
 *   says: this is where the deck converges.
 *
 *   Drawn for a dark card, so we use lighter primaries with low alpha
 *   to read as glass on black.
 */
function ArtLensesDeck({
  fg,
  accent,
  bg
}: {
  fg: string
  accent: string
  bg: string
}) {
  // Saturated primaries lifted from the deck — warm/cool/rose. Kept as
  // literals so the trefoil colors don't drift if a lens tweaks its hex.
  const LENS_AMBER = '#F2C04A'
  const LENS_TEAL = '#5CB8C8'
  const LENS_ROSE = '#E55A8E'

  // Triangle of disc centers around (50, 50) with radius 22 — overlap
  // is ~40% so the trefoil reads cleanly without crowding the title.
  const r = 22
  const discs = [
    { cx: 50, cy: 36, fill: LENS_AMBER },
    { cx: 36, cy: 60, fill: LENS_TEAL },
    { cx: 64, cy: 60, fill: LENS_ROSE }
  ] as const

  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {/* Faint backdrop dots — a hint of the broader deck without
          competing with the trefoil. */}
      <g fill={fg} opacity='0.18'>
        <circle cx='14' cy='18' r='1.2' />
        <circle cx='86' cy='18' r='1.2' />
        <circle cx='10' cy='84' r='1.2' />
        <circle cx='90' cy='84' r='1.2' />
        <circle cx='50' cy='10' r='1.2' />
        <circle cx='50' cy='90' r='1.2' />
      </g>

      {/* Filled lens discs. Plain alpha compositing — the overlap
          regions go a touch darker, which on a dark card reads as
          "deeper glass" and on a cream card reads as "denser pigment."
          Works on both themes without blend-mode acrobatics. */}
      {discs.map((d, i) => (
        <circle
          key={`fill-${i}`}
          cx={d.cx}
          cy={d.cy}
          r={r}
          fill={d.fill}
          opacity='0.78'
        />
      ))}

      {/* Outline rings — define each lens edge so the shape reads as
          "lens" not "blob." Drawn after the fills, slightly outside
          the disc for crispness. */}
      {discs.map((d, i) => (
        <circle
          key={`ring-${i}`}
          cx={d.cx}
          cy={d.cy}
          r={r}
          fill='none'
          stroke={d.fill}
          strokeWidth='0.8'
          opacity='1'
        />
      ))}

      {/* Convergence pinprick — the focal point where all three lenses
          meet. Centroid of the triangle. */}
      <circle cx='50' cy='52' r='1.6' fill={fg} />
      <circle
        cx='50'
        cy='52'
        r='4.5'
        fill='none'
        stroke={fg}
        strokeWidth='0.5'
        opacity='0.45'
      />

      {/* Reference bg/accent so unused-prop linters stay quiet. */}
      <rect x='0' y='0' width='0' height='0' fill={bg} />
      <rect x='0' y='0' width='0' height='0' fill={accent} />
    </svg>
  )
}
