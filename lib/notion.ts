import {
  type ExtendedRecordMap,
  type SearchParams,
  type SearchResults
} from 'notion-types'
import { mergeRecordMaps } from 'notion-utils'
import pMap from 'p-map'
import pMemoize from 'p-memoize'

import {
  isPreviewImageSupportEnabled,
  navigationLinks,
  navigationStyle
} from './config'
import { getTweetsMap } from './get-tweets'
import { notion } from './notion-api'
import { getPreviewImageMap } from './preview-images'

const PAGE_CACHE_TTL_MS = 25 * 60 * 1000
const SEARCH_CACHE_TTL_MS = 60 * 1000

type CacheEntry<T> = { value: Promise<T>; expiresAt: number }

function createTTLCache<T>(ttlMs: number) {
  const store = new Map<string, CacheEntry<T>>()
  return {
    get(key: string): Promise<T> | undefined {
      const entry = store.get(key)
      if (!entry) return undefined
      if (entry.expiresAt <= Date.now()) {
        store.delete(key)
        return undefined
      }
      return entry.value
    },
    set(key: string, value: Promise<T>) {
      store.set(key, { value, expiresAt: Date.now() + ttlMs })
      // evict on rejection so we don't cache errors
      value.catch(() => {
        if (store.get(key)?.value === value) store.delete(key)
      })
    }
  }
}

const pageCache = createTTLCache<ExtendedRecordMap>(PAGE_CACHE_TTL_MS)
const searchCache = createTTLCache<SearchResults>(SEARCH_CACHE_TTL_MS)

const getNavigationLinkPages = pMemoize(
  async (): Promise<ExtendedRecordMap[]> => {
    const navigationLinkPageIds = (navigationLinks || [])
      .map((link) => link?.pageId)
      .filter(Boolean)

    if (navigationStyle !== 'default' && navigationLinkPageIds.length) {
      return pMap(
        navigationLinkPageIds,
        async (navigationLinkPageId) =>
          notion.getPage(navigationLinkPageId, {
            chunkLimit: 1,
            fetchMissingBlocks: false,
            fetchCollections: false,
            signFileUrls: false
          }),
        {
          concurrency: 4
        }
      )
    }

    return []
  }
)

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const cached = pageCache.get(pageId)
  if (cached) return cached

  const promise = getPageUncached(pageId)
  pageCache.set(pageId, promise)
  return promise
}

async function getPageUncached(pageId: string): Promise<ExtendedRecordMap> {
  let recordMap = await notion.getPage(pageId)
  /**
   * @wustep: fix for expiring images by removing signed AWS urls
   * from https://github.com/transitive-bullshit/nextjs-notion-starter-kit/issues/279#issuecomment-1245467818
   */
  if (recordMap && recordMap.signed_urls) {
    const signedUrls = recordMap.signed_urls
    const newSignedUrls: Record<string, string> = {}
    for (const url in signedUrls) {
      if (signedUrls[url] && signedUrls[url].includes('.amazonaws.com')) {
        continue
      }
      newSignedUrls[url] = signedUrls[url]!
    }
    recordMap.signed_urls = newSignedUrls
  }

  if (navigationStyle !== 'default') {
    // ensure that any pages linked to in the custom navigation header have
    // their block info fully resolved in the page record map so we know
    // the page title, slug, etc.
    const navigationLinkRecordMaps = await getNavigationLinkPages()

    if (navigationLinkRecordMaps?.length) {
      recordMap = navigationLinkRecordMaps.reduce(
        (map, navigationLinkRecordMap) =>
          mergeRecordMaps(map, navigationLinkRecordMap),
        recordMap
      )
    }
  }

  if (isPreviewImageSupportEnabled) {
    const previewImageMap = await getPreviewImageMap(recordMap)
    ;(recordMap as any).preview_images = previewImageMap
  }

  await getTweetsMap(recordMap)

  return recordMap
}

export async function search(params: SearchParams): Promise<SearchResults> {
  const key = JSON.stringify(params)
  const cached = searchCache.get(key)
  if (cached) return cached

  const promise = notion.search(params)
  searchCache.set(key, promise)
  return promise
}
