import { Illustration } from './lenses/illustrations'
import styles from './LensesCover.module.css'

/**
 * LensesCover
 *
 *   Cover image for the Lenses playground entry. Reuses the same
 *   `lenses-deck` SVG illustration as the main Lenses card so the cover
 *   reads as a direct sample of the page itself.
 */

export function LensesCover() {
  return (
    <div className={styles.cover}>
      <span className={styles.art} aria-hidden='true'>
        <Illustration
          id='lenses-deck'
          fg='#F6EAD8'
          bg='#222226'
          accent='#F0A85A'
        />
      </span>
    </div>
  )
}
