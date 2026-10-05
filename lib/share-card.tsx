import { host } from './config'

/**
 * Absolute URL for a committed share card in public/og/ — e.g.
 * `shareCardUrl('prompting-tree')` or `shareCardUrl('playground/bookshelf')`.
 * Every card there is a 1200×630 PNG.
 */
export function shareCardUrl(name: string) {
  return `${host}/og/${name}.png`
}

/**
 * Link-preview image tags for a 1200×630 card, for use directly inside
 * next/head (a fragment, not a component, so next/head still picks the tags
 * up on client navigation). Keeps og:image and twitter:image in lockstep and
 * always declares the size, so unfurlers render the large card without first
 * fetching the image.
 */
export function shareCardMeta(imageUrl: string, alt?: string) {
  return (
    <>
      <meta property='og:image' content={imageUrl} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:image:type' content='image/png' />
      {alt && <meta property='og:image:alt' content={alt} />}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:image' content={imageUrl} />
    </>
  )
}
