import { type CSSProperties, useId, useMemo } from 'react'

import styles from './ContraptionsCover.module.css'

/**
 * ContraptionsCover — the hop.
 *
 *   Cover for the Contraptions playground entry: one beat of the show, drawn
 *   in its own hand. A ball comes out of a portal onto a rail, rolls off the
 *   end, drops onto a trampoline, is thrown up onto a shelf and rolls into a
 *   second portal, which draws it out into a streak and swallows it — and
 *   the same instant it is pushed back out of the first, to go round again.
 *   At rest the ball hangs just past the top of its flight with its trail
 *   behind it and the far portal already awake.
 *
 *   One map, in the show's Risograph palette; dark mode swaps the palette
 *   to the show's Noir through the stylesheet's custom properties and
 *   changes nothing else. Nothing is on stage the ball does not use.
 *
 *   Every timed thing reads one clock: the ball's path is the table of legs
 *   below, and every other keyframe — the portals waking and flashing, the
 *   trampoline giving — is generated from the same moments, so retiming the
 *   hop is an edit to the table.
 *
 *   The stage is wide (1200×240, sliced to the cover box) so the full
 *   height always fits at every card width; the whole hop, both portals
 *   included, sits inside the middle ~400 units a grid card shows at laptop
 *   width, and a wider card only shows more paper, as the show's own wide
 *   camera does.
 */

// ---- stage -----------------------------------------------------------------

const STAGE_W = 1200
const STAGE_H = 240
/** Posts stand here. There is no ground line, as in the show: only feet. */
const GROUND = 212
/** The rail the ball comes out onto, and the shelf the far portal stands on. */
const RAIL_HI = 86
const RAIL_LO = 136
/** The trampoline bed, at rest. */
const BED = 186
const R = 10
/** One ink weight for everything, as in the show. */
const INK_W = 3

const INK = 'var(--cc-ink)'
const BG = 'var(--cc-bg)'
const BALL = 'var(--cc-ball)'
const PORTAL = 'var(--cc-portal)'
const ACCENT = 'var(--cc-accent)'

// ---- portals ---------------------------------------------------------------

/** A standing ring: taller than wide, a band of colour round a hole of ink. */
const RING = { rx: 17, ry: 24, band: 4.5 }
/** The ring stands on its rail, so its centre sits this far above it. */
const RING_LIFT = 23
/** The eye the ball is drawn up into, above the rail. */
const EYE_LIFT = 18
/**
 * Both portals, halos included, sit inside the middle ~400 units: that is
 * all a grid card shows at a laptop width, and the hop has to be whole there.
 */
const PORTAL_IN = { x: 432, rail: RAIL_HI }
const PORTAL_OUT = { x: 768, rail: RAIL_LO }
const EYE_IN = { x: PORTAL_IN.x, y: PORTAL_IN.rail - EYE_LIFT }
const EYE_OUT = { x: PORTAL_OUT.x, y: PORTAL_OUT.rail - EYE_LIFT }

// ---- the chain -------------------------------------------------------------

const RAIL_END = 535
const TRAMPOLINE = { x: 580, halfW: 24, legs: [564, 596] }
const SHELF = 642

const BALL_HI = RAIL_HI - R
const BALL_LO = RAIL_LO - R
const BALL_BED = BED - R

// ---- the ball's path -------------------------------------------------------

type Ease = 'linear' | 'in' | 'out' | 'inout'

type Leg = {
  to: [number, number]
  /** Seconds. */
  dur: number
  ex?: Ease
  ey?: Ease
  /** The ball is crossing a portal: growing from nothing, or shrinking to it. */
  transit?: 'out' | 'in'
}

/**
 * The hop, as legs from the entry eye. Speeds are the show's in spirit —
 * rails roll at a steady pace, falls accelerate, flights are parabolas
 * (linear x, eased y) — slowed a touch so the ball reads at card size.
 */
