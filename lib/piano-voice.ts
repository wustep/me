import type { ImprovNote } from './improvise'

/**
 * The homepage's piano: a small sampler for the Web Audio API, playing
 * excerpts of the Salamander Grand Piano V3, a Yamaha C5 recorded by
 * Alexander Holm (CC BY 3.0; see public/piano/README.md).
 *
 * Three velocity layers are sampled every minor third from C2 to C7, as
 * stereo MP3s under /piano (MP3 decodes everywhere, Safari and iOS
 * included). A note plays the nearest sample, pitched by at most a
 * semitone, from the layer its velocity calls for, scaled to its exact
 * loudness. When its key and the sustain pedal let go, it fades the way a
 * damper stops a string, except at the top, where a piano has no dampers.
 * Everything rings through a small room (createRoom).
 *
 * Nothing here loads or plays on import: PianoPhrase makes a bank
 * (pianoBank) on the first click and asks it for the samples a piece needs,
 * the opening's first. scripts/render-improv.mts drives the same functions
 * offline, and scripts/build-piano-samples.mts makes the files.
 */

/** Where the samples are served from. */
export const PIANO_SAMPLE_PATH = '/piano'

/** The sampled notes, as MIDI numbers: every minor third from C2 to C7. */
export const PIANO_ROOTS: readonly number[] = Array.from(
  { length: 21 },
  (_, i) => 36 + 3 * i
)

/**
 * The Salamander velocity layers in use, softest first, each with the top
 * of the velocity range (0–1) it plays.
 */
export const PIANO_LAYERS: ReadonlyArray<{ layer: number; below: number }> = [
  { layer: 5, below: 0.4 },
  { layer: 9, below: 0.68 },
  { layer: 13, below: Infinity }
]

/** How loud a note of velocity 1 is, and how sharply softer ones fall away. */
const LEVEL = 0.8
const CURVE = 1.3

/** Wet level of the room against the dry piano. */
const ROOM_WET = 0.2

const NAMES: Record<number, string> = { 0: 'C', 3: 'Ds', 6: 'Fs', 9: 'A' }

/** A sample's file name, as Salamander names it (with D♯ as Ds, F♯ as Fs). */
export function sampleFile(root: number, layer: number) {
  return `${NAMES[root % 12]}${Math.floor(root / 12) - 1}v${layer}.mp3`
}

/** Seconds kept of each sample: low strings ring longer. */
export function sampleSeconds(root: number) {
  return root < 48 ? 8 : root < 60 ? 7 : root < 72 ? 6 : root < 84 ? 5 : 4
}

/** The sampled note nearest `midi`. */
function nearestRoot(midi: number) {
  const index = Math.round((midi - PIANO_ROOTS[0]!) / 3)
  return PIANO_ROOTS[Math.min(PIANO_ROOTS.length - 1, Math.max(0, index))]!
}

export type SampleChoice = {
  file: string
  /** The sampled note it pitches from. */
  root: number
  layer: number
  /** Playback rate: 1 at the sampled pitch. */
  rate: number
  /** Linear gain on the (level-matched) sample. */
  gain: number
}

/** Which sample plays a note, how far it is pitched, and how loud. */
export function pickSample(midi: number, velocity: number): SampleChoice {
  const v = Math.min(1, Math.max(0, velocity))
  const root = nearestRoot(midi)
  const { layer } = PIANO_LAYERS.find(({ below }) => v < below)!
  return {
    file: sampleFile(root, layer),
    root,
    layer,
    rate: 2 ** ((midi - root) / 12),
    gain: LEVEL * v ** CURVE
  }
}

/** The sample files a run of notes plays, in the order each is first needed. */
export function samplesFor(notes: readonly ImprovNote[]): string[] {
  const files = new Set<string>()
  for (const note of notes) files.add(pickSample(note.midi, note.velocity).file)
  return [...files]
}

/**
 * Time constant, in seconds, of a note's fade once its key and the pedal are
 * up. Bass dampers take a moment to stop the heavy strings; from F6 up there
 * are no dampers at all, so the note rings on.
 */
export function releaseTime(midi: number) {
  if (midi >= 89) return 1.5
  return 0.07 + 0.09 * Math.min(1, Math.max(0, (84 - midi) / 48))
}

/**
 * How long a note sounds, in seconds: until a moment after its key and the
 * pedal let go (`held`), or until its sample has rung out.
 */
export function ringSeconds(midi: number, held = 0) {
  const root = nearestRoot(midi)
  const natural = sampleSeconds(root) / 2 ** ((midi - root) / 12)
  return Math.min(natural, Math.max(0, held) + 8 * releaseTime(midi))
}

