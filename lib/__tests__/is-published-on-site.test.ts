import { describe, expect, it } from 'vitest'

import { isIndexedPageId, isPublishedOnSite } from '../is-published-on-site'

describe('isIndexedPageId', () => {
  it('accepts index and override ids in either id format', () => {
    expect(isIndexedPageId('3ce5cb08-cf2c-80e6-8ab4-fb9b4171b562')).toBe(true)
    expect(isIndexedPageId('3ce5cb08cf2c80e68ab4fb9b4171b562')).toBe(true)
    // pageUrlOverrides['/updates'] (the root page)
    expect(isIndexedPageId('2bc5cb08cf2c8036a1e3cddcb2c61d97')).toBe(true)
  })

  it('rejects ids the site does not publish', () => {
    expect(isIndexedPageId('3c25cb08-cf2c-8071-b8ed-d5b57d7df47c')).toBe(false)
    expect(isIndexedPageId('not-an-id')).toBe(false)
  })
})

describe('isPublishedOnSite', () => {
  it('accepts slugs and ids from the committed index', () => {
    expect(
      isPublishedOnSite('3ce5cb08-cf2c-80e6-8ab4-fb9b4171b562', 'aug-26')
    ).toBe(true)
    expect(isPublishedOnSite('2bc5cb08-cf2c-81a9-90cf-df278a05d778')).toBe(true)
  })

  it('rejects unpublished mention targets', () => {
    expect(
      isPublishedOnSite(
        '3c25cb08-cf2c-8071-b8ed-d5b57d7df47c',
        'some-internal-doc'
      )
    ).toBe(false)
  })
})
