/**
 * The Playground sidebar's open/collapsed preference. A cookie is the source
 * of truth so it can be read before React paints (the _document noflash
 * script, and any future SSR); localStorage is where it used to live, so it
 * is still read when the cookie is missing and still written for now.
 *
 * Static HTML always renders the sidebar open. When the preference is
 * collapsed, the noflash script marks <html> before first paint and
 * globals.css draws the sidebar collapsed until React has caught up.
 */
export const SIDEBAR_COOKIE = 'playground-sidebar-open'
export const LEGACY_STORAGE_KEY = 'playground-sidebar-open:v1'
const COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60

/** On <html>: "collapsed" or "expanded" — the stored preference. */
export const SIDEBAR_ATTR = 'data-playground-sidebar'
/** On <html> once React drives the sidebar; ends the CSS stand-in. */
export const SIDEBAR_READY_ATTR = 'data-playground-sidebar-ready'

const COOKIE_PATTERN = new RegExp(`(?:^|; )${SIDEBAR_COOKIE}=(true|false)`)

/**
 * Inlined in pages/_document.tsx ahead of <Main />. Kept to a few lines of
 * ES5; it must agree with readSidebarOpen() below.
 */
export const SIDEBAR_NOFLASH_SCRIPT = `;(function () {
  try {
    var match = document.cookie.match(${COOKIE_PATTERN})
    var open = match ? match[1] : localStorage.getItem('${LEGACY_STORAGE_KEY}')
    if (open === 'false') {
      document.documentElement.setAttribute('${SIDEBAR_ATTR}', 'collapsed')
    }
  } catch (err) {}
})();`

export function parseSidebarCookie(cookie: string): boolean | null {
  const match = cookie.match(COOKIE_PATTERN)
  return match ? match[1] === 'true' : null
}

export function serializeSidebarCookie(
  open: boolean,
  { secure }: { secure: boolean }
): string {
  return `${SIDEBAR_COOKIE}=${open}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure ? '; Secure' : ''}`
}

// Survives client-side navigation even when cookies and storage are blocked.
let memoryOpen: boolean | null = null
const listeners = new Set<() => void>()

function readCookie(): boolean | null {
  try {
    return parseSidebarCookie(document.cookie)
  } catch {
    return null
  }
}

function readLegacyStorage(): boolean | null {
  try {
    const stored = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    return stored === 'true' ? true : stored === 'false' ? false : null
  } catch {
    return null
  }
}

function writeCookie(open: boolean) {
  try {
    // eslint-disable-next-line unicorn/no-document-cookie -- cookieStore isn't in every browser yet
    document.cookie = serializeSidebarCookie(open, {
      secure: window.location.protocol === 'https:'
    })
  } catch {
    // Cookies can be blocked; localStorage and memory still cover this tab.
  }
}

/** The stored preference, or null when the visitor never toggled. */
export function readSidebarOpen(): boolean | null {
  return memoryOpen ?? readCookie() ?? readLegacyStorage()
}

export function writeSidebarOpen(open: boolean) {
  memoryOpen = open
  writeCookie(open)
  try {
    window.localStorage.setItem(LEGACY_STORAGE_KEY, String(open))
  } catch {
    // localStorage can be disabled or unavailable in private browsing.
  }
  document.documentElement.setAttribute(
    SIDEBAR_ATTR,
    open ? 'expanded' : 'collapsed'
  )
  for (const listener of listeners) listener()
}

/** Copies a localStorage-only preference into the cookie. */
export function migrateSidebarCookie() {
  if (readCookie() !== null) return
  const stored = readLegacyStorage()
  if (stored !== null) writeCookie(stored)
}

export function subscribeSidebarOpen(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
