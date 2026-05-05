'use client'

import * as React from 'react'

import { ThemeToggle } from '@/components/wustep/ThemeToggle'

import type { IllustrationId, Lens } from './types'
import { Illustration } from './illustrations'
import { EXPERTISE_ILLUSTRATION_CANDIDATES } from './LensesIllustrationCandidates'
import styles from './LensesIllustrationLab.module.css'
import cardStyles from './LensesPage.module.css'
import { LENSES } from './registry'

type Palette = {
  bg: string
  fg: string
  accent: string
}

type Playback = 'idle' | 'playing' | 'paused'

type LabMode = 'production' | 'candidate'

type GridMode = 'shared' | 'production'

type LabIllustration = {
  /** Unique select-key. Production = lens illustration id. Candidate = `${lensId}:${candidateId}`. */
  key: string
  /** Underlying lens illustration id (used for animations + mapping back). */
  illustrationId: IllustrationId
  /** Short option label shown in the select. */
  optionLabel: string
  /** Card label used inside preview cards. */
  cardLabel: string
  /** Palette tied to this entry — production lens palette OR the lens that owns the candidate. */
  ownerPalette: Palette
  /** Lens that owns this entry (used for tagline/title in the preview readout). */
  ownerLens: Lens
  /** Whether this entry comes from the lab-only candidate registry. */
  candidate: boolean
  /** Optional notes from the candidate registry. */
  notes?: string
  /** Render the SVG body inside a card with the given palette. */
  render: (palette: Palette) => React.ReactNode
}

const PRESET_PALETTES: Palette[] = [
  { bg: '#B43A2E', fg: '#F5EFE0', accent: '#F2C77A' },
  { bg: '#243449', fg: '#F5EFE0', accent: '#E8B547' },
  { bg: '#204A40', fg: '#F5EFE0', accent: '#A9D8B8' },
  { bg: '#D8CDB8', fg: '#1B2530', accent: '#9A4D32' },
  { bg: '#2F3138', fg: '#F5EFE0', accent: '#D9A23A' },
  { bg: '#8F3E62', fg: '#F5EFE0', accent: '#F0B8CE' }
]

/** Matrix palettes: kept at exactly 12 so the grid is two clean rows of six. */
const MATRIX_COLOR_CANDIDATES: Array<{ label: string; palette: Palette }> = [
  { label: 'Agency red', palette: PRESET_PALETTES[0]! },
  { label: 'Deep blue', palette: PRESET_PALETTES[1]! },
  { label: 'Forest', palette: PRESET_PALETTES[2]! },
  { label: 'Warm light', palette: PRESET_PALETTES[3]! },
  { label: 'Charcoal', palette: PRESET_PALETTES[4]! },
  { label: 'Berry', palette: PRESET_PALETTES[5]! },
  {
    label: 'Ink',
    palette: { bg: '#10151D', fg: '#F5EFE0', accent: '#F2B144' }
  },
  {
    label: 'Paper',
    palette: { bg: '#EFE4CC', fg: '#1B2530', accent: '#B85C38' }
  },
  {
    label: 'Moss',
    palette: { bg: '#1D3B35', fg: '#F5EFE0', accent: '#A9D8B8' }
  },
  {
    label: 'Plum',
    palette: { bg: '#4A2638', fg: '#F5EFE0', accent: '#F0B8CE' }
  },
  {
    label: 'Ochre',
    palette: { bg: '#8A5A22', fg: '#F8EED9', accent: '#F7C75A' }
  },
  {
    label: 'Stone',
    palette: { bg: '#6F6A60', fg: '#F5EFE0', accent: '#F2C77A' }
  }
]

const UNIQUE_ILLUSTRATIONS = Array.from(
  new Set(LENSES.map((lens) => lens.illustration))
).toSorted((a, b) => a.localeCompare(b))

const FIRST_LENS_FOR_ILLUSTRATION = new Map<IllustrationId, Lens>()
for (const lens of LENSES) {
  if (!FIRST_LENS_FOR_ILLUSTRATION.has(lens.illustration)) {
    FIRST_LENS_FOR_ILLUSTRATION.set(lens.illustration, lens)
  }
}

