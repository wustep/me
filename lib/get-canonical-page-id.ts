import { type ExtendedRecordMap } from 'notion-types'
import {
  getBlockValue,
  getCanonicalPageId as getCanonicalPageIdImpl,
  getPageProperty,
  parsePageId
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | undefined {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return
  }

  const override = inversePageUrlOverrides[cleanPageId]
  if (override) {
    return override
  }

  // Prefer the collection `Slug` property when the block is present. The
  // writing index and RSS feed use the same field; falling through to
  // notion-utils still slugifies the title if Slug is empty.
  const uuidPageId = parsePageId(pageId, { uuid: true })
  const block =
    (uuidPageId && getBlockValue(recordMap.block?.[uuidPageId])) ||
    getBlockValue(recordMap.block?.[pageId])
  const explicitSlug = block
    ? getPageProperty<string>('Slug', block, recordMap)?.trim()
    : undefined
  if (explicitSlug) {
    const slug = explicitSlug.replace(/^\/+/, '')
    return uuid ? `${slug}-${cleanPageId}` : slug
  }

  return (
    getCanonicalPageIdImpl(pageId, recordMap, {
      uuid
    }) ?? undefined
  )
}
