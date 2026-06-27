import { crimsonPro, geist, inter } from './fonts'

export type DesignFont = {
  id: string
  name: string
  family: string
  note: string
}

const sansFamily = (name: string) => `'${name}', system-ui, sans-serif`
const serifFamily = (name: string) => `'${name}', Georgia, serif`

// Kept out of next/font on purpose: the large exploration catalog should only
// be requested by the font tester, never by normal production routes.
const googleFontRequests = [
  'Alegreya:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Archivo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Bricolage Grotesque:wght@400;500;600;700',
  'Cormorant Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'DM Serif Text:ital@0;1',
  'EB Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Fraunces:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Funnel Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'IBM Plex Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Instrument Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Karla:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Lexend:wght@400;500;600;700',
  'Literata:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Manrope:wght@400;500;600;700',
  'Merriweather:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Newsreader:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Public Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Roboto Serif:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Source Sans 3:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Source Serif 4:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Spectral:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Vollkorn:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600',
  'Work Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600'
]

export const designFontsStylesheetUrl = `https://fonts.googleapis.com/css2?${googleFontRequests
  .map((font) => `family=${font.replaceAll(' ', '+')}`)
  .join('&')}&display=swap`

export const designSansFonts: DesignFont[] = [
  {
    id: 'inter',
    name: 'Inter',
    family: inter.style.fontFamily,
    note: 'Current · neutral and compact'
  },
  {
    id: 'instrument-sans',
    name: 'Instrument Sans',
    family: sansFamily('Instrument Sans'),
    note: 'Warm, editorial grotesk'
  },
  {
    id: 'ibm-plex-sans',
    name: 'IBM Plex Sans',
    family: sansFamily('IBM Plex Sans'),
    note: 'Technical with human details'
  },
  {
    id: 'manrope',
    name: 'Manrope',
    family: sansFamily('Manrope'),
    note: 'Open and geometric'
  },
  {
    id: 'geist',
    name: 'Geist',
    family: geist.style.fontFamily,
    note: 'Crisp, contemporary interface'
  },
  {
    id: 'archivo',
    name: 'Archivo',
    family: sansFamily('Archivo'),
    note: 'Compact neo-grotesk'
  },
  {
    id: 'bricolage-grotesque',
    name: 'Bricolage Grotesque',
    family: sansFamily('Bricolage Grotesque'),
    note: 'Eccentric and expressive'
  },
  {
    id: 'figtree',
    name: 'Figtree',
    family: sansFamily('Figtree'),
    note: 'Friendly and contemporary'
  },
  {
    id: 'funnel-sans',
    name: 'Funnel Sans',
    family: sansFamily('Funnel Sans'),
    note: 'Narrow, efficient rhythm'
  },
  {
    id: 'karla',
    name: 'Karla',
    family: sansFamily('Karla'),
    note: 'Informal humanist sans'
  },
  {
    id: 'lexend',
    name: 'Lexend',
    family: sansFamily('Lexend'),
    note: 'Legibility-first and spacious'
  },
  {
    id: 'public-sans',
    name: 'Public Sans',
    family: sansFamily('Public Sans'),
    note: 'Neutral civic workhorse'
  },
  {
    id: 'source-sans',
    name: 'Source Sans 3',
    family: sansFamily('Source Sans 3'),
    note: 'Open and highly readable'
  },
  {
    id: 'work-sans',
    name: 'Work Sans',
    family: sansFamily('Work Sans'),
    note: 'Clean editorial utility'
  }
]

