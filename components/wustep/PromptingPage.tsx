'use client'

import Link from 'next/link'
import * as React from 'react'
import BodyClassName from 'react-body-classname'

import { LabsButton } from '@/components/wustep/LabsButton'
import { ThemeToggle } from '@/components/wustep/ThemeToggle'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './PromptingPage.module.css'

const TITLE = 'How to talk to coding agents'
const TITLE_WORDS = TITLE.split(' ')
const THINKING_DURATION_MS = 1200
const PER_WORD_STAGGER_MS = 50

// Title finishes its blur-in around ~700ms + word stagger; start the body
// just after, so it lands as the title settles.
const BODY_BASE_DELAY_MS = 600
const BODY_STAGGER_MS = 110

function bodyDelay(index: number): React.CSSProperties {
  return {
    transitionDelay: `${BODY_BASE_DELAY_MS + index * BODY_STAGGER_MS}ms`
  }
}

const FAKE_MODELS = [
  { name: 'Claude Opus 9.7', tag: '1Q ctx' },
  { name: 'GPT-7o-turbo-omni-pro', tag: 'thinks?' },
  { name: 'Gemini 5 Ultra Diamond', tag: 'shiny' },
  { name: 'Sonnet 12 Hyperdrive', tag: 'fast' },
  { name: 'Grok Heavy Heavy', tag: 'heavy' },
  { name: 'DeepSeek V9', tag: 'probably AGI' }
]

// ============================================================================
// Layout — chrome that wraps every chapter page
// ============================================================================

const TOTAL_CHAPTERS = 5

export type ChapterMeta = {
  index: 1 | 2 | 3 | 4 | 5
  title: string
  prevHref?: string
  prevLabel?: string
  nextHref?: string
  nextLabel?: string
}

export function PromptingLayout({
  chapter,
  children
}: {
  chapter?: ChapterMeta
  children: React.ReactNode
}) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <>
      <BodyClassName className={isDarkMode ? 'notion dark-mode' : 'notion'} />

      <div className={styles.frame}>
        <header className='notion-header'>
          <div className='notion-nav-header'>
            <Link
              href='/'
              className={styles.homeBackButton}
              aria-label='Back to home'
            >
              <span className={styles.homeBackArrow}>←</span>
            </Link>

            <div className='notion-nav-header-rhs breadcrumbs'>
              <LabsButton className='breadcrumb button' />
              <ThemeToggle
                isDark={hasMounted ? isDarkMode : false}
                onToggle={toggleDarkMode}
                className='breadcrumb button'
              />
            </div>
          </div>
        </header>

        <main className={styles.page}>
          {chapter && <ChapterHeader chapter={chapter} />}
          {children}
          {chapter && <ChapterNav chapter={chapter} />}
        </main>
      </div>
    </>
  )
}

function ChapterHeader({ chapter }: { chapter: ChapterMeta }) {
  return (
    <header className={styles.chapterHeader}>
      <Link href='/prompting' className={styles.chapterParentTitle}>
        How to talk to coding agents
      </Link>
      <div className={styles.chapterMeta}>
        <span className={styles.chapterMetaIndex}>
          Chapter {String(chapter.index).padStart(2, '0')}
        </span>
        <span className={styles.chapterMetaSep}>of</span>
        <span className={styles.chapterMetaTotal}>
          {String(TOTAL_CHAPTERS).padStart(2, '0')}
        </span>
      </div>
      <h1 className={styles.chapterTitle}>{chapter.title}</h1>
    </header>
  )
}

