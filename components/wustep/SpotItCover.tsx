import styles from './SpotItCover.module.css'

export function SpotItCover() {
  return (
    <div className={styles.cover} aria-hidden='true'>
      <svg
        viewBox='0 0 1214 582'
        preserveAspectRatio='xMidYMid meet'
        className={styles.frame}
      >
        <rect width='1214' height='582' className={styles.backdrop} />
        <image
          href='/playground/covers/spot-it.png'
          width='1214'
          height='582'
          preserveAspectRatio='xMidYMid meet'
        />
        <circle
          cx='408.3'
          cy='241.1'
          r='56'
          pathLength='1'
          className={styles.matchRing}
        />
        <circle
          cx='1072.4'
          cy='186.1'
          r='48'
          pathLength='1'
          className={styles.matchRing}
        />
      </svg>
    </div>
  )
}
