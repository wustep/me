import localFont from 'next/font/local'

/**
 * Quiet-craft type system, scoped to the /prompting pages.
 *
 *   Source Serif 4 — the book voice. Carries chapter titles, the cover
 *   title, and pull moments at weight 400–500 with real optical sizing,
 *   so display sizes set tighter and darker than text sizes on their
 *   own. Body copy stays on the platform's system face (declared in
 *   CSS, nothing to load): reading text should feel native, not dressed.
 *
 *   Roboto Mono — what you type into the machine: prompts, specimens,
 *   inline code. A terminal voice rather than a typewriter costume.
 *
 * Both are self-hosted from lib/fonts/files (see the README there): the
 * variable Latin files Google Fonts serves, opsz axis included. Roboto Mono
 * stands in for the earlier mono because its metrics nearly match it
 * (x-height 0.528 vs 0.530 em, same 0.6 em advance), so specimens keep
 * their line lengths.
 */
export const manualSerif = localFont({
  src: [
    {
      path: '../../../lib/fonts/files/source-serif-4/source-serif-4-latin.woff2',
      weight: '200 900',
      style: 'normal'
    },
    {
      path: '../../../lib/fonts/files/source-serif-4/source-serif-4-latin-italic.woff2',
      weight: '200 900',
      style: 'italic'
    }
  ],
  variable: '--pm-serif',
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
  fallback: ['Iowan Old Style', 'Palatino Linotype', 'Georgia', 'serif']
})

export const manualMono = localFont({
  src: [
    {
      path: '../../../lib/fonts/files/roboto-mono/roboto-mono-latin.woff2',
      weight: '100 700',
      style: 'normal'
    }
  ],
  variable: '--pm-mono',
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
  fallback: ['SFMono-Regular', 'Menlo', 'Consolas', 'monospace']
})
