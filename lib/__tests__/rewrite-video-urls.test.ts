import { type ExtendedRecordMap } from 'notion-types'
import { describe, expect, it } from 'vitest'

import { rewriteVideoSources } from '../rewrite-video-urls'

const videoId = '3ce5cb08-cf2c-8073-a0ce-e7fb0f053686'
const youtubeId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

function recordMapWith(blocks: Record<string, unknown>): ExtendedRecordMap {
  return { block: blocks } as unknown as ExtendedRecordMap
}

describe('rewriteVideoSources', () => {
  it('points uploaded videos at the same-origin re-signer', () => {
    const recordMap = recordMapWith({
      [videoId]: {
        role: 'reader',
        value: {
          id: videoId,
          type: 'video',
          properties: {
            source: [
              ['attachment:697ec516-42b3-4135-91f6-7254c0847e72:clip.mp4']
            ]
          }
        }
      }
    })

    rewriteVideoSources(recordMap)

    expect(recordMap.signed_urls?.[videoId]).toMatch(
      /^https?:\/\/.+\/api\/notion-file\?/
    )
    const href = new URL(recordMap.signed_urls![videoId]!)
    expect(href.searchParams.get('id')).toBe(videoId)
    expect(href.searchParams.get('url')).toContain('attachment:')
  })

  it('points raw S3 GIFs from older uploads at the re-signer', () => {
    const gifId = '2bc5cb08-cf2c-81b5-83c3-cfdb72249c1e'
    const source =
      'https://prod-files-secure.s3.us-west-2.amazonaws.com/30725683-e071-41f1-988d-e6e6fa72abd8/c529f997-53a4-4bbb-b01c-cf68c2fb4c24/2024-04-14_at_22.27.14.gif'
    const recordMap = recordMapWith({
      [gifId]: {
        role: 'reader',
        value: { id: gifId, type: 'image', properties: { source: [[source]] } }
      }
    })

    rewriteVideoSources(recordMap)

    const href = new URL(recordMap.signed_urls![gifId]!)
    expect(href.pathname).toBe('/api/notion-file')
    expect(href.searchParams.get('url')).toBe(source)
  })

  it('points attachment GIFs at the same-origin re-signer', () => {
    const gifId = '3c25cb08-cf2c-80c4-b4ac-db1746dad068'
    const recordMap = recordMapWith({
      [gifId]: {
        role: 'reader',
        value: {
          id: gifId,
          type: 'image',
          properties: {
            source: [
              [
                'attachment:1fd40ffb-941b-4878-89fc-c651829cbcaf:White_Lotus_Ba_Sing_Se.gif'
              ]
            ]
          }
        }
      }
    })

    rewriteVideoSources(recordMap)

    expect(recordMap.signed_urls?.[gifId]).toMatch(
      /^https?:\/\/.+\/api\/notion-file\?/
    )
    const href = new URL(recordMap.signed_urls![gifId]!)
    expect(href.searchParams.get('url')).toContain('.gif')
  })

  it('leaves public-CDN GIFs on image blocks alone', () => {
    const gifId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
    const recordMap = recordMapWith({
      [gifId]: {
        role: 'reader',
        value: {
          id: gifId,
          type: 'image',
          properties: {
            source: [['https://media.giphy.com/media/abc/sozin.gif']]
          }
        }
      }
    })

    rewriteVideoSources(recordMap)

    expect(recordMap.signed_urls?.[gifId]).toBeUndefined()
  })

  it('leaves YouTube embeds alone', () => {
    const recordMap = recordMapWith({
      [youtubeId]: {
        role: 'reader',
        value: {
          id: youtubeId,
          type: 'video',
          properties: {
            source: [['https://www.youtube.com/watch?v=I7CgbhoVHpc']]
          }
        }
      }
    })

    rewriteVideoSources(recordMap)

    expect(recordMap.signed_urls?.[youtubeId]).toBeUndefined()
  })
})
