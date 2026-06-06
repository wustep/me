<!--
  lenses.md — source of truth for the Lenses deck.

  Each lens is one section, opened by an H1 with its title. The lines
  immediately under the H1 are metadata (key: value), ending at the
  first blank line; everything after is the markdown body (paragraphs
  separated by blank lines, *emphasis* with single asterisks).

  Metadata keys:
    id           required  stable slug / URL key
    category     required  grouping label
    tagline      required  one-line hook (card + panel)
    bg, fg       required  card colors (hex)
    accent       optional  accent color (hex)
    illustration required  illustration id (see types.ts IllustrationId)
    related      optional  comma-separated lens ids
    reading      repeat    "Label | https://url"  (one line per reading)
    quote        optional  pull-quote text
    quote-cite   optional  attribution for the quote

  Card x/y positions are assigned automatically at runtime — don't set
  them here. After editing, run: pnpm lenses:sync
-->

# Agency

id: agency
category: Philosophy
tagline: Ceilings are self-imposed.
bg: #B83D31
fg: #F6EAD8
accent: #F3C35F
illustration: agency
related: momentum, narrative, incentives
reading: How to be more agentic — Cate Hall | https://usefulfictions.substack.com/p/how-to-be-more-agentic

Agency is the capacity to identify desirable futures, notice the actions actually available, and execute on them — despite uncertainty, friction, or external constraints. Being high in agency is consistently being able to reshape your internal self and external environments rather than treating these as fixed.

This often involves realizing there are more choices on the table than the default script suggests. Then, you evaluate those choices against your goals and the risks, pick one or more, and execute to completion. Agency is less a personality trait than a skill loop — _identify desired outcomes →_ _identify options → assess fit → commit → execute → update_ — and like any skill, it grows with practice.

Questions you may ask are: _what are the unexamined assumptions I’m making here? Which choices do I treat as off the table that should be on it?_ Usually choices are filed under “impossible” because they’d be awkward, difficult, or uncomfortable. Practically, this may mean realizing you can just call out and solve the elephant in the room, find alternative paths to solving a problem, or do things that aren’t considered your “role” because nobody else is doing them.

Lean on agency too hard and it turns into contempt for structural reality — some walls really are stone (see Chesterton’s fence), and pretending otherwise just exhausts you or runs over the people around you. High agency includes humility: map the constraints accurately, then spend your effort where you can actually move the system.

# Attention

id: attention
category: Psychology
tagline: You become what you keep looking at.
bg: #24496A
fg: #F6EAD8
accent: #E6B64E
illustration: attention
related: osmosis, energy, headspace

Attention is the most concentrated form of energy a person spends, and it’s spent constantly — on phones, conversations, worries, screens, faces, ideas. Whatever you keep looking at trains the rest of you: taste, reactions, sense of what counts as normal, sense of what’s even possible.

This lens asks you to ask yourself, _what is allowed to occupy my attention, and what isn’t?_ Or _how are others spending this currency and what outcomes does that produce?_

Most regrets, on inspection, trace back to attention more than effort. The wrong things were given the air, and the right ones starved for lack of it. You can recover lost hours.

The failure mode is tunnel vision. Life rewards a certain amount of wandering, and locking attention down too hard makes you efficient at the wrong thing.

# Communication

id: communication
category: Social
tagline: Most problems are translation problems.
bg: #965431
fg: #F6EAD8
accent: #F0B85F
illustration: communication
related: headspace, narrative, interface

Almost every problem between two people is, at root, a translation problem. Different vocabularies, different unsaid assumptions, different stakes — the gap widens until it surfaces as conflict, drift, or a bad outcome neither person wanted.

Held up against most disagreements, “they’re wrong” and “they don’t care” almost always rephrase as _we are not in the same conversation_. The fix is often a slower, more patient transfer of model, asking questions to bridge the gap.

Practically, this raises the price of vague language. The clearer you can communicate your internal models, and the clearer you can understand theirs, the faster you can reach the crux of your problem and resolve it.