function ChapterNav({ chapter }: { chapter: ChapterMeta }) {
  return (
    <nav className={styles.chapterNav} aria-label='Chapter navigation'>
      <div className={styles.chapterNavSlot}>
        {chapter.prevHref && chapter.prevLabel && (
          <Link href={chapter.prevHref} className={styles.chapterNavLink}>
            <span className={styles.chapterNavArrow} aria-hidden='true'>
              ←
            </span>
            <span className={styles.chapterNavBody}>
              <span className={styles.chapterNavDirection}>Previous</span>
              <span className={styles.chapterNavLabel}>
                {chapter.prevLabel}
              </span>
            </span>
          </Link>
        )}
      </div>
      <div className={styles.chapterNavSlot}>
        {chapter.nextHref && chapter.nextLabel && (
          <Link
            href={chapter.nextHref}
            className={`${styles.chapterNavLink} ${styles.chapterNavLinkNext}`}
          >
            <span className={styles.chapterNavBody}>
              <span className={styles.chapterNavDirection}>Next</span>
              <span className={styles.chapterNavLabel}>
                {chapter.nextLabel}
              </span>
            </span>
            <span className={styles.chapterNavArrow} aria-hidden='true'>
              →
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}

// ============================================================================
// Intro page content — animated title + body intro + Begin CTA
// ============================================================================

export function IntroContent() {
  const [revealed, setRevealed] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setRevealed(true)
      return
    }
    const id = window.setTimeout(() => setRevealed(true), THINKING_DURATION_MS)
    return () => window.clearTimeout(id)
  }, [prefersReducedMotion])

  return (
    <>
      <h1 className={styles.titleSlot} aria-label={TITLE}>
        <span
          className={`${styles.thinking} ${revealed ? styles.thinkingHidden : ''}`}
          aria-hidden={revealed}
        >
          <SparkleIcon />
          <span className={styles.thinkingText}>Thinking</span>
        </span>

        <span
          className={`${styles.title} ${revealed ? styles.titleVisible : ''}`}
          aria-hidden={!revealed}
        >
          {TITLE_WORDS.map((word, i) => (
            <React.Fragment key={`${word}-${i}`}>
              <span
                className={styles.titleWord}
                style={{
                  transitionDelay: revealed
                    ? `${i * PER_WORD_STAGGER_MS}ms`
                    : '0ms'
                }}
              >
                {word}
              </span>
              {i < TITLE_WORDS.length - 1 ? ' ' : null}
            </React.Fragment>
          ))}
        </span>
      </h1>

      <div
        className={`${styles.prose} ${revealed ? styles.bodyVisible : ''}`}
      >
        <p className={styles.bodyItem} style={bodyDelay(0)}>
          It&apos;s 2026, and more and more of coding looks like this:
        </p>

        <div className={styles.bodyItem} style={bodyDelay(1)}>
          <PromptInputDemo start={revealed} />
        </div>

        <p className={styles.bodyItem} style={bodyDelay(2)}>
          You don&apos;t write code so much as describe what you want and watch
          it appear. Less typing semicolons; more describing intent.
          Engineering, increasingly, is the act of talking to machines.
        </p>

        <p className={styles.bodyItem} style={bodyDelay(3)}>
          So here&apos;s the question: what does it mean to be good at talking
          to Claude, Codex, or whatever model comes next?
        </p>

        <p className={styles.bodyItem} style={bodyDelay(4)}>
          Here are three mental models I keep coming back to, plus a small
          repertoire of techniques worth practicing.
        </p>

        <div className={styles.bodyItem} style={bodyDelay(5)}>
          <Link href='/prompting/equation' className={styles.beginCta}>
            <span>Begin: The equation</span>
            <span className={styles.beginCtaArrow} aria-hidden='true'>
              →
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}

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

const ERROR_MESSAGES = [
  'Insufficient credits. Top up to keep going.',
  'Rate limit exceeded. Give the model a moment.',
  'Quota exhausted for this model. Try again later or switch models.'
]

/* ─────────────────────────────────────────────────────────
 * PROMPT INPUT STORYBOARD
 *
 *    0ms   waits for parent to flip `start` (after title reveals)
 * 1400ms   begins typing "Make me a sandwich" (70ms/char ≈ 1.2s)
 * 2700ms   pause on the completed sentence
 * 3300ms   auto-fires Send → error appears, card shakes
 *           Send button swaps in to the Replay button (cross-fade)
 *
 *  user types again        →  error clears, Send returns
 *  user clicks Replay      →  re-runs the whole sequence
 *  prefers-reduced-motion  →  fills value instantly, sends after 250ms
 * ───────────────────────────────────────────────────────── */
const AUTO_PROMPT = 'Center this div'
const AUTO_TYPE_INITIAL_DELAY_MS = 1400
const AUTO_TYPE_CHAR_MS = 70
const AUTO_TYPE_SEND_DELAY_MS = 700

function PromptInputDemo({ start }: { start: boolean }) {
  const [value, setValue] = React.useState('')
  const [model, setModel] = React.useState(FAKE_MODELS[0]!)
  const [open, setOpen] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [shakeKey, setShakeKey] = React.useState(0)
  const [autoTyping, setAutoTyping] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const timersRef = React.useRef<number[]>([])
  const hasRunRef = React.useRef(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  const clearTimers = () => {
    for (const id of timersRef.current) window.clearTimeout(id)
    timersRef.current = []
  }

  const triggerSend = React.useCallback((text: string) => {
    if (text.trim().length === 0) return
    const next =
      ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]!
    setError(next)
    setShakeKey((k) => k + 1)
    setAutoTyping(false)
    setSent(true)
  }, [])

  const runAutoType = React.useCallback(() => {
    clearTimers()
    setError(null)
    setSent(false)
    setValue('')

    if (prefersReducedMotion) {
      setValue(AUTO_PROMPT)
      timersRef.current.push(
        window.setTimeout(() => triggerSend(AUTO_PROMPT), 250)
      )
      return
    }

    setAutoTyping(true)
    let i = 0
    const typeStep = () => {
      i += 1
      setValue(AUTO_PROMPT.slice(0, i))
      if (i < AUTO_PROMPT.length) {
        timersRef.current.push(window.setTimeout(typeStep, AUTO_TYPE_CHAR_MS))
      } else {
        timersRef.current.push(
          window.setTimeout(
            () => triggerSend(AUTO_PROMPT),
            AUTO_TYPE_SEND_DELAY_MS
          )
        )
      }
    }
    timersRef.current.push(window.setTimeout(typeStep, 100))
  }, [prefersReducedMotion, triggerSend])

  React.useEffect(() => {
    if (!start || hasRunRef.current) return
    hasRunRef.current = true
    const id = window.setTimeout(runAutoType, AUTO_TYPE_INITIAL_DELAY_MS)
    timersRef.current.push(id)
  }, [start, runAutoType])

  React.useEffect(() => () => clearTimers(), [])

  const handleSend = () => {
    if (autoTyping) return
    triggerSend(value)
  }

  const handleReplay = () => {
    runAutoType()
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoTyping) return
    setValue(e.target.value)
    if (error) setError(null)
    if (sent) setSent(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (autoTyping) {
      e.preventDefault()
      return
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const showReplay = sent

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(t) &&
        triggerRef.current &&
        !triggerRef.current.contains(t)
      ) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div
      key={shakeKey}
      className={`${styles.promptCard} ${error ? styles.promptCardError : ''}`}
    >
      <div className={styles.promptInputWrap}>
        <textarea
          className={`${styles.promptInput} ${autoTyping ? styles.promptInputTyping : ''}`}
          placeholder='What would you like to build today?'
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={2}
          spellCheck={false}
          readOnly={autoTyping}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'prompt-error' : undefined}
        />
        {autoTyping && (
          <div className={styles.promptInputGhost} aria-hidden='true'>
            <span>{value}</span>
            <span className={styles.promptInputGhostCursor} />
          </div>
        )}
      </div>

      {error && (
        <div id='prompt-error' className={styles.promptError} role='alert'>
          <ErrorIcon />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.promptFooter}>
        <div className={styles.modelWrap}>
          <button
            ref={triggerRef}
            type='button'
            className={styles.modelButton}
            onClick={() => setOpen((o) => !o)}
            aria-haspopup='listbox'
            aria-expanded={open}
            disabled={!!error}
          >
            <span className={styles.modelDot} aria-hidden='true' />
            <span className={styles.modelName}>{model.name}</span>
            <ChevronIcon className={styles.modelChevron} />
          </button>

          {open && (
            <div ref={menuRef} className={styles.modelMenu} role='listbox'>
              {FAKE_MODELS.map((m) => {
                const active = m.name === model.name
                return (
                  <button
                    key={m.name}
                    type='button'
                    role='option'
                    aria-selected={active}
                    className={`${styles.modelOption} ${active ? styles.modelOptionActive : ''}`}
                    onClick={() => {
                      setModel(m)
                      setOpen(false)
                    }}
                  >
                    <span className={styles.modelOptionName}>{m.name}</span>
                    <span className={styles.modelOptionTag}>{m.tag}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <button
          type='button'
          className={`${styles.submitButton} ${showReplay ? styles.submitButtonReplay : ''}`}
          aria-label={showReplay ? 'Replay' : 'Send'}
          onClick={showReplay ? handleReplay : handleSend}
          disabled={!showReplay && (autoTyping || value.trim().length === 0)}
        >
          <span className={styles.submitIconStack} aria-hidden='true'>
            <span
              className={`${styles.submitIcon} ${showReplay ? styles.submitIconHidden : ''}`}
            >
              <ArrowUpIcon />
            </span>
            <span
              className={`${styles.submitIcon} ${showReplay ? '' : styles.submitIconHidden}`}
            >
              <ReplayIcon />
            </span>
          </span>
        </button>
      </div>
    </div>
  )
}

function ErrorIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='10' />
      <path d='M12 8v4' />
      <path d='M12 16h.01' />
    </svg>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='m6 9 6 6 6-6' />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.25'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M12 19V5' />
      <path d='m5 12 7-7 7 7' />
    </svg>
  )
}

// ============================================================================
// Chapter content — one per page (composed inside PromptingLayout)
// ============================================================================

function ChapterBody({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true)
      return
    }
    const id = window.setTimeout(() => setVisible(true), 200)
    return () => window.clearTimeout(id)
  }, [prefersReducedMotion])

  return (
    <div
      className={`${styles.chapterBody} ${visible ? styles.chapterBodyVisible : ''}`}
    >
      {children}
    </div>
  )
}

export function EquationContent() {
  return (
    <ChapterBody>
      <p>
        The simplest frame is an equation. Whatever a coding agent gives you
        falls out of two things multiplied together: the agent itself, and
        what you hand it.
      </p>

      <EquationDemo />

      <p>
        That gives you four levers. The point of view this frame nudges you
        toward is that{' '}
        <em>there exist inputs that produce really good outputs</em> &mdash;
        the job is finding them. So how do you actually pull each lever?
      </p>

      <Lever name='TOOL' tagline='Use a tool that was built for this.'>
        <p>
          Most people are still defaulting to whatever editor they had before
          agents were a thing, and bolting AI on. That&apos;s leaving the
          biggest, easiest win on the table.
        </p>
        <p>
          The frontier here isn&apos;t subtle: <strong>Cursor</strong>,{' '}
          <strong>Claude Code</strong>, and <strong>Codex</strong> are
          meaningfully better at this than VSCode (with stock Copilot) or
          Antigravity. They&apos;re not magic &mdash; they&apos;re just
          designed for the shape of agent work. They slice files into context
          smarter, manage long-running tasks, persist conversation state, and
          inject project-aware system prompts. Same model, different tool,
          different ceiling.
        </p>
        <p>
          You don&apos;t have to commit to one forever. Try an agent-native
          tool for a week. If your day-to-day doesn&apos;t get noticeably
          easier, go back. It probably will.
        </p>
      </Lever>

      <Lever name='MODEL' tagline='Pick the smartest model the work warrants.'>
        <p>
          Calibrate to the stakes of the task, not your defaults. A rough
          guide:
        </p>

        <div className={styles.modelGuide}>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuideWhen}>
              Boilerplate, well-trodden patterns
            </span>
            <span className={styles.modelGuidePick}>Sonnet · Haiku</span>
          </div>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuideWhen}>
              Real engineering: design decisions, debugging, architecture
            </span>
            <span className={styles.modelGuidePick}>Opus · GPT-7</span>
          </div>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuideWhen}>
              Anything tricky, ambiguous, or multi-step
            </span>
            <span className={styles.modelGuidePick}>+ Thinking on</span>
          </div>
        </div>

        <p>
          The biggest trap is <strong>&quot;Auto&quot;</strong> mode. Tools
          love offering it because it sounds helpful. In practice,
          &quot;Auto&quot; is usually optimized for the platform&apos;s
          margin, not your output &mdash; it quietly picks a cheaper model
          when it thinks it can get away with it. Override it whenever the
          work matters.
        </p>
        <p>
          Thinking effort is the cheap dial. When you&apos;re stuck, crank
          it. When you&apos;re iterating fast on something obvious, drop it.
          There&apos;s no purity to it; tune to the task in front of you.
        </p>
      </Lever>

      <Lever
        name='HUMAN_PROMPT'
        tagline='Be specific. Show the model what good looks like.'
      >
        <p>
          The prompt is the smallest of the four levers, but it&apos;s the
          one people obsess over. The patterns that consistently move the
          needle are unsexy:
        </p>
        <ul className={styles.axisList}>
          <li>
            <strong>Concrete over abstract.</strong> &quot;Make this
            faster&quot; gives the model nothing. &quot;First paint is 2.4s,
            target under 1s, profile and start with the biggest wins&quot;
            gives it a job.
          </li>
          <li>
            <strong>Anchor on examples.</strong> &quot;Match the style of{' '}
            <code>components/PostCard.tsx</code>&quot; beats &quot;make it
            look nice.&quot; Models are great at imitation, mediocre at
            taste.
          </li>
          <li>
            <strong>Say what good looks like.</strong> Constraints, success
            criteria, what to avoid. The agent will gravitate toward whatever
            you tell it to.
          </li>
        </ul>
        <p>What consistently doesn&apos;t:</p>
        <ul className={styles.axisList}>
          <li>
            <strong>&quot;Be careful.&quot;</strong> It&apos;s not careful.
            Constraints work; vibes don&apos;t.
          </li>
          <li>
            <strong>&quot;Think step by step.&quot;</strong> The model
            already does, and modern thinking modes do it better than any
            prompt incantation.
          </li>
          <li>
            <strong>Politeness padding.</strong> Doesn&apos;t hurt,
            doesn&apos;t help. Save the keystrokes.
          </li>
        </ul>
        <p>
          If you find yourself rewriting the same prompt for the fifth time,
          stop. The lever you actually need is the next one.
        </p>
      </Lever>

      <Lever
        name='CONTEXT'
        tagline='The biggest unlock. Load what the agent needs to see.'
      >
        <p>
          Most &quot;the model is dumb today&quot; moments are actually
          &quot;the model can&apos;t see the thing it needs.&quot; The prompt
          is the verb; context is the noun. Get the noun right and the verb
          almost takes care of itself.
        </p>
        <p>Things to load:</p>
        <ul className={styles.axisList}>
          <li>
            <strong>Skills and project rules.</strong> A{' '}
            <code>CLAUDE.md</code> or <code>.cursorrules</code> that captures
            your project&apos;s patterns, conventions, and the things
            you&apos;re tired of correcting.
          </li>
          <li>
            <strong>Reference material.</strong> The design doc, the API
            spec, the related PR. Drop them into the chat. Don&apos;t make
            the agent guess at what&apos;s already written down.
          </li>
          <li>
            <strong>Screenshots.</strong> For UI work, an image of the
            current state plus a sketch of the target is worth ten
            paragraphs.
          </li>
          <li>
            <strong>MCPs.</strong> Wire the agent into your actual systems
            &mdash; repo, dashboards, design tokens, internal docs. Same as
            giving a junior engineer access to the stack instead of
            describing it from memory.
          </li>
        </ul>
        <p>
          Time spent loading the right context is the highest-leverage move
          you can make. It&apos;s also the most boring one, which is why
          it&apos;s underused.
        </p>
      </Lever>

      <div className={styles.synthesis}>
        <h3 className={styles.synthesisHeading}>
          <span className={styles.synthesisSymbol} aria-hidden='true'>
            ✦
          </span>
          Putting it all together
        </h3>
        <p>
          Treat the output as something you partially authored. Whatever came
          back, you were part of why it came back that way. When something
          feels off, walk through the levers and find the one you didn&apos;t
          pull.
        </p>

        <DebugChecklist />

        <p>
          Prompting and context management aren&apos;t gimmicks. They&apos;re
          real skills with as much depth as anything else in the craft
          &mdash; closer to chess than to magic words.
        </p>
      </div>
    </ChapterBody>
  )
}

