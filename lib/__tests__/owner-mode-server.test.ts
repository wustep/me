import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  clearOwnerCookie,
  createOwnerCookie,
  isOwnerModeConfigured,
  isOwnerRequest,
  OWNER_MODE_COOKIE,
  verifyOwnerSecret
} from '../owner-mode-server'

const SECRET = 'correct horse battery staple'

/** `name=value` from a Set-Cookie string, as a request's parsed cookies. */
function cookiesFrom(setCookie: string): Record<string, string> {
  const [pair = ''] = setCookie.split(';')
  const eq = pair.indexOf('=')
  return { [pair.slice(0, eq)]: pair.slice(eq + 1) }
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('owner mode configuration', () => {
  it('is off when the secret is missing or too short', () => {
    vi.stubEnv('OWNER_MODE_SECRET', '')
    expect(isOwnerModeConfigured()).toBe(false)
    vi.stubEnv('OWNER_MODE_SECRET', 'short')
    expect(isOwnerModeConfigured()).toBe(false)
    expect(() => createOwnerCookie()).toThrow(/at least 8 characters/)
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
    vi.stubEnv('OWNER_MODE_SECRET', 'a different secret')
    expect(isOwnerRequest({ cookies: { [OWNER_MODE_COOKIE]: token } })).toBe(
      false
    )
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
