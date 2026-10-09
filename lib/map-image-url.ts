import { type Block } from 'notion-types'
import { defaultMapImageUrl } from 'notion-utils'

import { defaultPageCover, defaultPageIcon } from './config'
import {
  isAttachmentSource,
  isGifSource,
  isLegacyFileGifSource,
  notionFileProxyUrl
} from './rewrite-video-urls'

function notionImageProxyUrl(url: string, block: Block): string {
  const notionImageUrl = new URL(
    `https://www.notion.so/image/${encodeURIComponent(url)}`
  )
  let table = block.parent_table === 'space' ? 'block' : block.parent_table
  if (!table || table === 'collection' || table === 'team') {
    table = 'block'
  }
  notionImageUrl.searchParams.set('table', table)
  notionImageUrl.searchParams.set('id', block.id)
  notionImageUrl.searchParams.set('cache', 'v2')
  return notionImageUrl.toString()
}

export const mapImageUrl = (url: string | undefined, block: Block) => {
  if (url === defaultPageCover || url === defaultPageIcon) {
    return url
  }

  if (!url) {
    return undefined
  }

  // Same-origin re-signer (videos + attachment GIFs). Do not wrap again.
  if (url.includes('/api/notion-file')) {
    return url
  }

  // notion-utils' GIF_REGEXP returns `*.gif` URLs unproxied — correct for
  // public CDNs, but `attachment:…gif` is not fetchable. Send those through
  // the same re-signer videos use. Other attachment: stills use Notion's
  // image proxy (needed for HEIC conversion).
  if (isAttachmentSource(url)) {
    const clean = url.replace(/[?#].*$/, '')
    if (isGifSource(clean)) {
      return notionFileProxyUrl(block.id, clean)
    }
    return notionImageProxyUrl(clean, block)
  }

  // Older uploads store a raw, unsigned S3 URL as the source. Stills are
  // fine through the image proxy below, but GIFs pass through unproxied and
  // S3 answers 403. Re-sign those the same way as attachment GIFs.
  if (isLegacyFileGifSource(url)) {
    return notionFileProxyUrl(block.id, url)
  }

  return defaultMapImageUrl(url, block)
}

/**
 * `www.notion.so/image` now 302s to `img.notionusercontent.com`. next/image
 * treats that redirect as an invalid upstream response, so those srcs must
 * skip the optimizer and let the browser follow the redirect.
 */
export function shouldUnoptimizeNotionImage(
  src: string | undefined | null
): boolean {
  if (!src) {
    return false
  }

  return (
    src.includes('notion.so/image') ||
    src.includes('/api/notion-file') ||
    src.includes('attachment:') ||
    /\.heic(?:$|[?#])/i.test(src)
  )
}
