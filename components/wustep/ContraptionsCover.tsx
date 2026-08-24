import { type CSSProperties, useId } from 'react'

import styles from './ContraptionsCover.module.css'
import {
  Abacus,
  Bell,
  BoxStep,
  CELL,
  Conveyor,
  Gears,
  Hammer,
  Lamp,
  type Motif,
  Orbit,
  Pendulum,
  Pipe,
  Pulse,
  Signal,
  Slope,
  Spring,
  Wavy,
  Windmill
} from './ContraptionsMotifs'

/**
 * Cover for the Contraptions playground entry — a patch of the generator's own
 * grid. At rest it is a still frame of the machines; hovering switches the
 * whole board on, each cell picking up on its own offset so the grid comes
 * alive in a shimmer rather than a single synchronised pulse.
 *
 * Every colour is a CSS custom property rather than a literal, so the board
 * follows the site's theme: the generator's default ink-on-paper in light mode,
 * and its Noir palette — where a single red carries nearly all the colour — in
 * dark. The values live in the stylesheet because that is the only place that
 * can respond to `body.dark-mode`.
 */

// The stage is far wider than any card so wide cards reveal more grid rather
// than letterboxing. `slice` keeps the full height; only the middle ~320 units
// survive on the narrowest card.
const STAGE_W = 960
const STAGE_H = 200
const COLS = STAGE_W / CELL
const ROWS = STAGE_H / CELL

/** One loop for the whole board; per-cell offsets come out of the hash. */
const LOOP_S = 4.2

const INK = 'var(--cc-ink)'
const BG = 'var(--cc-bg)'
const PALETTE = [
  'var(--cc-c0)',
  'var(--cc-c1)',
  'var(--cc-c2)',
  'var(--cc-c3)',
  'var(--cc-c4)'
]

const MACHINES: Motif[] = [
  Pendulum,
  Gears,
  Pulse,
  Pipe,
  BoxStep,
  Orbit,
  Wavy,
  Slope,
  Spring,
  Signal,
  Windmill,
  Bell,
  Hammer,
  Conveyor,
  Lamp,
  Abacus
]

/** Which machines move at all, and which class drives each. */
const MOVES = new Map<Motif, string | undefined>([
  [Pendulum, styles.swing],
  [Bell, styles.swingSoft],
  [Gears, styles.spin],
  [Windmill, styles.spin],
  [Orbit, styles.spin],
  [Pulse, styles.breathe],
  [Wavy, styles.slide],
  [Spring, styles.bounce],
  [Hammer, styles.strike],
  [BoxStep, styles.walk],
  [Conveyor, styles.march],
  [Abacus, styles.slide],
  [Lamp, styles.glow],
  [Signal, styles.blink]
])

/**
 * Integer hash. Picking machines with `(row * 7 + col * 3) % n` lays them out in
 * visible diagonal stripes — the grid reads as repeating wallpaper rather than
 * as a generated piece. This scatters them while staying a pure function of the
 * cell index, so the board is identical on the server and the client.
 */
function hash(n: number): number {
  let h = Math.imul(n ^ 0x9e_37_79_b9, 0x85_eb_ca_6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2_b2_ae_35)
  return (h ^ (h >>> 16)) >>> 0
}

export function ContraptionsCover() {
  // defs ids collide across card instances; colons break url(#…) refs.
  const uid = useId().replaceAll(':', '')
  const clipId = `cc-stage-${uid}`

  const cells = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c
      const M = MACHINES[hash(i) % MACHINES.length]!
      cells.push({
        key: `${r}-${c}`,
        x: c * CELL + CELL / 2,
        y: r * CELL + CELL / 2,
        Motif: M,
        color: PALETTE[hash(i * 3 + 11) % PALETTE.length]!,
        move: MOVES.get(M),
        // Spread the starts across the loop so nothing beats in unison, and
        // mirror roughly half the board so repeated machines do not rhyme.
        delay: ((hash(i * 7 + 5) % 1000) / 1000) * LOOP_S,
        flip: hash(i * 13 + 3) % 2 === 0 ? 1 : -1
      })
    }
  }

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <clipPath id={clipId}>
            <rect x='0' y='0' width={STAGE_W} height={STAGE_H} />
          </clipPath>
        </defs>

        <g clipPath={`url(#${clipId})`}>
          <rect x='0' y='0' width={STAGE_W} height={STAGE_H} fill={BG} />
          <g
            stroke={INK}
            strokeWidth={1.8}
            strokeLinecap='round'
            strokeLinejoin='round'
            fill='none'
          >
            {cells.map(({ key, x, y, Motif: M, color, move, delay, flip }) => (
              <g
                key={key}
                transform={`translate(${x} ${y}) scale(${flip} 1)`}
                style={{ '--delay': `-${delay.toFixed(2)}s` } as CSSProperties}
              >
                <M c={color} move={move} bg={BG} />
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}