Not every disagreement is a misunderstanding. Some are real conflicts of interest dressed in misunderstanding’s clothes, and assuming translation can be a way to avoid the harder fight. But assume translation first.

# Constraint

id: constraint
category: Design
tagline: The right limit creates expression.
bg: #2F333E
fg: #F6EAD8
accent: #E2AB3F
illustration: constraint
related: minimalism, interface, energy

Freedom is not the absence of structure. The right constraint creates expression, focus, improvisation, and agency. Sonnets, haiku, jazz standards — each of these formats give the author direction and freedom.

An overwhelming choice is often a missing constraint. The blank canvas paralyzes. “Build anything” yields nothing in particular except to those already with abundant creativity and agency; _build this in a week with these three ideas_ runs as a generative engine. Meanwhile, pressing on unexamined constraints helps you find the right solution too.

This lens helps you identify and choose constraints on purpose. Self-imposed deadlines, fixed budgets, a smaller toolkit than you can afford — these don’t always shrink you. They give your taste somewhere to push against. Most ambitious work happens inside walls that someone chose to build.

# Dopamine

id: dopamine
category: Psychology
tagline: Behavior is internal-state regulation.
bg: #B1396C
fg: #F6EAD8
accent: #F2C4D4
illustration: dopamine
related: energy, incentives, mimetics
reading: The Molecule of More — Daniel Z. Lieberman & Michael E. Long | https://amzn.to/4283g1X
quote: From dopamine’s point of view, having things is uninteresting. It’s only getting things that matters. If you live under a bridge, dopamine makes you want a tent. If you live in a tent, dopamine makes you want a house. If you live in the most expensive mansion in the world, dopamine makes you want a castle on the moon. Dopamine has no standard for good, and seeks no finish line. The dopamine circuits in the brain can be stimulated only by the possibility of whatever is shiny and new, never mind how perfect things are at the moment. The dopamine motto is “More.”

A lot of human behavior makes more sense as _internal-state regulation._ People are seeking novelty, reward, relief, control, connection, or a sense of meaning — and the brain’s dopamine system is orchestrating most of it underneath the conscious story.

Look at it this way and scrolling, snacking, gambling, refreshing email, picking fights, falling in love, doomscrolling, and starting a new project all start to resemble flavors of the same loop. The brain is seeking the dopamine it anticipates.

Shame doesn’t fix it. Shame is itself a state, and a costly one — it hides the loop without changing it. The real move is upstream: change what’s available to reach for, what the room rewards, what the day looks like before the urge arrives.

Reducing all behavior to neurotransmitters flattens meaning that really is there, and “your dopamine made you do it” can become a way to dodge responsibility. But understanding dopamine more deeply helps you explain some natural tendencies of yourself and others.

# Energy

id: energy
category: Psychology
tagline: Willpower runs on a battery — design around it.
bg: #526D2B
fg: #F6EAD8
accent: #F0D04D
illustration: energy
related: headspace, interface, constraint

Motivation isn’t purely moral. It’s biochemical, environmental, social, and narrative. Sleep, food, light, exercise, recent wins, who you saw yesterday all play a role. The right work-life balance doesn’t have your work energy competing with your life energy, but a life where you feel energized by both sides.

Apply the lens and “why am I being lazy?” or “why am I feeling tired?” may have an answer, and your energy throughout the day goes from feeling like a battery that runs out to a less constrained supply.

This changes what counts as serious work. Going to bed on time is serious work. Eating before the meeting is serious work. The walk after lunch isn’t a break from the project; it’s part of how the project gets done. Finding motivating work and organizing it in a way that helps you flow is also serious work. Designing around energy beats negotiating with it.

The trap is endless self-management — turning every day into a tuning exercise where the tuning itself burns the battery. But ignoring energy produces shame, and shame is an expensive fuel.

# Epistemic pragmatism

id: epistemic
category: Philosophy
tagline: Beliefs are maps for action.
bg: #60407A
fg: #F6EAD8
accent: #F0A86B
illustration: epistemic
related: legibility, systems, narrative

