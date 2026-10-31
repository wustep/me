import { runInNewContext } from 'node:vm'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  LEGACY_STORAGE_KEY,
  parseSidebarCookie,
  serializeSidebarCookie,
  SIDEBAR_ATTR,
  SIDEBAR_COOKIE,
  SIDEBAR_NOFLASH_SCRIPT
} from '../playground-sidebar'

/** Just enough of document.cookie: writes set one pair, reads join them. */
function createCookieJar(initial: Record<string, string> = {}) {
  const jar = new Map(Object.entries(initial))
  return {
    jar,
    get cookie() {
      return [...jar].map(([name, value]) => `${name}=${value}`).join('; ')
    },
    set cookie(header: string) {
      const [pair] = header.split(';')
      const [name, value] = pair!.split('=')
      jar.set(name!, value!)
    }
  }
}

function createStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial))
  return {
    store,
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value)
  }
}

function createDocument(cookies?: Record<string, string>) {
  const attributes = new Map<string, string>()
  const jar = createCookieJar(cookies)
  const doc = {
    get cookie() {
      return jar.cookie
    },
    set cookie(header: string) {
      jar.cookie = header
    },
    documentElement: {
      setAttribute: (name: string, value: string) =>
        void attributes.set(name, value)
    }
  }
  return { doc, jar: jar.jar, attributes }
}

const blocked = () => {
  throw new Error('SecurityError')
}

/** Runs the inline script as the browser would; returns the <html> mark. */
function runNoflash(
  cookies: Record<string, string>,
  storage: Pick<Storage, 'getItem'> = createStorage()
) {
  const { doc, attributes } = createDocument(cookies)
  runInNewContext(SIDEBAR_NOFLASH_SCRIPT, {
    document: doc,
    localStorage: storage
  })
  return attributes.get(SIDEBAR_ATTR)
}

// A fresh module per test resets the in-memory copy.
const load = () => import('../playground-sidebar')

describe('parseSidebarCookie', () => {
  it('reads the preference among other cookies', () => {
    expect(parseSidebarCookie(`a=1; ${SIDEBAR_COOKIE}=false; b=2`)).toBe(false)
    expect(parseSidebarCookie(`${SIDEBAR_COOKIE}=true`)).toBe(true)
  })

  it('returns null when missing, malformed, or only a suffix match', () => {
    expect(parseSidebarCookie('')).toBeNull()
    expect(parseSidebarCookie(`${SIDEBAR_COOKIE}=maybe`)).toBeNull()
    expect(parseSidebarCookie(`x${SIDEBAR_COOKIE}=false`)).toBeNull()
  })
})

describe('serializeSidebarCookie', () => {
  it('is site-wide, long-lived and SameSite=Lax', () => {
    expect(serializeSidebarCookie(false, { secure: false })).toBe(
      `${SIDEBAR_COOKIE}=false; Path=/; Max-Age=${365 * 24 * 60 * 60}; SameSite=Lax`
    )
  })

  it('adds Secure only over https', () => {
    expect(serializeSidebarCookie(true, { secure: true })).toMatch(/; Secure$/)
  })
})

describe('SIDEBAR_NOFLASH_SCRIPT', () => {
  it('marks <html> collapsed from the cookie', () => {
    expect(runNoflash({ [SIDEBAR_COOKIE]: 'false' })).toBe('collapsed')
  })

  it('falls back to the legacy localStorage value', () => {
    expect(
      runNoflash({}, createStorage({ [LEGACY_STORAGE_KEY]: 'false' }))
    ).toBe('collapsed')
  })

  it('lets the cookie win over localStorage', () => {
    expect(
      runNoflash(
        { [SIDEBAR_COOKIE]: 'true' },
        createStorage({ [LEGACY_STORAGE_KEY]: 'false' })
      )
    ).toBeUndefined()
  })

  it('leaves <html> alone when nothing is stored', () => {
    expect(runNoflash({})).toBeUndefined()
  })

  it('swallows storage errors', () => {
    expect(() => runNoflash({}, { getItem: blocked })).not.toThrow()
  })
})

describe('preference store', () => {
  let doc: ReturnType<typeof createDocument>
  let storage: ReturnType<typeof createStorage>

  function stubBrowser(
    cookies: Record<string, string> = {},
    stored: Record<string, string> = {}
  ) {
    doc = createDocument(cookies)
    storage = createStorage(stored)
    vi.stubGlobal('document', doc.doc)
    vi.stubGlobal('window', {
      localStorage: storage,
      location: { protocol: 'https:' }
    })
  }

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reads the cookie first, then localStorage, else null', async () => {
    stubBrowser({ [SIDEBAR_COOKIE]: 'true' }, { [LEGACY_STORAGE_KEY]: 'false' })
    expect((await load()).readSidebarOpen()).toBe(true)

    vi.resetModules()
    stubBrowser({}, { [LEGACY_STORAGE_KEY]: 'false' })
    expect((await load()).readSidebarOpen()).toBe(false)

    vi.resetModules()
    stubBrowser()
    expect((await load()).readSidebarOpen()).toBeNull()
  })

  it('writes cookie, localStorage and <html>, then notifies', async () => {
    stubBrowser()
    const { readSidebarOpen, subscribeSidebarOpen, writeSidebarOpen } =
      await load()
    const listener = vi.fn()
    const unsubscribe = subscribeSidebarOpen(listener)

    writeSidebarOpen(false)

    expect(doc.jar.get(SIDEBAR_COOKIE)).toBe('false')
    expect(storage.store.get(LEGACY_STORAGE_KEY)).toBe('false')
    expect(doc.attributes.get(SIDEBAR_ATTR)).toBe('collapsed')
    expect(readSidebarOpen()).toBe(false)
    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
    writeSidebarOpen(true)
    expect(doc.attributes.get(SIDEBAR_ATTR)).toBe('expanded')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('keeps toggles in memory when cookies and storage are blocked', async () => {
    stubBrowser()
    Object.defineProperty(doc.doc, 'cookie', { get: blocked, set: blocked })
    storage.getItem = blocked
    storage.setItem = blocked
    const { readSidebarOpen, writeSidebarOpen } = await load()

    expect(readSidebarOpen()).toBeNull()
    writeSidebarOpen(false)
    expect(readSidebarOpen()).toBe(false)
  })

  it('migrates a localStorage-only preference into the cookie', async () => {
    stubBrowser({}, { [LEGACY_STORAGE_KEY]: 'false' })
    ;(await load()).migrateSidebarCookie()
    expect(doc.jar.get(SIDEBAR_COOKIE)).toBe('false')
  })

  it("doesn't overwrite an existing cookie or invent one", async () => {
    stubBrowser({ [SIDEBAR_COOKIE]: 'true' }, { [LEGACY_STORAGE_KEY]: 'false' })
    ;(await load()).migrateSidebarCookie()
    expect(doc.jar.get(SIDEBAR_COOKIE)).toBe('true')

    vi.resetModules()
    stubBrowser()
    ;(await load()).migrateSidebarCookie()
    expect(doc.jar.has(SIDEBAR_COOKIE)).toBe(false)
  })
})
