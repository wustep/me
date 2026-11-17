/**
 * Render one of the homepage's piano improvisations to a WAV file, offline.
 *
 *   node scripts/render-improv.mts --key E --seed 42
 *   node scripts/render-improv.mts --key B --seed 7 --texture planing --out piece.wav
 *   node scripts/render-improv.mts --seed 3 --out piece.mp3   # needs ffmpeg
 *
 * Options: --key E|D|B (default: whatever the seed picks), --seed <integer>
 * (default 1), --texture waltz|arpeggio|loop|planing|neosoul (default:
 * whatever the seed picks), --out <path> (default improv-<key>-<seed>.wav in
 * the system temp directory). The same seed and key always give the same
 * piece, and the same piece the tests see for that seed.
 *
 * Runs as TypeScript straight from Node (22.18+, which strips types), with
 * no dependencies. It composes with lib/improvise.ts and plays every note
 * through the site's real voice, scheduleNote() in lib/piano-voice.ts, into a
 * small stand-in for the slice of Web Audio that voice uses (oscillators,
 * gains, a lowpass biquad and their automation). Then it applies the same
 * phrase gain and limiter settings as components/wustep/PianoPhrase.tsx.
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
  type ImprovTexture,
  improvise,
  seededRandom
} from '../lib/improvise.ts'
import { scheduleNote } from '../lib/piano-voice.ts'

const RATE = 44_100

// --- A stand-in for the parts of Web Audio that scheduleNote() touches ----

interface Automation {
  type: 'set' | 'linear' | 'exponential'
  value: number
  time: number
}

class Param {
  value: number
  events: Automation[] = []
  #cursor = 0

  constructor(value: number) {
    this.value = value
  }

  setValueAtTime(value: number, time: number) {
    return this.#add('set', value, time)
  }

  linearRampToValueAtTime(value: number, time: number) {
    return this.#add('linear', value, time)
  }

  exponentialRampToValueAtTime(value: number, time: number) {
    return this.#add('exponential', value, time)
  }

  #add(type: Automation['type'], value: number, time: number) {
    this.events.push({ type, value, time })
    this.events.sort((a, b) => a.time - b.time)
    return this
  }

  /** The value at `time`, by the Web Audio rules; times must not go back. */
  at(time: number): number {
    const { events } = this
    if (events.length === 0) return this.value
    while (this.#cursor < events.length && events[this.#cursor]!.time <= time) {
      this.#cursor++
    }
    const before = events[this.#cursor - 1]
    const after = events[this.#cursor]
    if (!before) return this.value
    if (!after || after.type === 'set') return before.value
    const t = (time - before.time) / (after.time - before.time)
    return after.type === 'linear'
      ? before.value + (after.value - before.value) * t
      : before.value * (after.value / before.value) ** t
  }
}

class Node {
  inputs: Node[] = []

  connect(destination: Node) {
    destination.inputs.push(this)
    return destination
  }

  disconnect() {
    // Each note gets its own little graph, dropped once it is rendered.
  }

  pull(time: number): number {
    let sum = 0
    for (const input of this.inputs) sum += input.pull(time)
    return sum
  }
}

class Gain extends Node {
  gain = new Param(1)

  override pull(time: number) {
    return super.pull(time) * this.gain.at(time)
  }
}

/** A lowpass biquad, by the Web Audio spec's formulas (Q in dB). */
class Biquad extends Node {
  type = 'lowpass'
  frequency = new Param(350)
  Q = new Param(1)
  #x1 = 0
  #x2 = 0
  #y1 = 0
  #y2 = 0
  #coefficients = [0, 0, 0, 0, 0]
  #age = Infinity

  override pull(time: number) {
    // Retune every 16 samples: the cutoff glides slowly.
    if (this.#age++ >= 16) {
      this.#age = 0
      const f = Math.min(this.frequency.at(time), RATE / 2 - 1)
      const w = (2 * Math.PI * f) / RATE
      const alpha = Math.sin(w) / (2 * 10 ** (this.Q.at(time) / 20))
      const cos = Math.cos(w)
      const a0 = 1 + alpha
      this.#coefficients = [
        (1 - cos) / 2 / a0,
        (1 - cos) / a0,
        (1 - cos) / 2 / a0,
        (-2 * cos) / a0,
        (1 - alpha) / a0
      ]
    }
    const [b0, b1, b2, a1, a2] = this.#coefficients as [
      number,
      number,
      number,
      number,
      number
    ]
    const x = super.pull(time)
    const y =
      b0 * x + b1 * this.#x1 + b2 * this.#x2 - a1 * this.#y1 - a2 * this.#y2
    this.#x2 = this.#x1
    this.#x1 = x
    this.#y2 = this.#y1
    this.#y1 = y
    return y
  }
}

class Oscillator extends Node {
  type: 'sine' | 'triangle' | 'square' | 'sawtooth' = 'sine'
  frequency = new Param(440)
  begin = Infinity
  end = Infinity
  #phase = 0

  start(time: number) {
    this.begin = time
  }

  stop(time: number) {
    this.end = time
  }