Beliefs are maps for action. The question is not only _is this true?_ but _what does believing this help me predict, build, notice, or become?_ A belief that pays out in better decisions earns its place.

Carry it around and you become less precious about being correct, more interested in being _useful-correct_. Two beliefs can be equally defensible; the one that gives you traction in the world is the one to keep on the workbench. The rest go in a drawer, not the trash — beliefs that are useless today are sometimes load-bearing tomorrow.

It also reframes disagreement. You stop trying to win at _true_ and start asking which model lets the other person do their next thing better. Sometimes that’s yours. Often it isn’t.

Pragmatism without honesty curdles into self-serving belief — you keep what flatters and discard what doesn’t, and call it traction. But truth without traction is theology, and most of us already have plenty of that.

# Evolutionary psychology

id: evo-psych
category: Psychology
tagline: Old hardware, new world.
bg: #24704A
fg: #F6EAD8
accent: #BDE08E
illustration: evo-psych
related: status, incentives, mimetics

Behavior is the residue of selection pressures from the ancestral environment. Why we crave sugar, fear snakes more than cars, gossip, form coalitions, find symmetry beautiful, and feel the sting of low status more sharply than the warmth of moderate gain. Your old hardware is running new software, badly.

Worn as a lens, modern life looks like a thin veneer over a Pleistocene chassis. Dating apps, social feeds, open-plan offices — all become legible as new arenas for very old games. The interface changed but the players didn’t.

It also explains the asymmetries. A bad day at work feels like exile from the tribe because, to some part of you, it still is. A stranger’s compliment online produces a real chemical reward because your brain can’t tell that the audience isn’t standing in front of you.

Just-so stories are easy to invent and hard to falsify, and the lens can flatter whatever you already believed about human nature. Used carefully, though, it explains the shape of our wants in a way nothing else does.

# Expertise

id: expertise
category: Knowledge
tagline: Every skill is a long, populated curve.
bg: #744133
fg: #F6EAD8
accent: #EDAC55
illustration: expertise
related: taste, legibility, primitives

Every skill is a long curve, and people sit all over it. Obvious for cooking or chess — but it’s also true for the things we don’t usually call skills: patience, listening, taste, charisma, attention, knowing when to stop. The world becomes much more legible the moment you treat these as _practiced abilities_ rather than fixed traits.

Used as a frame, “I’m not good at conflict” rephrases as _I’m on the early part of that curve._ The annoying coworker becomes someone with a different skill mix, not a different species. The genuinely impressive person stops being a wonder and becomes a question: _which curve are they very far along, and how did they get there?_

Treating every quality as a skill flattens temperament and circumstance, and some abilities are genuinely gated by talent.

# Game theory

id: game-theory
category: Strategy
tagline: Make good behavior playable.
bg: #087482
fg: #F6EAD8
accent: #F0B85F
illustration: game-theory
related: incentives, utility, interface

Life, products, and organizations get shaped by their rules, rewards, feedback loops, and affordances. The best of them make the right behavior _feel playable_ — clear objective, visible progress, fair odds, meaningful choice at every turn.

Take the frame and you stop asking _how do I make people behave?_ You start asking _what game am I putting them in?_ Bad games punish the right move and reward the easy one. Good games line up effort, skill, and reward so that doing the right thing is also the most engaging thing.

This is the real work of good managers, teachers, and product designers. They’re rarely heroic motivators. They’re game-makers — adjusting the payoff matrix until the move they want is also the move people want to make.

Not everything should be gamified, and over-designed games crowd out intrinsic motivation. A team that only moves for points stops moving when the points go away. But the best designers, coaches, and managers are thinking in payoffs and moves, all the way down.

# Headspace

id: headspace
category: Psychology
tagline: Enter the world-model first.
bg: #655DB0
fg: #F6EAD8
accent: #F0C66C
illustration: headspace
related: communication, narrative, energy
reading: Headspace | /headspace

Every person is operating from an internal world-model, an emotional state, an identity constraint, and a salience landscape that determines what they notice. To understand behavior, enter the headspace first.

