import styles from './JevCoverI.module.css'
import { jevTypeClass } from './jevCoverType'

/**
 * JevCoverI — the pipeline. Unshipped variant, kept for the
 * covers-preview workbench.
 *
 *   The decision engine under all four rooms: input runs into Jev, Jev
 *   emits one typed label as a chip, and a pipe carries it to the room
 *   where plain code turns it into an effect (plays a rondo, throws the
 *   lever…). At rest every pipe is inked in its room's accent and every
 *   output is lit. Hover dims the outputs and sends the chips again, one
 *   room at a time: the chip rides the pipe, the pipe inks behind it, the
 *   output lights.
 *
 *   The stage is wide (1200×240, sliced to the cover box); the engine sits
 *   in the middle ~410 units a 16:9 card shows, and a wider card reveals
 *   more of the input feed running in from the left.
 */

const INK = '#16161a'
const SHEET = '#fbf8f1'
const LINE = '#d6cfbf'
const MUTED = '#7a756b'

const STAGE_W = 1200
const STAGE_H = 240

// Jev node, the split, and the output column, all inside the 16:9 crop
// (~387–813).
const MID_Y = 120
const NODE = { x: 398, y: MID_Y - 26, w: 90, h: 52 }
const SPLIT_X = 542
const OUT = { x: 636, w: 168, h: 40 }
const CHIP = { w: 48, h: 18 }

const LOOP_S = 8

type Room = {
  key: string
  accent: string
  label: string
  p: string
  effect: string
  y: number
  /** Loop % at which this room's chip leaves the node. */
  start: number
}

const ROOMS: readonly Room[] = [
  {
    key: 'music.form',
    accent: '#9a6a1c',
    label: 'rondo',
    p: '.68',
    effect: 'plays a rondo',
    y: 44,
    start: 9
  },
  {
    key: 'trolley.act',
    accent: '#b3261e',
    label: 'pull',
    p: '.64',
    effect: 'throws the lever',
    y: 95,
    start: 28
  },
  {
    key: 'inbox.action',
    accent: '#3d5a80',
    label: 'leave',
    p: '.71',
    effect: 'leaves it be',
    y: 145,
    start: 47
  },
  {
    key: 'match.fit',
    accent: '#5c4a7a',
    label: 'high',
    p: '.82',
    effect: 'ranks Ari first',
    y: 196,
    start: 66
  }
]

// Stray inputs on the feed line, out past the crop for wide cards.
const FEED = [
  { x: 60, text: '“Für Elise”' },
  { x: 190, text: '“5 lobsters…”' },
  { x: 320, text: '“re: cruise!!”' }
] as const

function pct(n: number) {
  return `${Number(n.toFixed(2))}%`
}

function at(x: number, y: number) {
  return `transform:translate(${x}px,${y}px)`
}

function chipName(r: number) {
  return `jev-pipe-chip-${r}`
}
function pipeName(r: number) {
  return `jev-pipe-ink-${r}`
}
function outName(r: number) {
  return `jev-pipe-out-${r}`
}

// Per room: the chip rides trunk → split → down/up → output; the pipe
// inks behind it; the output lights as the chip arrives. Everything dims
// together at 2–5% so the rooms answer from a clean slate.
const PIPELINE_CSS = ROOMS.map((room, r) => {
  const s = room.start
  const chip =
    `@keyframes ${chipName(r)}{` +
    `0%,${pct(s)}{opacity:0;${at(NODE.x + NODE.w + 8, MID_Y)}}` +
    `${pct(s + 1)}{opacity:1;${at(NODE.x + NODE.w + 14, MID_Y)}}` +
    `${pct(s + 3)}{${at(SPLIT_X, MID_Y)}}` +
    `${pct(s + 7)}{${at(SPLIT_X, room.y)}}` +
    `${pct(s + 11)}{opacity:1;${at(OUT.x - CHIP.w / 2 - 4, room.y)}}` +
    `${pct(s + 12.5)},100%{opacity:0;${at(OUT.x, room.y)}}}`
  const pipe =
    `@keyframes ${pipeName(r)}{` +
    `0%,2%{stroke-dashoffset:0}` +
    `5%,${pct(s + 3)}{stroke-dashoffset:1}` +
    `${pct(s + 11)},100%{stroke-dashoffset:0}}`
  const out =
    `@keyframes ${outName(r)}{` +
    `0%,2%{opacity:1}` +
    `5%,${pct(s + 11)}{opacity:.22}` +
    `${pct(s + 13)},100%{opacity:1}}`
  return chip + pipe + out
}).join('')

