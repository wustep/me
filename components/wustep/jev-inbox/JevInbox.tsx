'use client'

import { Play, RotateCcw, Shuffle, SlidersHorizontal } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { gmailBase64UrlToUtf8, senderName } from './gmail'
import styles from './JevInbox.module.css'
import { cloneInbox, INBOX_SEED } from './messages'
import {
  cloneSettings,
  DEFAULT_REASON_SETTINGS,
  jitterActivations,
  mulberry32,
  REASON_CATALOG,
  shuffleInPlace,
  triageItem
} from './triage'
import {
  type InboxItem,
  REASON_IDS,
  type ReasonId,
  type ReasonSettings,
  TRIAGE_ACTIONS,
  type TriageAction,
  type TriageResult
} from './types'

const JEV_POST =
  'https://typesafe.ai/blog/introducing-system-one-models-and-jev'

const PULL_COLOR: Record<TriageAction, string> = {
  Delete: 'var(--delete)',
  Review: 'var(--review)',
  Leave: 'var(--leave)'
}

type Filter = 'all' | TriageAction

type RowModel = {
  item: InboxItem
  result: TriageResult
  override: TriageAction | undefined
  shown: TriageAction
}

function pct(value: number): string {
  return `${Math.round(value * 100)}`
}

function ConfidenceTriad({
  scores,
  pending
}: {
  scores: TriageResult['scores']
  pending: boolean
}) {
  return (
    <div
      className={
        pending ? `${styles.triadBlock} ${styles.pending}` : styles.triadBlock
      }
    >
      {TRIAGE_ACTIONS.map((action) => (
        <div key={action} className={styles.meter}>
          <span className={styles.meterLabel}>{action}</span>
          <span className={styles.meterTrack}>
            <span
              className={styles.meterFill}
              data-action={action}
              style={{
                transform: `scaleX(${pending ? 0.08 : scores[action]})`
              }}
            />
          </span>
          <span className={styles.meterVal}>
            {pending ? '—' : pct(scores[action])}
          </span>
        </div>
      ))}
    </div>
  )
}

