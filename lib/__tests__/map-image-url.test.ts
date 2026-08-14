import { type Block } from 'notion-types'
import { describe, expect, it } from 'vitest'

import { mapImageUrl } from '../map-image-url'

const block = { id: '1285cb08-cf2c-806c-83d9-ce2bbaaa663f' } as Block

describe('mapImageUrl', () => {
  it('wraps file.notion.com URLs in the notion.so image proxy', () => {
    const url =
      'https://file.notion.com/f/f/30725683-e071-41f1-988d-e6e6fa72abd8/07ac880a-4a18-4935-b277-a439c76ce80c/image.png?table=block&id=1285cb08-cf2c-806c-83d9-ce2bbaaa663f&spaceId=30725683'

    const mapped = mapImageUrl(url, block)
    expect(mapped).toContain('https://www.notion.so/image/')
    expect(mapped).toContain(encodeURIComponent(url))
  })

  it('wraps HEIC file.notion.com URLs so the proxy can convert them', () => {
    const url =
      'https://file.notion.com/f/f/30725683-e071-41f1-988d-e6e6fa72abd8/d25020a5-cf96-4eee-bdca-e58e60fd4564/photo.heic?table=block&id=1285cb08-cf2c-806c-83d9-ce2bbaaa663f'

    const mapped = mapImageUrl(url, block)
    expect(mapped).toContain('https://www.notion.so/image/')
    expect(mapped).toContain('.heic')
  })

  it('still proxies S3-hosted Notion files through notion.so/image', () => {
    const url =
      'https://prod-files-secure.s3.us-west-2.amazonaws.com/30725683-e071-41f1-988d-e6e6fa72abd8/c20d3edd-9bce-47ab-9643-d3bae6cdd143/photo.png'

    const mapped = mapImageUrl(url, block)
    expect(mapped).toContain('https://www.notion.so/image/')
    expect(mapped).toContain(encodeURIComponent(url))
  })

  it('leaves Unsplash URLs alone', () => {
    const url =
      'https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?ixlib=rb-4.0.3'

    expect(mapImageUrl(url, block)).toBe(url)
  })
})
