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
    case 'second-order':
      return <ArtSecondOrder fg={fg} accent={accent} />
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
    case 'momentum':
      return <ArtMomentum fg={fg} accent={accent} />
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

/** Second-order effects — a stone dropped in still water sends rings
 *  outward, and the rings grow bigger as they travel. The accent dot
 *  at center is the direct action; the three concentric rings are
 *  the cascading consequences. The story: the thing you dropped in
 *  is never the thing that actually moves the surface — the rings are.
 *
 *    data-anim-target='1','2','3' = the three rings, each expanding
 *    and fading on its own staggered timing so you read an ongoing
 *    emission rather than a single pulse.
 */
function ArtSecondOrder({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='second-order'>
      {/* Static "field" rings — drawn at the radii a real ripple would
          occupy mid-cascade. They make the at-rest composition look
          like the surface of a pond already in motion, rather than a
          single dot waiting to be tapped. The animated rings ride on
          top of these and continue the emission outward. */}
      <circle
        cx='50'
        cy='50'
        r='18'
        fill='none'
        stroke={fg}
        strokeWidth='1.4'
        opacity='0.5'
      />
      <circle
        cx='50'
        cy='50'
        r='28'
        fill='none'
        stroke={fg}
        strokeWidth='1.2'
        opacity='0.32'
      />
      <circle
        cx='50'
        cy='50'
        r='38'
        fill='none'
        stroke={fg}
        strokeWidth='1'
        opacity='0.18'
      />

      {/* Centered solid dot: the triggering action. */}
      <circle cx='50' cy='50' r='4' fill={accent} />

      {/* Three animated rings. Start radii are tight around the
          center; the keyframes scale them outward and fade them off,
          staggered so the rings continuously emit on top of the
          static field above. */}
      <circle
        cx='50'
        cy='50'
        r='10'
        fill='none'
        stroke={fg}
        strokeWidth='1.6'
        opacity='0.85'
        data-anim-target='1'
        style={{ transformOrigin: '50px 50px' }}
      />
      <circle
        cx='50'
        cy='50'
        r='10'
        fill='none'
        stroke={fg}
        strokeWidth='1.4'
        opacity='0.6'
        data-anim-target='2'
        style={{ transformOrigin: '50px 50px' }}
      />
      <circle
        cx='50'
        cy='50'
        r='10'
        fill='none'
        stroke={fg}
        strokeWidth='1.2'
        opacity='0.4'
        data-anim-target='3'
        style={{ transformOrigin: '50px 50px' }}
      />
    </svg>
  )
}

/** Evo psych — a three-generation family tree. Four ancestor dots
 *  pair up into two parents, who join into one descendant (the
 *  accent) at the bottom. The tree is drawn with right-angled
 *  "pedigree chart" connectors — horizontal sibling bars meeting
 *  short vertical drops — which is the classic visual grammar for
 *  inheritance.
 *
 *  Animation: a "trait" travels down the tree generation by
 *  generation. The four ancestor dots pulse first (in pairs), the
 *  pulse then descends to the two parents, then to the descendant
 *  — so the eye reads the loop as inherited material flowing
 *  forward in time, top → bottom. The descendant lights up with
 *  the accent color at the end of the cycle, the moment the
 *  inheritance has "arrived."
 *
 *    data-anim-target='1' = the four ancestor dots (top row).
 *    data-anim-target='2' = the two parent dots (middle row).
 *    data-anim-target='3' = the descendant dot (bottom, accent).
 *    data-anim-target='trunk-l' / 'trunk-r' = the two upper
 *      pedigree connectors that drop from each parent-pair bar
 *      down to the parent dot. Their stroke draws on as the pulse
 *      descends.
 *    data-anim-target='trunk-c' = the lower connector that drops
 *      from the parents' sibling bar down to the descendant.
 */
