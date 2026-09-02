import { type NextApiRequest, type NextApiResponse } from 'next'
import { parsePageId } from 'notion-utils'

import { sendApiError } from '@/lib/api-error'
import { notion } from '@/lib/notion-api'
import { isExpiringSignedFileUrl } from '@/lib/signed-file-urls'

function isSignableFileUrl(url: string): boolean {
  if (url.startsWith('attachment:')) return true
  return isExpiringSignedFileUrl(url)
}

export default async function notionFile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return sendApiError(
      res,
      405,
      'method_not_allowed',
      'This endpoint only accepts GET.'
    )
  }

  const blockId = typeof req.query.id === 'string' ? req.query.id : ''
  const source = typeof req.query.url === 'string' ? req.query.url : ''
  const pageId = parsePageId(blockId, { uuid: true })

  if (!pageId || !source || !isSignableFileUrl(source)) {
    return sendApiError(
      res,
      400,
      'bad_request',
      'A Notion block id and signable file url are required.'
    )
  }

  try {
    const { signedUrls } = await notion.getSignedFileUrls([
      {
        permissionRecord: { table: 'block', id: pageId },
        url: source
      }
    ])
    const signedUrl = signedUrls?.[0]
    if (!signedUrl) {
      return sendApiError(res, 404, 'not_found', 'No signed URL for that file.')
    }

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, max-age=60, stale-while-revalidate=600'
    )
    res.redirect(302, signedUrl)
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Failed to sign Notion file URL'
    return sendApiError(res, 502, 'sign_failed', message)
  }
}
