import ExpiryMap from 'expiry-map'
import { type CollectionInstance, type ExtendedRecordMap } from 'notion-types'
import pMemoize from 'p-memoize'

import * as config from './config'
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
