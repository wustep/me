const TWEET_ID_RE = /^[0-9]{1,20}$/

/**
 * react-notion-x sometimes passes the status id with a leftover
 * `spaceId` query (`123&spaceId=…` or `123?spaceId=…`).
 */
export function parseNotionTweetId(id: string | undefined | null): string {
  if (!id) return ''
  return id.split(/[?&]/)[0] ?? ''
}

export function isTweetId(id: string): boolean {
  return TWEET_ID_RE.test(id)
}

/**
 * Prefer a live syndication payload so `TweetMediaVideo` can `play()` a
 * fresh `video.twimg.com` URL. `undefined` means the live fetch is still
 * in flight; `null` means it failed or the tweet is gone.
 */
export function resolveTweetForEmbed<T>(
  live: T | null | undefined,
  cached: T | null | undefined
): T | null | undefined {
  if (live) return live
  if (live === null) return cached ?? null
  return cached
}
