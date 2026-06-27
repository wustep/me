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

Agency is seeing a future you want, noticing the moves actually on the table, and taking one — despite friction or constraint. The habit is treating yourself and your situation as things you can reshape, not facts you’re stuck with.

It starts with realizing there are more choices on the table than the default script suggests. Agency is less a personality trait than a skill loop — _notice the options, weigh them, commit, execute, update_ — and like any skill, it grows with practice.

The questions worth asking: _what assumptions am I not examining? Which choices do I treat as off the table that should be on it?_ Usually choices get filed under “impossible” because they’d be awkward, difficult, or uncomfortable. Practically, this may mean realizing you can just name the elephant in the room, find another path to the same goal, or pick up work that isn’t your “role” because nobody else is doing it.

Some walls are stone. Some fences are there for reasons you haven’t learned yet. Agency without humility burns energy on the immovable — or runs over people who were part of the system too. Map the constraint honestly, then push where something might give.

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

Attention is the scarcest thing you have, and it’s being spent right now — on this sentence, the tab behind it, the worry underneath. William James defined experience as “what I agree to attend to,” but most attention is never agreed to. Feeds, notifications, and other people’s urgencies take it, each engineered to win the next glance — so by default, the allocation goes to whoever bids loudest, not to what you’d endorse on reflection.

This lens asks: _what is allowed to occupy my attention, and what gets in uninvited?_ It applies to people, too. Full attention — phone away, clock stopped — has gotten rare enough to read as love. Everyone can tell the difference between being looked at and being seen.

Most regrets, on inspection, trace back to attention more than effort. You gave the wrong things the air and starved the right ones. Lost hours you can recover; what the looking trained you into is harder to undo.

The failure mode is tunnel vision — guarding the spotlight so tightly that nothing unplanned ever wanders in. Life rewards a certain amount of drift, and some of the best things in yours arrived through attention you never meant to pay.

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

A surprising number of problems between two people are translation failures. Different vocabularies, different unsaid assumptions, different stakes — the gap widens until it surfaces as conflict, drift, or an outcome neither person wanted. “They’re wrong” and “they don’t care” often mean _we are not in the same conversation_.

It helps to see how far an idea has to travel: from the felt sense in your head into words, from your words into their head, and often onward — their retelling, a third person’s reading of it, and beyond. Every hop is lossy. The version in your head is rich with reasons you’ve never had to say out loud; the version in words keeps only what you managed to articulate; the version in their head is whatever their own experience could rebuild from those words. Telephone, played in earnest, by people who all think they’re being clear.

The trap is that both sides feel understood. You know what you meant, so your words seem transparent; they’ve matched your words to something they already know, so the message feels received. Two people nod and walk away from different conversations. The fix is mechanical: say it back in your own words, ask for an example, check that the thing making sense to each of you is the same thing.

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

By the time you’re fighting an urge, much of the loop is already built. Shame adds another bad state without changing it. Change what’s within reach, what the room rewards, and what the day looks like before the urge arrives.

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

A belief is a model you run. Accuracy matters, but so does what the model helps you predict, build, notice, or become. A belief that produces better decisions is worth keeping around.

This makes being right feel less precious. Two models can fit the available facts; keep the one that gives you traction, and put the other in a drawer instead of the trash. A model that’s useless today may be load-bearing tomorrow.

Disagreement changes too. You can stop trying to win at _true_ long enough to ask which model helps the other person take their next step. Sometimes it’s yours. Often it isn’t.

Pragmatism without honesty turns into self-flattery: keep what feels good, discard what doesn’t, call it useful. The model still has to answer to reality. It should also help you do something once it gets there.

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

Behavior is the residue of selection pressures from the ancestral environment. Why we crave sugar, fear snakes more than cars, gossip, form coalitions, find symmetry beautiful, and feel the sting of low status more sharply than the warmth of moderate gain. Your old hardware is running new software, badly.

Modern life is a thin veneer over a hunter-gatherer chassis. Dating apps, social feeds, open-plan offices: new arenas for ancient games. The interface changed but the players didn’t.

It explains the asymmetries, too. A bad day at work feels like exile from the tribe because, to some part of you, it still is. A stranger’s compliment online lands as a real chemical reward, because your brain can’t tell the audience isn’t in the room.

Just-so stories are easy to invent and hard to falsify, and the lens can flatter whatever you already believed about human nature. Used carefully, though, it explains the shape of our wants in a way nothing else does.

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

_I’m trying to write_ asks for a decision every time. _I’m a writer_ has already made part of the decision for you. Identity is a stronger engine than goals because habits stick when they sit downstream of who you think you are.

That self is a story — your nature, your limits, the kind of person you are and aren’t. The story is real in its effects, but it isn’t a property of the universe. You can examine it, loosen it, and sometimes rewrite it.

Loosening the grip on a fixed self — sometimes called ego death — opens up identity to ideas you previously couldn’t inhabit. It also makes you harder to wound: fewer things land as attacks on who you are when “who you are” isn’t something you’re defending.