Carry the lens into a confusing interaction and “why are they doing this?” becomes _what would a person have to believe, feel, and be afraid of_ for this to be the obvious move? Most disagreements aren’t about facts. They’re about which facts feel real, urgent, and self-relevant.

The skill is provisional empathy — building someone’s headspace well enough to predict their next sentence, without committing to live there. You don’t have to agree with the model. You do have to be able to run it.

The failure mode is collapsing into endless empathy at the expense of decision — understanding everyone so thoroughly that you can’t act against anyone. But ignoring headspace makes you efficient at solving the wrong problem.

# Identity

id: identity
category: Philosophy
tagline: The self is a construct you can edit.
bg: #5146A6
fg: #F6EAD8
accent: #F07064
illustration: identity
related: agency, narrative, headspace
reading: Atomic Habits — James Clear | https://amzn.to/4w6JdP7

Identity is a construct, not a fact. The story you tell about who you are — your nature, your limits, the kind of person you are and aren’t — is a pattern in your headspace, not a property of the universe. And like any pattern, it can be examined, loosened, and rewritten.

Held up to behavior, identity turns out to be a stronger engine than goals. _I’m the kind of person who…_ outperforms _I’m trying to…_ over almost any time horizon. Habits stick when they’re downstream of who you think you are, and fall apart when they’re not.

Loosening the grip on a fixed self — sometimes called ego death — opens up identity to ideas you previously couldn’t inhabit. It also makes you more resilient to challenge: fewer things land as attacks on who you are when “who you are” isn’t a thing you’re defending.

Too much detachment becomes drift, and identities do real coordinating work — they tell other people what to expect from you, and they tell you what to expect from yourself. But treating your identity as fixed is the fastest way to mistake your current configuration for your permanent one.

# Incentives

id: incentives
category: Strategy
tagline: Show me what gets rewarded.
bg: #E5C052
fg: #222226
accent: #C73B2D
illustration: incentives
related: utility, game-theory, probabilistic

Charlie Munger: _show me the incentive and I’ll show you the outcome._ People, organizations, and entire systems drift toward whatever they get paid — in money, attention, or social approval — to do. The drift is rarely visible while it’s happening.

Used as a frame, “why does this keep happening?” almost always resolves into _who benefits when it does?_ Bureaucracies grow because growing is rewarded. Newsrooms publish outrage because outrage gets clicks. The cure is rarely exhortation; the cure is rewiring the rewards.

It also predicts where the gaps will be. A team measured on tickets closed will close tickets. A team measured on customer love will hear from customers. Whatever you don’t put on the scoreboard gets cut, slowly and without anyone deciding to cut it.

Not every incentive is legible, and human behavior isn’t perfectly responsive to them — people leave money on the table all the time for status, identity, or simple inertia. But ignoring incentives is the surest way to be perpetually surprised.

# Interface

id: interface
category: Design
tagline: Everything has a UX.
bg: #176D86
fg: #F6EAD8
accent: #F0C66C
illustration: interface
related: legibility, minimalism, energy
reading: The Design of Everyday Things — Don Norman | https://amzn.to/4n7GyQV

Everything has a UX — tools, teams, calendars, meetings, habits, philosophies. Bad interfaces make good intentions expensive. They add friction in exactly the places that compound, and remove it where you wish there were more.

Read the world this way and a stuck team often doesn’t have a strategy problem; it has a meeting problem. A slipping habit doesn’t need more willpower; it needs to be one tap away. A confusing decision is often a missing form.

The corollary is that small surface changes do disproportionate work. Move the gym bag to the door. Move the Slack notification off the home screen. Move the agenda to before the meeting instead of during. Each one works on the surface the person meets every day. The person comes along.

Not every problem is interface. Some are values or incentives wearing a UX disguise, and re-skinning the meeting won’t fix a team that doesn’t agree on what it’s for. But the right surface change often unlocks behavior that exhortation could not.

# Legibility

