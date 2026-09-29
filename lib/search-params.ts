import type * as types from './types'

export const MAX_SEARCH_QUERY_LENGTH = 200
export const MAX_SEARCH_LIMIT = 20

/**
 * Validates an untrusted `/api/search-notion` request body and rebuilds it
 * into the only shape the site should ever forward to Notion: the caller's
 * `query`, pinned to our own root page, with a capped `limit`. Client-supplied
 * `ancestorId` and `filters` are ignored so the route can't be used to search
 * arbitrary workspaces (potentially as the `NOTION_TOKEN_V2` user).
 *
 * Returns `null` when the body is malformed.
 */
export function sanitizeSearchParams(
  body: unknown,
  rootPageId: string
): types.SearchParams | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null

  const { query, limit } = body as Record<string, unknown>
  if (typeof query !== 'string') return null

  const trimmed = query.trim()
  if (!trimmed || trimmed.length > MAX_SEARCH_QUERY_LENGTH) return null

  const safeLimit =
    typeof limit === 'number' && Number.isFinite(limit) && limit > 0
      ? Math.min(Math.floor(limit), MAX_SEARCH_LIMIT)
      : MAX_SEARCH_LIMIT

  return { query: trimmed, ancestorId: rootPageId, limit: safeLimit }
}
