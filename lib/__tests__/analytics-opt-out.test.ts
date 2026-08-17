import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  applyVaDisableQueryParam,
  isVaDisableSet,
  VA_DISABLE_STORAGE_KEY
} from '../analytics-opt-out'

type StorageMap = Record<string, string>

function installWindow({
  href,
  storage = {},
  throwOnStorage = false
}: {
  href: string
  storage?: StorageMap
  throwOnStorage?: boolean
}) {
  const url = new URL(href)
  let currentHref = href

  const localStorage = {
    getItem(key: string) {
      if (throwOnStorage) throw new Error('denied')
      return storage[key] ?? null
    },
    setItem(key: string, value: string) {
      if (throwOnStorage) throw new Error('denied')
      storage[key] = value
    },
    removeItem(key: string) {
      if (throwOnStorage) throw new Error('denied')
      delete storage[key]
    }
  }

  const replaceState = vi.fn(
    (_state: unknown, _title: string, next: string) => {
      currentHref = new URL(next, url.origin).href
    }
  )

  vi.stubGlobal('window', {
    location: {
      get href() {
        return currentHref
      },
      origin: url.origin
    },
    localStorage,
    history: { state: { idx: 0 }, replaceState }
  })

  return { storage, replaceState, getHref: () => currentHref }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('applyVaDisableQueryParam', () => {
  it('is a no-op when window is missing', () => {
    expect(() => applyVaDisableQueryParam()).not.toThrow()
    expect(isVaDisableSet()).toBe(false)
  })

  it.each(['1', 'true', 'yes', 'TRUE', ' Yes '])(
    'sets the flag and strips va-disable=%s',
    (value) => {
      const { storage, replaceState, getHref } = installWindow({
        href: `https://wustep.me/writing?foo=bar&va-disable=${encodeURIComponent(value)}#hi`
      })

      applyVaDisableQueryParam()

      expect(storage[VA_DISABLE_STORAGE_KEY]).toBe('1')
      expect(replaceState).toHaveBeenCalledWith(
        { idx: 0 },
        '',
        '/writing?foo=bar#hi'
      )
      expect(getHref()).toBe('https://wustep.me/writing?foo=bar#hi')
    }
  )

  it.each(['0', 'false', 'no', 'FALSE', ' No '])(
    'clears the flag and strips va-disable=%s',
    (value) => {
      const { storage, replaceState } = installWindow({
        href: `https://wustep.me/?va-disable=${value}`,
        storage: { [VA_DISABLE_STORAGE_KEY]: '1' }
      })

      applyVaDisableQueryParam()

      expect(storage[VA_DISABLE_STORAGE_KEY]).toBeUndefined()
      expect(replaceState).toHaveBeenCalledWith({ idx: 0 }, '', '/')
    }
  )

  it('leaves unknown values and the URL alone', () => {
    const { storage, replaceState } = installWindow({
      href: 'https://wustep.me/?va-disable=maybe'
    })

    applyVaDisableQueryParam()

    expect(storage[VA_DISABLE_STORAGE_KEY]).toBeUndefined()
    expect(replaceState).not.toHaveBeenCalled()
  })

  it('does nothing when the query param is absent', () => {
    const { replaceState } = installWindow({
      href: 'https://wustep.me/playground'
    })

    applyVaDisableQueryParam()

    expect(replaceState).not.toHaveBeenCalled()
  })

  it('does not throw when localStorage is unavailable', () => {
    installWindow({
      href: 'https://wustep.me/?va-disable=1',
      throwOnStorage: true
    })

    expect(() => applyVaDisableQueryParam()).not.toThrow()
    expect(isVaDisableSet()).toBe(false)
  })
})

describe('isVaDisableSet', () => {
  it('is true for any stored value', () => {
    installWindow({
      href: 'https://wustep.me/',
      storage: { [VA_DISABLE_STORAGE_KEY]: '1' }
    })

    expect(isVaDisableSet()).toBe(true)
  })

  it('is false when the flag is missing', () => {
    installWindow({ href: 'https://wustep.me/' })

    expect(isVaDisableSet()).toBe(false)
  })

  it('is false when localStorage throws', () => {
    installWindow({
      href: 'https://wustep.me/',
      throwOnStorage: true
    })

    expect(isVaDisableSet()).toBe(false)
  })
})
