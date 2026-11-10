import { type CSSProperties, useId } from 'react'

import {
  type DrawingKind,
  GLYPH_BOX,
  GlyphBody,
  GlyphVoice,
  type InstrumentKind
} from './instrumentsCoverGlyphs'
import styles from './InstrumentsCoverPicker.module.css'

/**
 * InstrumentsCoverPicker — the picker: all seven instruments in a row, the
 * one that is picked drawn large and sounding. Unshipped variant, kept for
 * the covers-preview workbench.
 *
 *   The app's own screen, caricatured in its "vector lines" style: glowing
 *   blue line drawings on black. Along the bottom is its instrument
 *   picker, all seven live instruments as its own glyphs; above, inside
 *   the dashed frame the app draws round whatever is in view, the picked
 *   one fills the stage, with what sounds on it (strings, the flute's air
 *   column, the wavefronts off the trumpet's bell) lit amber.
 *
 *   At rest the cello is picked, a bow across its strings. Hover walks the
 *   picker: flute, trumpet, grand, upright, violin, viola and round
 *   again, each instrument taking the stage as it is picked and ringing
 *   down while it holds it; the strings are bowed while they do.
 *
 *   Apply-on-hover, as LensesCover does: the rest frame is exact, and the
 *   walk always sets off from the cello.
 */

// ---- stage -----------------------------------------------------------------

/**
 * The cover box is ~190px tall at every card width and 1.6 to 4.6 times as
 * wide, so the viewBox is an extra-wide stage (1800×360, 5:1) under
 * `slice`, with x = 0 at its centre: the full height always fits, a
 * narrow card crops the wings, and a wide one shows more of the rule. The
 * frame is 720 wide, so it is whole on any card at least ~385px wide.
 */
const STAGE_W = 1800
const STAGE_H = 360

/** Hundredths: keeps server and client attribute strings identical. */
const r2 = (v: number) => Math.round(v * 100) / 100

/** The frame round the picked instrument, and where it is centred. */
const FRAME = { x: -360, y: 16, w: 720, h: 236 }
const HERO_Y = FRAME.y + FRAME.h / 2
const BRACKET = 15
/** Where the bow's head sits at the top of a down-bow. */
const BOW_TOP = FRAME.y + 12

/** The rule between the stage and the picker, and the picker's centre line. */
const RULE = 270
const PICK_Y = 314
/** Distance from one picker glyph to the next. */
const PICK_PITCH = 68

type Entry = {
  kind: InstrumentKind
  /**
   * On the stage: which drawing, stage units per drawing unit, and
   * degrees of turn.
   */
  hero: { kind: DrawingKind; scale: number; rot: number }
  /** In the picker. */
  pick: { scale: number; rot: number }
  /** Bowed instruments get a bow across the strings. */
  bowed?: boolean
}

/**
 * The app's picker order, with the upright (a preset of the piano there)
 * given its own place beside the grand.
 *
 * On the stage the strings lie scroll-left, as the app lays them. Its
 * viola and cello are ×1.15 and ×1.475 of the violin, which would not fit
 * one frame, so here they step up by less: what matters is that each is
 * bigger than the last. The grand lies keys-left to fill the frame, and
 * the trumpet is the fuller drawing, not its picker glyph.
 *
 * In the picker everything stands as the app's glyphs do, flute tilted.
 */
const ENTRIES: Entry[] = [
  {
    kind: 'grand',
    hero: { kind: 'grand', scale: 7.4, rot: 90 },
    pick: { scale: 1.45, rot: 0 }
  },
  {
    kind: 'upright',
    hero: { kind: 'upright', scale: 5.8, rot: 0 },
    pick: { scale: 1.4, rot: 0 }
  },
  {
    kind: 'violin',
    hero: { kind: 'violin', scale: 16.5, rot: -90 },
    pick: { scale: 1.5, rot: 0 },
    bowed: true
  },
  {
    kind: 'viola',
    hero: { kind: 'viola', scale: 18, rot: -90 },
    pick: { scale: 1.68, rot: 0 },
    bowed: true
  },
  {
    kind: 'cello',
    hero: { kind: 'cello', scale: 19.4, rot: -90 },
    pick: { scale: 1.8, rot: 0 },
    bowed: true
  },
  {
    kind: 'flute',
    hero: { kind: 'flute', scale: 15, rot: -7 },
    pick: { scale: 1.3, rot: -45 }
  },
  {
    kind: 'trumpet',
    hero: { kind: 'trumpetLarge', scale: 1, rot: 0 },
    pick: { scale: 1.3, rot: 0 }
  }
]

/**
 * The instrument picked at rest, and the one the walk sets off from. The
 * cello, so the first step of a hover goes somewhere that looks new (the
 * flute) and the three look-alike strings come last.
 */
const REST = 4

/** How long each instrument holds the stage. */
const STEP = 0.85
const LOOP = STEP * ENTRIES.length

/**
 * Where the bow meets the strings, in glyph y: between the end of the
 * fingerboard (33.7) and the bridge (37.5).
 */
const CONTACT_GY = 35.9

/** Stage x of the bow on a string instrument lying scroll-left. */
function bowX(entry: Entry): number {
  const box = GLYPH_BOX[entry.hero.kind]
  return r2((CONTACT_GY - (box.y + box.h / 2)) * entry.hero.scale)
}

