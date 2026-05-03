'use client'

import * as React from 'react'

import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './DesignPanel.module.css'

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

/* ────────────────────────────────────────────────────────────────────
 * Parameter schema. Keep this declarative — the panel UI is
 * generated from this so adding/removing tweaks is one entry.
 * ─────────────────────────────────────────────────────────────────── */

type ParamSlider = {
  kind: 'slider'
  id: string
  label: string
  /** When set, value is written as a CSS variable on :root. */
  cssVar?: string
  cssUnit: string
  min: number
  max: number
  step: number
  default: number
  /** Optional override of the chaos range for this slider. When
   *  present, randomize() samples uniformly from [chaosMin, chaosMax]
   *  instead of the bias-aware middle 60% of [min, max]. Use this
   *  to keep destructive ranges (e.g. card padding that overflows
   *  text) inside a sane chaos band. */
  chaosMin?: number
  chaosMax?: number
}

type ParamSelect = {
  kind: 'select'
  id: string
  label: string
  /** When set, value is written as a CSS variable. */
  cssVar?: string
  /** When set, value is written as `data-design-{attr}` on <html>.
   *  Use this for selects whose values aren't valid CSS values
   *  (like 'left' / 'right' for panel side, or 'on' / 'off' flags). */
  dataAttr?: string
  options: { value: string; label: string }[]
  default: string
}

type ParamColor = {
  kind: 'color'
  id: string
  label: string
  cssVar: string
  default: string
}

type ParamToggle = {
  kind: 'toggle'
  id: string
  label: string
  /** When set, on/off becomes a CSS variable value. */
  cssVar?: string
  whenOn?: string
  whenOff?: string
  /** When set, on/off becomes `data-design-{attr}='on'|'off'` on <html>. */
  dataAttr?: string
  default: boolean
}

type Param = ParamSlider | ParamSelect | ParamColor | ParamToggle

type Section = {
  id: string
  label: string
  /** Optional one-liner under the section title. */
  hint?: string
  params: Param[]
}

