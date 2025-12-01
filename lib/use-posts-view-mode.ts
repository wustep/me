import { useCallback, useEffect, useState } from 'react'

export type ViewMode = 'gallery' | 'list'

const STORAGE_KEY = 'posts-view-mode'
const DEFAULT_VIEW_MODE: ViewMode = 'list'

/**
 * Custom hook to manage and persist the posts view mode (gallery/list) in localStorage
 */
export function usePostsViewMode(): [ViewMode, (mode: ViewMode) => void] {
  const [viewMode, setViewModeState] = useState<ViewMode>(DEFAULT_VIEW_MODE)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'gallery' || stored === 'list') {
        setViewModeState(stored)
      }
    } catch (error) {
      console.error('Failed to load view mode from localStorage:', error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode)

    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch (error) {
      console.error('Failed to save view mode to localStorage:', error)
    }
  }, [])

  return [isInitialized ? viewMode : DEFAULT_VIEW_MODE, setViewMode]
}

