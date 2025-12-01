export type PostsViewMode = 'gallery' | 'list'

export const HOME_POSTS_VIEW_STORAGE_KEY = 'homePostsView'

export const isPostsViewMode = (value: unknown): value is PostsViewMode =>
  value === 'gallery' || value === 'list'