export function TreeContent() {
  return (
    <ChapterBody>
      <p>
        Coding work isn&apos;t flat. Every change lives somewhere on a 2D map
        &mdash; across the surface area of your codebase (<em>breadth</em>),
        and at some level of abstraction (<em>depth</em>). At any point on
        that map, you have three moves you can make: <strong>ask</strong>,{' '}
        <strong>plan</strong>, or <strong>delegate</strong>.
      </p>

      <TreeDemo />

      <p>
        Prompting, at its simplest, is navigating this tree. The axes are
        mostly given by the task &mdash; the interesting choice is which of
        the three moves you make.
      </p>

      <Lever name='ASK' tagline="When you don't know yet.">
        <p>
          Use <strong>Ask</strong> when you need to understand something
          before you act. It&apos;s the cheapest move &mdash; a few seconds
          and a few tokens to widen what you know.
        </p>
        <ExamplePrompt
          note='From a real session. The repro and the trace did most of the work.'
          text={`The middleware in apps/api/src/auth/check.ts is intermittently returning 401 in staging — about 1 in 30 requests. Trace attached. I see the call to verifyToken returns null but the function looks idempotent to me. What am I missing?`}
        />
        <p>
          The classic failure is asking too narrowly. You phrase the question
          around what you <em>think</em> the issue is; the model answers that
          question, confidently; you walk away with a clean, wrong answer.
          The fix is to include what&apos;s actually happening, not what
          you&apos;ve decided is the problem. Paste the error. Show the file.
          Describe the symptom before you propose the cause.
        </p>
      </Lever>

      <Lever name='PLAN' tagline='When you know roughly what, but not how.'>
        <p>
          <strong>Plan</strong> pays for itself the most often. The model
          proposes an approach; you push back on bad assumptions; you
          converge; <em>then</em> code gets written. Much cheaper to revise a
          paragraph than a refactor.
        </p>
        <ExamplePrompt
          note='Cross-cutting change with multiple plausible approaches. Plan first, code later.'
          text={`I want to migrate our notification logic out of the request handlers into a queue. Don't write code yet — propose 2–3 approaches, then pick one and explain the trade-offs. Constraints: must keep delivery semantics at-least-once, must not block API responses, can use the existing Redis instance.`}
        />
        <p>
          The trap is treating the first plan as binding. The model will
          commit to whatever it proposed first unless you push back. Treat
          the first plan as a draft and make it argue for the choices
          you&apos;re skeptical of.
        </p>
      </Lever>

      <Lever
        name='DELEGATE'
        tagline='When the path is clear and you can verify the result.'
      >
        <p>
          <strong>Delegate</strong> works for bug fixes with a clear repro,
          mechanical refactors, boilerplate, tests for known behavior &mdash;
          anything well-scoped and easy to grade.
        </p>
        <ExamplePrompt
          note='Narrow scope, obvious success criteria. Easy to verify.'
          text={`In components/ui/Button.tsx, add a 'loading' boolean prop. When true, disable the button and show a small spinner to the left of the children. Use the existing Spinner component from components/ui/Spinner. Don't change the public API otherwise. Update the stories in Button.stories.tsx to cover the new state.`}
        />
        <p>
          It works badly the moment any of that breaks: the task touches
          taste (UX, copy, naming), the change is cross-cutting, or you
          can&apos;t easily tell whether the result is right. Don&apos;t
          delegate what you can&apos;t grade. The discipline is bounding the
          blast radius first &mdash; smaller diffs, narrower scope, clearer
          success criteria.
        </p>
      </Lever>

      <div className={styles.synthesis}>
        <h3 className={styles.synthesisHeading}>
          <span className={styles.synthesisSymbol} aria-hidden='true'>
            ✦
          </span>
          Choosing your move
        </h3>
        <p>A few heuristics for picking the right square:</p>
        <ul className={styles.axisList}>
          <li>
            <strong>Start broad, end specific.</strong> Most non-trivial work
            moves through all three: ask to understand the shape, plan to
            commit to an approach, delegate to land the change. Skipping a
            step shows up as rework two prompts later.
          </li>
          <li>
            <strong>If you&apos;re burning loops, zoom out.</strong>{' '}
            Delegate-reject-reprompt cycles are almost always a context
            problem, not a model problem. The cell you&apos;re in is wrong
            &mdash; move up the tree.
          </li>
          <li>
            <strong>
              The most expensive prompts are the ones in the wrong cell.
            </strong>{' '}
            Delegating something that needed a plan. Asking about something
            you should have just done. Calibration is most of the skill.
          </li>
        </ul>
      </div>
    </ChapterBody>
  )
}

