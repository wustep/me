'use client'

import styles from './InstrumentsCoverV.module.css'
import { useCoverClip } from './useCoverClip'

/**
 * InstrumentsCoverV — the recording: the app's 3D view, on video.
 * Unshipped variant, kept for the covers-preview workbench.
 *
 *   At rest a still of the app's 3D cello under its spotlight, bow on the
 *   string. Awake, a clip recorded from the app plays: its seven
 *   instruments in the picker's order (cello, flute, trumpet, grand,
 *   upright, violin, viola), each playing as the camera drifts round it,
 *   dissolving one into the next, 1.2s each on an 8.4s loop.
 *
 *   The still is the clip's first frame, so the hand-over from one to the
 *   other can't be seen; the short fades only cover the rewind on the way
 *   out. Both are 1752×380 (4.6:1), as wide as the widest card at the
 *   cover's fixed 190px height and twice its pixels, with the instrument
 *   in the middle 800px: `object-fit: cover` crops the empty wings on a
 *   narrower card and never the instrument.
 *
 *   Load: the still (7 KB) comes with the card, lazily. The clip (310 KB)
 *   is fetched the first time the card wakes; see useCoverClip.
 */

export const INSTRUMENTS_CLIP = '/playground/covers/instruments-3d.mp4'
const POSTER = '/playground/covers/instruments-3d-poster.webp'

/** Matches the fade-out in the stylesheet: rewind once the clip is hidden. */
const FADE_OUT_MS = 240

export function InstrumentsCoverV() {
  const { rootRef, videoRef, clip } = useCoverClip(
    INSTRUMENTS_CLIP,
    FADE_OUT_MS
  )

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
