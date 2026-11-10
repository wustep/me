'use client'

import { InstrumentsCover } from './InstrumentsCover'
import styles from './InstrumentsCoverH.module.css'
import { INSTRUMENTS_CLIP } from './InstrumentsCoverV'
import { useCoverClip } from './useCoverClip'

/**
 * InstrumentsCoverH — the hybrid: the live line drawing at rest, the
 * app's 3D view on video while awake.
 * Unshipped variant, kept for the covers-preview workbench.
 *
 *   At rest this is InstrumentsCover exactly: the picker in vector lines,
 *   the cello picked and bowed. Awake, the drawing dissolves into the
 *   same clip InstrumentsCoverV plays, which opens on the 3D cello: the
 *   diagram turns into the thing, then the other six follow.
 *
 *   The drawing is held on its rest frame while the clip is in charge, so
 *   the dissolve starts from the cello and not from wherever the picker's
 *   own walk had got to. If the clip can't be loaded the hold is dropped
 *   and the drawing animates as the shipped cover does.
 *
 *   Load: nothing but the SVG until the card first wakes, then the clip
 *   (310 KB); the drawing stays up until the video is really playing. No
 *   still is needed.
 */

/** Matches the fade-out in the stylesheet: rewind once the clip is hidden. */
const FADE_OUT_MS = 320

export function InstrumentsCoverH() {
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
      <div className={styles.rest}>
        <InstrumentsCover />
      </div>
      <video
        ref={videoRef}
        className={styles.clip}
        muted
        loop
        playsInline
        preload='none'
        tabIndex={-1}
      />
    </div>
  )
}
