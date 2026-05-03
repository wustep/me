'use client'

import Link from 'next/link'
import * as React from 'react'
import BodyClassName from 'react-body-classname'

import { LabsButton } from '@/components/wustep/LabsButton'
import { ThemeToggle } from '@/components/wustep/ThemeToggle'
import { useDarkMode } from '@/lib/use-dark-mode'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

import { Canvas } from './Canvas'
import { CenterDialog } from './CenterDialog'
import styles from './LensesPage.module.css'
import { LENS_BY_ID } from './registry'
import { SidePanel } from './SidePanel'
import { type LensesPageProps, STAGE, type Stage,TIMING } from './types'

/**
 * LensesPage — top-level Lenses experience.
 *
 *   The page drives a single `stage` integer that fans out to children:
 *     stage 0 → mounted but everything hidden (SSR-safe initial state)
 *     stage 1 → canvas faded in
 *     stage 2 → center "Lenses" card scaled into place
 *     stage 3 → surrounding cards staggering in
 *
 *   Reduced motion? We snap straight to the final stage on mount so
 *   nothing animates — but the visual end-state is identical.
 *
 *   When `embedded` is true, the page renders only the canvas + portaled
 *   panels and skips its own header / theme toggle / body classes. Use
 *   this when mounting `<LensesPage embedded />` inside another chrome
 *   (e.g. `PlaygroundLayout`).
 */
export function LensesPage({ embedded = false }: LensesPageProps = {}) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [hasMounted, setHasMounted] = React.useState(false)
  const [stage, setStage] = React.useState<Stage>(STAGE.hidden)
  const [openLensId, setOpenLensId] = React.useState<string | null>(null)
  const [centerOpen, setCenterOpen] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  /* Drive the entrance storyboard. Snap to final stage instantly when
     the user prefers reduced motion. */
  React.useEffect(() => {
    if (!hasMounted) return

    if (prefersReducedMotion) {
      setStage(STAGE.cards)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setStage(STAGE.canvas), TIMING.canvasIn),
      setTimeout(() => setStage(STAGE.center), TIMING.centerIn),
      setTimeout(() => setStage(STAGE.cards), TIMING.cardsInBase)
    ]
    return () => {
      for (const t of timers) clearTimeout(t)
    }
  }, [hasMounted, prefersReducedMotion])

  const openLens = React.useCallback((id: string) => {
    setCenterOpen(false)
    setOpenLensId(id)
  }, [])

  const closeLens = React.useCallback(() => setOpenLensId(null), [])

  const activeLens = openLensId ? (LENS_BY_ID[openLensId] ?? null) : null

  const frameClass = embedded
    ? `${styles.frame} ${styles.frameEmbedded}`
    : styles.frame

  return (
    <>
      {/* Standalone mode owns the body class (notion + dark mode). When
          embedded, the host layout (e.g. PlaygroundLayout) sets these. */}
      {!embedded && (
        <BodyClassName className={isDarkMode ? 'notion dark-mode' : 'notion'} />
      )}

      <div className={frameClass}>
        {!embedded && (
          <header className={styles.header}>
            <div className={styles.headerInner}>
              <Link
                href='/'
                className={styles.homeBackButton}
                aria-label='Back to home'
              >
                <span className={styles.homeBackArrow} aria-hidden='true'>
                  ←
                </span>
              </Link>

              <div className={styles.headerRhs}>
                <LabsButton className={styles.headerButton} />
                <ThemeToggle
                  isDark={hasMounted ? isDarkMode : false}
                  onToggle={toggleDarkMode}
                  className={styles.headerButton}
                />
              </div>
            </div>
          </header>
        )}

        <Canvas
          stage={stage}
          prefersReducedMotion={prefersReducedMotion}
          onOpenCenter={() => setCenterOpen(true)}
          onOpenLens={openLens}
        />
      </div>

      <SidePanel lens={activeLens} onClose={closeLens} onOpenLens={openLens} />

      <CenterDialog
        open={centerOpen}
        onOpenChange={setCenterOpen}
        onOpenLens={openLens}
      />
    </>
  )
}
