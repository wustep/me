import { type ExtendedRecordMap } from 'notion-types'
import { describe, expect, it } from 'vitest'

import { getExternalUrlMap } from '../get-external-url-map'

const collectionId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
const pageId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'

function recordMap(opts: {
  external: boolean
  url?: string
}): ExtendedRecordMap {
  return {
    block: {
      [pageId]: {
        role: 'reader',
        value: {
          id: pageId,
          type: 'page',
          parent_table: 'collection',
          parent_id: collectionId,
          properties: {
            title: [['Dashboards at Notion']],
            external: [[opts.external ? 'Yes' : 'No']],
            ...(opts.url ? { exturl: [[opts.url]] } : {})
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
            external: { name: 'External', type: 'checkbox' },
            exturl: { name: 'External URL', type: 'url' }
          }
        }
      }
    }
  } as unknown as ExtendedRecordMap
}

describe('getExternalUrlMap', () => {
  it('maps a page with External + External URL', () => {
    const map = getExternalUrlMap(
      recordMap({
        external: true,
        url: 'https://x.com/wustep/article/1'
      })
    )
    expect(map.get('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')).toBe(
      'https://x.com/wustep/article/1'
    )
  })

  it('skips pages that are not marked External', () => {
    const map = getExternalUrlMap(
      recordMap({
        external: false,
        url: 'https://example.com'
      })
    )
    expect(map.size).toBe(0)
  })
})
