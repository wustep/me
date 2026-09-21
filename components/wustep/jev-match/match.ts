import type {
  Hobby,
  LookingFor,
  MatchDimensionId,
  MatchReason,
  MatchResult,
  Person,
  YouProfile
} from './types'
import { choiceConfidence, clamp01, softmax } from '../jev-shared'

const BAY = new Set(['Oakland', 'Berkeley', 'San Francisco'])

const LOOKING_TO_HOBBIES: Record<LookingFor, Hobby[]> = {
  'weekend adventures': [
    'climbing',
    'bouldering',
    'trail running',
    'cycling',
    'sailing'
  ],
  'slow dinners': ['cooking', 'fermentation'],
  'a climbing partner': ['climbing', 'bouldering'],
  'someone local': [],
  'long walks': ['trail running', 'birding'],
  'a bandmate': ['jazz', 'house shows'],
  'co-working company': ['sci-fi', 'board games'],
  'a dance partner': ['dancing'],
  'quiet mornings': ['birding', 'pottery', 'poetry', 'museums'],
  'a travel buddy': ['sailing', 'museums', 'film photography']
}

function jaccard<T>(a: readonly T[], b: readonly T[]): number {
  if (a.length === 0 && b.length === 0) return 0
  const left = new Set(a)
  const right = new Set(b)
  let inter = 0
  for (const item of left) {
    if (right.has(item)) inter += 1
  }
  const union = left.size + right.size - inter
  return union === 0 ? 0 : inter / union
}

function overlapList<T>(a: readonly T[], b: readonly T[]): T[] {
  const right = new Set(b)
  return a.filter((item) => right.has(item))
}

function cityScore(you: string, them: string): number {
  if (you === them) return 1
  if (BAY.has(you) && BAY.has(them)) return 0.55
  return 0.08
}

function complementScore(you: YouProfile, person: Person): number {
  const wanted = new Set<Hobby>()
  for (const wish of you.lookingFor) {
    for (const hobby of LOOKING_TO_HOBBIES[wish]) wanted.add(hobby)
  }
  if (wanted.size === 0) return jaccard(you.lookingFor, person.lookingFor)
  let hits = 0
  for (const hobby of person.hobbies) {
    if (wanted.has(hobby)) hits += 1
  }
  return clamp01(hits / Math.max(2, wanted.size * 0.45))
}

function energyScore(you: YouProfile, person: Person): number {
  if (you.energy === person.energy) return 0.92
  if (you.energy === 'social' || person.energy === 'social') return 0.48
  return 0.22
}

const LABELS: Record<MatchDimensionId, string> = {
  hobbies: 'Shared hobbies',
  lookingFor: 'Looking-for overlap',
  complement: 'They have what you want',
  city: 'Same place',
  energy: 'Energy match'
}

function noteFor(
  id: MatchDimensionId,
  you: YouProfile,
  person: Person,
  score: number
): string {
  if (id === 'hobbies') {
    const shared = overlapList(you.hobbies, person.hobbies)
    if (shared.length === 0) return 'No shared hobbies on the closed list.'
    return `Both: ${shared.join(', ')}.`
  }
  if (id === 'lookingFor') {
    const shared = overlapList(you.lookingFor, person.lookingFor)
    if (shared.length === 0) return 'Different lists of what you are after.'
    return `Both looking for ${shared.join(', ')}.`
  }
  if (id === 'complement') {
    return score > 0.4
      ? `${person.name.split(' ')[0]}'s hobbies cover some of what you asked for.`
      : 'Little of what you asked for shows up in their hobbies.'
  }
  if (id === 'city') {
    if (you.city === person.city) return `Both in ${person.city}.`
    return `${person.city} vs ${you.city}.`
  }
  if (you.energy === person.energy) return `Both ${you.energy}.`
  return `${person.energy} vs your ${you.energy}.`
}

function hypothesis(
  you: YouProfile,
  person: Person,
  reasons: MatchReason[]
): string {
  const top = reasons[0]
  const second = reasons[1]
  const firstName = person.name.split(' ')[0] ?? person.name
  const sharedHobby = overlapList(you.hobbies, person.hobbies)[0]
  const sharedWant = overlapList(you.lookingFor, person.lookingFor)[0]

  if (sharedHobby && sharedWant) {
    return `You'd get along: shared ${sharedHobby}, and both want ${sharedWant}.`
  }
  if (sharedHobby) {
    return `${firstName} looks like a ${sharedHobby} person in the same way you do.`
  }
  if (top && top.score > 0.7) {
    return `${firstName} scores high on ${top.label.toLowerCase()}.`
  }
  if (top && second) {
    return `A mixed read — ${top.label.toLowerCase()} is the strongest signal.`
  }
  return `${firstName} is a thin match on this profile.`
}

export function matchPerson(you: YouProfile, person: Person): MatchResult {
  const dims: { id: MatchDimensionId; score: number; weight: number }[] = [
    { id: 'hobbies', score: jaccard(you.hobbies, person.hobbies), weight: 1.2 },
    {
      id: 'lookingFor',
      score: jaccard(you.lookingFor, person.lookingFor),
      weight: 1.1
    },
    { id: 'complement', score: complementScore(you, person), weight: 1 },
    { id: 'city', score: cityScore(you.city, person.city), weight: 0.7 },
    { id: 'energy', score: energyScore(you, person), weight: 0.8 }
  ]

  let weighted = 0
  let mass = 0
  for (const dim of dims) {
    weighted += dim.score * dim.weight
    mass += dim.weight
  }
  const fit = clamp01(mass === 0 ? 0 : weighted / mass)

  const reasons: MatchReason[] = dims
    .map((dim) => ({
      id: dim.id,
      label: LABELS[dim.id],
      score: dim.score,
      note: noteFor(dim.id, you, person, dim.score)
    }))
    .toSorted((a, b) => b.score - a.score)

  const spread = softmax(
    dims.map((dim) => dim.score * dim.weight + 0.05),
    0.55
  )
  const confidence = choiceConfidence(spread)

  return {
    person,
    fit,
    confidence,
    hypothesis: hypothesis(you, person, reasons),
    reasons
  }
}

export function rankPeople(you: YouProfile, people: Person[]): MatchResult[] {
  return people
    .map((person) => matchPerson(you, person))
    .toSorted((a, b) => b.fit - a.fit || b.confidence - a.confidence)
}

export function toggleIn<T>(list: T[], item: T): T[] {
  return list.includes(item)
    ? list.filter((entry) => entry !== item)
    : [...list, item]
}