id: legibility
category: Knowledge
tagline: Name it to improve it.
bg: #246F9D
fg: #F6EAD8
accent: #F0C66C
illustration: legibility
related: communication, primitives, epistemic

A thing that can’t be named, explained, or made visible is hard to improve. Writing, diagrams, dashboards, frameworks — these convert fog into handles. They turn a vague unease into a problem you can point at and your hard work into artifacts that can be cheered on.

Looked at this way, the act of articulation _is_ a key part of the work. The team that writes its values down lives them more clearly than the team that just “has them.” The bug you can reproduce is already half-fixed. The dashboard reshapes the decisions even when no one is looking at it.

Legibility is also how others come to know you. Reputation, credibility, and rewards accrue to what is _visible_ — people can only judge, trust, or champion what they can actually see. The unshowy excellent engineer and the loud mediocre one often trade places in the org’s memory because one shipped legibility and the other did not. Making your work, your reasoning, and your standards readable to others is how people back you and your ideas in the first place. Calling it self-promotion misses what’s actually being exchanged.

Legibility can flatten what matters into what fits in a chart, and metrics get gamed the moment they start to count. Figuring out what to make legible and where to just focus on pure execution helps you balance this out.

# Mimetics

id: mimetics
category: Social
tagline: Ideas compete to spread.
bg: #B1396C
fg: #F6EAD8
accent: #F0D04D
illustration: mimetics
related: narrative, osmosis, status

Ideas, beliefs, formats, and aesthetics compete to spread, the way organisms compete to reproduce. The ones you see most owe their visibility to transmissibility, not truth. Catchy beats correct; sticky beats subtle; shareable beats nuanced, almost every time.

Hold the lens up to a viral take and the question stops being _is this idea right?_ It becomes _why is this winning right now, and what does it offer the people carrying it?_ Most movements, fashions, and opinions are legible this way long before they make sense any other way.

It also clarifies your own taste. A surprising amount of what you _believe_ is what your information diet kept feeding you, slightly adapted. Notice the meme structure under an opinion and you can decide, separately, whether you still want to hold it.

Not every popular idea is empty, and not every obscure one is profound — sometimes the mainstream is right and the contrarian is simply lonely. But mistake virality for validity and you become a passenger in your own beliefs.

# Minimalism

id: minimalism
category: Aesthetic
tagline: What is essential? Subtract the rest.
bg: #EAD9B5
fg: #222226
accent: #B83D31
illustration: minimalism
related: constraint, primitives, interface

Dieter Rams put it in three words: _“Weniger, aber besser”_ — less, but better. Value comes from what remains after you remove the unnecessary. Not aesthetic austerity for its own sake, but a discipline of asking _what is the smallest thing that still does the job?_ — and then making that thing exceptional.

Carry the discipline and complexity reveals itself as a tax. Every feature, possession, obligation, abstraction, and relationship has a hidden cost — cognitive, maintenance, emotional, financial. The cost is rarely visible at the moment of acquisition; it shows up later, as friction, clutter, and the slow erosion of attention. Subtraction is creative work, and often the harder half of it.

The lens applies as much to a life as to a product. What you make, but also what you own, what you commit to, who you say yes to, what you let onto your calendar, what you allow into your head. A clean surface is downstream of a hundred small refusals. The minimalist’s remaining things — projects, possessions, people, beliefs — have all earned their place. Default accumulation runs the other direction automatically; staying lean takes intent.

The world is genuinely complicated, and over-pruned systems are brittle. Aestheticized minimalism can curdle into performance — empty rooms, empty calendars, empty work, where the subtraction becomes the point instead of the means. But as a counterweight to default accumulation, the lens is nearly always corrective: less, but better, applied to almost anything.

# Momentum

id: momentum
category: Strategy
tagline: Consistency is the currency that buys bold moves.
bg: #227449
fg: #F6EAD8
accent: #F0A86B
illustration: momentum
related: agency, systems, taste

