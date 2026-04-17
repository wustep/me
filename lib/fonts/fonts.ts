import { Crimson_Pro, Geist, Inter } from 'next/font/google'

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
  weight: ['500', '700'],
  variable: '--font-geist',
  display: 'swap',
  preload: false,
  fallback: ['Inter', 'system-ui', 'sans-serif']
})

export const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif']
})
