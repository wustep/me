import { type NextApiResponse } from 'next'
import { describe, expect, it } from 'vitest'

import { apiErrorResponse, sendApiError } from '../api-error'

/** Minimal NextApiResponse that records headers, status, and body. */
function mockResponse() {
  const headers: Record<string, string> = {}
  const sent: { status?: number; body?: unknown } = {}
  const res = {
    setHeader: (key: string, value: string) => {
      headers[key.toLowerCase()] = value
      return res
    },
    getHeader: (key: string) => headers[key.toLowerCase()],
    status: (status: number) => {
      sent.status = status
      return res
    },
    json: (body: unknown) => {
      sent.body = body
      return res
    }
  }
  return { res: res as unknown as NextApiResponse, headers, sent }
}

describe('sendApiError', () => {
  it('gives 4xx a short CDN cache and 5xx a shorter one', () => {
    const notFound = mockResponse()
    sendApiError(notFound.res, 404, 'not_found')
    expect(notFound.headers['cache-control']).toBe(
      'public, max-age=0, s-maxage=60'
    )
    expect(notFound.sent).toEqual({
      status: 404,
      body: { error: 'not_found', message: 'not_found', status: 404 }
    })

    const upstream = mockResponse()
    sendApiError(upstream.res, 502, 'sign_failed')
    expect(upstream.headers['cache-control']).toBe(
      'public, max-age=0, s-maxage=10'
    )
  })

  it('keeps a Cache-Control the route already set', () => {
    const { res, headers } = mockResponse()
    res.setHeader('Cache-Control', 'private, no-store')
    sendApiError(res, 401, 'invalid_secret')
    expect(headers['cache-control']).toBe('private, no-store')
  })
})

describe('apiErrorResponse', () => {
  it('sets the same negative cache on edge responses', async () => {
    const response = apiErrorResponse(404, 'not_found', 'No such lens.')
    expect(response.status).toBe(404)
    expect(response.headers.get('Cache-Control')).toBe(
      'public, max-age=0, s-maxage=60'
    )
    expect(await response.json()).toEqual({
      error: 'not_found',
      message: 'No such lens.',
      status: 404
    })
  })
})
