import { Geist, Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif'
  ]
})

export const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-geist',
  display: 'swap',
  preload: false,
  fallback: ['Inter', 'system-ui', 'sans-serif']
})

// Geist Serif trial. Vendored from vercel/geist-font (OFL, see
// ./geist-serif/OFL.txt) because the `geist` npm release that adds it is
// newer than pnpm's minimumReleaseAge. It ships a single Regular face with no
// bold or italic, and `font-synthesis: none` is on, so 600 headings render at
// 400 and italic serif renders upright.
export const geistSerif = localFont({
  src: './geist-serif/GeistSerif-Regular.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-serif',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Times New Roman',
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif']
})
