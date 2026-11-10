/**
 * instrumentsCoverGlyphs
 *
 *   The seven instruments of the Instruments app as line drawings, shared
 *   by the InstrumentsCover variants. Six are the app's own picker glyphs
 *   (instruments-wustep.vercel.app, its 48×48 `.glyph` SVGs) copied path
 *   for path, so a cover's silhouettes are the app's; the upright has no
 *   picker glyph (it is a preset of the piano), so it is drawn here in the
 *   grand's vocabulary: case, overstrung strings, bridge, a strip of keys.
 *
 *   Every glyph is drawn in the app's 48×48 box and split in two:
 *     Body   the instrument itself. Parts carry `data-part` so each cover
 *            styles them from its own stylesheet: `body` (the outline),
 *            `thin` (detail lines), `str` (strings at rest), `fill`
 *            (small solid bits).
 *     Voice  only what sounds: the strings, the flute's air column, the
 *            ring off the trumpet's bell. Covers lay it over the body in
 *            the accent when the instrument plays.
 *   Neither sets a colour or a stroke width; the caller does, because it
 *   also picks the scale. No gradients or filters, so no per-instance ids.
 */

import type { ReactElement } from 'react'

export type InstrumentKind =
  | 'grand'
  | 'upright'
  | 'violin'
  | 'viola'
  | 'cello'
  | 'flute'
  | 'trumpet'

/**
 * Everything this file can draw: the seven glyphs, plus a fuller trumpet
 * for covers that show one large (the picker glyph is a diagram of a
 * trumpet, and reads as one only when small).
 */
export type DrawingKind = InstrumentKind | 'trumpetLarge'

/**
 * Each glyph's drawn extent in its own 48×48 box, so a caller can stand it
 * on a line or centre it without measuring. The flute and trumpet lie
 * along x, as the app draws them before it tilts the flute in its picker.
 */
export const GLYPH_BOX: Record<
  DrawingKind,
  { x: number; y: number; w: number; h: number }
> = {
  grand: { x: 9, y: 3, w: 30, h: 40 },
  upright: { x: 5, y: 5, w: 38, h: 38 },
  violin: { x: 18.2, y: 14.7, w: 11.6, h: 31.8 },
  viola: { x: 18.2, y: 14.7, w: 11.6, h: 31.8 },
  cello: { x: 18.2, y: 14.7, w: 11.6, h: 34.3 },
  flute: { x: 2.5, y: 21.6, w: 44.1, h: 4.1 },
  trumpet: { x: 2, y: 13.5, w: 45, h: 17.5 },
  // Its own, larger box (see TrumpetLargeBody); the width takes in the
  // wavefronts its voice draws beyond the bell.
  trumpetLarge: { x: 0, y: 28, w: 684, h: 190 }
}

// ---- the grand, in plan ------------------------------------------------------

/** The four wound bass strings fan out over the plain ones, as on the app's. */
const GRAND_STRINGS = [
  'M13.5 37 L11.8 8.5',
  'M15.1 37 L14.1 10.1',
  'M16.7 37 L16.4 11.7',
  'M18.3 37 L18.7 13.3',
  'M18 37 V9.5',
  'M21.2 37 V12.5',
  'M24.4 37 V17.5',
  'M27.6 37 V22.5',
  'M30.8 37 V26.5',
  'M34 37 V29.5'
]

function GrandBody() {
  return (
    <>
      <path
        data-part='body'
        d='M9 43 V9.5 C9 5.2 11.8 3 15.4 3 C19.4 3 21.3 5.6 22.6 9.4 C24.4 14.8 26.2 19.6 31 23.4 C35.4 26.8 39 28.4 39 32.5 V43 Z'
      />
      <path
        data-part='thin'
        d='M11 37.5 V10 C11 6.6 13.2 5 15.4 5 C18.4 5 19.8 7 21 10.4 C22.8 15.6 24.8 20.8 29.8 24.8 C34 28 37 29.4 37 33 V37.5'
      />
      {GRAND_STRINGS.map((d) => (
        <path key={d} data-part='str' d={d} />
      ))}
      <path
        data-part='thin'
        d='M17.5 11 C20 13.5 23 22 28 26 C31.5 28.8 34 30 36 31'
      />
      <rect data-part='body' x={9} y={37.5} width={30} height={5.5} />
      {Array.from({ length: 10 }, (_, k) => (
        <rect
          key={k}
          data-part='fill'
          x={10.6 + k * 2.9}
          y={37.5}
          width={1.1}
          height={3.2}
        />
      ))}
    </>
  )
}

function GrandVoice() {
  return (
    <>
      {GRAND_STRINGS.map((d) => (
        <path key={d} d={d} />
      ))}
    </>
  )
}

// ---- the upright, from the front with its panel off -------------------------

