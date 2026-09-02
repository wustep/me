import { type ExtendedRecordMap } from 'notion-types'
import { describe, expect, it, vi } from 'vitest'

import {
  aliasPageBlock,
  getMentionedPageIds,
  getMissingMentionPageIds,
  hasPageBlock,
  mergeMentionedPages
} from '../page-mentions'

const textBlockId = '3cf5cb08-cf2c-801f-891e-d60dcee2f9ad'
const beltsId = '3c25cb08-cf2c-8071-b8ed-d5b57d7df47c'
const rfcId = '3c25cb08-cf2c-8073-9be7-f315043cf0ff'
const spaceId = '30725683-e071-41f1-988d-e6e6fa72abd8'

function mentionTitle(
  ...segments: Array<string | { pageId: string }>
): unknown {
  return segments.map((segment) =>
    typeof segment === 'string'
      ? [segment]
      : ['‣', [['p', segment.pageId, spaceId]]]
  )
}

function recordMapWith(blocks: Record<string, unknown>): ExtendedRecordMap {
  return { block: blocks } as unknown as ExtendedRecordMap
}

describe('getMentionedPageIds', () => {
  it('collects p-decoration page ids from text properties', () => {
    const recordMap = recordMapWith({
      [textBlockId]: {
        role: 'reader',
        value: {
          id: textBlockId,
          type: 'text',
          properties: {
            title: mentionTitle(
              'see: ',
              { pageId: beltsId },
              ' and ',
              { pageId: rfcId },
              '.'
            )
          }
        }
      }
    })

    expect(getMentionedPageIds(recordMap).toSorted()).toEqual(
      [beltsId, rfcId].toSorted()
    )
  })

  it('reads the nested live record-map wrapper', () => {
    const recordMap = recordMapWith({
      [textBlockId]: {
        spaceId,
        value: {
          value: {
            id: textBlockId,
            type: 'text',
            properties: {
              title: mentionTitle({ pageId: beltsId })
            }
          }
        }
      }
    })

    expect(getMentionedPageIds(recordMap)).toEqual([beltsId])
  })

  it('ignores user and date decorations', () => {
    const recordMap = recordMapWith({
      [textBlockId]: {
        role: 'reader',
        value: {
          id: textBlockId,
          type: 'text',
          properties: {
            title: [
              ['‣', [['u', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa']]],
              ['‣', [['d', { type: 'date', start_date: '2026-08-31' }]]]
            ]
          }
        }
      }
    })

    expect(getMentionedPageIds(recordMap)).toEqual([])
  })
})

describe('getMissingMentionPageIds', () => {
  it('skips ids already present as dashed or compact keys', () => {
    const recordMap = recordMapWith({
      [textBlockId]: {
        role: 'reader',
        value: {
          id: textBlockId,
          type: 'text',
          properties: {
            title: mentionTitle({ pageId: beltsId }, { pageId: rfcId })
          }
        }
      },
      [beltsId]: {
        role: 'reader',
        value: {
          id: beltsId,
          type: 'page',
          properties: { title: [['AI Coding Developer Belts']] }
        }
      },
      [rfcId.replaceAll('-', '')]: {
        role: 'reader',
        value: {
          id: rfcId,
          type: 'page',
          properties: { title: [['RFC']] }
        }
      }
    })

    expect(getMissingMentionPageIds(recordMap)).toEqual([])
    expect(hasPageBlock(recordMap, beltsId)).toBe(true)
    expect(hasPageBlock(recordMap, rfcId)).toBe(true)
  })

  it('returns mention ids that are not in the record map', () => {
    const recordMap = recordMapWith({
      [textBlockId]: {
        role: 'reader',
        value: {
          id: textBlockId,
          type: 'text',
          properties: {
            title: mentionTitle({ pageId: beltsId })
          }
        }
      }
    })

    expect(getMissingMentionPageIds(recordMap)).toEqual([beltsId])
  })
})

describe('aliasPageBlock', () => {
  it('copies a compact-key block onto the dashed mention id', () => {
    const compact = beltsId.replaceAll('-', '')
    const recordMap = recordMapWith({
      [compact]: {
        role: 'reader',
        value: {
          id: beltsId,
          type: 'page',
          properties: { title: [['Belts']] }
        }
      }
    })

    aliasPageBlock(recordMap, beltsId)
    expect(recordMap.block[beltsId]).toBe(recordMap.block[compact])
  })
})

describe('mergeMentionedPages', () => {
  it('fetches missing mention pages and merges them', async () => {
    const recordMap = recordMapWith({
      [textBlockId]: {
        role: 'reader',
        value: {
          id: textBlockId,
          type: 'text',
          properties: {
            title: mentionTitle({ pageId: beltsId })
          }
        }
      }
    })

    const fetchPage = vi.fn(async (pageId: string) =>
      recordMapWith({
        [pageId]: {
          role: 'reader',
          value: {
            id: pageId,
            type: 'page',
            properties: { title: [['AI Coding Developer Belts']] }
          }
        }
      })
    )

    const merged = await mergeMentionedPages(recordMap, fetchPage)

    expect(fetchPage).toHaveBeenCalledTimes(1)
    expect(fetchPage).toHaveBeenCalledWith(beltsId, {
      chunkLimit: 1,
      fetchMissingBlocks: false,
      fetchCollections: false,
      signFileUrls: false
    })
    expect(hasPageBlock(merged, beltsId)).toBe(true)
  })

  it('does not fetch mentions that are already present', async () => {
    const recordMap = recordMapWith({
      [textBlockId]: {
        role: 'reader',
        value: {
          id: textBlockId,
          type: 'text',
          properties: {
            title: mentionTitle({ pageId: beltsId })
          }
        }
      },
      [beltsId]: {
        role: 'reader',
        value: {
          id: beltsId,
          type: 'page',
          properties: { title: [['Belts']] }
        }
      }
    })

    const fetchPage = vi.fn()
    const merged = await mergeMentionedPages(recordMap, fetchPage)

    expect(fetchPage).not.toHaveBeenCalled()
    expect(merged).toBe(recordMap)
  })

  it('keeps the page when a mention fetch fails', async () => {
    const recordMap = recordMapWith({
      [textBlockId]: {
        role: 'reader',
        value: {
          id: textBlockId,
          type: 'text',
          properties: {
            title: mentionTitle({ pageId: beltsId })
          }
        }
      }
    })

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fetchPage = vi.fn(async () => {
      throw new Error('private')
    })

    const merged = await mergeMentionedPages(recordMap, fetchPage)

    expect(merged.block[textBlockId]).toBeDefined()
    expect(hasPageBlock(merged, beltsId)).toBe(false)
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
