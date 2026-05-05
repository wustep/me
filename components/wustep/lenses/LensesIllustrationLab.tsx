'use client'

import * as React from 'react'

import { ThemeToggle } from '@/components/wustep/ThemeToggle'

import type { IllustrationId, Lens } from './types'
import { Illustration } from './illustrations'
import styles from './LensesIllustrationLab.module.css'
import cardStyles from './LensesPage.module.css'
import { LENSES } from './registry'

type Palette = {
  bg: string
  fg: string
  accent: string
}

const PRESET_PALETTES: Palette[] = [
  { bg: '#B43A2E', fg: '#F5EFE0', accent: '#F2C77A' },
  { bg: '#243449', fg: '#F5EFE0', accent: '#E8B547' },
  { bg: '#204A40', fg: '#F5EFE0', accent: '#A9D8B8' },
  { bg: '#D8CDB8', fg: '#1B2530', accent: '#9A4D32' },
  { bg: '#2F3138', fg: '#F5EFE0', accent: '#D9A23A' },
  { bg: '#8F3E62', fg: '#F5EFE0', accent: '#F0B8CE' }
]

const UNIQUE_ILLUSTRATIONS = Array.from(
  new Set(LENSES.map((lens) => lens.illustration))
).toSorted((a, b) => a.localeCompare(b))

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

function randomPalette(): Palette {
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

export function LensesIllustrationLab() {
  const [selectedId, setSelectedId] = React.useState<IllustrationId>(
    LENSES[0]!.illustration
  )
  const [canvasTheme, setCanvasTheme] = React.useState<'light' | 'dark'>(
    'light'
  )
  const [playback, setPlayback] = React.useState<'idle' | 'playing' | 'paused'>(
    'idle'
  )
  const [palette, setPalette] = React.useState<Palette>(() =>
    paletteFromLens(LENSES[0]!)
  )

  const matchingLens = React.useMemo(
    () => LENSES.find((lens) => lens.illustration === selectedId) ?? LENSES[0]!,
    [selectedId]
  )

  const randomize = React.useCallback(() => {
    setPalette(randomPalette())
  }, [])

  const selectedContrast = contrastRatio(palette.bg, palette.fg)

  return (
    <div
      className={styles.lab}
      data-theme={canvasTheme}
      data-animations={playback}
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

        <div className={styles.toolbar} aria-label='Palette controls'>
          <label className={styles.field}>
            <span>Illustration</span>
            <select
              value={selectedId}
              onChange={(event) =>
                setSelectedId(event.target.value as IllustrationId)
              }
            >
              {UNIQUE_ILLUSTRATIONS.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>

          <ColorField
            label='Background'
            value={palette.bg}
            onChange={(bg) => setPalette((current) => ({ ...current, bg }))}
          />
          <ColorField
            label='Foreground'
            value={palette.fg}
            onChange={(fg) => setPalette((current) => ({ ...current, fg }))}
          />
          <ColorField
            label='Accent'
            value={palette.accent}
            onChange={(accent) =>
              setPalette((current) => ({ ...current, accent }))
            }
          />

          <div className={styles.actionRow}>
            <button type='button' className={styles.button} onClick={randomize}>
              Randomize palette
            </button>
            <button
              type='button'
              className={styles.iconButton}
              onClick={() =>
                setPlayback((state) =>
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
      </section>

      <section className={styles.previewPanel}>
        <div className={styles.largeCardWrap}>
          <PreviewCard
            title={matchingLens.title}
            illustration={selectedId}
            palette={palette}
            large
          />
        </div>
        <div className={styles.readout}>
          <h2>{matchingLens.title}</h2>
          <p>{matchingLens.tagline}</p>
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

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Selected Illustration Across Palettes</h2>
          <p>Useful when designing a new card color before committing it.</p>
        </div>
        <div className={styles.grid}>
          {[palette, ...PRESET_PALETTES].map((candidate, index) => (
            <PreviewCard
              key={`${candidate.bg}-${candidate.fg}-${candidate.accent}-${index}`}
              title={index === 0 ? 'Current' : `Preset ${index}`}
              illustration={selectedId}
              palette={candidate}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>All Illustrations On Current Palette</h2>
          <p>Checks whether a color idea works across the whole SVG system.</p>
        </div>
        <div className={styles.grid}>
          {UNIQUE_ILLUSTRATIONS.map((id) => (
            <PreviewCard
              key={id}
              title={id}
              illustration={id}
              palette={palette}
              selected={id === selectedId}
              onClick={() => setSelectedId(id)}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Production Cards</h2>
          <p>Smoke-test the real registry values in one place.</p>
        </div>
        <div className={styles.grid}>
          {LENSES.map((lens) => (
            <PreviewCard
              key={lens.id}
              title={lens.title}
              illustration={lens.illustration}
              palette={paletteFromLens(lens)}
              selected={lens.illustration === selectedId}
              onClick={() => {
                setSelectedId(lens.illustration)
                setPalette(paletteFromLens(lens))
              }}
            />
          ))}
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
  illustration: IllustrationId
  palette: Palette
  selected?: boolean
  large?: boolean
  onClick?: () => void
}

function PreviewCard({
  title,
  illustration,
  palette,
  selected,
  large,
  onClick
}: PreviewCardProps) {
  const titleBucket = titleLengthBucket(title)
  const content = (
    <>
      <span className={`${styles.cardArt} ${cardStyles.cardArt}`}>
        <Illustration
          id={illustration}
          fg={palette.fg}
          bg={palette.bg}
          accent={palette.accent}
        />
      </span>
      <span className={styles.cardTitle}>
        <span className={styles.cardTitleClamp}>{title}</span>
      </span>
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
