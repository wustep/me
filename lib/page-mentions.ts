import { type ExtendedRecordMap } from 'notion-types'
import { getBlockValue, mergeRecordMaps, parsePageId } from 'notion-utils'
import pMap from 'p-map'

import { getErrorMessage } from './utils'

const MENTION_FETCH_OPTIONS = {
  chunkLimit: 1,
  fetchMissingBlocks: false,
  fetchCollections: false,
  signFileUrls: false
} as const

const MENTION_FETCH_CONCURRENCY = 4

export type MentionPageFetcher = (
  pageId: string,
  options: typeof MENTION_FETCH_OPTIONS
) => Promise<ExtendedRecordMap>

/**
 * Page IDs from `p` decorations in block text properties. react-notion-x
 * needs those page blocks (at least title) in `recordMap.block` to render
 * mention text; missing ones collapse to empty.
 */
export function getMentionedPageIds(recordMap: ExtendedRecordMap): string[] {
  const ids = new Set<string>()

  for (const wrapper of Object.values(recordMap.block || {})) {
    const block = getBlockValue(wrapper)
    const properties = block?.properties
    if (!properties) continue

    for (const value of Object.values(properties)) {
      collectMentionPageIds(value, ids)
    }
  }

  return [...ids]
}

function collectMentionPageIds(value: unknown, ids: Set<string>): void {
  if (!Array.isArray(value)) return

  for (const segment of value) {
    if (!Array.isArray(segment) || !Array.isArray(segment[1])) continue

    for (const decoration of segment[1]) {
      if (!Array.isArray(decoration) || decoration[0] !== 'p') continue
      const pageId = parsePageId(String(decoration[1] ?? ''), { uuid: true })
      if (pageId) ids.add(pageId)
    }
  }
}

export function hasPageBlock(
  recordMap: ExtendedRecordMap,
  pageId: string
): boolean {
  const dashed = parsePageId(pageId, { uuid: true })
  const compact = parsePageId(pageId, { uuid: false })

  for (const key of [pageId, dashed, compact]) {
    if (key && getBlockValue(recordMap.block?.[key])) {
      return true
    }
  }

  return false
}

export function getMissingMentionPageIds(
  recordMap: ExtendedRecordMap
): string[] {
  return getMentionedPageIds(recordMap).filter(
    (id) => !hasPageBlock(recordMap, id)
  )
}

/**
 * Copy a fetched page block onto the dashed mention id when Notion keyed it
 * differently, so react-notion-x's `recordMap.block[decorator[1]]` lookup hits.
 */
export function aliasPageBlock(
  recordMap: ExtendedRecordMap,
  pageId: string
): void {
  const dashed = parsePageId(pageId, { uuid: true })
  if (!dashed || getBlockValue(recordMap.block?.[dashed])) return

  const compact = parsePageId(pageId, { uuid: false })
  const sourceKey = [pageId, compact].find(
    (key) => key && getBlockValue(recordMap.block?.[key])
  )
  if (!sourceKey) return

  recordMap.block[dashed] = recordMap.block[sourceKey]!
}

/**
 * Fetch page-mention targets that are missing from `recordMap.block` and merge
 * them in. One pass only — mentioned pages are loaded for title/icon, not
 * crawled for further mentions (avoids cycles).
 */
export async function mergeMentionedPages(
  recordMap: ExtendedRecordMap,
  fetchPage: MentionPageFetcher
): Promise<ExtendedRecordMap> {
  const missing = getMissingMentionPageIds(recordMap)
  if (!missing.length) return recordMap

  const mentionMaps = await pMap(
    missing,
    async (pageId) => {
      try {
        return await fetchPage(pageId, MENTION_FETCH_OPTIONS)
      } catch (err) {
        console.warn(
          `Failed to fetch mentioned page ${pageId}`,
          getErrorMessage(err)
        )
        return null
      }
    },
    { concurrency: MENTION_FETCH_CONCURRENCY }
  )

  let merged = recordMap
  for (const mentionMap of mentionMaps) {
    if (!mentionMap) continue
    merged = mergeRecordMaps(merged, mentionMap)
  }

  for (const pageId of missing) {
    aliasPageBlock(merged, pageId)
  }

  return merged
}
