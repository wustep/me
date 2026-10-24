import { host } from './config'

/**
 * Absolute URL for a committed share card in public/og/ — e.g.
 * `shareCardUrl('prompting-tree')` or `shareCardUrl('playground/bookshelf')`.
 * Every card there is a 1200×630 PNG.
 */
export function shareCardUrl(name: string) {
  return `${host}/og/${name}.png`
}

/** A looping, silent link-preview video. */
export type ShareVideo = {
  /** Absolute URL. */
  url: string
  width: number
  height: number
  /** MIME type, e.g. `video/mp4`. */
  type: string
}

/**
 * A committed 1200×630 H.264 preview in public/ — e.g.
 * `shareVideo('playground/og/playground')` for
 * public/playground/og/playground.mp4 (made by scripts/og-video/).
 */
export function shareVideo(name: string): ShareVideo {
  return {
    url: `${host}/${name}.mp4`,
    width: 1200,
    height: 630,
    type: 'video/mp4'
  }
}

/**
 * og:video tags, alongside (never instead of) the og:image card: unfurlers
 * that play og:video show the clip, and the rest keep the still. Like
 * shareCardMeta, a fragment for use directly inside next/head.
 */
export function shareVideoMeta(video: ShareVideo) {
  return (
    <>
      <meta property='og:video' content={video.url} />
      <meta property='og:video:secure_url' content={video.url} />
      <meta property='og:video:type' content={video.type} />
      <meta property='og:video:width' content={String(video.width)} />
      <meta property='og:video:height' content={String(video.height)} />
    </>
  )
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
