import * as React from 'react'

import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

import {
  AUTO_PROMPT,
  AUTO_TYPE_CHAR_MS,
  AUTO_TYPE_INITIAL_DELAY_MS,
  AUTO_TYPE_SEND_DELAY_MS,
  ERROR_MESSAGES,
  FAKE_MODELS
} from './constants'
import { ChevronIcon, ReplayIcon } from './icons'

import styles from './PromptingPage.module.css'

/* ─────────────────────────────────────────────────────────
 * PROMPT INPUT STORYBOARD
 *
 *    0ms   waits for parent to flip `start` (after title reveals)
 * 1400ms   begins typing "Center this div" (70ms/char ≈ 1.2s)
 * 2700ms   pause on the completed sentence
 * 3300ms   auto-fires Send → error appears, card shakes
 *           Send button swaps in to the Replay button (cross-fade)
 *
 *  user types again        →  error clears, Send returns
 *  user clicks Replay      →  re-runs the whole sequence
 *  prefers-reduced-motion  →  fills value instantly, sends after 250ms
 * ───────────────────────────────────────────────────────── */

export function PromptInputDemo({ start }: { start: boolean }) {
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
