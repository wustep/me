/**
 * Make the homepage piano's samples, public/piano/*.mp3, from the Salamander
 * Grand Piano V3 by Alexander Holm (CC BY 3.0).
 *
 *   node scripts/build-piano-samples.mts --from <folder of Salamander WAVs>
 *   node scripts/build-piano-samples.mts --from <folder> --quality 6 --out public/piano
 *
 * Download SalamanderGrandPianoV3_44.1khz16bit.tar.bz2 from
 * https://archive.org/details/SalamanderGrandPianoV3, unpack it outside the
 * repo, and point --from at its 44.1khz16bit folder (A0v1.wav, …). Needs
 * ffmpeg with libmp3lame. The archive itself never goes in the repo.
 *
 * For each sampled note and velocity layer that lib/piano-voice.ts plays,
 * this trims the silence before the hammer, keeps sampleSeconds() of the
 * note with a long fade at the end, evens the level from note to note and
 * layer to layer (the voice puts velocity back), and encodes a VBR stereo
 * MP3 (--quality is LAME's -V, 0 best to 9 smallest; default 3).
 */

import { spawnSync } from 'node:child_process'
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseArgs } from 'node:util'

import {
  PIANO_LAYERS,
  PIANO_ROOTS,
  sampleFile,
  sampleSeconds
} from '../lib/piano-voice.ts'

const { values } = parseArgs({
  options: {
    from: { type: 'string' },
    out: { type: 'string', default: 'public/piano' },
    quality: { type: 'string', default: '3' }
  }
})
if (!values.from)
  throw new Error('--from <folder of Salamander WAVs> is required')

const SOURCE_NAMES: Record<number, string> = {
  0: 'C',
  3: 'D#',
  6: 'F#',
  9: 'A'
}

interface Stereo {
  rate: number
  left: Float32Array
  right: Float32Array
}

function readWav(path: string): Stereo {
  const bytes = readFileSync(path)
  let at = 12
  let channels = 0
  let rate = 0
  let bits = 0
  let data: Buffer | undefined
  while (at + 8 <= bytes.length) {
    const id = bytes.toString('ascii', at, at + 4)
    const size = bytes.readUInt32LE(at + 4)
    if (id === 'fmt ') {
      channels = bytes.readUInt16LE(at + 10)
      rate = bytes.readUInt32LE(at + 12)
      bits = bytes.readUInt16LE(at + 22)
    } else if (id === 'data') {
      data = bytes.subarray(at + 8, at + 8 + size)
    }
    at += 8 + size + (size % 2)
  }
  if (!data || channels !== 2 || bits !== 16) {
    throw new Error(`${path}: expected 16-bit stereo WAV`)
  }
  const frames = data.length / 4
  const left = new Float32Array(frames)
  const right = new Float32Array(frames)
  for (let i = 0; i < frames; i++) {
    left[i] = data.readInt16LE(i * 4) / 32_768
    right[i] = data.readInt16LE(i * 4 + 2) / 32_768
  }
  return { rate, left, right }
}

/** 32-bit float stereo WAV, so nothing is rounded before the encoder. */
function floatWav({ rate, left, right }: Stereo) {
  const frames = left.length
  const buffer = Buffer.alloc(44 + frames * 8)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + frames * 8, 4)
  buffer.write('WAVEfmt ', 8)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(3, 20) // IEEE float
  buffer.writeUInt16LE(2, 22)
  buffer.writeUInt32LE(rate, 24)
  buffer.writeUInt32LE(rate * 8, 28)
  buffer.writeUInt16LE(8, 32)
  buffer.writeUInt16LE(32, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(frames * 8, 40)
  for (let i = 0; i < frames; i++) {
    buffer.writeFloatLE(left[i]!, 44 + i * 8)
    buffer.writeFloatLE(right[i]!, 48 + i * 8)
  }
  return buffer
}

const db = (x: number) => 20 * Math.log10(Math.max(x, 1e-12))

/** Where the hammer lands: the first frame within 34 dB of the peak. */
function onsetOf({ left, right }: Stereo) {
  let peak = 0
  for (let i = 0; i < left.length; i++) {
    peak = Math.max(peak, Math.abs(left[i]!), Math.abs(right[i]!))
  }
  let i = 0
  while (
    i < left.length &&
    Math.max(Math.abs(left[i]!), Math.abs(right[i]!)) < peak * 0.02
  ) {
    i++
  }
  return i
}

