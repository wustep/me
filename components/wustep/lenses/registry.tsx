import { GRID, type Lens } from './types'

/**
 * LENSES_RAW — the canonical list of lens cards.
 *
 *   The exported `LENSES` array (below) is this list sorted
 *   alphabetically by title and re-anchored onto the 8×4 canvas
 *   in reading order, skipping the middle 2×2 (the "Lenses"
 *   center card). Authoring stays grouped however we like; the
 *   on-canvas layout is always A→Z left-to-right, top-to-bottom.
 *
 *   The hand-authored `x`/`y` on each entry below is ignored —
 *   they're overwritten at module load. Kept on the type so the
 *   shape doesn't fork between authoring and runtime.
 *
 *   Each `body` is freeform JSX for the side-panel detail view.
 */
const LENSES_RAW: Lens[] = [
  {
    id: 'agency',
    category: 'Philosophy',
    title: 'Agency',
    tagline: 'Most ceilings are self-imposed.',
    x: 93.75,
    y: 12,
    bg: '#B43A2E',
    fg: '#F5EFE0',
    accent: '#F2C77A',
    illustration: 'agency',
    related: ['momentum', 'narrative', 'incentives'],
    readings: [
      {
        label: 'How to be more agentic — Cate Hall',
        href: 'https://usefulfictions.substack.com/p/how-to-be-more-agentic'
      }
    ],
    body: (
      <>
        <p>
          A surprising amount of what feels like a wall is actually a social
          convention, an unexamined assumption, or a story the person carrying
          it tells themselves. Real walls exist — but they&rsquo;re rarer than
          they feel, and most ceilings give if you push them on purpose.
        </p>
        <p>
          Through this lens, the question stops being{' '}
          <em>am I allowed to do this?</em> and becomes{' '}
          <em>
            who exactly is stopping me, and what would actually happen if I
            tried?
          </em>{' '}
          Many of the people who change their lives are not unusually talented;
          they are unusually unwilling to treat the default as the limit.
        </p>
        <p>
          Weaknesses: leaning too hard on agency curdles into a contempt for
          structural reality — some walls really are made of stone, and
          pretending otherwise hurts people. But walls are far easier to find
          than doors, so the default error is to under-try.
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
    bg: '#243449',
    fg: '#F5EFE0',
    accent: '#E8B547',
    illustration: 'attention',
    related: ['osmosis', 'energy', 'headspace'],
    body: (
      <>
        <p>
          Attention is the most concentrated form of energy a person spends, and
          it&rsquo;s spent constantly — on phones, conversations, worries,
          screens, faces, ideas. What you keep looking at trains the rest of
          you: your taste, your reactions, your sense of what counts as normal,
          your idea of what is even possible.
        </p>
        <p>
          Through this lens, the question stops being{' '}
          <em>what should I do with my time?</em> and becomes{' '}
          <em>what is allowed to occupy my attention, and what isn&rsquo;t?</em>{' '}
          Most regrets, on inspection, are not failures of effort — they are
          failures of attention. The wrong things were given the air.
        </p>
        <p>
          Weaknesses: rigid attention can become tunnel vision, and life rewards
          a certain amount of wandering. But unattended attention is the
          cheapest possession to lose without noticing.
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
    bg: '#9B6240',
    fg: '#F5EFE0',
    accent: '#E8B97A',
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
    id: 'constraint',
    category: 'Design',
    title: 'Constraint',
    tagline: 'The right limit creates expression.',
    x: 31.25,
    y: 62,
    bg: '#2F3138',
    fg: '#F5EFE0',
    accent: '#D9A23A',
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
    id: 'dopamine',
    category: 'Behavior',
    title: 'Dopamine',
    tagline: 'Behavior is internal-state regulation.',
    x: 6.25,
    y: 62,
    bg: '#B83A5C',
    fg: '#F5EFE0',
    accent: '#F2D9A0',
    illustration: 'dopamine',
    related: ['energy', 'incentives', 'mimetics'],
    readings: [
      {
        label: 'The Molecule of More — Daniel Z. Lieberman & Michael E. Long',
        href: 'https://amzn.to/4283g1X'
      }
    ],
    body: (
      <>
        <p>
          A surprising amount of human behavior makes more sense as{' '}
          <em>internal state regulation</em> than as goal-pursuit. People are
          seeking novelty, reward, relief, control, connection, or a sense of
          meaning — and the brain&rsquo;s dopamine system is quietly
          orchestrating most of it underneath the conscious story.
        </p>
        <p>
          Through this lens, scrolling, snacking, gambling, refreshing email,
          picking fights, falling in love, doomscrolling, and even starting a
          new project all start to look like flavors of the same loop:{' '}
          <em>I felt off; this promised to make it less off.</em> The fix
          isn&rsquo;t shame — it&rsquo;s noticing the loop and changing the
          inputs.
        </p>
        <p>
          Weaknesses: reducing all behavior to neurotransmitters flattens
          meaning that is genuinely there, and &ldquo;your dopamine made you do
          it&rdquo; can become a way to dodge responsibility. But most failures
          of self-control are state-regulation problems mislabeled as character
          problems.
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
    bg: '#6B7A38',
    fg: '#F5EFE0',
    accent: '#F2D055',
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
    bg: '#4E3563',
    fg: '#F5EFE0',
    accent: '#E8A370',
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
    id: 'evo-psych',
    category: 'Psychology',
    title: 'Evolutionary psychology',
    tagline: 'Old hardware, new world.',
    x: 81.25,
    y: 12,
    bg: '#2F5C42',
    fg: '#F5EFE0',
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
    id: 'expertise',
    category: 'Knowledge',
    title: 'Expertise',
    tagline: 'Every skill is a long, populated curve.',
    x: 93.75,
    y: 38,
    bg: '#1F5564',
    fg: '#F5EFE0',
    accent: '#F2B144',
    illustration: 'expertise',
    related: ['taste', 'legibility', 'primitives'],
    body: (
      <>
        <p>
          Every skill is a long curve, and people sit all over it. This is
          obvious for cooking or chess — but it&rsquo;s also true for the things
          we don&rsquo;t usually call skills: patience, listening, taste,
          charisma, attention, knowing when to stop. The world becomes much more
          legible the moment you start treating these as{' '}
          <em>practiced abilities</em> rather than fixed traits.
        </p>
        <p>
          Through this lens, &ldquo;I&rsquo;m not good at conflict&rdquo;
          rephrases as <em>I&rsquo;m on the early part of that curve.</em> The
          annoying coworker becomes someone with a different skill mix, not a
          different species. And the genuinely impressive person stops being a
          wonder and becomes a question:{' '}
          <em>
            which curve are they very far along, and how did they get there?
          </em>
        </p>
        <p>
          Weaknesses: reducing every quality to a skill flattens temperament and
          circumstance, and some abilities are genuinely gated by talent. But
          treating &ldquo;trait&rdquo; as the default explanation for behavior
          is one of the most common ways to misread a person.
        </p>
      </>
    )
  },
  {
    id: 'game-theory',
    category: 'Strategy',
    title: 'Game theory',
    tagline: 'Make good behavior playable.',
    x: 56.25,
    y: 88,
    bg: '#206470',
    fg: '#F5EFE0',
    accent: '#F2B85A',
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
    id: 'headspace',
    category: 'Psychology',
    title: 'Headspace',
    tagline: 'Enter the world-model first.',
    x: 18.75,
    y: 38,
    bg: '#6B5E9C',
    fg: '#F5EFE0',
    accent: '#F2C77A',
    illustration: 'headspace',
    related: ['communication', 'narrative', 'energy'],
    readings: [{ label: 'Headspace', href: '/headspace' }],
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
    id: 'identity',
    category: 'Philosophy',
    title: 'Identity',
    tagline: 'The self is a construct you can edit.',
    x: 93.75,
    y: 88,
    bg: '#E0B856',
    fg: '#2A1A12',
    accent: '#B43A2E',
    illustration: 'identity',
    related: ['agency', 'narrative', 'headspace'],
    readings: [
      { label: 'Atomic Habits — James Clear', href: 'https://amzn.to/4w6JdP7' }
    ],
    body: (
      <>
        <p>
          Identity is a construct, not a fact. The story you tell about who you
          are — your nature, your limits, the kind of person you are and
          aren&rsquo;t — is a pattern in your headspace, not a property of the
          universe. And like any pattern, it can be examined, loosened, and
          rewritten.
        </p>
        <p>
          Through this lens, behavior follows identity more reliably than it
          follows goals. <em>I&rsquo;m the kind of person who…</em> is a
          stronger engine than <em>I&rsquo;m trying to…</em> Loosening the grip
          on a fixed self — sometimes called ego death — opens up headspaces you
          previously couldn&rsquo;t inhabit, and makes you more resilient to
          ego-challenges, since fewer things feel like attacks on who you are.
        </p>
        <p>
          Weaknesses: too much detachment becomes drift, and identities do real
          coordinating work — they tell other people what to expect from you.
          But treating your identity as fixed is the fastest way to mistake your
          current configuration for your permanent one.
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
    bg: '#CC9A2E',
    fg: '#1B2754',
    accent: '#1B2754',
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
  {
    id: 'interface',
    category: 'Design',
    title: 'Interface',
    tagline: 'Everything has a UX.',
    x: 68.75,
    y: 62,
    bg: '#D87555',
    fg: '#F5EFE0',
    accent: '#1B2754',
    illustration: 'interface',
    related: ['legibility', 'minimalism', 'energy'],
    readings: [
      {
        label: 'The Design of Everyday Things — Don Norman',
        href: 'https://amzn.to/4n7GyQV'
      }
    ],
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
    id: 'legibility',
    category: 'Knowledge',
    title: 'Legibility',
    tagline: 'Name it to improve it.',
    x: 68.75,
    y: 38,
    bg: '#4A7FA8',
    fg: '#F5EFE0',
    accent: '#F2C77A',
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
          Legibility is also how others come to know you. Reputation,
          credibility, and rewards accrue to what is <em>visible</em> — people
          can only judge, trust, or champion what they can actually see. The
          quietly excellent engineer and the loudly mediocre one often trade
          places in the org&rsquo;s memory because one shipped legibility and
          the other did not. Making your work, your reasoning, and your
          standards readable to others isn&rsquo;t self-promotion; it&rsquo;s
          giving people the surface area they need to back you.
        </p>
        <p>
          Weaknesses: legibility can flatten what matters into what fits in a
          chart, and metrics get gamed. But darkness is rarely an upgrade.
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
    bg: '#D44A7C',
    fg: '#F5EFE0',
    accent: '#F2D055',
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
    id: 'minimalism',
    category: 'Aesthetic',
    title: 'Minimalism',
    tagline: 'What is essential? Subtract the rest.',
    x: 18.75,
    y: 88,
    bg: '#E8DCC0',
    fg: '#1A1A1A',
    accent: '#B43A2E',
    illustration: 'minimalism',
    related: ['constraint', 'primitives', 'interface'],
    body: (
      <>
        <p>
          Dieter Rams put it in three words:{' '}
          <em>&ldquo;Weniger, aber besser&rdquo;</em> — less, but better. Value
          comes from what remains after you remove the unnecessary. Not
          aesthetic austerity for its own sake, but a discipline of asking{' '}
          <em>what is the smallest thing that still does the job?</em> — and
          then making that thing exceptional.
        </p>
        <p>
          Through this lens, complexity is a tax. Every feature, possession,
          obligation, abstraction, and relationship has a hidden cost —
          cognitive, maintenance, emotional, financial. The cost is rarely
          visible at the moment of acquisition; it shows up later, as friction,
          clutter, and the slow erosion of attention. Subtraction is creative
          work, and often the harder half of it.
        </p>
        <p>
          The lens applies as much to a life as to a product. What you make, but
          also what you own, what you commit to, who you say yes to, what you
          let onto your calendar, what you allow into your head. A clean surface
          is downstream of a hundred small refusals. The minimalist isn&rsquo;t
          the person with nothing; they&rsquo;re the person whose remaining
          things — projects, possessions, people, beliefs — have all earned
          their place. Default accumulation runs the other direction
          automatically; staying lean takes intent.
        </p>
        <p>
          Weaknesses: the world is genuinely complicated, and over-pruned
          systems are brittle. Aestheticized minimalism can curdle into
          performance — empty rooms, empty calendars, empty work — where the
          subtraction becomes the point instead of the means. But as a
          counterweight to default accumulation, the lens is nearly always
          corrective: less, but better, applied to almost anything.
        </p>
      </>
    )
  },
  {
    id: 'momentum',
    category: 'Strategy',
    title: 'Momentum',
    tagline: 'Consistency is the currency that buys bold moves.',
    x: 93.75,
    y: 62,
    bg: '#1F4A38',
    fg: '#F5EFE0',
    accent: '#E8A370',
    illustration: 'momentum',
    related: ['agency', 'systems', 'taste'],
    body: (
      <>
        <p>
          Most people think about effort as a single push: how hard, in what
          direction, right now. Momentum is the idea that what you can do today
          depends on what you&rsquo;ve been doing. Effort compounds into mass —
          trust, reputation, shipping cadence, a team that expects to win — and
          that mass is what makes the hard moves possible later. The unpopular
          call, the risky bet, the honest conversation: all of them are easier
          to land when you&rsquo;ve built the credibility to spend.
        </p>
        <p>
          Through this lens, the question is rarely{' '}
          <em>should I do this now?</em> but{' '}
          <em>
            am I building the momentum I&rsquo;ll need, and spending it on the
            right things?
          </em>{' '}
          Early wins aren&rsquo;t vanity; they&rsquo;re mass you&rsquo;ll cash
          in later. Consistency isn&rsquo;t conservatism; it&rsquo;s the
          currency that buys the right to be bold. And you rarely stop momentum
          head-on — you nudge its vector. A small push on something already
          moving beats a big push against something that&rsquo;s going to win
          regardless.
        </p>
        <p>
          Weaknesses: the lens romanticizes motion and underrates the deliberate
          halt — sometimes the highest-value move is stopping a thing that
          shouldn&rsquo;t continue, and <em>we have momentum here</em> is how
          bad projects survive. It also flatters incumbents, who confuse
          inherited mass with earned mass. But ignoring momentum is how smart
          people keep making technically-correct moves that don&rsquo;t land,
          because they never built the standing to make them work.
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
    bg: '#A8513A',
    fg: '#F5EFE0',
    accent: '#F2C77A',
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
    id: 'osmosis',
    category: 'Growth',
    title: 'Osmosis',
    tagline: 'Become what you repeatedly notice.',
    x: 56.25,
    y: 12,
    bg: '#8FA376',
    fg: '#1F2A1F',
    accent: '#2F5C42',
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
    id: 'primitives',
    category: 'Design',
    title: 'Primitives',
    tagline: 'Find the simpler thing underneath.',
    x: 81.25,
    y: 62,
    bg: '#2F4DB0',
    fg: '#F5EFE0',
    accent: '#F2D055',
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
  {
    id: 'probabilistic',
    category: 'Reasoning',
    title: 'Probabilistic thinking',
    tagline: 'The world runs in distributions.',
    x: 81.25,
    y: 88,
    bg: '#5C6878',
    fg: '#F5EFE0',
    accent: '#E8B547',
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
          <em>what&rsquo;s the spread, and where&rsquo;s my edge?</em> Plans
          become ranges. Confidence becomes calibration. A 70% chance is not a
          promise; it is a posture.
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
    id: 'projection',
    category: 'Psychology',
    title: 'Projection',
    tagline: 'What people say about others is also about themselves.',
    x: 6.25,
    y: 12,
    bg: '#3D4756',
    fg: '#F5EFE0',
    accent: '#D9A23A',
    illustration: 'projection',
    related: ['headspace', 'communication', 'narrative'],
    body: (
      <>
        <p>
          Almost every general statement a person makes is, to some degree, a
          self-portrait in disguise. Their feedback to others, the patterns they
          keep noticing, the flaws they find unbearable — the source is inside
          them, refracted onto whoever happens to be standing in front of them.
        </p>
        <p>
          Through this lens, listening changes. When someone says{' '}
          <em>people in this industry are all so insecure,</em> ask{' '}
          <em>what about me right now made that line feel important to say?</em>{' '}
          The same goes for praise: what someone admires reveals what they wish
          were more true of themselves.
        </p>
        <p>
          Weaknesses: not everything is projection — sometimes a sharp
          observation is just a sharp observation, and dismissing critique as
          &ldquo;they&rsquo;re just projecting&rdquo; is its own ugly move. But
          the part of the message that&rsquo;s about <em>them</em> is almost
          always the louder signal.
        </p>
      </>
    )
  },
  {
    id: 'second-order',
    category: 'Strategy',
    title: 'Second-order effects',
    tagline: 'The consequence of the consequence is usually bigger.',
    x: 18.75,
    y: 12,
    bg: '#2B5F6B',
    fg: '#F5EFE0',
    accent: '#F2C77A',
    illustration: 'second-order',
    related: ['incentives', 'systems', 'constraint'],
    body: (
      <>
        <p>
          Every action has a direct effect and a ripple of effects that follow
          from it. The direct effect is what you intended; the ripples are what
          actually shape the world. Price a thing lower, and usage goes up, and
          the people using it change, and the culture around it shifts, and the
          thing itself becomes something different — all of which happens after
          the decision is made and none of which shows up in the pitch deck.
          Most of history&rsquo;s biggest surprises, scandals, and own-goals are
          second-order effects that someone could have seen but didn&rsquo;t
          bother to.
        </p>
        <p>
          Through this lens, the honest question is rarely{' '}
          <em>does this solve the problem?</em> but{' '}
          <em>what does this produce downstream?</em> Rent control reduces rent,
          then reduces housing supply. A metric rewards a behavior, then
          corrupts it. A feature adds a capability, then reshapes how people use
          the whole product. The first-order answer is almost always the one
          people argue about; the second-order answer is almost always the one
          that matters.
        </p>
        <p>
          Weaknesses: taken too far, it becomes paralysis — every move has an
          infinite downstream, and you can always invent a scary second-order
          story for any change. It also favors the status quo by default,
          because the consequences of <em>not acting</em> are less legible than
          the consequences of acting. But people who only think in first-order
          effects build systems that solve the visible problem and create three
          invisible ones, over and over, for decades.
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
    bg: '#8E2A52',
    fg: '#F5EFE0',
    accent: '#F2C77A',
    illustration: 'status',
    related: ['mimetics', 'evo-psych', 'narrative'],
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
    id: 'systems',
    category: 'Causality',
    title: 'Systems',
    tagline: 'Outcomes emerge from loops.',
    x: 68.75,
    y: 88,
    bg: '#3D5034',
    fg: '#F5EFE0',
    accent: '#D9A23A',
    illustration: 'systems',
    related: ['incentives', 'primitives', 'probabilistic'],
    readings: [
      {
        label: 'Thinking in Systems — Donella Meadows',
        href: 'https://amzn.to/4w6VpPF'
      }
    ],
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
    id: 'taste',
    category: 'Aesthetic',
    title: 'Taste',
    tagline: 'A loss function you can apply.',
    x: 6.25,
    y: 88,
    bg: '#CFBC93',
    fg: '#2A1A12',
    accent: '#8E2A52',
    illustration: 'taste',
    related: ['expertise', 'minimalism', 'legibility'],
    body: (
      <>
        <p>
          Taste is a refined sense of what&rsquo;s meaningful and worth pursuing
          — a filter built from aesthetic, moral, and cultural values that helps
          you predict what will resonate. Useful for everything from movies and
          furniture to product decisions and who you spend time with.
        </p>
        <p>
          Through this lens, taste behaves like a loss function. Good taste is
          the combination of three things: <em>resonance</em> (others find your
          vector appealing — your friends like the books you recommend),{' '}
          <em>articulation</em> (you can clearly state what you&rsquo;re
          optimizing for and why), and <em>execution</em> (you can consistently
          make decisions that optimize for that vector in context). All three
          are trainable; most people are uneven across them.
        </p>
        <p>
          Weaknesses: taste decays into snobbery when articulation runs ahead of
          resonance, and it ossifies when execution stops being tested against
          the world. But undefended taste collapses into whatever is loudest in
          the room, which is almost always worse than your own honest filter.
        </p>
      </>
    )
  },
  {
    id: 'utility',
    category: 'Economics',
    title: 'Utility',
    tagline: 'Everyone is optimizing something.',
    x: 31.25,
    y: 88,
    bg: '#B84A26',
    fg: '#F5EFE0',
    accent: '#1B2754',
    illustration: 'utility',
    related: ['incentives', 'game-theory', 'minimalism'],
    body: (
      <>
        <p>
          Through this lens, every person behaves <em>exactly</em> according to
          a function — a private utility function — that they are quietly
          maximizing in every choice. Not approximately, not most of the time:
          the model assumes the function fully describes them, and the
          interesting question is what the function actually contains.
        </p>
        <p>
          And it contains far more than the utilitarian&rsquo;s ledger of pain
          and pleasure. People also pay for identity, status, belonging,
          coherence, dignity, the feeling of being right, the feeling of having
          chosen. Costs that look irrational on a spreadsheet — staying in a bad
          job for the title, picking the harder gym, refusing the cheap win —
          make sense the moment you allow the function to weigh those terms.
        </p>
        <p>
          Used this way, &ldquo;they&rsquo;re being irrational&rdquo; almost
          always rephrases as{' '}
          <em>their function has terms mine doesn&rsquo;t</em>. The middle
          manager isn&rsquo;t confused; she&rsquo;s pricing risk to her
          standing. The friend who&rsquo;d rather be right than agree
          isn&rsquo;t broken; identity is in the function. Once you can write
          down even a rough version of someone&rsquo;s utility function — yours
          included — strange behavior turns ordinary.
        </p>
        <p>
          Weaknesses: humans aren&rsquo;t fully coherent maximizers, and
          shoehorning every motive into a single scalar can flatten things that
          deserve their own dimension. But as a first cut on strange behavior,
          it cuts deep.
        </p>
      </>
    )
  }
]

/* ─────────────────────────────────────────────────────────
 * Layout: alphabetical by title, left-to-right, top-to-bottom,
 * skipping the middle 2×2 cells reserved for the center card.
 *
 * The canvas is an 8-col × 4-row grid (see GRID anchors). The
 * center card occupies columns 4–5 (0-indexed: 3–4) of rows
 * 2–3 (0-indexed: 1–2). Every other cell takes one lens, so
 * 32 − 4 = 28 surrounding slots — matches the deck size.
 * ───────────────────────────────────────────────────────── */
const CENTER_COLS = new Set([3, 4])
const CENTER_ROWS = new Set([1, 2])

const SLOTS: { x: number; y: number }[] = []
for (let r = 0; r < GRID.rowAnchors.length; r++) {
  for (let c = 0; c < GRID.colAnchors.length; c++) {
    if (CENTER_ROWS.has(r) && CENTER_COLS.has(c)) continue
    SLOTS.push({ x: GRID.colAnchors[c]!, y: GRID.rowAnchors[r]! })
  }
}

export const LENSES: Lens[] = LENSES_RAW.toSorted((a, b) =>
  a.title.localeCompare(b.title)
).map((lens, i) => {
  const slot = SLOTS[i]
  return slot ? { ...lens, x: slot.x, y: slot.y } : lens
})

export const LENS_BY_ID: Record<string, Lens> = Object.fromEntries(
  LENSES.map((l) => [l.id, l])
)
