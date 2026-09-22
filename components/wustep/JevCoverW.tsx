import { type CSSProperties } from 'react'

import styles from './JevCoverW.module.css'

/**
 * JevCoverW — "The conductor."
 *
 *   An orchestra on tiered risers under a concert shell, four sections in a
 *   crescent — one per room. Jev is the baton tip: the conductor, seen from
 *   behind on the podium, can only cue one section at a time. At rest the
 *   baton already points at the gold section (the brass) under its lamp.
 *   Hover runs the beat: the baton sweeps the sections left to right, each
 *   lamp answering as it passes, then settles on gold and beats time while
 *   the brass bounce and notes rise out of their bells.
 *
 *   The stage is 1600×360 sliced to the cover box; the beat lives inside the
 *   middle 640 units a 16:9 card shows, and the wings are only more hall.
 */

const STAGE_W = 1600
const STAGE_H = 360

const INK = 'var(--jw-ink)'

/** Riser centers (top edge) and the instrument each section holds. */
const SECTIONS = [
  { x: 566, y: 238, color: 'var(--jw-blue)', kind: 'strings' },
  { x: 704, y: 180, color: 'var(--jw-rose)', kind: 'winds' },
  { x: 896, y: 180, color: 'var(--jw-gold)', kind: 'brass' },
  { x: 1034, y: 238, color: 'var(--jw-mint)', kind: 'drums' }
] as const
const PICK_I = 2
const PICK = SECTIONS[PICK_I]!
const RISER_W = 150

/** Right shoulder of the conductor; the baton arm pivots here. */
const SHOULDER = { x: 818, y: 300 }
const ANGLES = SECTIONS.map(
  (s) => (Math.atan2(s.y - 22 - SHOULDER.y, s.x - SHOULDER.x) * 180) / Math.PI
)

const PLAYER_XS = [-52, -26, 0, 26, 52]

function Instrument({ kind, color }: { kind: string; color: string }) {
  // Drawn relative to a seated player's head at (0, 0).
  switch (kind) {
    case 'strings':
      return (
        <g stroke={INK} strokeWidth='2'>
          <ellipse cx='9' cy='20' rx='5' ry='9' fill={color} />
          <path d='M-6,8 L20,22' strokeWidth='2' />
        </g>
      )
    case 'winds':
      return (
        <path
          d='M4,6 L16,30'
          stroke={color}
          strokeWidth='5'
          strokeLinecap='round'
        />
      )
    case 'brass':
      return (
        <g stroke={INK} strokeWidth='2' strokeLinejoin='round'>
          <path d='M6,4 L20,4 L30,-4 L30,14 L20,8 L6,8 Z' fill={color} />
        </g>
      )
    default:
      return (
        <g stroke={INK} strokeWidth='2'>
          <ellipse cx='10' cy='26' rx='11' ry='5' fill={color} />
          <path d='M-1,26 L-1,34 M21,26 L21,34' />
        </g>
      )
  }
}

function Note({ x, y, i }: { x: number; y: number; i: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <g className={styles.note} style={{ animationDelay: `${i * 0.35}s` }}>
        <g fill={INK}>
          <ellipse cx='0' cy='0' rx='7' ry='5' transform='rotate(-20)' />
          <rect x='5' y='-26' width='3' height='26' />
          {i % 2 === 0 ? (
            <path d='M8,-26 q10,4 8,16 q-2,-8 -8,-9 Z' />
          ) : (
            <>
              <ellipse
                cx='22'
                cy='-4'
                rx='7'
                ry='5'
                transform='rotate(-20 22 -4)'
              />
              <rect x='27' y='-30' width='3' height='26' />
              <rect x='5' y='-30' width='25' height='5' />
            </>
          )}
        </g>
      </g>
    </g>
  )
}

