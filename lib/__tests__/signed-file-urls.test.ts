import { describe, expect, it } from 'vitest'

import { filterSignedUrls, isExpiringSignedFileUrl } from '../signed-file-urls'

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
