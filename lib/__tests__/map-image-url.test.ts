import { type Block } from 'notion-types'
import { describe, expect, it } from 'vitest'

import { mapImageUrl, shouldUnoptimizeNotionImage } from '../map-image-url'

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

  it('still proxies attachment: stills through notion.so/image', () => {
    const url =
      'attachment:d25020a5-cf96-4eee-bdca-e58e60fd4564:photo.png?spaceId=abc'

    const mapped = mapImageUrl(url, block)
    expect(mapped).toContain('https://www.notion.so/image/')
    expect(mapped).not.toContain('/api/notion-file')
  })

  it('wraps attachment: sources (current Notion upload format) in the proxy', () => {
    const url =
      'attachment:d25020a5-cf96-4eee-bdca-e58e60fd4564:EADC0DE2-FEA6-4356-A7ED-52AEB8952AD1.heic'

    const mapped = mapImageUrl(url, block)
    expect(mapped).toContain('https://www.notion.so/image/')
    expect(mapped).toContain(encodeURIComponent(url))
    expect(mapped).toContain('id=1285cb08-cf2c-806c-83d9-ce2bbaaa663f')
  })

  it('sends attachment: GIFs through the same-origin file re-signer', () => {
    const url =
      'attachment:1fd40ffb-941b-4878-89fc-c651829cbcaf:White_Lotus_Ba_Sing_Se.gif?spaceId=30725683-e071-41f1-988d-e6e6fa72abd8'

    const mapped = mapImageUrl(url, block)
    expect(mapped).toMatch(/\/api\/notion-file\?/)
    expect(mapped).not.toContain('notion.so/image')
    const href = new URL(mapped!)
    expect(href.searchParams.get('id')).toBe(block.id)
    expect(href.searchParams.get('url')).toBe(
      'attachment:1fd40ffb-941b-4878-89fc-c651829cbcaf:White_Lotus_Ba_Sing_Se.gif'
    )
    expect(mapped).not.toMatch(/^attachment:/)
  })

  it('leaves the same-origin file re-signer unwrapped', () => {
    const url =
      'http://localhost:6363/api/notion-file?id=1&url=attachment%3Aabc%3Aclip.gif'
    expect(mapImageUrl(url, block)).toBe(url)
  })

  it('leaves Unsplash URLs alone', () => {
    const url =
      'https://images.unsplash.com/photo-1620121478247-ec786b9be2fa?ixlib=rb-4.0.3'

    expect(mapImageUrl(url, block)).toBe(url)
  })
})

describe('shouldUnoptimizeNotionImage', () => {
  it('unoptimizes the same-origin file re-signer', () => {
    expect(
      shouldUnoptimizeNotionImage(
        'http://localhost:6363/api/notion-file?id=1&url=attachment%3Aabc%3Aclip.gif'
      )
    ).toBe(true)
  })

  it('unoptimizes Notion image-proxy URLs', () => {
    expect(
      shouldUnoptimizeNotionImage(
        'https://www.notion.so/image/attachment%3Aabc%3Aphoto.heic?table=block&id=1'
      )
    ).toBe(true)
  })

  it('unoptimizes raw HEIC sources that next/image cannot decode', () => {
    expect(
      shouldUnoptimizeNotionImage(
        'https://file.notion.com/f/f/abc/photo.heic?table=block&id=1'
      )
    ).toBe(true)
  })

  it('leaves Unsplash on the optimizer', () => {
    expect(
      shouldUnoptimizeNotionImage(
        'https://images.unsplash.com/photo-1620121478247-ec786b9be2fa'
      )
    ).toBe(false)
  })
})
