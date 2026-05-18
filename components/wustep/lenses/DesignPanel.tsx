'use client'

import * as React from 'react'

import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './DesignPanel.module.css'
// Parameter schema + derived lookup tables live in a sibling file
// (pure data + types — no React imports) so it can grow without
// pushing this component further down.
import {
  NO_RANDOMIZE_IDS,
  type Param,
  PARAM_BY_ID,
  type ParamSlider,
  type Section,
  SECTIONS
} from './DesignPanel.schema'

/* =============================================================================
 * DesignPanel — a development-only "DialKit"-style panel for tweaking the
 * entire lenses page in real time.
 *
 *   The panel writes a flat record of values into CSS custom properties on
 *   the page root (set on `:root` so they cascade everywhere — canvas,
 *   side panel portal, dialog portal). Each property in the panel maps
 *   to one or more `--design-*` variables, which the LensesPage CSS
 *   reads with `var(--design-* , <fallback>)`. The fallback IS the
 *   current production value, so the panel never affects the page
 *   when it's collapsed/closed.
 *
 *   Some controls aren't expressible in pure CSS variables (e.g. "show
 *   illustrations in the dialog"). Those drive `data-design-*=value`
 *   attributes on the document root instead, with matching CSS
 *   selectors (`html[data-design-foo='off'] .x { ... }`) and JSX
 *   reads via the `useDesignFlag` hook for the rare cases that need
 *   to short-circuit rendering entirely.
 *
 *   State is persisted to localStorage so a tweak session survives a
 *   reload. A reset action restores defaults. Three preset slots let
 *   you save snapshots and recall them.
 *
 *   This is ONLY mounted in development (gated by `isDev` from
 *   `lib/config.ts`). Production users never see it, never download
 *   the JS, and never pay any runtime cost.
 * ========================================================================== */

const STORAGE_KEY = 'lenses:design-panel:v1'
const COLLAPSED_KEY = 'lenses:design-panel:collapsed:v1'
const SLOT_KEY = (n: number) => `lenses:design-panel:slot:${n}:v1`

/* ────────────────────────────────────────────────────────────────────
 * Palette presets — bulk patches applied when the user picks a
 * named palette. Sets multiple values in one click; the user can
 * still tune individual sliders afterwards.
 * Mapped to param ids; missing ids retain their current value.
 * ─────────────────────────────────────────────────────────────────── */
const PALETTE_PATCHES: Record<string, Values> = {
  riso: {
    canvasBg: '#fff8e7',
    cardSaturation: 1.4,
    cardContrast: 1.1,
    gridOpacity: 0.04,
    bgPattern: 'plus',
    cardBorder: 1
  },
  pastel: {
    canvasBg: '#f5ecf7',
    cardSaturation: 0.55,
    cardContrast: 0.85,
    cardBorder: 0,
    gridOpacity: 0.04
  },
  brutalist: {
    canvasBg: '#f0ede4',
    cardSaturation: 1,
    cardContrast: 1.4,
    cardBorder: 2,
    cardRadius: 0,
    centerCardRadius: 0,
    dialogRadius: 0,
    shadowStrength: 0.2,
    titleTransform: 'uppercase',
    titleWeight: '800'
  },
  newsprint: {
    canvasBg: '#efe6cf',
    cardSaturation: 0.4,
    cardHueShift: 22,
    gridOpacity: 0.05,
    paragraphGap: 1.1
  },
  editorial: {
    canvasBg: '#e8eaef',
    cardSaturation: 0.7,
    cardContrast: 0.95,
    gridOpacity: 0.05,
    bgPattern: 'lines',
    titleWeight: '500',
    titleTracking: -0.012
  },
  midnight: {
    canvasBg: '#16161a',
    cardSaturation: 0.85,
    cardContrast: 0.95,
    gridOpacity: 0.04,
    overlayDim: 0.55,
    overlayBlur: 6
  }
}

/* Random utility — bias-aware sampling. Sliders pick a value
 * inside a narrowed range so chaos still looks intentional.
 * Skips params in NO_RANDOMIZE_SECTIONS (e.g. debug overlays)
 * so toggling grid lines / aria tooltips isn't part of chaos. */