Detach too far and you drift; identities do real coordinating work, telling other people what to expect from you and telling you what to expect from yourself. Still, treating yours as fixed is the fastest way to mistake your current configuration for your permanent one.

# Incentives

id: incentives
category: Strategy
tagline: Show me what gets rewarded.
bg: #E5C052
fg: #222226
accent: #C73B2D
illustration: incentives
related: utility, game-theory, probabilistic
quote: Show me the incentive and I’ll show you the outcome.
quote-cite: Charlie Munger, Poor Charlie’s Almanack
quote-cite-href: https://amzn.to/4fqMKBY

The year surgeon report cards went public, the sickest patients started having trouble finding a surgeon. Nobody chose that; the scoreboard did. People, organizations, and entire systems drift toward whatever they get paid — in money, attention, or social approval — to do, and the drift is rarely visible while it’s happening.

“Why does this keep happening?” almost always resolves into _who benefits when it does?_ Bureaucracies grow because growing is rewarded. Newsrooms publish outrage because outrage gets clicks. The cure is rarely a speech; it’s rewiring the rewards.

The gaps are predictable, too. A team measured on tickets closed will close tickets. A team measured on customer love will hear from customers. Whatever you leave off the scoreboard gets cut, slowly, without anyone deciding to cut it.

Incentives aren’t the whole story. Not all of them are legible, and people leave money on the table constantly for status, identity, or plain inertia. Ignore them anyway and you’ll be surprised for the rest of your life.

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

You meant to journal this year. The notebook is in a drawer, under the chargers. That’s the whole story. Everything has a UX — tools, teams, calendars, meetings, habits, philosophies — and bad interfaces make good intentions expensive. They add friction in exactly the places that compound, and remove it where you wish there were more.

A stuck team often doesn’t have a strategy problem; it has a meeting problem. A slipping habit doesn’t need more willpower; it needs to be one tap away. A confusing decision is often a missing form.

The corollary is that small surface changes do disproportionate work. Move the gym bag to the door. Move the Slack notification off the home screen. Move the agenda to before the meeting instead of during. Each one reworks the surface the person meets every day, and the person comes along.

Some problems only look like interface. Values and incentives wear UX disguises, and re-skinning the meeting won’t fix a team that doesn’t agree on what it’s for. But more often than you’d expect, the right surface change gets the behavior that asking nicely couldn’t.

# Legibility

id: legibility
category: Knowledge
tagline: Name it to improve it.
bg: #246F9D
fg: #F6EAD8
accent: #F0C66C
illustration: legibility
related: communication, primitives, epistemic

A thing you can’t name, explain, or show is hard to improve. Writing, diagrams, dashboards, frameworks — these turn fog into handles. A vague unease becomes a problem you can point at. Quiet work becomes something another person can understand and back.

Articulation is part of the work. Written values give a team something specific to disagree about. A bug you can reproduce is already easier to fix. A dashboard changes which questions get asked before anyone makes a decision from it.

Legibility is also how others come to know you. People can only judge, trust, or champion what they can see — so the unshowy excellent engineer and the loud mediocre one keep trading places in the org’s memory, because one shipped legibility and the other didn’t. Making your work and your reasoning readable is how people come to back you. Calling it self-promotion misses what’s being exchanged.

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

Every addition arrives alone. Its maintenance bill comes later. A feature adds code to maintain and another place to break. A possession needs space and care. A commitment keeps asking for time after the excitement of saying yes has passed.

The same discipline applies to a calendar, a room, a product, or a set of beliefs. Decide what has earned its place. A clean surface sits downstream of a hundred small refusals; accumulation needs no help.

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

People absorb culture, standards, vocabulary, and taste from their environment. Most growth happens through proximity, not effort — steady exposure to better defaults, day after day, until what used to seem impressive feels normal and what used to feel normal feels embarrassing.

Who you spend time with, what you read, where you work, what you stare at on a screen: all of it is training data. The upgrade is slow and compounding. You end up producing the work, holding the opinions, and carrying the instincts of the people you keep around you.

This is why advice so often fails. “Have higher standards” rarely works, because standards come from exposure rather than exhortation. The fastest way to raise yours is a month around people whose floor is your ceiling.

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
reading: The Pragmatic Programmer — Andrew Hunt & David Thomas | https://amzn.to/4odvous

When several problems keep arriving together, they may be one problem wearing different clothes. Missed deadlines, avoided conversations, and silence after a plan slips can all grow from the same fear of disappointing people. Fixing each incident leaves the generator intact.

A primitive is a smaller thing that produces several larger patterns. In a product, one permission model can replace five narrow features. In a person, one belief can keep recreating conflicts that look unrelated. Ask: _what smaller thing keeps generating this?_

Don’t force every mess into one elegant root cause. Test the candidate: change it and see whether several things above it change too. Otherwise, it’s a satisfying explanation rather than the thing underneath.

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