const LEGS: Leg[] = [
  // pushed out of the entry, a streak that rounds into a ball
  { to: [458, BALL_HI], dur: 0.45, ex: 'out', ey: 'out', transit: 'out' },
  // rolls to the end of the rail
  { to: [RAIL_END, BALL_HI], dur: 0.55 },
  // drops onto the trampoline
  { to: [572, BALL_BED], dur: 0.4, ey: 'in' },
  // the bed gives…
  { to: [577, BALL_BED + 5], dur: 0.08, ey: 'out' },
  // …and throws it
  { to: [582, BALL_BED], dur: 0.08, ey: 'in' },
  // up to the top of the flight
  { to: [624, 64], dur: 0.42, ey: 'out' },
  // down onto the shelf
  { to: [664, BALL_LO], dur: 0.3, ey: 'in' },
  // rolls to the far portal
  { to: [748, BALL_LO], dur: 0.6 },
  // drawn out into a streak and pulled into the eye
  { to: [EYE_OUT.x, EYE_OUT.y], dur: 0.4, ex: 'in', ey: 'in', transit: 'in' },
  // the jump: out of sight, from one eye to the other, and straight back out
  { to: [EYE_IN.x, EYE_IN.y], dur: 0.08 }
]

/** When each leg begins, in seconds. */
const LEG_START = LEGS.map((_, i) =>
  LEGS.slice(0, i).reduce((sum, leg) => sum + leg.dur, 0)
)
const LOOP = LEGS.reduce((sum, leg) => sum + leg.dur, 0)

/** Moments the rest of the scene keys off. */
const T_APEX = LEG_START[6]!
/** The far portal takes the ball, and the near one gives it straight back. */
const T_CUT = LEG_START[9]!
const JUMP = LEGS[9]!.dur
/** How long the ring a portal sends out on the jump takes to fade. */
const WAVE = 0.45
const WAVE_WRAP = (() => {
  const p = JUMP / WAVE
  return `transform:scale(${(1 + 0.9 * p).toFixed(3)});opacity:${(1 - p).toFixed(3)}`
})()
/** The far portal wakes as the ball comes off the trampoline toward it. */
const T_WAKE = LEG_START[5]!
const T_AWAKE = T_WAKE + 0.4
/** The near portal wakes ahead of the ball's return, as in the show. */
const T_STIR = T_CUT - 0.5
/** The trampoline is struck, gives, throws, and settles. */
const T_STRIKE = LEG_START[3]!
const T_THROW = LEG_START[5]!
const T_SETTLE = T_THROW + 0.55

/**
 * The rest pose: just past the top of the flight, so the ball is plainly a
 * ball in the air, the trail is an arc behind it, and the far portal is
 * fully awake. Every animation is held here by a shared negative delay.
 */
const T_POSE = T_APEX + 0.1

/** Trail ghosts follow the same path this far behind the ball, in seconds. */
const TRAIL = [
  { lag: 0.06, r: R * 0.9, opacity: 0.4 },
  { lag: 0.12, r: R * 0.78, opacity: 0.26 },
  { lag: 0.18, r: R * 0.66, opacity: 0.14 }
]

const easeValue = (ease: Ease | undefined, r: number): number => {
  switch (ease) {
    case 'in':
      return r * r
    case 'out':
      return 1 - (1 - r) * (1 - r)
    case 'inout':
      return r < 0.5 ? 2 * r * r : 1 - 2 * (1 - r) * (1 - r)
    default:
      return r
  }
}

/** Where the ball is `t` seconds into the loop, for the rest pose. */
function poseAt(t: number): { x: number; y: number } {
  let from: [number, number] = [EYE_IN.x, EYE_IN.y]
  for (const [i, leg] of LEGS.entries()) {
    const start = LEG_START[i]!
    if (t <= start + leg.dur) {
      const raw = (t - start) / leg.dur
      return {
        x: from[0] + (leg.to[0] - from[0]) * easeValue(leg.ex, raw),
        y: from[1] + (leg.to[1] - from[1]) * easeValue(leg.ey, raw)
      }
    }
    from = leg.to
  }
  return { x: from[0], y: from[1] }
}

/** The ball drawn out along its motion as it crosses a portal (the show's formula). */
const stretchAt = (scale: number) => 1 + 2.4 * (1 - scale) ** 1.4

// ---- keyframes -------------------------------------------------------------

