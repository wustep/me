import { readdirSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import wustepLenses from '../../components/wustep/lenses/lenses.json'
import opusLenses from '../../components/wustep/lenses/llms/opus/lenses.json'
import {
  deckSlugFromBasePath,
  getLensCard,
  getLensImageUrl,
  WUSTEP_DECK_SLUG
} from '../lens-card'

describe('getLensCard', () => {
  it('returns a lens from the original deck', () => {
    const lens = wustepLenses[0]!
    expect(getLensCard(WUSTEP_DECK_SLUG, lens.id)).toEqual({
      title: lens.title,
      tagline: lens.tagline,
      eyebrow: lens.category,
      bg: lens.bg,
      fg: lens.fg,
      accent: lens.accent,
      path: 'wustep.me/lenses'
    })
  })

  it('returns a lens from a model deck', () => {
    const lens = opusLenses[0]!
    expect(getLensCard('opus', lens.id)).toMatchObject({
      title: lens.title,
      path: 'wustep.me/lenses/llms/opus'
    })
  })

  it('returns the deck cover when no lens id is given', () => {
    expect(getLensCard(WUSTEP_DECK_SLUG)).toMatchObject({ title: 'Lenses' })
    expect(getLensCard('opus')?.eyebrow).toBe('Lenses by Claude Opus')
  })

  it('returns null for unknown decks and lenses', () => {
    expect(getLensCard('nope')).toBeNull()
    expect(getLensCard('toString')).toBeNull()
    expect(getLensCard(WUSTEP_DECK_SLUG, 'not-a-lens')).toBeNull()
    // A lens id from another deck doesn't leak across decks.
    expect(getLensCard('opus', wustepLenses[0]!.id)).toBeNull()
  })

  it('has a card for every lens in the original deck', () => {
    for (const lens of wustepLenses) {
      expect(getLensCard(WUSTEP_DECK_SLUG, lens.id)).not.toBeNull()
    }
  })

  it('registers every model deck directory', () => {
    const llmsDir = path.join(process.cwd(), 'components/wustep/lenses/llms')
    const slugs = readdirSync(llmsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
    expect(slugs.length).toBeGreaterThan(0)
    for (const slug of slugs) {
      expect(getLensCard(slug), `missing deck "${slug}"`).not.toBeNull()
    }
  })
})

describe('getLensImageUrl', () => {
  it('builds the route URL with encoded params', () => {
    expect(getLensImageUrl('https://wustep.me', 'opus', 'tempo')).toBe(
      'https://wustep.me/api/lens-image?deck=opus&id=tempo'
    )
    expect(getLensImageUrl('https://wustep.me', WUSTEP_DECK_SLUG)).toBe(
      'https://wustep.me/api/lens-image?deck=wustep'
    )
  })
})

describe('deckSlugFromBasePath', () => {
  it('maps base paths to deck slugs', () => {
    expect(deckSlugFromBasePath('/lenses')).toBe(WUSTEP_DECK_SLUG)
    expect(deckSlugFromBasePath('/lenses/llms/opus')).toBe('opus')
  })
})
