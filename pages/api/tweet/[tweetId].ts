import { type NextApiRequest, type NextApiResponse } from 'next'

import { sendApiError } from '@/lib/api-error'
import { getFreshTweet } from '@/lib/get-tweets'
import { isTweetId } from '@/lib/tweet-embed'

export default async function tweet(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return sendApiError(
      res,
      405,
      'method_not_allowed',
      'This endpoint only accepts GET.'
    )
  }

  const tweetId = typeof req.query.tweetId === 'string' ? req.query.tweetId : ''
  if (!isTweetId(tweetId)) {
    return sendApiError(
      res,
      400,
      'bad_request',
      'A numeric tweet id is required.'
    )
  }

  try {
    const payload = await getFreshTweet(tweetId)
    if (!payload) {
      return sendApiError(res, 404, 'not_found', 'Tweet not found.')
    }

    // Video CDN URLs expire; keep this shorter than the page tweet cache.
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=90, max-age=30, stale-while-revalidate=120'
    )
    return res.status(200).json(payload)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch tweet'
    return sendApiError(res, 502, 'tweet_fetch_failed', message)
  }
}
