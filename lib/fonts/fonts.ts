import { Crimson_Pro, Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'optional',
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

export const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'optional',
  preload: true,
  adjustFontFallback: true,
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif']
})
