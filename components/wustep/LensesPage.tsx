'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import Link from 'next/link'
import * as React from 'react'
import BodyClassName from 'react-body-classname'

import { LabsButton } from '@/components/wustep/LabsButton'
import { ThemeToggle } from '@/components/wustep/ThemeToggle'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './LensesPage.module.css'

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD
 *
 *    0ms   canvas fades in
 *  120ms   center "Lenses" card scales 0.9 → 1
 *  220ms   surrounding lens cards stagger in (35ms apart)
 *
 *  Side panel: slides in from right, 340ms
 *  Center dialog: scale 0.96 → 1 + fade, 280ms
 *  In-panel lens swap: cross-fade body 220ms; hero color 280ms
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  centerIn: 120,
  cardsIn: 220
}

// ============================================================================
// Lens registry
// ============================================================================

type IllustrationId =
  | 'great-man'
  | 'evo-psych'
  | 'minimalism'
  | 'utility'
  | 'status'
  | 'incentives'
  | 'game-theory'
  | 'systems'
  | 'headspace'
  | 'legibility'
  | 'narrative'
  | 'constraint'
  | 'interface'
  | 'energy'
  | 'epistemic'
  | 'osmosis'
  | 'probabilistic'
  | 'communication'
  | 'mimetics'
  | 'primitives'
  | 'lenses-deck'

type Lens = {
  id: string
  category: string
  title: string
  tagline: string
  /** Card position on the virtual canvas: 0–100 (center of card). */
  x: number
  y: number
  bg: string
  fg: string
  accent?: string
  illustration: IllustrationId
  body: React.ReactNode
  related?: string[]
}

