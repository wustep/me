import * as React from 'react'

import { improvise } from '@/lib/improvise'
import { ringSeconds, scheduleNote } from '@/lib/piano-voice'
import { cn } from '@/lib/utils'

import styles from './PianoPhrase.module.css'

type AudioContextConstructor = typeof AudioContext

function getAudioContext(): AudioContextConstructor | undefined {
  return (
    globalThis.AudioContext ??
    (globalThis as { webkitAudioContext?: AudioContextConstructor })
      .webkitAudioContext
  )
}

/**
 * A phrase of text that plays itself: clicking it improvises a few bars of
 * piano (a new phrase every time, see lib/improvise.ts) and the letters dip
 * like keys as their notes sound, low notes to the left and high to the
 * right.
 *
 * It stays ordinary inline text — it wraps, selects and copies like the
 * sentence around it — so it is a `span` with a button role rather than a
 * `<button>`, which could not break across lines. Sound only ever starts
 * from a click, Enter or Space. Nothing is loaded or created before that.
 */
export function PianoPhrase({
  children,
  className,
  ...props
}: {
  children: string
  className?: string
} & Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>) {
  const keysRef = React.useRef<Array<HTMLSpanElement | null>>([])
  // The context and its limiter are made on the first play and then reused.
  const audioRef = React.useRef<{
    context: AudioContext
    limiter: DynamicsCompressorNode
  } | null>(null)
  const phraseRef = React.useRef<GainNode | null>(null)
  const timersRef = React.useRef<Array<ReturnType<typeof setTimeout>>>([])

  const stop = React.useCallback(() => {
    for (const timer of timersRef.current) clearTimeout(timer)
    timersRef.current = []
    for (const key of keysRef.current) if (key) delete key.dataset.down

    // Fade the phrase that is still ringing rather than cutting it.
    const audio = audioRef.current
    const phrase = phraseRef.current
    if (audio && phrase) {
      const now = audio.context.currentTime
      phrase.gain.cancelScheduledValues(now)
      phrase.gain.setTargetAtTime(0, now, 0.03)
      setTimeout(() => phrase.disconnect(), 400)
    }
    phraseRef.current = null
  }, [])

  React.useEffect(
    () => () => {
      stop()
      void audioRef.current?.context.close()
      audioRef.current = null
    },
    [stop]
  )

  const play = React.useCallback(() => {
    stop()
    const { notes } = improvise()

    // Sound is a bonus: without Web Audio the keys still play silently.
    if (!audioRef.current) {
      const AudioContextImpl = getAudioContext()
      if (AudioContextImpl) {
        try {
          const context = new AudioContextImpl()
          // Keeps the left hand and a run of overlapping notes from clipping.
          const limiter = context.createDynamicsCompressor()
          limiter.threshold.value = -14
          limiter.ratio.value = 6
          limiter.connect(context.destination)
          audioRef.current = { context, limiter }
        } catch {}
      }
    }

    // A little lead time so the first note is not clipped by scheduling.
    const lead = 0.04
    const audio = audioRef.current
    if (audio) {
      const { context, limiter } = audio
      void context.resume()
      const phrase = context.createGain()
      phrase.gain.value = 0.9
      phrase.connect(limiter)
      phraseRef.current = phrase

      const at = context.currentTime + lead
      let end = 0
      for (const note of notes) {
        scheduleNote(context, phrase, note, at)
        end = Math.max(end, note.start + ringSeconds(note.midi))
      }
      // Once the last note has rung out, drop the phrase's nodes.
      timersRef.current.push(
        setTimeout(
          () => {
            phrase.disconnect()
            if (phraseRef.current === phrase) phraseRef.current = null
          },
          (end + lead + 0.2) * 1000
        )
      )
    }

    const keys = keysRef.current.filter(Boolean) as HTMLSpanElement[]
    for (const note of notes) {
      if (note.key === undefined || keys.length === 0) continue
      const key = keys[Math.round(note.key * (keys.length - 1))]!
      const down = (note.start + lead) * 1000
      // Lift a little before the next note so a repeated key re-strikes.
      const held = Math.max(70, Math.min(note.duration * 1000 - 40, 420))
      timersRef.current.push(
        setTimeout(() => {
          key.dataset.down = ''
        }, down),
        setTimeout(() => {
          delete key.dataset.down
        }, down + held)
      )
    }
  }, [stop])

  let letter = 0

  return (
    <span
      {...props}
      role='button'
      tabIndex={0}
      className={cn(styles.phrase, className)}
      onClick={play}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          // Space would otherwise scroll the page.
          event.preventDefault()
          if (!event.repeat) play()
        }
      }}
    >
      {[...children].map((character, index) => {
        if (character === ' ') return ' '
        const keyIndex = letter++
        return (
          <span
            key={index}
            ref={(element) => {
              keysRef.current[keyIndex] = element
            }}
            className={styles.key}
          >
            {character}
          </span>
        )
      })}
    </span>
  )
}
