import * as React from 'react'

/**
 * useInView — observe an element and report when it intersects the
 * viewport. Once seen, the observer disconnects (one-shot).
 *
 *   Useful for kicking off entrance animations only when the element
 *   actually scrolls into view.
 */
export function useInView<T extends HTMLElement>(
  opts?: IntersectionObserverInit
) {
  const ref = React.useRef<T>(null)
  const [inView, setInView] = React.useState(false)
  const optsRef = React.useRef(opts)
  optsRef.current = opts

  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3, ...optsRef.current }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return [ref, inView] as const
}
