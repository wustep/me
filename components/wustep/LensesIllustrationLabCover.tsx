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
            <rect
              className={styles.gaugePlate}
              x='20'
              y='18'
              width='60'
              height='64'
              rx='8'
            />
            <path
              className={styles.gaugeRail}
              d='M 34 26 V 76'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
            <g className={styles.gaugeTicks}>
              <line x1='34' y1='32' x2='50' y2='32' />
              <line x1='34' y1='42' x2='46' y2='42' />
              <line x1='34' y1='52' x2='52' y2='52' />
              <line x1='34' y1='62' x2='46' y2='62' />
              <line x1='34' y1='72' x2='50' y2='72' />
            </g>
            <g className={styles.gaugeProbe}>
              <line
                x1='64'
                y1='24'
                x2='64'
                y2='51'
                stroke='currentColor'
                strokeWidth='3'
                strokeLinecap='round'
              />
              <polygon points='64,61 57,49 71,49' fill='var(--cover-accent)' />
            </g>
            <g className={styles.gaugeTarget}>
              <line
                x1='28'
                y1='52'
                x2='76'
                y2='52'
                stroke='var(--cover-accent)'
                strokeWidth='3'
                strokeLinecap='round'
              />
              <circle cx='34' cy='52' r='4' fill='var(--cover-accent)' />
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
