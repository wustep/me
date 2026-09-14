import { type CSSProperties, useId, useMemo } from 'react'

import styles from './ContraptionsCover.module.css'

/**
 * ContraptionsCover — the hop.
 *
 *   Cover for the Contraptions playground entry: one beat of the show, drawn
 *   in its own hand. A ball comes out of a portal onto a rail, rolls off the
 *   end, drops onto a trampoline, flies up onto a lower shelf and rolls into
 *   a second portal, which draws it out into a streak and swallows it. The
 *   iris closes on that portal in the world's ink, holds shut a beat, opens
 *   again on the first, and the ball comes out to go round again. At rest
 *   the ball hangs just past the top of its flight with its trail behind it
 *   and the far portal already awake.
 *
 *   The stage is far wider than any card (1200×240, sliced to the cover box)
 *   so the full height always fits and a wide card reveals more machine — a
 *   pendulum and a paddle in the left wing, a lift and stairs in the right —
 *   while the whole hop, both portals included, plays inside the middle ~400
 *   units a grid card shows at laptop width.
 *
 *   Every colour is a CSS custom property, so the scene follows the site
 *   theme: the show's Risograph palette on paper in light mode, its Noir
 *   palette in dark (see the stylesheet). Every timed thing reads one clock:
 *   the ball's path is the table of legs below, and every other keyframe —
 *   portals waking, the trampoline giving, the iris — is generated from the
 *   same moments, so retiming the hop is an edit to the table.
 */

// ---- stage -----------------------------------------------------------------

const STAGE_W = 1200
const STAGE_H = 240
/** Posts stand here. There is no ground line, as in the show: only feet. */
const GROUND = 212
/** The rail the ball comes out onto, and the shelf it lands on. */
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
const ACCENT_A = 'var(--cc-a)'
const ACCENT_B = 'var(--cc-b)'
const ACCENT_C = 'var(--cc-c)'

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

/**
 * The iris is a ring of ink with an enormous stroke, so scaling it scales
 * the hole: the world closes down onto one portal and opens out from the
 * other, as in the show. Inner edge at 100 units; open, the hole clears the
 * stage from either eye; shut, the ink still covers it from either eye and
 * the hole is a pinprick of paper on the eye.
 */
const IRIS = { r: 5300, stroke: 10_400, open: 8.6, shut: 0.08 }

// ---- the wings -------------------------------------------------------------

/** Left: a rail with a pendulum hanging over it from a gallows, and a paddle. */
const WING_RAIL = { x0: 120, x1: 352, y: RAIL_LO }
const PENDULUM = {
  pivot: { x: 230, y: 50 },
  beam: { x0: 145, x1: 265 },
  post: 150,
  rod: 66,
  bob: 11
}
const PADDLE = { x: 326, hub: 108, arm: 20 }

/** Right: a lift up to a rail, and stairs down to a lower one. */
const LIFT = { x0: 930, x1: 966, top: 52, wheel: { y: 44, r: 9 } }
const CAGE = { w: 22, h: 18, bottom: GROUND - 6, rise: 100 }
const CHAIN_TOP = LIFT.wheel.y + LIFT.wheel.r
const CHAIN_LEN = CAGE.bottom - CAGE.h - CHAIN_TOP
/** How much chain is left when the cage is up. */
const CHAIN_UP = (CHAIN_LEN - CAGE.rise) / CHAIN_LEN
const STAIRS = {
  rail: { x0: LIFT.x1, x1: 1019, y: RAIL_HI },
  steps: [
    { x0: 1019, x1: 1039, top: 103 },
    { x0: 1039, x1: 1059, top: 120 }
  ],
  landing: { x0: 1059, x1: 1150, y: RAIL_LO }
}

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

const BALL_HI = RAIL_HI - R
const BALL_LO = RAIL_LO - R
const BALL_BED = BED - R

/** Where the first rail ends, the trampoline under it, and where the shelf begins. */
const RAIL_END = 535
const TRAMPOLINE = { x: 580, halfW: 24, legs: [564, 596] }
const SHELF_START = 642

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
  // gone: the cut, the iris, the next portal waking
  { to: [EYE_OUT.x, EYE_OUT.y], dur: 1.35 }
]

/** When each leg begins, in seconds. */
const LEG_START = LEGS.map((_, i) =>
  LEGS.slice(0, i).reduce((sum, leg) => sum + leg.dur, 0)
)
const LOOP = LEGS.reduce((sum, leg) => sum + leg.dur, 0)

