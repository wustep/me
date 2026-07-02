import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import BodyClassName from 'react-body-classname'

import { LabsButton } from '@/components/wustep/LabsButton'
import { ThemeToggle } from '@/components/wustep/ThemeToggle'
import { useDarkMode } from '@/lib/use-dark-mode'

import type { ChapterMeta } from './types'
import { CHAPTERS, TOTAL_CHAPTERS } from './constants'
import { manualMono, manualSans } from './fonts'
import { TocIcon } from './icons'
import styles from './PromptingPage.module.css'

/**
 * PromptingLayout — chrome that wraps every chapter page.
 *
 *   Provides the shared header (back-to-home + theme toggle), notion
 *   body class, and the manual's running rails: a ruled folio head with
 *   the guide title + chapter mark, a chapter opener plate, and a ruled
 *   prev/next footer.
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

      <div
        className={`${styles.frame} ${manualSans.variable} ${manualMono.variable}`}
      >
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

        <TableOfContents />
      </div>
    </>
  )
}

/**
 * TableOfContents — fixed-position icon in the upper-right of the
 * viewport that reveals the CONTENTS panel on hover/focus. Hidden on
 * narrower viewports via CSS (no room beside the centered page).
 */
function TableOfContents() {
  const router = useRouter()
  const currentPath = router.asPath.split(/[?#]/)[0]

  return (
    <div className={styles.toc}>
      <button
        type='button'
        className={styles.tocTrigger}
        aria-label='Table of contents'
        aria-haspopup='true'
      >
        <TocIcon className={styles.tocIcon} />
      </button>
      <div className={styles.tocPanel} role='menu'>
        <div className={styles.tocPanelHeader}>Contents</div>
        <ol className={styles.tocList}>
          {CHAPTERS.map((c) => {
            const isCurrent = c.href === currentPath
            return (
              <li key={c.href} className={styles.tocItem}>
                <Link
                  href={c.href}
                  className={
                    isCurrent
                      ? `${styles.tocLink} ${styles.tocLinkCurrent}`
                      : styles.tocLink
                  }
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  <span className={styles.tocIndex}>
                    {String(c.index).padStart(2, '0')}
                  </span>
                  <span className={styles.tocTitle}>{c.title}</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

/**
 * ChapterHeader — the manual's folio head + chapter opener plate.
 * A double-ruled running head carries the guide title and the chapter
 * mark; below it, a large vermillion chapter numeral and the title.
 */
function ChapterHeader({ chapter }: { chapter: ChapterMeta }) {
  return (
    <header className={styles.chapterHeader}>
      <div className={styles.folio}>
        <Link href='/prompting' className={styles.folioTitle}>
          How to talk to coding agents
        </Link>
        <span className={styles.folioMark}>
          CH.&nbsp;{String(chapter.index).padStart(2, '0')}&thinsp;/&thinsp;
          {String(TOTAL_CHAPTERS).padStart(2, '0')}
        </span>
      </div>
      <div className={styles.chapterPlate}>
        <span className={styles.chapterNumeral} aria-hidden='true'>
          {chapter.index}
        </span>
        <h1 className={styles.chapterTitle}>{chapter.title}</h1>
      </div>
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
        {chapter.nextHref &&
          chapter.nextLabel &&
          (chapter.nextKind === 'restart' ? (
            <Link
              href={chapter.nextHref}
              className={styles.chapterNavRestart}
              aria-label={`Restart: ${chapter.nextLabel}`}
            >
              <RestartIcon className={styles.chapterNavRestartIcon} />
              <span className={styles.chapterNavRestartLabel}>
                {chapter.nextLabel}
              </span>
            </Link>
          ) : (
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
          ))}
      </div>
    </nav>
  )
}

/**
 * RestartIcon — circular arrow used by the Recap chapter's "Restart"
 * pill. Rotates continuously at a slow, almost-ignorable pace, and
 * speeds up on hover via CSS.
 */
function RestartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width='14'
      height='14'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M3 12a9 9 0 1 0 3-6.7' />
      <path d='M3 4v5h5' />
    </svg>
  )
}