function randomizeValues(): Values {
  const out: Values = {}
  for (const param of Object.values(PARAM_BY_ID)) {
    if (NO_RANDOMIZE_IDS.has(param.id)) continue
    if (param.kind === 'slider') {
      // Per-param `chaosMin`/`chaosMax` win when set (use this for
      // values where the natural range has destructive corners, like
      // card padding). Otherwise bias toward the middle 60% of the
      // range so chaos still looks intentional.
      let lo: number
      let hi: number
      if (param.chaosMin != null || param.chaosMax != null) {
        lo = param.chaosMin ?? param.min
        hi = param.chaosMax ?? param.max
      } else {
        const span = param.max - param.min
        lo = param.min + span * 0.2
        hi = param.max - span * 0.2
      }
      const raw = lo + Math.random() * (hi - lo)
      const snapped = Math.round(raw / param.step) * param.step
      out[param.id] = snapped
    } else if (param.kind === 'select') {
      const opt =
        param.options[Math.floor(Math.random() * param.options.length)]
      out[param.id] = opt!.value
    } else if (param.kind === 'color') {
      // HSL roll, biased to the warm/cream palette so we don't get
      // headache-colored canvases.
      const h = Math.floor(Math.random() * 360)
      const s = 30 + Math.floor(Math.random() * 30)
      const l = 60 + Math.floor(Math.random() * 30)
      out[param.id] = hslToHex(h, s, l)
    } else if (param.kind === 'toggle') {
      out[param.id] = Math.random() > 0.5
    }
  }
  return out
}

/* ────────────────────────────────────────────────────────────────────
 * Shared helper for Radix Dialog consumers (SidePanel, CenterDialog).
 * Any pointer event whose target lives inside the dev DesignPanel
 * should NOT be treated as an "outside" click — otherwise clicking a
 * slider closes whatever Radix dialog is open. Returns a callback you
 * can drop into both `onPointerDownOutside` and `onInteractOutside`.
 * In production the design panel never mounts, so the predicate
 * always returns false and Radix behaves normally.
 * ─────────────────────────────────────────────────────────────────── */
export function ignoreDesignPanelOutside(event: {
  target: EventTarget | null
  preventDefault: () => void
}) {
  const target = event.target as Element | null
  if (target?.closest?.('[data-design-panel]')) {
    event.preventDefault()
  }
}

/* ────────────────────────────────────────────────────────────────────
 * Public hook for components that need to react to a flag (e.g. body
 * density, where we conditionally render JSX). Reads from the design
 * panel's stored values; in production (no panel) it always returns
 * the schema default — zero runtime cost.
 * ─────────────────────────────────────────────────────────────────── */

export function useDesignFlag<T = string>(id: string, fallback: T): T {
  const [v, setV] = React.useState<T>(() => {
    if (typeof window === 'undefined') return fallback
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return fallback
      const parsed = JSON.parse(raw) as Values
      const cur = parsed[id]
      return (cur as T) ?? fallback
    } catch {
      return fallback
    }
  })

  React.useEffect(() => {
    const onStorage = (e: StorageEvent | CustomEvent) => {
      const detail =
        e instanceof CustomEvent ? (e.detail as Values | undefined) : null
      if (detail && id in detail) {
        setV(detail[id] as T)
        return
      }
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const parsed = JSON.parse(raw) as Values
        if (id in parsed) setV(parsed[id] as T)
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('lenses:design-change', onStorage as EventListener)
    return () => {
      window.removeEventListener(
        'lenses:design-change',
        onStorage as EventListener
      )
    }
  }, [id])

  return v
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

type Values = Record<string, string | number | boolean>

function loadValues(): Values {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Values
  } catch {
    return {}
  }
}

function saveValues(values: Values) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
  } catch {
    /* ignore quota / private mode failures */
  }
}

function defaultValues(): Values {
  const out: Values = {}
  for (const p of Object.values(PARAM_BY_ID)) {
    out[p.id] =
      p.kind === 'toggle'
        ? p.default
        : p.kind === 'slider'
          ? p.default
          : p.default
  }
  return out
}

function applyValues(values: Values) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  for (const param of Object.values(PARAM_BY_ID)) {
    const v = values[param.id]

    if (param.kind === 'slider') {
      const num = typeof v === 'number' ? v : param.default
      if (param.cssVar)
        root.style.setProperty(param.cssVar, `${num}${param.cssUnit}`)
    } else if (param.kind === 'select') {
      const raw = String(v ?? param.default)
      // Decode underscores back to spaces for values like padding shorthands.
      const decoded = raw.replaceAll('_', ' ')
      if (param.cssVar) root.style.setProperty(param.cssVar, decoded)
      if (param.dataAttr)
        root.setAttribute(`data-design-${param.dataAttr}`, decoded)
    } else if (param.kind === 'color') {
      const s = typeof v === 'string' ? v : param.default
      root.style.setProperty(param.cssVar, s)
    } else if (param.kind === 'toggle') {
      const on = typeof v === 'boolean' ? v : param.default
      if (param.cssVar) {
        root.style.setProperty(
          param.cssVar,
          on ? (param.whenOn ?? '1') : (param.whenOff ?? '0')
        )
      }
      if (param.dataAttr) {
        root.setAttribute(`data-design-${param.dataAttr}`, on ? 'on' : 'off')
      }
    }
  }
}

