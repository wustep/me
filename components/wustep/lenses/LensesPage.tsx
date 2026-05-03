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
import { LENS_BY_ID } from './registry'
import { SidePanel } from './SidePanel'
import { type LensesPageProps } from './types'

import styles from './LensesPage.module.css'

/**
 * LensesPage — top-level Lenses experience.
 *
 *   When `embedded` is true, the page renders only the canvas + portaled
 *   panels and skips its own header / theme toggle / body classes. Use
 *   this when mounting `<LensesPage embedded />` inside another chrome
 *   (e.g. `PlaygroundLayout`).
 */
export function LensesPage({ embedded = false }: LensesPageProps = {}) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [hasMounted, setHasMounted] = React.useState(false)
  const [openLensId, setOpenLensId] = React.useState<string | null>(null)
  const [centerOpen, setCenterOpen] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

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
                <span className={styles.homeBackArrow}>←</span>
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
          mounted={hasMounted}
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
