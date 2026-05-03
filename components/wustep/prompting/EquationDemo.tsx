import * as React from 'react'

import { useInView } from '@/lib/use-in-view'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

import { ChevronIcon, ReplayIcon } from './icons'

import styles from './PromptingPage.module.css'

const LEVER_DETAILS: Record<
  string,
  { label: string; examples: string }
> = {
  TOOL: {
    label: 'Tool',
    examples: 'Cursor, Codex, Claude Code, your editor, the terminal.'
  },
  MODEL: {
    label: 'Model',
    examples: 'Opus 4.7 Thinking, Sonnet 12, GPT-7o, Gemini 5.'
  },
  HUMAN_PROMPT: {
    label: 'Prompt',
    examples: 'The literal words you type into the box.'
  },
  CONTEXT: {
    label: 'Context',
    examples:
      'Open files, repo index, screenshots, prior turns, pinned docs, project rules.'
  }
}

/* ─────────────────────────────────────────────────────────
 * EQUATION DEMO STORYBOARD
 *
 *    0ms   waits for IntersectionObserver (threshold 0.4)
 *  750ms   triggers expansion → simple line shrinks + slides up,
 *          arrow drops down, expanded line fades + scales in
 *  ~2.0s   `fullyExpanded` flips → overflow released so lever
 *          tooltips can escape the clipped row
 *
 *  click Replay  →  fast collapse (~500ms transitions on base
 *                    classes), then 750ms pause, then the slow
 *                    expansion plays again
 *  prefers-reduced-motion  →  expansion fires instantly
 * ───────────────────────────────────────────────────────── */

export function EquationDemo() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4 })
  const [expanded, setExpanded] = React.useState(false)
  // Once the max-height transition finishes we let the expanded line overflow
  // visibly so the lever tooltips can escape upward without being clipped.
  const [fullyExpanded, setFullyExpanded] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion) {
      setExpanded(true)
      return
    }
    const id = window.setTimeout(() => setExpanded(true), 750)
    return () => window.clearTimeout(id)
  }, [inView, prefersReducedMotion])

  React.useEffect(() => {
    if (!expanded) {
      setFullyExpanded(false)
      return
    }
    const id = window.setTimeout(
      () => setFullyExpanded(true),
      prefersReducedMotion ? 0 : 2000
    )
    return () => window.clearTimeout(id)
  }, [expanded, prefersReducedMotion])

  const replay = () => {
    setExpanded(false)
    setFullyExpanded(false)
    // Collapse runs fast (~500ms) — small pause on the centered simple
    // equation before the slow re-expansion plays.
    window.setTimeout(() => setExpanded(true), 750)
  }

  return (
    <div
      ref={ref}
      className={`${styles.equationCard} ${expanded ? styles.equationCardExpanded : ''}`}
    >
      <div className={styles.equationStage}>
        <div
          className={`${styles.equationLine} ${styles.equationSimple} ${
            expanded ? styles.equationSimpleSettled : ''
          }`}
        >
          <Token kind='agent'>AGENT</Token>
          <Op>×</Op>
          <Token kind='input'>INPUT</Token>
          <Op>→</Op>
          <Token kind='output'>OUTPUT</Token>
        </div>

        <span
          className={`${styles.equationArrow} ${expanded ? styles.equationArrowVisible : ''}`}
          aria-hidden='true'
        >
          ↓
        </span>

        <div
          className={`${styles.equationLine} ${styles.equationExpanded} ${
            expanded ? styles.equationLineVisible : ''
          } ${fullyExpanded ? styles.equationLineFullyVisible : ''}`}
        >
          <Group>
            <Bracket>(</Bracket>
            <LeverChip name='TOOL' />
            <Op subtle>+</Op>
            <LeverChip name='MODEL' />
            <Bracket>)</Bracket>
          </Group>
          <Op>×</Op>
          <Group>
            <Bracket>(</Bracket>
            <LeverChip name='HUMAN_PROMPT' />
            <Op subtle>+</Op>
            <LeverChip name='CONTEXT' />
            <Bracket>)</Bracket>
          </Group>
          <Op>→</Op>
          <Token kind='output'>OUTPUT</Token>
        </div>
      </div>

      <div className={styles.equationFooter}>
        <span
          className={`${styles.equationHint} ${fullyExpanded ? styles.equationHintVisible : ''}`}
          aria-hidden={!fullyExpanded}
        >
          Hover any lever to learn more.
        </span>
        <button
          type='button'
          className={styles.equationReplay}
          onClick={replay}
          aria-label='Replay animation'
        >
          <ReplayIcon /> Replay
        </button>
      </div>
    </div>
  )
}

