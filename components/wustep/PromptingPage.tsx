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

export function PromptingPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [hasMounted, setHasMounted] = React.useState(false)
  const [revealed, setRevealed] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

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
              It's 2026, and more and more of coding looks like this:
            </p>

            <div className={styles.bodyItem} style={bodyDelay(1)}>
              <PromptInputDemo />
            </div>

            <p className={styles.bodyItem} style={bodyDelay(2)}>
              You don't write code so much as describe what you want and watch
              it appear. Less typing semicolons; more describing intent.
              Engineering, increasingly, is the act of talking to machines.
            </p>

            <p className={styles.bodyItem} style={bodyDelay(3)}>
             So here's the question: what does it mean to be good at talking to Claude, Codex, or whatever model comes next?
            </p>
          </div>
        </main>
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

function PromptInputDemo() {
  const [value, setValue] = React.useState('')
  const [model, setModel] = React.useState(FAKE_MODELS[0]!)
  const [open, setOpen] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [shakeKey, setShakeKey] = React.useState(0)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const handleSend = () => {
    if (value.trim().length === 0) return
    const next =
      ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]!
    setError(next)
    setShakeKey((k) => k + 1)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    if (error) setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

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
      <textarea
        className={styles.promptInput}
        placeholder='What would you like to build today?'
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={2}
        spellCheck={false}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'prompt-error' : undefined}
      />

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
          className={styles.submitButton}
          aria-label='Send'
          onClick={handleSend}
          disabled={value.trim().length === 0 || !!error}
        >
          <ArrowUpIcon />
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
