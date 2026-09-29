import { describe, expect, it } from 'vitest'

import {
  MAX_SEARCH_LIMIT,
  MAX_SEARCH_QUERY_LENGTH,
  sanitizeSearchParams
} from '../search-params'

const ROOT = 'root-page-id'

describe('sanitizeSearchParams', () => {
  it('keeps the query and pins ancestorId to the site root', () => {
    expect(
      sanitizeSearchParams(
        { query: '  lenses ', ancestorId: 'someone-elses-workspace' },
        ROOT
      )
    ).toEqual({ query: 'lenses', ancestorId: ROOT, limit: MAX_SEARCH_LIMIT })
  })

  it('drops client-supplied filters', () => {
    const params = sanitizeSearchParams(
      {
        query: 'x',
        filters: { isDeletedOnly: true, requireEditPermissions: false }
      },
      ROOT
    )
    expect(params).not.toHaveProperty('filters')
  })

  it('caps and floors the limit', () => {
    expect(sanitizeSearchParams({ query: 'x', limit: 5.7 }, ROOT)?.limit).toBe(
      5
    )
    expect(
      sanitizeSearchParams({ query: 'x', limit: 10_000 }, ROOT)?.limit
    ).toBe(MAX_SEARCH_LIMIT)
    expect(sanitizeSearchParams({ query: 'x', limit: -1 }, ROOT)?.limit).toBe(
      MAX_SEARCH_LIMIT
    )
    expect(sanitizeSearchParams({ query: 'x', limit: '9' }, ROOT)?.limit).toBe(
      MAX_SEARCH_LIMIT
    )
  })

  it('rejects malformed bodies', () => {
    expect(sanitizeSearchParams(null, ROOT)).toBeNull()
    expect(sanitizeSearchParams('lenses', ROOT)).toBeNull()
    expect(sanitizeSearchParams(['lenses'], ROOT)).toBeNull()
    expect(sanitizeSearchParams({}, ROOT)).toBeNull()
    expect(sanitizeSearchParams({ query: 42 }, ROOT)).toBeNull()
    expect(sanitizeSearchParams({ query: '   ' }, ROOT)).toBeNull()
    expect(
      sanitizeSearchParams(
        { query: 'a'.repeat(MAX_SEARCH_QUERY_LENGTH + 1) },
        ROOT
      )
    ).toBeNull()
  })
})