export function ColleagueContent() {
  return (
    <ChapterBody>
      <p>
        The most useful mental shift I&apos;ve found is treating the agent as
        a <em>colleague</em> &mdash; specifically, a fast, knowledgeable,
        infinitely patient junior who has only seen what you&apos;ve shown
        them and forgets between sessions.
      </p>

      <p>
        Once you internalize that, a lot of what looks like prompt
        engineering starts looking like the things you&apos;d already do for
        a teammate: onboard them with the right docs, brief them before each
        task, pair through ambiguity, review their work before merging.
      </p>

      <ColleagueDemo />

      <p>
        Same task, same model &mdash; what changes is how much the colleague
        was set up to succeed. The asymmetry between what <em>you</em> can
        see and what <em>they</em> can see is where most of the leverage
        lives.
      </p>

      <Lever
        name='ONBOARDING'
        tagline='Set them up before the work starts.'
      >
        <p>
          Skills, project rules, conventions, examples &mdash; the same
          materials a new hire gets. What to use, what not to, where things
          live, what good looks like in this codebase.
        </p>
        <p>
          Most of this lives in a <code>CLAUDE.md</code> or{' '}
          <code>.cursorrules</code> at the project root. It&apos;s the
          longest-leverage thing you can write, because the agent reads it on
          every task. A useful rules file says things like:
        </p>
        <ul className={styles.axisList}>
          <li>Use Tailwind classes; don&apos;t inline styles.</li>
          <li>
            Tests go next to source files, not in a{' '}
            <code>__tests__/</code> folder.
          </li>
          <li>
            No <code>any</code>. Use the narrow types from{' '}
            <code>lib/types.ts</code>.
          </li>
          <li>
            When unsure about UI, link to a similar component in{' '}
            <code>components/</code>.
          </li>
        </ul>
        <p>
          The same paragraph that gets a new hire from &quot;lost&quot; to
          &quot;useful&quot; in a week does the same for the agent.
        </p>
      </Lever>

      <Lever name='BRIEFING' tagline='Every task starts with context.'>
        <p>
          Onboarding is general. Briefing is per-task &mdash; what this
          specific piece of work is, which files matter, what good looks
          like, what to avoid.
        </p>
        <p>
          The mistake is starting cold every time: &quot;fix the auth
          bug.&quot; A colleague would ask &quot;which auth bug? where? what
          changed recently?&quot; and you&apos;d answer. Just include the
          answers up front.
        </p>
        <p>
          The longer the task, the more the briefing pays back. Five extra
          minutes of setup saves 30 minutes of clarifying turns later.
        </p>
      </Lever>

      <Lever
        name='REVIEWING'
        tagline='The diff is a proposal, not an answer.'
      >
        <p>
          The output is a proposal. Same as a colleague&apos;s PR &mdash; not
          the final answer, your job to evaluate. Read the diff. Run the
          code. Check the cases you&apos;d check on a junior&apos;s PR.
        </p>
        <p>
          Don&apos;t accept what you can&apos;t verify. If you can&apos;t
          tell whether the result is right, that&apos;s a signal that the
          task needed to be smaller, or that the agent needed more context.
        </p>
        <p>
          The &quot;rubber-stamp&quot; failure mode &mdash; clicking accept
          on long diffs &mdash; is where mistakes compound. Treat agent
          output the way you&apos;d treat a teammate&apos;s: assume something
          subtle is probably wrong, and look for it before merging.
        </p>
      </Lever>

      <div className={styles.synthesis}>
        <h3 className={styles.synthesisHeading}>
          <span className={styles.synthesisSymbol} aria-hidden='true'>
            ✦
          </span>
          Working <em>with</em> vs. working <em>through</em>
        </h3>
        <p>
          There&apos;s a difference between treating the agent as a tool you
          operate (input, output, hope) and a colleague you work with (set
          up, brief, pair, review). The first scales until it doesn&apos;t.
          The second compounds.
        </p>
        <p>
          The first frame asks <em>&quot;what should I prompt?&quot;</em> The
          second asks{' '}
          <em>&quot;what does this person need to be successful?&quot;</em>{' '}
          Most of the time, that second question is the better one to be
          asking.
        </p>
        <p>
          The discipline gets <em>more</em> important, not less, as the
          models get smarter. As the agent&apos;s ceiling rises, the gap
          between people who treat it as a colleague and people who treat it
          as a tool widens. Better to start practicing now.
        </p>
      </div>
    </ChapterBody>
  )
}

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

