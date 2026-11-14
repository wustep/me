import type { ImprovNote } from './improvise'

/**
 * A small piano-ish voice for the Web Audio API: three partials through a
 * lowpass that closes as the note decays, with a hammer-like fast first
 * decay. No samples and no dependencies, so it costs nothing until played.
 *
 * Every note rings out like a held sustain pedal; `duration` only matters to
 * whoever is drawing the keys.
 */

const PARTIALS: Array<[ratio: number, type: OscillatorType, level: number]> = [
  [1, 'triangle', 1],
  [2, 'sine', 0.28],
  [3, 'sine', 0.09]
]

/** How long a note rings, in seconds. Low strings ring longer. */
export function ringSeconds(midi: number) {
  return Math.min(2.6, Math.max(1, 2.6 - (midi - 43) / 26))
}

/**
 * Schedule one note on `context`, starting `note.start` seconds after `at`,
 * into `output`.
 */
export function scheduleNote(
  context: BaseAudioContext,
  output: AudioNode,
  note: ImprovNote,
  at: number
) {
  const frequency = 440 * 2 ** ((note.midi - 69) / 12)
  const start = at + note.start
  const ring = ringSeconds(note.midi)
  const peak = 0.34 * note.velocity

  const envelope = context.createGain()
  envelope.gain.setValueAtTime(0, start)
  envelope.gain.linearRampToValueAtTime(peak, start + 0.006)
  envelope.gain.exponentialRampToValueAtTime(peak * 0.4, start + 0.14)
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + ring)

  // Brighter the harder it is struck, mellowing as it fades.
  const tone = context.createBiquadFilter()
  tone.type = 'lowpass'
  tone.Q.value = 0.4
  tone.frequency.setValueAtTime(
    Math.min(frequency * (4 + 5 * note.velocity), 9000),
    start
  )
  tone.frequency.exponentialRampToValueAtTime(
    Math.min(frequency * 2.2, 4000),
    start + 0.6
  )

  tone.connect(envelope)
  envelope.connect(output)

  for (const [ratio, type, level] of PARTIALS) {
    const oscillator = context.createOscillator()
    oscillator.type = type
    oscillator.frequency.value = frequency * ratio
    const gain = context.createGain()
    gain.gain.value = level
    oscillator.connect(gain)
    gain.connect(tone)
    oscillator.start(start)
    oscillator.stop(start + ring + 0.05)
  }
}
