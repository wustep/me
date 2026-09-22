import { useId } from 'react'

import styles from './JevCoverC.module.css'
import { jevTypeClass } from './jevCoverType'

/**
 * JevCoverC — the pick. Unshipped variant, kept for the covers-preview
 * workbench.
 *
 *   The signature mechanic, made huge: one dial stop. A 4px accent rule,
 *   the composer in Fraunces, the tagline, and the distribution Jev
 *   actually returns — one long bar (the argmax) and two short ones.
 *   Under it, the note that label became. At rest the stop is Bach, gold,
 *   and the note sits on the middle line. Hover resolves the next pick
 *   (Beethoven, Chopin, Debussy) and the note changes pitch with it.
 */

const INK = '#16161a'
const SHEET = '#fbf8f1'
const LINE = '#d6cfbf'

const CARD = { x: 456, y: 16, w: 288, h: 146 }
const LINE0 = 178
const GAP = 10
const MID = LINE0 + GAP * 2

const PICKS = [
  {
    id: 'bach',
    name: 'Bach',
    tag: 'counterpoint & dance',
    accent: '#9a6a1c',
    y: MID,
    on: styles.showBach
  },
  {
    id: 'beethoven',
    name: 'Beethoven',
    tag: 'motto, storm & song',
    accent: '#b3261e',
    y: LINE0,
    on: styles.showBeethoven
  },
  {
    id: 'chopin',
    name: 'Chopin',
    tag: 'cantabile & storm',
    accent: '#a84a62',
    y: LINE0 + GAP,
    on: styles.showChopin
  },
  {
    id: 'debussy',
    name: 'Debussy',
    tag: 'colour & haze',
    accent: '#23808f',
    y: MID + GAP,
    on: styles.showDebussy
  }
] as const

function Note({ y, accent }: { y: number; accent: string }) {
  const stemDown = y < MID
  const stemX = stemDown ? -7 : 7
  const stemY = stemDown ? 32 : -32
  return (
    <g transform={`translate(600 ${y})`}>
      <ellipse rx='8.5' ry='6.2' fill={accent} transform='rotate(-18)' />
      <line
        x1={stemX}
        y1={stemDown ? 1 : -1}
        x2={stemX}
        y2={stemY}
        stroke={accent}
        strokeWidth='2.2'
        strokeLinecap='round'
      />
    </g>
  )
}

export function JevCoverC() {
  const uid = useId().replaceAll(':', '')
  const shadow = `jev-pick-shadow-${uid}`

  return (
    <div className={`${styles.cover} ${jevTypeClass}`} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 1200 240'
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <filter id={shadow} x='-20%' y='-20%' width='140%' height='150%'>
            <feDropShadow
              dx='0'
              dy='3'
              stdDeviation='4'
              floodColor={INK}
              floodOpacity='0.14'
            />
          </filter>
        </defs>

        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={i}
            x1='48'
            y1={LINE0 + i * GAP}
            x2='1152'
            y2={LINE0 + i * GAP}
            stroke={INK}
            strokeWidth='1.15'
            opacity='0.8'
          />
        ))}

        <g filter={`url(#${shadow})`}>
          <rect
            x={CARD.x}
            y={CARD.y}
            width={CARD.w}
            height={CARD.h}
            fill={SHEET}
            stroke={INK}
            strokeWidth='1.5'
          />
        </g>

        {/* Runners-up. They stay put — the long bar is the one that picks. */}
        <rect x='476' y='124' width='48' height='6' fill={LINE} />
        <rect x='476' y='136' width='26' height='6' fill={LINE} />

        {PICKS.map((pick) => (
          <g key={pick.id} className={pick.on}>
            <rect
              x={CARD.x + 0.75}
              y={CARD.y + 0.75}
              width={CARD.w - 1.5}
              height={CARD.h - 1.5}
              fill={pick.accent}
              opacity='0.1'
            />
            <rect
              x={CARD.x}
              y={CARD.y}
              width={CARD.w}
              height='5'
              fill={pick.accent}
            />
            <text className={styles.name} x='476' y='72' fill={pick.accent}>
              {pick.name}
            </text>
            <text className={styles.tag} x='476' y='94'>
              {pick.tag}
            </text>
            <rect x='476' y='110' width='210' height='6' fill={pick.accent} />
            <Note y={pick.y} accent={pick.accent} />
          </g>
        ))}
      </svg>
    </div>
  )
}