export function RecapContent() {
  return (
    <ChapterBody>
      <p>
        Five reminders before you go. Skim this on the way out, or save it
        for later when something feels off.
      </p>

      <RecapItem index={1} title='The equation' href='/prompting/equation'>
        <RecapEquationViz />
        <p>
          When the output disappoints, walk the four levers. Better tool.
          Better model. Better prompt. Better context. The biggest unlock
          is almost always context.
        </p>
      </RecapItem>

      <RecapItem index={2} title='The tree' href='/prompting/tree'>
        <RecapTreeViz />
        <p>
          Every change lives somewhere on a 2D map: <em>breadth</em> (which
          area of code) × <em>depth</em> (how zoomed in). At any node,
          three moves: <strong>ask</strong>, <strong>plan</strong>,{' '}
          <strong>delegate</strong>. Most non-trivial work moves through
          all three.
        </p>
      </RecapItem>

      <RecapItem
        index={3}
        title='The colleague'
        href='/prompting/colleague'
      >
        <RecapColleagueViz />
        <p>
          Treat the agent as a colleague &mdash; a fast, knowledgeable
          junior who only sees what you&apos;ve shown them. The discipline
          gets <em>more</em> important, not less, as the models get
          smarter.
        </p>
      </RecapItem>

      <RecapItem
        index={4}
        title='Techniques'
        href='/prompting/techniques'
      >
        <p className={styles.recapTechniquesIntro}>
          Eight moves worth practicing &mdash;
        </p>
        <ul className={styles.recapList}>
          <li>What questions should you ask me before starting?</li>
          <li>What&apos;s the smallest version of this that ships?</li>
          <li>Give me 3 options, rank them, name the trade-offs.</li>
          <li>Argue against your last suggestion.</li>
          <li>What did you skip?</li>
          <li>How would a senior engineer review this?</li>
          <li>
            Match the style of <code>components/PostCard.tsx</code>.
          </li>
          <li>Update CLAUDE.md with what you just learned.</li>
        </ul>
      </RecapItem>

      <div className={styles.synthesis}>
        <h3 className={styles.synthesisHeading}>
          <span className={styles.synthesisSymbol} aria-hidden='true'>
            ✦
          </span>
          One more thing
        </h3>
        <p>
          We&apos;re all early in this. Three years in. Maybe 1200 ELO. The
          next 1200 is wide open &mdash; and the most useful thing you can
          do is keep paying attention while everyone else assumes
          they&apos;ve figured it out.
        </p>
        <p>
          Thanks for reading. Go talk to a machine.
        </p>
      </div>
    </ChapterBody>
  )
}

function RecapItem({
  index,
  title,
  href,
  children
}: {
  index: number
  title: string
  href: string
  children: React.ReactNode
}) {
  return (
    <section className={styles.recapItem}>
      <header className={styles.recapHeader}>
        <span className={styles.recapIndex} aria-hidden='true'>
          {String(index).padStart(2, '0')}
        </span>
        <Link href={href} className={styles.recapTitle}>
          {title}
          <span className={styles.recapTitleArrow} aria-hidden='true'>
            →
          </span>
        </Link>
      </header>
      <div className={styles.recapBody}>{children}</div>
    </section>
  )
}

