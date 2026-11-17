/**
 * Render one of the homepage's piano improvisations to a WAV or MP3 file,
 * offline, on the same sampled piano the site plays.
 *
 *   node scripts/render-improv.mts --key E --seed 42
 *   node scripts/render-improv.mts --key B --seed 7 --texture planing --out piece.wav
 *   node scripts/render-improv.mts --seed 3 --out piece.mp3
 *
 * Options: --key E|D|B (default: whatever the seed picks), --seed <integer>
 * (default 1), --texture waltz|arpeggio|loop|planing|neosoul (default:
 * whatever the seed picks), --out <path> (default improv-<key>-<seed>.wav in
 * the system temp directory; a .mp3 path writes MP3). The same seed and key
 * always give the same piece, and the same piece the tests see for that
 * seed.
 *
 * Runs as TypeScript straight from Node (22.18+, which strips types). Needs
 * ffmpeg, which decodes the samples in public/piano (and writes MP3s). It
 * composes with lib/improvise.ts and plays every note through the site's
 * real voice, scheduleNote() in lib/piano-voice.ts, into a small stand-in for
 * the slice of Web Audio that voice uses (buffer sources with a playback
 * rate, gains and their automation). It mixes in the same room, convolving
 * with roomImpulse(), then applies the same phrase gain and limiter settings
 * as components/wustep/PianoPhrase.tsx. Out comes stereo at 44.1 kHz.
 */

import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseArgs } from 'node:util'

import {
  IMPROV_KEYS,
  IMPROV_TEXTURES,
  type ImprovKey,
  type ImprovNote,
  type ImprovTexture,
  improvise,
  seededRandom
} from '../lib/improvise.ts'
import {
  PIANO_LAYERS,
  PIANO_ROOTS,
  ROOM_LEVEL,
  roomImpulse,
  type SampleBuffer,
  sampleFile,
  samplesFor,
  scheduleNote
} from '../lib/piano-voice.ts'

const RATE = 44_100
const SAMPLES = join(import.meta.dirname, '..', 'public', 'piano')

// --- The samples, decoded by ffmpeg as a browser would ----------------------

class Samples implements SampleBuffer {
  readonly sampleRate = RATE
  readonly numberOfChannels = 2
  readonly length: number
  readonly duration: number
  readonly #channels: [Float32Array, Float32Array]

  constructor(file: string) {
    const result = spawnSync(
      'ffmpeg',
      [
        '-loglevel',
        'error',
        '-i',
        join(SAMPLES, file),
        '-f',
        'f32le',
        '-ac',
        '2',
        '-ar',
        String(RATE),
        'pipe:1'
      ],
      { maxBuffer: 1 << 28 }
    )
    if (result.status !== 0) {
      throw new Error(`ffmpeg could not decode ${file}: ${result.stderr}`)
    }
    const bytes = result.stdout
    const interleaved = new Float32Array(
      bytes.buffer,
      bytes.byteOffset,
      bytes.byteLength / 4
    )
    this.length = interleaved.length / 2
    this.duration = this.length / RATE
    this.#channels = [
      new Float32Array(this.length),
      new Float32Array(this.length)
    ]
    for (let i = 0; i < this.length; i++) {
      this.#channels[0][i] = interleaved[2 * i]!
      this.#channels[1][i] = interleaved[2 * i + 1]!
    }
  }

  getChannelData(channel: number) {
    return this.#channels[channel]!
  }
}

// --- A stand-in for the parts of Web Audio that scheduleNote() touches ------

type Automation =
  | { type: 'set'; time: number; value: number }
  | { type: 'target'; time: number; value: number; tau: number }

class Param {
  value: number
  events: Automation[] = []

  constructor(value: number) {
    this.value = value
  }

  setValueAtTime(value: number, time: number) {
    this.events.push({ type: 'set', time, value })
    this.events.sort((a, b) => a.time - b.time)
    return this
  }

