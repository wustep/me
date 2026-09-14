import { type CSSProperties, type ReactElement, useId, useMemo } from 'react'

import styles from './ContraptionsCover.module.css'

/**
 * ContraptionsCover — the hop, in two worlds.
 *
 *   Cover for the Contraptions playground entry: one beat of the show, drawn
 *   in its own hand. A ball comes out of a portal onto a rail, is carried
 *   across a short chain and is drawn out into a streak and swallowed by a
 *   second portal; the iris closes down onto that portal in the world's
 *   ink, holds shut a beat, opens out from the first, and the ball comes
 *   out to go round again.
 *
 *   The show puts a whole new map behind every portal, so the cover keeps
 *   two sibling worlds and shows the one that matches the site theme:
 *
 *   - light — the Risograph world, on paper with the show's dot backdrop.
 *     The ball rolls off the end of its rail, drops onto a trampoline and is
 *     thrown up onto the shelf where the far portal stands.
 *   - dark — the Noir world, on black under stars, the ball the one red
 *     thing. The ball drops through a paper funnel into a cannon, which
 *     fires it up onto the shelf in a puff of smoke.
 *
 *   Both worlds are in the DOM; the stylesheet shows one per theme, so the
 *   swap follows `body.dark-mode` with no script and no flash. They share
 *   the portals, the ball and its trail, the iris and the clock: each world
 *   is a table of legs the ball travels, and every keyframe in the scene —
 *   the ball, the portals waking, the world's own pieces, the iris — is
 *   generated from that table, so retiming is an edit to the table.
 *
 *   Nothing is on stage that the ball does not use. The stage is wide
 *   (1200×240, sliced to the cover box) so the full height always fits; the
 *   whole hop, both portals included, sits inside the middle ~400 units a
 *   grid card shows at laptop width, and a wider card only shows more
 *   paper, as the show's own wide camera does.
 */

// ---- stage -----------------------------------------------------------------

const STAGE_W = 1200
const STAGE_H = 240
/** Posts stand here. There is no ground line, as in the show: only feet. */
const GROUND = 212
/** The rail the ball comes out onto, and the shelf the far portal stands on. */
const RAIL_HI = 86
const RAIL_LO = 136
const R = 10
/** One ink weight for everything, as in the show. */
const INK_W = 3

const INK = 'var(--cc-ink)'
const BG = 'var(--cc-bg)'
const BALL = 'var(--cc-ball)'
const PORTAL = 'var(--cc-portal)'
const ACCENT_A = 'var(--cc-a)'
const ACCENT_B = 'var(--cc-b)'

const BALL_HI = RAIL_HI - R
const BALL_LO = RAIL_LO - R

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

// ---- legs and timing -------------------------------------------------------

type Ease = 'linear' | 'in' | 'out' | 'inout'

type Leg = {
  to: [number, number]
  /** Seconds. */
  dur: number
  ex?: Ease
  ey?: Ease
  /** The ball is crossing a portal: growing from nothing, or shrinking to it. */
  transit?: 'out' | 'in'
  /** The ball is out of sight — inside a barrel. */
  hidden?: boolean
  /** This leg ends at the top of the flight: the rest pose is parked just after. */
  apex?: boolean
  /** The far portal wakes as this leg begins. */
  wake?: boolean
}

/** The moments the rest of a world keys off, all from its table of legs. */
type Timing = {
  loop: number
  /** When each leg begins, in seconds. */
  start: number[]
  /** Where the clock is parked at rest. */
  pose: number
  /** The far portal starts to wake, and is fully awake. */
  wake: number
  awake: number
  /** The far portal takes the ball: the eye flashes, the iris closes. */
  cut: number
  /** The iris is fully shut; begins to open on the near portal; is fully open. */
  shut: number
  open: number
  lit: number
}

