import styles from './JevCoverD.module.css'
import { jevTypeClass } from './jevCoverType'

/**
 * JevCoverD — four doors. Unshipped variant, kept for the covers-preview
 * workbench.
 *
 *   The landing, redrawn as the landing actually looks: four sheet cards,
 *   each with a 4px accent rule and a Fraunces name in that accent (Music
 *   gold, Trolley red, Inbox blue, Match purple). At rest every door is a
 *   finished little scene — notes on a staff, the trolley already on the
 *   chosen rail, the inbox stamped LEAVE, the match's first row marked.
 *   Hover wakes one door at a time, the way a finger would move across
 *   the page: the notes hop, the car replays its choice, the stamp cycles
 *   Leave / Review / Delete, the rank mark slides.
 */

const INK = '#16161a'
const SHEET = '#fbf8f1'
const HAIR = '#d6cfbf'
const GOLD = '#9a6a1c'
const RED = '#b3261e'
const BLUE = '#3d5a80'
const PURPLE = '#5c4a7a'

const DOOR_Y = 50
const DOOR_W = 96
const DOOR_H = 152

const DOORS = [
  { name: 'Music', accent: GOLD, x: 396, wash: styles.washMusic },
  { name: 'Trolley', accent: RED, x: 500, wash: styles.washTrolley },
  { name: 'Inbox', accent: BLUE, x: 604, wash: styles.washInbox },
  { name: 'Match', accent: PURPLE, x: 708, wash: styles.washMatch }
] as const

function Head({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse rx='4.2' ry='3.1' fill={fill} transform='rotate(-18)' />
      <line
        x1='3.4'
        y1='-0.5'
        x2='3.4'
        y2='-16'
        stroke={fill}
        strokeWidth='1.3'
        strokeLinecap='round'
      />
    </g>
  )
}

function Music({ x }: { x: number }) {
  const staff = 108
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => (
        <line
          key={i}
          x1={x + 16}
          y1={staff + i * 7}
          x2={x + 80}
          y2={staff + i * 7}
          stroke={INK}
          strokeWidth='0.9'
        />
      ))}
      <Head x={x + 34} y={staff + 14} fill={INK} />
      <g className={styles.hop}>
        <Head x={x + 62} y={staff + 7} fill={INK} />
      </g>
    </g>
  )
}

function Trolley({ x }: { x: number }) {
  return (
    <g stroke={INK} strokeWidth='1.6' strokeLinecap='round' fill='none'>
      <polyline points={`${x + 18},142 ${x + 48},112 ${x + 78},142`} />
      <line x1={x + 48} y1='112' x2={x + 48} y2='98' />
      {/* Rest pose is the decision already made: the car sits on the
          right rail. Hover sends it back to the switch and down again. */}
      <g className={styles.car} transform={`translate(${x + 70} 132)`}>
        <circle r='5' fill={RED} stroke='none' />
      </g>
    </g>
  )
}

function Stamp({
  x,
  label,
  color,
  className
}: {
  x: number
  label: string
  color: string
  className?: string
}) {
  return (
    <g className={className}>
      <rect
        x={x + 18}
        y='158'
        width='60'
        height='16'
        fill={color}
        opacity='0.14'
        stroke={color}
        strokeWidth='1'
      />
      <text className={styles.stamp} x={x + 48} y='169.5' fill={color}>
        {label}
      </text>
    </g>
  )
}

function Inbox({ x }: { x: number }) {
  return (
    <g>
      {[104, 118, 132].map((y, i) => (
        <g key={y}>
          <rect
            x={x + 16}
            y={y}
            width='64'
            height='2.2'
            fill={INK}
            opacity='0.8'
          />
          <rect
            x={x + 16}
            y={y + 5}
            width={40 - i * 8}
            height='1.6'
            fill={HAIR}
          />
        </g>
      ))}
      <Stamp x={x} label='LEAVE' color={BLUE} className={styles.stampLeave} />
      <Stamp x={x} label='REVIEW' color={GOLD} className={styles.stampReview} />
      <Stamp x={x} label='DELETE' color={RED} className={styles.stampDelete} />
    </g>
  )
}

function Match({ x }: { x: number }) {
  return (
    <g>
      {[
        { y: 108, w: 52 },
        { y: 136, w: 44 }
      ].map(({ y, w }) => (
        <g key={y}>
          <rect x={x + 28} y={y} width={w} height='3' fill={INK} />
          <rect x={x + 28} y={y + 7} width={w - 16} height='2' fill={HAIR} />
        </g>
      ))}
      <rect
        className={styles.rank}
        x={x + 16}
        y='102'
        width='4'
        height='16'
        fill={PURPLE}
      />
    </g>
  )
}

export function JevCoverD() {
  return (
    <div className={`${styles.cover} ${jevTypeClass}`} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 1200 240'
        preserveAspectRatio='xMidYMid slice'
      >
        <text className={styles.kicker} x='600' y='34'>
          JEV PLAYGROUND
        </text>
        {DOORS.map(({ name, accent, x, wash }) => (
          <g key={name}>
            <rect
              x={x}
              y={DOOR_Y}
              width={DOOR_W}
              height={DOOR_H}
              fill={SHEET}
              stroke={INK}
              strokeWidth='1.4'
            />
            <rect
              className={wash}
              x={x}
              y={DOOR_Y}
              width={DOOR_W}
              height={DOOR_H}
              fill={accent}
            />
            <rect x={x} y={DOOR_Y} width={DOOR_W} height='4' fill={accent} />
            <text
              className={styles.doorName}
              x={x + DOOR_W / 2}
              y='78'
              fill={accent}
            >
              {name}
            </text>
          </g>
        ))}
        <Music x={DOORS[0].x} />
        <Trolley x={DOORS[1].x} />
        <Inbox x={DOORS[2].x} />
        <Match x={DOORS[3].x} />
      </svg>
    </div>
  )
}
