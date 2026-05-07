import type { ParsedMidi } from './midi-parser'

export type Track = {
  id: string
  name: string
  composer: string
  source: 'builtin' | 'upload'
  parsed: ParsedMidi
}

export type TrackMeta = {
  id: string
  name: string
  composer: string
  url: string
}

// All public-domain piano transcriptions from the Mutopia Project.
// MIDI files live in /public/midi and are fetched + parsed on mount.
export const BUILTIN_MANIFEST: TrackMeta[] = [
  {
    id: 'fur-elise',
    name: 'Für Elise',
    composer: 'Ludwig van Beethoven',
    url: '/midi/fur-elise.mid'
  },
  {
    id: 'clair-de-lune',
    name: 'Clair de Lune',
    composer: 'Claude Debussy',
    url: '/midi/clair-de-lune.mid'
  },
  {
    id: 'gymnopedie-1',
    name: 'Gymnopédie No. 1',
    composer: 'Erik Satie',
    url: '/midi/gymnopedie-1.mid'
  },
  {
    id: 'the-entertainer',
    name: 'The Entertainer',
    composer: 'Scott Joplin',
    url: '/midi/the-entertainer.mid'
  }
]
