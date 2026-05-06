import type { NoteEvent, ParsedMidi } from './midi-parser'

export type Track = {
  id: string
  name: string
  composer: string
  source: 'builtin' | 'upload'
  parsed: ParsedMidi
}

// Helper: build a sequence of notes from a compact representation:
// [ [midiNote, startBeat, durationBeats, velocity?] ]
function buildTrack(
  id: string,
  name: string,
  composer: string,
  tempoBpm: number,
  rows: Array<[number, number, number, number?]>
): Track {
  const beat = 60 / tempoBpm
  const notes: NoteEvent[] = rows.map(([note, start, dur, vel]) => ({
    note,
    time: start * beat,
    duration: dur * beat * 0.95,
    velocity: vel ?? 96
  }))
  notes.sort((a, b) => a.time - b.time)
  const duration = notes.reduce(
    (max, n) => Math.max(max, n.time + n.duration),
    0
  )
  return {
    id,
    name,
    composer,
    source: 'builtin',
    parsed: { notes, duration }
  }
}

// --- Für Elise (opening) -----------------------------------------------------
const FUR_ELISE = buildTrack(
  'fur-elise',
  'Für Elise',
  'Ludwig van Beethoven',
  104,
  [
    [76, 0, 0.5],
    [75, 0.5, 0.5],
    [76, 1, 0.5],
    [75, 1.5, 0.5],
    [76, 2, 0.5],
    [71, 2.5, 0.5],
    [74, 3, 0.5],
    [72, 3.5, 0.5],
    [69, 4, 1.5],
    [45, 4, 0.5],
    [52, 4.5, 0.5],
    [57, 5, 0.5],
    [60, 5.5, 0.5],
    [64, 6, 0.5],
    [69, 6.5, 0.5],
    [71, 7, 1.5],
    [40, 7, 0.5],
    [52, 7.5, 0.5],
    [56, 8, 0.5],
    [64, 8.5, 0.5],
    [68, 9, 0.5],
    [71, 9.5, 0.5],
    [72, 10, 1.5],
    [45, 10, 0.5],
    [52, 10.5, 0.5],
    [57, 11, 0.5],
    [64, 11.5, 0.5],
    [76, 12, 0.5],
    [75, 12.5, 0.5],
    [76, 13, 0.5],
    [75, 13.5, 0.5],
    [76, 14, 0.5],
    [71, 14.5, 0.5],
    [74, 15, 0.5],
    [72, 15.5, 0.5],
    [69, 16, 1.5]
  ]
)

// --- Clair de Lune (opening) -------------------------------------------------
const CLAIR_DE_LUNE = buildTrack(
  'clair-de-lune',
  'Clair de Lune',
  'Claude Debussy',
  60,
  [
    [70, 0, 1, 60],
    [73, 1, 1, 64],
    [77, 2, 2, 70],
    [75, 4, 1, 64],
    [77, 5, 1, 64],
    [73, 6, 2, 64],
    [70, 8, 1, 60],
    [73, 9, 1, 60],
    [70, 10, 0.5, 56],
    [68, 10.5, 0.5, 56],
    [66, 11, 1, 56],
    [65, 12, 4, 60],
    [46, 0, 4, 50],
    [53, 0, 4, 50],
    [58, 0, 4, 50],
    [44, 4, 4, 50],
    [51, 4, 4, 50],
    [56, 4, 4, 50],
    [42, 8, 4, 50],
    [49, 8, 4, 50],
    [54, 8, 4, 50],
    [41, 12, 4, 50],
    [48, 12, 4, 50],
    [53, 12, 4, 50]
  ]
)

// --- Autumn Leaves -----------------------------------------------------------
const AUTUMN_LEAVES = buildTrack(
  'autumn-leaves',
  'Autumn Leaves',
  'Joseph Kosma',
  100,
  [
    [62, 0, 0.5],
    [65, 0.5, 0.5],
    [69, 1, 0.5],
    [72, 1.5, 2.5],
    [60, 4, 0.5],
    [64, 4.5, 0.5],
    [67, 5, 0.5],
    [71, 5.5, 2.5],
    [59, 8, 0.5],
    [62, 8.5, 0.5],
    [65, 9, 0.5],
    [69, 9.5, 2.5],
    [69, 12, 4],
    [62, 16, 0.5],
    [65, 16.5, 0.5],
    [69, 17, 0.5],
    [72, 17.5, 2.5],
    [60, 20, 0.5],
    [64, 20.5, 0.5],
    [67, 21, 0.5],
    [71, 21.5, 2.5],
    [59, 24, 0.5],
    [62, 24.5, 0.5],
    [65, 25, 0.5],
    [69, 25.5, 2.5],
    [69, 28, 4],
    [38, 0, 4],
    [43, 4, 4],
    [40, 8, 4],
    [45, 12, 4],
    [38, 16, 4],
    [43, 20, 4],
    [40, 24, 4],
    [45, 28, 4]
  ]
)

// --- Lean On Me (chorus) -----------------------------------------------------
const LEAN_ON_ME = buildTrack('lean-on-me', 'Lean On Me', 'Bill Withers', 80, [
  [60, 0, 0.5],
  [62, 0.5, 0.5],
  [64, 1, 0.5],
  [65, 1.5, 0.5],
  [64, 2, 1],
  [62, 3, 0.5],
  [60, 3.5, 1.5],
  [60, 5, 0.5],
  [62, 5.5, 0.5],
  [64, 6, 0.5],
  [65, 6.5, 0.5],
  [67, 7, 1],
  [65, 8, 0.5],
  [64, 8.5, 1.5],
  [64, 10, 0.5],
  [65, 10.5, 0.5],
  [67, 11, 0.5],
  [69, 11.5, 0.5],
  [67, 12, 1],
  [65, 13, 0.5],
  [64, 13.5, 1.5],
  [60, 15, 2],
  [48, 0, 1],
  [52, 0, 1],
  [55, 0, 1],
  [53, 4, 1],
  [57, 4, 1],
  [60, 4, 1],
  [48, 8, 1],
  [52, 8, 1],
  [55, 8, 1],
  [48, 12, 1],
  [52, 12, 1],
  [55, 12, 1]
])

export const builtInTracks: Track[] = [
  FUR_ELISE,
  CLAIR_DE_LUNE,
  AUTUMN_LEAVES,
  LEAN_ON_ME
]
