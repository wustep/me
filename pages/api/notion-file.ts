import { type NextApiRequest, type NextApiResponse } from 'next'
import { getBlockValue, parsePageId } from 'notion-utils'

import { sendApiError } from '@/lib/api-error'
import { rootNotionSpaceId } from '@/lib/config'
import { notion } from '@/lib/notion-api'
import {
  blockReferencesFile,
  isSignableNotionFileUrl
} from '@/lib/signed-file-urls'

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

  if (!pageId || !source || !isSignableNotionFileUrl(source)) {
    return sendApiError(
      res,
      400,
      'bad_request',
      'A Notion block id and signable file url are required.'
    )
  }

  try {
    // Only sign files that belong to a block in this site's workspace, and
    // only the file that block actually references. Otherwise this route is
    // an open signer for any Notion file whose block and file ids are known.
    const { recordMap } = await notion.getBlocks([pageId])
    const block = getBlockValue(recordMap?.block?.[pageId])
    if (
      !block ||
      (rootNotionSpaceId && block.space_id !== rootNotionSpaceId) ||
      !blockReferencesFile(block, source)
    ) {
      return sendApiError(res, 404, 'not_found', 'No signed URL for that file.')
    }

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
    console.error('notion-file: failed to sign', pageId, err)
    return sendApiError(
      res,
      502,
      'sign_failed',
      'Failed to sign Notion file URL.'
    )
  }
}
