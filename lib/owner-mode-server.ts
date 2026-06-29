import { createHmac, timingSafeEqual } from 'node:crypto'

import type { NextApiRequest } from 'next'

export const OWNER_MODE_COOKIE = 'wustep_owner_mode'

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365
const MIN_OWNER_SECRET_LENGTH = 8
const SESSION_PURPOSE = 'wustep.me owner mode v1'

function getOwnerSecret() {
  return process.env.OWNER_MODE_SECRET
}

function createSessionToken(secret: string) {
  return createHmac('sha256', secret)
    .update(SESSION_PURPOSE)
    .digest('base64url')
}

function safelyEqual(left: string, right: string) {
  const leftDigest = createHmac('sha256', 'owner-mode-compare')
    .update(left)
    .digest()
  const rightDigest = createHmac('sha256', 'owner-mode-compare')
    .update(right)
    .digest()

  return timingSafeEqual(leftDigest, rightDigest)
}

export function isOwnerModeConfigured() {
  const secret = getOwnerSecret()
  return typeof secret === 'string' && secret.length >= MIN_OWNER_SECRET_LENGTH
}

export function verifyOwnerSecret(candidate: string) {
  const secret = getOwnerSecret()
  if (!secret || secret.length < MIN_OWNER_SECRET_LENGTH) return false

  return safelyEqual(candidate, secret)
}

export function isOwnerRequest(req: Pick<NextApiRequest, 'cookies'>): boolean {
  const secret = getOwnerSecret()
  const token = req.cookies[OWNER_MODE_COOKIE]
  if (!secret || secret.length < MIN_OWNER_SECRET_LENGTH || !token) return false

  return safelyEqual(token, createSessionToken(secret))
}

export function createOwnerCookie() {
  const secret = getOwnerSecret()
  if (!secret || secret.length < MIN_OWNER_SECRET_LENGTH) {
    throw new Error(
      `OWNER_MODE_SECRET must contain at least ${MIN_OWNER_SECRET_LENGTH} characters`
    )
  }

  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${OWNER_MODE_COOKIE}=${createSessionToken(secret)}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`
}

export function clearOwnerCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${OWNER_MODE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`
}