  setTargetAtTime(value: number, time: number, tau: number) {
    this.events.push({ type: 'target', time, value, tau })
    this.events.sort((a, b) => a.time - b.time)
    return this
  }

  /** The value at `time`, by the Web Audio rules for these two events. */
  at(time: number): number {
    let value = this.value
    for (const [i, event] of this.events.entries()) {
      if (event.time > time) break
      if (event.type === 'set') {
        value = event.value
      } else {
        const next = this.events[i + 1]
        const until = next && next.time <= time ? next.time : time
        value =
          event.value +
          (value - event.value) * Math.exp(-(until - event.time) / event.tau)
      }
    }
    return value
  }
}

class Node {
  outputs: Node[] = []

  connect(destination: Node) {
    this.outputs.push(destination)
    return destination
  }

  disconnect() {
    // Each piece gets its own graph, dropped once it is rendered.
  }
}

class Gain extends Node {
  gain = new Param(1)
}

class Source extends Node {
  buffer: Samples | null = null
  playbackRate = new Param(1)
  when = 0
  offset = 0
  end = Infinity

  start(when: number, offset = 0) {
    this.when = when
    this.offset = offset
  }

  stop(when: number) {
    this.end = when
  }
}

class OfflineContext {
  readonly sampleRate = RATE
  readonly currentTime = 0
  sources: Source[] = []

  createGain() {
    return new Gain()
  }

  createBufferSource() {
    const source = new Source()
    this.sources.push(source)
    return source
  }
}

// --- Rendering --------------------------------------------------------------

/** Every note into a stereo mix, dry, the way the browser would play it. */
function renderNotes(
  notes: readonly ImprovNote[],
  buffers: ReadonlyMap<string, Samples>
) {
  const context = new OfflineContext()
  const output = new Node()
  for (const note of notes) {
    scheduleNote(
      context as unknown as BaseAudioContext,
      output as unknown as AudioNode,
      note,
      0,
      buffers as unknown as ReadonlyMap<string, AudioBuffer>
    )
  }

  let end = 0
  for (const source of context.sources) end = Math.max(end, source.end)
  const frames = Math.ceil((end + 0.1) * RATE)
  const mix: [Float64Array, Float64Array] = [
    new Float64Array(frames),
    new Float64Array(frames)
  ]
  for (const source of context.sources) {
    const buffer = source.buffer!
    // The gains between this source and the mix.
    const gains: Param[] = []
    let node: Node | undefined = source.outputs[0]
    while (node && node !== output) {
      if (node instanceof Gain) gains.push(node.gain)
      node = node.outputs[0]
    }
    const rate = source.playbackRate.value
    const left = buffer.getChannelData(0)
    const right = buffer.getChannelData(1)
    const from = Math.ceil(source.when * RATE)
    const to = Math.min(frames, Math.ceil(source.end * RATE))
    for (let i = from; i < to; i++) {
      const t = i / RATE
      // Linear interpolation between samples, as Chrome resamples.
      const position = (source.offset + (t - source.when) * rate) * RATE
      const j = Math.floor(position)
      if (j + 1 >= buffer.length) break
      const f = position - j
      let gain = 1
      for (const param of gains) gain *= param.at(t)
      mix[0][i]! += (left[j]! + (left[j + 1]! - left[j]!) * f) * gain
      mix[1][i]! += (right[j]! + (right[j + 1]! - right[j]!) * f) * gain
    }
  }
  return mix
}

