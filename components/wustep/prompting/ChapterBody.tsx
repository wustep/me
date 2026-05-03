import * as React from 'react'

import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

import styles from './PromptingPage.module.css'

/**
 * ChapterBody — wraps the body of every chapter to provide a unified
 * fade-in entrance. Honors `prefers-reduced-motion`.
 */
export function ChapterBody({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true)
      return
    }
    const id = window.setTimeout(() => setVisible(true), 200)
    return () => window.clearTimeout(id)
  }, [prefersReducedMotion])

  return (
    <div
      className={`${styles.chapterBody} ${visible ? styles.chapterBodyVisible : ''}`}
    >
      {children}
    </div>
  )
}
