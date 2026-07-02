import { Courier_Prime, Libre_Franklin } from 'next/font/google'

/**
 * Field-manual type system, scoped to the /prompting pages.
 *
 *   Libre Franklin — the Franklin/News Gothic lineage of American
 *   technical manuals. One family carries display and body via hard
 *   weight contrast (400 text / 600 labels / 800 display).
 *
 *   Courier Prime — the typewriter voice. Reserved for what you type
 *   into the machine: prompts, specimens, figure captions, folio marks.
 */
export const manualSans = Libre_Franklin({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal', 'italic'],
  variable: '--pm-sans',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['Franklin Gothic Medium', 'Arial Narrow', 'Arial', 'sans-serif']
})

export const manualMono = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--pm-mono',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['Courier New', 'Courier', 'monospace']
})
