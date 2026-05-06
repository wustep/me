import styles from './MidiVisualizerCover.module.css'

// Two-octave keyboard starting at C. E major chord = E, G#, B.
// White key indices: 0=C, 1=D, 2=E, 3=F, 4=G, 5=A, 6=B, 7=C, 8=D, 9=E
// Black key offsets — "right edge of white key N":
//   0→C#, 1→D#, 3→F#, 4→G#, 5→A#, 7→C#, 8→D#
const WHITE_KEYS = 10
const PRESSED_WHITES = new Set([2, 6])
// Black keys (in order so :nth-of-type works) and which is pressed.
const BLACK_KEYS = [
  { offset: 0, pressed: false }, // C#
  { offset: 1, pressed: false }, // D#
  { offset: 3, pressed: false }, // F#
  { offset: 4, pressed: true }, // G# ← chord note
  { offset: 5, pressed: false }, // A#
  { offset: 7, pressed: false }, // C#
  { offset: 8, pressed: false } // D#
]

// Bars positioned over the chord notes. `whiteIdx` is for white keys; for the
// black bar we use `blackOffset` (matches BLACK_KEYS.offset).
const BARS = [
  { key: 'E', whiteIdx: 2, accent: false },
  { key: 'G#', blackOffset: 4, accent: true },
  { key: 'B', whiteIdx: 6, accent: false }
]

export function MidiVisualizerCover() {
  const whiteWidthPct = 100 / WHITE_KEYS
  const blackWidthPct = whiteWidthPct * 0.6

  return (
    <div className={styles.cover} aria-hidden='true'>
      <div className={styles.bars}>
        {BARS.map((bar, i) => {
          const isBlack = bar.blackOffset != null
          // Bar width matches key width exactly so each bar reads as the
          // key's note rising up.
          const barWidth = isBlack ? blackWidthPct : whiteWidthPct
          const center = isBlack
            ? (bar.blackOffset! + 1) * whiteWidthPct
            : bar.whiteIdx! * whiteWidthPct + whiteWidthPct / 2
          const left = center - barWidth / 2
          return (
            <div
              key={i}
              className={[styles.bar, bar.accent ? styles.barAccent : ''].join(
                ' '
              )}
              style={{
                left: `${left}%`,
                width: `${barWidth}%`
              }}
            />
          )
        })}
      </div>
      <div className={styles.piano}>
        <div className={styles.whiteRow}>
          {Array.from({ length: WHITE_KEYS }).map((_, i) => (
            <div
              key={i}
              className={[
                styles.white,
                PRESSED_WHITES.has(i) ? styles.whitePressed : ''
              ].join(' ')}
            />
          ))}
        </div>
        {BLACK_KEYS.map((bk, i) => {
          const left = (bk.offset + 1) * whiteWidthPct - blackWidthPct / 2
          return (
            <div
              key={i}
              className={[
                styles.black,
                bk.pressed ? styles.blackPressed : ''
              ].join(' ')}
              style={{ left: `${left}%`, width: `${blackWidthPct}%` }}
            />
          )
        })}
      </div>
    </div>
  )
}
