/**
 * thingsCoverObjects
 *
 *   The cut-outs the Things cover variants stand on their shelves: real
 *   things from the collection (data/items.json in wustep/things), each
 *   drawn as a few flat shapes in its own colours — the app has no accent
 *   colour, "the objects bring their own". Every shape is drawn with its
 *   bottom-centre at (0, 0), standing up into negative y, so a caller only
 *   has to translate it onto a shelf lip. Flat fills only (no gradient
 *   defs), so they need no per-instance ids.
 */

import type { ReactElement } from 'react'

export type ThingKind =
  | 'lamp'
  | 'watch'
  | 'dock'
  | 'bottle'
  | 'headphones'
  | 'kalimba'
  | 'mouse'
  | 'cardBar'
  | 'nord'
  | 'loopStation'
  | 'jamcorder'

/** Half the drawn width of each thing, for contact shadows under it. */
export const THING_HALF_W: Record<ThingKind, number> = {
  lamp: 15,
  watch: 12,
  dock: 24,
  bottle: 11,
  headphones: 30,
  kalimba: 26,
  mouse: 22,
  cardBar: 26,
  nord: 70,
  loopStation: 34,
  jamcorder: 17
}

// IKEA AKTERSPRING: a white mushroom shade on a thin stem, lit from inside.
function Lamp() {
  return (
    <g>
      <ellipse cx='0' cy='-56' rx='26' ry='20' fill='#ffd59e' opacity='0.1' />
      <rect x='-12' y='-5' width='24' height='5' rx='2' fill='#d9d2c4' />
      <rect x='-1.5' y='-46' width='3' height='42' fill='#cfc7b8' />
      <path d='M -20 -44 Q -19 -70 0 -71 Q 19 -70 20 -44 Z' fill='#efe4cf' />
      <ellipse cx='0' cy='-44' rx='20' ry='3' fill='#fff1d6' />
    </g>
  )
}

// Orient Bambino Version 9: domed cream dial in a gold case on brown leather.
function Watch() {
  return (
    <g>
      <rect x='-7' y='-60' width='14' height='60' rx='5' fill='#5b3a26' />
      <rect x='-7' y='-60' width='3' height='60' rx='1.5' fill='#734b31' />
      <rect x='16' y='-33' width='4' height='5' rx='1' fill='#b48d55' />
      <circle cx='0' cy='-30' r='17' fill='#c8a065' />
      <circle cx='0' cy='-30' r='14.5' fill='#efe6d3' />
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1='0'
          y1='-42'
          x2='0'
          y2='-39'
          stroke='#8a6a3e'
          strokeWidth='1.2'
          transform={`rotate(${deg} 0 -30)`}
        />
      ))}
      <line
        x1='0'
        y1='-30'
        x2='6'
        y2='-35'
        stroke='#2a2420'
        strokeWidth='1.4'
        strokeLinecap='round'
      />
      <line
        x1='0'
        y1='-30'
        x2='-2'
        y2='-40'
        stroke='#2a2420'
        strokeWidth='1'
        strokeLinecap='round'
      />
      {/* The dome's highlight. */}
      <path
        d='M -9 -38 Q -4 -43 3 -42'
        stroke='#fff'
        strokeWidth='1.2'
        fill='none'
        opacity='0.5'
        strokeLinecap='round'
      />
    </g>
  )
}

// Wokyis M5 Retro Dock: a cream little classic Mac with a dark screen.
function Dock() {
  return (
    <g>
      <rect x='-24' y='-50' width='48' height='48' rx='5' fill='#e6dfcd' />
      <rect x='16' y='-50' width='8' height='48' rx='3' fill='#d3cab4' />
      <rect x='-17' y='-44' width='34' height='24' rx='2.5' fill='#23272b' />
      <rect x='-12' y='-37' width='15' height='4' rx='1' fill='#e8ecef' />
      <rect x='-12' y='-30' width='9' height='2' rx='1' fill='#8c949b' />
      <rect x='-13' y='-12' width='16' height='1.6' rx='0.8' fill='#9b927d' />
      <circle cx='14' cy='-11' r='1.6' fill='#d9734a' />
      <rect x='-19' y='-3' width='38' height='3' rx='1' fill='#c9c0aa' />
    </g>
  )
}

// Owala FreeSip, Camo Cool: a mottled green bottle with a carry loop.
function Bottle() {
  return (
    <g>
      <rect x='-11' y='-66' width='22' height='66' rx='6' fill='#7b8466' />
      <path
        d='M -11 -52 Q -3 -48 1 -54 Q 6 -58 11 -55 L 11 -44 Q 2 -40 -11 -44 Z'
        fill='#5f6a4d'
      />
      <path
        d='M -11 -26 Q -2 -31 6 -24 Q 9 -21 11 -23 L 11 -14 Q 0 -10 -11 -15 Z'
        fill='#959c7d'
      />
      <rect x='-11' y='-7' width='22' height='7' rx='3' fill='#6a7258' />
      <rect x='-10' y='-76' width='20' height='12' rx='3' fill='#2f332c' />
      <path
        d='M -6 -76 Q 0 -88 6 -76'
        stroke='#2f332c'
        strokeWidth='3'
        fill='none'
      />
    </g>
  )
}

