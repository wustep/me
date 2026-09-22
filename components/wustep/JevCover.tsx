import styles from './JevCover.module.css'
import { jevTypeClass } from './jevCoverType'

/**
 * JevCover — the dial writes the staff.
 *
 *   Miniature of the music page: the composer dial (sheet, ink rule, a 4px
 *   accent on the chosen stop) sitting over an open staff. At rest Bach is
 *   chosen and a four-note phrase is already engraved — a finished frame.
 *   Hover steps the dial the way the app does (Bach, Chopin, Debussy,
 *   Glass, each in its own stop color) and plays the new phrase: the notes
 *   crossfade, then each notehead takes the stop's accent as it sounds.
 *
 *   The stage is wide (1200×240, sliced to the cover box) so the full
 *   height always fits; the dial and the phrase sit in the middle ~400
 *   units a 16:9 card shows, and a wider card only reveals more staff.
 */

const INK = '#16161a'
const SHEET = '#fbf8f1'

const STAGE_W = 1200
const STAGE_H = 240

// The dial is the app's: one sheet, shared ink rules, four equal stops.
// Centered on x=600 so every 16:9 crop (the middle ~427 units) holds it
// whole, with a few units of paper to either side.
const DIAL = { x: 406, y: 26, w: 388, h: 72 }
const STOP_W = DIAL.w / 4

// Staff. Five lines, gap 11; the middle line is B4. Wing lines run to the
// stage edge so a wide card shows more manuscript instead of more margin.
const LINE0 = 122
const GAP = 11
const MID = LINE0 + GAP * 2
const NOTE_X = [480, 560, 640, 720]

const LOOP_S = 7.2

function showClass(id: Phrase['id']) {
  switch (id) {
    case 'bach':
      return styles.showBach
    case 'chopin':
      return styles.showChopin
    case 'debussy':
      return styles.showDebussy
    case 'glass':
      return styles.showGlass
  }
}

type Phrase = {
  id: 'bach' | 'chopin' | 'debussy' | 'glass'
  name: string
  accent: string
  /** Loop-% window where this stop is chosen and its phrase is on the staff. */
  start: number
  end: number
  /** Notehead centers, one per NOTE_X. Middle line is MID. */
  ys: readonly number[]
}

// Windows match the stylesheet's show* keyframes. Bach owns the rest pose
// (0%) and the loop's landing, so pausing — and reduced motion — shows Bach.
const PHRASES: readonly Phrase[] = [
  {
    id: 'bach',
    name: 'Bach',
    accent: '#9a6a1c',
    start: 2,
    end: 16,
    ys: [MID, MID - GAP / 2, MID - GAP, MID - GAP / 2]
  },
  {
    id: 'chopin',
    name: 'Chopin',
    accent: '#a84a62',
    start: 24,
    end: 38,
    ys: [MID - GAP * 1.5, MID - GAP, MID, MID - GAP]
  },
  {
    id: 'debussy',
    name: 'Debussy',
    accent: '#23808f',
    start: 46,
    end: 60,
    ys: [MID - GAP, MID - GAP * 1.5, MID - GAP, LINE0]
  },
  {
    id: 'glass',
    name: 'Glass',
    accent: '#4353c9',
    start: 68,
    end: 84,
    ys: [MID + GAP, MID + GAP, MID, MID]
  }
]

// Accent flash per note, generated so the phrase table stays the source of
// truth. A short blip inside that stop's window; 0% is dark so the rest
// pose is ink notes only.
const BLIP_CSS = PHRASES.map((phrase) => {
  const span = (phrase.end - phrase.start) / phrase.ys.length
  return phrase.ys
    .map((_, i) => {
      const on = phrase.start + i * span
      const hold = on + span * 0.45
      const off = on + span * 0.8
      return `@keyframes jev-dial-${phrase.id}-${i}{0%,${on.toFixed(2)}%{opacity:0}${(on + 0.35).toFixed(2)}%,${hold.toFixed(2)}%{opacity:1}${off.toFixed(2)}%,100%{opacity:0}}`
    })
    .join('')
}).join('')