/** The parts of an AudioBuffer the voice reads. */
export type SampleBuffer = Pick<
  AudioBuffer,
  'duration' | 'length' | 'sampleRate' | 'numberOfChannels' | 'getChannelData'
>

const leads = new WeakMap<object, number>()

/**
 * Seconds of near-silence at the head of a decoded sample, less a hair, so a
 * note starts on its hammer however the decoder pads the file.
 */
export function attackOffset(buffer: SampleBuffer) {
  let lead = leads.get(buffer)
  if (lead === undefined) {
    const data = buffer.getChannelData(0)
    const window = Math.min(data.length, Math.round(buffer.sampleRate * 0.2))
    let peak = 0
    for (let i = 0; i < window; i++) peak = Math.max(peak, Math.abs(data[i]!))
    let onset = 0
    while (onset < window && Math.abs(data[onset]!) < peak * 0.02) onset++
    lead = Math.max(0, onset / buffer.sampleRate - 0.002)
    leads.set(buffer, lead)
  }
  return lead
}

/**
 * The loaded sample to play a note from: the one it wants, or failing that
 * (while the bank is still loading) the nearest loaded neighbour, preferring
 * its own layer.
 */
export function findSample<B extends SampleBuffer>(
  buffers: ReadonlyMap<string, B>,
  midi: number,
  velocity: number
): { buffer: B; root: number } | undefined {
  const choice = pickSample(midi, velocity)
  const wanted = buffers.get(choice.file)
  if (wanted) return { buffer: wanted, root: choice.root }
  let best: { buffer: B; root: number } | undefined
  let bestCost = Infinity
  for (const { layer } of PIANO_LAYERS) {
    for (const root of PIANO_ROOTS) {
      const distance = Math.abs(root - midi)
      if (distance > 7) continue
      const buffer = buffers.get(sampleFile(root, layer))
      if (!buffer) continue
      const cost = distance + (layer === choice.layer ? 0 : 3)
      if (cost < bestCost) {
        best = { buffer, root }
        bestCost = cost
      }
    }
  }
  return best
}

/**
 * Schedule one note on `context`, starting `note.start` seconds after `at`,
 * into `output`, from the decoded samples in `buffers`. Returns its source,
 * or nothing if no sample near it has loaded.
 */
export function scheduleNote(
  context: BaseAudioContext,
  output: AudioNode,
  note: ImprovNote,
  at: number,
  buffers: ReadonlyMap<string, AudioBuffer>
): AudioBufferSourceNode | undefined {
  const found = findSample(buffers, note.midi, note.velocity)
  if (!found) return undefined
  const { buffer, root } = found
  const { gain } = pickSample(note.midi, note.velocity)
  const rate = 2 ** ((note.midi - root) / 12)
  const start = at + note.start
  const offset = attackOffset(buffer)
  // How long the sample lasts at this pitch, and when the key and pedal let
  // go of it.
  const natural = start + (buffer.duration - offset) / rate
  const release = start + Math.max(0, note.duration)
  const tau = releaseTime(note.midi)

  const source = context.createBufferSource()
  source.buffer = buffer
  source.playbackRate.value = rate
  const envelope = context.createGain()
  envelope.gain.value = gain
  if (release < natural) {
    envelope.gain.setValueAtTime(gain, release)
    envelope.gain.setTargetAtTime(0, release, tau)
  }
  source.connect(envelope)
  envelope.connect(output)
  source.start(start, offset)
  source.stop(Math.min(natural, release + 8 * tau))
  return source
}

/** A small seeded PRNG (mulberry32), so the room is the same every time. */
function noise(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d_2b_79_f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

// A few early reflections, [milliseconds, gain], a little different in each
// ear, as off the walls of a small living room.
const REFLECTIONS: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [
    [7.1, 0.5],
    [11.9, -0.36],
    [17.3, 0.3],
    [24.6, -0.22],
    [33.8, 0.16]
  ],
  [
    [8.4, 0.48],
    [13.2, -0.34],
    [19.6, 0.28],
    [27.5, -0.2],
    [36.9, 0.15]
  ]
]

/**
 * A stereo impulse response for a small, softly furnished room: a short
 * pre-delay, a few early reflections, then a diffuse tail that dies away
 * over about a second, its highs first. Each channel has unit energy.
 */
