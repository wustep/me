/** Small physical props shared by the preview-only Jev illustrations. */
export function JevObject({
  kind
}: {
  kind: 'music' | 'trolley' | 'inbox' | 'match'
}) {
  switch (kind) {
    case 'music':
      return (
        <g fill='currentColor'>
          <ellipse
            cx='-10'
            cy='13'
            rx='9'
            ry='6'
            transform='rotate(-20 -10 13)'
          />
          <ellipse cx='15' cy='7' rx='9' ry='6' transform='rotate(-20 15 7)' />
          <path d='M-3 13V-21L22-27V7H18V-15L1-11V13Z' />
        </g>
      )
    case 'trolley':
      return (
        <g stroke='#302c32' strokeWidth='2.5' strokeLinejoin='round'>
          <path d='M-8-19 2-30H14' fill='none' />
          <rect
            x='-25'
            y='-18'
            width='50'
            height='34'
            rx='6'
            fill='currentColor'
          />
          <path
            d='M-19-11H-5V0H-19ZM3-11H18V0H3Z'
            fill='#fff6df'
            stroke='none'
          />
          <path d='M-25 7H25' />
          <circle cx='-15' cy='19' r='5' fill='#302c32' />
          <circle cx='15' cy='19' r='5' fill='#302c32' />
        </g>
      )
    case 'inbox':
      return (
        <g stroke='#302c32' strokeWidth='2.5' strokeLinejoin='round'>
          <rect
            x='-28'
            y='-18'
            width='56'
            height='38'
            rx='3'
            fill='currentColor'
          />
          <path d='M-26-16 0 4 26-16M-26 18-8 1M26 18 8 1' fill='none' />
        </g>
      )
    case 'match':
      return (
        <g fill='currentColor' stroke='#302c32' strokeWidth='2.5'>
          <circle cy='-17' r='10' />
          <path d='M-17 23V8C-17-8 17-8 17 8V23Z' />
        </g>
      )
  }
}