function ArtEvoPsych({ fg, accent }: { fg: string; accent: string }) {
  // Three generations on three rows.
  // Row Y positions chosen so the tree breathes inside the 100×100
  // viewBox without crowding the edges or the card title below.
  const Y_GP = 22
  const Y_P = 54
  const Y_C = 82

  // Grandparent (ancestor) x-positions, arranged in two pairs.
  const GP = [22, 38, 62, 78] as const

  // Each pair of grandparents joins at a sibling bar and drops to
  // a parent below it. The parents sit at the midpoint of each
  // pair, then themselves join at a shared bar that drops to the
  // single descendant in the middle.
  const P_LEFT_X = (GP[0] + GP[1]) / 2 // = 30
  const P_RIGHT_X = (GP[2] + GP[3]) / 2 // = 70
  const C_X = (P_LEFT_X + P_RIGHT_X) / 2 // = 50

  // Vertical position of the two horizontal "sibling bars" — one
  // joining each grandparent pair, and one joining the parents.
  const BAR_GP_Y = (Y_GP + Y_P) / 2 - 2 // sits in upper half between rows
  const BAR_P_Y = (Y_P + Y_C) / 2 - 2

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='evo-psych'>
      {/* ─── Generation 1 → 2 connectors ───────────────────────────
          For each grandparent pair: two short stems dropping from
          each grandparent to a horizontal bar, then a single drop
          from the bar down to the parent. Drawn as one continuous
          path per side so the pulse can travel along it. */}
      <path
        d={
          `M ${GP[0]} ${Y_GP} V ${BAR_GP_Y} ` +
          `H ${GP[1]} V ${Y_GP} ` +
          `M ${P_LEFT_X} ${BAR_GP_Y} V ${Y_P}`
        }
        fill='none'
        stroke={fg}
        strokeWidth='1.4'
        strokeLinecap='round'
        opacity='0.55'
        data-anim-target='trunk-l'
      />
      <path
        d={
          `M ${GP[2]} ${Y_GP} V ${BAR_GP_Y} ` +
          `H ${GP[3]} V ${Y_GP} ` +
          `M ${P_RIGHT_X} ${BAR_GP_Y} V ${Y_P}`
        }
        fill='none'
        stroke={fg}
        strokeWidth='1.4'
        strokeLinecap='round'
        opacity='0.55'
        data-anim-target='trunk-r'
      />

      {/* ─── Generation 2 → 3 connector ────────────────────────────
          Parents' sibling bar plus the central drop to the
          descendant. */}
      <path
        d={
          `M ${P_LEFT_X} ${Y_P} V ${BAR_P_Y} ` +
          `H ${P_RIGHT_X} V ${Y_P} ` +
          `M ${C_X} ${BAR_P_Y} V ${Y_C}`
        }
        fill='none'
        stroke={fg}
        strokeWidth='1.4'
        strokeLinecap='round'
        opacity='0.55'
        data-anim-target='trunk-c'
      />

      {/* ─── Generation 1: four ancestors ─────────────────────────
          All four share `target='1'` so they pulse together as
          "the ancestors" at the start of each cycle. */}
      {GP.map((x, i) => (
        <circle
          key={`gp-${i}`}
          cx={x}
          cy={Y_GP}
          r='3'
          fill={fg}
          opacity='0.7'
          data-anim-target='1'
          style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
        />
      ))}

      {/* ─── Generation 2: two parents ────────────────────────────
          Both share `target='2'` so they pulse together one beat
          after the ancestors. */}
      {[P_LEFT_X, P_RIGHT_X].map((x, i) => (
        <circle
          key={`p-${i}`}
          cx={x}
          cy={Y_P}
          r='3.4'
          fill={fg}
          opacity='0.85'
          data-anim-target='2'
          style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
        />
      ))}

      {/* ─── Generation 3: the descendant ─────────────────────────
          The accent-colored "you" — what the inheritance arrives
          at. Slightly larger so the eye lands here last. */}
      <circle
        cx={C_X}
        cy={Y_C}
        r='4.2'
        fill={accent}
        data-anim-target='3'
        style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
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

/** Utility — a balance scale weighing two options. One pan dips
 *  heavier than the other; that pan's option is the one with the
 *  greater utility, the choice the agent will take. The story:
 *  every choice is a private weighing of payoffs.
 *
 *  The silhouette is the classic "scales of justice" shape: a
 *  weighted base supports a vertical post, the post tapers up to
 *  a knife-edge pivot, the beam crosses through the pivot, and
 *  triangular pans hang from the beam's ends via V-shaped struts.
 *  The accent pan rides heavier so its side always finishes lower
 *  — utility expressed as the side that gets chosen.
 *
 *    data-anim-target='1' = the beam + pans group (rotates around
 *      the pivot at the top of the post).
 */
function ArtUtility({ fg, accent }: { fg: string; accent: string }) {
  // The pivot — top of the post, where the beam balances. The
  // beam group rotates around this point.
  const PIVOT = { x: 50, y: 38 }

  // Pan tip x-positions (where the V struts meet at the bowl).
  const LEFT_X = 22
  const RIGHT_X = 78
  // Pan width (outer rim) — half-spread either side of the tip.
  const PAN_HALF = 11
  // Vertical drop from the beam to the bowl rim.
  const PAN_DROP = 18
  // Beam y at the pivot (the pan struts rise from the beam ends
  // up to here too — same axis since pans hang from the beam).
  const BEAM_Y = PIVOT.y

  // Pan rim Y (where the bowl curve sits).
  const RIM_Y = BEAM_Y + PAN_DROP

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='utility'>
      {/* ── Static stand: base, post, pivot peak. These don't
          rotate — only the beam + pans tilt above. */}

      {/* Flared base — wider at the bottom for visual weight, like
          a real scale's plinth. */}
      <path
        d='M 30 86 Q 30 80 38 80 L 62 80 Q 70 80 70 86 Z'
        fill={fg}
        opacity='0.7'
      />
      {/* Thin shadow line under the base so it reads as resting on
          a surface. */}
      <line
        x1='26'
        y1='87'
        x2='74'
        y2='87'
        stroke={fg}
        strokeWidth='0.8'
        opacity='0.35'
        strokeLinecap='round'
      />

      {/* Central post — runs from the top of the base up to the
          pivot peak. Thicker than before so it reads as the solid
          stand of the instrument. */}
      <rect
        x='47.4'
        y={PIVOT.y}
        width='5.2'
        height={80 - PIVOT.y}
        fill={fg}
        opacity='0.7'
      />

      {/* Pivot peak — a small triangle at the very top of the post,
          giving the beam a knife-edge to balance on. Sits at the
          pivot point (50, 38). */}
      <polygon
        points={`${PIVOT.x - 4},${PIVOT.y + 1} ${PIVOT.x + 4},${PIVOT.y + 1} ${PIVOT.x},${PIVOT.y - 5}`}
        fill={fg}
        opacity='0.85'
      />

      {/* ── Tilting group: beam, pan struts, pans, weights. All
          children rotate together around the pivot. */}
      <g
        style={{ transformOrigin: `${PIVOT.x}px ${PIVOT.y}px` }}
        data-anim-target='1'
      >
        {/* The beam — a long, thin horizontal bar passing through
            the pivot. Slightly tapered toward each end via stroke
            geometry; we draw it as a thick line with rounded caps
            so it reads as a forged metal arm. */}
        <line
          x1={LEFT_X}
          y1={BEAM_Y}
          x2={RIGHT_X}
          y2={BEAM_Y}
          stroke={fg}
          strokeWidth='3'
          strokeLinecap='round'
          opacity='0.85'
        />

        {/* Beam-end caps — small dots at each end of the beam where
            the pan struts attach. Subtle visual grace note that
            tells the eye "this is where the pan hangs from." */}
        <circle cx={LEFT_X} cy={BEAM_Y} r='1.4' fill={fg} opacity='0.85' />
        <circle cx={RIGHT_X} cy={BEAM_Y} r='1.4' fill={fg} opacity='0.85' />

        {/* ── Left pan: V-strut + bowl + weight. */}
        {/* Strut: two thin lines V-ing from the beam end down to
            the bowl rim's left and right corners. Reads as the
            chains/wires holding the pan. */}
        <g
          stroke={fg}
          strokeWidth='1'
          strokeLinecap='round'
          opacity='0.6'
          fill='none'
        >
          <line x1={LEFT_X} y1={BEAM_Y} x2={LEFT_X - PAN_HALF} y2={RIM_Y} />
          <line x1={LEFT_X} y1={BEAM_Y} x2={LEFT_X + PAN_HALF} y2={RIM_Y} />
        </g>
        {/* Bowl — flat top rim plus a curved bottom, like the dish
            in the reference. Drawn as a single closed path. */}
        <path
          d={`M ${LEFT_X - PAN_HALF} ${RIM_Y} L ${LEFT_X + PAN_HALF} ${RIM_Y} Q ${LEFT_X} ${RIM_Y + 6} ${LEFT_X - PAN_HALF} ${RIM_Y} Z`}
          fill={fg}
          opacity='0.65'
        />
        {/* Lighter option — small weight in the bowl. */}
        <circle cx={LEFT_X} cy={RIM_Y - 1.2} r='2.2' fill={fg} opacity='0.85' />

        {/* ── Right pan: V-strut + bowl + heavier (accent) weight. */}
        <g
          stroke={fg}
          strokeWidth='1'
          strokeLinecap='round'
          opacity='0.6'
          fill='none'
        >
          <line x1={RIGHT_X} y1={BEAM_Y} x2={RIGHT_X - PAN_HALF} y2={RIM_Y} />
          <line x1={RIGHT_X} y1={BEAM_Y} x2={RIGHT_X + PAN_HALF} y2={RIM_Y} />
        </g>
        <path
          d={`M ${RIGHT_X - PAN_HALF} ${RIM_Y} L ${RIGHT_X + PAN_HALF} ${RIM_Y} Q ${RIGHT_X} ${RIM_Y + 6} ${RIGHT_X - PAN_HALF} ${RIM_Y} Z`}
          fill={fg}
          opacity='0.65'
        />
        {/* The chosen option — bigger, accent-coloured weight. The
            heavier this pan is, the more the beam tilts toward it. */}
        <circle cx={RIGHT_X} cy={RIM_Y - 2} r='4' fill={accent} />
      </g>
    </svg>
  )
}

