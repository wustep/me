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
    quote-cite   optional  attribution for the quote (author / title)
    quote-cite-href optional  source URL — renders the attribution as a
                              link (use instead of a separate `reading`
                              line when the quote IS the recommended source)

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
related: self-fulfilling, narrative, constraint
reading: How to be more agentic — Cate Hall | https://usefulfictions.substack.com/p/how-to-be-more-agentic
quote: Between stimulus and response there is a space. In that space is our power to choose our response.
quote-cite: Viktor Frankl

Agency is seeing a future you want, noticing the moves actually available, and taking one — despite friction or constraint. The habit is treating yourself and your situation as things you can reshape, not facts you’re stuck with.

It starts with realizing you have more choices than the default script suggests. Agency is less a personality trait than a skill loop — _notice the options, weigh them, commit, execute, update_ — and like any skill, it grows with practice.

The questions worth asking: _what assumptions am I not examining? Which choices do I treat as off the table that should be on it?_ Usually choices get filed under “impossible” because they’d be awkward, difficult, or uncomfortable. Practically, this may mean realizing you can just name the elephant in the room, find another path to the same goal, or pick up work that isn’t your “role” because nobody else is doing it.

Some constraints are real, and some rules have reasons you don’t understand yet. Agency without humility wastes effort or harms people. Distinguish what you can change from what you need to work around.

# Attention

id: attention
category: Psychology
tagline: Spent constantly, chosen rarely.
bg: #24496A
fg: #F6EAD8
accent: #E6B64E
illustration: attention
related: osmosis, energy, headspace
quote: What information consumes is rather obvious: it consumes the attention of its recipients. Hence a wealth of information creates a poverty of attention.
quote-cite: Herbert Simon

Attention is finite, and you’re using it right now — on this sentence, the tab behind it, the worry underneath. William James defined experience as “what I agree to attend to,” but much of our attention is never consciously chosen. Feeds, notifications, and other people’s urgencies compete for the next glance. Without a deliberate choice, the most demanding thing wins.

This lens asks: _what am I choosing to notice, and what keeps interrupting that choice?_ It applies to people, too. Full attention — phone away, no checking the time — has gotten rare enough to feel like affection. Everyone can tell the difference between being looked at and being seen.

Many regrets begin as failures of attention before they become failures of effort. You spent the day reacting to what was urgent and barely noticed what mattered. The hours are gone, but the habit of noticing the wrong things remains.

Protecting attention too rigidly creates a different problem: you stop noticing anything unplanned. Curiosity, conversation, and wandering need time with no assigned purpose.

# Communication

id: communication
category: Social
tagline: Most problems are translation problems.
bg: #965431
fg: #F6EAD8
accent: #F0B85F
illustration: communication
related: headspace, narrative, interface
reading: Communication: A Simple Multi-Stage Model — LessWrong | https://www.lesswrong.com/posts/2GHxvfoRvNGZw4iFg/communication-a-simple-multi-stage-model
quote: The single biggest problem in communication is the illusion that it has taken place.
quote-cite: George Bernard Shaw

A surprising number of problems between two people are translation failures. Different vocabularies, unsaid assumptions, and stakes can turn a small misunderstanding into conflict or an outcome neither person wanted. “They’re wrong” and “they don’t care” often mean _we are not in the same conversation_.

An idea travels from the felt sense in your head into words, then gets rebuilt inside someone else’s. Every hop is lossy. Your version is rich with reasons you’ve never had to say; their version is whatever their experience can reconstruct from the words you chose. Telephone, played in earnest, by people who all think they’re being clear.

The trap is that both sides feel understood. You know what you meant, so your words seem transparent; they matched those words to something familiar, so the message feels received. Two people nod and walk away from different conversations. The fix is mechanical: say it back in your own words, ask for an example, check that the thing making sense to each of you is the same thing.

Sometimes, though, both people understand each other perfectly and want opposite things anyway. That’s a genuine conflict of interest, and an endless “let me explain better” can become translation theater — a way to keep dodging the harder conversation. Assume translation first; don’t assume it forever.

# Constraint

