'use client'

import styles from './InstrumentsCover.module.css'
import { useCoverClip } from './useCoverClip'

/**
 * InstrumentsCover — the tour: the app changing looks, on video.
 *
 *   One clip recorded from the live app, its instruments playing
 *   throughout, driven through its own style and view toggles. One path,
 *   bowed strings high to low, then the piano, then the trumpet:
 *
 *     vector lines, 2D   violin, viola, cello
 *     painted, 2D        cello, grand, trumpet
 *     3D                 trumpet, grand, violin
 *
 *   Each look hands over on the instrument the two share, so what changes
 *   across the dissolve is the look: the cello's lines fill in with paint
 *   in place (the two 2D styles draw to one layout), the painted trumpet
 *   turns into the 3D one, and the 3D violin dissolves back into the
 *   vector violin the clip opens on. 1.25s a shot; 0.3s dissolves inside
 *   a look, 0.6s between looks and across the loop point; 14.9s.
 *
 *   At rest a still of the vector-lines violin, bowed: the clip's first
 *   frame, so the hand-over from still to clip can't be seen and the
 *   short fades only cover the rewind on the way out. Both are 1752×380
 *   (4.6:1), as wide as the widest card at the cover's fixed 190px height
 *   and twice its pixels, and every instrument, whole bow included, sits
 *   inside their centre 840px: `object-fit: cover` crops the wings on a
 *   narrower card, and down to the narrowest (420px) those are only
 *   ground.
 *
 *   Load: the still (7 KB) comes with the card, lazily. The clip
 *   (608 KB) is fetched the first time the card wakes; see useCoverClip.
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
