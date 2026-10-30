import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  clearOwnerCookie,
  createOwnerCookie,
  isOwnerModeConfigured,
  isOwnerRequest,
  OWNER_MODE_COOKIE,
  verifyOwnerSecret
} from '../owner-mode-server'

const SECRET = 'correct horse battery staple, mark 2'
const OTHER_SECRET = 'a different secret that is long enough'
const DAY_MS = 24 * 60 * 60 * 1000

/** `name=value` from a Set-Cookie string, as a request's parsed cookies. */
function cookiesFrom(setCookie: string): Record<string, string> {
  const [pair = ''] = setCookie.split(';')
  const eq = pair.indexOf('=')
  return { [pair.slice(0, eq)]: pair.slice(eq + 1) }
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

describe('owner mode configuration', () => {
  it('is off when the secret is missing or too short', () => {
    vi.stubEnv('OWNER_MODE_SECRET', '')
    expect(isOwnerModeConfigured()).toBe(false)
    vi.stubEnv('OWNER_MODE_SECRET', 'short')
    expect(isOwnerModeConfigured()).toBe(false)
    // Eight characters used to be enough; it is now guessable territory.
    vi.stubEnv('OWNER_MODE_SECRET', 'twenty-chars-secret!')
    expect(isOwnerModeConfigured()).toBe(false)
    expect(() => createOwnerCookie()).toThrow(/at least 32 characters/)
  })

  it('is on with a long enough secret', () => {
    vi.stubEnv('OWNER_MODE_SECRET', SECRET)
    expect(isOwnerModeConfigured()).toBe(true)
  })
})

describe('verifyOwnerSecret', () => {
  it('accepts only the exact secret', () => {
    vi.stubEnv('OWNER_MODE_SECRET', SECRET)
    expect(verifyOwnerSecret(SECRET)).toBe(true)
    expect(verifyOwnerSecret(`${SECRET} `)).toBe(false)
    expect(verifyOwnerSecret(SECRET.slice(0, -1))).toBe(false)
    expect(verifyOwnerSecret('')).toBe(false)
  })

  it('rejects everything when the secret is too short', () => {
    // A 5-char secret must not become a guessable password.
    vi.stubEnv('OWNER_MODE_SECRET', 'short')
    expect(verifyOwnerSecret('short')).toBe(false)
  })
})

describe('owner session cookie', () => {
  it('round-trips: a cookie we issue is recognized as the owner', () => {
    vi.stubEnv('OWNER_MODE_SECRET', SECRET)
    const cookies = cookiesFrom(createOwnerCookie())
    expect(Object.keys(cookies)).toEqual([OWNER_MODE_COOKIE])
    expect(isOwnerRequest({ cookies })).toBe(true)
  })

  it('never puts the raw secret in the cookie', () => {
    vi.stubEnv('OWNER_MODE_SECRET', SECRET)
    expect(createOwnerCookie()).not.toContain(SECRET)
  })

  it('rejects missing, tampered and foreign tokens', () => {
    vi.stubEnv('OWNER_MODE_SECRET', SECRET)
    const token = cookiesFrom(createOwnerCookie())[OWNER_MODE_COOKIE]!

    expect(isOwnerRequest({ cookies: {} })).toBe(false)
    expect(
      isOwnerRequest({ cookies: { [OWNER_MODE_COOKIE]: `${token}x` } })
    ).toBe(false)
    expect(isOwnerRequest({ cookies: { [OWNER_MODE_COOKIE]: SECRET } })).toBe(
      false
    )

    // A token minted under a different secret stops working on rotation.
    vi.stubEnv('OWNER_MODE_SECRET', OTHER_SECRET)
    expect(isOwnerRequest({ cookies: { [OWNER_MODE_COOKIE]: token } })).toBe(
      false
    )
  })

  it('expires sessions after 90 days', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-30T00:00:00Z'))
    vi.stubEnv('OWNER_MODE_SECRET', SECRET)
    const cookie = createOwnerCookie()
    const cookies = cookiesFrom(cookie)
    expect(cookie).toContain(`Max-Age=${90 * 24 * 60 * 60}`)

    vi.setSystemTime(Date.now() + 89 * DAY_MS)
    expect(isOwnerRequest({ cookies })).toBe(true)
    vi.setSystemTime(Date.now() + 2 * DAY_MS)
    expect(isOwnerRequest({ cookies })).toBe(false)
  })

  it('rejects a re-dated or future-dated token', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-30T00:00:00Z'))
    vi.stubEnv('OWNER_MODE_SECRET', SECRET)
    const token = cookiesFrom(createOwnerCookie())[OWNER_MODE_COOKIE]!
    const [issuedAt, signature] = token.split('.')

    // 60 days on, moving the timestamp forward 59 days (so it looks a day
    // old) to dodge expiry breaks the signature.
    vi.setSystemTime(Date.now() + 60 * DAY_MS)
    const redated = `${Number(issuedAt) + 59 * 24 * 60 * 60}.${signature}`
    expect(isOwnerRequest({ cookies: { [OWNER_MODE_COOKIE]: redated } })).toBe(
      false
    )
    expect(isOwnerRequest({ cookies: { [OWNER_MODE_COOKIE]: token } })).toBe(
      true
    )
    vi.setSystemTime(Date.now() - 60 * DAY_MS)

    // A token issued a day "from now" (clock tampering) is not accepted.
    vi.setSystemTime(Date.now() + DAY_MS)
    const future = cookiesFrom(createOwnerCookie())
    vi.setSystemTime(Date.now() - DAY_MS)
    expect(isOwnerRequest({ cookies: future })).toBe(false)
  })

  it('rejects every token once the secret is unset', () => {
    vi.stubEnv('OWNER_MODE_SECRET', SECRET)
    const cookies = cookiesFrom(createOwnerCookie())
    vi.stubEnv('OWNER_MODE_SECRET', '')
    expect(isOwnerRequest({ cookies })).toBe(false)
  })

  it('sets HttpOnly/SameSite always and Secure only in production', () => {
    vi.stubEnv('OWNER_MODE_SECRET', SECRET)

    vi.stubEnv('NODE_ENV', 'development')
    const devCookie = createOwnerCookie()
    expect(devCookie).toContain('HttpOnly')
    expect(devCookie).toContain('SameSite=Lax')
    expect(devCookie).toContain('Path=/')
    expect(devCookie).not.toContain('Secure')
    expect(clearOwnerCookie()).not.toContain('Secure')

    vi.stubEnv('NODE_ENV', 'production')
    expect(createOwnerCookie()).toMatch(/; Secure$/)
    expect(clearOwnerCookie()).toMatch(/; Secure$/)
  })

  it('clears with an empty, immediately expiring cookie', () => {
    expect(
      clearOwnerCookie().startsWith(
        `${OWNER_MODE_COOKIE}=; Path=/; Max-Age=0; HttpOnly`
      )
    ).toBe(true)
  })
})
