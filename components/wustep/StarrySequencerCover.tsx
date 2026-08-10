'use client'

import * as React from 'react'

import { useCoverPlayback } from './useCoverPlayback'

/**
 * StarrySequencerCover
 *
 *   The cover is a still poster at rest and animates while the card is played
 *   (hover on pointer devices, on-screen on touch — see useCoverPlayback).
 *   Animated WebP can't be paused via the DOM, so we swap the <img> src:
 *   poster ⇄ animated WebP. Re-assigning the animated src restarts it from
 *   the first frame, so each play runs the loop fresh. Honors reduced motion
 *   by staying on the poster.
 */

const POSTER = '/playground/covers/starry-sequencer-poster.webp'
const ANIMATED = '/playground/covers/starry-sequencer.webp'

export function StarrySequencerCover() {
  const imgRef = React.useRef<HTMLImageElement>(null)

  useCoverPlayback(imgRef, {
    onPlay: () => {
      if (imgRef.current) imgRef.current.src = ANIMATED
    },
    onStop: () => {
      if (imgRef.current) imgRef.current.src = POSTER
    }
  })

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
