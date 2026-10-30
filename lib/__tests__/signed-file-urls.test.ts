import { describe, expect, it } from 'vitest'

import {
  blockReferencesFile,
  filterSignedUrls,
  isExpiringSignedFileUrl,
  isSignableNotionFileUrl
} from '../signed-file-urls'

describe('isSignableNotionFileUrl', () => {
  it.each([
    'attachment:d25020a5-cf96-4eee-bdca-e58e60fd4564:clip.mp4',
    'https://file.notion.so/f/f/abc/clip.gif',
    'https://prod-files-secure.s3.us-west-2.amazonaws.com/abc/def/clip.gif',
    'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/abc/clip.gif',
    'https://s3-us-west-2.amazonaws.com/public.notion-static.com/abc/clip.gif'
  ])('accepts %s', (url) => {
    expect(isSignableNotionFileUrl(url)).toBe(true)
  })

  it.each([
    // Arbitrary buckets, plain HTTP, look-alike hosts, and malformed input.
    'https://attacker-bucket.s3.amazonaws.com/x.gif',
    'https://s3.us-west-2.amazonaws.com/attacker-bucket/x.gif',
    'http://file.notion.so/f/f/abc/clip.gif',
    'https://file.notion.so.evil.com/clip.gif',
    'not a url file.notion.so',
    ''
  ])('rejects %s', (url) => {
    expect(isSignableNotionFileUrl(url)).toBe(false)
  })
})

describe('blockReferencesFile', () => {
  const source = 'attachment:d25020a5-cf96-4eee-bdca-e58e60fd4564:clip.gif'

  it('matches a block source, ignoring query strings', () => {
    expect(
      blockReferencesFile(
        { properties: { source: [[`${source}?spaceId=abc`]] } },
        source
      )
    ).toBe(true)
  })

  it('matches page covers and nested files properties', () => {
    expect(
      blockReferencesFile({ format: { page_cover: source } }, source)
    ).toBe(true)
    expect(
      blockReferencesFile(
        { properties: { 'a:b': [['clip.gif', [['a', source]]]] } },
        source
      )
    ).toBe(true)
  })

  it('rejects a file the block does not reference', () => {
    expect(
      blockReferencesFile(
        { properties: { source: [['attachment:other:clip.gif']] } },
        source
      )
    ).toBe(false)
    expect(blockReferencesFile({}, source)).toBe(false)
  })
})

describe('isExpiringSignedFileUrl', () => {
  it('matches file.notion.com', () => {
    expect(
      isExpiringSignedFileUrl(
        'https://file.notion.com/f/f/abc/image.png?signature=1'
      )
    ).toBe(true)
  })

  it('matches S3-hosted Notion files', () => {
    expect(
      isExpiringSignedFileUrl(
        'https://prod-files-secure.s3.us-west-2.amazonaws.com/abc/photo.png'
      )
    ).toBe(true)
  })

  it('does not match Unsplash', () => {
    expect(isExpiringSignedFileUrl('https://images.unsplash.com/photo-1')).toBe(
      false
    )
  })
})

describe('filterSignedUrls', () => {
  it('drops expiring hosts and keeps others', () => {
    expect(
      filterSignedUrls({
        a: 'https://file.notion.com/f/f/x/image.png?signature=1',
        b: 'https://cdn.example.com/ok.png',
        c: 'https://prod-files-secure.s3.us-west-2.amazonaws.com/x/y.png'
      })
    ).toEqual({
      b: 'https://cdn.example.com/ok.png'
    })
  })
})
