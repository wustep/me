import * as React from 'react'

import { useInView } from '@/lib/use-in-view'

import { ChapterBody } from './ChapterBody'
import styles from './PromptingPage.module.css'

export function OrchestrationContent() {
  return (
    <ChapterBody>
      <p>
        Watch yourself for a few minutes. Short prompt, response. Short prompt,
        response. It feels like flow, but the agent finishes in seconds and you
        spend the next ninety thinking, scanning, retyping. You are the
        bottleneck.
      </p>

      <PingPongDiagram />

      <p>
        Orchestration is the move from typist to conductor &mdash; from
        messaging the agent to briefing it, from one thread to several. Stop
        tuning the next prompt and start tuning the next <em>hour</em>.
      </p>

      <h3 className={styles.orchSectionHeading}>Chain, don&apos;t ping</h3>

      <p>
        If you already know steps two through five before you send step one,
        write them all into the brief and let the agent walk the chain on its
        own. The agent loses nothing by knowing the destination; you lose four
        context switches.
      </p>

      <div className={styles.orchPair}>
        <div className={styles.orchCard}>
          <span className={styles.orchCardLabel}>Pinging</span>
          <pre className={styles.orchPromptBlock}>
            {`> Read the auth module.

(reads, waits)

> Now find the session bug.

(finds, waits)

> Now write a test for it.

(writes, waits)

> Now open a PR.`}
          </pre>
        </div>
        <div className={`${styles.orchCard} ${styles.orchCardGood}`}>
          <span className={styles.orchCardLabel}>Briefing</span>
          <pre className={styles.orchPromptBlock}>
            {`> Read the auth module, find the
  session bug we keep seeing on
  refresh, write a regression test,
  and open a PR. If you hit a fork,
  pick the smaller change and note
  the alternative in the PR body.`}
          </pre>
        </div>
      </div>

      <p>
        Rule of thumb:{' '}
        <strong>
          if you already know the next prompt, write it into the brief instead.
        </strong>
      </p>

      <h3 className={styles.orchSectionHeading}>Stagger and overlap</h3>

      <p>
        You can only write one brief at a time. The agents don&apos;t all start
        in parallel &mdash; you start them in a cascade. Brief thread one, kick
        it off. While it runs, brief thread two. Then three. By the time
        you&apos;ve sent the third, the first is delivering. You step in,
        glance, send a follow-up, and the cycle continues.
      </p>

      <StaggerDiagram />

      <p>
        Three things to notice. The purple bars never overlap &mdash;
        that&apos;s your hands, and there&apos;s only one of you. The pink bars
        do, freely; the agents don&apos;t wait for each other. And after every
        agent finishes, there&apos;s a small grey gap before you come back: real
        attention costs, and you can only spend it on one thread at a time.
      </p>

      <h3 className={styles.orchSectionHeading}>Fan out</h3>

      <p>
        One agent works on one thing at a time. You don&apos;t. The moment a
        task is independent of another, run them side-by-side &mdash; separate
        tabs, separate worktrees, separate windows.
      </p>

      <FanOutDiagram />

      <p>
        Good candidates: tests in parallel with the implementation, five
        unrelated bugs at once, three library spikes side-by-side. Bad
        candidates: anything where agent B reads what agent A produced &mdash;
        don&apos;t parallelize a chain. Budget for the merge too; three branches
        become one review queue.
      </p>

      <h3 className={styles.orchSectionHeading}>Specialize the roles</h3>

      <p>
        Give different agents different jobs and let them hand work to each
        other. A researcher reads and plans. An implementer takes the plan and
        writes. A reviewer comes in cold and critiques. Each role wants a
        different mindset and a different context window &mdash; splitting them
        enforces a discipline you&apos;d struggle to keep alone.
      </p>

      <RolesDiagram />

      <p>
        Most modern tools support this directly &mdash; sub-agents, background
        tasks, parallel runs. The spin-up cost is now smaller than the cost of
        switching contexts in your own head.
      </p>

      <h3 className={styles.orchSectionHeading}>Run long, check less</h3>

      <p>
        The biggest leaps of the last year have been long-horizon tasks &mdash;
        jobs that run for thirty, sixty, ninety minutes while you do something
        else. Whole-repo refactors. Migrations. Test backfills. The instinct is
        to babysit. Resist it; babysitting collapses long jobs back into
        ping-pong.
      </p>

      <p>
        Write a brief that can survive without you: a clear goal, an explicit
        success criterion (&ldquo;all tests pass, build is green&rdquo;),
        permission to make small judgment calls, and a fallback for when stuck
        (&ldquo;leave a TODO and continue&rdquo;). Come back to a finished
        branch, not a half-finished conversation.
      </p>

      <h3 className={styles.orchSectionHeading}>The conductor&apos;s job</h3>

      <p>
        With multiple agents going, your job changes shape. You&apos;re
        triaging, not typing. Which branch needs a decision? Which run is stuck?
        What&apos;s ready to merge? The skills that matter are reading diffs
        fast, holding several threads, killing runs that have gone sideways, and
        writing briefs that don&apos;t need follow-ups. These are management
        skills &mdash; learnable, and they compound.
      </p>

      <div className={styles.synthesis}>
        <h3 className={styles.synthesisHeading}>
          <span className={styles.synthesisSymbol} aria-hidden='true'>
            ✦
          </span>
          Command the fleet
        </h3>
        <p>
          One agent makes you faster. The shift in orchestration is bigger than
          that: suddenly you have access to a whole team &mdash; cheap, fast,
          and always available. The bottleneck is <em>you</em> &mdash; how well
          you brief them, unblock them, and keep several moving at once.
        </p>
        <p>
          That&apos;s the skill to invest in. Optimize the hour, not the
          message. Chain steps. Fan out independent work. Specialize roles. Let
          long jobs run. The conductor&apos;s edge is patient briefing and clean
          handoffs &mdash; nothing else.
        </p>
      </div>
    </ChapterBody>
  )
}