/** Status — an Olympic-style podium. Three stepped blocks of
 *  decreasing height — 2nd place (left), 1st place (center,
 *  tallest), 3rd place (right) — each with a figure-dot resting on
 *  top. The 1st-place dot is the accent: larger, brighter, with a
 *  soft halo behind it. The other two are quieter foreground dots,
 *  unmistakably ranked.
 *
 *  Animation
 *  ─────────
 *  Status isn't static — relative position keeps shifting. All
 *  three podium blocks expand and contract along their own height
 *  (anchored to the ground), each on its own phase, so the
 *  composition feels like a live ranking continuously renegotiating
 *  itself. Each dot rides along on top of its bar, translating in
 *  lock-step with the bar's top edge — the dots don't do anything
 *  extra, they're just carried by the rank beneath them.
 *
 *  All three blocks pulse with substantial amplitude and offset
 *  phases, so they briefly overtake each other through the loop.
 *  That's the point: rank isn't a stable fact, it's a moving
 *  signal. The base resting heights still encode the canonical
 *  podium order, but at any given frame the silver or bronze bar
 *  may be the tallest in the composition.
 *
 *  How dot↔block sync works
 *    Each block uses `transform: scaleY(...)` with origin at its
 *    bottom edge, so its top moves by `(scaleY - 1) * baseHeight`.
 *    Each dot's keyframe translates Y by exactly the matching
 *    pixel delta, so the dot appears to sit on top of its bar
 *    throughout the loop. The numbers in the CSS are derived from
 *    the block heights here, so if the heights change, the dot
 *    translateY values must be updated to match.
 *
 *    data-anim-target='gold-block' / 'silver-block' / 'bronze-block'
 *      = the three podium blocks.
 *    data-anim-target='gold-dot' / 'silver-dot' / 'bronze-dot'
 *      = the dots that ride atop their respective blocks.
 */
