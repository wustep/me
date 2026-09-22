import styles from './JevCoverF.module.css'
import { jevTypeClass } from './jevCoverType'

/**
 * JevCoverF — stamped. Unshipped variant, kept for the covers-preview
 * workbench.
 *
 *   The inbox room as a mail desk: a letter on top of the pile, and Jev's
 *   inbox.action pressed onto it as a rubber stamp with its probability.
 *   At rest the last letter of the batch is already stamped LEAVE. Hover
 *   works the pile: a prize-desk letter slides up and gets DELETE, a note
 *   from a manager gets REVIEW, then the library notice comes back and the
 *   stamp thumps down again.
 *
 *   The stage is wide (1200×240, sliced to the cover box); the letter sits
 *   in the middle ~400 units a 16:9 card shows, and a wider card reveals
 *   the sorted piles to either side.
 */

const INK = '#16161a'
const SHEET = '#fbf8f1'
const LINE = '#d6cfbf'
const MUTED = '#7a756b'
const INBOX = '#3d5a80'

const STAGE_W = 1200
const STAGE_H = 240

// Letter centered on x=600, inside the 16:9 crop (~387–813).
const LETTER = { x: 414, y: 32, w: 372, h: 176 }
const PAD = 16
const STAMP = { cx: 694, cy: 162, w: 118, h: 50, tilt: -9 }

type Letter = {
  id: 'a' | 'b' | 'c'
  count: string
  from: string
  subject: string
  action: string
  p: string
}

// Batch order on hover: a, b, then c — the rest pose.
const LETTERS: readonly Letter[] = [
  {
    id: 'a',
    count: '1 / 3',
    from: 'Prize Desk',
    subject: 'You’ve won a cruise!!',
    action: 'DELETE',
    p: '.93'
  },
  {
    id: 'b',
    count: '2 / 3',
    from: 'Dana, your manager',
    subject: 'Q3 plan — thoughts?',
    action: 'REVIEW',
    p: '.77'
  },
  {
    id: 'c',
    count: '3 / 3',
    from: 'City Library',
    subject: 'Your hold is ready',
    action: 'LEAVE',
    p: '.71'
  }
]

function letterClass(id: Letter['id']) {
  switch (id) {
    case 'a':
      return `${styles.letter} ${styles.letterA}`
    case 'b':
      return `${styles.letter} ${styles.letterB}`
    case 'c':
      return `${styles.letter} ${styles.letterC}`
  }
}

function stampClass(id: Letter['id']) {
  switch (id) {
    case 'a':
      return `${styles.stamp} ${styles.stampA}`
    case 'b':
      return `${styles.stamp} ${styles.stampB}`
    case 'c':
      return `${styles.stamp} ${styles.stampC}`
  }
}

// Sorted piles out past the crop, for wide cards.
const PILES = [
  { label: 'delete', x: 250 },
  { label: 'review', x: 880 },
  { label: 'leave', x: 1040 }
] as const

function Envelope({ x, y, tilt }: { x: number; y: number; tilt: number }) {
  const w = 110
  const h = 64
  return (
    <g transform={`rotate(${tilt} ${x + w / 2} ${y + h / 2})`}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={SHEET}
        stroke={INK}
        strokeWidth='1.2'
      />
      <path
        d={`M${x} ${y} L${x + w / 2} ${y + h * 0.55} L${x + w} ${y}`}
        fill='none'
        stroke={LINE}
        strokeWidth='1.2'
      />
    </g>
  )
}

export function JevCoverF() {
  return (
    <div className={`${styles.cover} ${jevTypeClass}`} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        {PILES.map((pile) => (
          <g key={pile.label}>
            <Envelope x={pile.x} y={96} tilt={-4} />
            <Envelope x={pile.x + 4} y={90} tilt={3} />
            <text
              className={styles.tag}
              x={pile.x + 55}
              y={184}
              fill={MUTED}
              textAnchor='middle'
            >
              {pile.label}
            </text>
          </g>
        ))}

        {/* The rest of the pile, under whichever letter is up. */}
        <rect
          x={LETTER.x}
          y={LETTER.y}
          width={LETTER.w}
          height={LETTER.h}
          fill={SHEET}
          stroke={LINE}
          strokeWidth='1.2'
          transform={`rotate(2.2 600 120)`}
        />
        <rect
          x={LETTER.x}
          y={LETTER.y}
          width={LETTER.w}
          height={LETTER.h}
          fill={SHEET}
          stroke={LINE}
          strokeWidth='1.2'
          transform={`rotate(-1.4 600 120)`}
        />

        {LETTERS.map((letter) => {
          const left = LETTER.x + PAD
          const right = LETTER.x + LETTER.w - PAD
          return (
            <g key={letter.id} className={letterClass(letter.id)}>
              <rect
                x={LETTER.x}
                y={LETTER.y}
                width={LETTER.w}
                height={LETTER.h}
                fill={SHEET}
                stroke={INK}
                strokeWidth='1.5'
              />
              <text
                className={styles.tag}
                x={left}
                y={LETTER.y + 22}
                fill={MUTED}
              >
                inbox.action
              </text>
              <text
                className={styles.tag}
                x={right}
                y={LETTER.y + 22}
                fill={MUTED}
                textAnchor='end'
              >
                {letter.count}
              </text>
              <line
                x1={LETTER.x}
                x2={LETTER.x + LETTER.w}
                y1={LETTER.y + 32}
                y2={LETTER.y + 32}
                stroke={LINE}
                strokeWidth='1'
              />
              <text
                className={styles.from}
                x={left}
                y={LETTER.y + 56}
                fill={MUTED}
              >
                from <tspan fill={INK}>{letter.from}</tspan>
              </text>
              <text
                className={styles.subject}
                x={left}
                y={LETTER.y + 82}
                fill={INK}
              >
                {letter.subject}
              </text>
              {[300, 250, 170].map((w, i) => (
                <rect
                  key={w}
                  x={left}
                  y={LETTER.y + 100 + i * 14}
                  width={w}
                  height='5'
                  rx='2.5'
                  fill={LINE}
                />
              ))}

              {/* The stamp: tilt on the wrapper, thump on the inner group. */}
              <g transform={`rotate(${STAMP.tilt} ${STAMP.cx} ${STAMP.cy})`}>
                <g className={stampClass(letter.id)}>
                  <rect
                    x={STAMP.cx - STAMP.w / 2}
                    y={STAMP.cy - STAMP.h / 2}
                    width={STAMP.w}
                    height={STAMP.h}
                    rx='4'
                    fill={SHEET}
                    fillOpacity='0.7'
                    stroke={INBOX}
                    strokeWidth='3'
                  />
                  <text
                    className={styles.action}
                    x={STAMP.cx}
                    y={STAMP.cy + 3}
                    fill={INBOX}
                  >
                    {letter.action}
                  </text>
                  <text
                    className={styles.prob}
                    x={STAMP.cx}
                    y={STAMP.cy + 18}
                    fill={INBOX}
                  >
                    p {letter.p}
                  </text>
                </g>
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
