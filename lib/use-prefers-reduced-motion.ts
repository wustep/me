import * as React from 'react'

/**
 * Reactively read the user's `prefers-reduced-motion` preference.
 *
 *   Returns `true` when the OS-level setting is "reduce" so callers can
 *   conditionally disable nonessential animations / transitions.
 */
export function usePrefersReducedMotion() {
  const [prefers, setPrefers] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefers(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setPrefers(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return prefers
}
