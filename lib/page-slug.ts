import { type Block, type ExtendedRecordMap } from 'notion-types'
import {
  getBlockTitle,
  getBlockValue,
  getPageProperty,
  parsePageId
} from 'notion-utils'

/**
 * URL slug for a collection page: the explicit `Slug` property when set,
 * otherwise a title-derived kebab slug. Matches how writing cards and the
 * RSS feed already build hrefs.
 */
export function getPageSlug(
  block: Block,
  recordMap: ExtendedRecordMap
): string | undefined {
  const explicit = getPageProperty<string>('Slug', block, recordMap)?.trim()
  if (explicit) {
    return explicit.replace(/^\/+/, '')
  }

  const title = getBlockTitle(block, recordMap)
  if (!title) {
    return undefined
  }

  return slugifyTitle(title)
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-|-$/g, '')
}

/**
 * Collect slug → page-id mappings from collection pages already present in a
 * record map (e.g. the /writing gallery). Hidden-from-home public posts show
 * up here even though the home-page crawl never sees them.
 */
export function collectPublicPageSlugs(
  recordMap: ExtendedRecordMap
): Record<string, string> {
  const map: Record<string, string> = {}

  for (const blockId of Object.keys(recordMap.block || {})) {
    const block = getBlockValue(recordMap.block[blockId])
    if (
      !block ||
      block.type !== 'page' ||
      block.parent_table !== 'collection'
    ) {
      continue
    }

    if (getPageProperty<boolean>('Public', block, recordMap) === false) {
      continue
    }

    const slug = getPageSlug(block, recordMap)
    const pageId = parsePageId(blockId, { uuid: true })
    if (!slug || !pageId) {
      continue
    }

    map[slug] ??= pageId
  }

  return map
}
