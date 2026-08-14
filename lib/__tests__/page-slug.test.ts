import { type Block, type ExtendedRecordMap } from 'notion-types'
import { describe, expect, it } from 'vitest'

import { collectPublicPageSlugs, getPageSlug, slugifyTitle } from '../page-slug'

const collectionId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
const publicPageId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
const hiddenPageId = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
const privatePageId = 'dddddddd-dddd-dddd-dddd-dddddddddddd'

function collectionRecordMap(): ExtendedRecordMap {
  return {
    block: {
      [publicPageId]: {
        role: 'reader',
        value: {
          id: publicPageId,
          type: 'page',
          parent_table: 'collection',
          parent_id: collectionId,
          properties: {
            title: [['Rapid Prototyping: Highlighty']],
            slug: [['rapid-prototyping-highlighty']],
            public: [['Yes']]
          }
        }
      },
      [hiddenPageId]: {
        role: 'reader',
        value: {
          id: hiddenPageId,
          type: 'page',
          parent_table: 'collection',
          parent_id: collectionId,
          properties: {
            title: [['Books, Audiobooks, and Podcasts']],
            slug: [['books-podcasts']],
            public: [['Yes']]
          }
        }
      },
      [privatePageId]: {
        role: 'reader',
        value: {
          id: privatePageId,
          type: 'page',
          parent_table: 'collection',
          parent_id: collectionId,
          properties: {
            title: [['Secret draft']],
            slug: [['secret-draft']],
            public: [['No']]
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
            slug: { name: 'Slug', type: 'text' },
            public: { name: 'Public', type: 'checkbox' }
          }
        }
      }
    }
  } as unknown as ExtendedRecordMap
}

describe('slugifyTitle', () => {
  it('kebab-cases a title', () => {
    expect(slugifyTitle('Rapid Prototyping: Highlighty')).toBe(
      'rapid-prototyping-highlighty'
    )
  })
})

describe('getPageSlug', () => {
  const recordMap = collectionRecordMap()

  it('prefers the Slug property over the title', () => {
    const block = recordMap.block[publicPageId]!.value as Block
    expect(getPageSlug(block, recordMap)).toBe('rapid-prototyping-highlighty')
  })

  it('falls back to a title slug when Slug is empty', () => {
    const recordMapWithoutSlug = collectionRecordMap()
    const block = recordMapWithoutSlug.block[publicPageId]!.value as Block
    delete block.properties!.slug
    expect(getPageSlug(block, recordMapWithoutSlug)).toBe(
      'rapid-prototyping-highlighty'
    )
  })
})

describe('collectPublicPageSlugs', () => {
  it('includes public collection pages and skips private ones', () => {
    const map = collectPublicPageSlugs(collectionRecordMap())
    expect(map['rapid-prototyping-highlighty']).toBe(publicPageId)
    expect(map['books-podcasts']).toBe(hiddenPageId)
    expect(map['secret-draft']).toBeUndefined()
  })
})