/* ─────────────────────────────────────────────────────────
 * PING PONG vs BRIEF diagram
 *
 * Two stacked timelines on a shared time axis. Top row: many
 * tiny user/agent blocks separated by long "you are thinking"
 * gaps. Bottom row: one long brief, one long response, done.
 * Same work, very different wall-clock cost.
 * ───────────────────────────────────────────────────────── */

type SegmentKind = 'you' | 'agent' | 'idle'

const SEGMENT_TOOLTIPS: Record<SegmentKind, string> = {
  you: 'You — writing a prompt or brief',
  agent: 'Agent — running',
  idle: 'You — reading, thinking, deciding what to do next'
}

type PingSegment = {
  x: number
  w: number
  kind: SegmentKind
}

// Six U/A cycles. Agent block is wider than user block (the model
// is doing more work than you are typing). After each agent turn,
// a wide grey "idle" block — that's you reading, thinking,
// deciding what to type next.
const PING_SEGMENTS: PingSegment[] = (() => {
  const out: PingSegment[] = []
  let x = 100
  for (let i = 0; i < 6; i++) {
    out.push({ x, w: 14, kind: 'you' })
    x += 14 + 2
    out.push({ x, w: 24, kind: 'agent' })
    x += 24 + 2
    out.push({ x, w: 26, kind: 'idle' })
    x += 26 + 2
  }
  return out
})()
const PING_END = PING_SEGMENTS.at(-1)!.x + PING_SEGMENTS.at(-1)!.w

