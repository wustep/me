import styles from './JevCoverG.module.css'
import { jevTypeClass } from './jevCoverType'

/**
 * JevCoverG — the match card. Unshipped variant, kept for the
 * covers-preview workbench.
 *
 *   The match room as a ranked shortlist for "You": each candidate is
 *   scored by Jev (match.fit, a probability) and plain code sorts them.
 *   At rest the list is already ranked, bars full, the top pick marked in
 *   the room's purple. Hover re-runs it: the list scrambles, bars empty,
 *   each score fills in turn as Jev answers, then the rows slide into
 *   rank and the top slot lights.
 *
 *   The stage is wide (1200×240, sliced to the cover box); the card sits
 *   in the middle ~410 units a 16:9 card shows, and a wider card reveals
 *   the rest of the candidate pool waiting at the sides.
 */

const INK = '#16161a'
const SHEET = '#fbf8f1'
const LINE = '#d6cfbf'
const MUTED = '#7a756b'
const MATCH = '#5c4a7a'

const STAGE_W = 1200
const STAGE_H = 240

// Card centered on x=600, inside the 16:9 crop (~387–813).
const CARD = { x: 396, y: 22, w: 408, h: 196 }
const HEAD_H = 46
const ROW_H = (CARD.h - HEAD_H) / 3
const RANK_X = CARD.x + 16
const AVATAR_X = CARD.x + 48
const NAME_X = CARD.x + 70
const BAR = { x: 558, w: 180, h: 8 }
const P_X = CARD.x + CARD.w - 14

type Candidate = {
  id: 'ari' | 'bea' | 'cyd'
  name: string
  p: number
}

// Ranked order — the rest pose.
const RANKED: readonly Candidate[] = [
  { id: 'ari', name: 'Ari', p: 0.82 },
  { id: 'bea', name: 'Bea', p: 0.64 },
  { id: 'cyd', name: 'Cyd', p: 0.31 }
]

function rowClass(id: Candidate['id']) {
  // Scrambled order is Cyd, Ari, Bea: Cyd climbs two slots, the others
  // drop one.
  return `${styles.anim} ${id === 'cyd' ? styles.rowUp : styles.rowDown}`
}

function barClass(id: Candidate['id']) {
  switch (id) {
    case 'ari':
      return `${styles.anim} ${styles.bar} ${styles.barAri}`
    case 'bea':
      return `${styles.anim} ${styles.bar} ${styles.barBea}`
    case 'cyd':
      return `${styles.anim} ${styles.bar} ${styles.barCyd}`
  }
}

function probClass(id: Candidate['id']) {
  switch (id) {
    case 'ari':
      return `${styles.anim} ${styles.prob} ${styles.probAri}`
    case 'bea':
      return `${styles.anim} ${styles.prob} ${styles.probBea}`
    case 'cyd':
      return `${styles.anim} ${styles.prob} ${styles.probCyd}`
  }
}

// The rest of the pool, out past the crop for wide cards.
const POOL = [
  { x: 120, y: 70, i: 'D' },
  { x: 190, y: 150, i: 'E' },
  { x: 280, y: 90, i: 'F' },
  { x: 330, y: 180, i: 'G' },
  { x: 880, y: 60, i: 'H' },
  { x: 930, y: 160, i: 'J' },
  { x: 1020, y: 100, i: 'K' },
  { x: 1090, y: 180, i: 'L' }
] as const

export function JevCoverG() {
  return (
    <div className={`${styles.cover} ${jevTypeClass}`} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        {POOL.map((c) => (
          <g key={c.i} opacity='0.55'>
            <circle
              cx={c.x}
              cy={c.y}
              r='16'
              fill={SHEET}
              stroke={LINE}
              strokeWidth='1.2'
            />
            <text className={styles.initial} x={c.x} y={c.y + 5} fill={MUTED}>
              {c.i}
            </text>
          </g>
        ))}

        <rect
          x={CARD.x}
          y={CARD.y}
          width={CARD.w}
          height={CARD.h}
          fill={SHEET}
          stroke={INK}
          strokeWidth='1.5'
        />

        {/* Header: the question on the left, who it's ranked for on the
            right. */}
        <text className={styles.tag} x={RANK_X} y={CARD.y + 28} fill={MUTED}>
          match.fit
        </text>
        <text
          className={styles.for}
          x={CARD.x + CARD.w - 66}
          y={CARD.y + 28}
          fill={MUTED}
        >
          ranked for
        </text>
        <rect
          x={CARD.x + CARD.w - 58}
          y={CARD.y + 12}
          width='44'
          height='22'
          rx='11'
          fill={MATCH}
        />
        <text
          className={styles.you}
          x={CARD.x + CARD.w - 36}
          y={CARD.y + 27.5}
          fill={SHEET}
        >
          You
        </text>
        <line
          x1={CARD.x}
          x2={CARD.x + CARD.w}
          y1={CARD.y + HEAD_H}
          y2={CARD.y + HEAD_H}
          stroke={LINE}
          strokeWidth='1'
        />

        {/* Top slot highlight; it belongs to the slot, not the row. */}
        <g className={`${styles.anim} ${styles.top}`}>
          <rect
            x={CARD.x + 0.75}
            y={CARD.y + HEAD_H + 0.5}
            width={CARD.w - 1.5}
            height={ROW_H - 1}
            fill={MATCH}
            fillOpacity='0.09'
          />
          <rect
            x={CARD.x + 0.75}
            y={CARD.y + HEAD_H + 0.5}
            width='4'
            height={ROW_H - 1}
            fill={MATCH}
          />
        </g>

        {/* Rank numerals are fixed to the slots too. */}
        {RANKED.map((_, i) => (
          <text
            key={i}
            className={styles.tag}
            x={RANK_X + 4}
            y={CARD.y + HEAD_H + i * ROW_H + ROW_H / 2 + 4}
            fill={MUTED}
          >
            {i + 1}
          </text>
        ))}

        {RANKED.map((c, i) => {
          const cy = CARD.y + HEAD_H + i * ROW_H + ROW_H / 2
          return (
            <g key={c.id} className={rowClass(c.id)}>
              <circle
                cx={AVATAR_X}
                cy={cy}
                r='13'
                fill={SHEET}
                stroke={INK}
                strokeWidth='1.2'
              />
              <text
                className={styles.initial}
                x={AVATAR_X}
                y={cy + 5}
                fill={INK}
              >
                {c.name[0]}
              </text>
              <text className={styles.name} x={NAME_X} y={cy + 5} fill={INK}>
                {c.name}
              </text>
              <rect
                x={BAR.x}
                y={cy - BAR.h / 2}
                width={BAR.w}
                height={BAR.h}
                rx={BAR.h / 2}
                fill={LINE}
                fillOpacity='0.6'
              />
              <rect
                className={barClass(c.id)}
                x={BAR.x}
                y={cy - BAR.h / 2}
                width={BAR.w * c.p}
                height={BAR.h}
                rx={BAR.h / 2}
                fill={MATCH}
              />
              <text className={probClass(c.id)} x={P_X} y={cy + 4} fill={MATCH}>
                {c.p.toFixed(2).slice(1)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
