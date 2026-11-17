import * as React from 'react'

import { improvise, type ImprovNote } from '@/lib/improvise'
import {
  createRoom,
  type PianoBank,
  pianoBank,
  ringSeconds,
  samplesFor,
  scheduleNote
} from '@/lib/piano-voice'
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

// A piece's notes are handed to Web Audio a little ahead of the clock as it
// plays rather than all at once: every TICK milliseconds, the next LOOKAHEAD
// seconds' worth.
const LOOKAHEAD = 1.5
const TICK = 250

// A piece starts once the samples for its first OPENING seconds have
// arrived, or after WAIT seconds whatever has, so a slow network delays the
// first piece a little rather than leaving it silent.
const OPENING = 2.5
const WAIT = 4

type Audio = {
  context: AudioContext
  /** Where each piece plays into: a small room, then a limiter. */
  input: AudioNode
  /** The piano's samples, decoded once and kept for every piece after. */
  bank: PianoBank
}

/**
 * Make the audio context, in the click or key handler itself: iOS only lets
 * a page make sound from inside a user gesture.
 */
function startAudio(): Audio | undefined {
  const AudioContextImpl = getAudioContext()
  if (!AudioContextImpl) return undefined
  try {
    const context = new AudioContextImpl()
    // Keeps the left hand and a run of overlapping notes from clipping.
    const limiter = context.createDynamicsCompressor()
    limiter.threshold.value = -14
    limiter.ratio.value = 6
    limiter.connect(context.destination)
    const room = createRoom(context)
    room.output.connect(limiter)

    // Older iOS unlocks audio only for a sound started inside the gesture,
    // so start a silent one now.
    const blank = context.createBufferSource()
    blank.buffer = context.createBuffer(1, 1, context.sampleRate)
    blank.connect(context.destination)
    blank.start(0)

    return { context, input: room.input, bank: pianoBank(context) }
  } catch {
    return undefined
  }
}

/**
 * A phrase of text that plays itself: clicking it improvises a short piano
 * piece, fifteen to thirty seconds long and new every time (see
 * lib/improvise.ts), on a sampled grand piano (lib/piano-voice.ts), and the
 * letters dip like keys as the right hand's notes sound, low notes to the
 * left and high to the right. Clicking again starts a fresh piece; Escape
 * stops it.
 *
 * It stays ordinary inline text — it wraps, selects and copies like the
 * sentence around it — so it is a `span` with a button role rather than a
 * `<button>`, which could not break across lines. Sound only ever starts
 * from a click, Enter or Space. Nothing is loaded or created before that:
 * the first one makes the audio context and fetches the samples the piece
 * needs, its opening first, and later pieces reuse them.
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
  // The context, its room, limiter and samples are made on the first play
  // and then reused.
  const audioRef = React.useRef<Audio | null>(null)
  const phraseRef = React.useRef<GainNode | null>(null)
  const sourcesRef = React.useRef<AudioScheduledSourceNode[]>([])
  const timersRef = React.useRef<Array<ReturnType<typeof setTimeout>>>([])
  // Bumped by every stop, so a piece still waiting on its samples knows it
  // has been superseded.
  const playsRef = React.useRef(0)

  const stop = React.useCallback(() => {
    playsRef.current++
    for (const timer of timersRef.current) clearTimeout(timer)
    timersRef.current = []
    for (const key of keysRef.current) if (key) delete key.dataset.down

    // Fade the phrase that is still ringing rather than cutting it, and
    // cancel the notes already handed over that have yet to sound.
    const audio = audioRef.current
    const phrase = phraseRef.current
    if (audio && phrase) {
      const now = audio.context.currentTime
      phrase.gain.cancelScheduledValues(now)
      phrase.gain.setTargetAtTime(0, now, 0.03)
      for (const source of sourcesRef.current) {
        try {
          source.stop(now + 0.3)
        } catch {}
      }
      setTimeout(() => phrase.disconnect(), 400)
    }
    phraseRef.current = null
    sourcesRef.current = []
  }, [])

  React.useEffect(
    () => () => {
      stop()
      void audioRef.current?.context.close()
      audioRef.current = null
    },
    [stop]
  )

  /** Play `notes` from now, through `audio` if there is sound. */
  const perform = React.useCallback(
    (notes: ImprovNote[], audio: Audio | null) => {
      // A little lead time so the first note is not clipped by scheduling.
      const lead = 0.05
      let phrase: GainNode | undefined
      if (audio) {
        phrase = audio.context.createGain()
        phrase.gain.value = 0.9
        phrase.connect(audio.input)
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
          end = Math.max(
            end,
            note.start + ringSeconds(note.midi, note.duration)
          )
          if (audio && phrase) {
            const source = scheduleNote(
              audio.context,
              phrase,
              note,
              origin,
              audio.bank.buffers
            )
            if (source) sourcesRef.current.push(source)
          }

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
                if (phraseRef.current === done) {
                  phraseRef.current = null
                  sourcesRef.current = []
                }
              },
              (end - now + 0.3) * 1000
            )
          )
        }
      }
      tick()
    },
    []
  )

  const play = React.useCallback(() => {
    stop()
    const plays = playsRef.current
    const { notes } = improvise()

    // Sound is a bonus: without Web Audio the keys still play silently.
    audioRef.current ??= startAudio() ?? null
    const audio = audioRef.current
    if (!audio) {
      perform(notes, null)
      return
    }
    // Inside the gesture, for iOS and for autoplay rules.
    void audio.context.resume()

    // Fetch what this piece needs in the order it needs it (anything a
    // previous piece loaded is already here), and start once the opening is
    // in. A note whose sample is still on its way borrows a neighbour's.
    let started = false
    const begin = () => {
      if (started || plays !== playsRef.current) return
      started = true
      perform(notes, audio)
    }
    void audio.bank.load(samplesFor(notes))
    void audio.bank
      .load(samplesFor(notes.filter((note) => note.start < OPENING)))
      .then(begin)
    timersRef.current.push(setTimeout(begin, WAIT * 1000))
  }, [perform, stop])

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
