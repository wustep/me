import styles from './LensesCover.module.css'

/**
 * LensesCover
 *
 *   A miniature, fanned-out spread of "lens" cards used as the cover
 *   image for the Lenses playground entry. The card colors and glyphs
 *   are pulled from the actual lenses palette so the cover reads as a
 *   visual sample of the page itself.
 *
 *   On hover, the fan spreads slightly further and lifts — echoing the
 *   live page's prominent hover state.
 */

type CoverCard = {
  bg: string
  fg: string
  accent: string
  glyph: 'eye' | 'arrow' | 'circle' | 'triangle' | 'square' | 'spark'
  label: string
}

const CARDS: CoverCard[] = [
  {
    bg: '#1F2A5C',
    fg: '#F1EFE3',
    accent: '#F2C04A',
    glyph: 'eye',
    label: 'Frame'
  },
  {
    bg: '#C84A2C',
    fg: '#FAF7EE',
    accent: '#1F2A5C',
    glyph: 'arrow',
    label: 'Agency'
  },
  {
    bg: '#EFE6D2',
    fg: '#1A1A1A',
    accent: '#C84A2C',
    glyph: 'circle',
    label: 'Focus'
  },
  {
    bg: '#3F8F6A',
    fg: '#F5F1E8',
    accent: '#F2C04A',
    glyph: 'triangle',
    label: 'Signal'
  },
  {
    bg: '#D4A53A',
    fg: '#1F2A5C',
    accent: '#C84A2C',
    glyph: 'square',
    label: 'System'
  },
  {
    bg: '#8F3E62',
    fg: '#F5EFE0',
    accent: '#F0B8CE',
    glyph: 'spark',
    label: 'Taste'
  },
  {
    bg: '#204A40',
    fg: '#F5EFE0',
    accent: '#A9D8B8',
    glyph: 'circle',
    label: 'Energy'
  }
]

export function LensesCover() {
  return (
    <div className={styles.cover}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.rings} aria-hidden />
      <div className={styles.fan}>
        {CARDS.map((card, i) => (
          <span
            key={i}
            className={styles.card}
            style={
              {
                background: card.bg,
                color: card.fg,
                '--accent': card.accent,
                '--card-i': i,
                '--card-n': CARDS.length
              } as React.CSSProperties
            }
          >
            <Glyph kind={card.glyph} />
            <span className={styles.cardLabel}>{card.label}</span>
          </span>
        ))}
      </div>
      <div className={styles.titleLockup}>
        <span>Playground</span>
        <strong>Lenses</strong>
      </div>
    </div>
  )
}

function Glyph({ kind }: { kind: CoverCard['glyph'] }) {
  switch (kind) {
    case 'eye':
      return (
        <svg viewBox='0 0 24 24' className={styles.glyph} aria-hidden>
          <path
            d='M2 12 C 6 5, 18 5, 22 12 C 18 19, 6 19, 2 12 Z'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <circle cx='12' cy='12' r='3.5' fill='var(--accent)' />
        </svg>
      )
    case 'arrow':
      return (
        <svg viewBox='0 0 24 24' className={styles.glyph} aria-hidden>
          <path
            d='M5 12 L19 12 M13 6 L19 12 L13 18'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.8'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      )
    case 'circle':
      return (
        <svg viewBox='0 0 24 24' className={styles.glyph} aria-hidden>
          <circle
            cx='12'
            cy='12'
            r='8'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <circle cx='12' cy='12' r='2.5' fill='var(--accent)' />
        </svg>
      )
    case 'triangle':
      return (
        <svg viewBox='0 0 24 24' className={styles.glyph} aria-hidden>
          <path
            d='M12 4 L20 19 L4 19 Z'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinejoin='round'
          />
          <circle cx='12' cy='14' r='1.8' fill='var(--accent)' />
        </svg>
      )
    case 'square':
      return (
        <svg viewBox='0 0 24 24' className={styles.glyph} aria-hidden>
          <rect
            x='5'
            y='5'
            width='14'
            height='14'
            rx='1.5'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
          />
          <rect
            x='9.5'
            y='9.5'
            width='5'
            height='5'
            rx='0.5'
            fill='var(--accent)'
          />
        </svg>
      )
    case 'spark':
      return (
        <svg viewBox='0 0 24 24' className={styles.glyph} aria-hidden>
          <path
            d='M12 3 L14.4 9.6 L21 12 L14.4 14.4 L12 21 L9.6 14.4 L3 12 L9.6 9.6 Z'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.45'
            strokeLinejoin='round'
          />
          <circle cx='12' cy='12' r='2.5' fill='var(--accent)' />
        </svg>
      )
  }
}
