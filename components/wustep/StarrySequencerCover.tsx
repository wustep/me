'use client'

import * as React from 'react'

/**
 * StarrySequencerCover
 *
 *   The cover is a still poster at rest and animates while hovered (pointer
 *   devices) or focused (tap/keyboard — covers touch, where there's no hover).
 *   Animated WebP can't be paused via the DOM, so we swap the <img> src:
 *   poster ⇄ animated WebP. Re-assigning the animated src restarts it from
 *   the first frame, so each play runs the loop fresh. Honors reduced motion
 *   by staying on the poster.
 */

const POSTER = '/playground/covers/starry-sequencer-poster.webp'
const ANIMATED = '/playground/covers/starry-sequencer.webp'

export function StarrySequencerCover() {
  const imgRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const hoverTarget = img.closest('.group') ?? img

    const play = () => {
      if (reduceMotion.matches) return
      img.src = ANIMATED
    }
    const stop = () => {
      img.src = POSTER
    }

    // Hover drives playback on pointer devices...
    if (canHover.matches) {
      hoverTarget.addEventListener('pointerenter', play)
      hoverTarget.addEventListener('pointerleave', stop)
    }
    // ...and focus drives it everywhere — covers touch, where tapping the card
    // focuses it and there's no hover to trigger the animation.
    hoverTarget.addEventListener('focusin', play)
    hoverTarget.addEventListener('focusout', stop)

    return () => {
      hoverTarget.removeEventListener('pointerenter', play)
      hoverTarget.removeEventListener('pointerleave', stop)
      hoverTarget.removeEventListener('focusin', play)
      hoverTarget.removeEventListener('focusout', stop)
    }
  }, [])

  return (
    <img
      ref={imgRef}
      src={POSTER}
      alt='Starry Night Sequencer cover'
      loading='lazy'
      className='h-full w-full object-cover transition-transform duration-[250ms] ease-out'
    />
  )
}
