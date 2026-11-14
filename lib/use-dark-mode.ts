import useDarkModeImpl from '@fisch0920/use-dark-mode'
import * as React from 'react'
import { flushSync } from 'react-dom'

/**
 * Where the next theme switch should spread from, in viewport pixels.
 * ThemeToggle sets this around its click so the new theme grows out of the
 * sun or moon that was pressed; anything else that toggles the theme leaves
 * it unset and gets the plain cross-fade.
 */
let revealOrigin: { x: number; y: number } | null = null

export function setThemeRevealOrigin(element: Element | null) {
  if (!element) {
    revealOrigin = null
    return
  }
  const rect = element.getBoundingClientRect()
  revealOrigin = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
}

/**
 * Point the reveal keyframes in styles/wustep.css at `origin`: a circle
 * centred there, growing until it covers the farthest corner of the viewport.
 * Returns a cleanup that puts the root back as it was.
 */
function armThemeReveal(origin: { x: number; y: number }) {
  const root = document.documentElement
  const radius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y)
  )
  root.style.setProperty('--theme-reveal-x', `${origin.x}px`)
  root.style.setProperty('--theme-reveal-y', `${origin.y}px`)
  root.style.setProperty('--theme-reveal-radius', `${Math.ceil(radius)}px`)
  root.dataset.themeReveal = ''
  return () => {
    delete root.dataset.themeReveal
    root.style.removeProperty('--theme-reveal-x')
    root.style.removeProperty('--theme-reveal-y')
    root.style.removeProperty('--theme-reveal-radius')
  }
}

export function useDarkMode() {
  const darkMode = useDarkModeImpl(false, { classNameDark: 'dark-mode' })
  const { toggle } = darkMode

  // Switch the whole page between themes as one view transition. The old
  // per-element 0.5s background fade left text colors switching instantly, so
  // muted text vanished against half-faded backgrounds mid-toggle. A toggle
  // pressed through ThemeToggle reveals the new theme in a circle growing out
  // of the button; any other caller cross-fades. Browsers without view
  // transitions, and reduced motion, switch instantly.
  const toggleDarkMode = React.useCallback(() => {
    // Read now: ThemeToggle clears the origin as soon as this call returns.
    const origin = revealOrigin
    if (
      typeof document.startViewTransition !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      toggle()
      return
    }

    const disarm = origin ? armThemeReveal(origin) : undefined
    const transition = document.startViewTransition(async () => {
      // The hook applies these classes in an effect; apply them now so the
      // incoming snapshot is already in the new theme.
      const next = !document.body.classList.contains('dark-mode')
      document.body.classList.toggle('dark-mode', next)
      document.body.classList.toggle('light-mode', !next)
      flushSync(toggle)
      // Let the other hook instances (NotionRenderer, the header icon) commit.
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
    // `finished` settles whether the transition ran, was skipped or threw.
    if (disarm) void transition.finished.then(disarm, disarm)
  }, [toggle])

  return {
    isDarkMode: darkMode.value,
    toggleDarkMode
  }
}
