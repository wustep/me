'use client'

import {
  type CSSProperties,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState
} from 'react'

import styles from './ThingsCover.module.css'
import { THING_HALF_W, type ThingKind, ThingShape } from './thingsCoverObjects'

/**
 * ThingsCover — the docent's lamp.
 *
 *   Cover for the Things playground entry: one shelf of the cabinet with real
 *   things standing on its lit lip, in the app's warm walnut-black room. No
 *   words — the things are the whole picture. A brighter pool of lamplight
 *   rests on the middle thing, which stands lifted the way the shelf lifts
 *   whatever you point at. Hovering the card walks the light along the shelf
 *   — one thing at a time, each lifting as the light reaches it, the light
 *   ducking out at the far end and coming back in at the near one.
 *
 *   The stage is always 240 units tall (fit to the cover box's height), and
 *   as wide as the box is at that scale. The shelf is laid out for that
 *   width: as many things as fit at a calm pitch, centred, every one whole —
 *   a narrow card shows three, a wide one all nine — so nothing ever peeks
 *   in from an edge. The walk visits only the things on show, one beat each.
 */

const STAGE_H = 240
/** The top of the shelf lip the things stand on. */
const LIP = 168
/** Things are drawn a touch larger than their cut-outs. */
const THING_SCALE = 1.1
/** How far a thing lifts in the light (the app's own hover lift). */
const LIFT = 7

/**
 * The whole shelf, left to right, with the dock — the light's home — in the
 * middle. Narrower cards show a centred run of it.
 */
const SHELF: ThingKind[] = [
  'mouse',
  'kalimba',
  'lamp',
  'watch',
  'dock',
  'bottle',
  'headphones',
  'cardBar',
  'jamcorder'
]
const MIN_THINGS = 3

/** The pitch the count is chosen for; the spacing then stretches to fill. */
const PITCH = 110
/** On very wide cards the shelf stops spreading and sits centred. */
const PITCH_MAX = 130

/**
 * Stage width (units) to lay out before the box is measured — a two-column
 * card at laptop width (434px). On first paint the SVG meets the box, so a
 * different width shows the same shelf a little smaller or with more lip.
 */
const DEFAULT_UNITS = 548

/** Each thing gets one beat of the walk: a 1s hold and a 0.5s slide. */
const BEAT_S = 1.5
const HOLD_S = 1

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

function layoutShelf(units: number) {
  const n = Math.max(
    MIN_THINGS,
    Math.min(SHELF.length, Math.round(units / PITCH))
  )
  const pitch = Math.min(units / n, PITCH_MAX)
  const start = Math.floor((SHELF.length - n) / 2)
  // The dock's place in the run, whatever its length.
  const home = SHELF.indexOf('dock') - start
  const kinds = SHELF.slice(start, start + n)
  return { n, pitch, home, kinds }
}

const pct = (t: number, loop: number) => `${((t / loop) * 100).toFixed(2)}%`

/**
 * The walk, written for `n` things. The light visits home → right → far
 * right, ducks out (fade, jump while dark, fade) and comes back in at far
 * left → … → home. Slide offsets are in steps of --pitch (set on the cover),
 * so the keyframes depend only on the count.
 *
 * Things share one `lit` keyframe, written for beat 0 and offset by each
 * thing's beat via its animation delay, so every thing is mid-cycle — and
 * correctly posed — from frame zero.
 */
function walkCss(name: string, n: number, home: number) {
  const loop = n * BEAT_S
  const order = Array.from({ length: n }, (_, k) => (home + k) % n)
  const at = (t: number, step: number, opacity: number) =>
    `${pct(t, loop)} { transform: translateX(calc(${step} * var(--pitch))); opacity: ${opacity}; }`

  const walk: string[] = []
  for (const [k, i] of order.entries()) {
    const step = i - home
    const start = k * BEAT_S
    walk.push(at(start, step, 1), at(start + HOLD_S, step, 1))
    const next = order[(k + 1) % n]!
    if (next < i) {
      // The far end: duck out, jump while dark, come back in.
      walk.push(
        at(start + HOLD_S + 0.2, step, 0),
        at(start + HOLD_S + 0.275, next - home, 0)
      )
    }
  }
  walk.push(at(loop, 0, 1))

  // Lifted through the hold, settled by the slide's end, and lifting again
  // a hair before the light arrives so the thing seems to answer it.
  const lit = (up: string, down: string) =>
    `0%, ${pct(0.975, loop)} { ${up} } ` +
    `${pct(1.425, loop)}, ${pct(loop - 0.45, loop)} { ${down} } ` +
    `100% { ${up} }`

  return [
    `@keyframes ${name}-walk { ${walk.join(' ')} }`,
    `@keyframes ${name}-lit { ${lit(
      `transform: translateY(-${LIFT}px); opacity: 1;`,
      'transform: translateY(0); opacity: 0.72;'
    )} }`,
    `@keyframes ${name}-shadow { ${lit('opacity: 0.25;', 'opacity: 0.55;')} }`
  ].join('\n')
}