function timed(name: string) {
  return {
    animationName: name,
    animationDuration: `${LOOP_S}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite'
  }
}

export function JevCoverI() {
  const trunkX = NODE.x + NODE.w
  return (
    <div className={`${styles.cover} ${jevTypeClass}`} aria-hidden='true'>
      <style dangerouslySetInnerHTML={{ __html: PIPELINE_CSS }} />
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        {/* The input feed, running in from the left edge. */}
        <line
          x1='0'
          x2={NODE.x}
          y1={MID_Y}
          y2={MID_Y}
          stroke={LINE}
          strokeWidth='3'
        />
        {FEED.map((f) => (
          <text
            key={f.x}
            className={styles.feed}
            x={f.x}
            y={MID_Y - 10}
            fill={MUTED}
          >
            {f.text}
          </text>
        ))}

        {/* Trunk out of the node, then one pipe per room. */}
        <line
          x1={trunkX}
          x2={SPLIT_X}
          y1={MID_Y}
          y2={MID_Y}
          stroke={INK}
          strokeWidth='3'
        />
        {ROOMS.map((room, r) => {
          const d = `M${SPLIT_X} ${MID_Y} V${room.y} H${OUT.x}`
          return (
            <g key={room.key}>
              <path d={d} fill='none' stroke={LINE} strokeWidth='3' />
              <path
                className={styles.anim}
                d={d}
                fill='none'
                stroke={room.accent}
                strokeWidth='3'
                pathLength={1}
                strokeDasharray='1 1'
                strokeDashoffset={0}
                style={timed(pipeName(r))}
              />
            </g>
          )
        })}
        <circle cx={SPLIT_X} cy={MID_Y} r='4' fill={INK} />

        {/* Jev: the one model call in the whole system. */}
        <rect
          x={NODE.x}
          y={NODE.y}
          width={NODE.w}
          height={NODE.h}
          rx='6'
          fill={INK}
        />
        <text
          className={styles.node}
          x={NODE.x + NODE.w / 2}
          y={MID_Y + 2}
          fill={SHEET}
        >
          Jev
        </text>
        <text
          className={styles.nodeTag}
          x={NODE.x + NODE.w / 2}
          y={MID_Y + 17}
          fill={LINE}
        >
          → labels
        </text>

        {ROOMS.map((room, r) => {
          const top = room.y - OUT.h / 2
          return (
            <g key={room.key} className={styles.anim} style={timed(outName(r))}>
              <rect
                x={OUT.x}
                y={top}
                width={OUT.w}
                height={OUT.h}
                rx='3'
                fill={SHEET}
                stroke={INK}
                strokeWidth='1.3'
              />
              <rect
                x={OUT.x}
                y={top}
                width='4'
                height={OUT.h}
                fill={room.accent}
              />
              <text
                className={styles.key}
                x={OUT.x + 12}
                y={top + 15}
                fill={MUTED}
              >
                {room.key}
              </text>
              <text
                className={`${styles.key} ${styles.prob}`}
                x={OUT.x + OUT.w - 8}
                y={top + 15}
                fill={room.accent}
              >
                {room.label} {room.p}
              </text>
              <text
                className={styles.effect}
                x={OUT.x + 12}
                y={top + 32}
                fill={INK}
              >
                {room.effect}
              </text>
            </g>
          )
        })}

        {/* The chips in flight; hidden at rest. */}
        {ROOMS.map((room, r) => (
          <g
            key={room.key}
            className={`${styles.anim} ${styles.chip}`}
            style={timed(chipName(r))}
          >
            <rect
              x={-CHIP.w / 2}
              y={-CHIP.h / 2}
              width={CHIP.w}
              height={CHIP.h}
              rx={CHIP.h / 2}
              fill={room.accent}
            />
            <text className={styles.chipText} x='0' y='3.5' fill={SHEET}>
              {room.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
