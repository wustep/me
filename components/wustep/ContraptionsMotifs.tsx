import { type ReactNode } from 'react'

/**
 * Machine motifs for the Contraptions covers.
 *
 * These are transcriptions of the real machines, not sketches of them. Every
 * proportion below is the one the generator actually draws — the pipe's bend is
 * size/6, the pendulum's arm is size×0.58, the gear's teeth run from size×0.2
 * out to size×0.275 — restated in a 40-unit cell so a cover can place one with
 * a single translate. Drawing them by eye produced a board that looked like the
 * app without being it; matching the source means the cover and the piece are
 * the same drawing at two sizes.
 *
 * The originals live in `src/contraptions/*.ts` in the contraptions repo. The
 * `move` class goes on whichever part animates; each motif's comment names the
 * transform-origin that class needs.
 */

/** The `okazz` theme from the generator, which is the app's default look. */
export const INK = '#212121'
export const PAPER = '#ebf1f4'
export const PALETTE = ['#fcb500', '#007eb6', '#009135', '#e76b31', '#eb335e']

/** Cell edge in viewBox units. Every motif is drawn to this. */
export const CELL = 40

export type MotifProps = {
  /** The machine's single flat fill. */
  c: string
  /** Class applied to the moving part. */
  move?: string
  /** Ground colour, for the few motifs that knock a hole in themselves. */
  bg?: string
}

export type Motif = (props: MotifProps) => ReactNode

/** Half a cell. The generator works in ±size/2 about the cell centre. */
const H = CELL / 2
/** `size * f` in cell units, so the transcriptions read like the source. */
const u = (f: number) => CELL * f

/** Rails that touch the cell edge are what knit neighbouring cells together. */
function Ceil() {
  return <line x1={-H} y1={-H} x2={H} y2={-H} />
}

function Floor() {
  return <line x1={-H} y1={H} x2={H} y2={H} />
}

/** Weight swinging from the ceiling rail. `move`: rotate about `50% 0%`. */
export function Pendulum({ c, move }: MotifProps) {
  const arm = u(0.58)
  return (
    <g>
      <Ceil />
      <g className={move}>
        <line x1={0} y1={-H} x2={0} y2={-H + arm} />
        <circle cx={0} cy={-H + arm} r={CELL / 6} fill={c} />
      </g>
    </g>
  )
}

/** Radial tooth ticks, running from the gear rim outward. */
function teeth(cx: number, r: number, len: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2
    return (
      <line
        key={i}
        x1={cx + Math.cos(a) * r}
        y1={Math.sin(a) * r}
        x2={cx + Math.cos(a) * (r + len)}
        y2={Math.sin(a) * (r + len)}
      />
    )
  })
}

/** Two wheels in mesh on a shaft that runs edge to edge. `move`: rotate about the hub. */
export function Gears({ c, move }: MotifProps) {
  const r = u(0.2)
  const tooth = u(0.075)
  const gap = r + tooth * 0.5
  return (
    <g>
      <line x1={-H} y1={0} x2={H} y2={0} />
      {[-gap, gap].map((cx) => (
        <g key={cx}>
          <g className={move} style={{ transformOrigin: `${cx}px 0px` }}>
            <circle cx={cx} cy={0} r={r} fill='none' />
            {teeth(cx, r, tooth, 8)}
          </g>
          <circle cx={cx} cy={0} r={u(0.065)} fill={c} />
        </g>
      ))}
    </g>
  )
}

/** A weight fired up its rail. `move`: translateY. */
export function Hammer({ c, move }: MotifProps) {
  const d = u(0.3)
  const reach = u(0.4) - d / 2
  return (
    <g>
      <Ceil />
      <Floor />
      <line x1={0} y1={-u(0.4)} x2={0} y2={u(0.4)} />
      <circle className={move} cx={0} cy={reach} r={d / 2} fill={c} />
    </g>
  )
}

/** A bell on its hanger. `move`: rotate about `50% 0%`. */
export function Bell({ c, move }: MotifProps) {
  const drop = u(0.16)
  const bw = u(0.44)
  const bh = u(0.34)
  const top = -H + drop
  return (
    <g>
      <Ceil />
      <g className={move}>
        <line x1={0} y1={-H} x2={0} y2={top} />
        <path
          d={`M ${-bw / 2} ${top + bh} C ${-bw / 2} ${top} ${-bw * 0.22} ${top} 0 ${top} C ${bw * 0.22} ${top} ${bw / 2} ${top} ${bw / 2} ${top + bh} Z`}
          fill={c}
        />
        <line x1={-bw / 2} y1={top + bh} x2={bw / 2} y2={top + bh} />
        <circle cx={0} cy={top + bh + u(0.06)} r={u(0.06)} fill={c} />
      </g>
    </g>
  )
}

/**
 * A bulb on a post — the machine that most obviously reacts to a signal.
 * `move` carries the rays, which only exist while it is lit.
 */