Most people think about effort as a single push: how hard, in what direction, right now. Momentum says that what you can do today depends on what you’ve been doing. Effort compounds into mass — trust, reputation, shipping cadence, a team that expects to win. That mass is what makes the hard moves possible later. The unpopular call, the risky bet, the honest conversation — each one lands more easily when you’ve built the credibility to spend.

Apply the frame and the question is rarely _should I do this now?_ It’s _am I building the momentum I’ll need, and spending it on the right things?_ Early wins compound into permission. Consistency compounds into the room. Both look like overhead until you need them.

You also rarely stop momentum head-on. You nudge its vector. A small push on something already moving beats a big push against something that’s going to win regardless. Most strategic wins, in a career or in a company, look like that — a small redirect, applied early, while the mass was still moving.

The lens romanticizes motion and underrates the deliberate halt — sometimes the highest-value move is stopping a thing that shouldn’t continue, and _we have momentum here_ is how bad projects survive. It also flatters incumbents, who confuse inherited mass with earned mass. But ignoring momentum is how smart people keep making technically-correct moves that don’t land, because they never built the standing to make them work.

# Narrative

id: narrative
category: Social
tagline: Stories shape what feels possible.
bg: #8A356A
fg: #F6EAD8
accent: #F3C35F
illustration: narrative
related: mimetics, headspace, status

Humans don’t just optimize; they story-tell. A good frame can change what people perceive as possible, admirable, embarrassing, or inevitable — without changing a single underlying fact. The story does the work the data never could.

Read movements, companies, and personal change through this and the narrative becomes the leading indicator, not the trailing one. The same career pivot is a “brave leap” or a “reckless mistake” depending entirely on the surrounding tale. The shift in framing precedes the shift in behavior, every time.

Practically, this raises the price of the words you use about yourself. The throwaway sentence — _I’m bad at this_, _we don’t do that here_, _I’m not the kind of person who…_ — sets the ceiling for what comes next. Edit the narrative and behavior follows.

Stories can outrun reality, and good narratives have buried bad decisions for as long as there have been stories to tell. But operating without one is its own kind of story — usually a thinner one, and rarely the one you’d have chosen.

# Osmosis

id: osmosis
category: Social
tagline: Become what you repeatedly notice.
bg: #B8CE79
fg: #222226
accent: #24704A
illustration: osmosis
related: mimetics, headspace, status

People absorb culture, standards, vocabulary, and taste from their environment. Most growth happens through proximity, not effort — steady exposure to better defaults, day after day, until what used to seem impressive feels normal and what used to feel normal feels embarrassing.

Looked at this way, who you spend time with, what you read, where you work, and what you stare at on a phone screen are all training data. The slow upgrade compounds. You start producing the kind of work, holding the kind of opinions, having the kind of instincts of the people you keep around you.

It also explains a frustrating thing about advice. Telling someone to “have higher standards” rarely works — standards aren’t moved by exhortation, they’re moved by exposure. The fastest way to raise yours is to spend a month around people whose floor is your ceiling.

Osmosis runs in both directions and absorbs the mediocre as readily as the great. A bad room is contagious in exactly the way a good one is. The lens warns as much as it encourages: choose the room.

# Primitives

id: primitives
category: Design
tagline: Find the simpler thing underneath.
bg: #3E65B6
fg: #F6EAD8
accent: #F0D04D
illustration: primitives
related: minimalism, systems, legibility

Composable units live beneath complex systems. Many things that look different are the same underlying thing wearing different clothes. Identify and solve the primitive problem and you solve the more complex problems for free.

Used as a frame, ten features collapse into three building blocks. Five competing tools collapse into one missing abstraction. A tangle of edge cases collapses into one rule generating them. The work is noticing: _what is actually moving here, beneath all the surface variety?_

It changes what good design looks like. The impressive system has fewer knobs than expected, and the knobs it has all derive from a smaller, cleaner core. Most things — in software, in writing, in organizations — get better the moment someone finds the primitive the surface was hiding.

Chasing primitives can become procrastination dressed as architecture, and reality sometimes refuses to factor cleanly — some domains are genuinely messy underneath. But almost every elegant system is one good primitive away from being simpler.

