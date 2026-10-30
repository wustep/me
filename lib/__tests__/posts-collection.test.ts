import { type CollectionInstance } from 'notion-types'
import { describe, expect, it, vi } from 'vitest'

import { getCollectionBlockIds, isPublishedPageId } from '../posts-collection'

const HIDDEN_POST_ID = '4aa5cb08-cf2c-8000-8000-000000000001'

// Every override page's record map lists one public post that the committed
// index doesn't know about (like the /writing cards hidden from home).
vi.mock('../notion-api', () => ({
  notion: {
    getPage: vi.fn(async () => ({
      block: {
        [HIDDEN_POST_ID]: {
          value: {
            id: HIDDEN_POST_ID,
            type: 'page',
            parent_table: 'collection',
            properties: { title: [['Hidden post']] }
          }
        }
      },
      collection: {}
    }))
  }
}))

describe('isPublishedPageId', () => {
  it('accepts ids from the committed index without hitting Notion', async () => {
    expect(await isPublishedPageId('3ce5cb08cf2c80e68ab4fb9b4171b562')).toBe(
      true
    )
  })

  it('accepts public posts from override-page collections', async () => {
    expect(await isPublishedPageId(HIDDEN_POST_ID.replaceAll('-', ''))).toBe(
      true
    )
  })

  it('rejects other pages and malformed ids', async () => {
    expect(
      await isPublishedPageId('3c25cb08-cf2c-8071-b8ed-d5b57d7df47c')
    ).toBe(false)
    expect(await isPublishedPageId('not-an-id')).toBe(false)
  })
})

describe('getCollectionBlockIds', () => {
  it('reads blockIds from the top-level result', () => {
    expect(
      getCollectionBlockIds({
        result: { blockIds: ['a', 'b'] }
      } as CollectionInstance)
    ).toEqual(['a', 'b'])
  })

  it('falls back to collection_group_results', () => {
    expect(
      getCollectionBlockIds({
        result: { collection_group_results: { blockIds: ['c'] } }
      } as CollectionInstance)
    ).toEqual(['c'])
  })

  it('returns an empty list when nothing is present', () => {
    expect(getCollectionBlockIds({ result: {} } as CollectionInstance)).toEqual(
      []
    )
  })
})
