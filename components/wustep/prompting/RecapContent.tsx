import Link from 'next/link'
import * as React from 'react'

import { ChapterBody } from './ChapterBody'
import { Bracket, Group, Op } from './EquationDemo'

import styles from './PromptingPage.module.css'

export function RecapContent() {
  return (
    <ChapterBody>
      <p>
        Five reminders before you go. Skim this on the way out, or save it
        for later when something feels off.
      </p>

      <RecapItem index={1} title='The equation' href='/prompting/equation'>
        <RecapEquationViz />
        <p>
          When the output disappoints, walk the four levers. Better tool.
          Better model. Better prompt. Better context. The biggest unlock
          is almost always context.
        </p>
      </RecapItem>

      <RecapItem index={2} title='The tree' href='/prompting/tree'>
        <RecapTreeViz />
        <p>
          Every change lives somewhere on a 2D map: <em>breadth</em> (which
          area of code) × <em>depth</em> (how zoomed in). At any node,
          three moves: <strong>ask</strong>, <strong>plan</strong>,{' '}
          <strong>delegate</strong>. Most non-trivial work moves through
          all three.
        </p>
      </RecapItem>

      <RecapItem
        index={3}
        title='The colleague'
        href='/prompting/colleague'
      >
        <RecapColleagueViz />
        <p>
          Treat the agent as a colleague &mdash; a fast, knowledgeable
          junior who only sees what you&apos;ve shown them. The discipline
          gets <em>more</em> important, not less, as the models get
          smarter.
        </p>
      </RecapItem>

      <RecapItem
        index={4}
        title='Techniques'
        href='/prompting/techniques'
      >
        <p className={styles.recapTechniquesIntro}>
          Eight moves worth practicing &mdash;
        </p>
        <ul className={styles.recapList}>
          <li>What questions should you ask me before starting?</li>
          <li>What&apos;s the smallest version of this that ships?</li>
          <li>Give me 3 options, rank them, name the trade-offs.</li>
          <li>Argue against your last suggestion.</li>
          <li>What did you skip?</li>
          <li>How would a senior engineer review this?</li>
          <li>
            Match the style of <code>components/PostCard.tsx</code>.
          </li>
          <li>Update CLAUDE.md with what you just learned.</li>
        </ul>
      </RecapItem>

      <div className={styles.synthesis}>
        <h3 className={styles.synthesisHeading}>
          <span className={styles.synthesisSymbol} aria-hidden='true'>
            ✦
          </span>
          One more thing
        </h3>
        <p>
          We&apos;re all early in this. Three years in. Maybe 1200 ELO. The
          next 1200 is wide open &mdash; and the most useful thing you can
          do is keep paying attention while everyone else assumes
          they&apos;ve figured it out.
        </p>
        <p>
          Thanks for reading. Go talk to a machine.
        </p>
      </div>
    </ChapterBody>
  )
}

function RecapItem({
  index,
  title,
  href,
  children
}: {
  index: number
  title: string
  href: string
  children: React.ReactNode
}) {
  return (
    <section className={styles.recapItem}>
      <header className={styles.recapHeader}>
        <span className={styles.recapIndex} aria-hidden='true'>
          {String(index).padStart(2, '0')}
        </span>
        <Link href={href} className={styles.recapTitle}>
          {title}
          <span className={styles.recapTitleArrow} aria-hidden='true'>
            →
          </span>
        </Link>
      </header>
      <div className={styles.recapBody}>{children}</div>
    </section>
  )
}

function RecapEquationViz() {
  return (
    <div className={styles.recapEquationViz} aria-hidden='true'>
      <Group>
        <Bracket>(</Bracket>
        <span className={`${styles.recapToken} ${styles.recapTokenLever}`}>
          TOOL
        </span>
        <Op subtle>+</Op>
        <span className={`${styles.recapToken} ${styles.recapTokenLever}`}>
          MODEL
        </span>
        <Bracket>)</Bracket>
      </Group>
      <Op>×</Op>
      <Group>
        <Bracket>(</Bracket>
        <span className={`${styles.recapToken} ${styles.recapTokenLever}`}>
          PROMPT
        </span>
        <Op subtle>+</Op>
        <span className={`${styles.recapToken} ${styles.recapTokenLever}`}>
          CONTEXT
        </span>
        <Bracket>)</Bracket>
      </Group>
      <Op>→</Op>
      <span className={`${styles.recapToken} ${styles.recapTokenOutput}`}>
        OUTPUT
      </span>
    </div>
  )
}

function RecapTreeViz() {
  // 4 columns × 3 rows. The (mid · UX) cell is "active"; cells on either
  // axis get a faint tint to evoke the crosshair from the tree demo.
  const ROWS = 3
  const COLS = 4
  const ACTIVE = { row: 1, col: 0 }

  return (
    <div className={styles.recapTreeViz} aria-hidden='true'>
      <div className={styles.recapTreeGrid}>
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((__, c) => {
            const isActive = r === ACTIVE.row && c === ACTIVE.col
            const onAxis =
              !isActive && (r === ACTIVE.row || c === ACTIVE.col)
            return (
              <span
                key={`${r}-${c}`}
                className={`${styles.recapTreeCell} ${isActive ? styles.recapTreeCellActive : ''} ${onAxis ? styles.recapTreeCellOnAxis : ''}`}
              />
            )
          })
        )}
      </div>
      <div className={styles.recapTreeMoves}>
        <span>ask</span>
        <span className={styles.recapTreeMovesActive}>plan</span>
        <span>delegate</span>
      </div>
    </div>
  )
}

function RecapColleagueViz() {
  return (
    <div className={styles.recapColleagueViz} aria-hidden='true'>
      <span className={styles.recapColleagueStep}>Onboard</span>
      <span className={styles.recapColleagueArrow}>→</span>
      <span className={styles.recapColleagueStep}>Brief</span>
      <span className={styles.recapColleagueArrow}>→</span>
      <span className={styles.recapColleagueStep}>Review</span>
    </div>
  )
}
