import { describe, expect, it } from 'vitest'

import { isPublishedOnSite } from '../is-published-on-site'

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