/** In-place radix-2 FFT (inverse when `inverse`), lengths a power of two. */
function fft(re: Float64Array, im: Float64Array, inverse = false) {
  const n = re.length
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1
    for (; j & bit; bit >>= 1) j ^= bit
    j ^= bit
    if (i < j) {
      ;[re[i], re[j]] = [re[j]!, re[i]!]
      ;[im[i], im[j]] = [im[j]!, im[i]!]
    }
  }
  for (let size = 2; size <= n; size <<= 1) {
    const angle = ((inverse ? 2 : -2) * Math.PI) / size
    const wr = Math.cos(angle)
    const wi = Math.sin(angle)
    for (let start = 0; start < n; start += size) {
      let cr = 1
      let ci = 0
      for (let k = 0; k < size / 2; k++) {
        const a = start + k
        const b = a + size / 2
        const xr = re[b]! * cr - im[b]! * ci
        const xi = re[b]! * ci + im[b]! * cr
        re[b] = re[a]! - xr
        im[b] = im[a]! - xi
        re[a]! += xr
        im[a]! += xi
        const next = cr * wr - ci * wi
        ci = cr * wi + ci * wr
        cr = next
      }
    }
  }
  if (inverse) {
    for (let i = 0; i < n; i++) {
      re[i]! /= n
      im[i]! /= n
    }
  }
}

/** `signal` convolved with `impulse` (what a ConvolverNode does). */
function convolve(signal: Float64Array, impulse: Float32Array) {
  let n = 1
  while (n < signal.length + impulse.length) n <<= 1
  const ar = new Float64Array(n)
  const ai = new Float64Array(n)
  const br = new Float64Array(n)
  const bi = new Float64Array(n)
  ar.set(signal)
  br.set(impulse)
  fft(ar, ai)
  fft(br, bi)
  for (let i = 0; i < n; i++) {
    const r = ar[i]! * br[i]! - ai[i]! * bi[i]!
    ai[i] = ar[i]! * bi[i]! + ai[i]! * br[i]!
    ar[i] = r
  }
  fft(ar, ai, true)
  return ar.subarray(0, signal.length + impulse.length - 1)
}

/**
 * PianoPhrase's limiter: a DynamicsCompressorNode at threshold -14 dB, ratio
 * 6, with the defaults for everything else (30 dB knee, 3 ms attack, 250 ms
 * release), the automatic makeup gain browsers apply, and one detector for
 * both channels.
 */
function limit([left, right]: [Float64Array, Float64Array]) {
  const threshold = -14
  const knee = 30
  const ratio = 6
  const curve = (db: number) => {
    if (db < threshold - knee / 2) return db
    if (db > threshold + knee / 2) return threshold + (db - threshold) / ratio
    const over = db - threshold + knee / 2
    return db + ((1 / ratio - 1) * over * over) / (2 * knee)
  }
  const makeup = (1 / 10 ** (curve(0) / 20)) ** 0.6
  const attack = Math.exp(-1 / (0.003 * RATE))
  const release = Math.exp(-1 / (0.25 * RATE))
  let reduction = 0
  let deepest = 0
  const out: [Float64Array, Float64Array] = [
    new Float64Array(left.length),
    new Float64Array(right.length)
  ]
  for (let i = 0; i < left.length; i++) {
    const level =
      20 * Math.log10(Math.max(Math.abs(left[i]!), Math.abs(right[i]!)) + 1e-9)
    const wanted = curve(level) - level
    const coefficient = wanted < reduction ? attack : release
    reduction = coefficient * reduction + (1 - coefficient) * wanted
    deepest = Math.min(deepest, reduction)
    const gain = 10 ** (reduction / 20) * makeup
    out[0][i] = left[i]! * gain
    out[1][i] = right[i]! * gain
  }
  return { out, deepest }
}

function wav([left, right]: [Float64Array, Float64Array]) {
  const frames = left.length
  const buffer = Buffer.alloc(44 + frames * 4)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + frames * 4, 4)
  buffer.write('WAVEfmt ', 8)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20) // PCM
  buffer.writeUInt16LE(2, 22) // stereo
  buffer.writeUInt32LE(RATE, 24)
  buffer.writeUInt32LE(RATE * 4, 28)
  buffer.writeUInt16LE(4, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(frames * 4, 40)
  const pcm = (x: number) => Math.round(Math.max(-1, Math.min(1, x)) * 32_767)
  for (let i = 0; i < frames; i++) {
    buffer.writeInt16LE(pcm(left[i]!), 44 + i * 4)
    buffer.writeInt16LE(pcm(right[i]!), 46 + i * 4)
  }
  return buffer
}

