import localFont from 'next/font/local'

/**
 * Jev Playground's own faces, scoped to its covers.
 *
 *   The app sets Fraunces for names and JetBrains Mono for the small
 *   tags. Loading them here (and nowhere else) keeps a cover from falling
 *   back to the site's Crimson Pro, which would stop reading as the app.
 *   `preload: false` — these faces belong to the playground grid, not to
 *   every route that happens to share a document.
 *
 * Both are self-hosted from lib/fonts/files (see the README there).
 */
export const jevSerif = localFont({
  src: [
    {
      path: '../../lib/fonts/files/fraunces/fraunces-latin.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../lib/fonts/files/fraunces/fraunces-latin.woff2',
      weight: '600',
      style: 'normal'
    },
    {
      path: '../../lib/fonts/files/fraunces/fraunces-latin-italic.woff2',
      weight: '500',
      style: 'italic'
    },
    {
      path: '../../lib/fonts/files/fraunces/fraunces-latin-italic.woff2',
      weight: '600',
      style: 'italic'
    }
  ],
  variable: '--jev-serif',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  fallback: ['Georgia', 'Times New Roman', 'serif']
})

export const jevMono = localFont({
  src: [
    {
      path: '../../lib/fonts/files/jetbrains-mono/jetbrains-mono-latin-500.woff2',
      weight: '500',
      style: 'normal'
    }
  ],
  variable: '--jev-mono',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
})

export const jevTypeClass = `${jevSerif.variable} ${jevMono.variable}`
