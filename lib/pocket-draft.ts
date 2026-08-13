export const DRAFT_ROUNDS = 5
export const OFFER_SIZE = 3
export const PLAYER_HP = 12
export const SEED_LENGTH = 5
export const SEED_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789'

export type Suit = 'melody' | 'harmony' | 'rhythm'

export type CardDef = {
  id: string
  name: string
  suit: Suit
  attack: number
  block: number
  hint: string
}

export type Enemy = {
  name: string
  hp: number
  attack: number
}

export type CombatResult = {
  picks: CardDef[]
  enemy: Enemy
  attack: number
  block: number
  motifBonus: number
  ensembleBonus: number
  damageTaken: number
  remainingHp: number
  leftoverBlock: number
  won: boolean
  score: number
  log: string[]
}

export type Deal = {
  seed: string
  packs: CardDef[][]
  enemy: Enemy
}

export const SUIT_LABEL: Record<Suit, string> = {
  melody: 'Melody',
  harmony: 'Harmony',
  rhythm: 'Rhythm'
}

// Fifteen cards — five packs of three, no repeats in a run.
export const CARD_POOL: readonly CardDef[] = [
  {
    id: 'staccato',
    name: 'Staccato',
    suit: 'melody',
    attack: 3,
    block: 0,
    hint: 'Short, sharp hits.'
  },
  {
    id: 'legato',
    name: 'Legato',
    suit: 'melody',
    attack: 2,
    block: 2,
    hint: 'A line that holds.'
  },
  {
    id: 'arpeggio',
    name: 'Arpeggio',
    suit: 'melody',
    attack: 4,
    block: 0,
    hint: 'Climb the chord.'
  },
  {
    id: 'trill',
    name: 'Trill',
    suit: 'melody',
    attack: 3,
    block: 1,
    hint: 'A flutter of notes.'
  },
  {
    id: 'octave',
    name: 'Octave',
    suit: 'melody',
    attack: 5,
    block: 0,
    hint: 'Strike two at once.'
  },
  {
    id: 'major',
    name: 'Major',
    suit: 'harmony',
    attack: 2,
    block: 2,
    hint: 'Bright and stable.'
  },
  {
    id: 'minor',
    name: 'Minor',
    suit: 'harmony',
    attack: 1,
    block: 3,
    hint: 'Darker color, thicker air.'
  },
  {
    id: 'cadence',
    name: 'Cadence',
    suit: 'harmony',
    attack: 3,
    block: 1,
    hint: 'A landing.'
  },
  {
    id: 'pedal',
    name: 'Pedal',
    suit: 'harmony',
    attack: 0,
    block: 4,
    hint: 'Sustain the room.'
  },
  {
    id: 'cluster',
    name: 'Cluster',
    suit: 'harmony',
    attack: 4,
    block: 0,
    hint: 'Too many notes, on purpose.'
  },
  {
    id: 'ostinato',
    name: 'Ostinato',
    suit: 'rhythm',
    attack: 2,
    block: 2,
    hint: 'A looping figure.'
  },
  {
    id: 'syncopation',
    name: 'Syncopation',
    suit: 'rhythm',
    attack: 3,
    block: 0,
    hint: 'Off the beat.'
  },
  {
    id: 'rest',
    name: 'Rest',
    suit: 'rhythm',
    attack: 0,
    block: 3,
    hint: 'The loudest silence.'
  },
  {
    id: 'crescendo',
    name: 'Crescendo',
    suit: 'rhythm',
    attack: 2,
    block: 1,
    hint: 'Build.'
  },
  {
    id: 'fermata',
    name: 'Fermata',
    suit: 'rhythm',
    attack: 1,
    block: 3,
    hint: 'Hold.'
  }
]

export function normalizeSeed(raw: string): string {
  return raw
    .toLowerCase()
    .replaceAll(/[^a-z0-9]/g, '')
    .slice(0, 12)
}

export function randomSeed(rng: () => number = Math.random): string {
  let out = ''
  for (let i = 0; i < SEED_LENGTH; i++) {
    const index = Math.floor(rng() * SEED_ALPHABET.length)
    out += SEED_ALPHABET[index] ?? 'a'
  }
  return out
}

/** FNV-1a 32-bit, so a string seed becomes a mulberry32 seed. */
export function hashSeed(seed: string): number {
  let hash = 2_166_136_261
  for (const char of seed) {
    hash ^= char.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16_777_619)
  }
  return hash >>> 0
}

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d_2b_79_f5) >>> 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

function pickN<T>(items: readonly T[], count: number, rng: () => number): T[] {
  const pool = [...items]
  const out: T[] = []
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) break
    const index = Math.floor(rng() * pool.length)
    const [chosen] = pool.splice(index, 1)
    if (chosen !== undefined) out.push(chosen)
  }
  return out
}

export function dealRun(seed: string): Deal {
  const normalized = normalizeSeed(seed)
  if (!normalized) {
    throw new Error('Seed is empty')
  }

  const rng = mulberry32(hashSeed(normalized))
  const dealt = pickN(CARD_POOL, DRAFT_ROUNDS * OFFER_SIZE, rng)
  if (dealt.length !== DRAFT_ROUNDS * OFFER_SIZE) {
    throw new Error('Card pool too small for a full draft')
  }

  const packs: CardDef[][] = []
  for (let round = 0; round < DRAFT_ROUNDS; round++) {
    packs.push(dealt.slice(round * OFFER_SIZE, (round + 1) * OFFER_SIZE))
  }

  return {
    seed: normalized,
    packs,
    enemy: {
      name: 'The Silence',
      hp: 10 + Math.floor(rng() * 5),
      attack: 6 + Math.floor(rng() * 4)
    }
  }
}

export function resolveCombat(
  picks: readonly CardDef[],
  enemy: Enemy,
  playerHp = PLAYER_HP
): CombatResult {
  if (picks.length !== DRAFT_ROUNDS) {
    throw new Error(`Need ${DRAFT_ROUNDS} picks to resolve`)
  }

  let attack = 0
  let block = 0
  const log: string[] = []
  const counts: Record<Suit, number> = {
    melody: 0,
    harmony: 0,
    rhythm: 0
  }

  for (const card of picks) {
    attack += card.attack
    block += card.block
    counts[card.suit] += 1
    log.push(`${card.name}: +${card.attack} atk, +${card.block} blk`)
  }

  const motifBonus =
    Math.max(counts.melody, counts.harmony, counts.rhythm) >= 3 ? 3 : 0
  const ensembleBonus =
    counts.melody > 0 && counts.harmony > 0 && counts.rhythm > 0 ? 2 : 0

  attack += motifBonus
  block += ensembleBonus
  if (motifBonus > 0) log.push(`Motif: three of a kind (+${motifBonus} atk)`)
  if (ensembleBonus > 0) {
    log.push(`Ensemble: all three voices (+${ensembleBonus} blk)`)
  }

  const damageTaken = Math.max(0, enemy.attack - block)
  const leftoverBlock = Math.max(0, block - enemy.attack)
  const remainingHp = playerHp - damageTaken
  const won = remainingHp > 0 && attack >= enemy.hp
  const score =
    attack + leftoverBlock + Math.max(0, remainingHp) + (won ? 10 : 0)

  log.push(
    won
      ? `The Silence breaks. Score ${score}.`
      : remainingHp <= 0
        ? `You go quiet first. Score ${score}.`
        : `Not enough sound. Score ${score}.`
  )

  return {
    picks: [...picks],
    enemy,
    attack,
    block,
    motifBonus,
    ensembleBonus,
    damageTaken,
    remainingHp,
    leftoverBlock,
    won,
    score,
    log
  }
}
