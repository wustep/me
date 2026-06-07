/**
 * CloseIcon — small × glyph used in panel and dialog close buttons.
 */
export function CloseIcon() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      aria-hidden='true'
    >
      <line x1='2' y1='2' x2='12' y2='12' />
      <line x1='12' y1='2' x2='2' y2='12' />
    </svg>
  )
}

/**
 * ReadingArrowIcon — trailing arrow on a further-reading / quote link.
 * Mirrors the arrow used on the Notion posts gallery cards (an
 * arrow-up-right for external links), so the two surfaces feel of a
 * piece: 24×24 box, 2.5 stroke, round caps + joins. Internal links get
 * a horizontal arrow-right in the same hand.
 */
export function ReadingArrowIcon({ external }: { external: boolean }) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      {external ? (
        <>
          <path d='M7 17L17 7' />
          <path d='M7 7h10v10' />
        </>
      ) : (
        <>
          <path d='M5 12h14' />
          <path d='M13 6l6 6-6 6' />
        </>
      )}
    </svg>
  )
}

/**
 * ChevronIcon — left/right arrow head used by the prev/next buttons
 * on the side panel. `direction` rotates the same primitive so we
 * keep stroke weight and proportions consistent between the two.
 */
export function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      style={{
        transform: direction === 'left' ? 'scaleX(-1)' : undefined
      }}
    >
      <polyline points='5,2 10,7 5,12' />
    </svg>
  )
}
