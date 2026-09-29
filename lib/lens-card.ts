import wustepLenses from '../components/wustep/lenses/lenses.json'
import fableMeta from '../components/wustep/lenses/llms/fable/deck.json'
import fableLenses from '../components/wustep/lenses/llms/fable/lenses.json'
import gptMeta from '../components/wustep/lenses/llms/gpt/deck.json'
import gptLenses from '../components/wustep/lenses/llms/gpt/lenses.json'
import grokMeta from '../components/wustep/lenses/llms/grok/deck.json'
import grokLenses from '../components/wustep/lenses/llms/grok/lenses.json'
import haikuMeta from '../components/wustep/lenses/llms/haiku/deck.json'
import haikuLenses from '../components/wustep/lenses/llms/haiku/lenses.json'
import opusMeta from '../components/wustep/lenses/llms/opus/deck.json'
import opusLenses from '../components/wustep/lenses/llms/opus/lenses.json'

/* ─────────────────────────────────────────────────────────
 * Data for the per-lens social cards rendered by
 * pages/api/lens-image.tsx.
 *
 *   Reads the generated lenses.json / deck.json files directly
 *   (no React, no illustrations) so the edge route stays small.
 *   Only lenses that exist in a deck can be rendered — the route
 *   never draws caller-supplied text.
 * ───────────────────────────────────────────────────────── */

export type LensCard = {
  title: string
  tagline: string
  /** Small caps label above the title — a lens's category, or the deck's byline. */
  eyebrow: string
  bg: string
  fg: string
  accent: string
  /** e.g. "wustep.me/lenses" or "wustep.me/lenses/llms/opus" */
  path: string
}

type RawLens = {
  id: string
  category: string
  title: string
  tagline: string
  bg: string
  fg: string
  accent: string
}

type RawDeckMeta = {
  model: string
  centerTitle: string
  centerTagline: string
  centerBg: string
  centerFg: string
  centerAccent: string
}

type DeckSource = {
  basePath: string
  lenses: RawLens[]
  center: Omit<LensCard, 'path'>
}

function llmDeck(slug: string, lenses: RawLens[], meta: RawDeckMeta) {
  return {
    basePath: `/lenses/llms/${slug}`,
    lenses,
    center: {
      title: meta.centerTitle,
      tagline: meta.centerTagline,
      eyebrow: `Lenses by ${meta.model}`,
      bg: meta.centerBg,
      fg: meta.centerFg,
      accent: meta.centerAccent
    }
  } satisfies DeckSource
}

/** The `deck` query param value for the original deck. */
export const WUSTEP_DECK_SLUG = 'wustep'

// Mirrors WUSTEP_DECK.center in components/wustep/lenses/deck.tsx.
const DECKS: Record<string, DeckSource> = {
  [WUSTEP_DECK_SLUG]: {
    basePath: '/lenses',
    lenses: wustepLenses,
    center: {
      title: 'Lenses',
      tagline: 'A way of looking. Pick one. Try it on.',
      eyebrow: 'Stephen Wu',
      bg: '#222226',
      fg: '#F6EAD8',
      accent: '#F0A85A'
    }
  },
  fable: llmDeck('fable', fableLenses, fableMeta),
  opus: llmDeck('opus', opusLenses, opusMeta),
  haiku: llmDeck('haiku', haikuLenses, haikuMeta),
  gpt: llmDeck('gpt', gptLenses, gptMeta),
  grok: llmDeck('grok', grokLenses, grokMeta)
}

/**
 * Card data for one lens (`lensId` given) or a deck's cover (`lensId`
 * omitted). Returns null for unknown decks or lenses.
 */
export function getLensCard(
  deckSlug: string,
  lensId?: string | null
): LensCard | null {
  const deck = Object.hasOwn(DECKS, deckSlug) ? DECKS[deckSlug] : undefined
  if (!deck) return null

  if (!lensId) {
    return { ...deck.center, path: `wustep.me${deck.basePath}` }
  }

  const lens = deck.lenses.find((l) => l.id === lensId)
  if (!lens) return null

  return {
    title: lens.title,
    tagline: lens.tagline,
    eyebrow: lens.category,
    bg: lens.bg,
    fg: lens.fg,
    accent: lens.accent,
    path: `wustep.me${deck.basePath}`
  }
}

/** Absolute og:image URL for a lens or deck cover. */
export function getLensImageUrl(
  host: string,
  deckSlug: string,
  lensId?: string
): string {
  const params = new URLSearchParams({ deck: deckSlug })
  if (lensId) params.set('id', lensId)
  return `${host}/api/lens-image?${params}`
}

/** Deck slug from a deck's basePath (`/lenses` → wustep, `/lenses/llms/opus` → opus). */
export function deckSlugFromBasePath(basePath: string): string {
  return basePath === '/lenses'
    ? WUSTEP_DECK_SLUG
    : (basePath.split('/').pop() ?? WUSTEP_DECK_SLUG)
}
