import type { NextApiRequest, NextApiResponse } from 'next'

import {
  clearOwnerCookie,
  createOwnerCookie,
  isOwnerModeConfigured,
  isOwnerRequest,
  verifyOwnerSecret
} from '@/lib/owner-mode-server'

type OwnerModeResponse = {
  error?: string
  isOwner: boolean
}

export default function ownerMode(
  req: NextApiRequest,
  res: NextApiResponse<OwnerModeResponse>
) {
  res.setHeader('Cache-Control', 'private, no-store')

  if (req.method === 'GET') {
    return res.status(200).json({ isOwner: isOwnerRequest(req) })
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearOwnerCookie())
    return res.status(200).json({ isOwner: false })
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, DELETE')
    return res.status(405).json({
      error: 'Method not allowed',
      isOwner: false
    })
  }

  if (!isOwnerModeConfigured()) {
    return res.status(503).json({
      error: 'Owner mode is not configured.',
      isOwner: false
    })
  }

  const secret = typeof req.body?.secret === 'string' ? req.body.secret : ''
  if (!secret || secret.length > 512 || !verifyOwnerSecret(secret)) {
    return res.status(401).json({
      error: 'That owner key is not valid.',
      isOwner: false
    })
  }

  res.setHeader('Set-Cookie', createOwnerCookie())
  return res.status(200).json({ isOwner: true })
}
