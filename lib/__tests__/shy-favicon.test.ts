import { existsSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { faviconForPose } from '../shy-favicon'

describe('faviconForPose', () => {
  it('swaps the tab-sized icons for the 32px frame', () => {
    expect(faviconForPose('tucked', '/favicon.ico')).toBe(
      '/favicon-tucked-32x32.png'
    )
    expect(faviconForPose('peek', '/favicon-32x32.png', '32x32')).toBe(
      '/favicon-peek-32x32.png'
    )
  })

  it('swaps the 192px icon for the 192px frame', () => {
    expect(faviconForPose('tucked', '/favicon-192x192.png', '192x192')).toBe(
      '/favicon-tucked-192x192.png'
    )
  })

  it('accepts the absolute URL that link.href reports', () => {
    expect(
      faviconForPose('tucked', 'https://wustep.me/favicon-32x32.png', '32x32')
    ).toBe('/favicon-tucked-32x32.png')
  })

  it('returns the original icon when awake', () => {
    expect(faviconForPose('awake', '/favicon.ico')).toBe('/favicon.ico')
  })

  it('leaves icons that are not the turtle alone', () => {
    expect(faviconForPose('tucked', '/lenses/icon.png')).toBeUndefined()
    expect(
      faviconForPose('tucked', 'data:image/svg+xml,<svg/>')
    ).toBeUndefined()
    expect(
      faviconForPose('tucked', '/favicon-tucked-32x32.png')
    ).toBeUndefined()
  })

  it('only names frames that are committed to public/', () => {
    for (const pose of ['peek', 'tucked'] as const) {
      for (const [href, sizes] of [
        ['/favicon.ico', undefined],
        ['/favicon-192x192.png', '192x192']
      ] as const) {
        const frame = faviconForPose(pose, href, sizes)!
        expect(existsSync(path.join(process.cwd(), 'public', frame))).toBe(true)
      }
    }
  })
})
