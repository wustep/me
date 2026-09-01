import * as React from 'react'
import { useNotionContext } from 'react-notion-x'
import { EmbeddedTweet, TweetNotFound, TweetSkeleton } from 'react-tweet'

import type * as types from '@/lib/types'
import { parseNotionTweetId, resolveTweetForEmbed } from '@/lib/tweet-embed'
import { useDarkMode } from '@/lib/use-dark-mode'

/**
 * The react-tweet boundary, split out of NotionPage so it can be `dynamic()`d.
 * Very few pages embed a tweet, but a static import put react-tweet (and its
 * styles) in the shared bundle for every Notion page on the site.
 *
 * react-tweet only applies dark tokens for `[data-theme=dark]`, `.dark`, or
 * `prefers-color-scheme`. This site toggles `body.dark-mode`, so the embed
 * must inherit an explicit theme from the page toggle.
 *
 * Notion-cached `recordMap.tweets` posters stay valid, but syndication
 * `video.twimg.com` URLs go stale — so we live-fetch at request time and
 * only fall back to the cache (or TweetNotFound) if that fails. No official
 * X iframe widget.
 */
export default function NotionTweet({ id }: { id: string }) {
  const { recordMap } = useNotionContext()
  const { isDarkMode } = useDarkMode()
  const tweetId = parseNotionTweetId(id)
  const cached = tweetId
    ? (recordMap as types.ExtendedTweetRecordMap)?.tweets?.[tweetId]
    : undefined

  const [live, setLive] = React.useState<unknown>(undefined)

  React.useEffect(() => {
    if (!tweetId) {
      setLive(null)
      return
    }

    const controller = new AbortController()
    setLive(undefined)

    fetch(`/api/tweet/${tweetId}`, { signal: controller.signal })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((payload) => {
        setLive(payload)
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setLive(null)
      })

    return () => controller.abort()
  }, [tweetId])

  const tweet = resolveTweetForEmbed(live, cached)

  return (
    <div data-theme={isDarkMode ? 'dark' : 'light'}>
      <React.Suspense fallback={<TweetSkeleton />}>
        {tweet ? (
          <EmbeddedTweet tweet={tweet as never} />
        ) : tweet === undefined ? (
          <TweetSkeleton />
        ) : (
          <TweetNotFound />
        )}
      </React.Suspense>
    </div>
  )
}
