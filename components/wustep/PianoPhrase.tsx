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

// A piece runs up to a minute, so its notes are handed to Web Audio a little
// ahead of the clock as it plays rather than all at once: every TICK
// milliseconds, the next LOOKAHEAD seconds' worth.
const LOOKAHEAD = 1.5
const TICK = 250

/**
 * A phrase of text that plays itself: clicking it improvises a short piano
 * piece, half a minute to a minute long and new every time (see
 * lib/improvise.ts), and the letters dip like keys as the right hand's notes
 * sound, low notes to the left and high to the right. Clicking again starts a
 * fresh piece; Escape stops it.
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
    let phrase: GainNode | undefined
    if (audio) {
      void audio.context.resume()
      phrase = audio.context.createGain()
      phrase.gain.value = 0.9
      phrase.connect(audio.limiter)
      phraseRef.current = phrase
    }

    // Seconds into the piece, on the audio clock when there is one, so the
    // keys stay with the sound.
    const clock = () =>
      audio ? audio.context.currentTime : performance.now() / 1000
    const origin = clock() + lead
    const keys = keysRef.current.filter(Boolean) as HTMLSpanElement[]
    let next = 0
    let end = 0

    const tick = () => {
      const now = clock() - origin
      while (next < notes.length && notes[next]!.start < now + LOOKAHEAD) {
        const note = notes[next++]!
        // A note the clock has already passed (a stalled tab) is skipped.
        if (note.start < now - 0.1) continue
        end = Math.max(end, note.start + ringSeconds(note.midi, note.duration))
        if (audio && phrase) scheduleNote(audio.context, phrase, note, origin)

        if (note.key === undefined || keys.length === 0) continue
        const key = keys[Math.round(note.key * (keys.length - 1))]!
        const down = Math.max(0, (note.start - now) * 1000)
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

      if (next < notes.length) {
        timersRef.current.push(setTimeout(tick, TICK))
      } else if (phrase) {
        // Once the last note has rung out, drop the phrase's nodes.
        const done = phrase
        timersRef.current.push(
          setTimeout(
            () => {
              done.disconnect()
              if (phraseRef.current === done) phraseRef.current = null
            },
            (end - now + 0.2) * 1000
          )
        )
      }
    }
    tick()
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
        } else if (event.key === 'Escape') {
          stop()
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
