import { type CSSProperties } from 'react'

import styles from './InstrumentsCoverD.module.css'
import {
  GLYPH_BOX,
  GlyphBody,
  type InstrumentKind
} from './instrumentsCoverGlyphs'

/**
 * InstrumentsCoverD — seven voices: a score of standing waves, one line
 * per instrument.
 *
 *   Unshipped variant, kept for the covers-preview workbench.
 *
 *   The wildcard. The app plays no samples, only vibrating strings and air
 *   columns worked out as it goes, so this cover is the textbook figure of
 *   exactly that: seven lines, one for each instrument, each standing in
 *   the next mode up (one loop, two, three … seven), laid out like the
 *   staves of a score with the instrument's glyph where its name would be.
 *   Vector-lines palette: blue envelopes, the live wave in amber.
 *
 *   At rest each wave is caught at a different point of its swing. Hover
 *   lets them go: every line swings through its envelope, the higher modes
 *   faster.
 *
 *   Paused timeline, as StageBenchCover does: hovering out freezes the
 *   waves where they are.
 */

// ---- stage -----------------------------------------------------------------

/**
 * An extra-wide stage (1800×360, 5:1) under `slice`, x = 0 at its centre.
 * Glyphs and waves together span x −355 to 345, so the whole figure is in
 * frame on any card at least ~375px wide. The string lines carry on to
 * both edges, so a wide card shows more line and nothing else.
 */
const STAGE_W = 1800
const STAGE_H = 360

/** The two fixed ends every wave stands between. */
const X0 = -215
const X1 = 345
const LENGTH = X1 - X0

/** First line, and the distance from one line to the next. */
const TOP = 42
const PITCH = 46
/** Peak displacement: a third of the pitch, so neighbours never touch. */
const AMP = 15

/** Right edge of the glyph column, a short gap before the waves start. */
const GLYPH_R = -238

/** Hundredths: keeps server and client attribute strings identical. */
const r2 = (v: number) => Math.round(v * 100) / 100

type Voice = {
  kind: InstrumentKind
  /** Stage units per glyph unit: sized so each fits within one line's pitch. */
  scale: number
  /** Degrees: the strings lie scroll-left, as the app lays them. */
  rot: number
  /**
   * Seconds for one swing, peak to opposite peak. Higher modes swing
   * faster, as they do, though far more gently than the true 1:2:3.
   */
  swing: number
  /** Where in its swing the wave is caught at rest, 0 (peak) to 1. */
  phase: number
}

/** Score order: winds, strings, keyboards. Mode number is the row + 1. */
const VOICES: Voice[] = [
  { kind: 'flute', scale: 2.3, rot: 0, swing: 1.3, phase: 0 },
  { kind: 'trumpet', scale: 2.2, rot: 0, swing: 1.08, phase: 0.2 },
  { kind: 'violin', scale: 2.5, rot: -90, swing: 0.92, phase: 0.06 },
  { kind: 'viola', scale: 2.9, rot: -90, swing: 0.8, phase: 0.26 },
  { kind: 'cello', scale: 3.2, rot: -90, swing: 0.7, phase: 0.12 },
  { kind: 'grand', scale: 1.05, rot: 0, swing: 0.62, phase: 0.3 },
  { kind: 'upright', scale: 1.05, rot: 0, swing: 0.56, phase: 0.03 }
]

/**
 * One half-wave from xa to xb, bulging `amp` off the line (negative is
 * up). A cubic with both handles 0.4 of the way in and 4/3 of the height
 * is within a hair of a true half sine.
 */
function arch(xa: number, xb: number, y: number, amp: number): string {
  const w = xb - xa
  const h = y + (amp * 4) / 3
  return `C${r2(xa + w * 0.4)} ${r2(h)} ${r2(xb - w * 0.4)} ${r2(h)} ${r2(xb)} ${y}`
}

/** Mode n: n half-waves end to end. `alternate` flips every other one. */
function wave(n: number, y: number, amp: number, alternate: boolean): string {
  const step = LENGTH / n
  let d = `M${X0} ${y}`
  for (let k = 0; k < n; k++) {
    const sign = alternate && k % 2 === 1 ? -1 : 1
    d += ` ${arch(X0 + k * step, X0 + (k + 1) * step, y, -amp * sign)}`
  }
  return d
}

/** Everywhere the wave can reach: the mode's arches above and below. */
function envelope(n: number, y: number): string {
  const step = LENGTH / n
  let d = wave(n, y, AMP, false)
  for (let k = n - 1; k >= 0; k--) {
    d += ` ${arch(X0 + (k + 1) * step, X0 + k * step, y, AMP)}`
  }
  return `${d} Z`
}

export function InstrumentsCoverD() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`${-STAGE_W / 2} 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        {VOICES.map((voice, i) => {
          const n = i + 1
          const y = TOP + i * PITCH
          const box = GLYPH_BOX[voice.kind]
          // Drawn length along the line: a rotated glyph lies on its side.
          const along = (voice.rot === 0 ? box.w : box.h) * voice.scale
          const place = `translate(${r2(GLYPH_R - along / 2)} ${y}) rotate(${voice.rot}) scale(${voice.scale}) translate(${r2(-(box.x + box.w / 2))} ${r2(-(box.y + box.h / 2))})`
          return (
            <g
              key={voice.kind}
              style={
                {
                  '--icd-swing': `${voice.swing}s`,
                  // Negative: start part-way through the swing, so the
                  // paused rest frame catches each wave somewhere else.
                  '--icd-delay': `${r2(-voice.swing * voice.phase)}s`,
                  '--icd-u': `${r2(1 / voice.scale)}px`
                } as CSSProperties
              }
            >
              <line
                className={styles.string}
                x1={-STAGE_W / 2}
                y1={y}
                x2={STAGE_W / 2}
                y2={y}
              />
              <path className={styles.envelope} d={envelope(n, y)} />
              {/* The nodes: the two ends and every still point between. */}
              {Array.from({ length: n + 1 }, (_, k) => (
                <circle
                  key={k}
                  className={styles.node}
                  cx={r2(X0 + (k * LENGTH) / n)}
                  cy={y}
                  r={k === 0 || k === n ? 3.4 : 2}
                />
              ))}
              <path
                className={styles.live}
                style={{ transformOrigin: `0px ${y}px` }}
                d={wave(n, y, AMP, true)}
              />
              <g className={styles.glyph} transform={place}>
                <GlyphBody kind={voice.kind} />
              </g>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