const LENSES: Lens[] = [
  {
    id: 'great-man',
    category: 'History',
    title: 'Great Man theory',
    tagline: 'History bends around individuals.',
    x: 3,
    y: 8,
    bg: '#1F2A5C',
    fg: '#F5F1E8',
    accent: '#F2C04A',
    illustration: 'great-man',
    related: ['status', 'narrative', 'incentives'],
    body: (
      <>
        <p>
          History as a chronicle of remarkable individuals. In its strongest
          form, this lens argues that the arc of civilization is bent by a
          handful of singular minds — Caesar, Napoleon, Newton, Lincoln — and
          that without them, the trajectory would be unrecognizable.
        </p>
        <p>
          Through this lens you notice founders, generals, prophets, and
          inventors as the unit of analysis. You ask: <em>who decided?</em>{' '}
          <em>who saw it first?</em> <em>who refused to give in?</em>
        </p>
        <p>
          Weaknesses: it underweights structures, institutions, networks, and
          luck. The same person born a century earlier may produce nothing at
          all. But it captures something real about agency, taste, and the
          asymmetric returns of conviction.
        </p>
      </>
    )
  },
  {
    id: 'evo-psych',
    category: 'Psychology',
    title: 'Evolutionary psychology',
    tagline: 'Old hardware, new world.',
    x: 97,
    y: 8,
    bg: '#3F6B4E',
    fg: '#F1EFE3',
    accent: '#E8C36B',
    illustration: 'evo-psych',
    related: ['status', 'incentives', 'mimetics'],
    body: (
      <>
        <p>
          Behavior as the residue of selection pressures from the ancestral
          environment. Why we crave sugar, fear snakes more than cars, gossip,
          form coalitions, find symmetry beautiful, and feel the sting of low
          status more than the warmth of moderate gain.
        </p>
        <p>
          Through this lens, modern life is a thin veneer over a Pleistocene
          chassis. Dating apps, social feeds, and open-plan offices all become
          legible as new arenas for very old games.
        </p>
        <p>
          Weaknesses: just-so stories are easy to invent and hard to falsify.
          But used carefully, it explains the shape of our wants in a way no
          other lens does.
        </p>
      </>
    )
  },
  {
    id: 'minimalism',
    category: 'Aesthetic',
    title: 'Minimalism',
    tagline: 'What is essential? Subtract the rest.',
    x: 3,
    y: 92,
    bg: '#EFE6D2',
    fg: '#1A1A1A',
    accent: '#C8552B',
    illustration: 'minimalism',
    related: ['constraint', 'primitives', 'interface'],
    body: (
      <>
        <p>
          Value comes from what remains after you remove the unnecessary. Not
          aesthetic austerity for its own sake, but a discipline of asking{' '}
          <em>what is the smallest thing that still does the job?</em>
        </p>
        <p>
          Through this lens, complexity is a tax. Every feature, possession,
          obligation, and abstraction has a hidden cost — cognitive,
          maintenance, emotional. Subtraction is creative work.
        </p>
        <p>
          Weaknesses: the world is genuinely complicated, and over-pruned
          systems are brittle. But as a counterweight to default accumulation,
          it&rsquo;s nearly always corrective.
        </p>
      </>
    )
  },
  {
    id: 'utility',
    category: 'Economics',
    title: 'Utility functions',
    tagline: 'Everyone is optimizing something.',
    x: 22,
    y: 92,
    bg: '#C8552B',
    fg: '#FBF6EC',
    accent: '#1F2A5C',
    illustration: 'utility',
    related: ['incentives', 'game-theory', 'minimalism'],
    body: (
      <>
        <p>
          People, firms, and systems behave as if they are maximizing some
          objective — even when no one wrote it down. The lens of utility
          functions asks:{' '}
          <em>what is this agent actually trying to maximize?</em> Not what they
          say. What their behavior reveals.
        </p>
        <p>
          Through this lens, confusion often resolves into incentive alignment.
          The middle manager isn&rsquo;t irrational; she&rsquo;s optimizing a
          different function than you. The market isn&rsquo;t stupid; it&rsquo;s
          pricing in something you haven&rsquo;t noticed.
        </p>
        <p>
          Weaknesses: humans are not coherent maximizers, and reducing rich
          motivation to a scalar can flatten what matters. But as a first cut on
          strange behavior, it cuts deep.
        </p>
      </>
    )
  },
  {
    id: 'status',
    category: 'Sociology',
    title: 'Status',
    tagline: 'The invisible currency.',
    x: 78,
    y: 8,
    bg: '#A12C5E',
    fg: '#FBF1F2',
    accent: '#F2C04A',
    illustration: 'status',
    related: ['great-man', 'evo-psych', 'narrative'],
    body: (
      <>
        <p>
          A surprising amount of human behavior is about status — relative
          standing within the groups we care about. Not money, not power
          directly, but where you sit in the local pecking order, and the
          movement of that position over time.
        </p>
        <p>
          Through this lens, you notice why people pick the cars they pick, why
          the office layout matters, why a small slight outrages and a large
          compliment soothes. Why entire industries — luxury, fashion, academia
          — exist primarily to allocate position.
        </p>
        <p>
          Weaknesses: not everything is status. Love, curiosity, craft, and play
          are real and irreducible. But ignore status and you will be confused
          by half of what people do.
        </p>
      </>
    )
  },
  {
    id: 'incentives',
    category: 'Economics',
    title: 'Incentives',
    tagline: 'Show me what gets rewarded.',
    x: 41,
    y: 92,
    bg: '#D4A53A',
    fg: '#1F2A5C',
    accent: '#1F2A5C',
    illustration: 'incentives',
    related: ['utility', 'game-theory', 'probabilistic'],
    body: (
      <>
        <p>
          Charlie Munger:{' '}
          <em>show me the incentive and I&rsquo;ll show you the outcome.</em>{' '}
          People, organizations, and entire systems drift toward whatever they
          are paid — in money, attention, or social approval — to do.
        </p>
        <p>
          Through this lens, &ldquo;why does this keep happening?&rdquo; almost
          always resolves into <em>who benefits when it does?</em> Bureaucracies
          grow because growing is rewarded. Newsrooms publish outrage because
          outrage gets clicks. The cure is rarely exhortation; it is rewiring
          the rewards.
        </p>
        <p>
          Weaknesses: not every incentive is legible, and human behavior is not
          perfectly responsive to them. But ignoring incentives is the surest
          way to be perpetually surprised.
        </p>
      </>
    )
  },

  // ── New lenses ─────────────────────────────────────────────────────────
  {
    id: 'game-theory',
    category: 'Strategy',
    title: 'Game theory',
    tagline: 'Make good behavior playable.',
    x: 59,
    y: 92,
    bg: '#2E6B7C',
    fg: '#F1EFE3',
    accent: '#F2C04A',
    illustration: 'game-theory',
    related: ['incentives', 'utility', 'interface'],
    body: (
      <>
        <p>
          Life, products, organizations, and habits are shaped by rules,
          rewards, feedback loops, skill curves, and affordances. The best
          systems make good behavior <em>feel playable</em> — clear objectives,
          visible progress, fair odds, and meaningful choice at every turn.
        </p>
        <p>
          Through this lens, you stop asking{' '}
          <em>how do I make people behave?</em> and start asking{' '}
          <em>what game am I putting them in?</em> Bad games punish the right
          move and reward the easy one. Good games line up effort, skill, and
          reward so that doing the right thing is also the most engaging thing.
        </p>
        <p>
          Weaknesses: not everything should be gamified, and over-designed games
          can crowd out intrinsic motivation. But the best designers, coaches,
          and managers are quietly thinking in payoffs and moves.
        </p>
      </>
    )
  },
  {
    id: 'systems',
    category: 'Causality',
    title: 'Systems',
    tagline: 'Outcomes emerge from loops.',
    x: 78,
    y: 92,
    bg: '#4A5D3F',
    fg: '#F1EFE3',
    accent: '#E8B83A',
    illustration: 'systems',
    related: ['incentives', 'primitives', 'probabilistic'],
    body: (
      <>
        <p>
          Outcomes are rarely caused by one thing. They emerge from feedback
          loops, bottlenecks, delays, constraints, and second-order effects. The
          visible event is the tip; the system is everything underneath
          producing it, again and again.
        </p>
        <p>
          Through this lens, blame becomes less interesting than{' '}
          <em>structure</em>. Why does this team keep missing deadlines? Why do
          diets fail? Why does the same kind of meeting keep getting scheduled?
          Look at the loop, the lag, the limit — not the last person who acted.
        </p>
        <p>
          Weaknesses: it can become an excuse (&ldquo;the system did it&rdquo;).
          But used well, it surfaces leverage points where a small intervention
          changes everything downstream.
        </p>
      </>
    )
  },
  {
    id: 'headspace',
    category: 'Psychology',
    title: 'Headspace',
    tagline: 'Enter the world-model first.',
    x: 3,
    y: 36,
    bg: '#7B6CA8',
    fg: '#F4F1FA',
    accent: '#F2C04A',
    illustration: 'headspace',
    related: ['communication', 'narrative', 'energy'],
    body: (
      <>
        <p>
          Every person is operating from an internal world-model, an emotional
          state, an identity constraint, and a salience landscape that
          determines what they notice. To understand behavior, enter the
          headspace first.
        </p>
        <p>
          Through this lens, &ldquo;why are they doing this?&rdquo; becomes{' '}
          <em>what would a person have to believe, feel, and be afraid of</em>{' '}
          for this to be the obvious move? Most disagreements are not about
          facts — they are about which facts feel real, urgent, and
          self-relevant.
        </p>
        <p>
          Weaknesses: it can collapse into endless empathy at the expense of
          decision. But ignoring headspace makes you efficient at solving the
          wrong problem.
        </p>
      </>
    )
  },
  {
    id: 'legibility',
    category: 'Knowledge',
    title: 'Legibility',
    tagline: 'Name it to improve it.',
    x: 78,
    y: 36,
    bg: '#5C8DB8',
    fg: '#F1F4F8',
    accent: '#F2C04A',
    illustration: 'legibility',
    related: ['communication', 'primitives', 'epistemic'],
    body: (
      <>
        <p>
          A thing that cannot be named, explained, or made visible is hard to
          improve. Writing, diagrams, dashboards, and frameworks convert fog
          into handles — they turn a vague unease into a problem you can point
          at.
        </p>
        <p>
          Through this lens, the act of articulation <em>is</em> half the work.
          The team that writes its values down lives them more clearly than the
          team that just &ldquo;has them.&rdquo; The bug you can reproduce is
          already half-fixed. The dashboard reshapes the decisions even when no
          one is looking at it.
        </p>
        <p>
          Weaknesses: legibility can flatten what matters into what fits in a
          chart, and metrics get gamed. But darkness is rarely an upgrade.
        </p>
      </>
    )
  },
  {
    id: 'narrative',
    category: 'Culture',
    title: 'Narrative',
    tagline: 'Stories shape what feels possible.',
    x: 22,
    y: 8,
    bg: '#B85C3F',
    fg: '#FAF1E8',
    accent: '#F2C04A',
    illustration: 'narrative',
    related: ['mimetics', 'headspace', 'status'],
    body: (
      <>
        <p>
          Humans do not just optimize; they story-tell. A good frame can change
          what people perceive as possible, admirable, embarrassing, or
          inevitable — without changing a single underlying fact.
        </p>
        <p>
          Through this lens, you notice that movements run on narrative,
          companies run on narrative, and most personal change starts with a new
          story you tell about yourself. The same career pivot is a &ldquo;brave
          leap&rdquo; or a &ldquo;reckless mistake&rdquo; depending entirely on
          the surrounding tale.
        </p>
        <p>
          Weaknesses: stories can outrun reality, and good narratives have
          buried bad decisions. But trying to operate without one is its own
          kind of story — usually a thinner one.
        </p>
      </>
    )
  },
  {
    id: 'constraint',
    category: 'Design',
    title: 'Constraint',
    tagline: 'The right limit creates expression.',
    x: 22,
    y: 64,
    bg: '#3A3A42',
    fg: '#F1EFE3',
    accent: '#E8B83A',
    illustration: 'constraint',
    related: ['minimalism', 'interface', 'energy'],
    body: (
      <>
        <p>
          Freedom is not the absence of structure. The right constraint creates
          expression, focus, improvisation, and agency. Sonnets, haiku, jazz
          standards, and four-bar phrases are not cages — they are the trellis
          the work climbs.
        </p>
        <p>
          Through this lens, an overwhelming choice is often a missing
          constraint. The blank page is the enemy; the assignment is the friend.
          &ldquo;Build anything&rdquo; is paralysis;{' '}
          <em>build this in a week with these three tools</em> is a generative
          engine.
        </p>
        <p>
          Weaknesses: the wrong constraint suffocates rather than shapes, and
          constraints adopted out of fear masquerade as discipline. But most
          creative blocks are calls for tighter, not looser, walls.
        </p>
      </>
    )
  },
  {
    id: 'interface',
    category: 'Design',
    title: 'Interface',
    tagline: 'Everything has a UX.',
    x: 78,
    y: 64,
    bg: '#E08066',
    fg: '#FAF0EA',
    accent: '#1F2A5C',
    illustration: 'interface',
    related: ['legibility', 'minimalism', 'energy'],
    body: (
      <>
        <p>
          Everything has a UX — tools, teams, calendars, meetings, habits,
          philosophies. Bad interfaces make good intentions expensive: they add
          friction in exactly the places that compound, and remove it where you
          wish there were more.
        </p>
        <p>
          Through this lens, a stuck team often does not have a strategy
          problem; it has a meeting problem. A slipping habit does not need more
          willpower; it needs to be one tap away. A confusing decision is often
          a missing form.
        </p>
        <p>
          Weaknesses: not every problem is interface; some are values or
          incentives wearing a UX disguise. But the right surface change often
          unlocks behavior that exhortation could not.
        </p>
      </>
    )
  },
  {
    id: 'energy',
    category: 'Behavior',
    title: 'Energy',
    tagline: 'Design around it, not against it.',
    x: 3,
    y: 64,
    bg: '#7A8A3A',
    fg: '#F4F1E0',
    accent: '#E8B83A',
    illustration: 'energy',
    related: ['headspace', 'interface', 'constraint'],
    body: (
      <>
        <p>
          Motivation is not purely moral; it is biochemical, environmental,
          social, and narrative. Sleep, food, light, exercise, social contact,
          and recent wins all rewrite what is and isn&rsquo;t possible today.
          Design around energy rather than pretending willpower is infinite.
        </p>
        <p>
          Through this lens, &ldquo;why am I being lazy?&rdquo; is the wrong
          question. The right one is{' '}
          <em>
            where in my day did the fuel run out, and what would refill it?
          </em>{' '}
          Most discipline failures are really battery failures.
        </p>
        <p>
          Weaknesses: this lens can become an excuse for endless
          self-management. But ignoring it produces shame instead of insight,
          and shame is the most expensive fuel of all.
        </p>
      </>
    )
  },
  {
    id: 'epistemic',
    category: 'Philosophy',
    title: 'Epistemic pragmatism',
    tagline: 'Beliefs are maps for action.',
    x: 97,
    y: 36,
    bg: '#5C3A6E',
    fg: '#F2EAF6',
    accent: '#E8B83A',
    illustration: 'epistemic',
    related: ['legibility', 'systems', 'narrative'],
    body: (
      <>
        <p>
          Beliefs are maps for action. The question is not only{' '}
          <em>is this true?</em> but{' '}
          <em>
            what does believing this help me predict, build, notice, or become?
          </em>{' '}
          A belief that cashes out in better decisions earns its place; one that
          doesn&rsquo;t, regardless of how impressive, is a souvenir.
        </p>
        <p>
          Through this lens, you become less precious about being correct and
          more interested in being <em>useful-correct</em>. Two beliefs can be
          equally defensible; the one that gives you traction in the world is
          the one to keep on the workbench.
        </p>
        <p>
          Weaknesses: pragmatism without honesty curdles into self-serving
          belief. But truth without traction is theology, and most of us already
          have plenty.
        </p>
      </>
    )
  },
  {
    id: 'osmosis',
    category: 'Growth',
    title: 'Osmosis',
    tagline: 'Become what you repeatedly notice.',
    x: 59,
    y: 8,
    bg: '#9CAB87',
    fg: '#1F2A2A',
    accent: '#3F6B4E',
    illustration: 'osmosis',
    related: ['mimetics', 'headspace', 'status'],
    body: (
      <>
        <p>
          People absorb culture, standards, vocabulary, and taste from their
          environment. Put yourself near high-signal people and artifacts;
          become what you repeatedly notice. Most growth is not effortful
          self-improvement — it is steady proximity to better defaults.
        </p>
        <p>
          Through this lens, who you spend time with, what you read, where you
          work, and what you stare at on a phone screen are all training data.
          The slow upgrade compounds: you start producing the kind of work,
          opinions, and instincts of the people you keep around you.
        </p>
        <p>
          Weaknesses: osmosis works in both directions and absorbs the mediocre
          as readily as the great. The lens warns as much as it encourages:
          choose the room.
        </p>
      </>
    )
  },
  {
    id: 'probabilistic',
    category: 'Reasoning',
    title: 'Probabilistic thinking',
    tagline: 'The world runs in distributions.',
    x: 97,
    y: 92,
    bg: '#6B7785',
    fg: '#F1F2F4',
    accent: '#F2C04A',
    illustration: 'probabilistic',
    related: ['epistemic', 'systems', 'incentives'],
    body: (
      <>
        <p>
          The world does not deliver outcomes; it delivers{' '}
          <em>distributions</em> of outcomes. Most events are not certain or
          impossible — they are a shape, a range, a tail. Treating uncertain
          things as binary (will/won&rsquo;t, true/false, safe/risky) is the
          most common and most expensive cognitive error.
        </p>
        <p>
          Through this lens, you stop asking <em>what will happen?</em> and
          start asking{' '}
          <em>
            what is the spread, where is the mode, how fat is the tail, and what
            is my edge over a coin flip?
          </em>{' '}
          Plans become ranges. Confidence becomes calibration. A 70% chance is
          not a promise; it is a posture.
        </p>
        <p>
          Weaknesses: not every situation rewards probability over conviction,
          and life is partly self-fulfilling. But anyone who mistakes the
          average for the outcome will be mugged by variance eventually.
        </p>
      </>
    )
  },
  {
    id: 'communication',
    category: 'Relationships',
    title: 'Communication',
    tagline: 'Most problems are translation problems.',
    x: 22,
    y: 36,
    bg: '#A66D4F',
    fg: '#FAF1E6',
    accent: '#F2C04A',
    illustration: 'communication',
    related: ['headspace', 'narrative', 'interface'],
    body: (
      <>
        <p>
          Almost every problem that occurs between two people is, at root, a
          communication problem. Two people fundamentally do not understand each
          other — different vocabularies, different unsaid assumptions,
          different levels of context, different stakes — and the gap quietly
          grows until it surfaces as conflict, drift, or a quietly bad outcome
          neither wanted.
        </p>
        <p>
          Through this lens, &ldquo;they&rsquo;re wrong&rdquo; and &ldquo;they
          don&rsquo;t care&rdquo; almost always rephrase as{' '}
          <em>we are not in the same conversation</em>. The fix is rarely a
          stronger argument; it is a slower, more patient transfer of model —
          what you mean by the words, what you fear, what you actually want.
        </p>
        <p>
          Weaknesses: not every disagreement is a misunderstanding; some are
          real conflicts of interest dressed in misunderstanding&rsquo;s
          clothes. But assume translation first, war second.
        </p>
      </>
    )
  },
  {
    id: 'mimetics',
    category: 'Culture',
    title: 'Mimetics',
    tagline: 'Ideas compete to spread.',
    x: 41,
    y: 8,
    bg: '#E55A8E',
    fg: '#FBF1F4',
    accent: '#F2C04A',
    illustration: 'mimetics',
    related: ['narrative', 'osmosis', 'status'],
    body: (
      <>
        <p>
          Ideas, beliefs, formats, and aesthetics compete to spread, the way
          organisms compete to reproduce. The ones we encounter most are not
          necessarily the truest or the most useful — they are the most{' '}
          <em>transmissible</em>. Catchy beats correct; sticky beats subtle; for
          (const [i, l] of ent ies-) ts nuance, almost every time.
        </p>
        <p>
          Through this lens, the question stops being{' '}
          <em>is this idea right?</em> and becomes{' '}
          <em>
            why is this idea winning right now? What is its host? What does it
            offer the carrier?
          </em>{' '}
          Most movements, fashions, and opinions are legible this way long
          before they make sense any other way.
        </p>
        <p>
          Weaknesses: not every popular idea is empty, and not every obscure one
          is profound. But if you mistake virality for validity, you will be a
          passenger in your own beliefs.
        </p>
      </>
    )
  },
  {
    id: 'primitives',
    category: 'Design',
    title: 'Primitives',
    tagline: 'Find the simpler thing underneath.',
    x: 97,
    y: 64,
    bg: '#3D5BC4',
    fg: '#F1F3FA',
    accent: '#F2C04A',
    illustration: 'primitives',
    related: ['minimalism', 'systems', 'legibility'],
    body: (
      <>
        <p>
          Composable units live beneath complex systems. Many things that look
          different are fundamentally the same underlying thing wearing
          different clothes. Identify and solve the primitive problem and you
          solve the more complex problems for free.
        </p>
        <p>
          Through this lens, ten features collapse into three building blocks;
          five competing tools collapse into one missing abstraction; a tangle
          of edge cases collapses into one rule generating them. The work is
          mostly noticing:{' '}
          <em>
            what is actually moving here, beneath all the surface variety?
          </em>
        </p>
        <p>
          Weaknesses: chasing primitives can become procrastination dressed as
          architecture, and reality sometimes refuses to factor cleanly. But
          almost every elegant system is one good primitive away from being ten
          times simpler.
        </p>
      </>
    )
  }
]

