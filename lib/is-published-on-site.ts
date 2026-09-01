import { parsePageId } from 'notion-utils'

import { pageUrlAdditions, pageUrlOverrides } from './config'
import { canonicalPageMap } from './notion-index'

const publishedPageIds = new Set(
  [
    ...Object.values(pageUrlOverrides),
    ...Object.values(pageUrlAdditions),
    ...Object.values(canonicalPageMap)
  ]
    .map((id) => parsePageId(id, { uuid: false }))
    .filter(Boolean)
)

function hasPublishedSlug(slug: string): boolean {
  // A raw Notion id is a valid inbound path, but it is not a published slug.
  if (parsePageId(slug)) return false
  const trimmed = slug.replace(/^\/+/, '')
  return Boolean(
    canonicalPageMap[trimmed] ||
    canonicalPageMap[slug] ||
    pageUrlOverrides[trimmed] ||
    pageUrlOverrides[`/${trimmed}`] ||
    pageUrlAdditions[trimmed] ||
    pageUrlAdditions[`/${trimmed}`]
  )
}

/**
 * True when this page is a URL the site can render (committed index or
 * configured override). Mentions of unpublished Notion pages must not be
 * rewritten to a wustep.me slug that 404s.
 */
export function isPublishedOnSite(
  pageId: string,
  slug?: string | undefined
): boolean {
  const normalized = parsePageId(pageId, { uuid: false })
  if (normalized && publishedPageIds.has(normalized)) {
    return true
  }
  return Boolean(slug && hasPublishedSlug(slug))
}
