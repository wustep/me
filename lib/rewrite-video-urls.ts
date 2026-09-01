import { type ExtendedRecordMap } from 'notion-types'
import { getBlockValue } from 'notion-utils'

import { siteUrl } from './site-identity'

const EMBED_HOST_RE =
  /youtube|youtu\.be|vimeo|wistia|loom|videoask|getcloudapp|tella/i

export function mediaProxyOrigin(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:${process.env.PORT ?? '6363'}`
  }
  return siteUrl
}

export function isGifSource(source: string): boolean {
  return /\.gif(?:$|[?#])/i.test(source)
}

export function isAttachmentSource(source: string): boolean {
  return source.startsWith('attachment:')
}

/** Same-origin re-signer. Absolute so react-notion-x can `new URL(source)`. */
export function notionFileProxyUrl(blockId: string, source: string): string {
  const params = new URLSearchParams({
    id: blockId,
    url: source.replace(/[?#].*$/, '')
  })
  return `${mediaProxyOrigin()}/api/notion-file?${params}`
}

/**
 * react-notion-x plays uploaded videos from `signed_urls` or the raw
 * `attachment:` source. We strip expiring signed hosts (images go through
 * Notion's image proxy instead), so videos are left with `attachment:` —
 * which `new URL()` throws on when the block has a spaceId.
 *
 * The same `attachment:` source is used for uploaded GIFs. notion-utils'
 * image mapper leaves `*.gif` URLs unproxied, so those also need a
 * fetchable HTTPS URL.
 *
 * Point those sources at a same-origin re-signer so the player / <img>
 * gets a fresh URL at request time.
 */
export function rewriteVideoSources(recordMap: ExtendedRecordMap): void {
  if (!recordMap.block) return

  for (const [blockId, wrapper] of Object.entries(recordMap.block)) {
    const block = getBlockValue(wrapper)
    if (block?.type !== 'video' && block?.type !== 'image') continue

    const source = block.properties?.source?.[0]?.[0]
    if (!source || EMBED_HOST_RE.test(source)) continue
    // Image proxy handles stills; only attachment GIFs need the file API.
    if (
      block.type === 'image' &&
      !(isGifSource(source) && isAttachmentSource(source))
    ) {
      continue
    }

    recordMap.signed_urls ??= {}
    recordMap.signed_urls[blockId] = notionFileProxyUrl(blockId, source)
  }
}
