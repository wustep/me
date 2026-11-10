'use client'

import styles from './InstrumentsCover.module.css'
import { useCoverClip } from './useCoverClip'

/**
 * InstrumentsCover — the tour: the app changing looks, on video.
 *
 *   One clip recorded from the live app, its instruments playing
 *   throughout, driven through its own style and view toggles:
 *
 *     vector lines, 2D   cello, flute, violin
 *     painted, 2D        violin, trumpet, cello
 *     3D                 cello, grand, flute
 *
 *   Each look hands over on an instrument the two share, so what changes
 *   across the dissolve is the look: the violin's lines fill in with
 *   paint in place (the two 2D styles draw to one layout), and the
 *   painted cello stands up into 3D. 1.3s a shot; 0.3s dissolves between
 *   instruments, 0.6s between looks and across the loop point; 11.7s.
 *
 *   At rest a still of the vector-lines cello, bowed: the clip's first
 *   frame, so the hand-over from still to clip can't be seen and the
 *   short fades only cover the rewind on the way out. Both are 1752×380
 *   (4.6:1), as wide as the widest card at the cover's fixed 190px height
 *   and twice its pixels, with the instrument in the middle: `object-fit:
 *   cover` crops the wings on a narrower card. Those are empty down to
 *   about 450px wide; below that the 2D cello and flute, the longest
 *   things in the tour, lose their ends (the cello its scroll and endpin).
 *
 *   Load: the still (21 KB) comes with the card, lazily. The clip
 *   (647 KB) is fetched the first time the card wakes; see useCoverClip.
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