/** Trim to just before the hammer, keep `seconds`, and fade out the end. */
function excerpt(source: Stereo, seconds: number): Stereo {
  const { rate } = source
  const preroll = Math.round(0.003 * rate)
  const from = Math.max(0, onsetOf(source) - preroll)
  const frames = Math.min(source.left.length - from, Math.round(seconds * rate))
  const fadeFrom = Math.round(frames * 0.6)
  const shape = (i: number) => {
    if (i < preroll) return i / preroll
    if (i < fadeFrom) return 1
    return Math.cos(((i - fadeFrom) / (frames - fadeFrom)) * (Math.PI / 2)) ** 2
  }
  const left = new Float32Array(frames)
  const right = new Float32Array(frames)
  for (let i = 0; i < frames; i++) {
    const g = shape(i)
    left[i] = source.left[from + i]! * g
    right[i] = source.right[from + i]! * g
  }
  return { rate, left, right }
}

/** Loudness of the first 300 ms, in dB: what the ear compares. */
function attackLevel({ rate, left, right }: Stereo) {
  const frames = Math.min(left.length, Math.round(0.3 * rate))
  let sum = 0
  for (let i = 0; i < frames; i++) sum += (left[i]! ** 2 + right[i]! ** 2) / 2
  return 10 * Math.log10(sum / frames)
}

function peakOf({ left, right }: Stereo) {
  let peak = 0
  for (let i = 0; i < left.length; i++) {
    peak = Math.max(peak, Math.abs(left[i]!), Math.abs(right[i]!))
  }
  return peak
}

/** A gentle moving average across neighbouring notes (weights 1 2 3 2 1). */
function smooth(levels: number[]) {
  return levels.map((_, i) => {
    let sum = 0
    let weight = 0
    for (let k = -2; k <= 2; k++) {
      const level = levels[i + k]
      if (level === undefined) continue
      const w = 3 - Math.abs(k)
      sum += level * w
      weight += w
    }
    return sum / weight
  })
}

// Read and trim everything first, so levels can be matched across the set.
const takes = PIANO_LAYERS.map(({ layer }) =>
  PIANO_ROOTS.map((root) => {
    const name = `${SOURCE_NAMES[root % 12]}${Math.floor(root / 12) - 1}v${layer}.wav`
    const audio = excerpt(
      readWav(join(values.from!, name)),
      sampleSeconds(root)
    )
    return { root, layer, audio, level: attackLevel(audio) }
  })
)

// Every layer is moved onto the middle layer's smoothed curve across the
// keyboard, keeping a little of each note's own character, so that loudness
// is the voice's job and the layers differ only in tone.
const middle = smooth(takes[Math.floor(takes.length / 2)]!.map((t) => t.level))
const gains = takes.map((row) => {
  const curve = smooth(row.map((take) => take.level))
  return row.map(
    (take, i) => middle[i]! - curve[i]! + 0.7 * (curve[i]! - take.level)
  )
})

// Then one gain for the whole set, so the loudest peak sits at -1 dBFS.
let loudest = -Infinity
for (const [l, row] of takes.entries()) {
  for (const [i, take] of row.entries()) {
    loudest = Math.max(loudest, db(peakOf(take.audio)) + gains[l]![i]!)
  }
}
const trim = -1 - loudest

const scratch = mkdtempSync(join(tmpdir(), 'piano-samples-'))
let total = 0
try {
  for (const [l, row] of takes.entries()) {
    for (const [i, take] of row.entries()) {
      const gain = 10 ** ((gains[l]![i]! + trim) / 20)
      const { audio } = take
      for (let k = 0; k < audio.left.length; k++) {
        audio.left[k]! *= gain
        audio.right[k]! *= gain
      }
      const wav = join(scratch, 'take.wav')
      writeFileSync(wav, floatWav(audio))
      const out = join(values.out!, sampleFile(take.root, take.layer))
      const result = spawnSync(
        'ffmpeg',
        [
          '-loglevel',
          'error',
          '-y',
          '-i',
          wav,
          '-codec:a',
          'libmp3lame',
          '-q:a',
          values.quality!,
          '-map_metadata',
          '-1',
          '-id3v2_version',
          '0',
          out
        ],
        { stdio: 'inherit' }
      )
      if (result.status !== 0) throw new Error(`ffmpeg failed on ${out}`)
      total += statSync(out).size
    }
  }
} finally {
  rmSync(scratch, { recursive: true, force: true })
}

console.log(
  `wrote ${takes.flat().length} samples to ${values.out}, ${(total / 1024 / 1024).toFixed(2)} MB`
)
