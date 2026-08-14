import { type ExtendedRecordMap } from 'notion-types'

import type { PageProps } from './types'
import * as acl from './acl'
import { pageUrlAdditions, pageUrlOverrides, site } from './config'
import { getPage } from './notion'
import { canonicalPageMap } from './notion-index'
import { getOverrideCollectionSlugMap } from './posts-collection'
import { lookupSlug, resolvePageIdFromMaps } from './resolve-page-id'

export async function resolveNotionPage(
  domain: string,
  rawPageId?: string
): Promise<PageProps> {
  let pageId: string | undefined
  let recordMap: ExtendedRecordMap

  if (rawPageId && rawPageId !== 'index') {
    pageId = resolvePageIdFromMaps(rawPageId, {
      pageUrlOverrides,
      pageUrlAdditions,
      canonicalPageMap
    })

    // Public posts hidden from the home crawl (e.g. /writing cards) are
    // missing from the committed index. Resolve them from override-page
    // collections so those hrefs don't 404.
    if (!pageId) {
      pageId = lookupSlug(rawPageId, await getOverrideCollectionSlugMap())
    }

    if (pageId) {
      recordMap = await getPage(pageId)
    } else {
      return {
        error: {
          message: `Not found "${rawPageId}"`,
          statusCode: 404
        }
      }
    }
  } else {
    pageId = site.rootNotionPageId

    recordMap = await getPage(pageId)
  }

  const props: PageProps = { site, recordMap, pageId }
  return { ...props, ...(await acl.pageAcl(props)) }
}
