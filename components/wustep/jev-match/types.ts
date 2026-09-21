export const HOBBIES = [
  'climbing',
  'bouldering',
  'cycling',
  'trail running',
  'cooking',
  'fermentation',
  'board games',
  'jazz',
  'house shows',
  'pottery',
  'film photography',
  'birding',
  'sailing',
  'dancing',
  'poetry',
  'woodworking',
  'sci-fi',
  'museums',
  'soccer',
  'language exchange'
] as const

export type Hobby = (typeof HOBBIES)[number]

export const LOOKING_FOR = [
  'weekend adventures',
  'slow dinners',
  'a climbing partner',
  'someone local',
  'long walks',
  'a bandmate',
  'co-working company',
  'a dance partner',
  'quiet mornings',
  'a travel buddy'
] as const

export type LookingFor = (typeof LOOKING_FOR)[number]

export const ENERGIES = ['calm', 'social', 'adventurous'] as const
export type Energy = (typeof ENERGIES)[number]

export type YouProfile = {
  name: string
  city: string
  bio: string
  energy: Energy
  hobbies: Hobby[]
  lookingFor: LookingFor[]
}

export type Person = {
  id: string
  name: string
  age: number
  city: string
  bio: string
  energy: Energy
  hobbies: Hobby[]
  lookingFor: LookingFor[]
}

export type MatchDimensionId =
  | 'hobbies'
  | 'lookingFor'
  | 'complement'
  | 'city'
  | 'energy'

export type MatchReason = {
  id: MatchDimensionId
  label: string
  score: number
  note: string
}

export type MatchResult = {
  person: Person
  fit: number
  confidence: number
  hypothesis: string
  reasons: MatchReason[]
}