// --- Command line -------------------------------------------------------------

const { values } = parseArgs({
  options: {
    key: { type: 'string' },
    seed: { type: 'string', default: '1' },
    texture: { type: 'string' },
    out: { type: 'string' }
  }
})

const key = values.key?.toUpperCase() as ImprovKey | undefined
if (key && !IMPROV_KEYS.includes(key)) {
  throw new Error(`--key must be one of ${IMPROV_KEYS.join(', ')}`)
}
const texture = values.texture as ImprovTexture | undefined
if (texture && !IMPROV_TEXTURES.includes(texture)) {
  throw new Error(`--texture must be one of ${IMPROV_TEXTURES.join(', ')}`)
}
const seed = Number.parseInt(values.seed, 10)
if (!Number.isFinite(seed)) throw new Error('--seed must be an integer')

const piece = improvise(seededRandom(seed), { key, texture })
const out = values.out ?? join(tmpdir(), `improv-${piece.keyName}-${seed}.wav`)

const started = performance.now()
// Just the samples this piece asks for, as the site loads them.
const files = samplesFor(piece.notes)
const buffers = new Map(files.map((file) => [file, new Samples(file)]))
const known = new Set(
  PIANO_LAYERS.flatMap(({ layer }) =>
    PIANO_ROOTS.map((root) => sampleFile(root, layer))
  )
)
for (const file of files) {
  if (!known.has(file)) throw new Error(`no such sample: ${file}`)
}

const dry = renderNotes(piece.notes, buffers)
// The room: the dry piano plus the impulse response at ROOM_LEVEL.
const impulse = roomImpulse(RATE)
const mixed = dry.map((channel, c) => {
  const wet = convolve(channel, impulse[c]!)
  const sum = new Float64Array(wet.length)
  for (let i = 0; i < wet.length; i++) {
    // PianoPhrase plays each piece through a 0.9 gain into the room.
    sum[i] = 0.9 * ((channel[i] ?? 0) + ROOM_LEVEL * wet[i]!)
  }
  return sum
}) as [Float64Array, Float64Array]
const { out: final, deepest } = limit(mixed)

let peak = 0
let clipped = 0
let energy = 0
for (const channel of final) {
  for (const sample of channel) {
    peak = Math.max(peak, Math.abs(sample))
    if (Math.abs(sample) > 1) clipped++
    energy += sample * sample
  }
}
const rms = Math.sqrt(energy / (2 * final[0].length))

if (out.toLowerCase().endsWith('.mp3')) {
  const scratch = mkdtempSync(join(tmpdir(), 'improv-'))
  const temporary = join(scratch, 'piece.wav')
  writeFileSync(temporary, wav(final))
  const result = spawnSync(
    'ffmpeg',
    ['-loglevel', 'error', '-y', '-i', temporary, '-b:a', '192k', out],
    { stdio: 'inherit' }
  )
  rmSync(scratch, { recursive: true, force: true })
  if (result.status !== 0) throw new Error('ffmpeg could not write the MP3')
} else {
  writeFileSync(out, wav(final))
}

const db = (x: number) => (20 * Math.log10(x)).toFixed(1)
const rightHand = piece.notes.filter((note) => note.key !== undefined).length
console.log(
  [
    `${piece.keyName} major, ${piece.texture}, ${piece.bpm} bpm, seed ${seed}`,
    `${piece.duration.toFixed(1)}s, ${piece.notes.length} notes (${rightHand} right hand, ${piece.notes.length - rightHand} left), ${files.length} samples`,
    `peak ${db(peak)} dBFS${clipped ? ` (${clipped} samples clipped)` : ''}, RMS ${db(rms)} dBFS, limiter down to ${deepest.toFixed(1)} dB`,
    `wrote ${out} in ${((performance.now() - started) / 1000).toFixed(1)}s`
  ].join('\n')
)
