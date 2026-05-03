import * as React from 'react'

import { useInView } from '@/lib/use-in-view'

import { ChapterBody } from './ChapterBody'

import styles from './PromptingPage.module.css'

export function TechniquesContent() {
  return (
    <ChapterBody>
      <p>
        If you&apos;ve been writing software with agents for a while, you
        might be starting to feel competent. Don&apos;t trust the feeling.
      </p>

      <EloChart />

      <p>
        AI coding is roughly three years old. Chess is five hundred. Three
        years of chess might get you to 1200 ELO &mdash; past most casual
        players, but a long way short of anyone you&apos;d call expert. The
        frontier of the curve is somewhere out around 2800.
        That&apos;s where we all are with this skill.
      </p>

      <p>
        The danger of feeling expert too early is that your curve flattens.
        You stop reading tutorials, skip the bootcamp, ignore the patterns
        the model just enabled last week. Look at where your workflow was
        twelve months ago, then project that forward &mdash; most of the
        meta hasn&apos;t been uncovered yet.
      </p>

      <p>
        Chess players don&apos;t just play games &mdash; they build a
        repertoire. Openings, tactical patterns (forks, pins, skewers,
        discovered attacks), endgame studies. None of it magic; all of it
        learnable, mostly from other players. The same vocabulary is forming
        for prompting. Here are some moves worth adding to yours.
      </p>

      <TechniqueGroup heading='Before you start'>
        <Technique prompt='What questions should you ask me before starting?'>
          <p>
            Surfaces ambiguity instead of guessing. The model returns a list
            of things it&apos;s uncertain about; you answer them, then it
            goes. Saves a lot of clarifying turns later. Especially good
            with smaller, faster models.
          </p>
        </Technique>

        <Technique
          prompt={`What's the smallest version of this that ships?`}
        >
          <p>
            Scopes down before delegating. Ten lines instead of a thousand.
            The model is happy to grow scope; you have to ask it to shrink.
          </p>
        </Technique>
      </TechniqueGroup>

      <TechniqueGroup heading='Open the options'>
        <Technique prompt='Give me 3 options, rank them, name the trade-offs.'>
          <p>
            Forces breadth before depth. The model defaults to its first
            plausible idea; this resets the floor. Useful for any decision
            where you don&apos;t already know the right answer &mdash;
            algorithm choice, library choice, schema design.
          </p>
        </Technique>

        <Technique prompt='Argue against your last suggestion.'>
          <p>
            Surfaces hidden assumptions. Especially useful right after a
            plan &mdash; much cheaper to discover the plan&apos;s weaknesses
            now than after you&apos;ve implemented it.
          </p>
        </Technique>
      </TechniqueGroup>

      <TechniqueGroup heading='Pressure-test it'>
        <Technique prompt='What did you skip?'>
          <p>
            After a delegated task, ask what was glossed over. The model
            often owns things you&apos;d have missed &mdash; tests, error
            handling, the &quot;TODO: revisit&quot; it left in line 47.
            Cheap two-second move, high hit rate.
          </p>
        </Technique>

        <Technique prompt='How would a senior engineer review this?'>
          <p>
            Triggers review-mode output. Different vibe than
            implementation-mode &mdash; more critical, more &quot;but
            consider&quot; tradeoffs, more willing to call out things its
            implementation-self would have left in.
          </p>
        </Technique>
      </TechniqueGroup>

      <TechniqueGroup heading='Pay it forward'>
        <Technique prompt='Match the style of components/PostCard.tsx.'>
          <p>
            Anchor on something concrete &mdash; a path, a screenshot, a
            doc, a working example. &quot;Match this&quot; beats &quot;make
            it look nice&quot; by a wide margin. Models are imitators
            first; give them something to imitate.
          </p>
        </Technique>

        <Technique prompt='Update CLAUDE.md with what you just learned.'>
          <p>
            Capture the lesson in the project rules so the next agent (or
            future-you) doesn&apos;t have to relearn it. Five minutes of
            investment that pays back forever.
          </p>
        </Technique>
      </TechniqueGroup>

      <div className={styles.skillsBlock}>
        <h3 className={styles.skillsHeading}>Lift them into skills</h3>
        <p>
          Once you find a move that works, stop typing it manually. Every
          serious agent tool lets you write project-level instructions that
          the agent reads on every task &mdash; you write the lesson once,
          the agent has it forever.
        </p>
        <div className={styles.skillsLinks}>
          <a
            href='https://docs.claude.com/en/docs/claude-code/skills'
            className={styles.skillsLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            Claude Code · Skills
            <span className={styles.skillsLinkArrow} aria-hidden='true'>
              ↗
            </span>
          </a>
          <a
            href='https://docs.cursor.com/en/context/rules'
            className={styles.skillsLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            Cursor · Rules
            <span className={styles.skillsLinkArrow} aria-hidden='true'>
              ↗
            </span>
          </a>
          <a
            href='https://github.com/openai/codex#agentsmd'
            className={styles.skillsLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            Codex · AGENTS.md
            <span className={styles.skillsLinkArrow} aria-hidden='true'>
              ↗
            </span>
          </a>
        </div>
        <p>
          The techniques above turn into one-liners in that file. A useful
          rules file looks something like:
        </p>
        <pre className={styles.skillsExample}>
{`- Before any non-trivial task, ask what's unclear before writing code.
- When asked to plan, propose 3 options ranked by trade-off.
- After delegating, list what was skipped or glossed over.
- Match the patterns in components/PostCard.tsx for new card UIs.`}
        </pre>
        <p>
          Now those moves are the agent&apos;s defaults instead of yours.
          You stop carrying the techniques in your head and start
          accumulating an edge that compounds with every task.
        </p>
      </div>

      <div className={styles.synthesis}>
        <h3 className={styles.synthesisHeading}>
          <span className={styles.synthesisSymbol} aria-hidden='true'>
            ✦
          </span>
          Keep climbing
        </h3>
        <p>
          None of these are hard. All of them compound. The point
          isn&apos;t to memorize a checklist &mdash; it&apos;s to recognize
          there&apos;s a craft here, the craft has shape, and the shape is
          still being mapped.
        </p>
        <p>
          We&apos;re all about 1200 ELO at this. The next 1200 points is
          wide open.
        </p>
      </div>
    </ChapterBody>
  )
}


function TechniqueGroup({
  heading,
  children
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className={styles.techniqueGroup}>
      <h3 className={styles.techniqueGroupHeading}>
        <span className={styles.techniqueGroupHeadingMark} aria-hidden='true' />
        {heading}
      </h3>
      <div className={styles.techniqueGroupBody}>{children}</div>
    </section>
  )
}

function Technique({
  prompt,
  children
}: {
  prompt: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.technique}>
      <p className={styles.techniquePrompt}>
        <span className={styles.techniqueQuoteMark} aria-hidden='true'>
          “
        </span>
        {prompt}
        <span className={styles.techniqueQuoteMark} aria-hidden='true'>
          ”
        </span>
      </p>
      <div className={styles.techniqueBody}>{children}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
 * ELO CHART STORYBOARD
 *
 *    0ms   waiting for IntersectionObserver (threshold 0.4)
 *  200ms   density curve fill fades in
 *  300ms   density curve stroke draws left → right (1400ms)
 * 1400ms   axis ticks + tier labels fade in
 * 1600ms   "You · 1200" marker fades in (line + dot + label)
 * 1900ms   gap arrow draws between the two markers
 * 2200ms   "Magnus · 2839" marker fades in
 * 2600ms   caption fades in below
 * ───────────────────────────────────────────────────────── */

function EloChart() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 })

  return (
    <figure
      ref={ref}
      className={`${styles.eloChart} ${inView ? styles.eloChartVisible : ''}`}
    >
      <svg
        viewBox='0 0 600 180'
        className={styles.eloChartSvg}
        role='img'
        aria-label="Chess ELO distribution. Player density peaks around 1200 — where about three years of practice puts you. Magnus Carlsen, the world #1, sits at 2839 ELO, far out in the right tail."
        preserveAspectRatio='xMidYMid meet'
      >
        <defs>
          <linearGradient id='eloFill' x1='0' x2='0' y1='0' y2='1'>
            <stop offset='0%' stopColor='#b439df' stopOpacity='0.35' />
            <stop offset='100%' stopColor='#e5337e' stopOpacity='0.04' />
          </linearGradient>
          <linearGradient id='eloStroke' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#b439df' />
            <stop offset='100%' stopColor='#e5337e' />
          </linearGradient>
        </defs>

        {/*
          Density curve — right-skewed, mode around ELO 800 (x=83).
          Reflects how most chess players (especially online) cluster
          in the 600–1000 range with a long tail through 2000+.

          Key x positions: 40 = ELO 600, 83 = 800, 170 = 1200 (you),
          300 = 1800, 525 = 2839 (Magnus). Mapping is x = 40 + (ELO-600)/4.62.
        */}
        <path
          d='M 40,80 C 52,72 64,50 83,30 C 102,38 118,49 130,58 C 148,69 162,75 170,77 C 190,87 208,95 225,101 C 252,111 280,118 305,123 C 340,127 380,129 420,130 L 560,130 L 40,130 Z'
          fill='url(#eloFill)'
          className={styles.eloChartCurveFill}
        />

        {/* Density curve (stroke that draws in left → right) */}
        <path
          d='M 40,80 C 52,72 64,50 83,30 C 102,38 118,49 130,58 C 148,69 162,75 170,77 C 190,87 208,95 225,101 C 252,111 280,118 305,123 C 340,127 380,129 420,130 L 560,130'
          fill='none'
          stroke='url(#eloStroke)'
          strokeWidth='1.75'
          strokeLinecap='round'
          pathLength={100}
          className={styles.eloChartCurveStroke}
        />

        {/* Axis line */}
        <line
          x1='40'
          y1='130'
          x2='560'
          y2='130'
          className={styles.eloChartAxis}
        />

        {/* Tier ticks */}
        <g className={styles.eloChartTicks}>
          <line x1='40' y1='130' x2='40' y2='135' />
          <line x1='170' y1='130' x2='170' y2='135' />
          <line x1='300' y1='130' x2='300' y2='135' />
          <line x1='430' y1='130' x2='430' y2='135' />
          <line x1='560' y1='130' x2='560' y2='135' />
        </g>

        {/* Tier labels */}
        <g className={styles.eloChartTierLabels}>
          <text x='40' y='150' textAnchor='start'>
            600
          </text>
          <text x='300' y='150' textAnchor='middle'>
            1800
          </text>
          <text x='560' y='150' textAnchor='end'>
            3000
          </text>
        </g>

        {/* Gap arrow between markers */}
        <g className={styles.eloChartGap}>
          <line
            x1='180'
            y1='72'
            x2='515'
            y2='100'
            strokeDasharray='2 4'
          />
          <text x='347' y='80' textAnchor='middle'>
            a long way to go
          </text>
        </g>

        {/* You marker — ELO ~1200 (x=170, curve at y≈77) */}
        <g
          className={`${styles.eloChartMarker} ${styles.eloChartMarkerYou}`}
        >
          <line x1='170' y1='77' x2='170' y2='130' />
          <circle cx='170' cy='77' r='5.5' />
          <text x='170' y='65' textAnchor='middle'>
            You · 1200
          </text>
        </g>

        {/* Magnus marker — ELO 2839 (x=525, baseline) */}
        <g
          className={`${styles.eloChartMarker} ${styles.eloChartMarkerMagnus}`}
        >
          <line x1='525' y1='100' x2='525' y2='130' />
          <circle cx='525' cy='130' r='5.5' />
          <text x='525' y='91' textAnchor='middle'>
            Magnus · 2839
          </text>
        </g>
      </svg>

      <figcaption className={styles.eloChartCaption}>
        Most chess players sit in the 600&ndash;1000 range. Three years of
        practice gets you to about 1200 &mdash; past most players, but
        nowhere near the frontier. Magnus is still finding new things every
        year.
      </figcaption>
    </figure>
  )
}