/** Moments the rest of the scene keys off. */
const T_APEX = LEG_START[6]!
/** The far portal takes the ball: the eye flashes, the iris closes. */
const T_CUT = LEG_START[9]!
const T_SHUT = T_CUT + 0.35
const T_OPEN = T_SHUT + 0.2
const T_LIT = T_OPEN + 0.4
/** The far portal wakes as the ball comes off the trampoline toward it. */
const T_WAKE = LEG_START[5]! + 0.1
const T_AWAKE = T_WAKE + 0.4
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
    // rings out as it takes it, stays lit while the iris closes on it, and
    // goes to sleep behind the shut iris so it is dark once that re-opens.
    track(id('eyeOut'), [
      ...hold(T_WAKE, 'transform:scale(0)', 'out'),
      [T_AWAKE, 'transform:scale(1)'],
      [T_SHUT, 'transform:scale(1)'],
      [T_SHUT + 0.1, 'transform:scale(0)'],
      [LOOP, 'transform:scale(0)']
    ]),
    track(id('haloOut'), [
      ...hold(T_WAKE, 'opacity:0', 'out'),
      [T_AWAKE, 'opacity:1'],
      [T_SHUT, 'opacity:1'],
      [T_SHUT + 0.1, 'opacity:0'],
      [LOOP, 'opacity:0']
    ]),
    track(id('spiralOut'), [
      ...hold(T_WAKE, 'stroke-width:2.4', 'out'),
      [T_AWAKE, 'stroke-width:3.8'],
      [T_SHUT, 'stroke-width:3.8'],
      [T_SHUT + 0.1, 'stroke-width:2.4'],
      [LOOP, 'stroke-width:2.4']
    ]),
    track(id('flashOut'), [
      ...hold(T_CUT - 0.02, 'opacity:0'),
      [T_CUT + 0.02, 'opacity:1'],
      [T_CUT + 0.12, 'opacity:0'],
      [LOOP, 'opacity:0']
    ]),
    track(id('waveOut'), [
      ...hold(T_CUT - 0.01, 'transform:scale(1);opacity:0'),
      [T_CUT, 'transform:scale(1);opacity:1', 'out'],
      [T_CUT + 0.45, 'transform:scale(1.9);opacity:0'],
      [LOOP, 'transform:scale(1.9);opacity:0']
    ]),

    // The near portal: awake through the cut so the iris opens on it lit,
    // flashes as it delivers the ball, then sleeps.
    track(id('eyeIn'), [
      [0, 'transform:scale(1)'],
      [0.15, 'transform:scale(1)', 'in'],
      [0.75, 'transform:scale(0)'],
      [T_SHUT, 'transform:scale(0)'],
      [T_SHUT + 0.08, 'transform:scale(1)'],
      [LOOP, 'transform:scale(1)']
    ]),
    track(id('haloIn'), [
      [0, 'opacity:1'],
      [0.15, 'opacity:1'],
      [0.75, 'opacity:0'],
      [T_SHUT, 'opacity:0'],
      [T_SHUT + 0.08, 'opacity:1'],
      [LOOP, 'opacity:1']
    ]),
    track(id('spiralIn'), [
      [0, 'stroke-width:3.8'],
      [0.15, 'stroke-width:3.8'],
      [0.75, 'stroke-width:2.4'],
      [T_SHUT, 'stroke-width:2.4'],
      [T_SHUT + 0.08, 'stroke-width:3.8'],
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

    // The iris: closes down onto the far portal in ink, holds shut, opens
    // out from the near one. Two rings, each shown only while it works and
    // swapped while both are shut, so the hand-off never shows.
    track(id('irisOut'), [
      ...hold(T_CUT - 0.01, `transform:scale(${IRIS.open});opacity:0`),
      [T_CUT, `transform:scale(${IRIS.open});opacity:1`, 'in'],
      [T_SHUT, `transform:scale(${IRIS.shut});opacity:1`],
      [T_OPEN + 0.01, `transform:scale(${IRIS.shut});opacity:1`],
      [T_OPEN + 0.02, `transform:scale(${IRIS.shut});opacity:0`],
      [LOOP, `transform:scale(${IRIS.shut});opacity:0`]
    ]),
    track(id('irisIn'), [
      ...hold(T_OPEN - 0.01, `transform:scale(${IRIS.shut});opacity:0`),
      [T_OPEN, `transform:scale(${IRIS.shut});opacity:1`, 'out'],
      [T_LIT, `transform:scale(${IRIS.open});opacity:1`],
      [T_LIT + 0.01, `transform:scale(${IRIS.open});opacity:0`],
      [LOOP, `transform:scale(${IRIS.open});opacity:0`]
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
      [
        T_THROW,
        `transform:scaleY(${(1 - 5 / (GROUND - BED)).toFixed(3)})`,
        'out'
      ],
      [
        T_THROW + 0.2,
        `transform:scaleY(${(1 + 2 / (GROUND - BED)).toFixed(3)})`,
        'inout'
      ],
      [T_SETTLE, 'transform:scaleY(1)'],
      [LOOP, 'transform:scaleY(1)']
    ]),

    // The wings: a pendulum swinging, a paddle turning, a lift going up and
    // coming back. Living parts of the rest of the map, none in the ball's way.
    track(id('swing'), [
      [0, 'transform:rotate(-12deg)', 'inout'],
      [LOOP / 2, 'transform:rotate(12deg)', 'inout'],
      [LOOP, 'transform:rotate(-12deg)']
    ]),
    track(id('paddle'), [
      [0, 'transform:rotate(0deg)'],
      [LOOP, 'transform:rotate(360deg)']
    ]),
    track(id('cage'), [
      [0, 'transform:translateY(0)', 'inout'],
      [LOOP * 0.45, `transform:translateY(${-CAGE.rise}px)`],
      [LOOP * 0.55, `transform:translateY(${-CAGE.rise}px)`, 'inout'],
      [LOOP, 'transform:translateY(0)']
    ]),
    track(id('chain'), [
      [0, 'transform:scaleY(1)', 'inout'],
      [LOOP * 0.45, `transform:scaleY(${CHAIN_UP.toFixed(3)})`],
      [LOOP * 0.55, `transform:scaleY(${CHAIN_UP.toFixed(3)})`, 'inout'],
      [LOOP, 'transform:scaleY(1)']
    ]),
    track(id('wheel'), [
      [0, 'transform:rotate(0deg)', 'inout'],
      [LOOP * 0.45, 'transform:rotate(-540deg)'],
      [LOOP * 0.55, 'transform:rotate(-540deg)', 'inout'],
      [LOOP, 'transform:rotate(0deg)']
    ])
  ].join('\n')
}