/**
 * Where each plain string meets the bridge. The lengths fall off the way
 * the app's upright does: fast through the tenor, then flattening.
 */
const UPRIGHT_TREBLE_ENDS = [32, 28, 24.7, 22, 19.8, 17.9, 16.4, 15.1, 14]

const UPRIGHT_STRINGS = [
  // Five wound bass strings, slanting across the plain ones (overstrung).
  ...Array.from(
    { length: 5 },
    (_, i) =>
      `M${(10 + i * 1.7).toFixed(1)} 9 L${(16.5 + i * 1.5).toFixed(1)} 33.5`
  ),
  ...UPRIGHT_TREBLE_ENDS.map((y, j) => `M${(19 + j * 2.2).toFixed(1)} 9 V${y}`)
]

function UprightBody() {
  return (
    <>
      <path data-part='body' d='M7 37.5 V8 Q7 5 10 5 H38 Q41 5 41 8 V37.5' />
      <rect data-part='thin' x={9} y={7} width={30} height={28.5} />
      {UPRIGHT_STRINGS.map((d) => (
        <path key={d} data-part='str' d={d} />
      ))}
      <path data-part='thin' d='M19 32 C24 22 30 16 37.5 13.5' />
      {/* The keybed stands proud of the case either side. */}
      <rect data-part='body' x={5} y={37.5} width={38} height={5.5} />
      {Array.from({ length: 13 }, (_, k) => (
        <rect
          key={k}
          data-part='fill'
          x={6.6 + k * 2.9}
          y={37.5}
          width={1.1}
          height={3.2}
        />
      ))}
    </>
  )
}

function UprightVoice() {
  return (
    <>
      {UPRIGHT_STRINGS.map((d) => (
        <path key={d} d={d} />
      ))}
    </>
  )
}

// ---- violin, viola, cello ----------------------------------------------------

/**
 * One outline serves all three: the app draws its viola and cello as the
 * violin scaled up (×1.15, ×1.475), and a cover picks its own scales. The
 * cello adds its endpin.
 */
const VIOLIN_OUTLINE =
  'M22.80 26.50 C22.13 26.55 21.67 26.63 21.20 26.80 C20.73 26.97 20.31 27.18 20.00 27.50 C19.69 27.82 19.48 28.23 19.36 28.70 C19.24 29.17 19.25 29.80 19.28 30.30 C19.31 30.80 19.44 31.33 19.56 31.70 C19.68 32.07 19.94 32.32 20.00 32.50 C20.06 32.68 19.80 32.67 19.90 32.80 C20.00 32.93 20.42 32.95 20.60 33.30 C20.78 33.65 20.92 34.37 20.96 34.90 C21.00 35.43 20.93 35.98 20.84 36.50 C20.75 37.02 20.60 37.67 20.40 38.00 C20.20 38.33 19.74 38.37 19.64 38.50 C19.54 38.63 19.95 38.57 19.80 38.80 C19.65 39.03 19.03 39.42 18.76 39.90 C18.49 40.38 18.27 41.10 18.20 41.70 C18.13 42.30 18.15 42.93 18.32 43.50 C18.49 44.07 18.75 44.67 19.20 45.10 C19.65 45.53 20.37 45.87 21.00 46.10 C21.63 46.33 22.33 46.43 23.00 46.50 C23.67 46.57 24.33 46.57 25.00 46.50 C25.67 46.43 26.37 46.33 27.00 46.10 C27.63 45.87 28.35 45.53 28.80 45.10 C29.25 44.67 29.51 44.07 29.68 43.50 C29.85 42.93 29.87 42.30 29.80 41.70 C29.73 41.10 29.51 40.38 29.24 39.90 C28.97 39.42 28.35 39.03 28.20 38.80 C28.05 38.57 28.46 38.63 28.36 38.50 C28.26 38.37 27.80 38.33 27.60 38.00 C27.40 37.67 27.25 37.02 27.16 36.50 C27.07 35.98 27.00 35.43 27.04 34.90 C27.08 34.37 27.22 33.65 27.40 33.30 C27.58 32.95 28.00 32.93 28.10 32.80 C28.20 32.67 27.94 32.68 28.00 32.50 C28.06 32.32 28.32 32.07 28.44 31.70 C28.56 31.33 28.69 30.80 28.72 30.30 C28.75 29.80 28.76 29.17 28.64 28.70 C28.52 28.23 28.31 27.82 28.00 27.50 C27.69 27.18 27.27 26.97 26.80 26.80 C26.33 26.63 25.87 26.55 25.20 26.50 C24.53 26.45 23.47 26.45 22.80 26.50 Z'

