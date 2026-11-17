import { readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { IMPROV_TEXTURES, improvise, seededRandom } from '../improvise'
import {
  attackOffset,
  findSample,
  PIANO_LAYERS,
  PIANO_ROOTS,
  pickSample,
  releaseTime,
  ringSeconds,
  roomImpulse,
  type SampleBuffer,
  sampleFile,
  sampleSeconds,
  samplesFor,
  scheduleNote
} from '../piano-voice'

const SAMPLES = fileURLToPath(new URL('../../public/piano/', import.meta.url))
const FILES = PIANO_LAYERS.flatMap(({ layer }) =>
  PIANO_ROOTS.map((root) => sampleFile(root, layer))
)

const semitones = (rate: number) => 12 * Math.log2(rate)
const db = (x: number) => 20 * Math.log10(x)

function energy(data: Float32Array, from = 0, to = data.length) {
  let sum = 0
  for (let i = from; i < to; i++) sum += data[i]! ** 2
  return sum
}

/** A stand-in decoded sample: `lead` frames of silence, then a tone. */
function buffer(seconds = 2, lead = 0, sampleRate = 48_000): SampleBuffer {
  const data = new Float32Array(Math.round(seconds * sampleRate))
  for (let i = lead; i < data.length; i++) data[i] = Math.sin(i / 7) * 0.5
  return {
    duration: data.length / sampleRate,
    length: data.length,
    sampleRate,
    numberOfChannels: 1,
    getChannelData: () => data
  }
}

describe('pickSample', () => {
  it('pitches every note by at most a semitone, and a little past the ends', () => {
    for (let midi = 35; midi <= 97; midi++) {
      for (const velocity of [0.1, 0.5, 0.9]) {
        const { rate, root } = pickSample(midi, velocity)
        expect(PIANO_ROOTS).toContain(root)
        expect(Math.abs(semitones(rate) - (midi - root))).toBeLessThan(1e-9)
        expect(Math.abs(midi - root)).toBeLessThanOrEqual(1)
      }
    }
    // Past the sampled range it stretches the nearest sample.
    expect(pickSample(30, 0.5).root).toBe(36)
    expect(pickSample(100, 0.5).root).toBe(96)
  })

  it('gets louder with velocity, from soft to loud layers', () => {
    let gain = 0
    let layer = 0
    const layers = new Set<number>()
    for (let v = 0.02; v <= 1; v += 0.02) {
      const choice = pickSample(60, v)
      expect(choice.gain).toBeGreaterThan(gain)
      expect(choice.layer).toBeGreaterThanOrEqual(layer)
      gain = choice.gain
      layer = choice.layer
      layers.add(choice.layer)
    }
    expect(layers.size).toBe(PIANO_LAYERS.length)
    // A pianissimo is far quieter than a forte, not just a shade.
    expect(
      db(pickSample(60, 0.9).gain) - db(pickSample(60, 0.2).gain)
    ).toBeGreaterThan(14)
  })
})

describe('the samples', () => {
  it('are all there, as MP3s, and nothing else is', () => {
    for (const file of FILES) {
      const head = readFileSync(SAMPLES + file).subarray(0, 3)
      // An ID3 tag, or straight into an MPEG audio frame.
      const id3 = head.toString('latin1') === 'ID3'
      const frame = head[0] === 0xff && (head[1]! & 0xe0) === 0xe0
      expect(id3 || frame, file).toBe(true)
    }
    const mp3s = readdirSync(SAMPLES).filter((file) => file.endsWith('.mp3'))
    expect(mp3s.toSorted()).toEqual(FILES.toSorted())
  })

  it('stay a reasonable download', () => {
    let total = 0
    for (const file of FILES) total += statSync(SAMPLES + file).size
    expect(total / 1024 / 1024).toBeGreaterThan(2)
    expect(total / 1024 / 1024).toBeLessThan(8)
  })

  it('come with their license and credit', () => {
    const notice = readFileSync(SAMPLES + 'LICENSE.txt', 'utf8')
    expect(notice).toContain('Salamander Grand Piano')
    expect(notice).toContain('Alexander Holm')
    expect(notice).toContain('creativecommons.org/licenses/by/3.0')
  })

  it('cover every note the improvisations play', () => {
    for (let seed = 1; seed <= 40; seed++) {
      for (const texture of IMPROV_TEXTURES) {
        const { notes } = improvise(seededRandom(seed), { texture })
        for (const file of samplesFor(notes)) expect(FILES).toContain(file)
        for (const note of notes) {
          const { root } = pickSample(note.midi, note.velocity)
          expect(Math.abs(note.midi - root)).toBeLessThanOrEqual(1)
        }
      }
    }
  })
})

describe('the voice', () => {
  it('lets go like a damper falling, except at the top', () => {
    // Bass dampers are slower than treble ones; above F6 there are none.
    expect(releaseTime(40)).toBeGreaterThan(releaseTime(72))
    expect(releaseTime(72)).toBeLessThan(0.2)
    expect(releaseTime(90)).toBeGreaterThan(1)
    // A held note rings longer than a short one, but no longer than its
    // sample lasts.
    expect(ringSeconds(60, 0.4)).toBeLessThan(ringSeconds(60, 3))
    expect(ringSeconds(60, 60)).toBeLessThanOrEqual(sampleSeconds(60))
  })

  it('finds the head of a sample past any padding', () => {
    const offset = attackOffset(buffer(1, 1200, 48_000))
    expect(offset).toBeGreaterThan(0.02)
    expect(offset).toBeLessThan(0.025)
    expect(attackOffset(buffer(1, 0))).toBe(0)
  })

  it('borrows a neighbour while its own sample loads', () => {
    const want = pickSample(61, 0.5)
    const neighbour = sampleFile(63, want.layer)
    const other = sampleFile(60, PIANO_LAYERS[0]!.layer)
    const loaded = new Map([
      [neighbour, buffer()],
      [other, buffer()]
    ])
    expect(findSample(loaded, 61, 0.5)?.root).toBe(63)
    loaded.set(want.file, buffer())
    expect(findSample(loaded, 61, 0.5)?.root).toBe(want.root)
    expect(findSample(new Map<string, SampleBuffer>(), 61, 0.5)).toBeUndefined()
  })

  it('schedules a note on its sample, pitched, then released', () => {
    const calls: string[] = []
    const param = (name: string) => ({
      value: 0,
      setValueAtTime: (v: number, t: number) =>
        calls.push(`${name} set ${v.toFixed(3)} @${t.toFixed(3)}`),
      setTargetAtTime: (v: number, t: number, tau: number) =>
        calls.push(`${name} target ${v} @${t.toFixed(3)} τ${tau.toFixed(3)}`)
    })
    const node = (name: string) => ({
      connect: () => calls.push(`${name} connect`)
    })
    let source: Record<string, unknown> | undefined
    const gain = { ...node('gain'), gain: param('gain') }
    const context = {
      createBufferSource: () => {
        source = {
          ...node('source'),
          buffer: null,
          playbackRate: param('rate'),
          start: (when: number, offset: number) =>
            calls.push(`start @${when.toFixed(3)} +${offset.toFixed(3)}`),
          stop: (when: number) => calls.push(`stop @${when.toFixed(3)}`)
        }
        return source
      },
      createGain: () => gain
    } as unknown as BaseAudioContext

    const note = { midi: 61, start: 1, duration: 0.5, velocity: 0.5 }
    const { file, root, gain: level } = pickSample(note.midi, note.velocity)
    const sample = buffer(4, 0, 48_000)
    scheduleNote(
      context,
      {} as AudioNode,
      note,
      10,
      new Map([[file, sample]]) as unknown as ReadonlyMap<string, AudioBuffer>
    )

    expect(source!.buffer).toBe(sample)
    expect(
      semitones((source!.playbackRate as { value: number }).value)
    ).toBeCloseTo(note.midi - root, 9)
    expect(gain.gain.value).toBeCloseTo(level, 9)
    const tau = releaseTime(note.midi)
    expect(calls).toEqual([
      `gain set ${level.toFixed(3)} @11.500`,
      `gain target 0 @11.500 τ${tau.toFixed(3)}`,
      'source connect',
      'gain connect',
      'start @11.000 +0.000',
      `stop @${(11.5 + 8 * tau).toFixed(3)}`
    ])
  })

  it('rings out a sample held past its length without a release', () => {
    const calls: string[] = []
    const context = {
      createBufferSource: () => ({
        connect() {},
        playbackRate: { value: 1 },
        start() {},
        stop: (when: number) => calls.push(`stop @${when.toFixed(2)}`)
      }),
      createGain: () => ({
        connect() {},
        gain: {
          value: 0,
          setValueAtTime: () => calls.push('release'),
          setTargetAtTime: () => calls.push('release')
        }
      })
    } as unknown as BaseAudioContext
    const note = { midi: 60, start: 0, duration: 30, velocity: 0.5 }
    const { file } = pickSample(note.midi, note.velocity)
    scheduleNote(
      context,
      {} as AudioNode,
      note,
      0,
      new Map([[file, buffer(3)]]) as unknown as ReadonlyMap<
        string,
        AudioBuffer
      >
    )
    expect(calls).toEqual(['stop @3.00'])
  })
})

describe('roomImpulse', () => {
  it('is the same room every time: stereo, unit energy, dying away', () => {
    const [left, right] = roomImpulse(44_100)
    expect(roomImpulse(44_100)[0]).toEqual(left)
    expect(energy(left)).toBeCloseTo(1, 4)
    expect(energy(right)).toBeCloseTo(1, 4)
    // Most of it in the first half second; almost nothing at the end.
    expect(energy(left, 0, 22_050)).toBeGreaterThan(0.85)
    expect(energy(left, left.length - 4410)).toBeLessThan(1e-4)
    // The two ears hear different reflections.
    let same = 0
    for (let i = 0; i < left.length; i++) same += left[i]! * right[i]!
    expect(Math.abs(same)).toBeLessThan(0.2)
  })
})