# Probabilistic thinking

id: probabilistic
category: Reasoning
tagline: The world runs in distributions.
bg: #596B81
fg: #F6EAD8
accent: #E6B64E
illustration: probabilistic
related: epistemic, systems, incentives

The world doesn’t deliver outcomes; it delivers _distributions_ of outcomes. Most events aren’t certain or impossible — they’re a shape, a range, a tail. Treating uncertain things as binary (will/won’t, true/false, safe/risky) is the most common and most expensive cognitive error.

Apply the lens and _what will happen?_ gives way to _what’s the spread, and where’s my edge?_ Plans become ranges. Confidence becomes calibration. A 70% chance lives in the world as a posture — lean toward action, stay ready to be wrong, update as evidence arrives. Updating is half the skill.

It also reorders which bets count as smart. A move that wins 80% of the time and loses everything the other 20% is worse than one that wins 55% with bounded losses. People who only see outcomes call the first one bold and the second one timid. People who see distributions call them what they are and focus on expected value.

Not every situation rewards probability over conviction — sometimes the move is to commit hard to a thin chance and self-fulfill it. But anyone who mistakes the average for the outcome will be mugged by variance eventually.

# Projection

id: projection
category: Psychology
tagline: What people say about others is also about themselves.
bg: #344557
fg: #F6EAD8
accent: #E2AB3F
illustration: projection
related: headspace, communication, narrative

Almost every general statement a person makes is, to some degree, a self-portrait in disguise. Their feedback to others, the patterns they keep noticing, the flaws they find unbearable — the source is inside them, refracted onto whoever happens to be standing in front of them.

Once you can see it, listening changes. When someone says _people in this industry are all so insecure,_ the useful question is _what about me, right now, made that line feel important to say?_ The same goes for praise: what someone admires reveals what they wish were more true of themselves.

It changes how you take criticism too. The cruelest readings of you usually tell you more about the reader than about you. Not always — but often enough that you should ask before flinching.

Not everything is projection. Sometimes a sharp observation is a sharp observation, and dismissing critique as “they’re just projecting” is its own ugly move. But the part of the message that’s about _them_ is almost always the louder signal.

# Second-order effects

id: second-order
category: Reasoning
tagline: The consequence of the consequence is usually bigger.
bg: #167384
fg: #F6EAD8
accent: #F3C35F
illustration: second-order
related: incentives, systems, constraint

Every action has a direct effect and a ripple of effects that follow from it. The direct effect is what you intended; the ripples are what actually shape the world. Price a thing lower, and usage goes up, and the people using it change, and the culture around it shifts, and the thing itself becomes something different — none of which shows up in the pitch deck. Most of history’s biggest surprises, scandals, and own-goals are second-order effects that someone could have seen but didn’t bother to.

Held up to a decision, the honest question is rarely _does this solve the problem?_ It’s _what does this produce downstream?_ Rent control reduces rent, then reduces housing supply. A metric rewards a behavior, then corrupts it. A feature adds a capability, then reshapes how people use the whole product. The first-order answer is almost always the one people argue about; the second-order answer is almost always the one that matters.

The skill is forcing yourself to ask _and then what?_ three times in a row. The first answer is usually the goal. The second is usually plausible. The third is where the surprises live — and where most of the value, or most of the damage, of a decision actually sits.

Taken too far, it becomes paralysis. Every move has an infinite downstream, and you can always invent a scary second-order story for any change. The lens also favors the status quo, because the consequences of _not acting_ are less legible than the consequences of acting. But people who think only in first-order effects build systems that solve the visible problem and create three invisible ones, over and over, for decades.

# Status

id: status
category: Social
tagline: The invisible currency.
bg: #A63763
fg: #F6EAD8
accent: #F3C35F
illustration: status
related: mimetics, evo-psych, narrative

A surprising amount of human behavior is about status — relative standing within the groups we care about. Not money, not power directly, but where you sit in the local pecking order, and the movement of that position over time. The local part is the trick. People will burn months of comfort for a half-step inside a group of forty.