export function JevInbox() {
  const [items, setItems] = useState<InboxItem[]>(() => cloneInbox())
  const [settings, setSettings] = useState<ReasonSettings>(() =>
    cloneSettings(DEFAULT_REASON_SETTINGS)
  )
  const [overrides, setOverrides] = useState<Record<string, TriageAction>>({})
  const [filter, setFilter] = useState<Filter>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(0)
  const [running, setRunning] = useState(true)
  const [seed, setSeed] = useState(1)

  useEffect(() => {
    if (!running) return
    if (revealed >= items.length) {
      setRunning(false)
      return
    }
    const timer = window.setTimeout(() => {
      setRevealed((n) => n + 1)
    }, 48)
    return () => window.clearTimeout(timer)
  }, [running, revealed, items.length])

  const runAll = useCallback(() => {
    setRevealed(0)
    setRunning(true)
    setOverrides({})
  }, [])

  const reshuffle = useCallback(() => {
    const rng = mulberry32(seed * 997 + 13)
    const next = shuffleInPlace(
      cloneInbox(INBOX_SEED).map((entry) => ({
        message: entry.message,
        reasons: jitterActivations(entry.reasons, rng)
      })),
      rng
    )
    setItems(next)
    setSeed((n) => n + 1)
    setOverrides({})
    setExpanded(null)
    setRevealed(0)
    setRunning(true)
  }, [seed])

  const resetReasons = useCallback(() => {
    setSettings(cloneSettings(DEFAULT_REASON_SETTINGS))
  }, [])

  const rows: RowModel[] = useMemo(
    () =>
      items.map((item) => {
        const result = triageItem(item, settings)
        const override = overrides[item.message.id]
        return {
          item,
          result,
          override,
          shown: override ?? result.recommended
        }
      }),
    [items, settings, overrides]
  )

  const visible = rows.filter((row, index) => {
    if (index >= revealed) return filter === 'all'
    if (filter === 'all') return true
    return row.shown === filter
  })

  const counts = rows.reduce(
    (acc, row, index) => {
      if (index >= revealed) return acc
      acc[row.shown] += 1
      return acc
    },
    { Delete: 0, Review: 0, Leave: 0 } as Record<TriageAction, number>
  )

  const setWeight = (id: ReasonId, weight: number) => {
    setSettings((prev) => ({
      ...prev,
      [id]: { ...prev[id], weight }
    }))
  }

  const setEnabled = (id: ReasonId, enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [id]: { ...prev[id], enabled }
    }))
  }

  const overrideRow = (id: string, action: TriageAction) => {
    setOverrides((prev) => {
      if (prev[id] === action) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: action }
    })
  }

  return (
    <div className={styles.root}>
      <header className={styles.top}>
        <div className={styles.kicker}>
          <h2 className={styles.title}>Jev Inbox</h2>
          <span className={styles.stub}>Heuristic stub</span>
        </div>
        <p className={styles.lede}>
          <a href={JEV_POST} target='_blank' rel='noreferrer'>
            Jev
          </a>{' '}
          is a System One model: it returns a distribution, not a paragraph.
          Each message gets a Delete / Review / Leave confidence triad, driven
          by reason tags you can toggle and reweight. Sample data uses the real
          Gmail <code>users.messages</code> shape; the people are fictional.
        </p>
        <div className={styles.toolbar}>
          <button type='button' className={styles.btn} onClick={runAll}>
            <Play size={14} aria-hidden='true' />
            Run all
          </button>
          <button type='button' className={styles.btn} onClick={reshuffle}>
            <Shuffle size={14} aria-hidden='true' />
            Reshuffle
          </button>
          {(['all', ...TRIAGE_ACTIONS] as const).map((key) => (
            <button
              key={key}
              type='button'
              className={styles.filter}
              data-on={filter === key}
              onClick={() => setFilter(key)}
            >
              {key === 'all' ? 'All' : key}
            </button>
          ))}
          <div className={styles.counts} aria-live='polite'>
            <span className={styles.countDelete}>{counts.Delete} Delete</span>
            <span className={styles.countReview}>{counts.Review} Review</span>
            <span className={styles.countLeave}>{counts.Leave} Leave</span>
          </div>
        </div>
      </header>

      <div className={styles.frame}>
        <div className={styles.list} role='list'>
          {visible.length === 0 ? (
            <p className={styles.empty}>Nothing in this filter.</p>
          ) : (
            visible.map((row) => {
              const index = items.findIndex(
                (entry) => entry.message.id === row.item.message.id
              )
              const pending = index >= revealed
              return (
                <InboxRow
                  key={row.item.message.id}
                  row={row}
                  pending={pending}
                  open={expanded === row.item.message.id}
                  onToggle={() =>
                    setExpanded((id) =>
                      id === row.item.message.id ? null : row.item.message.id
                    )
                  }
                  onOverride={overrideRow}
                />
              )
            })
          )}
        </div>

        <aside className={styles.aside}>
          <div className={styles.kicker}>
            <h3 className={styles.asideTitle}>
              <SlidersHorizontal size={12} aria-hidden='true' /> Reasons
            </h3>
            <button
              type='button'
              className={styles.iconBtn}
              onClick={resetReasons}
            >
              <RotateCcw size={13} aria-hidden='true' />
              Reset
            </button>
          </div>
          <p className={styles.asideLede}>
            Closed tags with weights. Changing them recomputes the triad in code
            — the same composite-scoring pattern you’d use with live Jev Nouls.
          </p>
          <div className={styles.reasonList}>
            {REASON_IDS.map((id) => {
              const meta = REASON_CATALOG[id]
              const policy = settings[id]
              return (
                <label
                  key={id}
                  className={styles.reasonRow}
                  data-off={!policy.enabled}
                >
                  <input
                    className={styles.reasonToggle}
                    type='checkbox'
                    checked={policy.enabled}
                    onChange={(event) => setEnabled(id, event.target.checked)}
                  />
                  <span>
                    <span className={styles.reasonHead}>
                      <span className={styles.reasonLabel}>{meta.label}</span>
                      <span className={styles.reasonWeight}>
                        {policy.weight.toFixed(2)}
                      </span>
                    </span>
                    <span className={styles.reasonBlurb}>{meta.blurb}</span>
                    <span className={styles.pull} aria-hidden='true'>
                      {TRIAGE_ACTIONS.map((action) => (
                        <span key={action} className={styles.pullBar}>
                          <span
                            className={styles.pullFill}
                            data-action={action}
                            style={{
                              transform: `scaleX(${meta.pull[action]})`,
                              background: PULL_COLOR[action]
                            }}
                          />
                        </span>
                      ))}
                    </span>
                    <input
                      className={styles.weight}
                      type='range'
                      min='0'
                      max='2.4'
                      step='0.05'
                      value={policy.weight}
                      disabled={!policy.enabled}
                      onChange={(event) =>
                        setWeight(id, Number(event.target.value))
                      }
                      aria-label={`${meta.label} weight`}
                    />
                  </span>
                </label>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}

function InboxRow({
  row,
  pending,
  open,
  onToggle,
  onOverride
}: {
  row: RowModel
  pending: boolean
  open: boolean
  onToggle: () => void
  onOverride: (id: string, action: TriageAction) => void
}) {
  const message = row.item.message
  const unread = message.labelIds.includes('UNREAD')
  const topReasons = row.result.reasons
    .filter((reason) => reason.activation > 0.18 && reason.weight > 0)
    .slice(0, 4)

  const plainPart = message.payload.parts?.find(
    (part) => part.mimeType === 'text/plain'
  )
  const decoded = plainPart?.body?.data
    ? gmailBase64UrlToUtf8(plainPart.body.data)
    : message.plaintextBody

  return (
    <article
      className={styles.item}
      data-open={open}
      data-unread={unread}
      role='listitem'
    >
      <button type='button' className={styles.main} onClick={onToggle}>
        <div className={styles.meta}>
          <span className={styles.unreadDot} data-on={unread} />
          <span className={styles.from}>{senderName(message.sender)}</span>
          <span className={styles.date}>
            {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric'
            }).format(new Date(Number(message.internalDate)))}
          </span>
        </div>
        <p className={styles.subject}>{message.subject}</p>
        <p className={styles.snippet}>{message.snippet}</p>
        <div className={styles.chips}>
          {topReasons.map((reason) => (
            <span key={reason.id} className={styles.chip}>
              {REASON_CATALOG[reason.id].label}
            </span>
          ))}
        </div>
      </button>

      <div>
        <div className={styles.recRow}>
          <span className={styles.pill} data-action={row.shown}>
            {row.shown}
          </span>
          {row.override ? (
            <span className={styles.overridden}>
              override · Jev {row.result.recommended}{' '}
              {pct(row.result.scores[row.result.recommended])}%
            </span>
          ) : (
            <span className={styles.overridden}>
              {pending
                ? 'running…'
                : `${pct(row.result.choice.confidence)} certainty`}
            </span>
          )}
        </div>
        <ConfidenceTriad scores={row.result.scores} pending={pending} />
      </div>

      {open ? (
        <div className={styles.detail}>
          <div className={styles.body}>{decoded}</div>
          <div className={styles.actions}>
            {TRIAGE_ACTIONS.map((action) => (
              <button
                key={action}
                type='button'
                className={styles.actionBtn}
                data-action={action}
                data-on={row.override === action}
                onClick={() => onOverride(message.id, action)}
              >
                {action}
              </button>
            ))}
          </div>
          <dl className={styles.schema}>
            <dt>id / threadId</dt>
            <dd>
              {message.id} · {message.threadId}
            </dd>
            <dt>labelIds</dt>
            <dd>{message.labelIds.join(', ')}</dd>
            <dt>historyId · internalDate · sizeEstimate</dt>
            <dd>
              {message.historyId} · {message.internalDate} ·{' '}
              {message.sizeEstimate}
            </dd>
            <dt>payload.headers</dt>
            <dd>
              {message.payload.headers
                .map((h) => `${h.name}: ${h.value}`)
                .join(' · ')}
            </dd>
            <dt>payload.parts</dt>
            <dd>
              {(message.payload.parts ?? [])
                .map((part) => `${part.mimeType} (${part.body?.size ?? 0}b)`)
                .join(' · ')}
            </dd>
            <dt>flattened</dt>
            <dd>
              {message.sender} → {message.toRecipients.join(', ')} ·{' '}
              {message.date}
            </dd>
          </dl>
        </div>
      ) : null}
    </article>
  )
}
