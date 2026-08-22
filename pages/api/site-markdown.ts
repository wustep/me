import { type NextApiRequest, type NextApiResponse } from 'next'

import { markdownContentType } from '@/lib/accept'
import { markdownForPath } from '@/lib/agent-content'
import { sendApiError } from '@/lib/api-error'

/**
 * Internal handler for Accept: text/markdown. Middleware rewrites here so
 * HEAD (`curl -sI`) keeps Content-Type — Vercel strips it from empty
 * middleware responses. Not a public product API.
 */
export default function siteMarkdown(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return sendApiError(
      res,
      405,
      'method_not_allowed',
      'Use GET or HEAD with Accept: text/markdown on site pages.'
    )
  }

  const headerPath = req.headers['x-markdown-path']
  const queryPath = req.query.path
  const path =
    typeof headerPath === 'string'
      ? headerPath
      : typeof queryPath === 'string'
        ? queryPath
        : '/'
  const { body, status } = markdownForPath(path)
  const type = markdownContentType(
    typeof req.headers.accept === 'string' ? req.headers.accept : null
  )

  res.setHeader('Content-Type', type)
  res.setHeader('Vary', 'Accept')
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600')
  res.setHeader('Content-Length', String(Buffer.byteLength(body)))
  res.status(status)
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  res.send(body)
}