const LENS_BY_ID: Record<string, Lens> = Object.fromEntries(
  LENSES.map((l) => [l.id, l])
)

// ============================================================================
// Page
// ============================================================================

/**
 * Top-level Lenses experience.
 *
 *   When `embedded` is true, the page renders only the canvas + portaled
 *   panels and skips its own header / theme toggle / body classes. Use
 *   this when mounting `<LensesPage embedded />` inside another chrome
 *   (e.g. `PlaygroundLayout`).
 */
export type LensesPageProps = {
  embedded?: boolean
}

export function LensesPage({ embedded = false }: LensesPageProps = {}) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [hasMounted, setHasMounted] = React.useState(false)
  const [openLensId, setOpenLensId] = React.useState<string | null>(null)
  const [centerOpen, setCenterOpen] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const openLens = React.useCallback((id: string) => {
    setCenterOpen(false)
    setOpenLensId(id)
  }, [])

  const closeLens = React.useCallback(() => setOpenLensId(null), [])

  const activeLens = openLensId ? (LENS_BY_ID[openLensId] ?? null) : null

  const frameClass = embedded
    ? `${styles.frame} ${styles.frameEmbedded}`
    : styles.frame

  return (
    <>
      {/* Standalone mode owns the body class (notion + dark mode). When
          embedded, the host layout (e.g. PlaygroundLayout) sets these. */}
      {!embedded && (
        <BodyClassName className={isDarkMode ? 'notion dark-mode' : 'notion'} />
      )}

      <div className={frameClass}>
        {!embedded && (
          <header className={styles.header}>
            <div className={styles.headerInner}>
              <Link
                href='/'
                className={styles.homeBackButton}
                aria-label='Back to home'
              >
                <span className={styles.homeBackArrow}>←</span>
              </Link>

              <div className={styles.headerRhs}>
                <LabsButton className={styles.headerButton} />
                <ThemeToggle
                  isDark={hasMounted ? isDarkMode : false}
                  onToggle={toggleDarkMode}
                  className={styles.headerButton}
                />
              </div>
            </div>
          </header>
        )}

        <Canvas
          mounted={hasMounted}
          prefersReducedMotion={prefersReducedMotion}
          onOpenCenter={() => setCenterOpen(true)}
          onOpenLens={openLens}
        />
      </div>

      <SidePanel lens={activeLens} onClose={closeLens} onOpenLens={openLens} />

      <CenterDialog
        open={centerOpen}
        onOpenChange={setCenterOpen}
        onOpenLens={openLens}
      />
    </>
  )
}