// ---- drawing ---------------------------------------------------------------

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

/** The vortex, in circle space: 2.2 turns from near the rim in to the eye. */
function spiralPath(radius: number): string {
  const n = 40
  const pts: string[] = []
  for (let j = 0; j <= n; j++) {
    const f = j / n
    const th = f * Math.PI * 2 * 2.2
    const r = radius * 0.9 * (1 - f * 0.88)
    pts.push(
      `${(Math.cos(th) * r).toFixed(2)} ${(Math.sin(th) * r).toFixed(2)}`
    )
  }
  return `M${pts.join('L')}`
}

/** A zigzag spring standing on the ground, drawn upward from (0, 0). */
function springPath(height: number): string {
  const zigs = 4
  const step = height / (zigs * 2)
  let d = 'M0 0'
  for (let i = 1; i <= zigs * 2; i++) {
    d += `L${i % 2 ? -4 : 4} ${(-step * i).toFixed(2)}`
  }
  return d
}

const onEllipse = (a: number, b: number, th: number) =>
  [Math.cos(th) * a, Math.sin(th) * b] as const

type Anim = (name: string, lag?: number) => CSSProperties

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
      {/* The cut: the eye flashes paper and one ring goes out from it. */}
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

        {/* ---- left wing: gallows, pendulum, paddle, over a rail ---- */}
        <g>
          <Rail {...WING_RAIL} />
          <Post x={270} y0={WING_RAIL.y} />
          <Post x={WING_RAIL.x1 - 6} y0={WING_RAIL.y} />
          <line
            x1={PENDULUM.beam.x0}
            y1={PENDULUM.pivot.y}
            x2={PENDULUM.beam.x1}
            y2={PENDULUM.pivot.y}
            {...ink}
          />
          <Post x={PENDULUM.post} y0={PENDULUM.pivot.y} />
          <g transform={`translate(${PENDULUM.pivot.x} ${PENDULUM.pivot.y})`}>
            <g
              className={styles.run}
              style={anim('swing')}
              transform='rotate(-12)'
            >
              <line x1={0} y1={0} x2={0} y2={PENDULUM.rod} {...ink} />
              <circle
                cy={PENDULUM.rod}
                r={PENDULUM.bob}
                fill={ACCENT_C}
                {...ink}
              />
            </g>
            <circle r={3} fill={INK} />
          </g>
          <Post x={PADDLE.x} y0={PADDLE.hub} y1={WING_RAIL.y} />
          <g transform={`translate(${PADDLE.x} ${PADDLE.hub})`}>
            <g className={styles.run} style={anim('paddle')}>
              {[0, 90].map((deg) => (
                <rect
                  key={deg}
                  x={-PADDLE.arm}
                  y={-3}
                  width={PADDLE.arm * 2}
                  height={6}
                  rx={2}
                  fill={ACCENT_A}
                  transform={`rotate(${deg})`}
                  {...ink}
                />
              ))}
            </g>
            <circle r={3.5} fill={INK} />
          </g>
        </g>

        {/* ---- the chain: rail, drop, trampoline, shelf ---- */}
        <g>
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

          {/* Springs stand on the ground and squash from there; the bed
              rides on top and gives under the ball. */}
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
              fill={ACCENT_A}
              {...ink}
            />
          </g>

          <Rail x0={SHELF_START} x1={PORTAL_OUT.x} y={RAIL_LO} />
          <Post x={SHELF_START + 4} y0={RAIL_LO} />
          <Post x={705} y0={RAIL_LO} />
        </g>

        {/* ---- right wing: lift up to a rail, stairs down to another ---- */}
        <g>
          <line x1={LIFT.x0} y1={LIFT.top} x2={LIFT.x0} y2={GROUND} {...ink} />
          <line x1={LIFT.x1} y1={LIFT.top} x2={LIFT.x1} y2={GROUND} {...ink} />
          <line
            x1={LIFT.x0 - 5}
            y1={GROUND}
            x2={LIFT.x1 + 5}
            y2={GROUND}
            {...ink}
          />
          {Array.from({ length: 6 }, (_, i) => LIFT.top + 22 + i * 26).map(
            (yy) => (
              <g key={yy} {...ink}>
                <line x1={LIFT.x0} y1={yy} x2={LIFT.x0 + 6} y2={yy} />
                <line x1={LIFT.x1 - 6} y1={yy} x2={LIFT.x1} y2={yy} />
              </g>
            )
          )}
          <g transform={`translate(${(LIFT.x0 + LIFT.x1) / 2} ${CHAIN_TOP})`}>
            <g className={styles.run} style={anim('chain')}>
              <line x1={0} y1={0} x2={0} y2={CHAIN_LEN} {...ink} />
            </g>
            <g className={styles.run} style={anim('cage')}>
              <rect
                x={-CAGE.w / 2}
                y={CHAIN_LEN}
                width={CAGE.w}
                height={CAGE.h}
                rx={2}
                fill={ACCENT_B}
                {...ink}
              />
            </g>
          </g>
          <g
            transform={`translate(${(LIFT.x0 + LIFT.x1) / 2} ${LIFT.wheel.y})`}
          >
            <g className={styles.run} style={anim('wheel')}>
              <circle r={LIFT.wheel.r} fill={ACCENT_B} {...ink} />
              <line
                x1={-LIFT.wheel.r}
                y1={0}
                x2={LIFT.wheel.r}
                y2={0}
                {...ink}
              />
              <line
                x1={0}
                y1={-LIFT.wheel.r}
                x2={0}
                y2={LIFT.wheel.r}
                {...ink}
              />
            </g>
          </g>
          <Rail {...STAIRS.rail} />
          <Post x={STAIRS.rail.x1 - 4} y0={STAIRS.rail.y} />
          {STAIRS.steps.map((s) => (
            <rect
              key={s.x0}
              x={s.x0}
              y={s.top}
              width={s.x1 - s.x0}
              height={RAIL_LO - s.top}
              fill={ACCENT_A}
              {...ink}
            />
          ))}
          <Rail {...STAIRS.landing} />
          <Post x={STAIRS.landing.x0 + 8} y0={STAIRS.landing.y} />
          <Post x={STAIRS.landing.x1 - 8} y0={STAIRS.landing.y} />
        </g>

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

        {/* ---- the iris ---- */}
        {/* One ring of ink on each eye (see IRIS); at rest both are open and
            hidden. */}
        {[
          { name: 'irisOut', eye: EYE_OUT },
          { name: 'irisIn', eye: EYE_IN }
        ].map(({ name, eye }) => (
          <g key={name} transform={`translate(${eye.x} ${eye.y})`}>
            <circle
              className={styles.run}
              style={anim(name)}
              r={IRIS.r}
              fill='none'
              stroke={INK}
              strokeWidth={IRIS.stroke}
              opacity={0}
              transform={`scale(${IRIS.open})`}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}
