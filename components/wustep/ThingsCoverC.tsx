import { useId } from 'react'

import styles from './ThingsCoverC.module.css'
import { THING_HALF_W, type ThingKind, ThingShape } from './thingsCoverObjects'

/**
 * ThingsCoverC — up close.
 *
 *   Signature-mechanic close-up for the Things playground entry: the app's
 *   one interaction, opening a thing. A shelf of five things in the warm
 *   dark room, the Orient Bambino in the middle. Hovering the card points at
 *   it — it lifts off the lip the way the shelf answers a pointer — then
 *   opens it: the watch rises and grows into focus on the left, the shelf
 *   sinks behind the room's dark, and its detail sets in beside it (maker in
 *   mono caps, name in serif, price and shop). It holds there a beat, then
 *   closes back onto its place on the shelf, and goes round again.
 *
 *   The stage is wide (1200×240, sliced to the cover box — 190px tall at
 *   every card width), so the full height always fits; the shelf and the
 *   opened detail both sit inside the middle ~550 units a grid card shows
 *   at laptop width.
 */

const STAGE_W = 1200
const STAGE_H = 240
/** The top of the shelf lip the things stand on. */
const LIP = 156
/** The thing that gets opened. */
const HERO_X = 600

type Thing = { x: number; kind: ThingKind; maker: string; name: string }

const NEIGHBOURS: Thing[] = [
  { x: 360, kind: 'dock', maker: 'Wokyis', name: 'M5 Retro Dock' },
  { x: 480, kind: 'lamp', maker: 'IKEA', name: 'Akterspring' },
  { x: 720, kind: 'bottle', maker: 'Owala', name: 'FreeSip 24oz' },
  { x: 840, kind: 'headphones', maker: 'Nothing', name: 'Headphone (1)' },
  // Wings: filler that only wider cards reveal.
  { x: 240, kind: 'kalimba', maker: 'Newlam', name: 'Kalimba' },
  { x: 960, kind: 'mouse', maker: 'Logitech', name: 'MX Master 3S' }
]

/** Where the opened detail's text column starts. */
const DETAIL_X = 588

export function ThingsCoverC() {
  // Gradient ids must be unique per instance (and colon-free so they stay
  // valid inside url(#…) references).
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `tcc-${name}-${uid}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          <radialGradient id={id('lamp')} cx='0.5' cy='1' r='0.5'>
            <stop offset='0' stopColor='rgba(255, 213, 158, 0.1)' />
            <stop offset='1' stopColor='rgba(255, 213, 158, 0)' />
          </radialGradient>
          <radialGradient id={id('focus')} cx='0.5' cy='0.5' r='0.5'>
            <stop offset='0' stopColor='rgba(255, 216, 168, 0.12)' />
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

        {/* ---- the shelf ---- */}
        <ellipse
          cx={HERO_X}
          cy={LIP}
          rx='420'
          ry='120'
          fill={`url(#${id('lamp')})`}
          clipPath={`url(#${id('wall')})`}
        />
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
        {NEIGHBOURS.map(({ x, kind, maker, name }) => (
          <g key={x}>
            <ellipse
              cx={x}
              cy={LIP + 0.5}
              rx={THING_HALF_W[kind] * 0.9}
              ry='2.2'
              fill='#000'
              opacity='0.55'
            />
            <g transform={`translate(${x} ${LIP})`} opacity='0.78'>
              <ThingShape kind={kind} />
            </g>
            <text className={styles.makerText} x={x} y={LIP + 26}>
              {maker.toUpperCase()}
            </text>
            <text className={styles.nameText} x={x} y={LIP + 40}>
              {name}
            </text>
          </g>
        ))}

        {/* The hero's own tag and contact shadow stay on the shelf when it
            leaves, as the app's do. */}
        <ellipse
          className={styles.heroShadow}
          cx={HERO_X}
          cy={LIP + 0.5}
          rx={THING_HALF_W.watch * 0.9}
          ry='2.2'
          fill='#000'
        />
        <text className={styles.makerText} x={HERO_X} y={LIP + 26}>
          ORIENT
        </text>
        <text
          className={`${styles.nameText} ${styles.heroName}`}
          x={HERO_X}
          y={LIP + 40}
        >
          Bambino V9
        </text>

        {/* ---- opening ----
            The room's dark closes over the shelf (the app's detail view
            covers it), then a soft pool comes up where the thing will
            land. */}
        <rect
          className={styles.veil}
          x='0'
          y='0'
          width={STAGE_W}
          height={STAGE_H}
          fill='#13110e'
        />
        <ellipse
          className={styles.focus}
          cx='530'
          cy='96'
          rx='100'
          ry='100'
          fill={`url(#${id('focus')})`}
        />

        <g className={styles.detail}>
          <text className={styles.detailMakerText} x={DETAIL_X} y='70'>
            ORIENT
          </text>
          <text className={styles.detailNameText} x={DETAIL_X} y='99'>
            Bambino
          </text>
          <text className={styles.detailNameText} x={DETAIL_X} y='123'>
            Version 9
          </text>
          <line
            x1={DETAIL_X}
            y1='138'
            x2={DETAIL_X + 120}
            y2='138'
            stroke='rgba(237, 230, 218, 0.11)'
          />
          <text className={styles.detailMetaText} x={DETAIL_X} y='153'>
            $385 · ORIENTWATCHUSA.COM
          </text>
        </g>

        {/* The hero itself, drawn last so it rides above the veil. The outer
            group stands it on the lip; the stylesheet moves the inner one
            in the hero's own units (origin = its bottom-centre). */}
        <g transform={`translate(${HERO_X} ${LIP})`}>
          <g className={styles.hero}>
            <ThingShape kind='watch' />
          </g>
        </g>
      </svg>
    </div>
  )
}
