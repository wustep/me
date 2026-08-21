import { type NextApiRequest, type NextApiResponse } from 'next'

import { sendApiError } from '@/lib/api-error'

import type * as types from '../../lib/types'
import { search } from '../../lib/notion'

export default async function searchNotion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendApiError(
      res,
      405,
      'method_not_allowed',
      'This endpoint only accepts POST.'
    )
  }

  try {
    const searchParams: types.SearchParams = req.body
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