id: constraint
category: Design
tagline: The right limit creates expression.
bg: #2F333E
fg: #F6EAD8
accent: #E2AB3F
illustration: constraint
related: minimalism, interface, energy
quote: Art is limitation; the essence of every picture is the frame.
quote-cite: G.K. Chesterton

A blank page sounds like freedom until you have to put something on it. _Build anything_ can produce nothing for weeks; _build this in a week, using these three ideas_ gives your taste somewhere to push.

Sonnets, haiku, jazz standards: the wall creates the shape. A deadline nobody imposed can make finishing possible. One tool where you could have five can force you to learn the tool. A smaller budget can expose which part mattered.

The inverse matters too. When a problem won’t budge, find the constraint everyone quietly decided was fixed. Sometimes the door is locked. Sometimes nobody tried the handle.

Constraints also outlive their reasons. A rule written for last year’s crisis can run this year’s work long after everyone forgets why. Keep the walls that give the thing its shape. Push on the inherited ones.

# Dopamine

id: dopamine
category: Psychology
tagline: Wanting is the engine.
bg: #B1396C
fg: #F6EAD8
accent: #F2C4D4
illustration: dopamine
related: energy, incentives, attention
quote: From dopamine’s point of view, having things is uninteresting. It’s only getting things that matters. If you live under a bridge, dopamine makes you want a tent. If you live in a tent, dopamine makes you want a house. If you live in the most expensive mansion in the world, dopamine makes you want a castle on the moon. Dopamine has no standard for good, and seeks no finish line. The dopamine circuits in the brain can be stimulated only by the possibility of whatever is shiny and new, never mind how perfect things are at the moment. The dopamine motto is “More.”
quote-cite: Daniel Z. Lieberman & Michael E. Long, The Molecule of More
quote-cite-href: https://amzn.to/4283g1X

A feed keeps offering one more video. The possibility that the next one will be better can hold your attention long after the current one has stopped being enjoyable.

A useful oversimplification is that dopamine organizes wanting. It makes novelty, pursuit, and the possibility of reward feel worth acting on. Snacking, gambling, falling in love, starting another project — different objects, a familiar loop.

By the time you’re fighting an urge, much of the loop is already built. Shame adds another bad state without changing it. Change what’s within reach, what your environment rewards, and what the day looks like before the urge arrives.

The model is narrow. It can help you work with wanting; it can’t tell you what something means to you or absolve you of what you do inside the loop.

# Energy

id: energy
category: Psychology
tagline: Tired usually has a cause.
bg: #526D2B
fg: #F6EAD8
accent: #F0D04D
illustration: energy
related: headspace, interface, constraint

You can spend a whole day barely leaving the couch and still feel exhausted. Another day, you walk several miles and come home more awake. Energy doesn’t behave like a single battery.

_Tired_ can describe at least three systems: physical fatigue and fuel, sleep and circadian rhythm, and motivation or stimulation. A nap can help sleep pressure and do nothing for boredom. A walk can cost physical energy and restore mental energy. Dinner with friends can wake you up one night and drain you the next.

When energy is low, ask which system is speaking. Sometimes you need rest. Sometimes you need a warm-up: light, food, one small task, something worth anticipating. Going to bed on time is serious work. So is eating before the meeting and taking the walk after lunch.

The trap is turning every day into a tuning exercise. But without the distinction, you end up napping through boredom, drinking coffee through sleep debt, or calling a missed lunch laziness.

# Epistemic pragmatism

id: epistemic
category: Philosophy
tagline: Beliefs are maps for action.
bg: #60407A
fg: #F6EAD8
accent: #F0A86B
illustration: epistemic
related: legibility, systems, narrative
quote: All models are wrong, but some are useful.
quote-cite: George Box

The subway map gets the distances wrong, straightens every curve, and leaves out entire neighborhoods. It’s also the best tool ever made for not getting lost underground. Judge a belief the same way: by where it gets you, not only by how faithfully it draws the territory.

Two explanations can fit the same facts and point to different choices. When several remain plausible, compare what each helps you notice and what each would have you do next. You can hold one provisionally, keep track of the uncertainty, and trade it in when it stops matching reality.