export function Lamp({ c, move, bg }: MotifProps) {
  const d = u(0.36)
  const y = -u(0.08)
  return (
    <g>
      <Floor />
      <line x1={0} y1={H} x2={0} y2={y + d / 2} />
      <line x1={-u(0.11)} y1={y + d / 2} x2={u(0.11)} y2={y + d / 2} />
      <g className={move}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 + Math.PI / 8
          return (
            <line
              key={i}
              x1={Math.cos(a) * d * 0.62}
              y1={y + Math.sin(a) * d * 0.62}
              x2={Math.cos(a) * d * 0.97}
              y2={y + Math.sin(a) * d * 0.97}
              stroke={c}
            />
          )
        })}
      </g>
      <circle cx={0} cy={y} r={d / 2} fill={bg ?? PAPER} />
    </g>
  )
}

/** Four sails on a tower. `move`: rotate about the hub. */
export function Windmill({ c, move }: MotifProps) {
  const hubY = -u(0.14)
  const sail = u(0.33)
  const wide = u(0.11)
  return (
    <g>
      <Floor />
      <line x1={-u(0.22)} y1={H} x2={-u(0.045)} y2={hubY} />
      <line x1={u(0.22)} y1={H} x2={u(0.045)} y2={hubY} />
      <line x1={-u(0.14)} y1={u(0.2)} x2={u(0.14)} y2={u(0.2)} />
      <g className={move} style={{ transformOrigin: `0px ${hubY}px` }}>
        {[0, 90, 180, 270].map((deg) => (
          <rect
            key={deg}
            x={wide * 0.3}
            y={hubY - wide / 2}
            width={sail}
            height={wide}
            fill={c}
            transform={`rotate(${deg} 0 ${hubY})`}
          />
        ))}
        <circle cx={0} cy={hubY} r={u(0.05)} fill={c} />
      </g>
    </g>
  )
}

/** Rings running out from the centre. `move`: scale about `center`. */
export function Pulse({ c, move }: MotifProps) {
  return (
    <g>
      <g className={move}>
        <circle cx={0} cy={0} r={u(0.36)} fill='none' />
        <circle cx={0} cy={0} r={u(0.22)} fill='none' />
      </g>
      <circle cx={0} cy={0} r={u(0.06)} fill={c} />
    </g>
  )
}

/** Three lamps in a housing. `move`: translateY between the lamps. */
export function Signal({ c, move, bg }: MotifProps) {
  const d = u(0.22)
  const gap = u(0.26)
  return (
    <g>
      <rect
        x={-d * 0.85}
        y={-(gap + d * 0.7)}
        width={d * 1.7}
        height={gap * 2 + d * 1.4}
        rx={u(0.04)}
        fill='none'
      />
      <line x1={0} y1={gap + d * 0.9} x2={0} y2={H} />
      {[-gap, 0, gap].map((cy) => (
        <circle key={cy} cx={0} cy={cy} r={d / 2} fill={bg ?? PAPER} />
      ))}
      <circle className={move} cx={0} cy={-gap} r={d / 2} fill={c} />
    </g>
  )
}

/** A ball threading an S-bend between two rails. `move`: translate along the pipe. */
export function Pipe({ c, move }: MotifProps) {
  const r = CELL / 6
  return (
    <g>
      <Ceil />
      <Floor />
      <path
        d={`M ${-2 * r} ${-H} L ${-2 * r} 0 A ${r} ${r} 0 0 0 0 0 A ${r} ${r} 0 0 1 ${2 * r} 0 L ${2 * r} ${H}`}
        fill='none'
      />
      <circle className={move} cx={-2 * r} cy={-u(0.3)} r={r / 2} fill={c} />
    </g>
  )
}

/** A body on a marked orbit, with its own small moon. `move`: rotate about `center`. */
export function Orbit({ c, move }: MotifProps) {
  const r = u(0.31)
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill='none' strokeDasharray='3 3.5' />
      <circle cx={0} cy={0} r={u(0.05)} fill='none' />
      <g className={move}>
        <circle cx={r} cy={0} r={u(0.095)} fill={c} />
        <circle cx={r + u(0.16)} cy={0} r={u(0.035)} fill='none' />
      </g>
    </g>
  )
}

/** A square walking its own perimeter. `move`: translate. */
export function BoxStep({ c, move }: MotifProps) {
  const box = CELL / 3
  const reach = H - box / 2
  return (
    <g>
      <rect x={-H} y={-H} width={CELL} height={CELL} fill='none' />
      <rect
        className={move}
        x={reach - box / 2}
        y={reach - box / 2}
        width={box}
        height={box}
        fill={c}
      />
    </g>
  )
}