Which bets count as smart gets reordered, too. A bet that wins 80% of the time and loses everything the other 20% is worse than one that wins 55% with bounded losses. Outcome-watchers call the first bold and the second timid; people who see distributions call them what they are and price the expected value.

Conviction beats probability sometimes — now and then the answer is to commit hard to a thin chance and self-fulfill it. The rest of the time, mistake the average for the outcome and variance will mug you.

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

Almost every general statement a person makes is, to some degree, a self-portrait in disguise. Their feedback to others, the patterns they keep noticing, the flaws they find unbearable — the source is inside them, refracted onto whoever happens to be standing in front of them.

Once you can see it, listening changes. When someone says _people in this industry are all so insecure,_ the useful question is _what, in them, made that line feel important to say right now?_ The same goes for praise: what someone admires reveals what they wish were more true of themselves.

Criticism reads differently too. The cruelest take on you usually says more about the reader than about you — not always, but often enough that it’s worth asking before you flinch.

Of course, sometimes a sharp observation is accurate, and “they’re only projecting” is its own ugly dodge. Even so, the part of any message that’s secretly about _them_ is usually the louder signal.

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

Every action has a direct effect and a ripple of effects behind it. The direct effect is what you intended; the ripples are what shape the world. Price a thing lower and usage goes up, and the people using it change, and the culture around it shifts, until the thing itself becomes something else — none of which showed up in the pitch deck. Most of history’s biggest surprises and own-goals were second-order effects someone could have seen and didn’t.

So the honest question about a decision is rarely _does this solve the problem?_ It’s _what does this set in motion?_ Rent control reduces rent, then reduces housing supply. A feature adds a capability, then reshapes how people use the whole product. The first-order answer is what people argue about; the second-order answer is what they live with.

The skill is forcing yourself to ask _and then what?_ three times in a row. The first answer is usually the goal. The second is usually plausible. The third is where the surprises live — and where most of the value, or most of the damage, of a decision actually sits.

Taken too far, it becomes paralysis. Every decision has an infinite downstream, and you can always invent a scary second-order story for any change. The lens also favors the status quo, because the consequences of _not acting_ are less legible than the consequences of acting. But people who think only in first-order effects build systems that solve the visible problem and create three invisible ones, over and over, for decades.

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

Believing you can do a thing is a prerequisite to doing it. The belief is half the cause: expect the interview to go badly and you show up guarded and tight, and it does; expect to belong in the room and you ask for the referral, prep like it matters, and walk in calm enough to become the person you predicted. The forecast helps write the outcome it claims to foresee.

The loop runs both ways. Confidence compounds into the behavior that earns it; the certainty that you’re bad at this becomes the tension that makes you bad at it. Placebo and nocebo are the same machine pointed in two directions. A lot of _I knew it_ is _I caused it_.

So it’s often worth deluding yourself a little — leaning on a belief past what the odds justify — because the belief changes the odds. Only so far, though: your brain and body bend toward your true expectations within the limits of real ability, and no further. Aim past that and you get the torn tendon three weeks into the marathon you swore you could run untrained. Belief buys the attempt, not the result.

Aim it at other people carefully, if at all. You can’t see their wiring or what they’re carrying, and _just believe harder_ curdles into cruelty when it recasts a real constraint as weak will — the way a parent reads an undiagnosed condition as a discipline problem. Held too tightly on yourself, it’s magical thinking; you don’t run the world, and some days you’re unlucky. You’ll always be at the mercy of the world. The trick is to stop being at the mercy of your thoughts.

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

Outcomes are rarely caused by one thing. They emerge from feedback loops, bottlenecks, and delays — and from the second-order effects those produce. The visible event is the tip; the system is everything underneath producing it, again and again.

Blame gets less interesting than _structure_. Why does this team keep missing deadlines? Why do diets fail? Why does the same kind of meeting keep getting scheduled? Look at the loop, the lag, the limit — not the last person who acted.

The most useful step is finding leverage points: the one valve that, turned slightly, changes everything downstream. They’re rarely the obvious ones. The biggest lever is often a delay no one notices, a goal no one wrote down, or a feedback signal that arrives too late to matter.

It can become an alibi — “the system did it” — letting people who genuinely chose badly off the hook. Used honestly, though, it shows you the few places where a small push changes the whole system.

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

Good taste has three parts. _Resonance_: what you point people toward lands — your friends like the books you recommend. _Articulation_: you can say what you’re optimizing for, and why. _Execution_: you can consistently make choices that hit that mark in context. All three are trainable, and most people are uneven across them.

Resonance without articulation is intuition you can’t share. Articulation without execution is a manifesto with nothing behind it. Execution without resonance is a closed loop — you make what you want, and no one else cares. Each one demands a different kind of work.

Taste sharpened only by consumption curdles into snobbery — a refined palate with no kitchen. And the better your filter gets, the wider the gap between what you can admire and what you can make. Most people quit inside that gap; the ones with taste worth having kept working through it.

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
