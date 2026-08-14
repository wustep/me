import {
  getAllPagesInSpace,
  getBlockValue,
  getPageProperty
} from 'notion-utils'
import pMemoize from 'p-memoize'

import type * as types from './types'
import * as config from './config'
import { includeNotionIdInUrls } from './config'
import { getCanonicalPageId } from './get-canonical-page-id'
import { buildNotion } from './notion-api'
import { collectPublicPageSlugs } from './page-slug'

const uuid = !!includeNotionIdInUrls

export async function getSiteMap(): Promise<types.SiteMap> {
  const partialSiteMap = await getAllPages(
    config.rootNotionPageId,
    config.rootNotionSpaceId ?? undefined
  )

  return {
    site: config.site,
    ...partialSiteMap
  } as types.SiteMap
}

const getAllPages = pMemoize(getAllPagesImpl, {
  cacheKey: (...args) => JSON.stringify(args)
})

const getPage = async (pageId: string, opts?: any) => {
  return buildNotion.getPage(pageId, {
    ...opts,
    ofetchOptions: {
      retry: 0,
      timeout: 30_000
    }
  })
}

async function getAllPagesImpl(
  rootNotionPageId: string,
  rootNotionSpaceId?: string,
  {
    maxDepth = 1
  }: {
    maxDepth?: number
  } = {}
): Promise<Partial<types.SiteMap>> {
  const pageMap = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    getPage,
    {
      concurrency: 1,
      maxDepth
    }
  )

  const canonicalPageMap = Object.keys(pageMap).reduce(
    (map: Record<string, string>, pageId: string) => {
      const recordMap = pageMap[pageId]
      if (!recordMap) {
        throw new Error(`Error loading page "${pageId}"`)
      }

      const block = getBlockValue(recordMap.block[pageId])
      if (
        !(getPageProperty<boolean | null>('Public', block!, recordMap) ?? true)
      ) {
        return map
      }

      const canonicalPageId = getCanonicalPageId(pageId, recordMap, {
        uuid
      })

      if (!canonicalPageId) {
        // Skip rather than crash the whole crawl: a single unresolvable page
        // shouldn't corrupt the generated index/sitemap.
        console.warn('skipping page with no canonical id', { pageId })
        return map
      }

      if (map[canonicalPageId]) {
        // you can have multiple pages in different collections that have the same id
        // TODO: we may want to error if neither entry is a collection page
        console.warn('error duplicate canonical page id', {
          canonicalPageId,
          pageId,
          existingPageId: map[canonicalPageId]
        })

        return map
      } else {
        return {
          ...map,
          [canonicalPageId]: pageId
        }
      }
    },
    {}
  )

  // Home collection views filter out "Hide from home". Override pages like
  // /writing still list those public posts, so merge their slugs into the
  // index or the cards 404.
  for (const overridePageId of new Set(
    Object.values(config.pageUrlOverrides)
  )) {
    try {
      const recordMap = await getPage(overridePageId)
      const extra = collectPublicPageSlugs(recordMap)
      for (const [slug, pageId] of Object.entries(extra)) {
        if (!canonicalPageMap[slug]) {
          canonicalPageMap[slug] = pageId
        }
      }
    } catch (err) {
      console.warn(
        'failed to index override page collections',
        overridePageId,
        err
      )
    }
  }

  return {
    pageMap,
    canonicalPageMap
  }
}
