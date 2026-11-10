'use client'

import styles from './InstrumentsCover.module.css'
import { useCoverClip } from './useCoverClip'

/**
 * InstrumentsCover — the tour: the app changing looks, on video.
 *
 *   One clip recorded from the live app, its instruments playing slow
 *   lines throughout, driven through its own style and view toggles. One
 *   trumpet walks through the three looks, then the 3D view goes on to
 *   the cello and the grand:
 *
 *     vector lines, 2D   trumpet
 *     painted, 2D        trumpet
 *     3D                 trumpet, cello, grand
 *
 *   The three trumpets are one size in one place and play one phrase, so
 *   across each look's dissolve only the look changes: the lines fill in
 *   with paint, then the painted horn turns into the 3D one. The cello is
 *   a close portrait, scroll to tail the height of the frame, bowing long
 *   slurred strokes; the open grand is the last shot and dissolves back
 *   into the vector trumpet the clip opens on. 1.5s a shot; 0.3s
 *   dissolves inside a look, 0.6s between looks and across the loop
 *   point; 9.9s.
 *
 *   At rest a still of the vector-lines trumpet, playing: the clip's first
 *   frame, so the hand-over from still to clip can't be seen and the
 *   short fades only cover the rewind on the way out. Both are 1752×380
 *   (4.6:1), as wide as the widest card at the cover's fixed 190px height
 *   and twice its pixels, and every instrument (the cello's bow included)
 *   sits inside their centre 840px: `object-fit: cover` crops the wings
 *   on a narrower card, and down to the narrowest (420px) those are only
 *   ground.
 *
 *   Load: the still (11 KB) comes with the card, lazily. The clip
 *   (613 KB) is fetched the first time the card wakes; see useCoverClip.
 */

const CLIP = '/playground/covers/instruments-tour.mp4'
const POSTER = '/playground/covers/instruments-tour-poster.webp'

/** Matches the fade-out in the stylesheet: rewind once the clip is hidden. */
const FADE_OUT_MS = 240

export function InstrumentsCover() {
  const { rootRef, videoRef, clip } = useCoverClip(CLIP, {
    fadeOutMs: FADE_OUT_MS
  })

  return (
    <div
      ref={rootRef}
      className={styles.cover}
      data-clip={clip}
      aria-hidden='true'
    >
      <img className={styles.fill} src={POSTER} alt='' loading='lazy' />
      <video
        ref={videoRef}
        className={`${styles.fill} ${styles.clip}`}
        muted
        loop
        playsInline
        preload='none'
        tabIndex={-1}
      />
    </div>
  )
}