function RecapEquationViz() {
  return (
    <div className={styles.recapEquationViz} aria-hidden='true'>
      <Group>
        <Bracket>(</Bracket>
        <span className={`${styles.recapToken} ${styles.recapTokenLever}`}>
          TOOL
        </span>
        <Op subtle>+</Op>
        <span className={`${styles.recapToken} ${styles.recapTokenLever}`}>
          MODEL
        </span>
        <Bracket>)</Bracket>
      </Group>
      <Op>×</Op>
      <Group>
        <Bracket>(</Bracket>
        <span className={`${styles.recapToken} ${styles.recapTokenLever}`}>
          PROMPT
        </span>
        <Op subtle>+</Op>
        <span className={`${styles.recapToken} ${styles.recapTokenLever}`}>
          CONTEXT
        </span>
        <Bracket>)</Bracket>
      </Group>
      <Op>→</Op>
      <span className={`${styles.recapToken} ${styles.recapTokenOutput}`}>
        OUTPUT
      </span>
    </div>
  )
}

function RecapTreeViz() {
  // 4 columns × 3 rows. The (mid · UX) cell is "active"; cells on either
  // axis get a faint tint to evoke the crosshair from the tree demo.
  const ROWS = 3
  const COLS = 4
  const ACTIVE = { row: 1, col: 0 }

  return (
    <div className={styles.recapTreeViz} aria-hidden='true'>
      <div className={styles.recapTreeGrid}>
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((__, c) => {
            const isActive = r === ACTIVE.row && c === ACTIVE.col
            const onAxis =
              !isActive && (r === ACTIVE.row || c === ACTIVE.col)
            return (
              <span
                key={`${r}-${c}`}
                className={`${styles.recapTreeCell} ${isActive ? styles.recapTreeCellActive : ''} ${onAxis ? styles.recapTreeCellOnAxis : ''}`}
              />
            )
          })
        )}
      </div>
      <div className={styles.recapTreeMoves}>
        <span>ask</span>
        <span className={styles.recapTreeMovesActive}>plan</span>
        <span>delegate</span>
      </div>
    </div>
  )
}

function RecapColleagueViz() {
  return (
    <div className={styles.recapColleagueViz} aria-hidden='true'>
      <span className={styles.recapColleagueStep}>Onboard</span>
      <span className={styles.recapColleagueArrow}>→</span>
      <span className={styles.recapColleagueStep}>Brief</span>
      <span className={styles.recapColleagueArrow}>→</span>
      <span className={styles.recapColleagueStep}>Review</span>
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

// ============================================================================
// useInView — IntersectionObserver hook used by EquationDemo
// ============================================================================

function useInView<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = React.useRef<T>(null)
  const [inView, setInView] = React.useState(false)
  const optsRef = React.useRef(opts)
  optsRef.current = opts

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3, ...optsRef.current }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, inView] as const
}

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

function EquationDemo() {
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

function Token({
  children,
  kind
}: {
  children: React.ReactNode
  kind?: 'agent' | 'input' | 'output'
}) {
  return <span className={`${styles.token} ${styles[`token_${kind}`] ?? ''}`}>{children}</span>
}

function Op({ children, subtle }: { children?: React.ReactNode; subtle?: boolean }) {
  return (
    <span className={`${styles.op} ${subtle ? styles.opSubtle : ''}`} aria-hidden='true'>
      {children ?? ''}
    </span>
  )
}

function Bracket({ children }: { children: React.ReactNode }) {
  return <span className={styles.bracket}>{children}</span>
}

function Group({ children }: { children: React.ReactNode }) {
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

function ExamplePrompt({ note, text }: { note: string; text: string }) {
  return (
    <figure className={styles.examplePrompt}>
      <div className={styles.examplePromptCard}>
        <span className={styles.examplePromptLabel}>From the wild</span>
        <p className={styles.examplePromptText}>{text}</p>
      </div>
      <figcaption className={styles.examplePromptNote}>{note}</figcaption>
    </figure>
  )
}

function Lever({
  name,
  tagline,
  children
}: {
  name: string
  tagline: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.leverSection}>
      <div className={styles.leverHeading}>
        <span className={styles.leverHeadingName}>{name}</span>
        <span className={styles.leverHeadingDivider} aria-hidden='true' />
        <span className={styles.leverHeadingTagline}>{tagline}</span>
      </div>
      <div className={styles.leverBody}>{children}</div>
    </div>
  )
}

function AskIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M7.9 20A9 9 0 1 0 4 16.1L2 22z' />
      <path d='M9.1 9a3 3 0 1 1 5.4 1.8c-.6.8-1.5 1.2-1.5 2.2' />
      <path d='M12 17h.01' />
    </svg>
  )
}

function PlanIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M8 6h13' />
      <path d='M8 12h13' />
      <path d='M8 18h13' />
      <circle cx='4' cy='6' r='1' />
      <circle cx='4' cy='12' r='1' />
      <circle cx='4' cy='18' r='1' />
    </svg>
  )
}

function DelegateIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M5 12h14' />
      <path d='m13 6 6 6-6 6' />
      <path d='M3 6v12' />
    </svg>
  )
}

function ReplayIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M3 12a9 9 0 1 0 3-6.7' />
      <path d='M3 4v5h5' />
    </svg>
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