const EASE_CSS: Record<Ease, string> = {
  linear: 'linear',
  in: 'cubic-bezier(0.11, 0, 0.5, 0)',
  out: 'cubic-bezier(0.5, 1, 0.89, 1)',
  inout: 'cubic-bezier(0.45, 0, 0.55, 1)'
}

/** A keyframe: at `t` seconds, these declarations, easing into the next. */
type Stop = [t: number, decl: string, ease?: Ease]

const pct = (t: number) => `${((t / LOOP) * 100).toFixed(3)}%`

const track = (name: string, stops: Stop[]) =>
  `@keyframes ${name}{${stops
    .map(
      ([t, decl, ease]) =>
        `${pct(t)}{${decl};animation-timing-function:${EASE_CSS[ease ?? 'linear']}}`
    )
    .join('')}}`

/** Hold `decl` from the top of the loop to `t`, then ease on to the next stop. */
const hold = (t: number, decl: string, ease?: Ease): Stop[] => [
  [0, decl],
  [t, decl, ease]
]

const scaleXY = (scale: number) =>
  `transform:scale(${(scale * stretchAt(scale)).toFixed(3)},${scale.toFixed(3)})`

/**
 * Every keyframe in the scene, from the one clock. Names carry the instance
 * uid so two cards on one page never share a timeline.
 */