export function roomImpulse(sampleRate: number): [Float32Array, Float32Array] {
  const seconds = 1.6
  const decay = 1.1 // seconds to fall 60 dB
  const predelay = 0.006
  const length = Math.round(seconds * sampleRate)
  const channels: [Float32Array, Float32Array] = [
    new Float32Array(length),
    new Float32Array(length)
  ]
  for (const [c, channel] of channels.entries()) {
    const random = noise(0x9e_37 + c)
    let low = 0
    let previous = 0
    let high = 0
    // A one-pole high-pass at about 140 Hz keeps the room from booming.
    const hp = Math.exp((-2 * Math.PI * 140) / sampleRate)
    for (let i = Math.round(predelay * sampleRate); i < length; i++) {
      const t = i / sampleRate - predelay
      // The tail darkens as it dies: its cutoff falls from about 9 kHz.
      const cutoff = 1400 + 7600 * Math.exp(-t / 0.28)
      const a = Math.exp((-2 * Math.PI * cutoff) / sampleRate)
      low = (1 - a) * (random() * 2 - 1) + a * low
      high = hp * (high + low - previous)
      previous = low
      // It builds over the first 30 ms as the reflections thicken.
      const swell = Math.min(1, t / 0.03)
      channel[i] = high * swell * Math.exp((-6.91 * t) / decay)
    }
    let energy = 0
    for (const value of channel) energy += value * value
    const tail = 0.75 / Math.sqrt(energy)
    for (let i = 0; i < length; i++) channel[i]! *= tail
    for (const [ms, gain] of REFLECTIONS[c]!) {
      channel[Math.round((predelay + ms / 1000) * sampleRate)]! += gain * 0.5
    }
    energy = 0
    for (const value of channel) energy += value * value
    const unit = 1 / Math.sqrt(energy)
    for (let i = 0; i < length; i++) channel[i]! *= unit
  }
  return channels
}

/**
 * The room the piano plays in: the dry signal, plus a little of it through
 * roomImpulse(). Connect notes to `input` and `output` onward.
 */
export function createRoom(context: BaseAudioContext) {
  const input = context.createGain()
  const output = context.createGain()
  input.connect(output)

  const [left, right] = roomImpulse(context.sampleRate)
  const impulse = context.createBuffer(2, left.length, context.sampleRate)
  impulse.getChannelData(0).set(left)
  impulse.getChannelData(1).set(right)
  const reverb = context.createConvolver()
  // The impulse is already at the level it should be.
  reverb.normalize = false
  reverb.buffer = impulse
  const wet = context.createGain()
  wet.gain.value = ROOM_WET
  input.connect(reverb)
  reverb.connect(wet)
  wet.connect(output)
  return { input, output }
}

/** The room's wet level, for the offline renderer. */
export const ROOM_LEVEL = ROOM_WET

/** Decode with the callback form too, which older Safari needs. */
function decode(context: BaseAudioContext, data: ArrayBuffer) {
  return new Promise<AudioBuffer>((resolve, reject) => {
    const result = context.decodeAudioData(data, resolve, reject) as
      | Promise<AudioBuffer>
      | undefined
    result?.catch(reject)
  })
}

export type PianoBank = {
  /** Decoded samples, by file name, as they arrive. */
  readonly buffers: ReadonlyMap<string, AudioBuffer>
  /**
   * Fetch and decode these files, a few at a time, in this order and ahead
   * of anything asked for earlier. Settles once each has loaded or failed.
   */
  load: (files: readonly string[]) => Promise<void>
}

/**
 * Samples for one context, fetched from `path` only when asked for, and
 * kept decoded for every piece after.
 */
export function pianoBank(
  context: BaseAudioContext,
  path = PIANO_SAMPLE_PATH
): PianoBank {
  const buffers = new Map<string, AudioBuffer>()
  const settled = new Map<string, Promise<void>>()
  const queue: string[] = []
  const starts = new Map<string, () => void>()
  let active = 0

  const pump = () => {
    while (active < 4 && queue.length > 0) {
      const file = queue.shift()!
      active++
      starts.get(file)!()
      starts.delete(file)
    }
  }

  const request = (file: string) => {
    let done = settled.get(file)
    if (!done) {
      done = new Promise<void>((resolve) => {
        starts.set(file, () => {
          fetch(`${path}/${file}`)
            .then((response) => {
              if (!response.ok) throw new Error(`${response.status} ${file}`)
              return response.arrayBuffer()
            })
            .then((data) => decode(context, data))
            .then((buffer) => {
              buffers.set(file, buffer)
            })
            .catch(() => {
              // Let a later piece try again.
              settled.delete(file)
            })
            .finally(() => {
              active--
              resolve()
              pump()
            })
        })
      })
      settled.set(file, done)
    }
    return done
  }

  return {
    buffers,
    load(files) {
      const waiting = files.map(request)
      // Newest asks first, in their own order.
      const fresh = files.filter((file) => starts.has(file))
      for (const file of fresh) {
        const at = queue.indexOf(file)
        if (at !== -1) queue.splice(at, 1)
      }
      queue.unshift(...new Set(fresh))
      pump()
      return Promise.all(waiting).then(() => {})
    }
  }
}
