import { type ExtendedRecordMap } from 'notion-types'
import { describe, expect, it } from 'vitest'

import { getCanonicalPageUrl, mapPageUrl } from '../map-page-url'
import { type Site } from '../types'

// A 32-char Notion id (no dashes). parsePageId(..., { uuid: true }) re-dashes
// it and uuidToId() strips back to this, so it matches rootNotionPageId.
const rootId = '1234567812341234123412345678abcd'

const site: Site = {
  name: 'Test',
  domain: 'example.com',
  rootNotionPageId: rootId,
  rootNotionSpaceId: 'space-1'
}

const recordMap = { block: {} } as unknown as ExtendedRecordMap

describe('mapPageUrl', () => {
  it('maps the root page to "/"', () => {
    const url = mapPageUrl(site, recordMap, new URLSearchParams())(rootId)
    expect(url).toBe('/')
  })

  it('appends search params to the root url', () => {
    const url = mapPageUrl(
      site,
      recordMap,
      new URLSearchParams('lite=true')
    )(rootId)
    expect(url).toBe('/?lite=true')
  })

  it('maps a page in the committed index to its site slug', () => {
    const oct25Id = '2bc5cb08-cf2c-81a9-90cf-df278a05d778'
    const publishedRecordMap = {
      block: {
        [oct25Id]: {
          role: 'reader',
          value: {
            id: oct25Id,
            type: 'page',
            parent_table: 'collection',
            parent_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            properties: {
              title: [["oct '25"]],
              slug: [['oct-25']]
            }
          }
        }
      },
      collection: {
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa': {
          role: 'reader',
          value: {
            id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            schema: {
              title: { name: 'Name', type: 'title' },
              slug: { name: 'Slug', type: 'text' }
            }
          }
        }
      }
    } as unknown as ExtendedRecordMap

    expect(
      mapPageUrl(site, publishedRecordMap, new URLSearchParams())(oct25Id)
    ).toBe('/oct-25')
  })

  it('sends unpublished page mentions to notion.site', () => {
    const unpublished = '3c25cb08-cf2c-8071-b8ed-d5b57d7df47c'
    expect(
      mapPageUrl(site, recordMap, new URLSearchParams())(unpublished)
    ).toBe('https://wustep.notion.site/3c25cb08cf2c8071b8edd5b57d7df47c')
  })
})

describe('getCanonicalPageUrl', () => {
  it('maps the root page to the bare domain', () => {
    const url = getCanonicalPageUrl(site, recordMap)(rootId)
    expect(url).toBe('https://example.com')
  })
})