function buildKeyframes(id: (name: string) => string): string {
  const x: Stop[] = [[0, `transform:translateX(${EYE_IN.x}px)`, LEGS[0]!.ex]]
  const y: Stop[] = [[0, `transform:translateY(${EYE_IN.y}px)`, LEGS[0]!.ey]]
  const shape: Stop[] = []
  for (const [i, leg] of LEGS.entries()) {
    const start = LEG_START[i]!
    const next = LEGS[i + 1]
    x.push([start + leg.dur, `transform:translateX(${leg.to[0]}px)`, next?.ex])
    y.push([start + leg.dur, `transform:translateY(${leg.to[1]}px)`, next?.ey])
    if (leg.transit) {
      // The streak: the show scales the ball by its time fraction through
      // the portal and stretches it by the remainder, so a few linear
      // sub-stops trace the curve closely enough.
      for (const f of [0, 0.25, 0.5, 0.75, 1]) {
        const scale = leg.transit === 'out' ? f : 1 - f
        shape.push([start + leg.dur * f, scaleXY(scale)])
      }
    }
  }
  shape.push([LOOP, scaleXY(0)])

  const give = 5 / (GROUND - BED)

  return [
    track(id('x'), x),
    track(id('y'), y),
    track(id('shape'), shape),
    // The spin dot: a few turns a loop, a rough match for the distance rolled.
    track(id('spin'), [
      [0, 'transform:rotate(0deg)'],
      [LOOP, 'transform:rotate(1440deg)']
    ]),

    // The far portal: wakes as the ball comes toward it, flashes paper and
    // rings out as it takes it, and sleeps again once the ball is away.
    track(id('eyeOut'), [
      [0, 'transform:scale(1)', 'in'],
      [0.5, 'transform:scale(0)'],
      [T_WAKE, 'transform:scale(0)', 'out'],
      [T_AWAKE, 'transform:scale(1)'],
      [LOOP, 'transform:scale(1)']
    ]),
    track(id('haloOut'), [
      [0, 'opacity:1', 'in'],
      [0.5, 'opacity:0'],
      [T_WAKE, 'opacity:0', 'out'],
      [T_AWAKE, 'opacity:1'],
      [LOOP, 'opacity:1']
    ]),
    track(id('spiralOut'), [
      [0, 'stroke-width:3.8', 'in'],
      [0.5, 'stroke-width:2.4'],
      [T_WAKE, 'stroke-width:2.4', 'out'],
      [T_AWAKE, 'stroke-width:3.8'],
      [LOOP, 'stroke-width:3.8']
    ]),
    // The cut is only the jump's length before the loop wraps, so the flash
    // fits inside it and the ring carries on across the wrap: WAVE_WRAP is
    // where a linear 0.45s ring has got to by the top of the loop.
    track(id('flashOut'), [
      ...hold(T_CUT - 0.01, 'opacity:0'),
      [T_CUT + 0.02, 'opacity:1'],
      [LOOP, 'opacity:0']
    ]),
    track(id('waveOut'), [
      [0, WAVE_WRAP],
      [WAVE - JUMP, 'transform:scale(1.9);opacity:0'],
      [T_CUT - 0.01, 'transform:scale(1);opacity:0'],
      [T_CUT, 'transform:scale(1);opacity:1'],
      [LOOP, WAVE_WRAP]
    ]),

    // The near portal: stirs as the ball nears the far one, flashes as it
    // gives the ball back, then sleeps.
    track(id('eyeIn'), [
      [0, 'transform:scale(1)'],
      [0.15, 'transform:scale(1)', 'in'],
      [0.75, 'transform:scale(0)'],
      [T_STIR, 'transform:scale(0)', 'out'],
      [T_CUT, 'transform:scale(1)'],
      [LOOP, 'transform:scale(1)']
    ]),
    track(id('haloIn'), [
      [0, 'opacity:1'],
      [0.15, 'opacity:1'],
      [0.75, 'opacity:0'],
      [T_STIR, 'opacity:0', 'out'],
      [T_CUT, 'opacity:1'],
      [LOOP, 'opacity:1']
    ]),
    track(id('spiralIn'), [
      [0, 'stroke-width:3.8'],
      [0.15, 'stroke-width:3.8'],
      [0.75, 'stroke-width:2.4'],
      [T_STIR, 'stroke-width:2.4', 'out'],
      [T_CUT, 'stroke-width:3.8'],
      [LOOP, 'stroke-width:3.8']
    ]),
    track(id('flashIn'), [
      [0, 'opacity:1'],
      [0.1, 'opacity:0'],
      [LOOP - 0.03, 'opacity:0'],
      [LOOP, 'opacity:1']
    ]),
    track(id('waveIn'), [
      [0, 'transform:scale(1);opacity:1', 'out'],
      [0.45, 'transform:scale(1.9);opacity:0'],
      [LOOP - 0.01, 'transform:scale(1);opacity:0'],
      [LOOP, 'transform:scale(1);opacity:1']
    ]),
    // The vortex turns in at an exit and out at an entry.
    track(id('turnIn'), [
      [0, 'transform:rotate(0deg)'],
      [LOOP, 'transform:rotate(-360deg)']
    ]),
    track(id('turnOut'), [
      [0, 'transform:rotate(0deg)'],
      [LOOP, 'transform:rotate(360deg)']
    ]),

    // The trampoline: the bed gives under the ball, throws, overshoots and
    // settles; the springs squash and stretch with it.
    track(id('bed'), [
      ...hold(T_STRIKE, 'transform:translateY(0)', 'out'),
      [T_THROW, 'transform:translateY(5px)', 'out'],
      [T_THROW + 0.2, 'transform:translateY(-2px)', 'inout'],
      [T_SETTLE, 'transform:translateY(0)'],
      [LOOP, 'transform:translateY(0)']
    ]),
    track(id('springs'), [
      ...hold(T_STRIKE, 'transform:scaleY(1)', 'out'),
      [T_THROW, `transform:scaleY(${(1 - give).toFixed(3)})`, 'out'],
      [
        T_THROW + 0.2,
        `transform:scaleY(${(1 + give * 0.4).toFixed(3)})`,
        'inout'
      ],
      [T_SETTLE, 'transform:scaleY(1)'],
      [LOOP, 'transform:scaleY(1)']
    ])
  ].join('\n')
}

// ---- drawing ---------------------------------------------------------------

type Anim = (name: string, lag?: number) => CSSProperties

const ink = {
  stroke: INK,
  strokeWidth: INK_W,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
} as const