Read behavior this way and you notice why people pick the cars they pick, why office layouts matter, why a small slight outrages and a large compliment soothes. Why whole industries — luxury, fashion, academia, much of social media — exist mostly to allocate position.

It also explains the silent ones. People who appear modest about money or career often have a status game running somewhere else: a scene, a craft, a friend group, a way of dressing that signals to the right thirty people. Everyone’s playing. The interesting question is on which board.

Not everything is status. Love, curiosity, craft, and play are real and irreducible, and reducing them all to position-jockeying is its own kind of poverty. But ignore status entirely and you’ll be confused by half of what people do.

# Systems

id: systems
category: Reasoning
tagline: Outcomes emerge from loops.
bg: #4F7130
fg: #F6EAD8
accent: #E2AB3F
illustration: systems
related: incentives, primitives, probabilistic
reading: Thinking in Systems — Donella Meadows | https://amzn.to/4w6VpPF

Outcomes are rarely caused by one thing. They emerge from feedback loops, bottlenecks, delays, constraints, and second-order effects. The visible event is the tip; the system is everything underneath producing it, again and again.

Used as a lens, blame becomes less interesting than _structure_ . Why does this team keep missing deadlines? Why do diets fail? Why does the same kind of meeting keep getting scheduled? Look at the loop, the lag, the limit — not the last person who acted.

The most useful move is finding leverage points: the one valve that, turned slightly, changes everything downstream. They’re rarely the obvious ones. The biggest lever is often a delay no one notices, a goal no one wrote down, or a feedback signal that arrives too late to matter.

The lens can become an excuse — “the system did it” — and absolve individuals who genuinely chose badly. But used well, it shows you the few places where small effort produces outsized change.

# Taste

id: taste
category: Aesthetic
tagline: A filter you can train.
bg: #D0B77E
fg: #222226
accent: #A63763
illustration: taste
related: expertise, minimalism, legibility

Taste is a refined sense of what’s meaningful and worth pursuing — a filter built from aesthetic, moral, and cultural values that helps you predict what will resonate. Useful for movies, food, and furniture. Also for product decisions, hires, and who you spend time with.

Looked at as a function, good taste has three components: _resonance_ (others find your vector appealing — your friends like the books you recommend), _articulation_ (you can state what you’re optimizing for and why), and _execution_ (you can consistently make decisions that optimize for that vector in context). All three are trainable; most people are uneven across them.

Resonance without articulation is intuition you can’t share. Articulation without execution is a manifesto with nothing behind it. Execution without resonance is a closed loop — you make what you want, and no one else cares. Each one demands a different kind of work.

# Utility

id: utility
category: Strategy
tagline: Everyone is optimizing something.
bg: #A8482B
fg: #F6EAD8
accent: #F0B85F
illustration: utility
related: incentives, game-theory, minimalism

Every person behaves _exactly_ according to a personal utility function that they’re maximizing in every choice. Not approximately, not most of the time, exactly. The model assumes the function fully describes them, and the interesting question is what the function actually contains.

Utility can contain far more than the utilitarian’s ledger of pain and pleasure. People also pay for identity, status, belonging, coherence, dignity, the feeling of being right, the feeling of having chosen. Costs that look irrational on a spreadsheet — staying in a bad job, picking the absurdly expensive gym, refusing the cheap win — make sense the moment you allow the utility function to weigh those terms.

Used this way, “they’re being irrational” almost always rephrases as _their utility function has terms mine doesn’t_. The middle manager is pricing risk to her standing, not failing to think clearly. The friend who’d rather be right than agree and move on has their personal identity in the utility function, and the utility function is doing its job. Once you can quantify even a rough version of someone’s utility function's dominant weights — yours included — strange behavior turns ordinary.

Humans aren’t fully coherent maximizers, and shoehorning every motive into a single scalar can flatten things that deserve their own dimension. Utility functions also drift over time and under stress, and assuming stability when it doesn’t hold is a common error. But as a first attempt in understanding and predicting behavior, it often is accurate.