Pragmatism turns dishonest when _useful_ starts to mean _comforting_. The map is allowed to simplify; it isn’t allowed to draw a bridge that isn’t there.

# Evolutionary psychology

id: evo-psych
category: Psychology
tagline: Old hardware, new world.
bg: #24704A
fg: #F6EAD8
accent: #BDE08E
illustration: evo-psych
related: status, incentives, mimetics
quote: The brain is a product of evolution, and just as animal brains serve to optimize the fitness of their owners, we should expect human brains to have been shaped by natural selection to think in ways that were adaptive in the ancestral environment.
quote-cite: Steven Pinker, How the Mind Works
quote-cite-href: https://amzn.to/4esTgqP

Human brains developed under conditions far different from modern life. Traits that helped people survive, reproduce, and cooperate did not disappear when the environment changed.

That mismatch offers hypotheses for why we care so much about status, form coalitions, gossip, and respond strongly to social approval. Dating apps and social feeds can amplify tendencies that once operated inside groups of a few dozen people.

Evolutionary explanations are easy to invent after the fact. A plausible story is not evidence, and culture, development, and individual experience may explain the same behavior better. Use the lens to generate questions rather than declare a behavior natural or inevitable.

# Expertise

id: expertise
category: Knowledge
tagline: Traits are skills in disguise.
bg: #2B3A67
fg: #F6EAD8
accent: #EDAC55
illustration: expertise
related: taste, legibility, osmosis

You expect to be bad at chess before you learn chess. We’re less generous about patience, conflict, taste, charisma, attention, or knowing when to stop. Struggling with one of those feels personal in a way losing your first chess game doesn’t.

These abilities have learning curves too. _I’m bad at conflict_ may mean _I’m early on that curve._ An impressive person becomes less of a wonder and more of a question: _which curve are they far along, and how did they get there?_

Not every quality is infinitely malleable. Temperament, talent, and circumstance matter. But _I’m early_ points toward practice, teachers, and feedback. _I’m not built for this_ points nowhere.

# Game theory

id: game-theory
category: Strategy
tagline: Make good behavior playable.
bg: #087482
fg: #F6EAD8
accent: #F0B85F
illustration: game-theory
related: incentives, utility, interface

A team says it values quality, then promotes whoever ships the most. The rulebook says one thing; the game says another. People learn the game.

Products, teams, classrooms, friendships — each has rules, rewards, and feedback. The good ones make the right behavior feel playable: the goal is visible, progress is legible, and the odds feel fair.

This shifts the question from _how do I make people behave?_ to _what game did I put them in?_ Good managers, teachers, and product designers spend less time giving heroic speeches and more time adjusting the payoff matrix.

Push this too far and intrinsic motivation gets crowded out. A team that only responds to points stops when the points stop. Still, if the same bad strategy keeps winning, another speech probably won’t fix it. Change the game.

# Headspace

id: headspace
category: Psychology
tagline: Behavior makes sense from the inside.
bg: #655DB0
fg: #F6EAD8
accent: #F0C66C
illustration: headspace
related: communication, narrative, energy
reading: Headspace | /headspace
quote: We cannot solve our problems with the same thinking we used when we created them.
quote-cite: Attributed to Albert Einstein

Imagine an infinitely dimensional space whose axes are personality traits, ideas, beliefs, emotions, and skills. You are a blob occupying some region of it. The blob shifts and reshapes as you learn, pay attention, and experience the world.

Experience also gives it edges. We call them personality, comfort zones, or identity: _I’m terrible at public speaking. I’m not creative. I could never get that job._ A description of the past hardens into a boundary on the future.

Growth asks for two things: a belief that you could inhabit a new part of the space, and an environment that helps you expand into it. Friends and teachers can pull you beyond a familiar edge. Books let you temporarily inhabit the headspace of someone who has already grown in a direction you want to go.

Empathy is another kind of reshaping. You loosen your own assumptions until someone else’s conclusion feels natural from inside the headspace that produced it. You don’t have to keep the shape. Each perspective you can inhabit gives your headspace another degree of freedom.

# Identity