  override pull(time: number) {
    if (time < this.begin || time >= this.end) return 0
    const phase = this.#phase
    this.#phase = (phase + this.frequency.at(time) / RATE) % 1
    switch (this.type) {
      case 'sine':
        return Math.sin(2 * Math.PI * phase)
      case 'triangle':
        return 4 * Math.abs(((phase + 0.75) % 1) - 0.5) - 1
      case 'square':
        return phase < 0.5 ? 1 : -1
      case 'sawtooth':
        return 2 * phase - 1
    }
  }
}

class OfflineContext {
  readonly sampleRate = RATE
  readonly currentTime = 0
  oscillators: Oscillator[] = []

  createGain() {
    return new Gain()
  }

  createBiquadFilter() {
    return new Biquad()
  }

  createOscillator() {
    const oscillator = new Oscillator()
    this.oscillators.push(oscillator)
    return oscillator
  }
}

// --- Rendering --------------------------------------------------------------

/** Each note into `mix`, one at a time, so only its own nodes are live. */
function renderNotes(notes: ReturnType<typeof improvise>['notes']) {
  let end = 0
  const voices: { output: Node; from: number; to: number }[] = []
  for (const note of notes) {
    const context = new OfflineContext()
    const output = new Node()
    scheduleNote(
      context as unknown as BaseAudioContext,
      output as unknown as AudioNode,
      note,
      0
    )
    const from = Math.min(...context.oscillators.map((o) => o.begin))
    const to = Math.max(...context.oscillators.map((o) => o.end))
    voices.push({ output, from, to })
    end = Math.max(end, to)
  }
  const mix = new Float64Array(Math.ceil((end + 0.5) * RATE))
  for (const { output, from, to } of voices) {
    const last = Math.min(mix.length, Math.ceil(to * RATE))
    for (let i = Math.floor(from * RATE); i < last; i++) {
      mix[i]! += output.pull(i / RATE)
    }
  }
  return mix
}

/**
 * PianoPhrase's limiter: a DynamicsCompressorNode at threshold -14 dB, ratio
 * 6, with the defaults for everything else (30 dB knee, 3 ms attack, 250 ms
 * release) and the automatic makeup gain browsers apply.
 */
function limit(signal: Float64Array) {
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
  const out = new Float64Array(signal.length)
  for (const [i, x] of signal.entries()) {
    const level = 20 * Math.log10(Math.abs(x) + 1e-9)
    const wanted = curve(level) - level
    const coefficient = wanted < reduction ? attack : release
    reduction = coefficient * reduction + (1 - coefficient) * wanted
    deepest = Math.min(deepest, reduction)
    out[i] = x * 10 ** (reduction / 20) * makeup
  }
  return { out, deepest }
}

function wav(samples: Float64Array) {
  const buffer = Buffer.alloc(44 + samples.length * 2)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + samples.length * 2, 4)
  buffer.write('WAVEfmt ', 8)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20) // PCM
  buffer.writeUInt16LE(1, 22) // mono
  buffer.writeUInt32LE(RATE, 24)
  buffer.writeUInt32LE(RATE * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(samples.length * 2, 40)
  for (const [i, sample] of samples.entries()) {
    buffer.writeInt16LE(
      Math.round(Math.max(-1, Math.min(1, sample)) * 32_767),
      44 + i * 2
    )
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
const dry = renderNotes(piece.notes)
// PianoPhrase plays each piece through a 0.9 gain into the limiter.
for (const [i, sample] of dry.entries()) dry[i] = sample * 0.9
const { out: wet, deepest } = limit(dry)

let peak = 0
let clipped = 0
let energy = 0
for (const sample of wet) {
  peak = Math.max(peak, Math.abs(sample))
  if (Math.abs(sample) > 1) clipped++
  energy += sample * sample
}
const rms = Math.sqrt(energy / wet.length)

if (out.toLowerCase().endsWith('.mp3')) {
  const scratch = mkdtempSync(join(tmpdir(), 'improv-'))
  const temporary = join(scratch, 'piece.wav')
  writeFileSync(temporary, wav(wet))
  const result = spawnSync(
    'ffmpeg',
    ['-loglevel', 'error', '-y', '-i', temporary, '-b:a', '192k', out],
    { stdio: 'inherit' }
  )
  rmSync(scratch, { recursive: true, force: true })
  if (result.status !== 0) throw new Error('ffmpeg could not write the MP3')
} else {
  writeFileSync(out, wav(wet))
}

const db = (x: number) => (20 * Math.log10(x)).toFixed(1)
const rightHand = piece.notes.filter((note) => note.key !== undefined).length
console.log(
  [
    `${piece.keyName} major, ${piece.texture}, ${piece.bpm} bpm, seed ${seed}`,
    `${piece.duration.toFixed(1)}s, ${piece.notes.length} notes (${rightHand} right hand, ${piece.notes.length - rightHand} left)`,
    `peak ${db(peak)} dBFS${clipped ? ` (${clipped} samples clipped)` : ''}, RMS ${db(rms)} dBFS, limiter down to ${deepest.toFixed(1)} dB`,
    `wrote ${out} in ${((performance.now() - started) / 1000).toFixed(1)}s`
  ].join('\n')
)
