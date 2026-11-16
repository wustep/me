import localFont from 'next/font/local'

/**
 * Site-wide faces, self-hosted from ./files (see ./files/README.md).
 *
 * Each family is one variable woff2 per style — the exact Latin subset file
 * Google Fonts serves — listed once per weight so the @font-face rules match
 * what next/font/google used to generate (discrete weights, not a range, so
 * e.g. font-weight 500 on Crimson Pro still resolves to the 400 face).
 *
 * adjustFontFallback is off because next/font/google under Turbopack wasn't
 * emitting metric-adjusted fallback faces either; turning it on would change
 * how text looks while fonts load.
 */
export const inter = localFont({
  src: [
    { path: './files/inter/inter-latin.woff2', weight: '400', style: 'normal' },
    { path: './files/inter/inter-latin.woff2', weight: '500', style: 'normal' },
    { path: './files/inter/inter-latin.woff2', weight: '600', style: 'normal' }
  ],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif'
  ]
})

export const geist = localFont({
  src: [
    { path: './files/geist/geist-latin.woff2', weight: '400', style: 'normal' },
    { path: './files/geist/geist-latin.woff2', weight: '500', style: 'normal' },
    { path: './files/geist/geist-latin.woff2', weight: '600', style: 'normal' },
    { path: './files/geist/geist-latin.woff2', weight: '700', style: 'normal' }
  ],
  variable: '--font-geist',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  fallback: ['Inter', 'system-ui', 'sans-serif']
})

export const crimsonPro = localFont({
  src: [
    {
      path: './files/crimson-pro/crimson-pro-latin.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: './files/crimson-pro/crimson-pro-latin.woff2',
      weight: '600',
      style: 'normal'
    },
    {
      path: './files/crimson-pro/crimson-pro-latin-italic.woff2',
      weight: '400',
      style: 'italic'
    },
    {
      path: './files/crimson-pro/crimson-pro-latin-italic.woff2',
      weight: '600',
      style: 'italic'
    }
  ],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif']
})