id: identity
category: Philosophy
tagline: The self is a construct you can edit.
bg: #5146A6
fg: #F6EAD8
accent: #F07064
illustration: identity
related: agency, narrative, headspace
quote: Every action you take is a vote for the type of person you wish to become.
quote-cite: James Clear, Atomic Habits
quote-cite-href: https://amzn.to/4w6JdP7

_I’m trying to write_ asks for a decision every time. _I’m a writer_ has already made part of the decision for you. Identity turns repeated choices into expectations about what someone like you does.

Your identity includes your traits, values, affiliations, and limits. Its effects are real, but none of those descriptions are permanent facts. You can examine them, revise them, and notice when an old description no longer fits.

A looser identity makes new behavior easier. If being competent is essential to who you are, criticism can feel threatening; if competence is something you are developing, the same criticism becomes information.

Identity also helps people know what to expect from you and helps you remain consistent over time. Keep the parts that support your commitments. Reconsider the parts that only explain why you can’t change.

# Incentives

id: incentives
category: Strategy
tagline: Show me what gets rewarded.
bg: #E5C052
fg: #222226
accent: #C73B2D
illustration: incentives
related: utility, game-theory, probabilistic
reading: Is More Information Better? The Effects of “Report Cards” on Health Care Providers — NBER | https://www.nber.org/papers/w8697
quote: Show me the incentive and I’ll show you the outcome.
quote-cite: Charlie Munger, Poor Charlie’s Almanack
quote-cite-href: https://amzn.to/4fqMKBY

After New York and Pennsylvania began publishing cardiac-surgery report cards, providers became more selective and sicker patients were less likely to receive surgery. Public scores created a reason to avoid difficult cases even though improving care was the goal. People and organizations adapt to what gets rewarded — in money, attention, or social approval — even when the resulting behavior defeats the original goal.

“Why does this keep happening?” often resolves into _who benefits when it does?_ Bureaucracies grow because growing is rewarded. Newsrooms publish outrage because outrage gets clicks. Changing the outcome usually requires changing what gets rewarded.

Measures also determine what gets neglected. A team measured on tickets closed will close tickets. A team measured on customer satisfaction will spend more time hearing from customers. Work left out of the measure becomes easier to deprioritize without an explicit decision.

Incentives don’t explain every choice. People leave money on the table for status, identity, loyalty, or inertia. Treat incentives as a strong pressure rather than a complete theory of motivation.

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

You meant to journal this year. The notebook is in a drawer, under the chargers. Each extra step between intention and action makes the action less likely.

Good interfaces reduce unnecessary steps. Put the journal on the desk. Make the recurring task one tap away. Send the agenda before the meeting so people can think before they speak. If someone already wants to do something, make it easy to begin.

Friction can be useful too. Confirmation dialogs slow down destructive actions. Waiting periods create time to reconsider. The design question is where speed helps and where a pause improves the decision.

An interface can’t resolve conflicting goals, missing trust, or bad incentives. Once people agree on what they want, though, better defaults and fewer steps can help them follow through.

# Legibility

id: legibility
category: Knowledge
tagline: Name it to improve it.
bg: #246F9D
fg: #F6EAD8
accent: #F0C66C
illustration: legibility
related: communication, primitives, epistemic

A thing you can’t name, explain, or show is hard to improve. Writing, diagrams, dashboards, and frameworks make reasoning observable. A vague concern becomes a claim someone else can inspect. Quiet work becomes something another person can understand and support.

Articulation is part of the work. Written values give a team something specific to disagree about. A bug you can reproduce is already easier to fix. A dashboard changes which questions get asked before anyone makes a decision from it.

Legibility is also how others come to know your work. People can support a project when they understand what changed, why it changed, and what happened afterward. Documenting the work gives other people enough context to evaluate it and build on it.

Legibility can flatten what matters into what fits in a chart, and metrics get gamed the moment they start to count. The judgment is in choosing what to make legible — and what to leave as quiet execution.

# Memetics

id: mimetics
category: Social
tagline: Ideas compete to spread.
bg: #B1396C
fg: #F6EAD8
accent: #F0D04D
illustration: mimetics
related: narrative, osmosis, status

