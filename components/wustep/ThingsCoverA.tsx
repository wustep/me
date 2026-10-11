import { useId } from 'react'

import styles from './ThingsCoverA.module.css'
import { THING_HALF_W, type ThingKind, ThingShape } from './thingsCoverObjects'

/**
 * ThingsCoverA — the docent's lamp.
 *
 *   Cover for the Things playground entry: one shelf of the cabinet, five
 *   real things standing on its lit lip with their tags below (maker in mono
 *   caps, name in serif), in the app's warm walnut-black room. A brighter
 *   pool of lamplight rests on the middle thing, which stands lifted the way
 *   the shelf lifts whatever you point at. Hovering the card walks the light
 *   along the shelf — one thing at a time, each lifting and its name
 *   brightening as the light reaches it, the light ducking out at the far end
 *   and coming back in at the near one.
 *
 *   The stage is wide (1200×240, sliced to the cover box — 190px tall at
 *   every card width), so the full height always fits; the five lit things
 *   sit inside the middle ~550 units a grid card shows at laptop width, and
 *   the wings carry dimmer filler things that wider cards reveal.
 */

const STAGE_W = 1200
const STAGE_H = 240
/** The top of the shelf lip the things stand on. */
const LIP = 148
/** The walking light's home: it rests over the middle thing. */
const HOME_X = 600

/**
 * Stops are the order the light visits them, starting at its resting place
 * (so the paused timeline's frame zero is the rest pose). Each stop is one
 * 1.5s beat of the 7.5s loop in ThingsCoverA.module.css — `beat` is that
 * index, and becomes the thing's animation delay.
 */
type Thing = {
  x: number
  kind: ThingKind
  maker: string
  name: string
  beat?: number
}

const BEAT_S = 1.5
const LOOP_S = 7.5

const THINGS: Thing[] = [
  // Wings: filler that only wider cards reveal.
  { x: 200, kind: 'mouse', maker: 'Logitech', name: 'MX Master 3S' },
  { x: 300, kind: 'kalimba', maker: 'Newlam', name: 'Kalimba' },
  // The shelf proper.
  { x: 400, kind: 'lamp', maker: 'IKEA', name: 'Akterspring', beat: 3 },
  { x: 500, kind: 'watch', maker: 'Orient', name: 'Bambino V9', beat: 4 },
  { x: 600, kind: 'dock', maker: 'Wokyis', name: 'M5 Retro Dock', beat: 0 },
  { x: 700, kind: 'bottle', maker: 'Owala', name: 'FreeSip 24oz', beat: 1 },
  {
    x: 800,
    kind: 'headphones',
    maker: 'Nothing',
    name: 'Headphone (1)',
    beat: 2
  },
  // Wings.
  { x: 900, kind: 'cardBar', maker: 'Ugmonk', name: 'Analog Card Bar' },
  { x: 1000, kind: 'mouse', maker: 'Logitech', name: 'MX Master 3S' }
]

/**
 * A thing's place in the walk: the delay that starts its `lit` keyframe
 * (written for beat 0) `beat` beats later, written negative so every thing
 * is mid-cycle — and correctly posed — from frame zero.
 */
const delayFor = (beat: number) => `${-(LOOP_S - beat * BEAT_S)}s`

export function ThingsCoverA() {
  // Gradient ids must be unique per instance (and colon-free so they stay
  // valid inside url(#…) references).
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `tca-${name}-${uid}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
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
              app's do, instead of spilling over the tags below. */}
          <clipPath id={id('wall')}>
            <rect x='0' y='0' width={STAGE_W} height={LIP} />
          </clipPath>
        </defs>

        {/* The shelf's own faint pool, under every thing. */}
        <ellipse
          cx={HOME_X}
          cy={LIP}
          rx='560'
          ry='120'
          fill={`url(#${id('shelfLamp')})`}
          clipPath={`url(#${id('wall')})`}
        />

        {/* The walking light. Drawn around HOME_X; the stylesheet only ever
            slides it sideways. */}
        <g className={styles.pool} clipPath={`url(#${id('wall')})`}>
          <ellipse
            cx={HOME_X}
            cy={LIP - 40}
            rx='70'
            ry='110'
            fill={`url(#${id('pool')})`}
          />
        </g>

        {/* The lip, and the shadow it throws on the dark below it. */}
        <rect
          x='0'
          y={LIP}
          width={STAGE_W}
          height='8'
          fill={`url(#${id('lip')})`}
        />
        <rect
          x='0'
          y={LIP + 8}
          width={STAGE_W}
          height='14'
          fill={`url(#${id('drop')})`}
        />

        {THINGS.map(({ x, kind, maker, name, beat }) => {
          const walked = beat !== undefined
          const delay = walked ? { animationDelay: delayFor(beat) } : undefined
          // The light's home thing, posed by hand under reduced motion.
          const home = beat === 0 ? styles.home : ''
          return (
            <g key={x} className={walked ? undefined : styles.wing}>
              <ellipse
                className={walked ? styles.shadow : undefined}
                style={delay}
                cx={x}
                cy={LIP + 0.5}
                rx={THING_HALF_W[kind] * 0.9}
                ry='2.2'
                fill='#000'
                opacity='0.55'
              />
              <g transform={`translate(${x} ${LIP})`}>
                <g
                  className={walked ? `${styles.thing} ${home}` : undefined}
                  style={delay}
                >
                  <ThingShape kind={kind} />
                </g>
              </g>
              <text className={styles.makerText} x={x} y={LIP + 26}>
                {maker.toUpperCase()}
              </text>
              <text
                className={`${styles.nameText} ${walked ? styles.name : ''} ${home}`}
                style={delay}
                x={x}
                y={LIP + 40}
              >
                {name}
              </text>
            </g>
          )
        })}

        {/* The app's only chrome: its mark, top-left of a grid card's view. */}
        <text className={styles.markText} x='352' y='30'>
          THINGS
          <tspan className={styles.markCount}> · 58</tspan>
        </text>
      </svg>
    </div>
  )
}
