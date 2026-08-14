import { type Block } from 'notion-types'
import { defaultMapImageUrl } from 'notion-utils'

import { defaultPageCover, defaultPageIcon } from './config'

export const mapImageUrl = (url: string | undefined, block: Block) => {
  if (url === defaultPageCover || url === defaultPageIcon) {
    return url
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
    src.includes('attachment:') ||
    /\.heic(?:$|[?#])/i.test(src)
  )
}