// ============================================================================
// Canvas
// ============================================================================

type CanvasProps = {
  mounted: boolean
  prefersReducedMotion: boolean
  onOpenCenter: () => void
  onOpenLens: (id: string) => void
}

/**
 * Canvas — viewport-sized clipping container.
 *
 *   The cards live in a `.cards` virtual canvas that is *larger* than the
 *   viewport (extending past each edge by ~12%). As the cursor moves, the
 *   `.cards` container pans in the inverse direction, so cards near the
 *   right edge "peek in" when the user moves toward the right side, etc.
 *
 *   Pan is bounded to ±PAN_RANGE in each axis and smoothly interpolated
 *   via a CSS transition on `transform`. We do not animate per-card
 *   parallax — every card pans by the same amount so the grid stays
 *   uniform, just shifted.
 */
const PAN_RANGE_PX = 80 // max pan distance from rest position

function Canvas({
  mounted,
  prefersReducedMotion,
  onOpenCenter,
  onOpenLens
}: CanvasProps) {
  const canvasRef = React.useRef<HTMLDivElement | null>(null)
  const [pan, setPan] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      // Range -1..1 across the viewport.
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1
      // Pan in the *inverse* direction so the cursor "pulls" hidden cards
      // into view. Multiplied by PAN_RANGE_PX for a gentle sweep.
      setPan({ x: -nx * PAN_RANGE_PX, y: -ny * PAN_RANGE_PX })
    },
    [prefersReducedMotion]
  )

  const handleMouseLeave = React.useCallback(() => {
    setPan({ x: 0, y: 0 })
  }, [])

  const cardsStyle: React.CSSProperties = {
    ['--pan-x' as string]: `${pan.x.toFixed(2)}px`,
    ['--pan-y' as string]: `${pan.y.toFixed(2)}px`
  }

  return (
    <div
      ref={canvasRef}
      className={`${styles.canvas} ${mounted ? styles.canvasVisible : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <BackgroundField />

      <div className={styles.cards} style={cardsStyle}>
        {LENSES.map((lens, i) => (
          <LensCard
            key={lens.id}
            lens={lens}
            index={i}
            visible={mounted}
            onOpen={() => onOpenLens(lens.id)}
          />
        ))}

        <CenterCard visible={mounted} onOpen={onOpenCenter} />
      </div>
    </div>
  )
}

function BackgroundField() {
  return (
    <div className={styles.bgWrap} aria-hidden='true'>
      <div className={styles.bgGrid} />
    </div>
  )
}

// ============================================================================
// Cards
// ============================================================================

type LensCardProps = {
  lens: Lens
  index: number
  visible: boolean
  onOpen: () => void
}

function LensCard({
  lens,
  index,
  visible,
  onOpen
}: LensCardProps) {
  // Stagger entrance by row (y) then column (x). Cards in the same row
  // come in within ~60ms; rows are ~110ms apart. The whole reveal
  // wraps in roughly 500ms after `cardsIn`.
  const rowIndex = Math.round(lens.y / 28) // 0..3 across rows at y=8,36,64,92
  const colIndex = Math.round((lens.x - 3) / 19) // 0..5 across cols at x=3,22,41,59,78,97
  const delay = TIMING.cardsIn + rowIndex * 110 + colIndex * 25 + (index % 3) * 8

  const style: React.CSSProperties = {
    left: `${lens.x}%`,
    top: `${lens.y}%`,
    transitionDelay: visible ? `${delay}ms` : '0ms',
    ['--card-bg' as string]: lens.bg,
    ['--card-fg' as string]: lens.fg,
    ['--card-accent' as string]: lens.accent ?? lens.fg
  }

  return (
    <button
      type='button'
      className={`${styles.card} ${visible ? styles.cardVisible : ''}`}
      style={style}
      onClick={onOpen}
      aria-label={`Open lens: ${lens.title}`}
    >
      <span className={styles.cardArt} aria-hidden='true'>
        <Illustration
          id={lens.illustration}
          fg={lens.fg}
          bg={lens.bg}
          accent={lens.accent ?? lens.fg}
        />
      </span>
      <span className={styles.cardTitle}>{lens.title}</span>
    </button>
  )
}

type CenterCardProps = {
  visible: boolean
  onOpen: () => void
}

function CenterCard({ visible, onOpen }: CenterCardProps) {
  const style: React.CSSProperties = {
    transitionDelay: visible ? `${TIMING.centerIn}ms` : '0ms'
  }

  return (
    <button
      type='button'
      className={`${styles.centerCard} ${visible ? styles.centerCardVisible : ''}`}
      style={style}
      onClick={onOpen}
      aria-label='Open: Lenses index'
    >
      <span className={styles.cardArt} aria-hidden='true'>
        <Illustration
          id='lenses-deck'
          fg='#F5F1E8'
          bg='#0E0E10'
          accent='#F2C04A'
        />
      </span>
      <span className={styles.centerCardTitle}>Lenses</span>
    </button>
  )
}

// ============================================================================
// Side panel
// ============================================================================

function SidePanel({
  lens,
  onClose,
  onOpenLens
}: {
  lens: Lens | null
  onClose: () => void
  onOpenLens: (id: string) => void
}) {
  const open = !!lens
  const [shown, setShown] = React.useState<Lens | null>(lens)
  const [bodyKey, setBodyKey] = React.useState(0)

  React.useEffect(() => {
    if (lens) {
      setShown(lens)
      setBodyKey((k) => k + 1)
    }
  }, [lens])

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose()
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.panelOverlay} />
        <DialogPrimitive.Content
          className={styles.panel}
          style={
            shown
              ? ({
                  ['--panel-bg' as string]: shown.bg,
                  ['--panel-fg' as string]: shown.fg,
                  ['--panel-accent' as string]: shown.accent ?? shown.fg
                } as React.CSSProperties)
              : undefined
          }
          aria-describedby={undefined}
        >
          {shown && (
            <>
              <div className={styles.panelHero}>
                <span className={styles.panelArt} aria-hidden='true'>
                  <Illustration
                    id={shown.illustration}
                    fg={shown.fg}
                    bg={shown.bg}
                    accent={shown.accent ?? shown.fg}
                  />
                </span>
                <div className={styles.panelHeroText}>
                  <span className={styles.panelEyebrow}>{shown.category}</span>
                  <DialogPrimitive.Title className={styles.panelTitle}>
                    {shown.title}
                  </DialogPrimitive.Title>
                  <p className={styles.panelTagline}>{shown.tagline}</p>
                </div>
                <DialogPrimitive.Close
                  className={styles.panelClose}
                  aria-label='Close panel'
                >
                  <CloseIcon />
                </DialogPrimitive.Close>
              </div>
              <div key={bodyKey} className={styles.panelBody}>
                {shown.body}
                {shown.related && shown.related.length > 0 && (
                  <div className={styles.relatedBlock}>
                    <span className={styles.relatedLabel}>Related lenses</span>
                    <div className={styles.relatedChips}>
                      {shown.related.map((id) => {
                        const r = LENS_BY_ID[id]
                        if (!r) return null
                        return (
                          <button
                            key={id}
                            type='button'
                            className={styles.relatedChip}
                            onClick={() => onOpenLens(id)}
                            style={
                              {
                                ['--chip-bg' as string]: r.bg,
                                ['--chip-fg' as string]: r.fg
                              } as React.CSSProperties
                            }
                          >
                            <span
                              className={styles.relatedChipSwatch}
                              aria-hidden='true'
                            />
                            {r.title}
                            <span
                              className={styles.relatedChipArrow}
                              aria-hidden='true'
                            >
                              →
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

// ============================================================================
// Center dialog — index of all lenses
// ============================================================================

function CenterDialog({
  open,
  onOpenChange,
  onOpenLens
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenLens: (id: string) => void
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.dialogOverlay} />
        <DialogPrimitive.Content
          className={styles.dialog}
          aria-describedby={undefined}
        >
          <div className={styles.dialogInner}>
            <span className={styles.dialogEyebrow}>Index</span>
            <DialogPrimitive.Title className={styles.dialogTitle}>
              Lenses
            </DialogPrimitive.Title>
            <div className={styles.dialogIntro}>
              <p>
                A lens is a way of looking — a model the mind reaches for to
                make a complicated thing legible. Each one foregrounds something
                real, and each one quietly hides everything else.
              </p>
              <p>
                The mistake is to pick one and live inside it. Hold many,
                lightly. Look at the same situation through three different ones
                in a row and notice what each surfaces and what each occludes.
                The combined image is never finished — but it is more honest
                than any single frame can be.
              </p>
            </div>

            <ul className={styles.dialogList}>
              {LENSES.map((lens) => (
                <li key={lens.id} className={styles.dialogListItem}>
                  <button
                    type='button'
                    className={styles.dialogJumpBtn}
                    onClick={() => onOpenLens(lens.id)}
                    style={
                      {
                        ['--jump-bg' as string]: lens.bg,
                        ['--jump-fg' as string]: lens.fg,
                        ['--jump-accent' as string]: lens.accent ?? lens.fg
                      } as React.CSSProperties
                    }
                  >
                    <span className={styles.dialogJumpArt} aria-hidden='true'>
                      <Illustration
                        id={lens.illustration}
                        fg={lens.fg}
                        bg={lens.bg}
                        accent={lens.accent ?? lens.fg}
                      />
                    </span>
                    <span className={styles.dialogJumpText}>
                      <span className={styles.dialogJumpCategory}>
                        {lens.category}
                      </span>
                      <span className={styles.dialogJumpTitle}>
                        {lens.title}
                      </span>
                      <span className={styles.dialogJumpTagline}>
                        {lens.tagline}
                      </span>
                    </span>
                    <span className={styles.dialogJumpArrow} aria-hidden='true'>
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <DialogPrimitive.Close
              className={styles.dialogCloseBtn}
              aria-label='Close'
            >
              <CloseIcon />
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

// ============================================================================
// Illustrations — flat, geometric, Pip-deck-ish
// ============================================================================

type IllustrationProps = {
  id: IllustrationId
  fg: string
  bg: string
  accent: string
}

function Illustration({ id, fg, bg, accent }: IllustrationProps) {
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

/** Center "Lenses" card: a 4×5 grid of mini glyphs — a deck preview. */
function ArtLensesDeck({
  fg,
  accent,
  bg
}: {
  fg: string
  accent: string
  bg: string
}) {
  // 20 mini glyph slots. 4 cols × 5 rows.
  const cells = [
    { x: 0, y: 0, kind: 'pillars' },
    { x: 1, y: 0, kind: 'concentric' },
    { x: 2, y: 0, kind: 'frame' },
    { x: 3, y: 0, kind: 'steps' },
    { x: 0, y: 1, kind: 'rings' },
    { x: 1, y: 1, kind: 'target' },
    { x: 2, y: 1, kind: 'matrix' },
    { x: 3, y: 1, kind: 'loop' },
    { x: 0, y: 2, kind: 'head' },
    { x: 1, y: 2, kind: 'lines' },
    { x: 2, y: 2, kind: 'arc' },
    { x: 3, y: 2, kind: 'brackets' },
    { x: 0, y: 3, kind: 'window' },
    { x: 1, y: 3, kind: 'bolt' },
    { x: 2, y: 3, kind: 'map' },
    { x: 3, y: 3, kind: 'dots' },
    { x: 0, y: 4, kind: 'bell' },
    { x: 1, y: 4, kind: 'talk' },
    { x: 2, y: 4, kind: 'branch' },
    { x: 3, y: 4, kind: 'atoms' }
  ] as const

  const cellSize = 16
  const gap = 3
  const gridW = cellSize * 4 + gap * 3
  const gridH = cellSize * 5 + gap * 4
  const startX = (100 - gridW) / 2
  const startY = (100 - gridH) / 2

  return (
    <svg {...SVG_BASE} aria-hidden='true'>
      {cells.map(({ x, y, kind }, i) => {
        const cx = startX + x * (cellSize + gap)
        const cy = startY + y * (cellSize + gap)
        const isAccent = i === 5 // single accent tile to anchor the eye
        const ink = isAccent ? accent : fg
        const op = isAccent ? 1 : 0.7
        // MiniGlyph paths are drawn at 18-unit scale; uniformly scale to fit cellSize.
        const s = cellSize / 18
        return (
          <g
            key={i}
            transform={`translate(${cx} ${cy}) scale(${s})`}
            opacity={op}
          >
            <MiniGlyph kind={kind} ink={ink} />
          </g>
        )
      })}
      {/* keep `bg` referenced (avoid unused-prop warnings if linted) */}
      <rect x='0' y='0' width='0' height='0' fill={bg} />
    </svg>
  )
}

function MiniGlyph({ kind, ink }: { kind: string; ink: string }) {
  // Each glyph fits inside an 18×18 box centered at (9,9).
  const stroke = ink
  switch (kind) {
    case 'pillars':
      return (
        <g fill={ink}>
          <rect x='2' y='10' width='3' height='6' />
          <rect x='7' y='6' width='3' height='10' />
          <rect x='12' y='9' width='3' height='7' />
        </g>
      )
    case 'concentric':
      return (
        <g fill={ink}>
          <circle cx='9' cy='9' r='7' opacity='0.4' />
          <circle cx='9' cy='9' r='4' opacity='0.7' />
          <circle cx='9' cy='9' r='2' />
        </g>
      )
    case 'frame':
      return (
        <g>
          <rect
            x='1.5'
            y='1.5'
            width='15'
            height='15'
            fill='none'
            stroke={stroke}
            strokeWidth='1'
          />
          <rect x='7' y='7' width='4' height='4' fill={ink} />
        </g>
      )
    case 'steps':
      return (
        <g fill={ink}>
          <rect x='2' y='12' width='3' height='4' />
          <rect x='6' y='8' width='3' height='8' />
          <rect x='10' y='4' width='3' height='12' />
        </g>
      )
    case 'rings':
      return (
        <g fill='none' stroke={stroke} strokeWidth='1'>
          <circle cx='9' cy='9' r='7' />
          <circle cx='9' cy='9' r='4' />
          <circle cx='13' cy='5' r='1.6' fill={ink} stroke='none' />
        </g>
      )
    case 'target':
      return (
        <g>
          <circle cx='10' cy='9' r='6' fill={ink} opacity='0.4' />
          <circle cx='10' cy='9' r='3' fill={ink} />
          <line x1='1' y1='9' x2='7' y2='9' stroke={stroke} strokeWidth='1.4' />
        </g>
      )
    case 'matrix':
      return (
        <g stroke={stroke} strokeWidth='0.8' fill='none'>
          <rect x='2' y='2' width='14' height='14' />
          <line x1='9' y1='2' x2='9' y2='16' />
          <line x1='2' y1='9' x2='16' y2='9' />
          <rect x='10' y='10' width='5' height='5' fill={ink} stroke='none' />
        </g>
      )
    case 'loop':
      return (
        <g fill='none' stroke={stroke} strokeWidth='1.2'>
          <circle cx='9' cy='9' r='6' strokeDasharray='13 3' />
          <polygon points='13,4 16,7 12,8' fill={ink} stroke='none' />
        </g>
      )
    case 'head':
      return (
        <path
          d='M 5 16 L 5 7 Q 5 3 9 3 Q 13 3 13 7 Q 13 9 11 10 L 11 14 L 8 14 L 8 16 Z'
          fill={ink}
          opacity='0.7'
        />
      )
    case 'lines':
      return (
        <g stroke={stroke} strokeWidth='1' fill='none' strokeLinecap='round'>
          <path d='M 2 5 Q 5 3 8 5 T 14 5' />
          <path d='M 2 9 Q 5 7 8 9 T 14 9' />
          <path d='M 2 13 Q 5 11 8 13 T 14 13' />
        </g>
      )
    case 'arc':
      return (
        <g>
          <path
            d='M 2 14 Q 9 2 16 14'
            stroke={stroke}
            strokeWidth='1.2'
            fill='none'
          />
          <circle cx='9' cy='4' r='1.6' fill={ink} />
        </g>
      )
    case 'brackets':
      return (
        <g stroke={stroke} strokeWidth='1.2' fill='none'>
          <path d='M 5 3 L 2 3 L 2 15 L 5 15' />
          <path d='M 13 3 L 16 3 L 16 15 L 13 15' />
          <line x1='6' y1='12' x2='12' y2='6' stroke={ink} />
        </g>
      )
    case 'window':
      return (
        <g stroke={stroke} strokeWidth='1' fill='none'>
          <rect x='2' y='3' width='14' height='12' rx='1' />
          <line x1='2' y1='6.5' x2='16' y2='6.5' />
          <rect x='5' y='9' width='6' height='3' fill={ink} stroke='none' />
        </g>
      )
    case 'bolt':
      return <polygon points='10,2 5,10 9,10 7,16 13,8 9,8 11,2' fill={ink} />
    case 'map':
      return (
        <g>
          <path
            d='M 2 4 L 6 3 L 10 5 L 14 3 L 14 14 L 10 15 L 6 13 L 2 14 Z'
            fill={ink}
            opacity='0.4'
          />
          <path
            d='M 4 11 Q 7 7 10 9 T 14 6'
            stroke={stroke}
            strokeWidth='1'
            fill='none'
            strokeDasharray='2 2'
          />
        </g>
      )
    case 'dots':
      return (
        <g fill={ink}>
          <circle cx='4' cy='5' r='1.4' opacity='0.5' />
          <circle cx='9' cy='9' r='1.6' />
          <circle cx='14' cy='5' r='1.4' opacity='0.5' />
          <circle cx='5' cy='13' r='1.4' opacity='0.5' />
          <circle cx='13' cy='13' r='1.4' opacity='0.5' />
        </g>
      )
    case 'bell':
      // Probabilistic — tiny bell curve.
      return (
        <g>
          <path
            d='M 2 14 C 5 14, 6 14, 7 10 C 8 5, 10 5, 11 10 C 12 14, 13 14, 16 14'
            stroke={stroke}
            strokeWidth='1.2'
            fill='none'
            strokeLinecap='round'
          />
          <circle cx='9' cy='15' r='1.2' fill={ink} />
        </g>
      )
    case 'talk':
      // Communication — two facing dots with a gap.
      return (
        <g fill={ink}>
          <circle cx='4' cy='9' r='2.4' />
          <circle cx='14' cy='9' r='2.4' />
          <line
            x1='7'
            y1='9'
            x2='11'
            y2='9'
            stroke={stroke}
            strokeWidth='1'
            strokeDasharray='1 1.5'
          />
        </g>
      )
    case 'branch':
      // Mimetics — one source, branching copies.
      return (
        <g>
          <g stroke={stroke} strokeWidth='0.8' opacity='0.6' fill='none'>
            <line x1='4' y1='9' x2='10' y2='4' />
            <line x1='4' y1='9' x2='10' y2='14' />
          </g>
          <circle cx='4' cy='9' r='2' fill={ink} />
          <circle cx='11' cy='4' r='1.6' fill={ink} opacity='0.7' />
          <circle cx='11' cy='14' r='1.6' fill={ink} opacity='0.7' />
          <circle cx='15' cy='9' r='1.2' fill={ink} opacity='0.5' />
          <line
            x1='12'
            y1='5'
            x2='14'
            y2='8'
            stroke={stroke}
            strokeWidth='0.8'
            opacity='0.5'
          />
          <line
            x1='12'
            y1='13'
            x2='14'
            y2='10'
            stroke={stroke}
            strokeWidth='0.8'
            opacity='0.5'
          />
        </g>
      )
    case 'atoms':
      // Primitives — three tiny atoms.
      return (
        <g fill={ink}>
          <circle cx='4' cy='9' r='2' />
          <rect x='7.5' y='6.5' width='4' height='4' />
          <polygon points='15,12 12,12 13.5,8' />
        </g>
      )
    default:
      return null
  }
}

function CloseIcon() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      aria-hidden='true'
    >
      <line x1='2' y1='2' x2='12' y2='12' />
      <line x1='12' y1='2' x2='2' y2='12' />
    </svg>
  )
}

// ============================================================================
// Hooks
// ============================================================================

function usePrefersReducedMotion() {
  const [prefers, setPrefers] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefers(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setPrefers(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return prefers
}