/** Centres a glyph's box on (cx, cy), turned and scaled. */
function place(
  kind: DrawingKind,
  cx: number,
  cy: number,
  scale: number,
  rot: number
): string {
  const box = GLYPH_BOX[kind]
  return `translate(${r2(cx)} ${r2(cy)}) rotate(${rot}) scale(${scale}) translate(${r2(-(box.x + box.w / 2))} ${r2(-(box.y + box.h / 2))})`
}

function brackets(x: number, y: number, w: number, h: number): string {
  const b = BRACKET
  return [
    `M${x} ${y + b} V${y} H${x + b}`,
    `M${x + w - b} ${y} H${x + w} V${y + b}`,
    `M${x + w} ${y + h - b} V${y + h} H${x + w - b}`,
    `M${x + b} ${y + h} H${x} V${y + h - b}`
  ].join(' ')
}

/** Ticks hanging off the rule every 30 units, a longer one every fifth. */
const TICKS = Array.from({ length: STAGE_W / 30 + 1 }, (_, i) => ({
  x: -STAGE_W / 2 + i * 30,
  major: i % 5 === 0
}))

/**
 * The bow: hair on the strings, the stick beside it, the head at the top.
 * It runs on out of the bottom of the frame (clipped just past it), so only
 * the head shows that it is moving. Tilted 3° as a player holds it.
 */
function Bow({ x, clip }: { x: number; clip: string }) {
  return (
    <g clipPath={`url(#${clip})`}>
      <g transform={`rotate(3 ${x} ${HERO_Y})`}>
        <g className={styles.bow}>
          <line
            className={styles.hair}
            x1={x - 3}
            y1={BOW_TOP + 16}
            x2={x - 3}
            y2={STAGE_H + 200}
          />
          <path
            className={styles.stick}
            d={`M${x - 3} ${BOW_TOP + 16} V${BOW_TOP + 7} L${x + 5} ${BOW_TOP} V${STAGE_H + 200}`}
          />
        </g>
      </g>
    </g>
  )
}

export function InstrumentsCoverPicker() {
  const uid = useId().replaceAll(':', '')
  const id = (name: string) => `ic-${uid}-${name}`

  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`${-STAGE_W / 2} 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <defs>
          {/* Down to just past the frame: keeps the bow out of the picker. */}
          <clipPath id={id('stage')}>
            <rect
              x={-STAGE_W / 2}
              y={0}
              width={STAGE_W}
              height={FRAME.y + FRAME.h + 5}
            />
          </clipPath>
        </defs>

        {/* The rule: the only thing in the wings, so a wide card shows
            more of it and nothing else. */}
        <g className={styles.rule}>
          <line x1={-STAGE_W / 2} y1={RULE} x2={STAGE_W / 2} y2={RULE} />
          {TICKS.map(({ x, major }) => (
            <line key={x} x1={x} y1={RULE} x2={x} y2={RULE + (major ? 8 : 4)} />
          ))}
        </g>

        <rect
          className={styles.frameDash}
          x={FRAME.x}
          y={FRAME.y}
          width={FRAME.w}
          height={FRAME.h}
        />
        <path
          className={styles.frameCorners}
          d={brackets(FRAME.x, FRAME.y, FRAME.w, FRAME.h)}
        />

        {ENTRIES.map((entry, i) => {
          const pickX = (i - (ENTRIES.length - 1) / 2) * PICK_PITCH
          const hero = place(
            entry.hero.kind,
            0,
            HERO_Y,
            entry.hero.scale,
            entry.hero.rot
          )
          return (
            <g
              key={entry.kind}
              className={`${styles.entry} ${i === REST ? styles.rest : ''}`}
              style={
                {
                  // The walk starts on the rest instrument and wraps.
                  '--ic-delay': `${r2(((i - REST + ENTRIES.length) % ENTRIES.length) * STEP)}s`,
                  '--ic-loop': `${r2(LOOP)}s`
                } as CSSProperties
              }
            >
              {/* On the stage. --ic-u is one stage unit in the glyph's
                  own units, so strokes weigh the same at every scale. */}
              <g
                className={styles.hero}
                style={
                  {
                    '--ic-u': `${r2(1 / entry.hero.scale)}px`
                  } as CSSProperties
                }
              >
                <g className={styles.lines} transform={hero}>
                  <GlyphBody kind={entry.hero.kind} />
                </g>
                <g className={styles.voice} transform={hero}>
                  <g className={styles.buzz}>
                    <GlyphVoice kind={entry.hero.kind} />
                  </g>
                </g>
                {entry.bowed ? (
                  <Bow x={bowX(entry)} clip={id('stage')} />
                ) : null}
              </g>

              {/* In the picker, with the mark that says it is picked. */}
              <g
                className={styles.pick}
                transform={place(
                  entry.kind,
                  pickX,
                  PICK_Y,
                  entry.pick.scale,
                  entry.pick.rot
                )}
                style={
                  {
                    '--ic-u': `${r2(1 / entry.pick.scale)}px`
                  } as CSSProperties
                }
              >
                <GlyphBody kind={entry.kind} />
              </g>
              <rect
                className={styles.mark}
                x={r2(pickX - 15)}
                y={RULE - 1.5}
                width={30}
                height={3}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