/**
 * Token / Op / Bracket / Group — small primitives that shape the
 * equation glyphs. Exported so the recap viz can reuse them.
 */
export function Token({
  children,
  kind
}: {
  children: React.ReactNode
  kind?: 'agent' | 'input' | 'output'
}) {
  return <span className={`${styles.token} ${styles[`token_${kind}`] ?? ''}`}>{children}</span>
}

export function Op({ children, subtle }: { children?: React.ReactNode; subtle?: boolean }) {
  return (
    <span className={`${styles.op} ${subtle ? styles.opSubtle : ''}`} aria-hidden='true'>
      {children ?? ''}
    </span>
  )
}

export function Bracket({ children }: { children: React.ReactNode }) {
  return <span className={styles.bracket}>{children}</span>
}

export function Group({ children }: { children: React.ReactNode }) {
  return <span className={styles.group}>{children}</span>
}

function LeverChip({ name }: { name: keyof typeof LEVER_DETAILS }) {
  const detail = LEVER_DETAILS[name]!
  return (
    <button
      type='button'
      className={styles.lever}
      aria-label={`${detail.label}: ${detail.examples}`}
    >
      <span className={styles.leverName}>{name}</span>
      <span className={styles.leverPopover} role='tooltip'>
        <span className={styles.leverPopoverLabel}>{detail.label}</span>
        <span className={styles.leverPopoverText}>{detail.examples}</span>
      </span>
    </button>
  )
}

const DEBUG_QUESTIONS: Array<{
  q: string
  lever: string
  fix: string
}> = [
  {
    q: 'Did I communicate clearly?',
    lever: 'PROMPT',
    fix: "Rewrite with concrete details. Paste the error. Name the file. Say what good looks like and what to avoid. If you've rewritten the same prompt five times, the lever you actually need is context."
  },
  {
    q: 'What did the agent get to see?',
    lever: 'CONTEXT',
    fix: "Load the relevant files, screenshots, design docs, and project rules. The model can't reason about what it can't read. 'The model is dumb today' is almost always 'the model can't see the thing it needs.'"
  },
  {
    q: 'Was this the right model?',
    lever: 'MODEL',
    fix: 'Upgrade to a more capable model for tricky work. If the tool offered "Auto," override it — that mode optimizes for cost, not for you.'
  },
  {
    q: 'Was thinking on?',
    lever: 'MODEL',
    fix: 'For ambiguous, multi-step, or stuck moments, turn thinking up. The cheap dial pays the most often. Drop it back when the work is mechanical.'
  }
]

export function DebugChecklist() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  return (
    <div className={styles.debug} role='list'>
      {DEBUG_QUESTIONS.map((item, i) => {
        const open = openIndex === i
        return (
          <div
            key={item.q}
            className={`${styles.debugItem} ${open ? styles.debugItemOpen : ''}`}
            role='listitem'
          >
            <button
              type='button'
              className={styles.debugQuestion}
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
            >
              <span className={styles.debugIndex} aria-hidden='true'>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.debugQuestionText}>{item.q}</span>
              <span className={styles.debugLever} aria-hidden='true'>
                {item.lever}
              </span>
              <span className={styles.debugChevron} aria-hidden='true'>
                <ChevronIcon />
              </span>
            </button>
            <div className={styles.debugAnswer}>
              <div className={styles.debugAnswerInner}>{item.fix}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
