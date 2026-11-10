'use client'

import * as React from 'react'

/**
 * useCoverClip — a recorded clip laid over a cover's rest frame, played
 * only while the card is awake.
 *
 *   The same contract as StarrySequencerCover, for a <video>: awake means
 *   hovered (fine pointers), focused (keyboard), or, on touch, holding the
 *   playground grid's spotlight (data-cover-awake). Reduced motion never
 *   wakes it.
 *
 *   The <video> is rendered with no src and gets one the first time the
 *   card wakes, so a visitor who never hovers never fetches the clip.
 *
 *   `clip` is for the cover's CSS (as a data attribute):
 *     rest     the clip is hidden; the rest frame shows
 *     showing  the clip has frames and is playing; fade it in
 *     failed   the clip could not be loaded; the cover is on its own
 *   It only turns to `showing` once the video is really playing, so the
 *   rest frame holds while the bytes are in flight and nothing flashes
 *   black. Asleep, the clip fades out for `fadeOutMs` and then rewinds, so
 *   every wake starts on the same frame.
 *
 *   `leadMs` and `startAt` are for a cover that plays something of its own
 *   first: the clip is fetched as soon as the card wakes, but only starts,
 *   from `startAt` seconds in, once the card has been awake for `leadMs`.
 */

export type CoverClipState = 'rest' | 'showing' | 'failed'

export type CoverClipOptions = {
  /** How long the cover's CSS takes to fade the clip out. */
  fadeOutMs: number
  /** How long the card is awake before the clip starts. Default 0. */
  leadMs?: number
  /** Where in the clip each wake starts, in seconds. Default 0. */
  startAt?: number
}

export function useCoverClip(
  src: string,
  { fadeOutMs, leadMs = 0, startAt = 0 }: CoverClipOptions
) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [clip, setClip] = React.useState<CoverClipState>('rest')

  React.useEffect(() => {
    const root = rootRef.current
    const video = videoRef.current
    if (!root || !video) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const hoverTarget = root.closest('.group') ?? root

    let awake = false
    let failed = false
    let lead: number | undefined
    let rewind: number | undefined

    const start = () => {
      // Before the metadata is in, this sets where playback will begin.
      video.currentTime = startAt
      // Rejects if a quick leave pauses it first; nothing to do about that.
      void video.play().catch(() => undefined)
    }
    const play = () => {
      // Already awake: hover and focus together must not restart the lead.
      if (reduceMotion.matches || failed || awake) return
      awake = true
      window.clearTimeout(rewind)
      // The lazy src: the first wake is what fetches the clip. With a lead,
      // `auto` lets it load while the cover plays its own opening.
      if (!video.getAttribute('src')) {
        video.preload = 'auto'
        video.src = src
      }
      if (!video.paused) {
        // Woken again before the rewind: still playing, so no `playing`
        // event is coming. Pick the clip back up where it is.
        setClip('showing')
      } else if (leadMs > 0) {
        lead = window.setTimeout(start, leadMs)
      } else {
        start()
      }
    }
    const stop = () => {
      awake = false
      window.clearTimeout(lead)
      if (failed) return
      setClip('rest')
      window.clearTimeout(rewind)
      rewind = window.setTimeout(() => {
        video.pause()
        if (video.readyState > 0) video.currentTime = startAt
      }, fadeOutMs)
    }
    const onPlaying = () => {
      if (awake) setClip('showing')
    }
    const onError = () => {
      failed = true
      setClip('failed')
    }
    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', onError)

    // Hover drives playback on pointer devices...
    const cell = root.closest<HTMLElement>('[data-cover-cell]')
    let attributes: MutationObserver | undefined
    if (canHover.matches) {
      hoverTarget.addEventListener('pointerenter', play)
      hoverTarget.addEventListener('pointerleave', stop)
    } else if (cell) {
      // ...and on touch the playground grid spotlights one cover at a time
      // (data-cover-awake — pages/playground/index.tsx).
      const sync = () => ('coverAwake' in cell.dataset ? play() : stop())
      attributes = new MutationObserver(sync)
      attributes.observe(cell, {
        attributes: true,
        attributeFilter: ['data-cover-awake']
      })
      sync()
    }
    // Focus drives it everywhere, for keyboard.
    hoverTarget.addEventListener('focusin', play)
    hoverTarget.addEventListener('focusout', stop)

    return () => {
      window.clearTimeout(lead)
      window.clearTimeout(rewind)
      attributes?.disconnect()
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', onError)
      hoverTarget.removeEventListener('pointerenter', play)
      hoverTarget.removeEventListener('pointerleave', stop)
      hoverTarget.removeEventListener('focusin', play)
      hoverTarget.removeEventListener('focusout', stop)
      video.pause()
    }
  }, [src, fadeOutMs, leadMs, startAt])

  return { rootRef, videoRef, clip }
}