function PingPongDiagram() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  return (
    <figure
      ref={ref}
      className={`${styles.orchDiagram} ${inView ? styles.orchDiagramVisible : ''}`}
    >
      <svg
        viewBox='0 0 600 180'
        className={styles.orchTimelineSvg}
        role='img'
        aria-label='Two timelines on a shared time axis. Top: many small alternating user and agent turns separated by grey idle blocks. Bottom: one user brief and one longer agent response, done much sooner.'
        preserveAspectRatio='xMidYMid meet'
      >
        <defs>
          <linearGradient id='orchTimelineYou' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#6d28d9' />
            <stop offset='100%' stopColor='#7c3aed' />
          </linearGradient>
          <linearGradient id='orchTimelineAgent' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#9d174d' />
            <stop offset='100%' stopColor='#be185d' />
          </linearGradient>
        </defs>

        {/* Ping-pong row */}
        <text
          x='90'
          y='38'
          textAnchor='end'
          className={styles.orchTimelineLabel}
        >
          Ping-pong
        </text>
        {PING_SEGMENTS.map((s, i) => (
          <rect
            key={i}
            x={s.x}
            y='28'
            width={s.w}
            height='20'
            rx='5'
            ry='5'
            fill={
              s.kind === 'you'
                ? 'url(#orchTimelineYou)'
                : s.kind === 'agent'
                  ? 'url(#orchTimelineAgent)'
                  : undefined
            }
            className={`${styles.orchTimelineBlock} ${
              s.kind === 'idle' ? styles.orchTimelineIdle : ''
            }`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <title>{SEGMENT_TOOLTIPS[s.kind]}</title>
          </rect>
        ))}
        <text x={PING_END + 10} y='42' className={styles.orchTimelineDuration}>
          ~14 min
        </text>

        {/* Brief & ship row */}
        <text
          x='90'
          y='100'
          textAnchor='end'
          className={styles.orchTimelineLabel}
        >
          Brief &amp; ship
        </text>
        <rect
          x='100'
          y='90'
          width='70'
          height='20'
          rx='5'
          ry='5'
          fill='url(#orchTimelineYou)'
          className={styles.orchTimelineBlock}
          style={{ animationDelay: '500ms' }}
        >
          <title>{SEGMENT_TOOLTIPS.you}</title>
        </rect>
        <rect
          x='174'
          y='90'
          width='200'
          height='20'
          rx='5'
          ry='5'
          fill='url(#orchTimelineAgent)'
          className={styles.orchTimelineBlock}
          style={{ animationDelay: '640ms' }}
        >
          <title>{SEGMENT_TOOLTIPS.agent}</title>
        </rect>
        <text x='384' y='104' className={styles.orchTimelineDuration}>
          ~5 min
        </text>

        {/* Time axis */}
        <line
          x1='100'
          y1='146'
          x2='560'
          y2='146'
          className={styles.orchTimelineAxis}
        />
        <text
          x='560'
          y='162'
          textAnchor='end'
          className={styles.orchTimelineAxisLabel}
        >
          time →
        </text>
      </svg>
      <figcaption className={styles.orchCaption}>
        Same work, very different wall-clock cost. The grey blocks in the top
        row are <em>you</em>, deciding what to type next.
      </figcaption>
    </figure>
  )
}

/* ─────────────────────────────────────────────────────────
 * FAN OUT diagram
 *
 * One brief at top; three agent tracks running in parallel
 * below it on the same time axis; a single merge point on
 * the right. The point: independent work fans, then funnels.
 * ───────────────────────────────────────────────────────── */

const FAN_TRACKS = [
  { y: 70, end: 420, label: 'Agent · tests' },
  { y: 105, end: 380, label: 'Agent · docs' },
  { y: 140, end: 460, label: 'Agent · refactor' }
] as const