/** Nut to bridge to tailpiece, G string to E. */
export const VIOLIN_STRINGS = [
  'M23.33 19.3 L22.67 37.5 L23 39.3',
  'M23.78 19.3 L23.56 37.5 L23.67 39.3',
  'M24.22 19.3 L24.44 37.5 L24.33 39.3',
  'M24.67 19.3 L25.33 37.5 L25 39.3'
]

function ViolinBody({ endpin }: { endpin?: boolean }) {
  return (
    <>
      <path data-part='body' d={VIOLIN_OUTLINE} />
      <path data-part='thin' d='M22.4 35.3 c-1.33 1 1.17 2.83 -0.33 4' />
      <path data-part='thin' d='M25.6 35.3 c1.33 1 -1.17 2.83 0.33 4' />
      <path
        data-part='thin'
        d='M23.08 19.3 L22.58 33.7 L25.42 33.7 L24.92 19.3 Z'
      />
      <path data-part='thin' d='M22.17 37.5 Q24 37.1 25.83 37.5' />
      <path
        data-part='thin'
        d='M22.75 39.3 L23.33 45.5 L24.67 45.5 L25.25 39.3 Z'
      />
      {VIOLIN_STRINGS.map((d) => (
        <path key={d} data-part='str' d={d} />
      ))}
      <path
        data-part='thin'
        d='M23.08 19.3 L23.25 16.5 M24.92 19.3 L24.75 16.5'
      />
      <path data-part='thin' d='M21.83 18.5 H26.17' />
      <path data-part='thin' d='M21.83 17.38 H26.17' />
      <path
        data-part='thin'
        d='M24.17 15.9 a1.17 1.17 0 1 1 -0.08 -0.01 M24 15.9 m-0.42 0 a0.5 0.5 0 1 0 0.75 0'
      />
      {endpin ? <path data-part='thin' d='M24 46.5 V49' /> : null}
    </>
  )
}

function ViolinVoice() {
  return (
    <>
      {VIOLIN_STRINGS.map((d) => (
        <path key={d} d={d} />
      ))}
    </>
  )
}

// ---- flute -------------------------------------------------------------------

/** The seven open-hole keys along the body, foot end first. */
const FLUTE_KEYS = [31.5, 28.6, 25.7, 22.8, 19.9, 17, 14.1]
/** The three little keys of the foot joint. */
const FLUTE_FOOT_KEYS = [8, 6.1, 4.2]

function FluteBody() {
  return (
    <>
      <rect
        data-part='body'
        x={2.5}
        y={22.6}
        width={43}
        height={2.8}
        rx={1.2}
      />
      <rect
        data-part='thin'
        x={44.6}
        y={22.3}
        width={2}
        height={3.4}
        rx={0.8}
      />
      {/* The lip plate and the embouchure hole in it. */}
      <ellipse data-part='thin' cx={39.8} cy={24} rx={2.6} ry={2.1} />
      <ellipse data-part='fill' cx={39.8} cy={24} rx={1} ry={0.7} />
      <path data-part='thin' d='M34.5 22.3 V25.7' />
      <path data-part='thin' d='M10 22.3 V25.7' />
      {FLUTE_KEYS.map((cx) => (
        <circle key={cx} data-part='thin' cx={cx} cy={24} r={1.05} />
      ))}
      {FLUTE_FOOT_KEYS.map((cx) => (
        <circle key={cx} data-part='thin' cx={cx} cy={24} r={0.75} />
      ))}
      <path data-part='thin' d='M12 21.6 H31.5' />
    </>
  )
}

/**
 * The air column: a standing wave down the bore, from the embouchure to
 * the open foot, and the hole the jet crosses.
 */
function FluteVoice() {
  return (
    <>
      <path d='M3.2 24 Q20.9 22.5 38.6 24 Q20.9 25.5 3.2 24 Z' />
      <ellipse cx={39.8} cy={24} rx={1.3} ry={1} />
    </>
  )
}

// ---- trumpet -----------------------------------------------------------------

/** Left edge of each piston valve. */
const TRUMPET_VALVES = [18.9, 22.3, 25.7]

function TrumpetBody() {
  return (
    <>
      <path data-part='thin' d='M3.5 22 H30' />
      <path
        data-part='fill'
        d='M2 20.6 Q4 21.3 4.6 21.8 V22.2 Q4 22.7 2 23.4 Z'
      />
      <path
        data-part='body'
        d='M15 22 V29 Q15 31 17 31 H31 Q33 31 33 29 V19 H35'
      />
      <path
        data-part='body'
        d='M35 19 C40 19 43 17.5 46 13.5 M35 19.6 C40 19.6 43 21 46 25.5'
      />
      <ellipse data-part='thin' cx={46} cy={19.5} rx={0.9} ry={6} />
      {TRUMPET_VALVES.map((x, i) => (
        <g key={x}>
          <rect
            data-part='thin'
            x={x}
            y={18}
            width={2.2}
            height={8.5}
            rx={0.8}
          />
          <circle data-part='thin' cx={x + 1.1} cy={16.4} r={1} />
          {/* The second valve's slide is the short one. */}
          <path
            data-part='str'
            d={`M${x + 0.6} 26.5 V${i === 1 ? 28 : 29.5} H${x + 1.6} V26.5`}
          />
        </g>
      ))}
    </>
  )
}