You hear a phrase once, then three more times that week, then catch yourself using it. Ideas reproduce by becoming easy to remember, repeat, and display.

What you encounter most has survived selection for transmissibility. Catchy beats correct; sticky beats subtle; shareable beats nuanced. Your information diet supplies much of the material that later feels like your own taste.

For any viral take, ask: _why is this winning now, and what does repeating it give the person spreading it?_ The answer may explain its reach before it says anything about whether the idea is right.

How far an idea travels marks it as fit, not true or false. Distrusting everything popular doesn’t free you from the crowd either. It lets the crowd choose your beliefs with the sign flipped.

# Minimalism

id: minimalism
category: Aesthetic
tagline: What is essential? Subtract the rest.
bg: #EAD9B5
fg: #222226
accent: #B83D31
illustration: minimalism
related: constraint, primitives, interface
quote: Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.
quote-cite: Antoine de Saint-Exupéry

Dieter Rams put it in three words: _“Weniger, aber besser”_ — less, but better. Minimalism is the discipline of finding the smallest thing that still does the job, then making that thing exceptional.

Every addition creates ongoing work. A feature adds code to maintain and another place to break. A possession needs space and care. A commitment keeps asking for time after the excitement of saying yes has passed.

The same discipline applies to a calendar, a room, a product, or a set of beliefs. Decide what has earned its place. Accumulation happens by default; subtraction takes deliberate choices.

Some complexity is irreducible, and over-pruned systems become brittle. Judge the result by how well the remainder works; sparseness alone proves nothing.

# Narrative

id: narrative
category: Social
tagline: Stories shape what feels possible.
bg: #8A356A
fg: #F6EAD8
accent: #F3C35F
illustration: narrative
related: mimetics, headspace, status
quote: The most powerful person in the world is the storyteller.
quote-cite: Steve Jobs

Two people can quit the same job. One tells the story as a brave leap; the other, as a reckless mistake. The facts match, but the frame changes which next step feels available.

Narratives turn facts into direction. They shape what feels possible, admirable, embarrassing, or inevitable. In a person, a company, or a movement, the story often shifts before the behavior does.

The throwaway sentence — _I’m bad at this_, _we don’t do that here_, _I’m not the kind of person who…_ — sets the ceiling for what comes next. Edit the narrative and behavior follows.

A strong story can carry a bad decision farther than the facts ever could. A useful narrative gives you direction while remaining answerable to reality. When the facts change, the story should change with them.

# Osmosis

id: osmosis
category: Social
tagline: Become what you repeatedly notice.
bg: #B8CE79
fg: #222226
accent: #24704A
illustration: osmosis
related: mimetics, attention, status
quote: You are the average of the five people you spend the most time with.
quote-cite: Jim Rohn

Spend enough time in a group and you start picking up its vocabulary, standards, and sense of what is normal. You notice what people praise, what they reject, and what they do without needing to discuss it.

Exposure can teach what advice cannot. “Have higher standards” is vague; watching someone revise a piece of work five times shows you what those standards require. Repeated contact gradually changes what you notice in your own work.

You absorb bad norms as readily as good ones. Pay attention to what becomes normal around the people, work, and media you encounter repeatedly.

# Primitives

id: primitives
category: Design
tagline: Find the simpler thing underneath.
bg: #3E65B6
fg: #F6EAD8
accent: #F0D04D
illustration: primitives
related: minimalism, systems, legibility
reading: The Pragmatic Programmer — Andrew Hunt & David Thomas | https://amzn.to/4odvous

When several problems keep arriving together, look for a shared cause. Missed deadlines, avoided conversations, and silence after a plan slips can all grow from the same fear of disappointing people. Fixing each incident leaves the shared cause unchanged.

A primitive is a smaller thing that produces several larger patterns. In a product, one permission model can replace five narrow features. In a person, one belief can keep recreating conflicts that look unrelated. Ask: _what smaller thing keeps generating this?_

Don’t force every mess into one elegant root cause. Test the candidate: change it and see whether several recurring problems improve. If they don’t, the explanation may be simpler than the reality.

