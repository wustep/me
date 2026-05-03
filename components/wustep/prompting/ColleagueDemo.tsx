import * as React from 'react'

import styles from './PromptingPage.module.css'

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

export function ColleagueDemo() {
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