function timingOf(legs: Leg[], poseAfterApex: number): Timing {
  const start = legs.map((_, i) =>
    legs.slice(0, i).reduce((sum, leg) => sum + leg.dur, 0)
  )
  const loop = legs.reduce((sum, leg) => sum + leg.dur, 0)
  const apexLeg = legs.findIndex((leg) => leg.apex)
  const wakeLeg = legs.findIndex((leg) => leg.wake)
  // The last leg is the ball's absence: the cut, the iris, the next portal
  // waking.
  const cut = start.at(-1)!
  const shut = cut + 0.35
  const open = shut + 0.2
  return {
    loop,
    start,
    pose: start[apexLeg]! + legs[apexLeg]!.dur + poseAfterApex,
    wake: start[wakeLeg]!,
    awake: start[wakeLeg]! + 0.4,
    cut,
    shut,
    open,
    lit: open + 0.4
  }
}

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

/** Where the ball is `t` seconds into a world's loop, for the rest pose. */
function poseAt(legs: Leg[], t: Timing, at: number): { x: number; y: number } {
  let from: [number, number] = [EYE_IN.x, EYE_IN.y]
  for (const [i, leg] of legs.entries()) {
    const start = t.start[i]!
    if (at <= start + leg.dur) {
      const raw = (at - start) / leg.dur
      return {
        x: from[0] + (leg.to[0] - from[0]) * easeValue(leg.ex, raw),
        y: from[1] + (leg.to[1] - from[1]) * easeValue(leg.ey, raw)
      }
    }
    from = leg.to
  }
  return { x: from[0], y: from[1] }
}

/** Trail ghosts follow the same path this far behind the ball, in seconds. */
const TRAIL = [
  { lag: 0.06, r: R * 0.9, opacity: 0.4 },
  { lag: 0.12, r: R * 0.78, opacity: 0.26 },
  { lag: 0.18, r: R * 0.66, opacity: 0.14 }
]

// ---- keyframes -------------------------------------------------------------

const EASE_CSS: Record<Ease, string> = {
  linear: 'linear',
  in: 'cubic-bezier(0.11, 0, 0.5, 0)',
  out: 'cubic-bezier(0.5, 1, 0.89, 1)',
  inout: 'cubic-bezier(0.45, 0, 0.55, 1)'
}

/** A keyframe: at `t` seconds, these declarations, easing into the next. */
type Stop = [t: number, decl: string, ease?: Ease]

type Track = (name: string, stops: Stop[]) => string
type Id = (name: string) => string

/** A keyframe writer for one loop length: seconds in, percentages out. */
const trackFor =
  (loop: number): Track =>
  (name, stops) =>
    `@keyframes ${name}{${stops
      .map(
        ([t, decl, ease]) =>
          `${((t / loop) * 100).toFixed(3)}%{${decl};animation-timing-function:${EASE_CSS[ease ?? 'linear']}}`
      )
      .join('')}}`

/** Hold `decl` from the top of the loop to `t`, then ease on to the next stop. */
const hold = (t: number, decl: string, ease?: Ease): Stop[] => [
  [0, decl],
  [t, decl, ease]
]

/** The ball drawn out along its motion as it crosses a portal (the show's formula). */
const stretchAt = (scale: number) => 1 + 2.4 * (1 - scale) ** 1.4

const scaleXY = (scale: number) =>
  `transform:scale(${(scale * stretchAt(scale)).toFixed(3)},${scale.toFixed(3)})`

/**
 * The keyframes every world shares: the ball on its legs, the portals, the
 * iris. Names carry the instance id so two cards never share a timeline.
 */
