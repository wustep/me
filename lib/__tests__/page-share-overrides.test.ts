import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { pageUrlOverrides } from '../config'
import { getPageShareOverride } from '../page-share-overrides'

// Width and height from a PNG's IHDR chunk.
function pngSize(file: string) {
  const buf = readFileSync(file)
  expect(buf.subarray(1, 4).toString('ascii')).toBe('PNG')
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

describe('getPageShareOverride', () => {
  it('gives /writing its own card', () => {
    expect(getPageShareOverride(pageUrlOverrides.writing)?.card).toBe('writing')
  })

  // shareCardUrl(card) emits ${host}/og/<card>.png. Nothing falls back if the
  // file is missing, so the og:image would 404.
  it('points every fixed-path override at a committed 1200×630 PNG', () => {
    const cards = Object.values(pageUrlOverrides)
      .map((pageId) => getPageShareOverride(pageId)?.card)
      .filter(Boolean) as string[]

    expect(cards.length).toBeGreaterThan(0)
    for (const card of cards) {
      const file = path.join(process.cwd(), 'public/og', `${card}.png`)
      expect(pngSize(file), card).toEqual({ width: 1200, height: 630 })
    }
  })
})