/** The bell's rim and two wavefronts leaving it. */
function TrumpetVoice() {
  return (
    <>
      <ellipse cx={46} cy={19.5} rx={0.9} ry={6} />
      <path d='M49 15.2 Q50.8 19.5 49 23.8' />
      <path d='M51.6 13 Q54.4 19.5 51.6 26' />
    </>
  )
}

// ---- trumpet, large ----------------------------------------------------------

/**
 * A trumpet to be shown at full size, after the app's vector-lines view:
 * mouthpiece and leadpipe on the left, the long loop of tubing drawn as
 * the two walls of a stadium, three piston valves standing through it,
 * and the bell flaring off the top run. Drawn in its own 684×246 box at
 * one unit to roughly one stage unit, so callers scale it by about 1.
 */
const VALVE_X = [252, 292, 332]

function TrumpetLargeBody() {
  return (
    <>
      {/* Mouthpiece: cup, throat and shank. */}
      <path
        data-part='body'
        d='M4 86 Q0 100 4 114 L14 113 Q24 106 40 104 L66 103 V97 L40 96 Q24 94 14 87 Z'
      />
      {/* Leadpipe into the top run of the loop. */}
      <path data-part='body' d='M66 94 H160 M66 106 H160' />
      {/* The loop: outer and inner wall, 12 apart. */}
      <path
        data-part='body'
        d='M156 94 H426 A46 46 0 0 1 426 186 H156 A46 46 0 0 1 156 94 Z'
      />
      <path
        data-part='thin'
        d='M156 106 H426 A34 34 0 0 1 426 174 H156 A34 34 0 0 1 156 106 Z'
      />
      {/* Bell: off the top run, flaring to the rim. */}
      <path
        data-part='body'
        d='M400 94 C480 94 548 82 606 30 M400 106 C480 106 548 120 606 172'
      />
      <ellipse data-part='body' cx={606} cy={101} rx={9} ry={71} />
      <ellipse data-part='thin' cx={548} cy={101} rx={4} ry={22} />
      {/* Valves: casing, caps, stem and finger button. */}
      {VALVE_X.map((x, i) => (
        <g key={x}>
          <rect data-part='body' x={x} y={70} width={28} height={136} rx={5} />
          <rect
            data-part='thin'
            x={x - 2}
            y={62}
            width={32}
            height={9}
            rx={3}
          />
          <rect
            data-part='thin'
            x={x - 2}
            y={205}
            width={32}
            height={11}
            rx={3}
          />
          <path data-part='thin' d={`M${x + 14} 62 V${40 - i * 2}`} />
          <ellipse
            data-part='body'
            cx={x + 14}
            cy={38 - i * 2}
            rx={13}
            ry={4.5}
          />
        </g>
      ))}
      {/* First- and third-valve slides, out to either side. */}
      <path
        data-part='thin'
        d='M252 128 H206 A13 13 0 0 0 206 154 H252 M360 136 H416 A12 12 0 0 1 416 160 H360'
      />
    </>
  )
}

/** The bell's rim and two wavefronts leaving it. */
function TrumpetLargeVoice() {
  return (
    <>
      <ellipse cx={606} cy={101} rx={9} ry={71} />
      <path d='M638 50 Q660 101 638 152' />
      <path d='M664 30 Q694 101 664 172' />
    </>
  )
}

// ---- lookup ------------------------------------------------------------------

export function GlyphBody({ kind }: { kind: DrawingKind }): ReactElement {
  switch (kind) {
    case 'grand':
      return <GrandBody />
    case 'upright':
      return <UprightBody />
    case 'violin':
    case 'viola':
      return <ViolinBody />
    case 'cello':
      return <ViolinBody endpin />
    case 'flute':
      return <FluteBody />
    case 'trumpet':
      return <TrumpetBody />
    case 'trumpetLarge':
      return <TrumpetLargeBody />
  }
}

export function GlyphVoice({ kind }: { kind: DrawingKind }): ReactElement {
  switch (kind) {
    case 'grand':
      return <GrandVoice />
    case 'upright':
      return <UprightVoice />
    case 'violin':
    case 'viola':
    case 'cello':
      return <ViolinVoice />
    case 'flute':
      return <FluteVoice />
    case 'trumpet':
      return <TrumpetVoice />
    case 'trumpetLarge':
      return <TrumpetLargeVoice />
  }
}
