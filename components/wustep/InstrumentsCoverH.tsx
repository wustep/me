'use client'

import { InstrumentsCover } from './InstrumentsCover'
import styles from './InstrumentsCoverH.module.css'
import { useCoverClip } from './useCoverClip'

/**
 * InstrumentsCoverH — the hybrid: the live line drawing first, then the
 * app's 3D view on video.
 * Unshipped variant, kept for the covers-preview workbench.
 *
 *   At rest this is InstrumentsCover exactly: the picker in vector lines,
 *   the cello picked and bowed. Awake, it plays in two stages:
 *
 *     0.00s  the drawing's own walk, live: cello, flute, trumpet, 0.85s
 *            each, while the clip loads behind it
 *     2.55s  the walk picks the grand
 *     2.75s  the drawn grand dissolves into the 3D grand: the clip, a
 *            recording of the app's 3D view, starts on its grand shot
 *     3.27s  the clip has the frame, and carries on round its loop:
 *            upright, violin, viola, cello, flute, trumpet, grand
 *
 *   So the picker picks an instrument and it turns into the real thing.
 *   The drawing is never held: if the clip is late it keeps walking and
 *   the dissolve comes when the clip does (on whatever is picked by
 *   then), and if the clip can't be loaded the walk is the whole cover,
 *   as shipped.
 *
 *   Load: nothing but the SVG until the card first wakes, then the clip
 *   (280 KB), fetched during the walk. No still is needed.
 */

const CLIP = '/playground/covers/instruments-3d.mp4'

/**
 * The walk reaches the grand after three 0.85s turns (2.55s) and leaves
 * it at 3.4s. The dissolve starts 0.2s into that turn, so the drawn grand
 * is seen first, and its 520ms are over before the walk would move on.
 */
const LEAD_MS = 2750

/**
 * Where the clip's grand shot begins: the fourth of its 1.2s shots, the
 * dissolve into it done.
 */
const START_AT = 3.6

/** Matches the fade-out in the stylesheet: rewind once the clip is hidden. */
const FADE_OUT_MS = 320

export function InstrumentsCoverH() {
  const { rootRef, videoRef, clip } = useCoverClip(CLIP, {
    fadeOutMs: FADE_OUT_MS,
    leadMs: LEAD_MS,
    startAt: START_AT
  })

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
