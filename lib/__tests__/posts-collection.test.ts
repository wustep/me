import { type CollectionInstance } from 'notion-types'
import { describe, expect, it } from 'vitest'

import { getCollectionBlockIds } from '../posts-collection'

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