# Probabilistic thinking

id: probabilistic
category: Reasoning
tagline: The world runs in distributions.
bg: #596B81
fg: #F6EAD8
accent: #E6B64E
illustration: probabilistic
related: epistemic, systems, second-order

The forecast says a 70% chance of rain. If the day stays dry, the forecast wasn’t necessarily wrong; one point landed somewhere inside the distribution.

Most uncertain things have a shape, a range, and a tail. Treating them as binary — will or won’t, safe or risky — creates expensive mistakes. _What will happen?_ gives way to _what’s the spread, and where’s my edge?_ Plans become ranges. Confidence becomes calibration. Updating is half the skill.

The lens also reorders which bets count as smart. A bet with an 80% chance of a small win and a 20% chance of ruin is worse than one with a modest edge and bounded losses. A good outcome doesn’t prove the bet was good; a bad outcome doesn’t prove it was bad.

Sometimes the answer is to commit hard to a small chance and help improve it. Most decisions still require planning for a range of outcomes rather than assuming the average case will happen.

# Projection

id: projection
category: Psychology
tagline: What people say about others is about themselves.
bg: #344557
fg: #F6EAD8
accent: #E2AB3F
illustration: projection
related: headspace, communication, narrative
quote: Everything that irritates us about others can lead us to an understanding of ourselves.
quote-cite: Carl Jung

People interpret others through their own history. The traits they notice first, the criticism they repeat, and the praise they give freely all reflect what they have learned to care about.

When someone says _people in this industry are all so insecure,_ ask why insecurity was the pattern they noticed and why it felt important to mention. The same applies to praise: what someone admires freely tells you what they value and what they’re reaching for — a compliment is a small self-portrait, too.

Projection doesn’t make an observation wrong. Feedback tells you something about your behavior and something about the person interpreting it. Consider both before deciding what to do with it.

# Second-order effects

id: second-order
category: Reasoning
tagline: The consequence of the consequence is usually bigger.
bg: #167384
fg: #F6EAD8
accent: #F3C35F
illustration: second-order
related: incentives, systems, probabilistic
quote: We can never do merely one thing. Any intrusion into nature has numerous effects, many of which are unpredictable.
quote-cite: Garrett Hardin

Every action has immediate effects and downstream effects. Lower a price and usage rises; new users change the culture; over time, the product may serve a different audience than before.

The honest question about a decision is _what does this set in motion?_ Automate a task and people may do more of it until the saved time fills back up. Add a feature and you change how people use the rest of the product. A decision keeps acting after its immediate goal is met.

Ask _and then what?_ three times in a row. The first answer is the goal. The second is plausible. The third is where the surprises live — and where much of the value or damage of a decision sits.

If you keep imagining further consequences, no decision will feel safe. This also favors the status quo because the costs of acting are easier to imagine than the costs of doing nothing. Consider the likely consequences two or three steps out, then decide.

# Self-fulfilling prophecy

id: self-fulfilling
category: Psychology
tagline: Belief bends reality.
bg: #2C6E63
fg: #F6EAD8
accent: #EEC15C
illustration: self-fulfilling
related: agency, narrative, identity
quote: Whether you think you can, or you think you can’t — you’re right.
quote-cite: Henry Ford

Believing you can do a thing changes how you approach it. Expect the interview to go badly and you show up guarded and tight. Expect to belong and you ask for the referral, prepare like it matters, and walk in calm enough to give yourself a chance. The forecast helps write the outcome it claims to foresee.

The same process can help or hurt. Confidence changes behavior in ways that can earn more confidence; certainty that you’re bad creates tension that can make you perform worse. Placebo and nocebo effects also show that expectations can affect experience. A lot of _I knew it_ is _I helped cause it_.

It can be worth leaning on belief past what the evidence supports because belief changes the odds by changing behavior. It can’t replace ability, preparation, luck, or time. Belief can increase the chance that you try; it cannot guarantee the result.

Aim the lens at other people carefully. You don’t know all of their constraints or circumstances, and _just believe harder_ recasts a real limit as weak will. The useful version increases agency without pretending thought controls the world.

# Status