function ArtStatus({ fg, accent }: { fg: string; accent: string }) {
  // Ground line — the floor everyone competes on.
  const GROUND_Y = 78

  // Podium block geometry. All blocks share the same width so the
  // hierarchy is conveyed purely by height — the cleanest possible
  // visual statement of "rank."
  //
  // Heights form a clean arithmetic sequence (12px steps), so the
  // gap between 1st and 2nd is exactly half the gap between 1st and
  // 3rd. Silver sits 1× step below gold, bronze sits 2× steps below
  // gold — the eye reads the centre block as unambiguously taller
  // and the proportions feel balanced rather than arbitrary.
  const BLOCK_W = 18
  const SILVER = { x: 22, h: 24 } // 2nd place — left  (gold − 12)
  const GOLD = { x: 41, h: 36 } // 1st place — center (the winner)
  const BRONZE = { x: 60, h: 12 } // 3rd place — right (gold − 24)

  // Y-coordinate of the top of each block (where the dot sits).
  const silverTop = GROUND_Y - SILVER.h
  const goldTop = GROUND_Y - GOLD.h
  const bronzeTop = GROUND_Y - BRONZE.h

  // Centre x of each block — used to position the figure-dot above.
  const silverCx = SILVER.x + BLOCK_W / 2
  const goldCx = GOLD.x + BLOCK_W / 2
  const bronzeCx = BRONZE.x + BLOCK_W / 2

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='status'>
      {/* Ground line — the level playing field everyone started on. */}
      <line
        x1='14'
        y1={GROUND_Y}
        x2='86'
        y2={GROUND_Y}
        stroke={fg}
        strokeWidth='0.8'
        opacity='0.4'
      />

      {/* The three podium blocks. Drawn before the figures so the
          dots sit on top of them. Slight opacity gradient (gold
          brightest, bronze dimmest) reinforces the rank visually.

          Each block scales vertically anchored at its bottom edge
          (transform-box: fill-box + transform-origin: center bottom)
          so the bottoms stay planted on the ground line while the
          tops breathe.

          A small `rx` rounds the top-and-side corners so the blocks
          read as solid podium pieces rather than abstract bars. */}
      <rect
        x={SILVER.x}
        y={silverTop}
        width={BLOCK_W}
        height={SILVER.h}
        rx='1.5'
        fill={fg}
        opacity='0.5'
        data-anim-target='silver-block'
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center bottom'
        }}
      />
      <rect
        x={GOLD.x}
        y={goldTop}
        width={BLOCK_W}
        height={GOLD.h}
        rx='1.5'
        fill={fg}
        opacity='0.85'
        data-anim-target='gold-block'
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center bottom'
        }}
      />
      <rect
        x={BRONZE.x}
        y={bronzeTop}
        width={BLOCK_W}
        height={BRONZE.h}
        rx='1.5'
        fill={fg}
        opacity='0.36'
        data-anim-target='bronze-block'
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center bottom'
        }}
      />

      {/* 2nd-place figure — silver dot rides atop the silver block.
          translateY is driven by the matching keyframe in CSS so it
          tracks the top of the bar through its scaleY pulse. The
          dot's centre sits one radius above the block top so it
          appears to *rest* on the bar rather than float above it. */}
      <circle
        cx={silverCx}
        cy={silverTop - 3.6}
        r='3.6'
        fill={fg}
        opacity='0.9'
        data-anim-target='silver-dot'
      />

      {/* 3rd-place figure — bronze dot rests atop the bronze block. */}
      <circle
        cx={bronzeCx}
        cy={bronzeTop - 3.2}
        r='3.2'
        fill={fg}
        opacity='0.72'
        data-anim-target='bronze-dot'
      />

      {/* 1st-place figure — accent dot + soft halo rest atop the gold
          block. The halo is rendered as two stacked circles (a wide,
          very low-alpha outer glow + a tighter inner glow), which
          fakes a soft radial falloff without an SVG <radialGradient>.
          Together they read as a real spotlight on the winner.

          The whole group translates with the gold bar's top via the
          shared `gold-dot` keyframe; the halo additionally pulses on
          its own slow loop so the spotlight feels alive. */}
      <g data-anim-target='gold-dot'>
        <g
          data-anim-target='gold-halo'
          style={{ transformOrigin: `${goldCx}px ${goldTop - 5}px` }}
        >
          <circle
            cx={goldCx}
            cy={goldTop - 5}
            r='14'
            fill={accent}
            opacity='0.12'
          />
          <circle
            cx={goldCx}
            cy={goldTop - 5}
            r='8.5'
            fill={accent}
            opacity='0.22'
          />
        </g>
        <circle cx={goldCx} cy={goldTop - 5} r='5' fill={accent} />
      </g>
    </svg>
  )
}

/** Incentives — the arrow slides toward the target.
 *
 *  The arrow uses a distinct hot-crimson rather than the lens's
 *  accent so it pops off the bullseye instead of melting into it.
 *  The bullseye rings + center are the lens's `fg`, so the arrow is
 *  the one foreign object in the composition — visually answering
 *  "show me the incentive."
 */
function ArtIncentives({ fg }: { fg: string; accent: string }) {
  // A vivid arrow color picked to stand out against both the gold
  // card background and the navy bullseye. Hard-coded because the
  // lens's `accent` would render the arrow invisible on the target.
  // Vivid teal: distinct in hue from both the warm gold card and the
  // cool navy bullseye, with enough saturation to pop off either
  // without resorting to generic red or hot pink.
  const ARROW = '#19C8B0'

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='incentives'>
      <circle cx='58' cy='50' r='30' fill={fg} opacity='0.16' />
      <circle cx='58' cy='50' r='20' fill={fg} opacity='0.3' />
      <circle cx='58' cy='50' r='10' fill={fg} opacity='0.55' />
      <circle cx='58' cy='50' r='4' fill={fg} />
      <g data-anim-target='1'>
        <line
          x1='6'
          y1='50'
          x2='46'
          y2='50'
          stroke={ARROW}
          strokeWidth='3.4'
          strokeLinecap='round'
        />
        <polygon points='42,43 54,50 42,57' fill={ARROW} />
      </g>
    </svg>
  )
}

/** Game theory — a 2×2 payoff matrix with two players' moves walking
 *  through the cells. Each player picks a row/column; their
 *  intersection is the outcome. The story: every move you make has
 *  to anticipate the other player's response.
 *
 *  Composition:
 *    • Outer 2×2 grid = the payoff matrix.
 *    • A row-marker (left of the matrix) walks up/down — Player 1's
 *      choice between two rows.
 *    • A column-marker (above the matrix) walks left/right — Player
 *      2's choice between two columns.
 *    • The cell at the intersection of their two choices lights up
 *      with the accent — the realised outcome.
 *
 *  Animation timing is set in CSS so all four "outcome" cells share
 *  one keyframe with staggered delays. The row + column markers each
 *  step once per cycle; their combined position points at whichever
 *  cell is currently lit.
 *
 *    data-anim-target='1' = top-left cell.
 *    data-anim-target='2' = top-right cell.
 *    data-anim-target='3' = bottom-right cell.
 *    data-anim-target='4' = bottom-left cell. (Order = clockwise so
 *      the highlight walks the matrix instead of jumping randomly.)
 *    data-anim-target='row' = Player 1's row marker (vertical walk).
 *    data-anim-target='col' = Player 2's column marker (horizontal).
 */
