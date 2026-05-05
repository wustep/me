import styles from './DominoCover.module.css'

export function DominoCover() {
  return (
    <div className={styles.cover}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.wordmark} aria-hidden='true'>
        <span>DOM</span>
        <span className={styles.ino}>ino</span>
      </div>
      <span className={styles.srOnly}>DOM-ino physics text layout</span>
    </div>
  )
}