export function JevCoverW() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        preserveAspectRatio='xMidYMid slice'
      >
        <rect width={STAGE_W} height={STAGE_H} fill='var(--jw-wall)' />
        {/* the concert shell: nested arches */}
        {[520, 420, 320].map((r, i) => (
          <path
            key={r}
            d={`M${800 - r * 1.2},300 C${800 - r * 1.2},${300 - r * 0.9} ${800 + r * 1.2},${300 - r * 0.9} ${800 + r * 1.2},300 Z`}
            fill={i % 2 ? 'var(--jw-shell-b)' : 'var(--jw-shell-a)'}
            stroke='var(--jw-shell-line)'
            strokeWidth='3'
          />
        ))}
        {/* curtains in the wings */}
        <g fill='var(--jw-curtain)'>
          <path d='M0,0 L300,0 C280,120 250,240 230,360 L0,360 Z' />
          <path d='M1600,0 L1300,0 C1320,120 1350,240 1370,360 L1600,360 Z' />
        </g>
        <g stroke='var(--jw-curtain-fold)' strokeWidth='4' fill='none'>
          <path d='M90,0 C84,120 76,240 70,360 M180,0 C170,120 160,240 150,360' />
          <path d='M1510,0 C1516,120 1524,240 1530,360 M1420,0 C1430,120 1440,240 1450,360' />
        </g>
        <path d='M0,300 L1600,300 L1600,360 L0,360 Z' fill='var(--jw-floor)' />

        {/* the sections: lamp, players, riser */}
        {SECTIONS.map((s, i) => (
          <g key={s.x}>
            <ellipse
              className={styles[`lamp${i}`]}
              cx={s.x}
              cy={s.y - 24}
              rx='92'
              ry='48'
              fill={s.color}
            />
            <g className={i === PICK_I ? styles.play : undefined}>
              {PLAYER_XS.map((dx, k) => (
                <g
                  key={dx}
                  transform={`translate(${s.x + dx}, ${s.y - 40 + (k % 2) * 3})`}
                >
                  <g
                    className={i === PICK_I ? styles.bounce : undefined}
                    style={{ animationDelay: `${k * 0.08}s` }}
                  >
                    <path d='M-11,40 C-11,18 11,18 11,40 Z' fill={INK} />
                    <circle cx='0' cy='6' r='8' fill={INK} />
                    <Instrument kind={s.kind} color={s.color} />
                  </g>
                </g>
              ))}
            </g>
            <rect
              x={s.x - RISER_W / 2}
              y={s.y}
              width={RISER_W}
              height={300 - s.y}
              fill='var(--jw-riser)'
              stroke={INK}
              strokeWidth='3'
            />
            <rect
              x={s.x - RISER_W / 2}
              y={s.y}
              width={RISER_W}
              height='10'
              fill={s.color}
              stroke={INK}
              strokeWidth='3'
            />
          </g>
        ))}

        {[0, 1, 2].map((i) => (
          <Note key={i} x={PICK.x - 30 + i * 30} y={PICK.y - 60} i={i} />
        ))}

        {/* Jev: the conductor from behind, baton arm behind the body */}
        <g transform={`translate(${SHOULDER.x}, ${SHOULDER.y})`}>
          <g
            className={styles.arm}
            style={
              {
                '--a0': `${ANGLES[0]}deg`,
                '--a1': `${ANGLES[1]}deg`,
                '--a2': `${ANGLES[2]}deg`,
                '--a3': `${ANGLES[3]}deg`
              } as CSSProperties
            }
          >
            <path
              d='M0,0 L68,0'
              stroke={INK}
              strokeWidth='13'
              strokeLinecap='round'
            />
            <circle
              cx='72'
              cy='0'
              r='7'
              fill='var(--jw-skin)'
              stroke={INK}
              strokeWidth='2.5'
            />
            <path
              d='M76,0 L150,0'
              stroke='var(--jw-baton)'
              strokeWidth='3'
              strokeLinecap='round'
            />
            <circle
              className={styles.tip}
              cx='152'
              cy='0'
              r='6'
              fill='var(--jw-gold)'
            />
          </g>
        </g>
        <g fill={INK}>
          <path d='M760,360 L766,310 C770,296 790,290 800,290 C810,290 830,296 834,310 L840,360 Z' />
          <path d='M782,304 C774,300 768,286 772,276 C778,284 782,290 790,294 Z' />
          <circle cx='800' cy='272' r='17' />
          <rect
            x='740'
            y='346'
            width='120'
            height='14'
            rx='3'
            fill='var(--jw-podium)'
            stroke={INK}
            strokeWidth='3'
          />
        </g>
      </svg>
    </div>
  )
}
