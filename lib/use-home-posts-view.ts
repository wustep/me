import * as React from 'react'

import { isServer } from './config'
import {
  HOME_POSTS_VIEW_STORAGE_KEY,
  isPostsViewMode,
  type PostsViewMode
} from './posts-view'

export function useHomePostsViewPreference(
  initialView: PostsViewMode
): [PostsViewMode, (view: PostsViewMode) => void] {
  const [view, setView] = React.useState<PostsViewMode>(() => {
    if (isServer) {
      return initialView
    }

    try {
      const storedValue = window.localStorage.getItem(
        HOME_POSTS_VIEW_STORAGE_KEY
      )
      if (isPostsViewMode(storedValue)) {
        return storedValue
      }
    } catch {
      // ignore storage errors (e.g. private browsing mode)
    }

    return initialView
  })

  React.useEffect(() => {
    if (isServer) {
      return
    }

    try {
      const storedValue = window.localStorage.getItem(
        HOME_POSTS_VIEW_STORAGE_KEY
      )
      if (!isPostsViewMode(storedValue)) {
        window.localStorage.setItem(
          HOME_POSTS_VIEW_STORAGE_KEY,
          initialView
        )
      }
    } catch {
      // ignore storage errors (e.g. private browsing mode)
    }
  }, [initialView])

  const updateView = React.useCallback((nextView: PostsViewMode) => {
    setView(nextView)

    if (isServer) {
      return
    }

    try {
      window.localStorage.setItem(HOME_POSTS_VIEW_STORAGE_KEY, nextView)
    } catch {
      // ignore writes that fail
    }
  }, [])

  return [view, updateView]
}