/* Format a slider value for display. Keep numbers tight — long
   decimals on every slider make the panel feel chaotic. */
function formatValue(p: ParamSlider, v: number) {
  const s = p.step
  const decimals = s >= 1 ? 0 : s >= 0.1 ? 1 : s >= 0.01 ? 2 : 3
  return `${v.toFixed(decimals)}${p.cssUnit}`
}

export function DesignPanel() {
  const [values, setValues] = React.useState<Values>(() => ({
    ...defaultValues(),
    ...loadValues()
  }))
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    try {
      const raw = window.localStorage.getItem(COLLAPSED_KEY)
      return raw == null ? true : raw === '1'
    } catch {
      return true
    }
  })
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  /* Apply on every change. Cheap — we only set a handful of CSS
     vars on the root element, not React-driven style props.
     The custom event lets `useDesignFlag` consumers re-render
     without needing to subscribe to localStorage directly. */
  React.useEffect(() => {
    applyValues(values)
    saveValues(values)
    window.dispatchEvent(
      new CustomEvent('lenses:design-change', { detail: values })
    )
  }, [values])

  React.useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed])

  /* Cmd/Ctrl + . toggles the panel — handy when it's parked in
     the corner and you want to peek without grabbing the mouse. */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        setCollapsed((c) => !c)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const setValue = React.useCallback(
    (id: string, v: string | number | boolean) => {
      setValues((prev) => {
        const next = { ...prev, [id]: v }
        /* When the user picks a named palette, apply its patch
           on top of current values so individual sliders still
           hold whatever they were tuned to before. */
        if (id === 'paletteMode' && typeof v === 'string' && v !== 'default') {
          const patch = PALETTE_PATCHES[v]
          if (patch) Object.assign(next, patch)
        }
        return next
      })
    },
    []
  )

  const resetAll = React.useCallback(() => {
    setValues(defaultValues())
  }, [])

  const chaos = React.useCallback(() => {
    setValues((prev) => {
      const next: Values = { ...defaultValues(), ...randomizeValues() }
      // Preserve the current palette mode (palettes have their own
      // bulk-patch logic — don't fight it) and any excluded params
      // (debug overlays etc.) so chaos doesn't toggle dev tooling
      // along with design values.
      if (prev.paletteMode !== undefined) next.paletteMode = prev.paletteMode
      for (const id of NO_RANDOMIZE_IDS) {
        if (id in prev) next[id] = prev[id]!
      }
      return next
    })
  }, [])

  const saveSlot = React.useCallback(
    (slot: number) => {
      try {
        window.localStorage.setItem(SLOT_KEY(slot), JSON.stringify(values))
      } catch {
        /* ignore quota */
      }
    },
    [values]
  )

  const loadSlot = React.useCallback((slot: number) => {
    try {
      const raw = window.localStorage.getItem(SLOT_KEY(slot))
      if (!raw) return
      const parsed = JSON.parse(raw) as Values
      setValues({ ...defaultValues(), ...parsed })
    } catch {
      /* ignore */
    }
  }, [])

  const replayEntrance = React.useCallback(() => {
    /* Bump a CSS class on the canvas to force the entrance to
       re-run. We do it the simplest way possible: dispatch a
       custom event and have LensesPage listen. */
    window.dispatchEvent(new CustomEvent('lenses:replay-entrance'))
  }, [])

  const exportPreset = React.useCallback(() => {
    const json = JSON.stringify(values, null, 2)
    if (navigator.clipboard) {
      navigator.clipboard.writeText(json).catch(() => {
        /* ignore */
      })
    }
  }, [values])

  return (
    <div
      className={`${styles.panel} ${collapsed ? styles.panelCollapsed : ''}`}
      data-design-panel
    >
      <button
        type='button'
        className={styles.handle}
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Open design panel' : 'Close design panel'}
        aria-expanded={!collapsed}
      >
        <span className={styles.handleDot} aria-hidden='true' />
        <span className={styles.handleLabel}>Design</span>
        <span className={styles.handleHint} aria-hidden='true'>
          ⌘.
        </span>
      </button>

      {!collapsed && (
        <div className={styles.body}>
          <header className={styles.header}>
            <div>
              <h2 className={styles.title}>Design panel</h2>
            </div>
            <div className={styles.headerActions}>
              <button
                type='button'
                className={styles.iconBtn}
                onClick={replayEntrance}
                aria-label='Replay entrance animation'
                title='Replay entrance animation'
              >
                <ReplayIcon />
              </button>
              <button
                type='button'
                className={styles.iconBtn}
                onClick={chaos}
                aria-label='Randomize all values'
                title='Randomize all values'
              >
                <ChaosIcon />
              </button>
              <button
                type='button'
                className={styles.iconBtn}
                onClick={exportPreset}
                aria-label='Copy preset JSON to clipboard'
                title='Copy preset JSON to clipboard'
              >
                <CopyIcon />
              </button>
              <button
                type='button'
                className={styles.iconBtn}
                onClick={toggleDarkMode}
                aria-label={
                  isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
                }
                aria-pressed={isDarkMode}
                title={
                  isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
                }
              >
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
              </button>
              <button
                type='button'
                className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                onClick={resetAll}
                aria-label='Reset all values to default'
                title='Reset all values to default'
              >
                <ResetIcon />
              </button>
            </div>
          </header>

          <div className={styles.slots}>
            <span className={styles.slotsLabel}>Slots</span>
            {[1, 2, 3].map((slot) => (
              <span key={slot} className={styles.slotGroup}>
                <button
                  type='button'
                  className={styles.slotBtn}
                  onClick={() => loadSlot(slot)}
                  title={`Load slot ${slot}`}
                >
                  {slot}
                </button>
                <button
                  type='button'
                  className={styles.slotSave}
                  onClick={() => saveSlot(slot)}
                  title={`Save current to slot ${slot}`}
                  aria-label={`Save current to slot ${slot}`}
                >
                  ↓
                </button>
              </span>
            ))}
          </div>

          <div className={styles.sections}>
            {SECTIONS.map((section) => (
              <SectionView
                key={section.id}
                section={section}
                values={values}
                setValue={setValue}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SectionView({
  section,
  values,
  setValue
}: {
  section: Section
  values: Values
  setValue: (id: string, v: string | number | boolean) => void
}) {
  const [open, setOpen] = React.useState(true)
  return (
    <details
      className={styles.section}
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className={styles.sectionSummary}>
        <span className={styles.sectionLabel}>{section.label}</span>
        <span className={styles.sectionChevron} aria-hidden='true'>
          ›
        </span>
      </summary>
      {section.hint && <p className={styles.sectionHint}>{section.hint}</p>}
      <div className={styles.sectionBody}>
        {section.params.map((param) => {
          // dependsOn lives only on color params today; the
          // generic check stays cheap and supports future
          // gating elsewhere.
          const dep = 'dependsOn' in param ? param.dependsOn : undefined
          const disabled = dep != null && values[dep.id] !== dep.equals
          return (
            <ParamRow
              key={param.id}
              param={param}
              value={values[param.id]}
              disabled={disabled}
              onChange={(v) => setValue(param.id, v)}
            />
          )
        })}
      </div>
    </details>
  )
}

function ParamRow({
  param,
  value,
  disabled,
  onChange
}: {
  param: Param
  value: string | number | boolean | undefined
  disabled?: boolean
  onChange: (v: string | number | boolean) => void
}) {
  const rowClass = disabled ? `${styles.row} ${styles.rowDisabled}` : styles.row
  if (param.kind === 'slider') {
    const v = typeof value === 'number' ? value : param.default
    return (
      <label className={rowClass}>
        <span className={styles.rowLabel}>{param.label}</span>
        <span className={styles.rowControl}>
          <input
            type='range'
            min={param.min}
            max={param.max}
            step={param.step}
            value={v}
            onChange={(e) => onChange(Number(e.target.value))}
            className={styles.slider}
          />
          <input
            type='number'
            min={param.min}
            max={param.max}
            step={param.step}
            value={v}
            onChange={(e) => onChange(Number(e.target.value))}
            className={styles.numberInput}
            aria-label={`${param.label} value`}
          />
          <span className={styles.rowValue}>{formatValue(param, v)}</span>
        </span>
      </label>
    )
  }
  if (param.kind === 'select') {
    const v = typeof value === 'string' ? value : param.default
    return (
      <label className={rowClass}>
        <span className={styles.rowLabel}>{param.label}</span>
        <span className={styles.rowControl}>
          <select
            value={v}
            onChange={(e) => onChange(e.target.value)}
            className={styles.select}
          >
            {param.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </span>
      </label>
    )
  }
  if (param.kind === 'color') {
    const v = typeof value === 'string' ? value : param.default
    return (
      <label className={rowClass} aria-disabled={disabled || undefined}>
        <span className={styles.rowLabel}>{param.label}</span>
        <span className={styles.rowControl}>
          <input
            type='color'
            value={v}
            onChange={(e) => onChange(e.target.value)}
            className={styles.colorInput}
            aria-label={param.label}
            disabled={disabled}
          />
          <input
            type='text'
            value={v}
            onChange={(e) => onChange(e.target.value)}
            className={styles.textInput}
            spellCheck={false}
            disabled={disabled}
          />
        </span>
      </label>
    )
  }
  // toggle
  const v = typeof value === 'boolean' ? value : param.default
  return (
    <label className={rowClass}>
      <span className={styles.rowLabel}>{param.label}</span>
      <span className={styles.rowControl}>
        <input
          type='checkbox'
          checked={v}
          onChange={(e) => onChange(e.target.checked)}
          className={styles.checkbox}
        />
      </span>
    </label>
  )
}

/* ────────────────────────────────────────────────────────────────────
 * Header action icons. Small (14px) line-art glyphs that share
 * stroke weight + cap so the row reads as one set. All hand-drawn
 * to match the panel's understated aesthetic — no icon-font deps.
 * ─────────────────────────────────────────────────────────────────── */

type IconProps = { className?: string }

function ReplayIcon({ className }: IconProps) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      className={className}
    >
      {/* Curved arrow looping back: 270° arc + arrowhead at the head */}
      <path d='M11.2 4.5a4.5 4.5 0 1 0 1 4.2' />
      <polyline points='11.5 1.8 11.5 4.6 8.8 4.6' />
    </svg>
  )
}

function ChaosIcon({ className }: IconProps) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      className={className}
    >
      {/* Die face — 5 pip pattern, immediately reads as randomness */}
      <rect x='2' y='2' width='10' height='10' rx='2' />
      <circle cx='4.6' cy='4.6' r='0.6' fill='currentColor' stroke='none' />
      <circle cx='9.4' cy='4.6' r='0.6' fill='currentColor' stroke='none' />
      <circle cx='7' cy='7' r='0.6' fill='currentColor' stroke='none' />
      <circle cx='4.6' cy='9.4' r='0.6' fill='currentColor' stroke='none' />
      <circle cx='9.4' cy='9.4' r='0.6' fill='currentColor' stroke='none' />
    </svg>
  )
}

function CopyIcon({ className }: IconProps) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      className={className}
    >
      {/* Two stacked rounded squares */}
      <rect x='4' y='4' width='8' height='8' rx='1.4' />
      <path d='M9.6 4V2.7A.7.7 0 0 0 8.9 2H2.7a.7.7 0 0 0-.7.7v6.2a.7.7 0 0 0 .7.7H4' />
    </svg>
  )
}

function ResetIcon({ className }: IconProps) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      className={className}
    >
      {/* Counter-clockwise arrow with notch at the start */}
      <path d='M2.8 9.5A4.5 4.5 0 1 0 3 4.7' />
      <polyline points='2.5 1.9 2.5 4.7 5.3 4.7' />
    </svg>
  )
}

function SunIcon({ className }: IconProps) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      className={className}
    >
      <circle cx='7' cy='7' r='2.8' />
      <line x1='7' y1='1' x2='7' y2='2.4' />
      <line x1='7' y1='11.6' x2='7' y2='13' />
      <line x1='1' y1='7' x2='2.4' y2='7' />
      <line x1='11.6' y1='7' x2='13' y2='7' />
      <line x1='2.8' y1='2.8' x2='3.8' y2='3.8' />
      <line x1='10.2' y1='10.2' x2='11.2' y2='11.2' />
      <line x1='2.8' y1='11.2' x2='3.8' y2='10.2' />
      <line x1='10.2' y1='3.8' x2='11.2' y2='2.8' />
    </svg>
  )
}

function MoonIcon({ className }: IconProps) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      className={className}
    >
      <path d='M12 8.4A5 5 0 1 1 5.6 2 4 4 0 0 0 12 8.4z' />
    </svg>
  )
}
