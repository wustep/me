import type * as React from 'react'

import { BODY_BASE_DELAY_MS, BODY_STAGGER_MS } from './constants'

export type ChapterMeta = {
  index: 1 | 2 | 3 | 4 | 5
  title: string
  prevHref?: string
  prevLabel?: string
  nextHref?: string
  nextLabel?: string
}

/**
 * `bodyDelay(i)` returns the inline `transitionDelay` style for the i-th
 * body item below the intro title — used to stagger entrance animations
 * after the title settles.
 */
export function bodyDelay(index: number): React.CSSProperties {
  return {
    transitionDelay: `${BODY_BASE_DELAY_MS + index * BODY_STAGGER_MS}ms`
  }
}
