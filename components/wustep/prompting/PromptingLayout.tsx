import Link from 'next/link'
import * as React from 'react'
import BodyClassName from 'react-body-classname'

import { LabsButton } from '@/components/wustep/LabsButton'
import { ThemeToggle } from '@/components/wustep/ThemeToggle'
import { useDarkMode } from '@/lib/use-dark-mode'

import { TOTAL_CHAPTERS } from './constants'
import type { ChapterMeta } from './types'

import styles from './PromptingPage.module.css'

/**
 * PromptingLayout — chrome that wraps every chapter page.
 *
 *   Provides the shared header (back-to-home + theme toggle), notion
 *   body class, and chapter-aware top/bottom rails (header with
 *   chapter index, footer with prev/next nav).
 */
export function PromptingLayout({
  chapter,
  children
}: {
  chapter?: ChapterMeta
  children: React.ReactNode
}) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <>
      <BodyClassName className={isDarkMode ? 'notion dark-mode' : 'notion'} />

      <div className={styles.frame}>
        <header className='notion-header'>
          <div className='notion-nav-header'>
            <Link
              href='/'
              className={styles.homeBackButton}
              aria-label='Back to home'
            >
              <span className={styles.homeBackArrow}>←</span>
            </Link>

            <div className='notion-nav-header-rhs breadcrumbs'>
              <LabsButton className='breadcrumb button' />
              <ThemeToggle
                isDark={hasMounted ? isDarkMode : false}
                onToggle={toggleDarkMode}
                className='breadcrumb button'
              />
            </div>
          </div>
        </header>

        <main className={styles.page}>
          {chapter && <ChapterHeader chapter={chapter} />}
          {children}
          {chapter && <ChapterNav chapter={chapter} />}
        </main>
      </div>
    </>
  )
}

function ChapterHeader({ chapter }: { chapter: ChapterMeta }) {
  return (
    <header className={styles.chapterHeader}>
      <Link href='/prompting' className={styles.chapterParentTitle}>
        How to talk to coding agents
      </Link>
      <div className={styles.chapterMeta}>
        <span className={styles.chapterMetaIndex}>
          Chapter {String(chapter.index).padStart(2, '0')}
        </span>
        <span className={styles.chapterMetaSep}>of</span>
        <span className={styles.chapterMetaTotal}>
          {String(TOTAL_CHAPTERS).padStart(2, '0')}
        </span>
      </div>
      <h1 className={styles.chapterTitle}>{chapter.title}</h1>
    </header>
  )
}

function ChapterNav({ chapter }: { chapter: ChapterMeta }) {
  return (
    <nav className={styles.chapterNav} aria-label='Chapter navigation'>
      <div className={styles.chapterNavSlot}>
        {chapter.prevHref && chapter.prevLabel && (
          <Link href={chapter.prevHref} className={styles.chapterNavLink}>
            <span className={styles.chapterNavArrow} aria-hidden='true'>
              ←
            </span>
            <span className={styles.chapterNavBody}>
              <span className={styles.chapterNavDirection}>Previous</span>
              <span className={styles.chapterNavLabel}>
                {chapter.prevLabel}
              </span>
            </span>
          </Link>
        )}
      </div>
      <div className={styles.chapterNavSlot}>
        {chapter.nextHref && chapter.nextLabel && (
          <Link
            href={chapter.nextHref}
            className={`${styles.chapterNavLink} ${styles.chapterNavLinkNext}`}
          >
            <span className={styles.chapterNavBody}>
              <span className={styles.chapterNavDirection}>Next</span>
              <span className={styles.chapterNavLabel}>
                {chapter.nextLabel}
              </span>
            </span>
            <span className={styles.chapterNavArrow} aria-hidden='true'>
              →
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}