function Note({
  x,
  y,
  accent,
  blip
}: {
  x: number
  y: number
  accent: string
  blip: string
}) {
  // Stems up below the middle line, down above it — the engraving habit,
  // and it keeps a high note from colliding with the dial.
  const stemDown = y < MID
  const stemX = stemDown ? -5.2 : 5.2
  const stemY = stemDown ? 26 : -26
  const head = (fill: string) => (
    <g>
      <ellipse rx='6.4' ry='4.7' fill={fill} transform='rotate(-18)' />
      <line
        x1={stemX}
        y1={stemDown ? 1 : -1}
        x2={stemX}
        y2={stemY}
        stroke={fill}
        strokeWidth='1.7'
        strokeLinecap='round'
      />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y})`}>
      {head(INK)}
      <g
        className={styles.blip}
        opacity='0'
        style={{
          animationName: blip,
          animationDuration: `${LOOP_S}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      >
        {head(accent)}
      </g>
    </g>
  )
}

export function JevCover() {
  return (
    <div className={`${styles.cover} ${jevTypeClass}`} aria-hidden='true'>
      <style dangerouslySetInnerHTML={{ __html: BLIP_CSS }} />
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        {/* Manuscript across the whole stage; the dial sits on top of it. */}
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={i}
            x1='36'
            y1={LINE0 + i * GAP}
            x2={STAGE_W - 36}
            y2={LINE0 + i * GAP}
            stroke={INK}
            strokeWidth='1.05'
            opacity='0.8'
          />
        ))}
        {/* Barlines bracket the phrase the dial is writing. */}
        {[456, 744].map((x) => (
          <line
            key={x}
            x1={x}
            y1={LINE0}
            x2={x}
            y2={LINE0 + GAP * 4}
            stroke={INK}
            strokeWidth='1.15'
          />
        ))}

        {PHRASES.map((phrase) => (
          <g key={phrase.id} className={showClass(phrase.id)}>
            {phrase.ys.map((y, i) => (
              <Note
                key={`${phrase.id}-${i}`}
                x={NOTE_X[i]!}
                y={y}
                accent={phrase.accent}
                blip={`jev-dial-${phrase.id}-${i}`}
              />
            ))}
          </g>
        ))}

        {/* Dial. Ink names stay put; the chosen stop's wash, top rule, and
            accent-colored name fade in over them. */}
        <g>
          <rect
            x={DIAL.x}
            y={DIAL.y}
            width={DIAL.w}
            height={DIAL.h}
            fill={SHEET}
            stroke={INK}
            strokeWidth='1.5'
          />
          {PHRASES.slice(1).map((_, i) => {
            const x = DIAL.x + STOP_W * (i + 1)
            return (
              <line
                key={x}
                x1={x}
                y1={DIAL.y}
                x2={x}
                y2={DIAL.y + DIAL.h}
                stroke={INK}
                strokeWidth='1.15'
              />
            )
          })}
          {PHRASES.map((phrase, i) => {
            const x = DIAL.x + STOP_W * i
            const cx = x + STOP_W / 2
            const on = showClass(phrase.id)
            return (
              <g key={phrase.id}>
                <text className={styles.stopName} x={cx} y={DIAL.y + 44}>
                  {phrase.name}
                </text>
                <g className={on}>
                  <rect
                    x={x + 0.75}
                    y={DIAL.y + 0.75}
                    width={STOP_W - 1.5}
                    height={DIAL.h - 1.5}
                    fill={phrase.accent}
                    opacity='0.14'
                  />
                  <rect
                    x={x}
                    y={DIAL.y}
                    width={STOP_W}
                    height='4'
                    fill={phrase.accent}
                  />
                  <text
                    className={styles.stopAccent}
                    x={cx}
                    y={DIAL.y + 44}
                    fill={phrase.accent}
                  >
                    {phrase.name}
                  </text>
                </g>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