// Nothing Headphone (1): pale cups with a see-through window, on a band.
function Headphones() {
  return (
    <g>
      <path
        d='M -23 -24 C -26 -70, 26 -70, 23 -24'
        stroke='#d6d4cf'
        strokeWidth='5'
        fill='none'
        strokeLinecap='round'
      />
      <path
        d='M -21 -30 C -23 -62, 23 -62, 21 -30'
        stroke='#8f8c86'
        strokeWidth='1'
        fill='none'
      />
      {[-23, 23].map((cx) => (
        <g key={cx}>
          <rect
            x={cx - 7}
            y='-36'
            width='14'
            height='36'
            rx='6'
            fill='#e7e5e0'
          />
          <rect
            x={cx - 4}
            y='-29'
            width='8'
            height='14'
            rx='3'
            fill='#a9a59c'
          />
          <circle cx={cx} cy='-9' r='1.4' fill='#d23c35' />
        </g>
      ))}
    </g>
  )
}

// Newlam kalimba: a wooden box with a fan of steel tines.
function Kalimba() {
  return (
    <g>
      <rect x='-26' y='-18' width='52' height='18' rx='4' fill='#a8723f' />
      <rect x='-26' y='-18' width='52' height='3' rx='1.5' fill='#c08a52' />
      <rect x='-19' y='-13' width='38' height='2' rx='1' fill='#3b2a1c' />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = -16 + i * 4
        // Tines are longest in the middle, shortening outward.
        const len = 9 - Math.abs(i - 4) * 1.4
        return (
          <line
            key={i}
            x1={x}
            y1='-14'
            x2={x}
            y2={-14 + len}
            stroke='#dcdad4'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        )
      })}
    </g>
  )
}

// Logitech MX Master 3S: a low graphite sculpted mouse.
function Mouse() {
  return (
    <g>
      <path
        d='M -22 0 C -24 -10, -12 -21, 4 -20 C 16 -19, 24 -10, 22 0 Z'
        fill='#3b3c3f'
      />
      <path
        d='M -14 -13 C -6 -18, 6 -18, 12 -13'
        stroke='#57585c'
        strokeWidth='1.2'
        fill='none'
      />
      <rect x='-2' y='-20' width='4' height='6' rx='2' fill='#6a6b6f' />
    </g>
  )
}

// Ugmonk Analog card bar: a walnut rail holding a few cream cards.
function CardBar() {
  return (
    <g>
      <rect
        x='-18'
        y='-32'
        width='15'
        height='26'
        rx='1'
        fill='#efe9dc'
        transform='rotate(-6 -10 -6)'
      />
      <rect
        x='-1'
        y='-28'
        width='15'
        height='22'
        rx='1'
        fill='#e4ddcd'
        transform='rotate(4 6 -6)'
      />
      <rect x='-26' y='-8' width='52' height='8' rx='1.5' fill='#5a3b26' />
      <rect x='-26' y='-8' width='52' height='1.5' rx='0.75' fill='#7a5338' />
    </g>
  )
}

// Nord Stage 4 88: the long red keyboard (StageBench's muse).
function Nord() {
  return (
    <g>
      <rect x='-70' y='-24' width='140' height='24' rx='3' fill='#c8202e' />
      <rect x='-70' y='-24' width='140' height='2' rx='1' fill='#e04a55' />
      <rect x='-22' y='-20' width='22' height='6' rx='1' fill='#1b1416' />
      {[-50, -42, -34, 20, 28, 36, 44].map((cx) => (
        <circle key={cx} cx={cx} cy='-17' r='2' fill='#3a3438' />
      ))}
      <rect x='-64' y='-10' width='128' height='8' fill='#f2efe8' />
      {Array.from({ length: 21 }).map((_, i) =>
        // Black keys in the 2-then-3 octave pattern.
        [0, 1, 3, 4, 5].includes(i % 7) ? (
          <rect
            key={i}
            x={-64 + (i + 1) * (128 / 22) - 1.6}
            y='-10'
            width='3.2'
            height='4.8'
            fill='#1d1a19'
          />
        ) : null
      )}
    </g>
  )
}

// BOSS RC-505mkII: a dark slab with five coloured track rings.
function LoopStation() {
  return (
    <g>
      <rect x='-34' y='-17' width='68' height='17' rx='2.5' fill='#3b3d40' />
      <rect x='-34' y='-17' width='68' height='2' rx='1' fill='#55585c' />
      {['#e64646', '#f2a33a', '#4fbf6b', '#4a90e2', '#b56be0'].map((c, i) => (
        <circle
          key={c}
          cx={-24 + i * 12}
          cy='-8'
          r='3.6'
          fill='none'
          stroke={c}
          strokeWidth='1.6'
        />
      ))}
    </g>
  )
}

// Jamcorder: a small dark box with one amber recording light.
function Jamcorder() {
  return (
    <g>
      <rect x='-17' y='-15' width='34' height='15' rx='4' fill='#2a2a2e' />
      <rect x='-17' y='-15' width='34' height='2' rx='1' fill='#434349' />
      <circle cx='10' cy='-8' r='2' fill='#f0a24a' />
      <circle cx='10' cy='-8' r='4.5' fill='#f0a24a' opacity='0.2' />
      <rect x='-11' y='-9' width='13' height='1.6' rx='0.8' fill='#6c6c72' />
    </g>
  )
}

const SHAPES: Record<ThingKind, () => ReactElement> = {
  lamp: Lamp,
  watch: Watch,
  dock: Dock,
  bottle: Bottle,
  headphones: Headphones,
  kalimba: Kalimba,
  mouse: Mouse,
  cardBar: CardBar,
  nord: Nord,
  loopStation: LoopStation,
  jamcorder: Jamcorder
}

export function ThingShape({ kind }: { kind: ThingKind }) {
  const Shape = SHAPES[kind]
  return <Shape />
}
