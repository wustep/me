import type { NextApiResponse } from 'next'

export type ApiErrorBody = {
  error: string
  message: string
  status: number
}

export function apiError(
  status: number,
  error: string,
  message = error
): ApiErrorBody {
  return { error, message, status }
}

/**
 * Short CDN cache for error responses, so a flood of identical bad requests
 * (random ids, missing files) is answered at the edge instead of each one
 * reaching Notion. 5xx clears quickly so real outages recover fast.
 */
export function errorCacheControl(status: number): string {
  return `public, max-age=0, s-maxage=${status >= 500 ? 10 : 60}`
}

export function sendApiError(
  res: NextApiResponse,
  status: number,
  error: string,
  message = error
) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  if (!res.getHeader('Cache-Control')) {
    res.setHeader('Cache-Control', errorCacheControl(status))
  }
  return res.status(status).json(apiError(status, error, message))
}

export function apiErrorResponse(
  status: number,
  error: string,
  message = error
): Response {
  return Response.json(apiError(status, error, message), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': errorCacheControl(status)
    }
  })
}
