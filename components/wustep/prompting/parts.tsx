import * as React from 'react'

import styles from './PromptingPage.module.css'

/**
 * Lever — a labeled section with a heading + tagline + body. Used across
 * chapters to break content into clearly-named "moves" the reader can
 * pull (e.g. TOOL, MODEL, ASK, BRIEFING).
 */
export function Lever({
  name,
  tagline,
  children
}: {
  name: string
  tagline: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.leverSection}>
      <div className={styles.leverHeading}>
        <span className={styles.leverHeadingName}>{name}</span>
        <span className={styles.leverHeadingDivider} aria-hidden='true' />
        <span className={styles.leverHeadingTagline}>{tagline}</span>
      </div>
      <div className={styles.leverBody}>{children}</div>
    </div>
  )
}

/**
 * ExamplePrompt — a quoted example prompt card with a "from the wild"
 * label and a short attribution / note below.
 */
export function ExamplePrompt({ note, text }: { note: string; text: string }) {
  return (
    <figure className={styles.examplePrompt}>
      <div className={styles.examplePromptCard}>
        <span className={styles.examplePromptLabel}>From the wild</span>
        <p className={styles.examplePromptText}>{text}</p>
      </div>
      <figcaption className={styles.examplePromptNote}>{note}</figcaption>
    </figure>
  )
}
