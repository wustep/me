import { useRouter } from 'next/router'
import * as React from 'react'

import {
  readOwnerModeAccessMarker,
  readOwnerModeMarker,
  writeOwnerModeAccessMarker,
  writeOwnerModeMarker
} from '@/lib/owner-mode'

export type OwnerModeStatus = 'checking' | 'owner' | 'visitor'

type OwnerModeContextValue = {
  hasOwnerAccess: boolean
  isOwner: boolean
  setOwnerAccess: (hasAccess: boolean) => void
  setOwnerMode: (isOwner: boolean) => void
  status: OwnerModeStatus
}

const OwnerModeContext = React.createContext<OwnerModeContextValue | null>(null)

export function OwnerModeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = React.useState<OwnerModeStatus>('checking')
  const [hasOwnerAccess, setHasOwnerAccess] = React.useState(false)

  const setOwnerAccess = React.useCallback((hasAccess: boolean) => {
    writeOwnerModeAccessMarker(hasAccess)
    setHasOwnerAccess(hasAccess)
  }, [])

  const setOwnerMode = React.useCallback((isOwner: boolean) => {
    writeOwnerModeMarker(isOwner)
    setStatus(isOwner ? 'owner' : 'visitor')
  }, [])

  React.useEffect(() => {
    const hasActiveMarker = readOwnerModeMarker()
    const hasAccessMarker = readOwnerModeAccessMarker() || hasActiveMarker

    setOwnerAccess(hasAccessMarker)

    const shouldVerifySession = hasActiveMarker || router.pathname === '/owner'

    if (!shouldVerifySession) {
      setStatus('visitor')
      return
    }

    const controller = new AbortController()

    async function verifySession() {
      try {
        const response = await fetch('/api/owner-mode', {
          credentials: 'same-origin',
          signal: controller.signal
        })
        const result = (await response.json()) as { isOwner?: boolean }

        if (result.isOwner) {
          setOwnerAccess(true)
          setOwnerMode(true)
        } else {
          setOwnerAccess(false)
          setOwnerMode(false)
        }
      } catch {
        if (!controller.signal.aborted) {
          // Preserve the local analytics opt-out during a transient outage.
          setStatus(hasActiveMarker ? 'owner' : 'visitor')
        }
      }
    }

    void verifySession()

    return () => controller.abort()
  }, [router.pathname, setOwnerAccess, setOwnerMode])

  const value = React.useMemo(
    () => ({
      hasOwnerAccess,
      isOwner: status === 'owner',
      setOwnerAccess,
      setOwnerMode,
      status
    }),
    [hasOwnerAccess, setOwnerAccess, setOwnerMode, status]
  )

  return (
    <OwnerModeContext.Provider value={value}>
      {children}
    </OwnerModeContext.Provider>
  )
}

export function useOwnerMode() {
  const context = React.useContext(OwnerModeContext)

  if (!context) {
    throw new Error('useOwnerMode must be used inside OwnerModeProvider')
  }

  return context
}