function Rail({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  return <line x1={x0} y1={y} x2={x1} y2={y} {...ink} />
}

/** A post from a rail down to the ground, with a foot. */
function Post({ x, y0, y1 = GROUND }: { x: number; y0: number; y1?: number }) {
  return (
    <g {...ink}>
      <line x1={x} y1={y0} x2={x} y2={y1} />
      <line x1={x - 5} y1={y1} x2={x + 5} y2={y1} />
    </g>
  )
}

/**
 * Two decimals is plenty at card size, and rounding keeps the markup the
 * server sends identical to what the client computes — raw trig can differ
 * in the last digit between engines, which React reports as a hydration
 * mismatch.
 */
const round = (n: number) => Math.round(n * 100) / 100

/** The vortex, in circle space: 2.2 turns from near the rim in to the eye. */
function spiralPath(radius: number): string {
  const n = 40
  const pts: string[] = []
  for (let j = 0; j <= n; j++) {
    const f = j / n
    const th = f * Math.PI * 2 * 2.2
    const r = radius * 0.9 * (1 - f * 0.88)
    pts.push(`${round(Math.cos(th) * r)} ${round(Math.sin(th) * r)}`)
  }
  return `M${pts.join('L')}`
}

/** A zigzag spring standing on the ground, drawn upward from (0, 0). */
function springPath(height: number): string {
  const zigs = 4
  const step = height / (zigs * 2)
  let d = 'M0 0'
  for (let i = 1; i <= zigs * 2; i++) {
    d += `L${i % 2 ? -4 : 4} ${round(-step * i)}`
  }
  return d
}

const onEllipse = (a: number, b: number, th: number) =>
  [round(Math.cos(th) * a), round(Math.sin(th) * b)] as const

type PortalProps = {
  x: number
  rail: number
  /** 'in': the ball comes out of this one. 'out': it goes in. */
  kind: 'in' | 'out'
  anim: Anim
  /** Whether this portal is awake in the rest pose. */
  awake: boolean
}

function Portal({ x, rail, kind, anim, awake }: PortalProps) {
  const cy = rail - RING_LIFT
  const { rx, ry, band } = RING
  const ia = rx - band
  const ib = ry - band
  const out = kind === 'out'
  const suffix = out ? 'Out' : 'In'
  return (
    <g transform={`translate(${x} ${cy})`}>
      <Post x={0} y0={ry - 1} y1={GROUND - cy} />
      <ellipse rx={rx} ry={ry} fill={PORTAL} {...ink} />
      <ellipse rx={ia} ry={ib} fill={INK} />
      {/* The spiral is drawn on a circle and squashed to the hole, so turning
          it keeps it inside the ellipse; its stroke ignores the squash. */}
      <g transform={`scale(1 ${(ib / ia).toFixed(4)})`}>
        <g className={styles.run} style={anim(out ? 'turnIn' : 'turnOut')}>
          <path
            className={styles.run}
            style={anim(`spiral${suffix}`)}
            d={spiralPath(ia)}
            fill='none'
            stroke={PORTAL}
            strokeWidth={awake ? 3.8 : 2.4}
            strokeLinecap='round'
            vectorEffect='non-scaling-stroke'
          />
        </g>
      </g>
      {/* The eye swells with the charge to about half the hole, a little
          below centre, where the ball is drawn to. */}
      <g transform={`translate(0 ${EYE_LIFT - RING_LIFT})`}>
        <ellipse
          className={styles.run}
          style={anim(`eye${suffix}`)}
          rx={ia * 0.55}
          ry={ib * 0.55}
          fill={PORTAL}
          transform={awake ? 'scale(1)' : 'scale(0)'}
        />
      </g>
      {/* A halo of ticks round the ring while it works. */}
      <g
        className={styles.run}
        style={anim(`halo${suffix}`)}
        opacity={awake ? 1 : 0}
        {...ink}
      >
        {Array.from({ length: 8 }, (_, i) => {
          const th = (i / 8) * Math.PI * 2 + Math.PI / 8
          const [x0, y0] = onEllipse(rx + 4, ry + 4, th)
          const [x1, y1] = onEllipse(rx + 12, ry + 12, th)
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} />
        })}
      </g>
      {/* The jump: the eye flashes paper and one ring goes out from it. */}
      <ellipse
        className={styles.run}
        style={anim(`flash${suffix}`)}
        rx={ia}
        ry={ib}
        fill={BG}
        opacity={0}
      />
      <ellipse
        className={styles.run}
        style={anim(`wave${suffix}`)}
        rx={rx}
        ry={ry}
        fill='none'
        stroke={INK}
        strokeWidth={INK_W * 1.2}
        opacity={0}
      />
    </g>
  )
}