function ArtGameTheory({ fg, accent }: { fg: string; accent: string }) {
  // Cell centers — a 2×2 grid inside x:24..76, y:24..76. Each cell is
  // 26px wide. Centers sit at 37 (top/left) and 63 (bottom/right).
  const TL = { x: 37, y: 37 }
  const TR = { x: 63, y: 37 }
  const BR = { x: 63, y: 63 }
  const BL = { x: 37, y: 63 }
  const CELL = 18 // size of each highlighted cell square

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='game-theory'>
      {/* The payoff matrix grid. */}
      <g stroke={fg} strokeWidth='1.4' fill='none' opacity='0.5'>
        <rect x='24' y='24' width='52' height='52' />
        <line x1='50' y1='24' x2='50' y2='76' />
        <line x1='24' y1='50' x2='76' y2='50' />
      </g>

      {/* The four cell highlights — at rest each is a faint dot.
          When its turn comes the cell fills with the accent. Ordered
          clockwise (TL → TR → BR → BL) so the highlight walks the
          matrix in a clear cycle. */}
      <rect
        x={TL.x - CELL / 2}
        y={TL.y - CELL / 2}
        width={CELL}
        height={CELL}
        rx='1.5'
        fill={accent}
        data-anim-target='1'
        style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
      />
      <rect
        x={TR.x - CELL / 2}
        y={TR.y - CELL / 2}
        width={CELL}
        height={CELL}
        rx='1.5'
        fill={accent}
        data-anim-target='2'
        style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
      />
      <rect
        x={BR.x - CELL / 2}
        y={BR.y - CELL / 2}
        width={CELL}
        height={CELL}
        rx='1.5'
        fill={accent}
        data-anim-target='3'
        style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
      />
      <rect
        x={BL.x - CELL / 2}
        y={BL.y - CELL / 2}
        width={CELL}
        height={CELL}
        rx='1.5'
        fill={accent}
        data-anim-target='4'
        style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
      />

      {/* Player 1 (rows) — a small triangle marker outside the left
          edge. Walks vertically between row 1 and row 2. */}
      <g data-anim-target='row'>
        <polygon points='18,33 14,37 18,41' fill={fg} opacity='0.75' />
      </g>

      {/* Player 2 (columns) — small triangle marker above the top
          edge. Walks horizontally between column 1 and column 2. */}
      <g data-anim-target='col'>
        <polygon points='33,18 37,14 41,18' fill={fg} opacity='0.75' />
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
  // and going clockwise: top → bottom-right → bottom-left). Each
  // node renders as a different shape — circle, square, triangle —
  // so the three feel like distinct *kinds* of components in a
  // system, not three copies of the same actor. The signal that
  // walks the loop carries between them anyway, which is the
  // point: a system is heterogeneous parts coupled together.
  const A = { x: 50, y: 22 } // top — circle
  const B = { x: 74.25, y: 64 } // bottom-right — square
  const C = { x: 25.75, y: 64 } // bottom-left — triangle
  const NODE_HALF = 7 // half-width of the square / radius of the circle

  // Inline style shared across the three nodes so the keyframe can
  // interpolate `fill` between the lens's foreground and accent
  // colors without baking specific values into the shared rule.
  const nodeVars: React.CSSProperties = {
    ['--node-fg' as string]: fg,
    ['--node-accent' as string]: accent,
    transformBox: 'fill-box',
    transformOrigin: '50% 50%'
  }

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='systems'>
      {/* Soft halo behind the loop — gives the composition some
          weight on light card backgrounds without hard chrome. */}
      <circle cx='50' cy='50' r='34' fill={fg} opacity='0.05' />

      {/* Three directed arcs, each from one node to the next. The
          control points pull each arc outward so the three together
          read as a closed circular flow, not a triangle.

          Each arc runs an animated dashed stroke ("flow") — the
          current literally moves along the wire from sender to
          receiver. Pairs naturally with the staggered node pulse
          below: the signal departs one node, flows along the arc,
          arrives at the next. */}
      <g
        stroke={fg}
        strokeWidth='1.6'
        fill='none'
        opacity='0.55'
        strokeLinecap='round'
        strokeDasharray='4 4'
        data-anim-target='flow'
      >
        <path d={`M ${A.x} ${A.y} C 78 28, 84 50, ${B.x} ${B.y}`} />
        <path d={`M ${B.x} ${B.y} C 60 80, 40 80, ${C.x} ${C.y}`} />
        <path d={`M ${C.x} ${C.y} C 16 50, 22 28, ${A.x} ${A.y}`} />
      </g>

      {/* Node A — circle (top). */}
      <circle
        cx={A.x}
        cy={A.y}
        r={NODE_HALF}
        fill={fg}
        data-anim-target='1'
        style={nodeVars}
      />

      {/* Node B — square (bottom-right). Drawn from corner so the
          bounding box matches the circle's footprint exactly. */}
      <rect
        x={B.x - NODE_HALF}
        y={B.y - NODE_HALF}
        width={NODE_HALF * 2}
        height={NODE_HALF * 2}
        fill={fg}
        data-anim-target='2'
        style={nodeVars}
      />

      {/* Node C — triangle (bottom-left). Triangles read visually
          smaller than circles/squares of the same bounding-box
          radius (negative space at the corners), so we scale the
          triangle up by ~1.4× to match perceived weight. */}
      {(() => {
        const T = NODE_HALF * 1.4
        return (
          <polygon
            points={`${C.x},${C.y - T} ${C.x + T * 0.866},${C.y + T * 0.5} ${C.x - T * 0.866},${C.y + T * 0.5}`}
            fill={fg}
            data-anim-target='3'
            style={nodeVars}
          />
        )
      })()}
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

/** Legibility — a magnifying glass over text.
 *
 *  Three lines of text run across the panel. Each line has two
 *  layers: a faint base (the unread, just-noise version) and a
 *  crisp accent-or-fg version that's clipped to a circular lens.
 *  Wherever the lens passes, the text becomes legible; outside the
 *  lens it stays a quiet murmur.
 *
 *  The lens itself is a stroked circle with a short handle — the
 *  universal "look closer" object. The whole instrument glides
 *  slowly left-to-right (and back), so the act of *applying
 *  attention* is what does the work. That's the lens of legibility:
 *  not creating the text, but turning your gaze on it.
 *
 *  data-anim-target='1' — the magnifying glass group (translates).
 *
 *  Implementation note: we use a per-svg <clipPath> tied to the
 *  same translation as the lens via SVG transform on the clip's
 *  child, so the clipped reveal moves in lock-step with the chrome.
 *  React renders one ID per mount, but since each card has its own
 *  illustration instance the IDs collide harmlessly across cards
 *  (they're scoped by SVG ownership). To be safe we still use a
 *  stable string — if we ever inline these across one document, a
 *  React.useId() pass could replace it.
 */
function ArtLegibility({ fg, accent }: { fg: string; accent: string }) {
  // Three text-lines. Top is the "headline" (accent + slightly
  // taller); the others are body. Lengths taper.
  const lines = [
    { y: 32, w: 60, h: 4.5, color: accent, isHead: true },
    { y: 46, w: 52, h: 2.6, color: fg, isHead: false },
    { y: 56, w: 44, h: 2.6, color: fg, isHead: false }
  ]
  const X = 18

  // Lens geometry. The circle starts on the left and the CSS
  // animation translates the entire group across the panel.
  const LENS_CX = 28
  const LENS_CY = 44
  const LENS_R = 14

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='legibility'>
      <defs>
        {/* The clip path is itself a <g> containing the lens
            circle. We give it the same transform target as the
            visible lens so the clipped "sharp" text moves with
            the chrome. */}
        <clipPath id='legibility-lens-clip'>
          <g data-anim-target='1'>
            <circle cx={LENS_CX} cy={LENS_CY} r={LENS_R - 1.5} />
          </g>
        </clipPath>
      </defs>

      {/* Base layer — faint, unread text. Always visible at low
          opacity so the panel reads as "page of text, mostly
          murmur." */}
      {lines.map((l, i) => (
        <rect
          key={`base-${i}`}
          x={X}
          y={l.y}
          width={l.w}
          height={l.h}
          rx={l.h / 2}
          fill={fg}
          opacity={0.22}
        />
      ))}

      {/* Sharp layer — same lines, drawn at full strength but
          clipped to the lens. Where the lens is, you can read
          them; everywhere else, this layer is invisible. */}
      <g clipPath='url(#legibility-lens-clip)'>
        {lines.map((l, i) => (
          <rect
            key={`sharp-${i}`}
            x={X}
            y={l.y}
            width={l.w}
            height={l.h}
            rx={l.h / 2}
            fill={l.color}
            opacity={l.isHead ? 1 : 0.85}
          />
        ))}
      </g>

      {/* The magnifying glass chrome — a stroked circle and a
          short handle. Sits on top of everything so the lens
          frame reads cleanly over both base and sharp text. */}
      <g data-anim-target='1'>
        {/* Soft inner tint — gives the lens a faint warmth so
            you read it as glass, not as a hole. */}
        <circle
          cx={LENS_CX}
          cy={LENS_CY}
          r={LENS_R - 1.5}
          fill={fg}
          opacity={0.06}
        />
        {/* Lens rim. */}
        <circle
          cx={LENS_CX}
          cy={LENS_CY}
          r={LENS_R}
          fill='none'
          stroke={fg}
          strokeWidth='2.2'
          opacity='0.85'
        />
        {/* Handle — a short stub at the lower-right of the rim. */}
        <line
          x1={LENS_CX + LENS_R * 0.71}
          y1={LENS_CY + LENS_R * 0.71}
          x2={LENS_CX + LENS_R * 0.71 + 7}
          y2={LENS_CY + LENS_R * 0.71 + 7}
          stroke={fg}
          strokeWidth='3'
          strokeLinecap='round'
          opacity='0.85'
        />
      </g>
    </svg>
  )
}

