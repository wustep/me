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
 *   every wake starts on its first frame.
 */

export type CoverClipState = 'rest' | 'showing' | 'failed'

export function useCoverClip(src: string, fadeOutMs: number) {
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
    let rewind: number | undefined

    const play = () => {
      if (reduceMotion.matches || failed) return
      awake = true
      window.clearTimeout(rewind)
      // The lazy src: the first wake is what fetches the clip.
      if (!video.getAttribute('src')) video.src = src
      // Rejects if a quick leave pauses it first; nothing to do about that.
      void video.play().catch(() => undefined)
      // Woken again before the rewind: still playing, so no `playing` event.
      if (!video.paused && video.readyState > 2) setClip('showing')
    }
    const stop = () => {
      awake = false
      if (failed) return
      setClip('rest')
      window.clearTimeout(rewind)
      rewind = window.setTimeout(() => {
        video.pause()
        if (video.readyState > 0) video.currentTime = 0
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
  }, [src, fadeOutMs])

  return { rootRef, videoRef, clip }
}