id: status
category: Social
tagline: The invisible currency.
bg: #A63763
fg: #F6EAD8
accent: #F3C35F
illustration: status
related: mimetics, evo-psych, narrative
quote: The desire of the esteem of others is as real a want of nature as hunger.
quote-cite: John Adams, Discourses on Davila

Status is local. Someone takes a pay cut to join the hotter company. Someone else ends a friendship over who got thanked first in the acknowledgments. The practical stakes can be small while the position they imply feels enormous.

People trade money, comfort, and time for a half-step inside a group of forty. This is why a minor slight can hurt more than a larger material loss: it says something about where you stand among people whose opinion matters to you.

Opting out of one status game often means joining another. Someone indifferent to money or career may care deeply about standing in a craft, a scene, or a friend group that matters to exactly thirty people.

Love, curiosity, craft, and play aren’t disguised bids for rank. But when a reaction seems wildly disproportionate to the visible stakes, ask which group’s esteem is at stake.

# Systems

id: systems
category: Reasoning
tagline: Blame the loop, not the person.
bg: #4F7130
fg: #F6EAD8
accent: #E2AB3F
illustration: systems
related: incentives, primitives, probabilistic
quote: A system is more than the sum of its parts. It may exhibit adaptive, dynamic, goal-seeking, self-preserving, and sometimes evolutionary behavior.
quote-cite: Donella Meadows, Thinking in Systems
quote-cite-href: https://amzn.to/4w6VpPF

Outcomes are rarely caused by one thing. Repeated outcomes usually come from feedback loops, bottlenecks, delays, and the rules people are responding to.

When a team keeps missing deadlines, blaming the last person who acted explains little. Look at when decisions are made, where work waits, which goal takes priority, and what information arrives too late.

To change the system, look for a leverage point — a condition with disproportionate effects. An approval may arrive too late. A goal may be missing. A metric may reward the wrong behavior. Change one condition, then watch whether the recurring outcome changes with it.

A systems explanation can also excuse individual choices. People still make decisions and remain responsible for them. The lens is most useful when it helps prevent the same failure from happening again.

# Taste

id: taste
category: Aesthetic
tagline: A filter you can train.
bg: #D0B77E
fg: #222226
accent: #A63763
illustration: taste
related: expertise, minimalism, legibility

Taste is a refined sense of what’s worth pursuing — a filter that helps you predict what will land. It works on movies and furniture. It also works on product decisions, hires, and who you spend your time with.

Good taste has three parts. _Resonance_: what you point people toward lands — your friends like the books you recommend. _Articulation_: you can say what you’re optimizing for, and why. _Execution_: you can consistently make choices that hit that mark in context.

The three develop unevenly. You might know what people will like but struggle to explain why, describe the standard precisely but lack the craft to meet it, or execute consistently against a standard nobody else values. Knowing which part is weak tells you what to practice.

Taste can become narrow or driven by status. Preference is not proof of quality, and consensus is not proof either. Useful taste is specific enough to guide a decision and flexible enough to change when the context changes.

# Utility

id: utility
category: Strategy
tagline: Everyone is optimizing something.
bg: #A8482B
fg: #F6EAD8
accent: #F0B85F
illustration: utility
related: incentives, game-theory, status
reading: The Elephant in the Brain — Kevin Simler & Robin Hanson | https://amzn.to/4xlCwcH
quote: Man is not a rational animal; he is a rationalizing animal.
quote-cite: Robert Heinlein

When a choice looks irrational, assume for a minute that the person is optimizing something you haven’t priced. The interesting question becomes: _what belongs in their utility function?_

The function can contain pleasure and pain, but also identity, status, belonging, dignity, coherence, the feeling of being right, or the feeling of having chosen. Staying in a bad job or refusing an easy compromise may make sense once you include the terms the person is using.

Calling someone irrational ends the inquiry. Reconstructing the function gives you a hypothesis. The middle manager may value safety more than speed. The friend who won’t let an argument go may be protecting an identity, not the point being argued.

This model is easy to cheat: after any choice, invent another term that explains it. A useful utility function should help predict the next choice, not only explain the last one.