/** Narrative — a five-beat story arc on a baseline. The beats sit
 *  at the classic Freytag pyramid (setup, rising, climax, falling,
 *  resolution); each beat's height above the baseline is its
 *  emotional altitude, and a faint vertical drop-line ties each
 *  beat to the ground so the rise/fall reads at a glance.
 *
 *  Composition rationale
 *  ─────────────────────
 *  • The baseline is the world the story happens to. Beats above
 *    it are charged moments; the higher, the more charged.
 *  • The connecting curve is the story itself — drawn on
 *    left-to-right each loop via stroke-dashoffset, threading the
 *    beats into a single arc.
 *  • The climax (beat 3, highest) is the accent and carries a soft
 *    halo behind it, so the eye lands on the peak even before the
 *    line reaches it. The other four beats are quieter dots.
 *  • Each beat pulses in sequence as the line arrives, so the
 *    story unfolds in time as well as space.
 *
 *    data-anim-target='line' = the arc (stroke-dashoffset reveal).
 *    data-anim-target='1'..'5' = the five beat dots, staggered.
 *    data-anim-target='halo' = the climax halo, pulses on the
 *      beat the line crosses the peak.
 */
function ArtNarrative({ fg, accent }: { fg: string; accent: string }) {
  // Baseline at y=78 — the floor the story rises from. Beats are
  // placed at increasing then decreasing heights above it.
  const BASE_Y = 78
  const beats = [
    { x: 14, y: 70, r: 3 }, // setup — barely above baseline
    { x: 32, y: 54, r: 3.2 }, // rising — moderate altitude
    { x: 50, y: 22, r: 4.6 }, // climax (accent) — peak
    { x: 68, y: 54, r: 3.2 }, // falling
    { x: 86, y: 70, r: 3 } // resolution — back near the ground
  ] as const

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='narrative'>
      {/* Ground baseline — the world the story happens to. Sits
          quietly at the bottom of the composition so the rise/fall
          of the curve has something to read against. */}
      <line
        x1='10'
        y1={BASE_Y}
        x2='90'
        y2={BASE_Y}
        stroke={fg}
        strokeWidth='0.8'
        opacity='0.32'
      />

      {/* Drop-lines from each beat to the baseline — the "altitude"
          of each story moment. Faint dashed strokes so they sit
          quietly behind the main arc but still anchor the beats
          spatially. */}
      <g stroke={fg} strokeWidth='0.8' opacity='0.28' strokeDasharray='1 2'>
        {beats.map((b) => (
          <line key={`drop-${b.x}`} x1={b.x} y1={b.y} x2={b.x} y2={BASE_Y} />
        ))}
      </g>

      {/* Climax halo — a soft circle behind the peak beat, larger
          than the beat itself, so the eye lands on the climax even
          at rest. Pulses gently as the line arrives. */}
      <circle
        cx='50'
        cy='22'
        r='10'
        fill={accent}
        opacity='0.22'
        data-anim-target='halo'
        style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
      />

      {/* The story arc — a single path with quadratic curves that
          thread cleanly through every beat. The stroke draws on
          left-to-right each loop, like the story unfolding from
          the page. */}
      <path
        d='M 14 70 Q 22 62 32 54 Q 41 42 50 22 Q 59 42 68 54 Q 78 62 86 70'
        stroke={fg}
        strokeWidth='1.8'
        fill='none'
        opacity='0.7'
        strokeLinecap='round'
        data-anim-target='line'
      />

      {/* The five beats. Drawn after the arc so the dots sit on top
          of the line. Each fires its pulse keyframe at a staggered
          delay so the eye sees the story arrive beat by beat. The
          climax (index 2) carries a thin ring around it for extra
          weight at the peak. */}
      {beats.map((b, i) => {
        const isClimax = i === 2
        return (
          <g key={`beat-${i}`}>
            {isClimax && (
              <circle
                cx={b.x}
                cy={b.y}
                r={b.r + 2.4}
                fill='none'
                stroke={accent}
                strokeWidth='1.2'
                opacity='0.6'
              />
            )}
            <circle
              cx={b.x}
              cy={b.y}
              r={b.r}
              fill={isClimax ? accent : fg}
              opacity={isClimax ? 1 : 0.8}
              data-anim-target={String(i + 1)}
              style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
            />
          </g>
        )
      })}
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
          boundary rather than a wall. Stroke and dash spacing
          bumped ~15% so the boundary holds its own against the
          slightly larger cluster dots. */}
      <line
        x1='50'
        y1='14'
        x2='50'
        y2='86'
        stroke={fg}
        strokeWidth='1.6'
        opacity='0.4'
        strokeDasharray='3.5 4.5'
      />

      {/* Left cluster — three fixed dots sitting at the left edge. */}
      <circle cx='22' cy='30' r='3.45' fill={fg} opacity='0.55' />
      <circle cx='16' cy='50' r='3.45' fill={fg} opacity='0.55' />
      <circle cx='24' cy='70' r='3.45' fill={fg} opacity='0.55' />

      {/* Right cluster — three fixed dots sitting at the right edge. */}
      <circle cx='78' cy='30' r='3.45' fill={fg} opacity='0.55' />
      <circle cx='84' cy='50' r='3.45' fill={fg} opacity='0.55' />
      <circle cx='76' cy='70' r='3.45' fill={fg} opacity='0.55' />

      {/* The two travellers — accent dots sitting just inside the
          midline on opposite halves. Each drifts outward into the
          cluster on its own side. */}
      <circle cx='40' cy='38' r='3.7' fill={accent} data-anim-target='1' />
      <circle cx='60' cy='62' r='3.7' fill={accent} data-anim-target='2' />
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

