import type { Lens } from './types'

/**
 * LENSES — the canonical list of lens cards.
 *
 *   Order matters: it controls the visual reading order in the central
 *   dialog index. Position (x, y) is in viewport-percent (0–100, where
 *   the card *center* lands). Lenses are arranged in a 6-col × 4-row
 *   grid with the center "Lenses" card occupying the middle 2×2 slot.
 *
 *   Each `body` is freeform JSX for the side-panel detail view.
 */
export const LENSES: Lens[] = [
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
    x: 30,
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
    x: 70,
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
    x: 70,
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
    x: 70,
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
    x: 30,
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
    x: 30,
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
    x: 70,
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
    x: 30,
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

export const LENS_BY_ID: Record<string, Lens> = Object.fromEntries(
  LENSES.map((l) => [l.id, l])
)