const SECTIONS: Section[] = [
  {
    id: 'layout',
    label: 'Layout & spacing',
    hint: 'Grid rhythm, padding, card geometry.',
    params: [
      {
        kind: 'slider',
        id: 'cardGap',
        label: 'Card gap',
        cssVar: '--design-card-gap',
        cssUnit: 'px',
        min: 4,
        max: 64,
        step: 1,
        default: 28,
        // Chaos band: keep gaps loose enough that card content
        // area stays readable. Below ~16 the deck reads as a
        // mosaic; above ~40 cards drift apart and titles wrap
        // into the gutter.
        chaosMin: 16,
        chaosMax: 40
      },
      {
        kind: 'slider',
        id: 'deckPadX',
        label: 'Deck padding X',
        cssVar: '--design-deck-pad-x',
        cssUnit: 'px',
        min: 8,
        max: 96,
        step: 1,
        default: 32,
        chaosMin: 16,
        chaosMax: 56
      },
      {
        kind: 'slider',
        id: 'deckPadTop',
        label: 'Deck padding top',
        cssVar: '--design-deck-pad-top',
        cssUnit: 'px',
        min: 32,
        max: 200,
        step: 1,
        default: 88
      },
      {
        kind: 'slider',
        id: 'deckMaxWidth',
        label: 'Deck max-width',
        cssVar: '--design-deck-max-width',
        cssUnit: 'px',
        min: 800,
        max: 2000,
        step: 20,
        default: 1440
      },
      {
        kind: 'slider',
        id: 'cardAspect',
        label: 'Card aspect (W/H)',
        cssVar: '--design-card-aspect',
        cssUnit: '',
        min: 0.5,
        max: 1.2,
        step: 0.01,
        default: 0.8
      },
      {
        kind: 'select',
        id: 'gridCols',
        label: 'Grid columns',
        cssVar: '--design-grid-cols',
        options: [
          { value: '4', label: '4 columns' },
          { value: '5', label: '5 columns' },
          { value: '6', label: '6 columns' },
          { value: '7', label: '7 columns' },
          { value: '8', label: '8 columns (default)' },
          { value: '9', label: '9 columns' },
          { value: '10', label: '10 columns' }
        ],
        default: '8'
      },
      {
        kind: 'select',
        id: 'centerSpan',
        label: 'Center card span',
        dataAttr: 'center-span',
        options: [
          { value: '1', label: '1×1 (just a card)' },
          { value: '2', label: '2×2 (default)' },
          { value: '3', label: '3×3 (huge)' },
          { value: 'wide', label: '2 wide × 1 tall' },
          { value: 'tall', label: '1 wide × 2 tall' }
        ],
        default: '2'
      },
      {
        kind: 'select',
        id: 'cardAlign',
        label: 'Card content align',
        dataAttr: 'card-align',
        options: [
          { value: 'bottom', label: 'Title bottom (default)' },
          { value: 'top', label: 'Title top' },
          { value: 'overlay', label: 'Title overlay' }
        ],
        default: 'bottom'
      },
      {
        kind: 'select',
        id: 'titleAlign',
        label: 'Title alignment',
        cssVar: '--design-title-align',
        options: [
          { value: 'left', label: 'Left (default)' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' }
        ],
        default: 'left'
      }
    ]
  },
  {
    id: 'shape',
    label: 'Card shape',
    hint: 'Radius, lift, selection signal.',
    params: [
      {
        kind: 'slider',
        id: 'cardRadius',
        label: 'Card radius',
        cssVar: '--design-card-radius',
        cssUnit: 'px',
        min: 0,
        max: 36,
        step: 1,
        default: 18
      },
      {
        kind: 'slider',
        id: 'centerCardRadius',
        label: 'Center card radius',
        cssVar: '--design-center-card-radius',
        cssUnit: 'px',
        min: 0,
        max: 40,
        step: 1,
        default: 22
      },
      {
        kind: 'slider',
        id: 'hoverLift',
        label: 'Hover lift',
        cssVar: '--design-hover-lift',
        cssUnit: 'px',
        min: 0,
        max: 20,
        step: 1,
        default: 5
      },
      {
        kind: 'slider',
        id: 'hoverScale',
        label: 'Hover scale',
        cssVar: '--design-hover-scale',
        cssUnit: '',
        min: 1,
        max: 1.15,
        step: 0.005,
        default: 1.025
      },
      {
        kind: 'slider',
        id: 'pressScale',
        label: 'Press scale',
        cssVar: '--design-press-scale',
        cssUnit: '',
        min: 0.9,
        max: 1,
        step: 0.005,
        default: 0.98
      },
      {
        kind: 'slider',
        id: 'selectedRing',
        label: 'Selected ring',
        cssVar: '--design-selected-ring',
        cssUnit: 'px',
        min: 0,
        max: 6,
        step: 0.5,
        default: 2
      },
      {
        kind: 'slider',
        id: 'cardBorder',
        label: 'Card border',
        cssVar: '--design-card-border',
        cssUnit: 'px',
        min: 0,
        max: 4,
        step: 0.5,
        default: 0
      },
      {
        kind: 'slider',
        id: 'cardPadX',
        label: 'Card pad X',
        cssVar: '--design-card-pad-x',
        cssUnit: 'px',
        min: 4,
        max: 28,
        step: 1,
        default: 14,
        // Card content gets squeezed by both X paddings — keep
        // chaos in the gentle middle so titles like "Evolutionary
        // psychology" still wrap inside the card edge.
        chaosMin: 8,
        chaosMax: 18
      },
      {
        kind: 'slider',
        id: 'cardPadY',
        label: 'Card pad Y',
        cssVar: '--design-card-pad-y',
        cssUnit: 'px',
        min: 4,
        max: 28,
        step: 1,
        default: 13,
        chaosMin: 8,
        chaosMax: 18
      },
      {
        kind: 'slider',
        id: 'illusScale',
        label: 'Illustration scale',
        cssVar: '--design-illus-scale',
        cssUnit: '',
        min: 0.5,
        max: 1.3,
        step: 0.02,
        default: 1
      },
      {
        kind: 'select',
        id: 'illusPos',
        label: 'Illustration position',
        cssVar: '--design-illus-justify',
        options: [
          { value: 'center', label: 'Center (default)' },
          { value: 'flex-start', label: 'Top' },
          { value: 'flex-end', label: 'Bottom' }
        ],
        default: 'center'
      },
      {
        kind: 'select',
        id: 'selectionStyle',
        label: 'Selection style',
        dataAttr: 'selection',
        options: [
          { value: 'ring', label: 'Accent ring (default)' },
          { value: 'glow', label: 'Soft glow halo' },
          { value: 'underline', label: 'Underline title' },
          { value: 'invert', label: 'Invert card' },
          { value: 'spotlight', label: 'Spotlight (others dim)' }
        ],
        default: 'ring'
      }
    ]
  },
  {
    id: 'depth',
    label: 'Depth & shadow',
    hint: 'Cast shadow, elevation, surface highlight.',
    params: [
      {
        kind: 'slider',
        id: 'shadowStrength',
        label: 'Shadow strength',
        cssVar: '--design-shadow-strength',
        cssUnit: '',
        min: 0,
        max: 1.5,
        step: 0.05,
        default: 1
      },
      {
        kind: 'slider',
        id: 'shadowY',
        label: 'Shadow Y',
        cssVar: '--design-shadow-y',
        cssUnit: 'px',
        min: 0,
        max: 60,
        step: 1,
        default: 14
      },
      {
        kind: 'slider',
        id: 'shadowBlur',
        label: 'Shadow blur',
        cssVar: '--design-shadow-blur',
        cssUnit: 'px',
        min: 0,
        max: 100,
        step: 1,
        default: 28
      },
      {
        kind: 'slider',
        id: 'highlight',
        label: 'Top highlight',
        cssVar: '--design-highlight',
        cssUnit: '',
        min: 0,
        max: 0.4,
        step: 0.005,
        default: 0.06
      },
      {
        kind: 'slider',
        id: 'innerStroke',
        label: 'Inner stroke',
        cssVar: '--design-inner-stroke',
        cssUnit: '',
        min: 0,
        max: 0.6,
        step: 0.01,
        default: 0.22
      }
    ]
  },
  {
    id: 'type',
    label: 'Typography',
    hint: 'Card titles + body scale.',
    params: [
      {
        kind: 'slider',
        id: 'titleScale',
        label: 'Title size',
        cssVar: '--design-title-scale',
        cssUnit: '',
        min: 0.7,
        max: 1.4,
        step: 0.01,
        default: 1,
        // Above ~1.15 long titles stop fitting inside narrow
        // cards. Keep chaos in the safe band.
        chaosMin: 0.85,
        chaosMax: 1.1
      },
      {
        kind: 'select',
        id: 'titleWeight',
        label: 'Title weight',
        cssVar: '--design-title-weight',
        options: [
          { value: '400', label: 'Regular' },
          { value: '500', label: 'Medium' },
          { value: '600', label: 'Semibold' },
          { value: '700', label: 'Bold' },
          { value: '800', label: 'Extrabold' }
        ],
        default: '600'
      },
      {
        kind: 'slider',
        id: 'titleTracking',
        label: 'Title tracking',
        cssVar: '--design-title-tracking',
        cssUnit: 'em',
        min: -0.05,
        max: 0.04,
        step: 0.002,
        default: -0.006,
        // Wide tracking pushes long titles past the card edge.
        chaosMin: -0.02,
        chaosMax: 0.012
      },
      {
        kind: 'slider',
        id: 'bodyScale',
        label: 'Body text size',
        cssVar: '--design-body-scale',
        cssUnit: '',
        min: 0.85,
        max: 1.25,
        step: 0.01,
        default: 1
      },
      {
        kind: 'slider',
        id: 'bodyMeasure',
        label: 'Body measure',
        cssVar: '--design-body-measure',
        cssUnit: 'ch',
        min: 36,
        max: 80,
        step: 1,
        default: 56
      },
      {
        kind: 'select',
        id: 'serifFont',
        label: 'Serif family',
        cssVar: '--design-serif',
        options: [
          { value: "var(--font-serif, 'Crimson Pro', Georgia, serif)", label: 'Crimson Pro (default)' },
          { value: "Georgia, 'Times New Roman', serif", label: 'Georgia' },
          { value: "'Iowan Old Style', 'Palatino', serif", label: 'Iowan / Palatino' },
          { value: "ui-serif, serif", label: 'System serif' }
        ],
        default: "var(--font-serif, 'Crimson Pro', Georgia, serif)"
      },
      {
        kind: 'select',
        id: 'sansFont',
        label: 'Sans family',
        cssVar: '--design-sans',
        options: [
          {
            value:
              'var(--font-geist, var(--font-sans, system-ui), sans-serif)',
            label: 'Geist (default)'
          },
          {
            value:
              "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            label: 'Inter'
          },
          {
            value:
              "-apple-system, BlinkMacSystemFont, 'SF Pro', system-ui, sans-serif",
            label: 'San Francisco'
          },
          {
            value:
              "ui-monospace, 'JetBrains Mono', 'SF Mono', Menlo, monospace",
            label: 'Monospace (chaos)'
          },
          {
            value: "system-ui, sans-serif",
            label: 'System default'
          }
        ],
        default: 'var(--font-geist, var(--font-sans, system-ui), sans-serif)'
      },
      {
        kind: 'select',
        id: 'titleTransform',
        label: 'Title transform',
        cssVar: '--design-title-transform',
        options: [
          { value: 'none', label: 'None (default)' },
          { value: 'uppercase', label: 'UPPERCASE' },
          { value: 'lowercase', label: 'lowercase' },
          { value: 'capitalize', label: 'Capitalize' }
        ],
        default: 'none'
      },
      {
        kind: 'slider',
        id: 'bodyLineHeight',
        label: 'Body line-height',
        cssVar: '--design-body-line-height',
        cssUnit: '',
        min: 1.25,
        max: 2,
        step: 0.02,
        default: 1.6
      },
      {
        kind: 'slider',
        id: 'paragraphGap',
        label: 'Paragraph gap',
        cssVar: '--design-paragraph-gap',
        cssUnit: 'em',
        min: 0.4,
        max: 2,
        step: 0.05,
        default: 1
      },
      {
        kind: 'toggle',
        id: 'dropCap',
        label: 'Drop-cap first paragraph',
        dataAttr: 'dropcap',
        default: false
      },
      {
        kind: 'toggle',
        id: 'tabularNums',
        label: 'Tabular numerals',
        cssVar: '--design-numerals',
        whenOn: 'tabular-nums',
        whenOff: 'normal',
        default: false
      }
    ]
  },
  {
    id: 'color',
    label: 'Color & surface',
    hint: 'Canvas, accents, grid, gradient.',
    params: [
      {
        kind: 'color',
        id: 'canvasBg',
        label: 'Canvas (light)',
        cssVar: '--design-canvas-bg-light',
        default: '#ece4d0'
      },
      {
        kind: 'color',
        id: 'canvasBgDark',
        label: 'Canvas (dark)',
        cssVar: '--design-canvas-bg-dark',
        default: '#16161a'
      },
      {
        kind: 'slider',
        id: 'gridOpacity',
        label: 'Dot-grid opacity',
        cssVar: '--design-grid-opacity',
        cssUnit: '',
        min: 0,
        max: 0.25,
        step: 0.005,
        default: 0.07
      },
      {
        kind: 'slider',
        id: 'gridSize',
        label: 'Dot-grid size',
        cssVar: '--design-grid-size',
        cssUnit: 'px',
        min: 12,
        max: 96,
        step: 2,
        default: 36
      },
      {
        kind: 'slider',
        id: 'gridMaskRadius',
        label: 'Grid mask radius',
        cssVar: '--design-grid-mask',
        cssUnit: '%',
        min: 30,
        max: 100,
        step: 1,
        default: 70
      },
      {
        kind: 'slider',
        id: 'cardSaturation',
        label: 'Card saturation',
        cssVar: '--design-card-saturation',
        cssUnit: '',
        min: 0,
        max: 2,
        step: 0.05,
        default: 1
      },
      {
        kind: 'slider',
        id: 'cardHueShift',
        label: 'Card hue shift',
        cssVar: '--design-card-hue',
        cssUnit: 'deg',
        min: -180,
        max: 180,
        step: 1,
        default: 0
      },
      {
        kind: 'slider',
        id: 'cardContrast',
        label: 'Card contrast',
        cssVar: '--design-card-contrast',
        cssUnit: '',
        min: 0.5,
        max: 1.5,
        step: 0.02,
        default: 1
      },
      {
        kind: 'select',
        id: 'mono',
        label: 'Monochrome',
        cssVar: '--design-mono',
        options: [
          { value: '0', label: 'Off (default)' },
          { value: '0.5', label: 'Half' },
          { value: '1', label: 'Full greyscale' }
        ],
        default: '0'
      },
      {
        kind: 'color',
        id: 'accentOverride',
        label: 'Accent override',
        cssVar: '--design-accent-override',
        default: '#e8a547'
      },
      {
        kind: 'toggle',
        id: 'accentOn',
        label: 'Use accent override',
        dataAttr: 'accent-on',
        default: false
      }
    ]
  },
  {
    id: 'palette',
    label: 'Palette presets',
    hint: 'One-click recolors of the deck (sets canvas + filters).',
    params: [
      {
        kind: 'select',
        id: 'paletteMode',
        label: 'Palette',
        dataAttr: 'palette',
        options: [
          { value: 'default', label: 'Pip / warm cream (default)' },
          { value: 'riso', label: 'Risograph (high-key)' },
          { value: 'pastel', label: 'Pastel haze' },
          { value: 'brutalist', label: 'Brutalist (high contrast)' },
          { value: 'newsprint', label: 'Newsprint (sepia)' },
          { value: 'editorial', label: 'Editorial (cool greys)' },
          { value: 'midnight', label: 'Midnight (dimmed)' }
        ],
        default: 'default'
      },
      {
        kind: 'select',
        id: 'bgPattern',
        label: 'Background pattern',
        dataAttr: 'bg-pattern',
        options: [
          { value: 'dots', label: 'Dots (default)' },
          { value: 'grid', label: 'Grid lines' },
          { value: 'lines', label: 'Diagonal lines' },
          { value: 'plus', label: 'Plus marks' },
          { value: 'noise', label: 'Noise' },
          { value: 'none', label: 'None (flat)' }
        ],
        default: 'dots'
      },
      {
        kind: 'toggle',
        id: 'cardNoise',
        label: 'Card noise texture',
        dataAttr: 'card-noise',
        default: false
      }
    ]
  },
  {
    id: 'motion',
    label: 'Motion timing',
    hint: 'Entrance, stagger, hover speed.',
    params: [
      {
        kind: 'slider',
        id: 'entranceDur',
        label: 'Entrance duration',
        cssVar: '--design-entrance-dur',
        cssUnit: 'ms',
        min: 100,
        max: 1500,
        step: 10,
        default: 600
      },
      {
        kind: 'slider',
        id: 'staggerRow',
        label: 'Row stagger',
        cssVar: '--design-stagger-row',
        cssUnit: 'ms',
        min: 0,
        max: 240,
        step: 5,
        default: 90
      },
      {
        kind: 'slider',
        id: 'staggerCol',
        label: 'Col stagger',
        cssVar: '--design-stagger-col',
        cssUnit: 'ms',
        min: 0,
        max: 100,
        step: 1,
        default: 22
      },
      {
        kind: 'slider',
        id: 'hoverInDur',
        label: 'Hover-in',
        cssVar: '--design-hover-in',
        cssUnit: 'ms',
        min: 30,
        max: 600,
        step: 10,
        default: 90
      },
      {
        kind: 'slider',
        id: 'hoverOutDur',
        label: 'Hover-out',
        cssVar: '--design-hover-out',
        cssUnit: 'ms',
        min: 60,
        max: 800,
        step: 10,
        default: 180
      },
      {
        kind: 'select',
        id: 'easeFamily',
        label: 'Easing',
        cssVar: '--design-ease',
        options: [
          {
            value: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
            label: 'Snap (default)'
          },
          { value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'Spring snap' },
          { value: 'cubic-bezier(0.34, 1.4, 0.4, 1)', label: 'Spring soft' },
          { value: 'cubic-bezier(0.165, 0.84, 0.44, 1)', label: 'Quart' },
          { value: 'cubic-bezier(0.23, 1, 0.32, 1)', label: 'Quint' },
          { value: 'cubic-bezier(0.4, 0, 0.2, 1)', label: 'Material standard' },
          { value: 'linear', label: 'Linear' }
        ],
        default: 'cubic-bezier(0.2, 0.9, 0.2, 1)'
      },
      {
        kind: 'select',
        id: 'illusAnim',
        label: 'Illustration motion',
        cssVar: '--design-illus-anim',
        options: [
          { value: 'paused', label: 'Hover only (default)' },
          { value: 'running', label: 'Always animate' }
        ],
        default: 'paused'
      }
    ]
  },
  {
    id: 'micro',
    label: 'Micro-interactions',
    hint: 'Pointer-driven flourishes; off by default for product UIs.',
    params: [
      {
        kind: 'select',
        id: 'parallax',
        label: 'Cursor parallax',
        dataAttr: 'parallax',
        options: [
          { value: 'off', label: 'Off (default)' },
          { value: 'subtle', label: 'Subtle' },
          { value: 'strong', label: 'Strong' }
        ],
        default: 'off'
      },
      {
        kind: 'slider',
        id: 'cardTilt',
        label: 'Card tilt on hover',
        cssVar: '--design-card-tilt',
        cssUnit: 'deg',
        min: 0,
        max: 16,
        step: 0.5,
        default: 0
      },
      {
        kind: 'toggle',
        id: 'magnetic',
        label: 'Magnetic hover',
        dataAttr: 'magnetic',
        default: false
      },
      {
        kind: 'toggle',
        id: 'showCursor',
        label: 'Highlight cursor lens',
        dataAttr: 'cursor-highlight',
        default: true
      }
    ]
  },
  {
    id: 'overlay',
    label: 'Overlays & dialog',
    hint: 'Side panel and index dialog chrome.',
    params: [
      {
        kind: 'slider',
        id: 'panelWidth',
        label: 'Side panel width',
        cssVar: '--design-panel-width',
        cssUnit: 'px',
        min: 320,
        max: 720,
        step: 10,
        default: 480
      },
      {
        kind: 'slider',
        id: 'overlayBlur',
        label: 'Overlay blur',
        cssVar: '--design-overlay-blur',
        cssUnit: 'px',
        min: 0,
        max: 24,
        step: 0.5,
        default: 3
      },
      {
        kind: 'slider',
        id: 'overlayDim',
        label: 'Overlay dim',
        cssVar: '--design-overlay-dim',
        cssUnit: '',
        min: 0,
        max: 0.85,
        step: 0.02,
        default: 0.4
      },
      {
        kind: 'slider',
        id: 'dialogWidth',
        label: 'Dialog max-width',
        cssVar: '--design-dialog-width',
        cssUnit: 'px',
        min: 480,
        max: 1100,
        step: 10,
        default: 760
      },
      {
        kind: 'slider',
        id: 'dialogRadius',
        label: 'Dialog radius',
        cssVar: '--design-dialog-radius',
        cssUnit: 'px',
        min: 0,
        max: 40,
        step: 1,
        default: 18
      },
      {
        kind: 'select',
        id: 'dialogDensity',
        label: 'Dialog row density',
        cssVar: '--design-dialog-density',
        options: [
          { value: '8px 12px', label: 'Compact' },
          { value: '12px 14px', label: 'Default' },
          { value: '18px 18px', label: 'Airy' }
        ],
        default: '12px 14px'
      },
      {
        kind: 'select',
        id: 'panelSide',
        label: 'Side panel side',
        dataAttr: 'panel-side',
        options: [
          { value: 'right', label: 'Right (default)' },
          { value: 'left', label: 'Left' },
          { value: 'sheet', label: 'Bottom sheet' }
        ],
        default: 'right'
      },
      {
        kind: 'toggle',
        id: 'showRelated',
        label: 'Show related chips',
        dataAttr: 'related',
        default: true
      },
      {
        kind: 'toggle',
        id: 'dialogShowArt',
        label: 'Dialog illustrations',
        dataAttr: 'dialog-art',
        default: true
      },
      {
        kind: 'toggle',
        id: 'dialogShowTagline',
        label: 'Dialog taglines',
        dataAttr: 'dialog-tagline',
        default: true
      },
      {
        kind: 'toggle',
        id: 'dialogGroup',
        label: 'Group by category',
        dataAttr: 'dialog-group',
        default: false
      }
    ]
  },
  {
    id: 'content',
    label: 'Content & copy',
    hint: 'Card text, eyebrow, body length.',
    params: [
      {
        kind: 'toggle',
        id: 'cardEyebrow',
        label: 'Show category on cards',
        dataAttr: 'card-eyebrow',
        default: false
      },
      {
        kind: 'toggle',
        id: 'cardTagline',
        label: 'Show tagline on hover',
        dataAttr: 'card-tagline',
        default: false
      },
      {
        kind: 'select',
        id: 'eyebrowCase',
        label: 'Eyebrow case',
        cssVar: '--design-eyebrow-case',
        options: [
          { value: 'uppercase', label: 'UPPERCASE (default)' },
          { value: 'lowercase', label: 'lowercase' },
          { value: 'capitalize', label: 'Title Case' },
          { value: 'none', label: 'As written' }
        ],
        default: 'uppercase'
      },
      {
        kind: 'slider',
        id: 'eyebrowTracking',
        label: 'Eyebrow tracking',
        cssVar: '--design-eyebrow-tracking',
        cssUnit: 'em',
        min: 0,
        max: 0.32,
        step: 0.005,
        default: 0.18
      },
      {
        kind: 'select',
        id: 'bodyDensity',
        label: 'Body density',
        dataAttr: 'body-density',
        options: [
          { value: 'full', label: 'Full essay (default)' },
          { value: 'tldr', label: 'TLDR — first paragraph' },
          { value: 'tagline', label: 'Tagline only' }
        ],
        default: 'full'
      },
      {
        kind: 'toggle',
        id: 'emphasisItalic',
        label: 'Italicize emphasis',
        cssVar: '--design-em-style',
        whenOn: 'italic',
        whenOff: 'normal',
        default: true
      },
      {
        kind: 'toggle',
        id: 'emphasisUnderline',
        label: 'Underline emphasis',
        dataAttr: 'em-underline',
        default: true
      }
    ]
  },
  {
    id: 'debug',
    label: 'Debug overlays',
    hint: 'Visualize layout + a11y while tuning.',
    params: [
      {
        kind: 'toggle',
        id: 'showGrid',
        label: 'Grid lines',
        dataAttr: 'show-grid',
        default: false
      },
      {
        kind: 'toggle',
        id: 'showTapTargets',
        label: '44px tap targets',
        dataAttr: 'show-taps',
        default: false
      },
      {
        kind: 'toggle',
        id: 'showAria',
        label: 'ARIA labels',
        dataAttr: 'show-aria',
        default: false
      },
      {
        kind: 'toggle',
        id: 'showOutlines',
        label: 'Layout outlines',
        dataAttr: 'show-outlines',
        default: false
      }
    ]
  }
]

/* Flatten for fast lookup. */
const PARAM_BY_ID = (() => {
  const out: Record<string, Param> = {}
  for (const s of SECTIONS) {
    for (const p of s.params) out[p.id] = p
  }
  return out
})()

/* Sections that the Chaos randomizer leaves alone. Debug overlays
 * are tools, not design — randomly toggling grid lines or aria
 * tooltips while you're trying to evaluate a chaos roll just adds
 * noise on top of noise. */
const NO_RANDOMIZE_SECTIONS = new Set(['debug'])

/* Individual param ids the randomizer also skips. Grid columns and
 * center card span re-flow the entire deck — letting chaos churn
 * those makes the whole composition unrecognizable from one roll
 * to the next. Easier to tune them deliberately. */
const NO_RANDOMIZE_PARAM_IDS = ['gridCols', 'centerSpan']

const NO_RANDOMIZE_IDS = (() => {
  const out = new Set<string>(NO_RANDOMIZE_PARAM_IDS)
  for (const s of SECTIONS) {
    if (NO_RANDOMIZE_SECTIONS.has(s.id)) {
      for (const p of s.params) out.add(p.id)
    }
  }
  return out
})()

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
      const opt = param.options[Math.floor(Math.random() * param.options.length)]
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
export function ignoreDesignPanelOutside(
  event: { target: EventTarget | null; preventDefault: () => void }
) {
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
      p.kind === 'toggle' ? p.default : p.kind === 'slider' ? p.default : p.default
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
      if (param.cssVar) root.style.setProperty(param.cssVar, `${num}${param.cssUnit}`)
    } else if (param.kind === 'select') {
      const raw = String(v ?? param.default)
      // Decode underscores back to spaces for values like padding shorthands.
      const decoded = raw.replaceAll('_', ' ')
      if (param.cssVar) root.style.setProperty(param.cssVar, decoded)
      if (param.dataAttr) root.setAttribute(`data-design-${param.dataAttr}`, decoded)
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
      next.paletteMode = prev.paletteMode
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
    /* Also log so the user can grab it from devtools if clipboard
       isn't available. */
    console.info('[DesignPanel] preset:', json)
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
        {section.params.map((param) => (
          <ParamRow
            key={param.id}
            param={param}
            value={values[param.id]}
            onChange={(v) => setValue(param.id, v)}
          />
        ))}
      </div>
    </details>
  )
}

function ParamRow({
  param,
  value,
  onChange
}: {
  param: Param
  value: string | number | boolean | undefined
  onChange: (v: string | number | boolean) => void
}) {
  if (param.kind === 'slider') {
    const v = typeof value === 'number' ? value : param.default
    return (
      <label className={styles.row}>
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
      <label className={styles.row}>
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
      <label className={styles.row}>
        <span className={styles.rowLabel}>{param.label}</span>
        <span className={styles.rowControl}>
          <input
            type='color'
            value={v}
            onChange={(e) => onChange(e.target.value)}
            className={styles.colorInput}
            aria-label={param.label}
          />
          <input
            type='text'
            value={v}
            onChange={(e) => onChange(e.target.value)}
            className={styles.textInput}
            spellCheck={false}
          />
        </span>
      </label>
    )
  }
  // toggle
  const v = typeof value === 'boolean' ? value : param.default
  return (
    <label className={styles.row}>
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
