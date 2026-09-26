import useDarkModeImpl from '@fisch0920/use-dark-mode'
import * as React from 'react'
import { flushSync } from 'react-dom'

export function useDarkMode() {
  const darkMode = useDarkModeImpl(false, { classNameDark: 'dark-mode' })
  const { toggle } = darkMode

  // Cross-fade the whole page between themes with a view transition. The old
  // per-element 0.5s background fade left text colors switching instantly, so
  // muted text vanished against half-faded backgrounds mid-toggle. Browsers
  // without view transitions, and reduced motion, switch instantly.
  const toggleDarkMode = React.useCallback(() => {
    if (
      typeof document.startViewTransition !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      toggle()
      return
    }

    document.startViewTransition(async () => {
      // The hook applies these classes in an effect; apply them now so the
      // incoming snapshot is already in the new theme.
      const next = !document.body.classList.contains('dark-mode')
      document.body.classList.toggle('dark-mode', next)
      document.body.classList.toggle('light-mode', !next)
      flushSync(toggle)
      // Let the other hook instances (NotionRenderer, the header icon) commit.
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
  }, [toggle])

  return {
    isDarkMode: darkMode.value,
    toggleDarkMode
  }
}
