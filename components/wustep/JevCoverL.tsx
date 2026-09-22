import styles from './JevCoverL.module.css'
import { JevObject } from './JevCoverObjects'

/** The mobile — four peer worlds held by one small decision.. Preview only; no type or copy is painted into the artwork. */
export function JevCoverL() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        className={styles.svg}
        viewBox='0 0 1200 240'
        preserveAspectRatio='xMidYMid slice'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='597' cy='121' r='99' fill='#303a48' />
        <path d='M600 0V39' stroke='#dacdb8' strokeWidth='2' />
        <g className={`${styles.anim} ${styles.mobile}`}>
          <path
            d='M489 72 600 40 718 68M489 72V98M718 68V96'
            stroke='#dacdb8'
            strokeWidth='3'
          />
          <circle cx='600' cy='40' r='10' fill='#efe4cb' />
          <path
            d='M438 117 489 98 545 115M662 115 718 96 770 112'
            stroke='#dacdb8'
            strokeWidth='2.5'
          />
          <path
            d='M438 117V153M545 115V163M662 115V163M770 112V151'
            stroke='#dacdb8'
            strokeWidth='1.5'
          />
          <g className={`${styles.anim} ${styles.music}`}>
            <g transform='translate(438 178)' color='#e9bb57'>
              <JevObject kind='music' />
            </g>
          </g>
          <g transform='translate(545 186)' color='#d66e59'>
            <JevObject kind='trolley' />
          </g>
          <g transform='translate(662 184)' color='#83b4c7'>
            <JevObject kind='inbox' />
          </g>
          <g transform='translate(770 179)' color='#b69acf'>
            <JevObject kind='match' />
          </g>
          <circle cx='489' cy='98' r='5' fill='#e9bb57' />
          <circle cx='718' cy='96' r='5' fill='#b69acf' />
        </g>
        {[
          [418, 57],
          [755, 34],
          [636, 208],
          [795, 91]
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r='2' fill='#eee2c8' opacity='.5' />
        ))}
      </svg>
    </div>
  )
}