function titleLengthBucket(title: string): 'long-word' | 'long' | undefined {
  const words = title.split(/\s+/)
  const longestWord = words.reduce((max, word) => Math.max(word.length, max), 0)
  if (words.length === 1 && longestWord > 11) return 'long-word'
  if (title.length > 18) return 'long'
  return undefined
}

function hexToRgb(hex: string) {
  const value = hex.replace('#', '')
  const parsed = Number.parseInt(
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value,
    16
  )

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255
  }
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const channels = [r, g, b].map((channel) => {
    const c = channel / 255
    return c <= 0.039_28 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!
}

function readableFg(bg: string) {
  return luminance(bg) > 0.48 ? '#1B2530' : '#F5EFE0'
}

function hslToHex(h: number, s: number, l: number) {
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - chroma / 2
  const [r1, g1, b1] =
    h < 60
      ? [chroma, x, 0]
      : h < 120
        ? [x, chroma, 0]
        : h < 180
          ? [0, chroma, x]
          : h < 240
            ? [0, x, chroma]
            : h < 300
              ? [x, 0, chroma]
              : [chroma, 0, x]

  const toHex = (value: number) =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`.toUpperCase()
}

/** Minimum bg/fg contrast we'll accept from `randomPalette` — matches
 *  the 4.5:1 threshold the readout already grades against, so the
 *  randomize button can never produce a card that gets flagged. */
const MIN_RANDOM_CONTRAST = 4.5

function rollRandomPalette(): Palette {
  const hue = Math.floor(Math.random() * 360)
  const bg = hslToHex(
    hue,
    0.48 + Math.random() * 0.18,
    0.28 + Math.random() * 0.28
  )
  const fg = readableFg(bg)
  const accent = hslToHex(
    (hue + 55 + Math.random() * 95) % 360,
    0.55 + Math.random() * 0.22,
    fg === '#F5EFE0' ? 0.66 + Math.random() * 0.14 : 0.38 + Math.random() * 0.16
  )

  return { bg, fg, accent }
}

function randomPalette(): Palette {
  // Resample until the bg/fg pair clears the contrast threshold.
  // Capped so a pathological luminance window can't loop forever; if
  // we exhaust the budget, fall back to the highest-contrast roll.
  const MAX_ATTEMPTS = 24
  let best = rollRandomPalette()
  let bestContrast = contrastRatio(best.bg, best.fg)
  if (bestContrast >= MIN_RANDOM_CONTRAST) return best

  for (let attempt = 1; attempt < MAX_ATTEMPTS; attempt++) {
    const next = rollRandomPalette()
    const ratio = contrastRatio(next.bg, next.fg)
    if (ratio >= MIN_RANDOM_CONTRAST) return next
    if (ratio > bestContrast) {
      best = next
      bestContrast = ratio
    }
  }
  return best
}

function contrastRatio(a: string, b: string) {
  const l1 = luminance(a)
  const l2 = luminance(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

function paletteFromLens(lens: Lens): Palette {
  return {
    bg: lens.bg,
    fg: lens.fg,
    accent: lens.accent ?? lens.fg
  }
}

/* ────────────────────────────────────────────────────────────────────
 * LabIllustration registry
 *
 *   Production entries map 1:1 to the IllustrationId switchboard.
 *   Candidate entries come from LensesIllustrationCandidates and
 *   share their owner lens's palette + name so they read as concrete
 *   alternatives to that lens's production art rather than abstract
 *   sketches.
 * ─────────────────────────────────────────────────────────────────── */
const PRODUCTION_LAB_ILLUSTRATIONS: LabIllustration[] =
  UNIQUE_ILLUSTRATIONS.map((illustrationId) => {
    const lens = FIRST_LENS_FOR_ILLUSTRATION.get(illustrationId) ?? LENSES[0]!
    return {
      key: illustrationId,
      illustrationId,
      optionLabel: illustrationId,
      cardLabel: lens.title,
      ownerPalette: paletteFromLens(lens),
      ownerLens: lens,
      candidate: false,
      render: (palette: Palette) => (
        <Illustration
          id={illustrationId}
          fg={palette.fg}
          bg={palette.bg}
          accent={palette.accent}
        />
      )
    }
  })

const CANDIDATE_LAB_ILLUSTRATIONS: LabIllustration[] =
  EXPERTISE_ILLUSTRATION_CANDIDATES.map((candidate) => {
    const lens = FIRST_LENS_FOR_ILLUSTRATION.get(candidate.lensId) ?? LENSES[0]!
    return {
      key: `${candidate.lensId}:${candidate.id}`,
      illustrationId: candidate.lensId,
      optionLabel: `${candidate.lensId} · ${candidate.label}`,
      cardLabel: candidate.label,
      ownerPalette: paletteFromLens(lens),
      ownerLens: lens,
      candidate: true,
      notes: candidate.notes,
      render: (palette: Palette) => candidate.render(palette)
    }
  })

const ALL_LAB_ILLUSTRATIONS = [
  ...PRODUCTION_LAB_ILLUSTRATIONS,
  ...CANDIDATE_LAB_ILLUSTRATIONS
]

const LAB_ILLUSTRATION_BY_KEY = new Map(
  ALL_LAB_ILLUSTRATIONS.map((entry) => [entry.key, entry])
)

const ILLUSTRATIONS_WITH_CANDIDATES = new Set(
  CANDIDATE_LAB_ILLUSTRATIONS.map((entry) => entry.illustrationId)
)

export function LensesIllustrationLab() {
  const [labMode, setLabMode] = React.useState<LabMode>('production')
  const [selectedKey, setSelectedKey] = React.useState<string>(
    PRODUCTION_LAB_ILLUSTRATIONS[0]!.key
  )
  const [canvasTheme, setCanvasTheme] = React.useState<'light' | 'dark'>(
    'light'
  )
  const [playback, setPlayback] = React.useState<Playback>('idle')
  const [controlsFloating, setControlsFloating] = React.useState(false)
  const [palette, setPalette] = React.useState<Palette>(() =>
    paletteFromLens(LENSES[0]!)
  )
  const [gridMode, setGridMode] = React.useState<GridMode>('production')

  const visibleEntries = React.useMemo(
    () =>
      labMode === 'candidate'
        ? CANDIDATE_LAB_ILLUSTRATIONS
        : PRODUCTION_LAB_ILLUSTRATIONS,
    [labMode]
  )

  const matrixCandidates = React.useMemo(() => {
    if (labMode !== 'candidate') return CANDIDATE_LAB_ILLUSTRATIONS
    const owner = LAB_ILLUSTRATION_BY_KEY.get(selectedKey)
    if (!owner) return CANDIDATE_LAB_ILLUSTRATIONS
    const sameLens = ALL_LAB_ILLUSTRATIONS.filter(
      (entry) => entry.illustrationId === owner.illustrationId
    )
    return sameLens.length > 0 ? sameLens : CANDIDATE_LAB_ILLUSTRATIONS
  }, [labMode, selectedKey])

  const selected =
    LAB_ILLUSTRATION_BY_KEY.get(selectedKey) ?? PRODUCTION_LAB_ILLUSTRATIONS[0]!

  React.useEffect(() => {
    if (!visibleEntries.some((entry) => entry.key === selectedKey)) {
      setSelectedKey(visibleEntries[0]?.key ?? selected.key)
    }
  }, [visibleEntries, selectedKey, selected.key])

  const randomize = React.useCallback(() => {
    setPalette(randomPalette())
  }, [])

  const resetPalette = React.useCallback(() => {
    setPalette(selected.ownerPalette)
  }, [selected.ownerPalette])

  const palettesMatch =
    palette.bg === selected.ownerPalette.bg &&
    palette.fg === selected.ownerPalette.fg &&
    palette.accent === selected.ownerPalette.accent

  React.useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setControlsFloating(window.scrollY > 280)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const selectedContrast = contrastRatio(palette.bg, palette.fg)

  const matrixPalettes = [
    { label: 'Owner', palette: selected.ownerPalette },
    { label: 'Current', palette },
    ...MATRIX_COLOR_CANDIDATES
  ].slice(0, 12)

  const controlProps = {
    labMode,
    onLabModeChange: setLabMode,
    selectedKey,
    onSelectedKeyChange: setSelectedKey,
    visibleEntries,
    palette,
    onPaletteChange: setPalette,
    playback,
    onPlaybackChange: setPlayback,
    onRandomize: randomize,
    onReset: resetPalette,
    canReset: !palettesMatch,
    resetTargetLabel: selected.ownerLens.title
  } satisfies LabControlsProps

  const previewLens = selected.ownerLens
  const previewTitle = selected.candidate
    ? `${previewLens.title} · ${selected.cardLabel}`
    : previewLens.title
  const previewTagline = selected.candidate
    ? (selected.notes ?? previewLens.tagline)
    : previewLens.tagline

  return (
    <div
      className={styles.lab}
      data-theme={canvasTheme}
      data-animations={playback}
      data-mode={labMode}
    >
      <section className={styles.hero}>
        <div>
          <div className={styles.heroTopline}>
            <p className={styles.kicker}>Development</p>
            <div className={styles.themeControl}>
              <span>{canvasTheme} canvas</span>
              <ThemeToggle
                isDark={canvasTheme === 'dark'}
                onToggle={() =>
                  setCanvasTheme((theme) =>
                    theme === 'dark' ? 'light' : 'dark'
                  )
                }
                className={styles.themeToggle}
              />
            </div>
          </div>
          <h1 className={styles.title}>Illustrations</h1>
          <p className={styles.intro}>
            Test every Lenses illustration against real card colors, controlled
            palettes, and randomized color directions before moving changes into
            the production registry.
          </p>
        </div>

        <LabControls {...controlProps} />
      </section>

      {controlsFloating ? (
        <div className={styles.floatingControls}>
          <LabControls {...controlProps} />
        </div>
      ) : null}

      <section className={styles.previewPanel}>
        <div className={styles.largeCardWrap}>
          <PreviewCard
            title={selected.cardLabel}
            palette={palette}
            renderIllustration={selected.render}
            large
          />
        </div>
        <div className={styles.readout}>
          <h2>{previewTitle}</h2>
          <p>{previewTagline}</p>
          <dl>
            <div>
              <dt>bg</dt>
              <dd>{palette.bg}</dd>
            </div>
            <div>
              <dt>fg</dt>
              <dd>{palette.fg}</dd>
            </div>
            <div>
              <dt>accent</dt>
              <dd>{palette.accent}</dd>
            </div>
            <div>
              <dt>contrast</dt>
              <dd>{selectedContrast.toFixed(2)}:1</dd>
            </div>
          </dl>
          <p
            className={
              selectedContrast >= 4.5 ? styles.passMessage : styles.warnMessage
            }
          >
            {selectedContrast >= 4.5
              ? 'Foreground contrast passes normal text.'
              : 'Foreground contrast is low for title text.'}
          </p>
        </div>
      </section>

      {labMode === 'candidate' ? (
        <section className={`${styles.section} ${styles.matrixSection}`}>
          <div className={styles.sectionHeader}>
            <h2>Candidate Matrix · {selected.ownerLens.title}</h2>
          </div>
          <div className={styles.candidateMatrix}>
            {matrixCandidates.map((entry, index) => {
              const indexLabel = entry.candidate
                ? `${String.fromCodePoint(64 + index)} · ${entry.cardLabel}`
                : entry.cardLabel
              return (
                <article className={styles.matrixRow} key={entry.key}>
                  <div className={styles.matrixLabel}>
                    <h3>{indexLabel}</h3>
                    <p>
                      {entry.notes ??
                        (entry.candidate
                          ? 'Lab-only candidate.'
                          : 'Current registered illustration.')}
                    </p>
                  </div>
                  <div className={styles.matrixCards}>
                    {matrixPalettes.map((column) => (
                      <PreviewCard
                        key={`${entry.key}-${column.label}`}
                        title={column.label}
                        palette={column.palette}
                        renderIllustration={entry.render}
                      />
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Selected Across Palettes</h2>
        </div>
        <div className={styles.grid}>
          {[palette, ...PRESET_PALETTES].map((entry, index) => (
            <PreviewCard
              key={`${entry.bg}-${entry.fg}-${entry.accent}-${index}`}
              title={index === 0 ? 'Current' : `Preset ${index}`}
              palette={entry}
              renderIllustration={selected.render}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Library</h2>
          <SegmentedToggle
            ariaLabel='Library palette mode'
            value={gridMode}
            onChange={setGridMode}
            options={[
              { value: 'production', label: 'Per-card palette' },
              { value: 'shared', label: 'Current palette' }
            ]}
          />
        </div>
        {labMode === 'candidate' && selected.candidate ? (
          <p className={styles.libraryHint}>
            The {selected.ownerLens.title} card below is rendered with the
            selected candidate so you can read it next to its real neighbors.
          </p>
        ) : null}
        <div className={styles.grid}>
          {PRODUCTION_LAB_ILLUSTRATIONS.map((entry) => {
            const useCandidate =
              labMode === 'candidate' &&
              selected.candidate &&
              entry.illustrationId === selected.illustrationId
            // Library palette: shared mode applies the toolbar palette to
            // every card; per-card mode uses each entry's own palette,
            // except for the swapped candidate slot — that one always
            // honors the toolbar palette so the candidate reflects the
            // colors you're tuning.
            const cardPalette =
              gridMode === 'shared' || useCandidate
                ? palette
                : entry.ownerPalette
            const isSelected = useCandidate ? true : entry.key === selectedKey
            const renderFn = useCandidate ? selected.render : entry.render
            const cardTitle = useCandidate
              ? `${entry.cardLabel} · ${selected.cardLabel}`
              : entry.cardLabel
            const badge = useCandidate
              ? 'Candidate'
              : ILLUSTRATIONS_WITH_CANDIDATES.has(entry.illustrationId)
                ? 'Has candidates'
                : undefined
            return (
              <PreviewCard
                key={entry.key}
                title={cardTitle}
                palette={cardPalette}
                renderIllustration={renderFn}
                selected={isSelected}
                badge={badge}
                onClick={() => {
                  if (useCandidate) return
                  setSelectedKey(entry.key)
                  if (gridMode === 'production') {
                    setPalette(entry.ownerPalette)
                  }
                }}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}

type ColorFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

type LabControlsProps = {
  labMode: LabMode
  onLabModeChange: React.Dispatch<React.SetStateAction<LabMode>>
  selectedKey: string
  onSelectedKeyChange: (key: string) => void
  visibleEntries: LabIllustration[]
  palette: Palette
  onPaletteChange: React.Dispatch<React.SetStateAction<Palette>>
  playback: Playback
  onPlaybackChange: React.Dispatch<React.SetStateAction<Playback>>
  onRandomize: () => void
  onReset: () => void
  canReset: boolean
  resetTargetLabel: string
}

function LabControls({
  labMode,
  onLabModeChange,
  selectedKey,
  onSelectedKeyChange,
  visibleEntries,
  palette,
  onPaletteChange,
  playback,
  onPlaybackChange,
  onRandomize,
  onReset,
  canReset,
  resetTargetLabel
}: LabControlsProps) {
  return (
    <div className={styles.toolbar} aria-label='Palette controls'>
      <div className={styles.modeRow}>
        <SegmentedToggle
          ariaLabel='Lab mode'
          value={labMode}
          onChange={onLabModeChange}
          options={[
            { value: 'production', label: 'Production' },
            { value: 'candidate', label: 'Candidates' }
          ]}
        />
      </div>

      <label className={styles.field}>
        <span>{labMode === 'candidate' ? 'Candidate' : 'Illustration'}</span>
        <select
          value={selectedKey}
          onChange={(event) => onSelectedKeyChange(event.target.value)}
        >
          {visibleEntries.map((entry) => (
            <option key={entry.key} value={entry.key}>
              {entry.optionLabel}
            </option>
          ))}
        </select>
      </label>

      <ColorField
        label='Background'
        value={palette.bg}
        onChange={(bg) => onPaletteChange((current) => ({ ...current, bg }))}
      />
      <ColorField
        label='Foreground'
        value={palette.fg}
        onChange={(fg) => onPaletteChange((current) => ({ ...current, fg }))}
      />
      <ColorField
        label='Accent'
        value={palette.accent}
        onChange={(accent) =>
          onPaletteChange((current) => ({ ...current, accent }))
        }
      />

      <div className={styles.actionRow}>
        <button type='button' className={styles.button} onClick={onRandomize}>
          Randomize palette
        </button>
        <button
          type='button'
          className={styles.buttonSecondary}
          onClick={onReset}
          disabled={!canReset}
          title={`Reset palette to ${resetTargetLabel}`}
        >
          Reset
        </button>
        <button
          type='button'
          className={styles.iconButton}
          onClick={() =>
            onPlaybackChange((state) =>
              state === 'playing' ? 'paused' : 'playing'
            )
          }
          aria-label={
            playback === 'playing'
              ? 'Pause all illustrations'
              : 'Play all illustrations'
          }
          aria-pressed={playback === 'playing'}
          title={
            playback === 'playing'
              ? 'Pause all illustrations'
              : 'Play all illustrations'
          }
        >
          {playback === 'playing' ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
    </div>
  )
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <span className={styles.colorInputWrap}>
        <input
          type='color'
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          aria-label={label}
        />
        <input
          type='text'
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={7}
          spellCheck={false}
          aria-label={`${label} hex`}
        />
      </span>
    </label>
  )
}

type SegmentedToggleProps<T extends string> = {
  ariaLabel: string
  value: T
  onChange: (next: T) => void
  options: Array<{ value: T; label: string }>
}

function SegmentedToggle<T extends string>({
  ariaLabel,
  value,
  onChange,
  options
}: SegmentedToggleProps<T>) {
  return (
    <div className={styles.segmented} role='radiogroup' aria-label={ariaLabel}>
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type='button'
            role='radio'
            aria-checked={isActive}
            className={`${styles.segmentedOption} ${
              isActive ? styles.segmentedOptionActive : ''
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function PlayIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path d='M8 5.5v13l10-6.5-10-6.5Z' fill='currentColor' />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox='0 0 24 24' aria-hidden='true'>
      <path
        d='M7 5.5h3.5v13H7v-13Zm6.5 0H17v13h-3.5v-13Z'
        fill='currentColor'
      />
    </svg>
  )
}

type PreviewCardProps = {
  title: string
  illustration?: IllustrationId
  renderIllustration?: (palette: Palette) => React.ReactNode
  palette: Palette
  selected?: boolean
  large?: boolean
  badge?: string
  onClick?: () => void
}

function PreviewCard({
  title,
  illustration,
  renderIllustration,
  palette,
  selected,
  large,
  badge,
  onClick
}: PreviewCardProps) {
  const titleBucket = titleLengthBucket(title)
  const content = (
    <>
      <span className={`${styles.cardArt} ${cardStyles.cardArt}`}>
        {renderIllustration ? (
          renderIllustration(palette)
        ) : illustration ? (
          <Illustration
            id={illustration}
            fg={palette.fg}
            bg={palette.bg}
            accent={palette.accent}
          />
        ) : null}
      </span>
      <span className={styles.cardTitle}>
        <span className={styles.cardTitleClamp}>{title}</span>
      </span>
      {badge ? <span className={styles.cardBadge}>{badge}</span> : null}
    </>
  )

  const className = [
    styles.card,
    selected && styles.cardSelected,
    large && styles.cardLarge,
    onClick && styles.cardButton
  ]
    .filter(Boolean)
    .join(' ')

  const style = {
    '--lab-card-bg': palette.bg,
    '--lab-card-fg': palette.fg,
    '--lab-card-accent': palette.accent,
    '--card-bg': palette.bg,
    '--card-fg': palette.fg,
    '--card-accent': palette.accent
  } as React.CSSProperties

  if (!onClick) {
    return (
      <div className={className} style={style} data-title-length={titleBucket}>
        {content}
      </div>
    )
  }

  return (
    <button
      type='button'
      className={className}
      style={style}
      onClick={onClick}
      data-title-length={titleBucket}
    >
      {content}
    </button>
  )
}