function FanOutDiagram() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  return (
    <figure
      ref={ref}
      className={`${styles.orchDiagram} ${inView ? styles.orchDiagramVisible : ''}`}
    >
      <svg
        viewBox='0 0 600 200'
        className={styles.orchTimelineSvg}
        role='img'
        aria-label='One conductor brief feeds three parallel agent tracks; the three streams converge at a single merge point on the right.'
        preserveAspectRatio='xMidYMid meet'
      >
        <defs>
          <linearGradient id='orchFanYou' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#6d28d9' />
            <stop offset='100%' stopColor='#7c3aed' />
          </linearGradient>
          <linearGradient id='orchFanAgent' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#9d174d' />
            <stop offset='100%' stopColor='#be185d' />
          </linearGradient>
        </defs>

        {/* You · brief */}
        <rect
          x='40'
          y='20'
          width='130'
          height='22'
          rx='6'
          ry='6'
          fill='url(#orchFanYou)'
          className={styles.orchTimelineBlock}
        >
          <title>{SEGMENT_TOOLTIPS.you}</title>
        </rect>
        <text
          x='105'
          y='35'
          textAnchor='middle'
          className={styles.orchFanBlockLabel}
        >
          You · brief
        </text>

        {/* Drop lines from brief to each track */}
        {FAN_TRACKS.map((t, i) => (
          <path
            key={`drop-${i}`}
            d={`M 170,42 C 200,42 195,${t.y + 11} 230,${t.y + 11}`}
            fill='none'
            stroke='url(#orchFanYou)'
            strokeWidth='1.25'
            strokeLinecap='round'
            strokeDasharray='3 4'
            className={styles.orchFanDrop}
            style={{ animationDelay: `${i * 140}ms` }}
          />
        ))}

        {/* Three parallel agent tracks */}
        {FAN_TRACKS.map((t, i) => (
          <g
            key={`track-${i}`}
            style={{ animationDelay: `${300 + i * 140}ms` }}
            className={styles.orchFanTrack}
          >
            <rect
              x='230'
              y={t.y}
              width={t.end - 230}
              height='22'
              rx='6'
              ry='6'
              fill='url(#orchFanAgent)'
            >
              <title>{SEGMENT_TOOLTIPS.agent}</title>
            </rect>
            <text
              x={235}
              y={t.y + 15}
              textAnchor='start'
              className={styles.orchFanBlockLabel}
            >
              {t.label}
            </text>
          </g>
        ))}

        {/* Merge brace */}
        <g className={styles.orchFanMerge}>
          <path
            d='M 478,68 C 490,68 490,120 502,120 C 490,120 490,172 478,172'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.25'
          />
          <text x='510' y='124' className={styles.orchFanMergeLabel}>
            merge
          </text>
        </g>

        {/* Time axis */}
        <line
          x1='40'
          y1='185'
          x2='560'
          y2='185'
          className={styles.orchTimelineAxis}
        />
        <text
          x='560'
          y='199'
          textAnchor='end'
          className={styles.orchTimelineAxisLabel}
        >
          time →
        </text>
      </svg>
      <figcaption className={styles.orchCaption}>
        One brief fans out; three streams run in parallel; one merge to review.
        Use this shape only when the tracks don&apos;t depend on each other.
      </figcaption>
    </figure>
  )
}

/* ─────────────────────────────────────────────────────────
 * SPECIALIZED ROLES diagram
 *
 * Linear pipeline: Researcher → Implementer → Reviewer.
 * The arrows are labeled with the artifact that crosses
 * each handoff (plan, diff), making the seam between roles
 * concrete instead of abstract.
 * ───────────────────────────────────────────────────────── */

const ROLES = [
  { name: 'Researcher', verb: 'reads & plans' },
  { name: 'Implementer', verb: 'writes the diff' },
  { name: 'Reviewer', verb: 'critiques cold' }
] as const

const ROLE_HANDOFFS = ['plan.md', 'diff'] as const

