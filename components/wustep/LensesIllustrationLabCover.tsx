import styles from './LensesIllustrationLabCover.module.css'

const SWATCHES = ['#B43A2E', '#243449', '#204A40', '#EFE4CC', '#8F3E62']

export function LensesIllustrationLabCover() {
  return (
    <div className={styles.cover}>
      <div className={styles.gridGlow} aria-hidden />
      <div className={styles.workbench}>
        <div className={styles.previewCard}>
          <svg
            viewBox='0 0 100 100'
            className={styles.illustration}
            aria-hidden
          >
            <path
              className={styles.terrain}
              d='M 15 77 C 28 64 37 72 49 58 C 58 47 65 49 84 38'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.6'
              strokeLinecap='round'
              opacity='0.35'
            />
            <path
              className={styles.terrain}
              d='M 18 62 C 28 50 39 56 48 43 C 59 28 70 32 82 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.6'
              strokeLinecap='round'
              opacity='0.45'
            />
            <path
              className={styles.trace}
              d='M 18 70 C 27 54 37 64 45 50 C 54 34 64 39 82 22'
              fill='none'
              stroke='var(--cover-accent)'
              strokeWidth='3'
              strokeLinecap='round'
            />
            <g className={styles.points} fill='currentColor' opacity='0.48'>
              <circle cx='25' cy='68' r='3' />
              <circle cx='38' cy='58' r='2.6' />
              <circle cx='54' cy='42' r='2.4' />
              <circle cx='67' cy='35' r='2.2' />
            </g>
            <g className={styles.mark}>
              <circle
                cx='82'
                cy='22'
                r='10'
                fill='var(--cover-accent)'
                opacity='0.2'
              />
              <circle cx='82' cy='22' r='5.4' fill='var(--cover-accent)' />
            </g>
          </svg>
          <span className={styles.cardLabel}>Expertise</span>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.swatches}>
            {SWATCHES.map((color) => (
              <span key={color} style={{ background: color }} />
            ))}
          </div>
          <div className={styles.matrix}>
            {Array.from({ length: 18 }, (_, index) => (
              <span
                key={index}
                className={index === 6 ? styles.activeCell : ''}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.titleLockup}>
        <span>Illustration</span>
        <strong>Lab</strong>
      </div>
    </div>
  )
}