export const designSerifFonts: DesignFont[] = [
  {
    id: 'crimson-pro',
    name: 'Crimson Pro',
    family: crimsonPro.style.fontFamily,
    note: 'Current · literary and familiar'
  },
  {
    id: 'newsreader',
    name: 'Newsreader',
    family: serifFamily('Newsreader'),
    note: 'Editorial, calm, made for screens'
  },
  {
    id: 'source-serif',
    name: 'Source Serif 4',
    family: serifFamily('Source Serif 4'),
    note: 'Quiet, sturdy long-form reading'
  },
  {
    id: 'fraunces',
    name: 'Fraunces',
    family: serifFamily('Fraunces'),
    note: 'Expressive and soft-edged'
  },
  {
    id: 'alegreya',
    name: 'Alegreya',
    family: serifFamily('Alegreya'),
    note: 'Lively literary rhythm'
  },
  {
    id: 'cormorant-garamond',
    name: 'Cormorant Garamond',
    family: serifFamily('Cormorant Garamond'),
    note: 'Elegant, high-contrast classic'
  },
  {
    id: 'dm-serif-text',
    name: 'DM Serif Text',
    family: serifFamily('DM Serif Text'),
    note: 'Sturdy display character'
  },
  {
    id: 'eb-garamond',
    name: 'EB Garamond',
    family: serifFamily('EB Garamond'),
    note: 'Classic book typography'
  },
  {
    id: 'literata',
    name: 'Literata',
    family: serifFamily('Literata'),
    note: 'Made for digital reading'
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    family: serifFamily('Merriweather'),
    note: 'Robust at screen sizes'
  },
  {
    id: 'roboto-serif',
    name: 'Roboto Serif',
    family: serifFamily('Roboto Serif'),
    note: 'Flexible and contemporary'
  },
  {
    id: 'spectral',
    name: 'Spectral',
    family: serifFamily('Spectral'),
    note: 'Serious editorial texture'
  },
  {
    id: 'vollkorn',
    name: 'Vollkorn',
    family: serifFamily('Vollkorn'),
    note: 'Warm, dark book face'
  }
]

export const designFontPairs = [
  {
    id: 'current',
    name: 'Current',
    sansId: 'inter',
    serifId: 'crimson-pro',
    note: 'Familiar and literary'
  },
  {
    id: 'modern-editorial',
    name: 'Modern editorial',
    sansId: 'instrument-sans',
    serifId: 'newsreader',
    note: 'Warm, confident, very readable'
  },
  {
    id: 'quiet-technical',
    name: 'Quiet technical',
    sansId: 'ibm-plex-sans',
    serifId: 'source-serif',
    note: 'Precise without feeling clinical'
  },
  {
    id: 'friendly-essayist',
    name: 'Friendly essayist',
    sansId: 'manrope',
    serifId: 'fraunces',
    note: 'Round, personal, more expressive'
  },
  {
    id: 'digital-journal',
    name: 'Digital journal',
    sansId: 'geist',
    serifId: 'newsreader',
    note: 'Clean chrome with a reading voice'
  },
  {
    id: 'bookish-humanist',
    name: 'Bookish humanist',
    sansId: 'karla',
    serifId: 'alegreya',
    note: 'Lively and approachable'
  },
  {
    id: 'high-contrast',
    name: 'High contrast',
    sansId: 'archivo',
    serifId: 'cormorant-garamond',
    note: 'Compact chrome, elegant prose'
  },
  {
    id: 'readable-screen',
    name: 'Readable screen',
    sansId: 'lexend',
    serifId: 'merriweather',
    note: 'Open shapes at practical sizes'
  },
  {
    id: 'classic-web',
    name: 'Classic web',
    sansId: 'source-sans',
    serifId: 'eb-garamond',
    note: 'Clear utility and bookish depth'
  },
  {
    id: 'character-study',
    name: 'Character study',
    sansId: 'bricolage-grotesque',
    serifId: 'roboto-serif',
    note: 'Expressive without losing clarity'
  }
] as const

export const getDesignFont = (
  fonts: DesignFont[],
  id: string,
  fallbackId: string
): DesignFont =>
  fonts.find((font) => font.id === id) ??
  fonts.find((font) => font.id === fallbackId) ??
  fonts[0]!