export function ThingsCover() {
  // Gradient ids must be unique per instance (and colon-free so they stay
  // valid inside url(#…) references).
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `tc-${name}-${uid}`

  const ref = useRef<HTMLDivElement>(null)
  const [units, setUnits] = useState(DEFAULT_UNITS)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const { clientWidth: w, clientHeight: h } = el
      if (!w || !h) return
      setUnits(Math.round((w * STAGE_H) / h))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { n, pitch, home, kinds } = layoutShelf(units)
  const loop = n * BEAT_S
  const mid = units / 2
  const xOf = (i: number) => mid + (i - (n - 1) / 2) * pitch
  const homeX = xOf(home)
  const anim = `tc-${n}-${uid}`

  // Each thing's beat in the walk, as the delay that starts its `lit`
  // keyframe that many beats later (negative, so it's posed from frame 0).
  const beatStyle = (i: number, keyframes: string): CSSProperties => {
    const beat = (i - home + n) % n
    return {
      animationName: `${anim}-${keyframes}`,
      animationDuration: `${loop}s`,
      animationDelay: `${-(loop - beat * BEAT_S)}s`
    }
  }

  return (
    <div
      ref={ref}
      className={styles.cover}
      style={{ '--pitch': `${pitch}px` } as CSSProperties}
      aria-hidden='true'
    >
      <style>{walkCss(anim, n, home)}</style>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${units} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid meet'
      >
        <defs>
          {/* The app's lamp: warm, brightest where things stand, gone by the
              edges (the shelf's ::before in things/src/style.css). */}
          <radialGradient id={id('shelfLamp')} cx='0.5' cy='1' r='0.5'>
            <stop offset='0' stopColor='rgba(255, 213, 158, 0.09)' />
            <stop offset='1' stopColor='rgba(255, 213, 158, 0)' />
          </radialGradient>
          <radialGradient id={id('pool')} cx='0.5' cy='0.78' r='0.5'>
            <stop offset='0' stopColor='rgba(255, 216, 168, 0.26)' />
            <stop offset='0.55' stopColor='rgba(255, 216, 168, 0.08)' />
            <stop offset='1' stopColor='rgba(255, 216, 168, 0)' />
          </radialGradient>
          <linearGradient id={id('lip')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#3d362d' />
            <stop offset='0.12' stopColor='#3d362d' />
            <stop offset='0.13' stopColor='#221e19' />
            <stop offset='1' stopColor='#1a1713' />
          </linearGradient>
          <linearGradient id={id('drop')} x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='rgba(0, 0, 0, 0.55)' />
            <stop offset='1' stopColor='rgba(0, 0, 0, 0)' />
          </linearGradient>
          {/* The back wall: lamplight pools stop at the shelf lip, as the
              app's do. */}
          <clipPath id={id('wall')}>
            <rect x={-units} y='0' width={units * 3} height={LIP} />
          </clipPath>
        </defs>

        {/* The shelf's own faint pool, under every thing. */}
        <ellipse
          cx={mid}
          cy={LIP}
          rx={Math.max(units * 0.47, 220)}
          ry='120'
          fill={`url(#${id('shelfLamp')})`}
          clipPath={`url(#${id('wall')})`}
        />

        {/* The walking light. Drawn over the home thing; the walk only ever
            slides it sideways. */}
        <g clipPath={`url(#${id('wall')})`}>
          <ellipse
            style={{
              animationName: `${anim}-walk`,
              animationDuration: `${loop}s`
            }}
            className={styles.pool}
            cx={homeX}
            cy={LIP - 44}
            rx='76'
            ry='120'
            fill={`url(#${id('pool')})`}
          />
        </g>

        {/* The lip, and the shadow it throws on the dark below it. Both run
            past the stage so a box the layout hasn't measured yet still
            reads as one long shelf. */}
        <rect
          x={-units}
          y={LIP}
          width={units * 3}
          height='8'
          fill={`url(#${id('lip')})`}
        />
        <rect
          x={-units}
          y={LIP + 8}
          width={units * 3}
          height='14'
          fill={`url(#${id('drop')})`}
        />

        {kinds.map((kind, i) => {
          const x = xOf(i)
          // The light's home thing, posed by hand under reduced motion.
          const homeClass = i === home ? styles.home : ''
          return (
            <g key={kind}>
              <ellipse
                className={styles.shadow}
                style={beatStyle(i, 'shadow')}
                cx={x}
                cy={LIP + 0.5}
                rx={THING_HALF_W[kind] * THING_SCALE * 0.9}
                ry='2.4'
                fill='#000'
                opacity='0.55'
              />
              <g transform={`translate(${x} ${LIP}) scale(${THING_SCALE})`}>
                <g
                  className={`${styles.thing} ${homeClass}`}
                  style={beatStyle(i, 'lit')}
                >
                  <ThingShape kind={kind} />
                </g>
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
