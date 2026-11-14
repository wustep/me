import * as React from 'react'

import { faviconForPose, type TurtlePose } from '@/lib/shy-favicon'

// How long after you come back the head pokes out, and then the legs.
const PEEK_AFTER_MS = 450
const STAND_AFTER_MS = 1100

function setPose(pose: TurtlePose) {
  // Looked up each time rather than cached: a page may add its own icons.
  for (const link of document.querySelectorAll<HTMLLinkElement>(
    'link[rel~="icon"]'
  )) {
    const awakeHref = link.dataset.awakeHref ?? link.getAttribute('href')
    if (!awakeHref) continue
    const href = faviconForPose(pose, awakeHref, link.getAttribute('sizes'))
    if (!href) continue
    if (pose === 'awake') {
      delete link.dataset.awakeHref
    } else {
      link.dataset.awakeHref = awakeHref
    }
    if (link.getAttribute('href') !== href) link.setAttribute('href', href)
  }
}

/**
 * Tucks the favicon turtle into its shell while the tab is hidden. On return
 * the head peeks out first and then it stands back up, slowly enough to catch
 * in the tab strip. Renders nothing and does nothing until the tab is first
 * hidden.
 *
 * Reduced motion skips the peek, so coming back is a single swap.
 */
export function ShyFavicon() {
  React.useEffect(() => {
    let timers: Array<ReturnType<typeof setTimeout>> = []
    const clearTimers = () => {
      for (const timer of timers) clearTimeout(timer)
      timers = []
    }

    const onVisibilityChange = () => {
      clearTimers()
      if (document.visibilityState === 'hidden') {
        setPose('tucked')
        // Warm the in-between frame so the peek is on time when you return.
        new Image().src = faviconForPose('peek', '/favicon-32x32.png')!
        return
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setPose('awake')
        return
      }
      timers = [
        setTimeout(() => setPose('peek'), PEEK_AFTER_MS),
        setTimeout(() => setPose('awake'), STAND_AFTER_MS)
      ]
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      clearTimers()
      setPose('awake')
    }
  }, [])

  return null
}