/** Communication — the speech bubble pulses while its color cycles
 *  yellow → orange → red → yellow, suggesting the temperature of an
 *  exchange shifting as the two parties try (and fail, and try again)
 *  to sync. The misalignment crack flickers underneath.
 *
 *    data-anim-target='1' = the bubble group (scale pulse).
 *    data-anim-target='bubble' = each shape inside the bubble whose
 *      fill we cycle through the heat-spectrum keyframe. */
function ArtCommunication({ fg }: { fg: string; accent: string }) {
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
        <ellipse cx='50' cy='28' rx='13' ry='7.5' data-anim-target='bubble' />
        <polygon points='46,36 50,31 48,40' data-anim-target='bubble' />
        <polygon points='54,36 50,31 52,40' data-anim-target='bubble' />
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
      {/* Hexagon — replaces the earlier circle so all three primitives
          have orient-able geometry (a circle's rotation is invisible,
          which made the trio feel uneven when the others spun). */}
      <g
        style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
        data-anim-target='1'
      >
        <polygon
          points='28,64 35,68 35,76 28,80 21,76 21,68'
          fill={fg}
          opacity='0.7'
        />
      </g>
      <g
        style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
        data-anim-target='2'
      >
        <rect x='44' y='64' width='14' height='14' rx='2' fill={accent} />
      </g>
      <g
        style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
        data-anim-target='3'
      >
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

/** Projection — a figure stands in front of a large semicircle that
 *  emanates from them. The semicircle is the "projected world": the
 *  view of reality the speaker is casting outward. On hover the
 *  semicircle grows, suggesting the projection expanding — the
 *  speaker's interior radiating outward to color everything they
 *  see.
 *
 *    data-anim-target='1' = the projected semicircle (scales up from
 *      the base of the figure outward).
 */
function ArtProjection({ fg, accent }: { fg: string; accent: string }) {
  // The figure stands centered horizontally, anchored at y=70 (the
  // ground line). The projection radiates out from that anchor.
  const ANCHOR_X = 50
  const ANCHOR_Y = 70

  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='projection'>
      {/* The projected world — a large semicircle behind the figure,
          centered at the figure's base and extending upward into the
          card. Filled with accent at low alpha so it reads as a
          coloured aura, not a hard shape. Sits BELOW the figure in
          z-order so the person stays the foreground. */}
      <g
        data-anim-target='1'
        style={{ transformOrigin: `${ANCHOR_X}px ${ANCHOR_Y}px` }}
      >
        {/* Use a path for a half-disc rather than clipping a circle —
            cleaner SVG and animates evenly. The path traces the top
            half of a circle of radius 32 centred at the anchor. */}
        <path
          d={`M ${ANCHOR_X - 32} ${ANCHOR_Y} A 32 32 0 0 1 ${ANCHOR_X + 32} ${ANCHOR_Y} Z`}
          fill={accent}
          opacity='0.55'
        />
        {/* A second concentric arc adds depth — slightly smaller, a
            touch more saturated, so the projection reads as
            volumetric instead of flat. */}
        <path
          d={`M ${ANCHOR_X - 22} ${ANCHOR_Y} A 22 22 0 0 1 ${ANCHOR_X + 22} ${ANCHOR_Y} Z`}
          fill={accent}
          opacity='0.45'
        />
      </g>

      {/* Ground line — sits on top of the projection so the half-disc
          appears to rest on it. */}
      <line
        x1='14'
        y1={ANCHOR_Y}
        x2='86'
        y2={ANCHOR_Y}
        stroke={fg}
        strokeWidth='1'
        opacity='0.45'
      />

      {/* The figure (head + torso) — drawn last so it sits in front
          of the projection. */}
      <circle cx={ANCHOR_X} cy='42' r='6.5' fill={fg} opacity='0.85' />
      <path
        d={`M ${ANCHOR_X - 9} ${ANCHOR_Y} Q ${ANCHOR_X - 9} 54 ${ANCHOR_X} 54 Q ${ANCHOR_X + 9} 54 ${ANCHOR_X + 9} ${ANCHOR_Y} Z`}
        fill={fg}
        opacity='0.85'
      />
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
 *
 *  The origin dot sits at the geometric center of the frame so the
 *  composition reads as "from the middle of the world, an action
 *  pierces the wall." The shaft is shortened to compensate for the
 *  dot's recentering — the arrow head still clears the right wall,
 *  but the visual weight stays balanced inside the box.
 */
function ArtAgency({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='agency'>
      {/* The frame (the default world). x=20..72, y=26..78 → center
          at (46, 52). */}
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

      {/* The breakout arrow — tail starts at the frame's center, head
          pierces the right wall and continues a few px beyond. The
          whole group translates a few px on hover so the head drives
          further out. */}
      <g data-anim-target='1' style={{ transformOrigin: '50px 52px' }}>
        <line
          x1='46'
          y1='52'
          x2='78'
          y2='52'
          stroke={accent}
          strokeWidth='3.2'
          strokeLinecap='round'
        />
        <polygon points='86,52 74,45 74,59' fill={accent} />
      </g>

      {/* The seat of choice — sits at the geometric center of the
          frame. */}
      <circle cx='46' cy='52' r='3.4' fill={fg} opacity='0.7' />
    </svg>
  )
}

/** Expertise — three bricks assemble into a pyramid. Each brick
 *  represents a stage of skill: the broad foundation (fundamentals
 *  you stop noticing), the narrower middle (intermediate fluency),
 *  and the small accent capstone (the rare tip-of-the-spear move
 *  only experts have). Together they read as a composed mastery
 *  rather than a single skill point.
 *
 *  Animation
 *  ─────────
 *  On each loop, the three bricks fly in from three different
 *  directions — foundation slides up from below, middle slides in
 *  from the right, capstone drops in from above — and click into
 *  place to assemble the pyramid. The composition is the resting
 *  state; the animation is *the act of composing it*. Reads as
 *  "expertise is many separate competencies snapping together."
 *
 *    data-anim-target='1' = foundation brick (slides up from below).
 *    data-anim-target='2' = middle brick (slides in from the right).
 *    data-anim-target='3' = capstone brick (drops in from above,
 *      accent-coloured, the smallest and most precise piece).
 */
function ArtExpertise({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='expertise'>
      {/* Baseline — the ground the pyramid rests on. */}
      <line
        x1='14'
        y1='78'
        x2='86'
        y2='78'
        stroke={fg}
        strokeWidth='0.8'
        opacity='0.4'
      />

      {/* Foundation brick — the broad base. Centered horizontally
          and resting on the baseline. */}
      <g data-anim-target='1'>
        <rect
          x='18'
          y='62'
          width='64'
          height='14'
          rx='2'
          fill={fg}
          opacity='0.45'
        />
      </g>

      {/* Middle brick — narrower, sits cleanly atop the foundation. */}
      <g data-anim-target='2'>
        <rect
          x='28'
          y='44'
          width='44'
          height='14'
          rx='2'
          fill={fg}
          opacity='0.7'
        />
      </g>

      {/* Capstone — small accent block on top. The smallest, most
          precise piece; reads as "the move only the expert can
          make." Transform origin set to the brick's center so the
          drop's scale reads as a clean snap-into-place. */}
      <g data-anim-target='3' style={{ transformOrigin: '50px 33px' }}>
        <rect
          x='40'
          y='26'
          width='20'
          height='14'
          rx='2'
          fill={accent}
          opacity='0.95'
        />
      </g>
    </svg>
  )
}

/** Momentum — a metronome. The triangular body sits still; the
 *  pendulum arm swings, carrying its own motion. The story: what&rsquo;s
 *  already moving keeps moving, and most outcomes are decided by mass
 *  in flight rather than the best argument in the room.
 *
 *    data-anim-target='1' = the pendulum arm + bob (swings).
 */
function ArtMomentum({ fg, accent }: { fg: string; accent: string }) {
  return (
    <svg {...SVG_BASE} aria-hidden='true' data-anim='momentum'>
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
