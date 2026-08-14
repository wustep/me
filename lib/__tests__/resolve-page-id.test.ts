import { describe, expect, it } from 'vitest'

import { lookupSlug, resolvePageIdFromMaps } from '../resolve-page-id'

const maps = {
  pageUrlOverrides: {
    writing: '3415cb08cf2c80128c06eb41ddf69c79'
  },
  pageUrlAdditions: {
    old: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  },
  canonicalPageMap: {
    highlighty: '2bc5cb08-cf2c-81cd-a0be-ce79763f25db',
    'oct-25': '2bc5cb08-cf2c-81a9-90cf-df278a05d778'
  }
}

describe('resolvePageIdFromMaps', () => {
  it('resolves a raw Notion id', () => {
    expect(
      resolvePageIdFromMaps('2bc5cb08cf2c81cda0bece79763f25db', maps)
    ).toBe('2bc5cb08-cf2c-81cd-a0be-ce79763f25db')
  })

  it('resolves pageUrlOverrides before the committed index', () => {
    expect(resolvePageIdFromMaps('writing', maps)).toBe(
      '3415cb08-cf2c-8012-8c06-eb41ddf69c79'
    )
  })

  it('resolves slugs from the committed index', () => {
    expect(resolvePageIdFromMaps('oct-25', maps)).toBe(
      '2bc5cb08-cf2c-81a9-90cf-df278a05d778'
    )
  })

  it('returns undefined for an unknown slug', () => {
    expect(resolvePageIdFromMaps('rapid-prototyping-highlighty', maps)).toBe(
      undefined
    )
  })
})

describe('lookupSlug', () => {
  it('finds a slug in a collection-derived map', () => {
    expect(
      lookupSlug('rapid-prototyping-highlighty', {
        'rapid-prototyping-highlighty': '2bc5cb08-cf2c-810b-83af-c01fde10aefa'
      })
    ).toBe('2bc5cb08-cf2c-810b-83af-c01fde10aefa')
  })
})