function DebugChecklist() {
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

// ============================================================================
// Mental Model 2 — tree
// ============================================================================

type Area = 'ux' | 'perf' | 'debug' | 'arch'
type Depth = 'high' | 'mid' | 'low'
type Action = 'ask' | 'plan' | 'delegate'

const AREAS: Array<{ id: Area; label: string }> = [
  { id: 'ux', label: 'UX' },
  { id: 'perf', label: 'Performance' },
  { id: 'debug', label: 'Debugging' },
  { id: 'arch', label: 'Architecture' }
]

const DEPTHS: Array<{ id: Depth; label: string; hint: string }> = [
  { id: 'high', label: 'High', hint: 'the overall feel' },
  { id: 'mid', label: 'Mid', hint: 'a component or flow' },
  { id: 'low', label: 'Low', hint: 'one specific line' }
]

const ACTIONS: Array<{
  id: Action
  label: string
  verb: string
  Icon: React.FC
}> = [
  { id: 'ask', label: 'Ask', verb: 'pull info back', Icon: AskIcon },
  { id: 'plan', label: 'Plan', verb: 'get a strategy', Icon: PlanIcon },
  { id: 'delegate', label: 'Delegate', verb: 'hand it off', Icon: DelegateIcon }
]

const PROMPTS: Record<Area, Record<Depth, Record<Action, string>>> = {
  ux: {
    high: {
      ask: 'What feels off about this whole page?',
      plan: 'How would you make this flow feel more polished — what should I do first?',
      delegate: 'Make this page prettier.'
    },
    mid: {
      ask: 'Why does the card hierarchy feel cluttered?',
      plan: 'Plan a redesign of the card component for better scannability.',
      delegate: 'Tighten the card spacing and visual weight.'
    },
    low: {
      ask: 'Why does the radius on these buttons look off?',
      plan: 'Walk me through a sensible radius and shadow for these buttons.',
      delegate: 'Set the buttons to border-radius 16px.'
    }
  },
  perf: {
    high: {
      ask: 'Where is time being spent on first paint?',
      plan: 'Plan an attack on first-paint, biggest wins first.',
      delegate: 'Cut first-paint time. Start with the heaviest hitters.'
    },
    mid: {
      ask: 'Why is this list re-rendering on every keystroke?',
      plan: 'Plan how to memoize this list without breaking selection.',
      delegate: 'Memoize this list. Verify selection still works.'
    },
    low: {
      ask: 'Why is this useEffect firing twice?',
      plan: 'How should I fix this useEffect double-fire safely?',
      delegate: 'Fix the dependency array on this useEffect.'
    }
  },
  debug: {
    high: {
      ask: 'What is most likely breaking in this checkout flow?',
      plan: 'Plan a triage approach for the failing checkout flow.',
      delegate: 'Get checkout green again.'
    },
    mid: {
      ask: 'Why is this auth middleware sometimes returning 401?',
      plan: 'Plan how to reproduce this auth flake locally.',
      delegate: 'Find and fix the intermittent 401 in auth.'
    },
    low: {
      ask: 'Why is this regex not matching trailing newlines?',
      plan: 'How should I update this regex to match trailing newlines safely?',
      delegate: 'Fix this regex to match trailing newlines.'
    }
  },
  arch: {
    high: {
      ask: "Where is this codebase heading that it isn't yet?",
      plan: 'Plan how to split this into clear modules.',
      delegate: 'Restructure this into clear modules. Propose, then do.'
    },
    mid: {
      ask: 'Should this state live in context or be lifted?',
      plan: 'Plan the migration of this slice from local state to a store.',
      delegate: 'Move this state into the store and update consumers.'
    },
    low: {
      ask: "Why does this file import three things from utils.ts that aren't used?",
      plan: 'Plan the cleanup of unused imports across this file.',
      delegate: 'Remove unused imports in this file.'
    }
  }
}

const TOUR: Array<{ area: Area; depth: Depth; action: Action }> = [
  { area: 'ux', depth: 'high', action: 'delegate' },
  { area: 'ux', depth: 'low', action: 'delegate' },
  { area: 'perf', depth: 'mid', action: 'plan' },
  { area: 'debug', depth: 'low', action: 'ask' },
  { area: 'arch', depth: 'high', action: 'plan' }
]

/* ─────────────────────────────────────────────────────────
 * TREE DEMO INTERACTION
 *
 *    Coordinate state lives at the parent: { area, depth, action }
 *    Hover a cell  →  preview-update area + depth (no lock)
 *    Click a cell  →  same as hover but stops the running tour
 *    Action chip   →  swaps the verb on the generated prompt
 *
 *    Tour mode: when started, advances through TOUR every 1700ms,
 *    cycling through area/depth/action triples. Any user
 *    interaction (chip click, cell click, button click) stops it.
 * ───────────────────────────────────────────────────────── */

function TreeDemo() {
  const [area, setArea] = React.useState<Area>('ux')
  const [depth, setDepth] = React.useState<Depth>('mid')
  const [action, setAction] = React.useState<Action>('ask')
  const [touring, setTouring] = React.useState(false)
  const tourRef = React.useRef<number | null>(null)

  const stopTour = React.useCallback(() => {
    if (tourRef.current != null) {
      window.clearTimeout(tourRef.current)
      tourRef.current = null
    }
    setTouring(false)
  }, [])

  React.useEffect(() => stopTour, [stopTour])

  const startTour = () => {
    if (touring) {
      stopTour()
      return
    }
    setTouring(true)
    let i = 0
    const step = () => {
      const next = TOUR[i % TOUR.length]!
      setArea(next.area)
      setDepth(next.depth)
      setAction(next.action)
      i += 1
      tourRef.current = window.setTimeout(step, 1700)
    }
    step()
  }

  const prompt = PROMPTS[area][depth][action]
  const promptKey = `${area}-${depth}-${action}`

  return (
    <div className={styles.tree}>
      <div className={styles.treeActions} role='tablist' aria-label='Action'>
        {ACTIONS.map((a) => {
          const active = action === a.id
          const Icon = a.Icon
          return (
            <button
              key={a.id}
              type='button'
              role='tab'
              aria-selected={active}
              className={`${styles.treeActionButton} ${active ? styles.treeActionActive : ''}`}
              onClick={() => {
                if (touring) stopTour()
                setAction(a.id)
              }}
            >
              <span className={styles.treeActionIcon} aria-hidden='true'>
                <Icon />
              </span>
              <span className={styles.treeActionText}>
                <span className={styles.treeActionLabel}>{a.label}</span>
                <span className={styles.treeActionVerb}>{a.verb}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className={styles.treeGridWrap}>
        <div className={styles.treeGrid} role='grid'>
          <div />
          {AREAS.map((a) => (
            <div
              key={a.id}
              className={`${styles.treeColLabel} ${a.id === area ? styles.treeAxisActive : ''}`}
            >
              {a.label}
            </div>
          ))}
          {DEPTHS.map((d) => (
            <React.Fragment key={d.id}>
              <div
                className={`${styles.treeRowLabel} ${d.id === depth ? styles.treeAxisActive : ''}`}
              >
                <span className={styles.treeRowLabelText}>{d.label}</span>
                <span className={styles.treeRowLabelHint}>{d.hint}</span>
              </div>
              {AREAS.map((a) => {
                const active = area === a.id && depth === d.id
                const onAxis = area === a.id || depth === d.id
                return (
                  <button
                    key={`${a.id}-${d.id}`}
                    type='button'
                    role='gridcell'
                    aria-selected={active}
                    className={`${styles.treeCell} ${active ? styles.treeCellActive : ''} ${
                      !active && onAxis ? styles.treeCellOnAxis : ''
                    }`}
                    onClick={() => {
                      if (touring) stopTour()
                      setArea(a.id)
                      setDepth(d.id)
                    }}
                    onMouseEnter={() => {
                      if (touring) return
                      setArea(a.id)
                      setDepth(d.id)
                    }}
                    aria-label={`${a.label} · ${d.label}`}
                  >
                    <span className={styles.treeCellDot} aria-hidden='true' />
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className={styles.treeOutputCard}>
        <div className={styles.treeOutputHeader}>
          <span className={styles.treeOutputLabel}>Generated prompt</span>
          <span className={styles.treeOutputCoord}>
            {AREAS.find((a) => a.id === area)?.label} ·{' '}
            {DEPTHS.find((d) => d.id === depth)?.label} ·{' '}
            {ACTIONS.find((a) => a.id === action)?.label}
          </span>
        </div>
        <div className={styles.treeOutputBody}>
          <p key={promptKey} className={styles.treeOutputText}>
            {prompt}
          </p>
        </div>
      </div>

      <button
        type='button'
        className={`${styles.treeTour} ${touring ? styles.treeTourActive : ''}`}
        onClick={startTour}
      >
        {touring ? 'Stop tour' : 'Take a tour'}{' '}
        <span aria-hidden='true'>{touring ? '■' : '→'}</span>
      </button>
    </div>
  )
}

// ============================================================================
// Mental Model 3 — colleague
// ============================================================================

const SHARE_OPTIONS: Array<{
  id: 'file' | 'screenshot' | 'rules' | 'history'
  label: string
  Icon: React.FC
}> = [
  { id: 'file', label: 'The relevant file', Icon: ShareFileIcon },
  { id: 'screenshot', label: 'A screenshot', Icon: ShareImageIcon },
  { id: 'rules', label: 'Project rules', Icon: ShareRulesIcon },
  { id: 'history', label: 'Recent PRs', Icon: ShareHistoryIcon }
]

type ShareKey = (typeof SHARE_OPTIONS)[number]['id']

const COLLEAGUE_TASK = 'Why is this list slow when typing?'

const COLLEAGUE_BASE =
  "I'd need more to go on. Slow lists during typing usually trace back to re-renders, large unfiltered datasets, or per-render allocations — but without seeing the code, I'd just be guessing."

const COLLEAGUE_SEGMENTS: Record<ShareKey, string> = {
  file: 'Looking at the file: <List> creates a fresh callback inside .map() on every render, which breaks child memoization on every keystroke.',
  screenshot:
    'The screenshot shows roughly 12k rows on screen at once — combined with the callback churn, that explains the typing stutter.',
  rules:
    'Your project rules call for react-window on lists over 200 items. The cleanest fix is wrapping this list in <FixedSizeList>.',
  history:
    'Last quarter, PR #1842 quietly removed the previous virtualization. Restoring that pattern + memoizing the callback should bring perf back to where it was.'
}

/* ─────────────────────────────────────────────────────────
 * COLLEAGUE DEMO INTERACTION
 *
 *    Static "you ask" question at the top.
 *    Four toggleable share-chips (file, screenshot, rules, history).
 *
 *    Response panel:
 *      no chips on   →  generic guess (italic, dimmed)
 *      any chip on   →  segments concatenate in chip-order
 *
 *    Each toggle re-keys the response so it remounts and re-fires
 *    the colleagueFade keyframe (320ms blur-up).
 * ───────────────────────────────────────────────────────── */

function ColleagueDemo() {
  const [shared, setShared] = React.useState<Record<ShareKey, boolean>>({
    file: false,
    screenshot: false,
    rules: false,
    history: false
  })

  const sharedKeys = SHARE_OPTIONS.filter((o) => shared[o.id]).map((o) => o.id)
  const segments = sharedKeys.map((k) => COLLEAGUE_SEGMENTS[k])
  const responseKey = sharedKeys.length === 0 ? 'base' : sharedKeys.join('+')

  return (
    <div className={styles.colleague}>
      <div className={styles.colleagueTask}>
        <span className={styles.colleagueTaskLabel}>You ask</span>
        <p className={styles.colleagueTaskText}>{COLLEAGUE_TASK}</p>
      </div>

      <div className={styles.colleagueShare}>
        <span className={styles.colleagueShareLabel}>Share with them</span>
        <div className={styles.colleagueShareChips}>
          {SHARE_OPTIONS.map((opt) => {
            const on = shared[opt.id]
            const Icon = opt.Icon
            return (
              <button
                key={opt.id}
                type='button'
                className={`${styles.colleagueChip} ${on ? styles.colleagueChipOn : ''}`}
                onClick={() =>
                  setShared((prev) => ({ ...prev, [opt.id]: !prev[opt.id] }))
                }
                aria-pressed={on}
              >
                <span className={styles.colleagueChipIcon} aria-hidden='true'>
                  <Icon />
                </span>
                <span>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.colleagueResponse}>
        <span className={styles.colleagueResponseLabel}>They reply</span>
        <div key={responseKey} className={styles.colleagueResponseBody}>
          {segments.length === 0 ? (
            <p className={styles.colleagueResponseDim}>{COLLEAGUE_BASE}</p>
          ) : (
            segments.map((seg, i) => (
              <p key={i} className={styles.colleagueResponseText}>
                {seg}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function ShareFileIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
      <path d='M14 2v6h6' />
    </svg>
  )
}

function ShareImageIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
      <circle cx='9' cy='9' r='2' />
      <path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' />
    </svg>
  )
}

function ShareRulesIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M9 11l3 3 8-8' />
      <path d='M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9' />
    </svg>
  )
}

function ShareHistoryIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M3 12a9 9 0 1 0 3-6.7' />
      <path d='M3 4v5h5' />
      <path d='M12 7v5l3 2' />
    </svg>
  )
}

// ============================================================================
// Misc icons
// ============================================================================

function SparkleIcon() {
  return (
    <svg
      className={styles.sparkle}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      <path
        className={styles.sparkleCore}
        d='M12 2 L13.6 9.2 C13.85 10.3 14.7 11.15 15.8 11.4 L23 13 L15.8 14.6 C14.7 14.85 13.85 15.7 13.6 16.8 L12 24 L10.4 16.8 C10.15 15.7 9.3 14.85 8.2 14.6 L1 13 L8.2 11.4 C9.3 11.15 10.15 10.3 10.4 9.2 Z'
      />
      <path
        className={styles.sparkleAccent}
        d='M19 3 L19.6 5.6 C19.7 6 20 6.3 20.4 6.4 L23 7 L20.4 7.6 C20 7.7 19.7 8 19.6 8.4 L19 11 L18.4 8.4 C18.3 8 18 7.7 17.6 7.6 L15 7 L17.6 6.4 C18 6.3 18.3 6 18.4 5.6 Z'
      />
    </svg>
  )
}
