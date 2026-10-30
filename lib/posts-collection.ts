import ExpiryMap from 'expiry-map'
import { type CollectionInstance, type ExtendedRecordMap } from 'notion-types'
import { parsePageId } from 'notion-utils'
import pMemoize from 'p-memoize'

import * as config from './config'
import { isIndexedPageId } from './is-published-on-site'
import { notion } from './notion-api'
import { collectPublicPageSlugs } from './page-slug'

const SLUG_MAP_TTL_MS = 25 * 60 * 1000

export function getCollectionBlockIds(
  collectionData: CollectionInstance
): string[] {
  const collectionResult = collectionData.result
  return (
    collectionResult?.blockIds ??
    collectionResult?.collection_group_results?.blockIds ??
    collectionResult?.reducerResults?.collection_group_results?.blockIds ??
    []
  )
}

/**
 * Slug map from every `pageUrlOverrides` page's collections. Those views
 * (e.g. /writing) include public posts that are hidden from the home crawl.
 */
async function loadOverrideCollectionSlugMap(): Promise<
  Record<string, string>
> {
  const overridePageIds = [
    ...new Set(Object.values(config.pageUrlOverrides || {}))
  ]
  const merged: Record<string, string> = {}

  await Promise.all(
    overridePageIds.map(async (pageId) => {
      try {
        const recordMap = (await notion.getPage(pageId)) as ExtendedRecordMap
        Object.assign(merged, collectPublicPageSlugs(recordMap))
      } catch (err) {
        console.warn('failed to load override page for slug map', pageId, err)
      }
    })
  )

  return merged
}

export const getOverrideCollectionSlugMap = pMemoize(
  loadOverrideCollectionSlugMap,
  {
    cache: new ExpiryMap<undefined, Record<string, string>>(SLUG_MAP_TTL_MS)
  }
)

/**
 * True when `pageId` is a page the site publishes: the committed index, a
 * URL override, or a public post in an override page's collection. Gate for
 * anything that takes a raw Notion id from a request — otherwise any page in
 * the workspace that Notion will serve renders under this domain.
 */
export async function isPublishedPageId(pageId: string): Promise<boolean> {
  if (isIndexedPageId(pageId)) return true

  const normalized = parsePageId(pageId, { uuid: false })
  if (!normalized) return false

  const slugMap = await getOverrideCollectionSlugMap()
  return Object.values(slugMap).some(
    (id) => parsePageId(id, { uuid: false }) === normalized
  )
}
