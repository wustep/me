import { describe, expect, it } from 'vitest'

import {
  CARD_POOL,
  type CardDef,
  dealRun,
  DRAFT_ROUNDS,
  hashSeed,
  mulberry32,
  normalizeSeed,
  OFFER_SIZE,
  PLAYER_HP,
  randomSeed,
  resolveCombat,
  SEED_ALPHABET,
  SEED_LENGTH
} from '../pocket-draft'

function card(
  partial: Pick<CardDef, 'id' | 'name' | 'suit'> &
    Partial<Omit<CardDef, 'id' | 'name' | 'suit'>>
): CardDef {
  return {
    attack: 1,
    block: 1,
    hint: '',
    ...partial
  }
}

describe('normalizeSeed', () => {
  it('lowercases, strips junk, and caps length', () => {
    expect(normalizeSeed(' Piano-Walk! ')).toBe('pianowalk')
    expect(normalizeSeed('ABCDEFGHIJKLMNOP')).toBe('abcdefghijkl')
  })

  it('returns empty for punctuation-only input', () => {
    expect(normalizeSeed('---')).toBe('')
  })
})

describe('randomSeed', () => {
  it('draws from the alphabet at the fixed length', () => {
    const seed = randomSeed(() => 0)
    expect(seed).toHaveLength(SEED_LENGTH)
    expect([...seed].every((ch) => SEED_ALPHABET.includes(ch))).toBe(true)
  })
})

describe('dealRun', () => {
  it('is deterministic for a given seed', () => {
    const a = dealRun('piano')
    const b = dealRun('PIANO')
    expect(a).toEqual(b)
    expect(a.packs).toHaveLength(DRAFT_ROUNDS)
    expect(a.packs.every((pack) => pack.length === OFFER_SIZE)).toBe(true)
    expect(a.enemy.name).toBe('The Silence')
    expect(a.enemy.hp).toBeGreaterThanOrEqual(10)
    expect(a.enemy.hp).toBeLessThanOrEqual(14)
    expect(a.enemy.attack).toBeGreaterThanOrEqual(6)
    expect(a.enemy.attack).toBeLessThanOrEqual(9)
  })

  it('never repeats a card inside a run', () => {
    const deal = dealRun('clef')
    const ids = deal.packs.flat().map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(DRAFT_ROUNDS * OFFER_SIZE)
    expect(ids.every((id) => CARD_POOL.some((item) => item.id === id))).toBe(
      true
    )
  })

  it('throws on an empty seed', () => {
    expect(() => dealRun('   ')).toThrow(/empty/i)
  })

  it('usually deals a different table for a different seed', () => {
    const a = dealRun('alpha')
    const b = dealRun('bravo')
    const aIds = a.packs
      .flat()
      .map((item) => item.id)
      .join(',')
    const bIds = b.packs
      .flat()
      .map((item) => item.id)
      .join(',')
    expect(aIds === bIds && a.enemy.hp === b.enemy.hp).toBe(false)
  })
})

describe('mulberry32 / hashSeed', () => {
  it('repeats the same stream for the same seed', () => {
    const a = mulberry32(hashSeed('encore'))
    const b = mulberry32(hashSeed('encore'))
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })
})

describe('resolveCombat', () => {
  const enemy = { name: 'The Silence', hp: 12, attack: 7 }

  it('awards motif and ensemble bonuses and can win', () => {
    const picks = [
      card({ id: 'a', name: 'A', suit: 'melody', attack: 4, block: 1 }),
      card({ id: 'b', name: 'B', suit: 'melody', attack: 3, block: 1 }),
      card({ id: 'c', name: 'C', suit: 'melody', attack: 2, block: 1 }),
      card({ id: 'd', name: 'D', suit: 'harmony', attack: 2, block: 2 }),
      card({ id: 'e', name: 'E', suit: 'rhythm', attack: 1, block: 2 })
    ]
    const result = resolveCombat(picks, enemy)
    expect(result.motifBonus).toBe(3)
    expect(result.ensembleBonus).toBe(2)
    expect(result.attack).toBe(4 + 3 + 2 + 2 + 1 + 3)
    expect(result.block).toBe(1 + 1 + 1 + 2 + 2 + 2)
    expect(result.damageTaken).toBe(0)
    expect(result.leftoverBlock).toBe(2)
    expect(result.remainingHp).toBe(PLAYER_HP)
    expect(result.won).toBe(true)
    expect(result.score).toBe(
      result.attack + result.leftoverBlock + PLAYER_HP + 10
    )
  })

  it('loses when attack cannot break the silence', () => {
    const picks = [
      card({ id: 'a', name: 'A', suit: 'harmony', attack: 0, block: 4 }),
      card({ id: 'b', name: 'B', suit: 'harmony', attack: 0, block: 4 }),
      card({ id: 'c', name: 'C', suit: 'rhythm', attack: 0, block: 3 }),
      card({ id: 'd', name: 'D', suit: 'rhythm', attack: 1, block: 3 }),
      card({ id: 'e', name: 'E', suit: 'melody', attack: 1, block: 0 })
    ]
    const result = resolveCombat(picks, {
      name: 'The Silence',
      hp: 14,
      attack: 6
    })
    expect(result.won).toBe(false)
    expect(result.remainingHp).toBeGreaterThan(0)
    expect(result.log.at(-1)).toMatch(/not enough sound/i)
  })

  it('loses when incoming attack exceeds block', () => {
    const picks = Array.from({ length: DRAFT_ROUNDS }, (_, i) =>
      card({
        id: `m${i}`,
        name: `M${i}`,
        suit: 'melody',
        attack: 5,
        block: 0
      })
    )
    const result = resolveCombat(picks, {
      name: 'The Silence',
      hp: 8,
      attack: 12
    })
    expect(result.damageTaken).toBe(12)
    expect(result.remainingHp).toBe(0)
    expect(result.won).toBe(false)
    expect(result.log.at(-1)).toMatch(/quiet first/i)
  })

  it('throws if the hand is short', () => {
    expect(() =>
      resolveCombat([card({ id: 'a', name: 'A', suit: 'melody' })], enemy)
    ).toThrow(/5 picks/i)
  })
})
