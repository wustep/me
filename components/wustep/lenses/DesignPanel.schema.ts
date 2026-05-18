/**
 * DesignPanel schema — declarative parameter definitions and the
 * derived lookup tables used by the design panel UI.
 *
 * Extracted from DesignPanel.tsx so the schema can grow without
 * pushing the React component further down the file. Pure data /
 * types — no React imports.
 */

export type ParamSlider = {
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

export type ParamSelect = {
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

export type ParamColor = {
  kind: 'color'
  id: string
  label: string
  cssVar: string
  default: string
  /** When set, this row is rendered disabled/dimmed unless the
   *  referenced toggle param is on. Purely cosmetic — the value
   *  still applies to its CSS var, but the UI tells you the
   *  control is currently a no-op. */
  dependsOn?: { id: string; equals: boolean | string }
}

export type ParamToggle = {
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

export type Param = ParamSlider | ParamSelect | ParamColor | ParamToggle

export type Section = {
  id: string
  label: string
  /** Optional one-liner under the section title. */
  hint?: string
  params: Param[]
}

export const SECTIONS: Section[] = [
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
        // Drives `--design-serif`, which (despite its name, kept
        // for back-compat) is the body-text family across the
        // panel, dialog, and lens essays. Options now include
        // sans + mono so you can take the deck fully sans-serif
        // without touching anything else.
        label: 'Body family',
        cssVar: '--design-serif',
        options: [
          {
            value: "var(--font-serif, 'Crimson Pro', Georgia, serif)",
            label: 'Crimson Pro (default)'
          },
          { value: "Georgia, 'Times New Roman', serif", label: 'Georgia' },
          {
            value: "'Iowan Old Style', 'Palatino', serif",
            label: 'Iowan / Palatino'
          },
          { value: 'ui-serif, serif', label: 'System serif' },
          {
            value:
              'var(--font-geist, var(--font-sans, system-ui)), system-ui, sans-serif',
            label: 'Geist (sans)'
          },
          {
            value:
              "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            label: 'Inter (sans)'
          },
          {
            value:
              "ui-monospace, 'JetBrains Mono', 'SF Mono', Menlo, monospace",
            label: 'Monospace'
          }
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
            value: 'var(--font-geist, var(--font-sans, system-ui), sans-serif)',
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
            value: 'system-ui, sans-serif',
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
        kind: 'slider',
        id: 'mono',
        label: 'Monochrome',
        cssVar: '--design-mono',
        cssUnit: '',
        min: 0,
        max: 1,
        step: 0.05,
        default: 0,
        // Greyscale near 0 reads as "color-faded", which is
        // visually interesting; full 1 is rarely the move. Bias
        // chaos toward partial desaturation.
        chaosMin: 0,
        chaosMax: 0.6
      },
      {
        kind: 'toggle',
        id: 'accentOn',
        label: 'Use accent override',
        dataAttr: 'accent-on',
        default: false
      },
      {
        kind: 'color',
        id: 'accentOverride',
        label: 'Accent override',
        cssVar: '--design-accent-override',
        default: '#e8a547',
        // Color picker only does anything once the toggle above
        // it is on. Dim the row when off so it reads as gated.
        dependsOn: { id: 'accentOn', equals: true }
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
          { value: 'none', label: 'None (default)' },
          { value: 'dots', label: 'Dots' },
          { value: 'grid', label: 'Grid lines' },
          { value: 'lines', label: 'Diagonal lines' },
          { value: 'plus', label: 'Plus marks' },
          { value: 'noise', label: 'Noise' }
        ],
        default: 'none'
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
        default: 540
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
        id: 'eyebrowWeight',
        label: 'Eyebrow weight',
        cssVar: '--design-eyebrow-weight',
        options: [
          { value: '400', label: 'Regular' },
          { value: '500', label: 'Medium (default)' },
          { value: '600', label: 'Semibold' },
          { value: '700', label: 'Bold' }
        ],
        default: '500'
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
export const PARAM_BY_ID = (() => {
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
export const NO_RANDOMIZE_SECTIONS = new Set(['debug'])

/* Individual param ids the randomizer also skips. Grid columns and
 * center card span re-flow the entire deck — letting chaos churn
 * those makes the whole composition unrecognizable from one roll
 * to the next. Easier to tune them deliberately. */
export const NO_RANDOMIZE_PARAM_IDS = ['gridCols', 'centerSpan']

export const NO_RANDOMIZE_IDS = (() => {
  const out = new Set<string>(NO_RANDOMIZE_PARAM_IDS)
  for (const s of SECTIONS) {
    if (NO_RANDOMIZE_SECTIONS.has(s.id)) {
      for (const p of s.params) out.add(p.id)
    }
  }
  return out
})()
