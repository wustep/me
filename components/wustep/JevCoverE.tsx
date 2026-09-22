import styles from './JevCoverE.module.css'
import { jevTypeClass } from './jevCoverType'

/**
 * JevCoverE — the ballot. Unshipped variant, kept for the covers-preview
 * workbench.
 *
 *   One answer sheet for the whole playground: a row per room, each a
 *   typed question (music.form, trolley.act, inbox.action, match.fit) with
 *   its closed set of options as chips. At rest every row is already
 *   answered — the chosen chip filled in the room's accent, its
 *   probability beside it. Hover re-asks the sheet row by row: the fill
 *   hops across the options the way a pick is weighed, then lands.
 *
 *   The stage is wide (1200×240, sliced to the cover box); the sheet sits
 *   in the middle ~420 units a 16:9 card shows, and a wider card only
 *   reveals more ruled paper.
 */

const INK = '#16161a'
const SHEET = '#fbf8f1'
const LINE = '#d6cfbf'
const MUTED = '#7a756b'

const STAGE_W = 1200
const STAGE_H = 240

// Sheet centered on x=600, a few units inside the 16:9 crop (~387–813).
const CARD = { x: 394, y: 22, w: 412, h: 196 }
const ROW_H = CARD.h / 4
const KEY_X = CARD.x + 14
const CHIP_X = 506
const CHIP_W = 74
const CHIP_H = 28
const CHIP_GAP = 8
const P_X = CARD.x + CARD.w - 14

const LOOP_S = 8
// Fade length (loop %) for every chip on/off, so hops read as steps,
// not flicker.
const RAMP = 0.5

type Row = {
  key: string
  accent: string
  options: readonly string[]
  pick: number
  p: string
  /** Options the fill visits on hover, in order; ends on `pick`. */
  hops: readonly number[]
  /** Loop-% window where this row is being re-asked. */
  start: number
  end: number
}

const ROWS: readonly Row[] = [
  {
    key: 'music.form',
    accent: '#9a6a1c',
    options: ['binary', 'ternary', 'rondo'],
    pick: 2,
    p: '.68',
    hops: [0, 1, 2],
    start: 4,
    end: 22
  },
  {
    key: 'trolley.act',
    accent: '#b3261e',
    options: ['pull', 'wait'],
    pick: 0,
    p: '.64',
    hops: [1, 0],
    start: 24,
    end: 40
  },
  {
    key: 'inbox.action',
    accent: '#3d5a80',
    options: ['delete', 'review', 'leave'],
    pick: 2,
    p: '.71',
    hops: [0, 1, 2],
    start: 42,
    end: 60
  },
  {
    key: 'match.fit',
    accent: '#5c4a7a',
    options: ['low', 'mid', 'high'],
    pick: 2,
    p: '.82',
    hops: [1, 2, 1, 2],
    start: 62,
    end: 82
  }
]

// Opacity keyframes: 1 inside each interval, 0 outside, with RAMP fades.
// Intervals are sorted and never touch, so the stops stay monotonic.
function onOff(name: string, intervals: readonly [number, number][]) {
  const stops: string[] = []
  const first = intervals[0]
  if (!first || first[0] > 0) stops.push('0%{opacity:0}')
  for (const [a, b] of intervals) {
    if (a > 0) stops.push(`${a.toFixed(2)}%{opacity:0}`)
    stops.push(`${(a > 0 ? a + RAMP : 0).toFixed(2)}%{opacity:1}`)
    if (b < 100) {
      stops.push(`${b.toFixed(2)}%{opacity:1}`)
      stops.push(`${(b + RAMP).toFixed(2)}%{opacity:0}`)
    } else {
      stops.push('100%{opacity:1}')
    }
  }
  const last = intervals.at(-1)
  if (!last || last[1] < 100) stops.push('100%{opacity:0}')
  return `@keyframes ${name}{${stops.join('')}}`
}