export function ContraptionsCover() {
  // Keyframe names must be unique per instance (and colon-free so they stay
  // valid identifiers).
  const uid = useId().replaceAll(':', '')
  const id = useMemo(() => (name: string) => `cc-${name}-${uid}`, [uid])
  const keyframes = useMemo(() => buildKeyframes(id), [id])

  // Every animated element shares the loop and is held at the rest pose by
  // the same negative delay; a trail ghost runs the clock `lag` behind.
  const anim: Anim = (name, lag = 0) => ({
    animationName: id(name),
    animationDuration: `${LOOP}s`,
    animationDelay: `${(-(T_POSE - lag)).toFixed(3)}s`
  })

  const rest = poseAt(T_POSE)

  return (
    <div className={styles.cover} aria-hidden='true'>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <pattern
            id={id('dots')}
            width='30'
            height='30'
            patternUnits='userSpaceOnUse'
          >
            <circle cx='15' cy='15' r='1.2' fill='var(--cc-dot)' />
          </pattern>
        </defs>

        {/* Paper with the show's dot backdrop. */}
        <rect width={STAGE_W} height={STAGE_H} fill={`url(#${id('dots')})`} />

        {/* ---- the chain: rail, drop, trampoline, shelf ---- */}
        <Rail x0={PORTAL_IN.x} x1={RAIL_END} y={RAIL_HI} />
        {/* the lip the ball rolls off */}
        <line
          x1={RAIL_END}
          y1={RAIL_HI}
          x2={RAIL_END}
          y2={RAIL_HI + 7}
          {...ink}
        />
        <Post x={484} y0={RAIL_HI} />
        <Post x={RAIL_END - 4} y0={RAIL_HI} />

        {/* Springs stand on the ground and squash from there; the bed rides
            on top and gives under the ball. */}
        {TRAMPOLINE.legs.map((sx) => (
          <g key={sx} transform={`translate(${sx} ${GROUND})`}>
            <line x1={-6} y1={0} x2={6} y2={0} {...ink} />
            <g className={styles.run} style={anim('springs')}>
              <path d={springPath(GROUND - BED)} fill='none' {...ink} />
            </g>
          </g>
        ))}
        <g transform={`translate(${TRAMPOLINE.x} ${BED})`}>
          <rect
            className={styles.run}
            style={anim('bed')}
            x={-TRAMPOLINE.halfW}
            y={-3}
            width={TRAMPOLINE.halfW * 2}
            height={6}
            rx={3}
            fill={ACCENT}
            {...ink}
          />
        </g>

        <Rail x0={SHELF} x1={PORTAL_OUT.x} y={RAIL_LO} />
        <Post x={SHELF + 4} y0={RAIL_LO} />
        <Post x={705} y0={RAIL_LO} />

        {/* ---- portals ---- */}
        <Portal {...PORTAL_IN} kind='in' anim={anim} awake={false} />
        <Portal {...PORTAL_OUT} kind='out' anim={anim} awake />

        {/* ---- the ball and its trail ---- */}
        {/* Ghosts run the same path a few frames behind, so the trail is
            wherever the ball has just been — an arc, at rest. */}
        {TRAIL.map(({ lag, r, opacity }) => {
          const ghost = poseAt(T_POSE - lag)
          return (
            <g
              key={lag}
              className={styles.run}
              style={anim('x', lag)}
              transform={`translate(${ghost.x.toFixed(2)} 0)`}
            >
              <g
                className={styles.run}
                style={anim('y', lag)}
                transform={`translate(0 ${ghost.y.toFixed(2)})`}
              >
                <circle
                  className={styles.run}
                  style={anim('shape', lag)}
                  r={r}
                  fill={BALL}
                  opacity={opacity}
                />
              </g>
            </g>
          )
        })}
        <g
          className={styles.run}
          style={anim('x')}
          transform={`translate(${rest.x.toFixed(2)} 0)`}
        >
          <g
            className={styles.run}
            style={anim('y')}
            transform={`translate(0 ${rest.y.toFixed(2)})`}
          >
            <g className={styles.run} style={anim('shape')}>
              <circle r={R} fill={BALL} {...ink} />
              <g className={styles.run} style={anim('spin')}>
                <circle cx={R * 0.48} r={2} fill={INK} />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
