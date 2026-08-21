import { type NextApiRequest, type NextApiResponse } from 'next'

import { apiError } from '@/lib/api-error'
import {
  clearOwnerCookie,
  createOwnerCookie,
  isOwnerModeConfigured,
  isOwnerRequest,
  verifyOwnerSecret
} from '@/lib/owner-mode-server'

type OwnerModeResponse = {
  error?: string
  message?: string
  status?: number
  isOwner: boolean
}

function ownerError(
  status: number,
  error: string,
  message = error
): OwnerModeResponse {
  return { ...apiError(status, error, message), isOwner: false }
}

export default function ownerMode(
  req: NextApiRequest,
  res: NextApiResponse<OwnerModeResponse>
) {
  res.setHeader('Cache-Control', 'private, no-store')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method === 'GET') {
    return res.status(200).json({ isOwner: isOwnerRequest(req) })
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearOwnerCookie())
    return res.status(200).json({ isOwner: false })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, DELETE')
    return res
      .status(405)
      .json(ownerError(405, 'method_not_allowed', 'Use GET, POST, or DELETE.'))
  }

  if (!isOwnerModeConfigured()) {
    return res
      .status(503)
      .json(ownerError(503, 'not_configured', 'Owner mode is not configured.'))
  }

  const secret = typeof req.body?.secret === 'string' ? req.body.secret : ''
  if (!secret || secret.length > 512 || !verifyOwnerSecret(secret)) {
    return res
      .status(401)
      .json(ownerError(401, 'invalid_secret', 'That owner key is not valid.'))
  }

  res.setHeader('Set-Cookie', createOwnerCookie())
  return res.status(200).json({ isOwner: true })
}