// Each hop gets an equal slot of the row's window; the chip is lit for
// the first 70% of its slot so consecutive hops have a visible gap. The
// last hop (the pick) holds through the loop's end — the rest pose.
function hopSlots(row: Row) {
  const slot = (row.end - row.start) / (row.hops.length + 0.5)
  return row.hops.map((option, i) => {
    const on = row.start + 1 + i * slot
    return { option, on, off: on + slot * 0.7 }
  })
}

function chipName(r: number, c: number) {
  return `jev-ballot-${r}-${c}`
}

function probName(r: number) {
  return `jev-ballot-p-${r}`
}

const BALLOT_CSS = ROWS.map((row, r) => {
  const slots = hopSlots(row)
  const landing = slots.at(-1)!.on
  const chips = row.options.map((_, c) => {
    const intervals: [number, number][] = []
    if (c === row.pick) intervals.push([0, row.start])
    for (const s of slots.slice(0, -1)) {
      if (s.option === c) intervals.push([s.on, s.off])
    }
    if (c === row.pick) intervals.push([landing, 100])
    return onOff(chipName(r, c), intervals)
  })
  // The probability steps out while the row is re-asked and returns with
  // the landing.
  const prob = onOff(probName(r), [
    [0, row.start],
    [landing + 1, 100]
  ])
  return chips.join('') + prob
}).join('')

function timed(name: string) {
  return {
    animationName: name,
    animationDuration: `${LOOP_S}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite'
  }
}

export function JevCoverE() {
  return (
    <div className={`${styles.cover} ${jevTypeClass}`} aria-hidden='true'>
      <style dangerouslySetInnerHTML={{ __html: BALLOT_CSS }} />
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        {/* Ledger rules across the whole stage, on the sheet's row
            pitch, so a wide card reads as more of the same form. */}
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={i}
            x1='0'
            x2={STAGE_W}
            y1={CARD.y + i * ROW_H}
            y2={CARD.y + i * ROW_H}
            stroke={LINE}
            strokeWidth='1'
          />
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

        {ROWS.map((row, r) => {
          const top = CARD.y + r * ROW_H
          const cy = top + ROW_H / 2
          return (
            <g key={row.key}>
              {r > 0 && (
                <line
                  x1={CARD.x}
                  x2={CARD.x + CARD.w}
                  y1={top}
                  y2={top}
                  stroke={LINE}
                  strokeWidth='1'
                />
              )}
              <text className={styles.key} x={KEY_X} y={cy + 4} fill={MUTED}>
                {row.key}
              </text>

              {row.options.map((option, c) => {
                const x = CHIP_X + c * (CHIP_W + CHIP_GAP)
                const y = cy - CHIP_H / 2
                return (
                  <g key={option}>
                    <rect
                      x={x}
                      y={y}
                      width={CHIP_W}
                      height={CHIP_H}
                      rx='3'
                      fill={SHEET}
                      stroke={INK}
                      strokeWidth='1.2'
                    />
                    <text
                      className={styles.chip}
                      x={x + CHIP_W / 2}
                      y={cy + 4.5}
                      fill={INK}
                    >
                      {option}
                    </text>
                    {/* The filled copy; its keyframe is generated above. */}
                    <g
                      className={styles.fill}
                      opacity={c === row.pick ? 1 : 0}
                      style={timed(chipName(r, c))}
                    >
                      <rect
                        x={x}
                        y={y}
                        width={CHIP_W}
                        height={CHIP_H}
                        rx='3'
                        fill={row.accent}
                        stroke={row.accent}
                        strokeWidth='1.2'
                      />
                      <text
                        className={styles.chip}
                        x={x + CHIP_W / 2}
                        y={cy + 4.5}
                        fill={SHEET}
                      >
                        {option}
                      </text>
                    </g>
                  </g>
                )
              })}

              <text
                className={`${styles.prob} ${styles.fill}`}
                x={P_X}
                y={cy + 4}
                fill={row.accent}
                style={timed(probName(r))}
              >
                {row.p}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
