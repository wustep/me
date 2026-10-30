import { createHmac, timingSafeEqual } from 'node:crypto'

import type { NextApiRequest } from 'next'

export const OWNER_MODE_COOKIE = 'wustep_owner_mode'

// Sessions carry their issue time and expire server-side, so a copied cookie
// stops working on its own instead of only when the secret is rotated.
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90
const CLOCK_SKEW_SECONDS = 60
// Long enough that guessing online is hopeless even without rate limiting.
// Keep in sync with lib/validate-env.ts.
const MIN_OWNER_SECRET_LENGTH = 32
const SESSION_PURPOSE = 'wustep.me owner mode v2'

function getOwnerSecret() {
  return process.env.OWNER_MODE_SECRET
}

function signSession(secret: string, issuedAt: number) {
  return createHmac('sha256', secret)
    .update(`${SESSION_PURPOSE}:${issuedAt}`)
    .digest('base64url')
}

/** `<issued-at seconds>.<HMAC>` */
function createSessionToken(secret: string) {
  const issuedAt = Math.floor(Date.now() / 1000)
  return `${issuedAt}.${signSession(secret, issuedAt)}`
}

function verifySessionToken(secret: string, token: string) {
  const match = /^(\d{1,12})\.([\w-]+)$/.exec(token)
  if (!match) return false

  const issuedAt = Number(match[1])
  const age = Math.floor(Date.now() / 1000) - issuedAt
  if (age > SESSION_MAX_AGE_SECONDS || age < -CLOCK_SKEW_SECONDS) return false

  return safelyEqual(match[2]!, signSession(secret, issuedAt))
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

  return verifySessionToken(secret, token)
}

export function createOwnerCookie() {
  const secret = getOwnerSecret()
  if (!secret || secret.length < MIN_OWNER_SECRET_LENGTH) {
    throw new Error(
      `OWNER_MODE_SECRET must contain at least ${MIN_OWNER_SECRET_LENGTH} characters`
    )
  }

  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${OWNER_MODE_COOKIE}=${createSessionToken(secret)}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`
}

export function clearOwnerCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${OWNER_MODE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`
}
