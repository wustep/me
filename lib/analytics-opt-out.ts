export const VA_DISABLE_STORAGE_KEY = 'va-disable'

const DISABLE_VALUES = new Set(['1', 'true', 'yes'])
const ENABLE_VALUES = new Set(['0', 'false', 'no'])

function normalizeParam(value: string): string {
  return value.trim().toLowerCase()
}

function readVaDisableFlag(): boolean {
  if (typeof window === 'undefined') return false

  try {
    return Boolean(window.localStorage.getItem(VA_DISABLE_STORAGE_KEY))
  } catch {
    return false
  }
}

function writeVaDisableFlag(disabled: boolean) {
  if (typeof window === 'undefined') return

  try {
    if (disabled) {
      window.localStorage.setItem(VA_DISABLE_STORAGE_KEY, '1')
    } else {
      window.localStorage.removeItem(VA_DISABLE_STORAGE_KEY)
    }
  } catch {
    // localStorage can be disabled or unavailable in private browsing.
  }
}

/**
 * Honor `?va-disable=1|true|yes` / `?va-disable=0|false|no` once, persist the
 * official `va-disable` localStorage flag, then strip the param so it is not
 * sticky in the address bar or shared URLs.
 */
export function applyVaDisableQueryParam(): void {
  if (typeof window === 'undefined') return

  try {
    const url = new URL(window.location.href)
    const raw = url.searchParams.get('va-disable')
    if (raw === null) return

    const value = normalizeParam(raw)
    if (DISABLE_VALUES.has(value)) {
      writeVaDisableFlag(true)
    } else if (ENABLE_VALUES.has(value)) {
      writeVaDisableFlag(false)
    } else {
      return
    }

    url.searchParams.delete('va-disable')
    window.history.replaceState(
      window.history.state,
      '',
      `${url.pathname}${url.search}${url.hash}`
    )
  } catch {
    // window / localStorage / history can be missing or throw.
  }
}

export function isVaDisableSet(): boolean {
  return readVaDisableFlag()
}
