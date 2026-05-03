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
    x: 18.75,
    y: 12,
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
          that without them, the trajectory is unrecognizable.
        </p>
        <p>
          Through this lens, founders, generals, prophets, and inventors become
          the unit of analysis. The question shifts from{' '}
          <em>what conditions produced this?</em> to{' '}
          <em>who decided, who saw it first, who refused to give in?</em>
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
    x: 81.25,
    y: 12,
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
    x: 18.75,
    y: 88,
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
    x: 31.25,
    y: 88,
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
    x: 68.75,
    y: 12,
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
    x: 43.75,
    y: 88,
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
    x: 56.25,
    y: 88,
    bg: '#2E6B7C',
    fg: '#F1EFE3',
    accent: '#F2C04A',
    illustration: 'game-theory',
    related: ['incentives', 'utility', 'interface'],
    body: (
      <>
        <p>
          Life, products, and organizations are shaped by rules, rewards,
          feedback loops, and affordances. The best of them make the right
          behavior <em>feel playable</em> — clear objective, visible progress,
          fair odds, meaningful choice at every turn.
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
          crowd out intrinsic motivation. But the best designers, coaches, and
          managers are quietly thinking in payoffs and moves.
        </p>
      </>
    )
  },
  {
    id: 'systems',
    category: 'Causality',
    title: 'Systems',
    tagline: 'Outcomes emerge from loops.',
    x: 68.75,
    y: 88,
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
    x: 18.75,
    y: 38,
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
    x: 68.75,
    y: 38,
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
    x: 31.25,
    y: 12,
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
    x: 31.25,
    y: 62,
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
    x: 68.75,
    y: 62,
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
    x: 18.75,
    y: 62,
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
    x: 81.25,
    y: 38,
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
    x: 56.25,
    y: 12,
    bg: '#9CAB87',
    fg: '#1F2A2A',
    accent: '#3F6B4E',
    illustration: 'osmosis',
    related: ['mimetics', 'headspace', 'status'],
    body: (
      <>
        <p>
          People absorb culture, standards, vocabulary, and taste from their
          environment. Most growth is not effortful self-improvement — it is
          steady proximity to better defaults. Put yourself near high-signal
          people and artifacts and you become what you repeatedly notice.
        </p>
        <p>
          Through this lens, who you spend time with, what you read, where you
          work, and what you stare at on a phone screen are all training data.
          The slow upgrade compounds: you start producing the kind of work,
          holding the kind of opinions, having the kind of instincts of the
          people you keep around you.
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
    x: 81.25,
    y: 88,
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
          start asking <em>what&rsquo;s the spread, and where&rsquo;s my edge?</em>{' '}
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
    x: 31.25,
    y: 38,
    bg: '#A66D4F',
    fg: '#FAF1E6',
    accent: '#F2C04A',
    illustration: 'communication',
    related: ['headspace', 'narrative', 'interface'],
    body: (
      <>
        <p>
          Almost every problem between two people is, at root, a communication
          problem. Different vocabularies, different unsaid assumptions,
          different stakes — and the gap quietly grows until it surfaces as
          conflict, drift, or a bad outcome neither wanted.
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
    x: 43.75,
    y: 12,
    bg: '#E55A8E',
    fg: '#FBF1F4',
    accent: '#F2C04A',
    illustration: 'mimetics',
    related: ['narrative', 'osmosis', 'status'],
    body: (
      <>
        <p>
          Ideas, beliefs, formats, and aesthetics compete to spread, the way
          organisms compete to reproduce. The ones you see most are not
          necessarily the truest or the most useful — they are the most{' '}
          <em>transmissible</em>. Catchy beats correct; sticky beats subtle;
          shareable beats nuanced, almost every time.
        </p>
        <p>
          Through this lens, the question stops being{' '}
          <em>is this idea right?</em> and becomes{' '}
          <em>
            why is this idea winning right now, and what does it offer the
            people carrying it?
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
    x: 81.25,
    y: 62,
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
  },

  // ── Outer columns: the deck grew ──────────────────────────────────────
  {
    id: 'projection',
    category: 'Psychology',
    title: 'Projection',
    tagline: 'What people say about others is also about themselves.',
    x: 6.25,
    y: 12,
    bg: '#4A5466',
    fg: '#F1EFE8',
    accent: '#E8B83A',
    illustration: 'projection',
    related: ['headspace', 'communication', 'narrative'],
    body: (
      <>
        <p>
          Almost every general statement a person makes is, to some degree, a
          self-portrait in disguise. Their feedback to others, the patterns
          they keep noticing, the flaws they find unbearable — the source is
          inside them, refracted onto whoever happens to be standing in
          front of them.
        </p>
        <p>
          Through this lens, listening changes. When someone says{' '}
          <em>people in this industry are all so insecure,</em> ask{' '}
          <em>what about me right now made that line feel important to
          say?</em> The same goes for praise: what someone admires reveals
          what they wish were more true of themselves.
        </p>
        <p>
          Weaknesses: not everything is projection — sometimes a sharp
          observation is just a sharp observation, and dismissing critique
          as &ldquo;they&rsquo;re just projecting&rdquo; is its own ugly
          move. But the part of the message that&rsquo;s about{' '}
          <em>them</em> is almost always the louder signal.
        </p>
      </>
    )
  },
  {
    id: 'attention',
    category: 'Psychology',
    title: 'Attention',
    tagline: 'You become what you keep looking at.',
    x: 6.25,
    y: 38,
    bg: '#1A2433',
    fg: '#F1EFE8',
    accent: '#F2D74A',
    illustration: 'attention',
    related: ['osmosis', 'energy', 'headspace'],
    body: (
      <>
        <p>
          Attention is the most concentrated form of energy a person
          spends, and it&rsquo;s spent constantly — on phones, conversations,
          worries, screens, faces, ideas. What you keep looking at trains
          the rest of you: your taste, your reactions, your sense of what
          counts as normal, your idea of what is even possible.
        </p>
        <p>
          Through this lens, the question stops being{' '}
          <em>what should I do with my time?</em> and becomes{' '}
          <em>what is allowed to occupy my attention, and what isn&rsquo;t?</em>{' '}
          Most regrets, on inspection, are not failures of effort — they
          are failures of attention. The wrong things were given the air.
        </p>
        <p>
          Weaknesses: rigid attention can become tunnel vision, and life
          rewards a certain amount of wandering. But unattended attention
          is the cheapest possession to lose without noticing.
        </p>
      </>
    )
  },
  {
    id: 'dopamine',
    category: 'Behavior',
    title: 'Dopamine',
    tagline: 'Behavior is internal-state regulation.',
    x: 6.25,
    y: 62,
    bg: '#C8395E',
    fg: '#FBF1F2',
    accent: '#FFE4B0',
    illustration: 'dopamine',
    related: ['energy', 'incentives', 'mimetics'],
    body: (
      <>
        <p>
          A surprising amount of human behavior makes more sense as{' '}
          <em>internal state regulation</em> than as goal-pursuit. People
          are seeking novelty, reward, relief, control, connection, or a
          sense of meaning — and the brain&rsquo;s dopamine system is
          quietly orchestrating most of it underneath the conscious story.
        </p>
        <p>
          Through this lens, scrolling, snacking, gambling, refreshing
          email, picking fights, falling in love, doomscrolling, and even
          starting a new project all start to look like flavors of the
          same loop: <em>I felt off; this promised to make it less off.</em>{' '}
          The fix isn&rsquo;t shame — it&rsquo;s noticing the loop and
          changing the inputs.
        </p>
        <p>
          Weaknesses: reducing all behavior to neurotransmitters flattens
          meaning that is genuinely there, and &ldquo;your dopamine made
          you do it&rdquo; can become a way to dodge responsibility. But
          most failures of self-control are state-regulation problems
          mislabeled as character problems.
        </p>
      </>
    )
  },
  {
    id: 'reps',
    category: 'Practice',
    title: 'Reps',
    tagline: 'Volume beats theory, almost every time.',
    x: 6.25,
    y: 88,
    bg: '#D9C9A3',
    fg: '#2A1F18',
    accent: '#7A2E2E',
    illustration: 'reps',
    related: ['expertise', 'energy', 'minimalism'],
    body: (
      <>
        <p>
          Almost every visible skill — writing, cooking, public speaking,
          coding, painting, reading people — was built by someone who did
          a lot of the thing, badly, for long enough that &ldquo;badly&rdquo;
          slowly stopped being true. Theory, frameworks, and feedback all
          help, but they&rsquo;re multipliers on a base of volume.
        </p>
        <p>
          Through this lens, &ldquo;I don&rsquo;t know how to do this&rdquo;
          almost always rephrases as{' '}
          <em>I haven&rsquo;t done it enough times yet.</em> The plan stops
          being &ldquo;learn it, then do it&rdquo; and becomes{' '}
          <em>do it, badly, on purpose, while paying attention.</em> Most
          ambitions die in the gap between knowing what to do and being
          willing to be bad at it for a while.
        </p>
        <p>
          Weaknesses: blind reps without feedback compound the wrong
          patterns, and not every skill rewards brute volume. But used
          with even a little reflection, this lens beats almost every
          alternative on raw return.
        </p>
      </>
    )
  },
  {
    id: 'agency',
    category: 'Philosophy',
    title: 'Agency',
    tagline: 'Most ceilings are self-imposed.',
    x: 93.75,
    y: 12,
    bg: '#B8332A',
    fg: '#FBF1E6',
    accent: '#F4E9D2',
    illustration: 'agency',
    related: ['great-man', 'narrative', 'incentives'],
    body: (
      <>
        <p>
          A surprising amount of what feels like a wall is actually a
          social convention, an unexamined assumption, or a story the
          person carrying it tells themselves. Real walls exist — but
          they&rsquo;re rarer than they feel, and most ceilings give if
          you push them on purpose.
        </p>
        <p>
          Through this lens, the question stops being{' '}
          <em>am I allowed to do this?</em> and becomes{' '}
          <em>who exactly is stopping me, and what would actually happen
          if I tried?</em> Many of the people who change their lives are
          not unusually talented; they are unusually unwilling to treat
          the default as the limit.
        </p>
        <p>
          Weaknesses: leaning too hard on agency curdles into a
          contempt for structural reality — some walls really are made of
          stone, and pretending otherwise hurts people. But walls are far
          easier to find than doors, so the default error is to under-try.
        </p>
      </>
    )
  },
  {
    id: 'expertise',
    category: 'Knowledge',
    title: 'Expertise',
    tagline: 'Every skill is a long, populated curve.',
    x: 93.75,
    y: 38,
    bg: '#2C5F70',
    fg: '#F1EFE3',
    accent: '#F2C04A',
    illustration: 'expertise',
    related: ['reps', 'legibility', 'primitives'],
    body: (
      <>
        <p>
          Every skill is a long curve, and people sit all over it. This is
          obvious for cooking or chess — but it&rsquo;s also true for the
          things we don&rsquo;t usually call skills: patience, listening,
          taste, charisma, attention, knowing when to stop. The world
          becomes much more legible the moment you start treating these
          as <em>practiced abilities</em> rather than fixed traits.
        </p>
        <p>
          Through this lens, &ldquo;I&rsquo;m not good at conflict&rdquo;
          rephrases as <em>I&rsquo;m on the early part of that curve.</em>{' '}
          The annoying coworker becomes someone with a different skill
          mix, not a different species. And the genuinely impressive
          person stops being a wonder and becomes a question:{' '}
          <em>which curve are they very far along, and how did they get
          there?</em>
        </p>
        <p>
          Weaknesses: reducing every quality to a skill flattens
          temperament and circumstance, and some abilities are genuinely
          gated by talent. But treating &ldquo;trait&rdquo; as the
          default explanation for behavior is one of the most common ways
          to misread a person.
        </p>
      </>
    )
  },
  {
    id: 'tempo',
    category: 'Strategy',
    title: 'Tempo',
    tagline: 'When matters as much as what.',
    x: 93.75,
    y: 62,
    bg: '#2D5A45',
    fg: '#F1EFE3',
    accent: '#D9923A',
    illustration: 'tempo',
    related: ['systems', 'incentives', 'probabilistic'],
    body: (
      <>
        <p>
          The same move at the right moment is brilliant; six months
          earlier or later, identical. Markets, conversations, careers,
          relationships, and products all run on tempo — windows where
          attention, energy, and readiness line up briefly, and the cost
          of acting collapses for a little while before going back up.
        </p>
        <p>
          Through this lens, you stop asking <em>is this a good idea?</em>{' '}
          and start asking <em>is this the right time for this idea?</em>{' '}
          The same pitch, hire, launch, or honest conversation lands very
          differently depending on what just happened. Most of strategy is
          reading tempo: knowing when to push, when to wait, and when the
          window has already closed.
        </p>
        <p>
          Weaknesses: timing fetishism becomes paralysis — there&rsquo;s
          almost always a reason to wait, and most windows feel
          inconvenient. But people who never read tempo do all the right
          things at all the wrong moments and wonder why nothing lands.
        </p>
      </>
    )
  },
  {
    id: 'surface-area',
    category: 'Luck',
    title: 'Surface area',
    tagline: 'Luck finds you where you’re exposed.',
    x: 93.75,
    y: 88,
    bg: '#E8C460',
    fg: '#3A2418',
    accent: '#C8492E',
    illustration: 'surface-area',
    related: ['osmosis', 'probabilistic', 'mimetics'],
    body: (
      <>
        <p>
          Lucky breaks happen — but only where you&rsquo;ve put yourself.
          The introduction comes from a dinner you almost skipped. The
          job comes from a tweet you almost didn&rsquo;t post. Most of
          what looks like fortune from the outside is, on closer
          inspection, the consequence of someone simply being{' '}
          <em>findable</em> in the right rooms.
        </p>
        <p>
          Through this lens, the leverage move is rarely &ldquo;work
          harder on the thing.&rdquo; It&rsquo;s <em>show up in more
          places where the thing might find you</em> — write publicly,
          take the unpaid coffee, go to the worse-looking event, post the
          half-formed idea. Surface area compounds, slowly, then suddenly.
        </p>
        <p>
          Weaknesses: maximum exposure with no substance becomes
          performance, and noise crowds out the signal. But quiet
          excellence in a closed room is the most common way for a real
          career to never start.
        </p>
      </>
    )
  }
]

export const LENS_BY_ID: Record<string, Lens> = Object.fromEntries(
  LENSES.map((l) => [l.id, l])
)
