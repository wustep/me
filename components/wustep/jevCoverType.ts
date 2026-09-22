import { Fraunces, JetBrains_Mono } from 'next/font/google'

/**
 * Jev Playground's own faces, scoped to its covers.
 *
 *   The app sets Fraunces for names and JetBrains Mono for the small
 *   tags. Loading them here (and nowhere else) keeps a cover from falling
 *   back to the site's Crimson Pro, which would stop reading as the app.
 *   `preload: false` — these faces belong to the playground grid, not to
 *   every route that happens to share a document.
 */
export const jevSerif = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--jev-serif',
  display: 'swap',
  preload: false,
  adjustFontFallback: true,
  fallback: ['Georgia', 'Times New Roman', 'serif']
})

export const jevMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--jev-mono',
  display: 'swap',
  preload: false,
  adjustFontFallback: true,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
})

export const jevTypeClass = `${jevSerif.variable} ${jevMono.variable}`