function RolesDiagram() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  return (
    <figure
      ref={ref}
      className={`${styles.orchDiagram} ${inView ? styles.orchDiagramVisible : ''}`}
    >
      <div className={styles.orchRolesPipeline}>
        {ROLES.map((r, i) => (
          <React.Fragment key={r.name}>
            <div
              className={styles.orchRoleCard}
              style={{ animationDelay: `${i * 220}ms` }}
            >
              <span className={styles.orchRoleName}>{r.name}</span>
              <span className={styles.orchRoleVerb}>{r.verb}</span>
            </div>
            {i < ROLES.length - 1 && (
              <div
                className={styles.orchRoleHandoff}
                style={{ animationDelay: `${i * 220 + 140}ms` }}
                aria-hidden='true'
              >
                <span className={styles.orchRoleHandoffArtifact}>
                  {ROLE_HANDOFFS[i]}
                </span>
                <span className={styles.orchRoleHandoffArrow}>→</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <figcaption className={styles.orchCaption}>
        Each handoff is a concrete artifact &mdash; a plan, a diff. Name them
        and the seams between roles stop being fuzzy.
      </figcaption>
    </figure>
  )
}

/* ─────────────────────────────────────────────────────────
 * STAGGER diagram
 *
 * Three threads running in parallel. Plans (purple) cascade
 * because you can only type one brief at a time. Agent work
 * (pink) overlaps freely. After each agent finishes there's
 * a grey idle gap (your attention is finite), then a
 * follow-up plan, then another agent block.
 * ───────────────────────────────────────────────────────── */

type StaggerSegment = {
  x: number
  w: number
  kind: SegmentKind
}

const STAGGER_TRACKS: ReadonlyArray<{
  y: number
  segments: StaggerSegment[]
}> = [
  {
    y: 24,
    segments: [
      { x: 100, w: 22, kind: 'you' },
      { x: 124, w: 160, kind: 'agent' },
      { x: 286, w: 10, kind: 'idle' },
      { x: 298, w: 18, kind: 'you' },
      { x: 318, w: 100, kind: 'agent' }
    ]
  },
  {
    y: 46,
    segments: [
      { x: 124, w: 22, kind: 'you' },
      { x: 148, w: 130, kind: 'agent' },
      { x: 280, w: 38, kind: 'idle' },
      { x: 320, w: 18, kind: 'you' },
      { x: 340, w: 80, kind: 'agent' }
    ]
  },
  {
    y: 68,
    segments: [
      { x: 148, w: 22, kind: 'you' },
      { x: 172, w: 160, kind: 'agent' },
      { x: 334, w: 24, kind: 'idle' },
      { x: 360, w: 18, kind: 'you' },
      { x: 380, w: 70, kind: 'agent' }
    ]
  }
]

function StaggerDiagram() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  return (
    <figure
      ref={ref}
      className={`${styles.orchDiagram} ${inView ? styles.orchDiagramVisible : ''}`}
    >
      <svg
        viewBox='0 0 600 130'
        className={styles.orchTimelineSvg}
        role='img'
        aria-label='Three agent tracks running in parallel. Plans (purple) cascade because you can only write one brief at a time; agent work (pink) overlaps freely; grey idle blocks follow each agent turn before a follow-up plan and another agent block.'
        preserveAspectRatio='xMidYMid meet'
      >
        <defs>
          <linearGradient id='orchStaggerYou' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#6d28d9' />
            <stop offset='100%' stopColor='#7c3aed' />
          </linearGradient>
          <linearGradient id='orchStaggerAgent' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#9d174d' />
            <stop offset='100%' stopColor='#be185d' />
          </linearGradient>
        </defs>

        {STAGGER_TRACKS.map((track, ti) => (
          <React.Fragment key={ti}>
            <text
              x='90'
              y={track.y + 11}
              textAnchor='end'
              className={styles.orchTimelineLabel}
            >
              Thread {ti + 1}
            </text>
            {track.segments.map((s, si) => (
              <rect
                key={`${ti}-${si}`}
                x={s.x}
                y={track.y}
                width={s.w}
                height='14'
                rx='4'
                ry='4'
                fill={
                  s.kind === 'you'
                    ? 'url(#orchStaggerYou)'
                    : s.kind === 'agent'
                      ? 'url(#orchStaggerAgent)'
                      : undefined
                }
                className={`${styles.orchTimelineBlock} ${
                  s.kind === 'idle' ? styles.orchTimelineIdle : ''
                }`}
                style={{ animationDelay: `${ti * 120 + si * 80}ms` }}
              >
                <title>{SEGMENT_TOOLTIPS[s.kind]}</title>
              </rect>
            ))}
          </React.Fragment>
        ))}

        {/* Time axis */}
        <line
          x1='100'
          y1='96'
          x2='560'
          y2='96'
          className={styles.orchTimelineAxis}
        />
        <text
          x='560'
          y='110'
          textAnchor='end'
          className={styles.orchTimelineAxisLabel}
        >
          time →
        </text>
      </svg>
      <figcaption className={styles.orchCaption}>
        Plans (purple) cascade &mdash; you can only write one at a time. Agent
        work (pink) overlaps freely. Grey is the small but real cost of
        switching attention between threads.
      </figcaption>
    </figure>
  )
}