/** A ball running the inside of a quarter-arc chute. `move`: translate along it. */
export function Slope({ c, move }: MotifProps) {
  const d = u(0.3)
  const ride = CELL - d / 2
  const a = Math.PI / 4
  return (
    <g>
      <path d={`M ${H} ${-H} A ${CELL} ${CELL} 0 0 1 ${-H} ${H}`} fill='none' />
      <line x1={-H} y1={H} x2={-H} y2={-H} />
      <line x1={-H} y1={-H} x2={H} y2={-H} />
      <circle
        className={move}
        cx={-H + ride * Math.cos(a)}
        cy={-H + ride * Math.sin(a)}
        r={d / 2}
        fill={c}
      />
    </g>
  )
}

/** A wave running down a cord, anchored by a block. `move`: translateX. */
export function Wavy({ c, move }: MotifProps) {
  const blockH = u(0.2)
  const blockW = u(0.5)
  const amp = CELL / 4
  const foot = H - blockH
  return (
    <g>
      <Ceil />
      <Floor />
      <path
        className={move}
        d={`M 0 ${-H} C ${amp} ${-H + 13} ${-amp} ${-6} 0 0 C ${amp} 6 ${-amp} ${foot - 7} 0 ${foot}`}
        fill='none'
      />
      <rect
        x={-blockW / 2}
        y={H - blockH}
        width={blockW}
        height={blockH}
        fill={c}
      />
    </g>
  )
}

/** A block bouncing on a compression spring. `move`: translateY. */
export function Spring({ c, move }: MotifProps) {
  const block = u(0.26)
  const amp = u(0.12)
  const top = -u(0.04)
  const coils = 5
  const span = H - (top + block / 2)
  const zig = Array.from({ length: coils * 2 - 1 }, (_, i) => {
    const t = (i + 1) / (coils * 2)
    return `${i % 2 === 0 ? -amp : amp} ${H - span * t}`
  }).join(' L ')
  return (
    <g>
      <Ceil />
      <Floor />
      <g className={move}>
        <path d={`M 0 ${H} L ${zig} L 0 ${top + block / 2}`} fill='none' />
        <rect
          x={-block / 2}
          y={top - block / 2}
          width={block}
          height={block}
          fill={c}
        />
      </g>
    </g>
  )
}

/** Crates riding a belt between two rollers. `move`: translateX. */
export function Conveyor({ c, move }: MotifProps) {
  const roller = u(0.15)
  const span = u(0.3)
  const crate = u(0.2)
  return (
    <g>
      <line x1={-span} y1={-roller} x2={span} y2={-roller} />
      <line x1={-span} y1={roller} x2={span} y2={roller} />
      <path
        d={`M ${-span} ${-roller} A ${roller} ${roller} 0 0 0 ${-span} ${roller}`}
        fill='none'
      />
      <path
        d={`M ${span} ${roller} A ${roller} ${roller} 0 0 0 ${span} ${-roller}`}
        fill='none'
      />
      <line x1={-span} y1={0} x2={span} y2={0} />
      <g className={move}>
        {[-CELL / 3, 0, CELL / 3].map((x) => (
          <rect
            key={x}
            x={x - crate / 2}
            y={-roller - crate}
            width={crate}
            height={crate}
            fill={c}
          />
        ))}
      </g>
    </g>
  )
}

/** Beads clicking between stops on rails that run edge to edge. `move`: translateX. */
export function Abacus({ c, move }: MotifProps) {
  const stop = u(0.4)
  const bead = u(0.16)
  const spread = u(0.62)
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const y = -spread / 2 + (spread * i) / 2
        return (
          <g key={i}>
            <line x1={-H} y1={y} x2={H} y2={y} />
            <line x1={-stop} y1={y - u(0.06)} x2={-stop} y2={y + u(0.06)} />
            <line x1={stop} y1={y - u(0.06)} x2={stop} y2={y + u(0.06)} />
            <circle
              className={move}
              cx={i % 2 === 0 ? -stop / 2 : stop / 2}
              cy={y}
              r={bead / 2}
              fill={c}
            />
          </g>
        )
      })}
    </g>
  )
}

/** Bars going over in sequence. `move`: rotate each about `50% 100%`. */
export function Dominoes({ c, move }: MotifProps) {
  const floorY = u(0.46)
  const h = u(0.3)
  const w = u(0.08)
  const span = u(0.44)
  return (
    <g>
      <Floor />
      {[0, 1, 2, 3].map((i) => {
        const x = -span / 2 + (span * i) / 3
        return (
          <rect
            key={i}
            className={move}
            style={{
              transformOrigin: `${x}px ${floorY}px`,
              // Compose with the per-cell offset instead of replacing it.
              animationDelay: `calc(var(--delay, 0s) + ${i * 90}ms)`
            }}
            x={x - w / 2}
            y={floorY - h}
            width={w}
            height={h}
            fill={c}
          />
        )
      })}
    </g>
  )
}

/** Every motif, for covers that want to fill a grid. */
export const MOTIFS: Motif[] = [
  Pendulum,
  Gears,
  Hammer,
  Bell,
  Windmill,
  Pulse,
  Signal,
  Pipe,
  Orbit,
  BoxStep,
  Slope,
  Wavy,
  Spring,
  Conveyor,
  Abacus,
  Dominoes
]