function sharedKeyframes(id: Id, legs: Leg[], t: Timing, track: Track) {
  const x: Stop[] = [[0, `transform:translateX(${EYE_IN.x}px)`, legs[0]!.ex]]
  const y: Stop[] = [[0, `transform:translateY(${EYE_IN.y}px)`, legs[0]!.ey]]
  const shape: Stop[] = []
  for (const [i, leg] of legs.entries()) {
    const start = t.start[i]!
    const end = start + leg.dur
    const next = legs[i + 1]
    x.push([end, `transform:translateX(${leg.to[0]}px)`, next?.ex])
    y.push([end, `transform:translateY(${leg.to[1]}px)`, next?.ey])
    if (leg.transit) {
      // The streak: the show scales the ball by its time fraction through
      // the portal and stretches it by the remainder, so a few linear
      // sub-stops trace the curve closely enough.
      for (const f of [0, 0.25, 0.5, 0.75, 1]) {
        const scale = leg.transit === 'out' ? f : 1 - f
        shape.push([start + leg.dur * f, scaleXY(scale)])
      }
    } else if (leg.hidden) {
      shape.push(
        [start, scaleXY(1)],
        [start + 0.001, scaleXY(0)],
        [end - 0.001, scaleXY(0)],
        [end, scaleXY(1)]
      )
    }
  }
  shape.push([t.loop, scaleXY(0)])

  return [
    track(id('x'), x),
    track(id('y'), y),
    track(id('shape'), shape),
    // The spin dot: a few turns a loop, a rough match for the distance rolled.
    track(id('spin'), [
      [0, 'transform:rotate(0deg)'],
      [t.loop, 'transform:rotate(1440deg)']
    ]),

    // The far portal: wakes as the ball comes toward it, flashes paper and
    // rings out as it takes it, stays lit while the iris closes on it, and
    // goes to sleep behind the shut iris so it is dark once that re-opens.
    track(id('eyeOut'), [
      ...hold(t.wake, 'transform:scale(0)', 'out'),
      [t.awake, 'transform:scale(1)'],
      [t.shut, 'transform:scale(1)'],
      [t.shut + 0.1, 'transform:scale(0)'],
      [t.loop, 'transform:scale(0)']
    ]),
    track(id('haloOut'), [
      ...hold(t.wake, 'opacity:0', 'out'),
      [t.awake, 'opacity:1'],
      [t.shut, 'opacity:1'],
      [t.shut + 0.1, 'opacity:0'],
      [t.loop, 'opacity:0']
    ]),
    track(id('spiralOut'), [
      ...hold(t.wake, 'stroke-width:2.4', 'out'),
      [t.awake, 'stroke-width:3.8'],
      [t.shut, 'stroke-width:3.8'],
      [t.shut + 0.1, 'stroke-width:2.4'],
      [t.loop, 'stroke-width:2.4']
    ]),
    track(id('flashOut'), [
      ...hold(t.cut - 0.02, 'opacity:0'),
      [t.cut + 0.02, 'opacity:1'],
      [t.cut + 0.12, 'opacity:0'],
      [t.loop, 'opacity:0']
    ]),
    track(id('waveOut'), [
      ...hold(t.cut - 0.01, 'transform:scale(1);opacity:0'),
      [t.cut, 'transform:scale(1);opacity:1', 'out'],
      [t.cut + 0.45, 'transform:scale(1.9);opacity:0'],
      [t.loop, 'transform:scale(1.9);opacity:0']
    ]),

    // The near portal: awake through the cut so the iris opens on it lit,
    // flashes as it delivers the ball, then sleeps.
    track(id('eyeIn'), [
      [0, 'transform:scale(1)'],
      [0.15, 'transform:scale(1)', 'in'],
      [0.75, 'transform:scale(0)'],
      [t.shut, 'transform:scale(0)'],
      [t.shut + 0.08, 'transform:scale(1)'],
      [t.loop, 'transform:scale(1)']
    ]),
    track(id('haloIn'), [
      [0, 'opacity:1'],
      [0.15, 'opacity:1'],
      [0.75, 'opacity:0'],
      [t.shut, 'opacity:0'],
      [t.shut + 0.08, 'opacity:1'],
      [t.loop, 'opacity:1']
    ]),
    track(id('spiralIn'), [
      [0, 'stroke-width:3.8'],
      [0.15, 'stroke-width:3.8'],
      [0.75, 'stroke-width:2.4'],
      [t.shut, 'stroke-width:2.4'],
      [t.shut + 0.08, 'stroke-width:3.8'],
      [t.loop, 'stroke-width:3.8']
    ]),
    track(id('flashIn'), [
      [0, 'opacity:1'],
      [0.1, 'opacity:0'],
      [t.loop - 0.03, 'opacity:0'],
      [t.loop, 'opacity:1']
    ]),
    track(id('waveIn'), [
      [0, 'transform:scale(1);opacity:1', 'out'],
      [0.45, 'transform:scale(1.9);opacity:0'],
      [t.loop - 0.01, 'transform:scale(1);opacity:0'],
      [t.loop, 'transform:scale(1);opacity:1']
    ]),
    // The vortex turns in at an exit and out at an entry.
    track(id('turnIn'), [
      [0, 'transform:rotate(0deg)'],
      [t.loop, 'transform:rotate(-360deg)']
    ]),
    track(id('turnOut'), [
      [0, 'transform:rotate(0deg)'],
      [t.loop, 'transform:rotate(360deg)']
    ]),

    // The iris: closes down onto the far portal in ink, holds shut, opens
    // out from the near one. Two rings, each shown only while it works and
    // swapped while both are shut, so the hand-off never shows.
    track(id('irisOut'), [
      ...hold(t.cut - 0.01, `transform:scale(${IRIS.open});opacity:0`),
      [t.cut, `transform:scale(${IRIS.open});opacity:1`, 'in'],
      [t.shut, `transform:scale(${IRIS.shut});opacity:1`],
      [t.open + 0.01, `transform:scale(${IRIS.shut});opacity:1`],
      [t.open + 0.02, `transform:scale(${IRIS.shut});opacity:0`],
      [t.loop, `transform:scale(${IRIS.shut});opacity:0`]
    ]),
    track(id('irisIn'), [
      ...hold(t.open - 0.01, `transform:scale(${IRIS.shut});opacity:0`),
      [t.open, `transform:scale(${IRIS.shut});opacity:1`, 'out'],
      [t.lit, `transform:scale(${IRIS.open});opacity:1`],
      [t.lit + 0.01, `transform:scale(${IRIS.open});opacity:0`],
      [t.loop, `transform:scale(${IRIS.open});opacity:0`]
    ])
  ]
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

/**
 * Two decimals is plenty at card size, and rounding keeps the markup the
 * server sends identical to what the client computes — raw trig can differ
 * in the last digit between engines, which React reports as a hydration
 * mismatch.
 */
const round = (n: number) => Math.round(n * 100) / 100

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

// ---- worlds ----------------------------------------------------------------

type World = {
  name: 'light' | 'dark'
  backdrop: 'dots' | 'stars'
  legs: Leg[]
  /** Seconds past the top of the flight to park the rest pose. */
  poseAfterApex: number
  /** Keyframes for the world's own pieces. */
  keyframes: (id: Id, t: Timing, track: Track) => string[]
  /** The world's pieces, drawn behind the ball. */
  Pieces: (props: { anim: Anim }) => ReactElement
}

/* ---- light: the Risograph world ----
   The ball rolls off the end of its rail, drops onto a trampoline and is
   thrown up onto the shelf. Legs 2–5 are the drop, the bed giving, the bed
   throwing, and the flight. */

const LIGHT_RAIL_END = 535
const BED = 186
const TRAMPOLINE = { x: 580, halfW: 24, legs: [564, 596] }
const LIGHT_SHELF = 642
const BALL_BED = BED - R

const LIGHT: World = {
  name: 'light',
  backdrop: 'dots',
  poseAfterApex: 0.1,
  legs: [
    // pushed out of the entry, a streak that rounds into a ball
    { to: [458, BALL_HI], dur: 0.45, ex: 'out', ey: 'out', transit: 'out' },
    // rolls to the end of the rail
    { to: [LIGHT_RAIL_END, BALL_HI], dur: 0.55 },
    // drops onto the trampoline
    { to: [572, BALL_BED], dur: 0.4, ey: 'in' },
    // the bed gives…
    { to: [577, BALL_BED + 5], dur: 0.08, ey: 'out' },
    // …and throws it
    { to: [582, BALL_BED], dur: 0.08, ey: 'in' },
    // up to the top of the flight; the far portal wakes
    { to: [624, 64], dur: 0.42, ey: 'out', apex: true, wake: true },
    // down onto the shelf
    { to: [664, BALL_LO], dur: 0.3, ey: 'in' },
    // rolls to the far portal
    { to: [748, BALL_LO], dur: 0.6 },
    // drawn out into a streak and pulled into the eye
    {
      to: [EYE_OUT.x, EYE_OUT.y],
      dur: 0.4,
      ex: 'in',
      ey: 'in',
      transit: 'in'
    },
    // gone: the cut, the iris, the next portal waking
    { to: [EYE_OUT.x, EYE_OUT.y], dur: 1.35 }
  ],
  keyframes: (id, t, track) => {
    // The bed gives under the ball, throws, overshoots and settles; the
    // springs squash and stretch with it.
    const strike = t.start[3]!
    const toss = t.start[5]!
    const settle = toss + 0.55
    const give = 5 / (GROUND - BED)
    return [
      track(id('bed'), [
        ...hold(strike, 'transform:translateY(0)', 'out'),
        [toss, 'transform:translateY(5px)', 'out'],
        [toss + 0.2, 'transform:translateY(-2px)', 'inout'],
        [settle, 'transform:translateY(0)'],
        [t.loop, 'transform:translateY(0)']
      ]),
      track(id('springs'), [
        ...hold(strike, 'transform:scaleY(1)', 'out'),
        [toss, `transform:scaleY(${(1 - give).toFixed(3)})`, 'out'],
        [
          toss + 0.2,
          `transform:scaleY(${(1 + give * 0.4).toFixed(3)})`,
          'inout'
        ],
        [settle, 'transform:scaleY(1)'],
        [t.loop, 'transform:scaleY(1)']
      ])
    ]
  },
  Pieces: ({ anim }) => (
    <g>
      <Rail x0={PORTAL_IN.x} x1={LIGHT_RAIL_END} y={RAIL_HI} />
      {/* the lip the ball rolls off */}
      <line
        x1={LIGHT_RAIL_END}
        y1={RAIL_HI}
        x2={LIGHT_RAIL_END}
        y2={RAIL_HI + 7}
        {...ink}
      />
      <Post x={484} y0={RAIL_HI} />
      <Post x={LIGHT_RAIL_END - 4} y0={RAIL_HI} />

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
          fill={ACCENT_A}
          {...ink}
        />
      </g>

      <Rail x0={LIGHT_SHELF} x1={PORTAL_OUT.x} y={RAIL_LO} />
      <Post x={LIGHT_SHELF + 4} y0={RAIL_LO} />
      <Post x={705} y0={RAIL_LO} />
    </g>
  )
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

/* ---- dark: the Noir world ----
   The ball drops through a paper funnel onto a low rail, rolls into a
   cannon and is fired up onto the shelf. Leg 5 is the ball out of sight in
   the barrel; the bang is where leg 6 begins. */

const DARK_RAIL_END = 518
const LOW_RAIL = 166
const BALL_LOW = LOW_RAIL - R
/**
 * A paper bowl behind the ball, bracketed off the rail's end post, its neck
 * just the ball's width.
 */
const FUNNEL = {
  mouth: [522, 578] as const,
  rim: 98,
  neck: [540, 560] as const,
  throat: 140,
  spout: 152
}
const DARK_RAIL_POST = DARK_RAIL_END - 4
/**
 * A barrel on two wheels standing on the low rail, breech at the pivot; the
 * ball rolls in at the breech and leaves at the muzzle.
 */
const CANNON = {
  pivot: [606, 150] as const,
  angle: -36,
  length: 46,
  halfW: 9,
  wheels: [608, 624] as const,
  wheelR: 7
}
const CANNON_RAD = (CANNON.angle * Math.PI) / 180
const MUZZLE: [number, number] = [
  CANNON.pivot[0] + CANNON.length * Math.cos(CANNON_RAD),
  CANNON.pivot[1] + CANNON.length * Math.sin(CANNON_RAD)
]
const LOW_RAIL_END = 634
const DARK_SHELF = 704

const DARK: World = {
  name: 'dark',
  backdrop: 'stars',
  poseAfterApex: 0.08,
  legs: [
    // pushed out of the entry, a streak that rounds into a ball
    { to: [458, BALL_HI], dur: 0.45, ex: 'out', ey: 'out', transit: 'out' },
    // rolls to the end of the rail
    { to: [DARK_RAIL_END, BALL_HI], dur: 0.4 },
    // drops into the bowl
    { to: [548, 128], dur: 0.32, ey: 'in' },
    // through the neck onto the low rail
    { to: [550, BALL_LOW], dur: 0.15, ey: 'in' },
    // rolls into the breech
    { to: [594, BALL_LOW], dur: 0.3 },
    // out of sight, up the barrel
    { to: MUZZLE, dur: 0.4, hidden: true },
    // the bang: up to the top of the shot; the far portal wakes
    { to: [676, 56], dur: 0.3, ey: 'out', apex: true, wake: true },
    // down onto the shelf
    { to: [714, BALL_LO], dur: 0.25, ey: 'in' },
    // rolls to the far portal
    { to: [748, BALL_LO], dur: 0.25 },
    // drawn out into a streak and pulled into the eye
    {
      to: [EYE_OUT.x, EYE_OUT.y],
      dur: 0.4,
      ex: 'in',
      ey: 'in',
      transit: 'in'
    },
    // gone: the cut, the iris, the next portal waking
    { to: [EYE_OUT.x, EYE_OUT.y], dur: 1.35 }
  ],
  keyframes: (id, t, track) => {
    // The bang: the barrel kicks back on its wheels, a burst of lines
    // flashes at the muzzle and a puff of smoke rolls up and thins out.
    const fire = t.start[6]!
    return [
      track(id('kick'), [
        ...hold(fire, 'transform:translate(0,0)', 'out'),
        [fire + 0.05, 'transform:translate(-4px,0)', 'out'],
        [fire + 0.35, 'transform:translate(0,0)'],
        [t.loop, 'transform:translate(0,0)']
      ]),
      track(id('burst'), [
        ...hold(fire - 0.01, 'transform:scale(0.6);opacity:0'),
        [fire, 'transform:scale(0.7);opacity:1', 'out'],
        [fire + 0.22, 'transform:scale(1.3);opacity:0'],
        [t.loop, 'transform:scale(1.3);opacity:0']
      ]),
      track(id('puff'), [
        ...hold(fire - 0.01, 'transform:translate(0,0) scale(0.6);opacity:0'),
        [fire, 'transform:translate(0,0) scale(0.7);opacity:1', 'out'],
        [fire + 0.7, 'transform:translate(10px,-16px) scale(1.7);opacity:0'],
        [t.loop, 'transform:translate(10px,-16px) scale(1.7);opacity:0']
      ])
    ]
  },
  Pieces: ({ anim }) => {
    const [mx0, mx1] = FUNNEL.mouth
    const [nx0, nx1] = FUNNEL.neck
    const [px, py] = CANNON.pivot
    return (
      <g>
        <Rail x0={PORTAL_IN.x} x1={DARK_RAIL_END} y={RAIL_HI} />
        <line
          x1={DARK_RAIL_END}
          y1={RAIL_HI}
          x2={DARK_RAIL_END}
          y2={RAIL_HI + 7}
          {...ink}
        />
        <Post x={476} y0={RAIL_HI} />
        <Post x={DARK_RAIL_POST} y0={RAIL_HI} />

        {/* The funnel: a paper bowl, so the ball stays in view all the way
            down, held off the rail's end post by a bracket, with a neck the
            ball just fits through. */}
        <line
          x1={DARK_RAIL_POST}
          y1={FUNNEL.rim}
          x2={mx0}
          y2={FUNNEL.rim}
          {...ink}
        />
        <path
          d={`M${mx0} ${FUNNEL.rim}L${mx1} ${FUNNEL.rim}L${nx1} ${FUNNEL.throat}L${nx1} ${FUNNEL.spout}L${nx0} ${FUNNEL.spout}L${nx0} ${FUNNEL.throat}Z`}
          fill={BG}
          {...ink}
        />

        <Rail x0={536} x1={LOW_RAIL_END} y={LOW_RAIL} />
        <Post x={540} y0={LOW_RAIL} />
        <Post x={LOW_RAIL_END - 4} y0={LOW_RAIL} />

        {/* The cannon stands on the low rail; the whole carriage kicks back
            on the bang. */}
        <g className={styles.run} style={anim('kick')}>
          {CANNON.wheels.map((wx) => (
            <circle
              key={wx}
              cx={wx}
              cy={LOW_RAIL - CANNON.wheelR}
              r={CANNON.wheelR}
              fill={ACCENT_B}
              {...ink}
            />
          ))}
          <g transform={`translate(${px} ${py}) rotate(${CANNON.angle})`}>
            <rect
              x={-4}
              y={-CANNON.halfW}
              width={CANNON.length + 4}
              height={CANNON.halfW * 2}
              rx={CANNON.halfW}
              fill={ACCENT_A}
              {...ink}
            />
            {/* a band round the muzzle */}
            <line
              x1={CANNON.length - 8}
              y1={-CANNON.halfW}
              x2={CANNON.length - 8}
              y2={CANNON.halfW}
              {...ink}
            />
          </g>
        </g>

        {/* The bang, at the muzzle: a fan of lines the way the barrel
            points, then smoke. */}
        <g
          transform={`translate(${MUZZLE[0].toFixed(2)} ${MUZZLE[1].toFixed(2)})`}
        >
          <g
            className={styles.run}
            style={anim('burst')}
            opacity={0}
            transform='scale(1.3)'
            {...ink}
          >
            {Array.from({ length: 7 }, (_, i) => {
              const th = CANNON_RAD + (i / 6 - 0.5) * 1.5
              const [x0, y0] = onEllipse(12, 12, th)
              const [x1, y1] = onEllipse(22, 22, th)
              return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} />
            })}
          </g>
          <g
            className={styles.run}
            style={anim('puff')}
            opacity={0.55}
            transform='translate(5 -8) scale(1.2)'
            fill={BG}
            {...ink}
          >
            <circle cx={0} cy={0} r={9} />
            <circle cx={7} cy={3} r={6.5} />
            <circle cx={-6} cy={4} r={6} />
          </g>
        </g>

        <Rail x0={DARK_SHELF} x1={PORTAL_OUT.x} y={RAIL_LO} />
        <Post x={DARK_SHELF + 4} y0={RAIL_LO} />
      </g>
    )
  }
}

// ---- backdrops -------------------------------------------------------------

/** The show's 'stars' backdrop for its dark worlds: a scatter of faint points. */
const STARS = Array.from({ length: 64 }, (_, i) => ({
  x: (i * 379 + 53) % STAGE_W,
  y: (i * 191 + 29) % STAGE_H,
  r: [0.8, 1.1, 1.5][i % 3]!
}))

// ---- one world, rendered ---------------------------------------------------

function WorldScene({ world, uid }: { world: World; uid: string }) {
  const id = useMemo<Id>(
    () => (name: string) => `cc-${world.name}-${name}-${uid}`,
    [world.name, uid]
  )
  const t = useMemo(
    () => timingOf(world.legs, world.poseAfterApex),
    [world.legs, world.poseAfterApex]
  )
  const keyframes = useMemo(() => {
    const track = trackFor(t.loop)
    return [
      ...sharedKeyframes(id, world.legs, t, track),
      ...world.keyframes(id, t, track)
    ].join('\n')
  }, [id, world, t])

  // Every animated element shares the loop and is held at the rest pose by
  // the same negative delay; a trail ghost runs the clock `lag` behind.
  const anim: Anim = (name, lag = 0) => ({
    animationName: id(name),
    animationDuration: `${t.loop}s`,
    animationDelay: `${(-(t.pose - lag)).toFixed(3)}s`
  })

  const rest = poseAt(world.legs, t, t.pose)

  return (
    <div
      className={`${styles.world} ${world.name === 'dark' ? styles.dark : styles.light}`}
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        {world.backdrop === 'dots' ? (
          <>
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
            <rect
              width={STAGE_W}
              height={STAGE_H}
              fill={`url(#${id('dots')})`}
            />
          </>
        ) : (
          <g fill='var(--cc-dot)'>
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} />
            ))}
          </g>
        )}

        <world.Pieces anim={anim} />

        <Portal {...PORTAL_IN} kind='in' anim={anim} awake={false} />
        <Portal {...PORTAL_OUT} kind='out' anim={anim} awake />

        {/* Ghosts run the same path a few frames behind, so the trail is
            wherever the ball has just been — an arc, at rest. */}
        {TRAIL.map(({ lag, r, opacity }) => {
          const ghost = poseAt(world.legs, t, t.pose - lag)
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

export function ContraptionsCover() {
  // Keyframe names must be unique per instance (and colon-free so they stay
  // valid identifiers).
  const uid = useId().replaceAll(':', '')
  return (
    <div className={styles.cover} aria-hidden='true'>
      <WorldScene world={LIGHT} uid={uid} />
      <WorldScene world={DARK} uid={uid} />
    </div>
  )
}
