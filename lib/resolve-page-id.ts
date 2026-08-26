import { parsePageId } from 'notion-utils'

import { normalizePageIdPath } from './normalize-page-id-path'

export type PageIdLookupMaps = {
  pageUrlOverrides: Record<string, string>
  pageUrlAdditions: Record<string, string>
  canonicalPageMap: Record<string, string>
}

/**
 * Resolve a request path to a Notion page id using only in-memory maps
 * (config overrides + the committed page index). Does not hit Notion.
 */
export function resolvePageIdFromMaps(
  rawPageId: string,
  maps: PageIdLookupMaps
): string | undefined {
  const normalizedRawPageId = normalizePageIdPath(rawPageId)
  const parsed = parsePageId(normalizedRawPageId)
  if (parsed) {
    return parsed
  }

  const override =
    maps.pageUrlOverrides[rawPageId] ||
    maps.pageUrlAdditions[rawPageId] ||
    maps.pageUrlOverrides[normalizedRawPageId] ||
    maps.pageUrlAdditions[normalizedRawPageId]

  if (override) {
    return parsePageId(override) ?? undefined
  }

  const mappedPageId =
    maps.canonicalPageMap[rawPageId] ||
    maps.canonicalPageMap[normalizedRawPageId]

  return mappedPageId ? (parsePageId(mappedPageId) ?? undefined) : undefined
}

export function lookupSlug(
  slug: string,
  slugMap: Record<string, string>
): string | undefined {
  const normalized = normalizePageIdPath(slug)
  const pageId = slugMap[slug] || slugMap[normalized]
  return pageId ? (parsePageId(pageId) ?? undefined) : undefined
}

/**
 * True when `/<slug>` would resolve the same way `resolveNotionPage` does:
 * committed index / URL overrides, then collection slugs from override pages.
 * Used to keep the RSS feed from advertising leftover posts that 404.
 */
export function isResolvablePageSlug(
  slug: string,
  maps: PageIdLookupMaps,
  extraSlugMap: Record<string, string> = {}
): boolean {
  return Boolean(
    resolvePageIdFromMaps(slug, maps) || lookupSlug(slug, extraSlugMap)
  )
}
