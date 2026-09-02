import { describe, expect, it } from 'vitest'

import {
  isTweetId,
  parseNotionTweetId,
  resolveTweetForEmbed
} from '../tweet-embed'

describe('parseNotionTweetId', () => {
  it('strips a leftover spaceId query', () => {
    expect(parseNotionTweetId('1965432109876543210&spaceId=abc')).toBe(
      '1965432109876543210'
    )
    expect(parseNotionTweetId('1965432109876543210?spaceId=abc')).toBe(
      '1965432109876543210'
    )
  })

  it('returns an empty string for missing ids', () => {
    expect(parseNotionTweetId(undefined)).toBe('')
    expect(parseNotionTweetId('')).toBe('')
  })
})

describe('isTweetId', () => {
  it('accepts numeric status ids', () => {
    expect(isTweetId('1965432109876543210')).toBe(true)
  })

  it('rejects non-numeric ids', () => {
    expect(isTweetId('abc')).toBe(false)
    expect(isTweetId('123&spaceId=x')).toBe(false)
  })
})

describe('resolveTweetForEmbed', () => {
  const live = { id: 'live' }
  const cached = { id: 'cached' }

  it('prefers the live syndication payload', () => {
    expect(resolveTweetForEmbed(live, cached)).toBe(live)
  })

  it('falls back to the Notion cache while the live fetch is in flight', () => {
    expect(resolveTweetForEmbed(undefined, cached)).toBe(cached)
  })

  it('falls back to the Notion cache when the live fetch fails', () => {
    expect(resolveTweetForEmbed(null, cached)).toBe(cached)
  })

  it('returns null when both sources are missing', () => {
    expect(resolveTweetForEmbed(null, undefined)).toBeNull()
  })
})
