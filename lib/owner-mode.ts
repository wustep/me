export const OWNER_MODE_STORAGE_KEY = 'wustep-owner-mode:v1'
export const OWNER_MODE_ACCESS_STORAGE_KEY = 'wustep-owner-access:v1'

function readStorageFlag(key: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    return window.localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeStorageFlag(key: string, value: boolean) {
  if (typeof window === 'undefined') return

  try {
    if (value) {
      window.localStorage.setItem(key, '1')
    } else {
      window.localStorage.removeItem(key)
    }
  } catch {
    // localStorage can be disabled or unavailable in private browsing.
  }
}

export function readOwnerModeMarker(): boolean {
  return readStorageFlag(OWNER_MODE_STORAGE_KEY)
}

export function writeOwnerModeMarker(isOwner: boolean) {
  writeStorageFlag(OWNER_MODE_STORAGE_KEY, isOwner)
}

export function readOwnerModeAccessMarker(): boolean {
  return readStorageFlag(OWNER_MODE_ACCESS_STORAGE_KEY)
}

export function writeOwnerModeAccessMarker(hasAccess: boolean) {
  writeStorageFlag(OWNER_MODE_ACCESS_STORAGE_KEY, hasAccess)
}

export function shouldSkipAnalytics(url?: string): boolean {
  if (readOwnerModeMarker()) return true

  if (!url) return false

  try {
    return new URL(url, window.location.origin).pathname === '/owner'
  } catch {
    return url.split('?')[0] === '/owner'
  }
}
