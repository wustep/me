'use client'

import * as React from 'react'

type CoverPlaybackOptions = {
  /** Runs when playback starts — for covers driven by JS rather than CSS. */
  onPlay?: () => void
  /** Runs when playback stops. */
  onStop?: () => void
}

/**
 * Drives a playground cover's animation, marking the cover root with
 * `data-playing` while it runs.
 *
 * Pointer devices play on hover. Touch devices have no hover, and the only
 * tappable thing on a card is its navigation link — so tapping to start an
 * animation also leaves the page. There the cover loops while it is on screen
 * instead. Focus plays everywhere, for keyboards.
 *
 * Stopping rewinds rather than pauses. Covers declare their loop paused at its
 * idle pose and CSS resumes it, so a plain pause freezes the cover on whatever
 * frame it stopped at — mid-blast, with the subject of the picture invisible —
 * and the next hover picks up from there. `data-resetting` blanks the
 * animation for one frame, which restarts the loop at frame 0.
 */
export function useCoverPlayback(
  ref: React.RefObject<HTMLElement | null>,
  { onPlay, onStop }: CoverPlaybackOptions = {}
) {
  const callbacks = React.useRef({ onPlay, onStop })
  callbacks.current = { onPlay, onStop }

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Play off the whole card, so the animation matches the card's own hover
    // state rather than the cover image alone.
    const surface = el.closest('.group') ?? el
    let playing = false

    const play = () => {
      if (playing) return
      playing = true
      el.dataset.playing = ''
      callbacks.current.onPlay?.()
    }

    const stop = () => {
      if (!playing) return
      playing = false
      delete el.dataset.playing
      el.dataset.resetting = ''
      void el.offsetWidth // flush the animation-less frame
      delete el.dataset.resetting
      callbacks.current.onStop?.()
    }

    const cleanups: (() => void)[] = []
    const listen = (type: string, handler: () => void) => {
      surface.addEventListener(type, handler)
      cleanups.push(() => surface.removeEventListener(type, handler))
    }

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      listen('pointerenter', play)
      listen('pointerleave', stop)
    } else {
      const observer = new IntersectionObserver(
        ([entry]) => (entry?.isIntersecting ? play() : stop()),
        { threshold: 0.5 }
      )
      observer.observe(surface)
      cleanups.push(() => observer.disconnect())
    }

    listen('focusin', play)
    listen('focusout', stop)

    return () => {
      for (const cleanup of cleanups) cleanup()
      stop()
    }
  }, [ref])
}
