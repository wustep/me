import { type ExtendedRecordMap } from 'notion-types'
import { describe, expect, it } from 'vitest'

import { getCanonicalPageId } from '../get-canonical-page-id'

const emptyRecordMap = { block: {} } as unknown as ExtendedRecordMap

const pageId = '2bc5cb08-cf2c-810b-83af-c01fde10aefa'
const collectionId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

const slugRecordMap = {
  block: {
    [pageId]: {
      role: 'reader',
      value: {
        id: pageId,
        type: 'page',
        parent_table: 'collection',
        parent_id: collectionId,
        properties: {
          title: [['Rapid Prototyping: Highlighty']],
          slug: [['rapid-prototyping-highlighty']]
        }
      }
    }
  },
  collection: {
    [collectionId]: {
      role: 'reader',
      value: {
        id: collectionId,
        schema: {
          title: { name: 'Name', type: 'title' },
          slug: { name: 'Slug', type: 'text' }
        }
      }
    }
  }
} as unknown as ExtendedRecordMap

describe('getCanonicalPageId', () => {
  it('returns undefined for an unparseable page id', () => {
    expect(getCanonicalPageId('', emptyRecordMap)).toBeUndefined()
    expect(
      getCanonicalPageId('not-a-notion-id', emptyRecordMap)
    ).toBeUndefined()
  })

  it('uses the Slug collection property', () => {
    expect(getCanonicalPageId(pageId, slugRecordMap, { uuid: false })).toBe(
      'rapid-prototyping-highlighty'
    )
  })
})
