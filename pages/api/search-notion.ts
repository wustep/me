import { type NextApiRequest, type NextApiResponse } from 'next'

import { sendApiError } from '@/lib/api-error'
import { isSearchEnabled, rootNotionPageId } from '@/lib/config'
import { sanitizeSearchParams } from '@/lib/search-params'

import { search } from '../../lib/notion'

export default async function searchNotion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Search is off site-wide; don't leave an open Notion search proxy behind.
  if (!isSearchEnabled) {
    return sendApiError(res, 404, 'not_found', 'Search is disabled.')
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendApiError(
      res,
      405,
      'method_not_allowed',
      'This endpoint only accepts POST.'
    )
  }

  const searchParams = sanitizeSearchParams(req.body, rootNotionPageId)
  if (!searchParams) {
    return sendApiError(
      res,
      400,
      'invalid_request',
      'Expected a JSON body with a non-empty string `query`.'
    )
  }

  try {
    const results = await search(searchParams)

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, max-age=60, stale-while-revalidate=3600'
    )
    return res.status(200).json(results)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Notion search failed'
    return sendApiError(res, 502, 'search_failed', message)
  }
}
