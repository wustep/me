import { describe, expect, it } from 'vitest'

import {
  findPlaygroundEntry,
  getPlaygroundMeta,
  getPlaygroundPreviewImage
} from '../playground-meta'

const HOST = 'https://wustep.me'

const spotIt = {
  title: 'Spot it!',
  url: '/playground/spot-it',
  description: 'A browser version of the card game.',
  image: '/playground/covers/spot-it.png'
}

const bookshelf = {
  title: 'Bookshelf',
  url: '/playground/bookshelf',
  description: 'Books I like.',
  image: '/playground/covers/bookshelf.svg'
}

describe('getPlaygroundPreviewImage', () => {
  it('uses raster covers and skips SVG/WebP', () => {
    expect(getPlaygroundPreviewImage(spotIt)).toBe(
      '/playground/covers/spot-it.png'
    )
    expect(getPlaygroundPreviewImage(bookshelf)).toBeUndefined()
    expect(
      getPlaygroundPreviewImage({ image: '/playground/covers/x.webp' })
    ).toBeUndefined()
  })

  it('prefers an explicit ogImage', () => {
    expect(
      getPlaygroundPreviewImage({
        image: '/playground/covers/x.webp',
        ogImage: '/playground/covers/x.png'
      })
    ).toBe('/playground/covers/x.png')
  })
})

describe('findPlaygroundEntry', () => {
  it('finds an entry across sections by path', () => {
    const sections = [{ items: [bookshelf] }, { items: [spotIt] }]
    expect(findPlaygroundEntry(sections, '/playground/spot-it')).toBe(spotIt)
    expect(findPlaygroundEntry(sections, '/playground/nope')).toBeUndefined()
  })
})

describe('getPlaygroundMeta', () => {
  it('builds metadata from a registry entry', () => {
    expect(
      getPlaygroundMeta({
        entry: spotIt,
        pathname: spotIt.url,
        fallbackTitle: 'ignored',
        fallbackDescription: 'ignored',
        host: HOST
      })
    ).toEqual({
      title: 'Spot it! — Playground',
      description: spotIt.description,
      canonicalUrl: 'https://wustep.me/playground/spot-it',
      image: 'https://wustep.me/playground/covers/spot-it.png'
    })
  })

  it('falls back for pages without an entry', () => {
    expect(
      getPlaygroundMeta({
        entry: undefined,
        pathname: '/playground',
        fallbackTitle: 'Playground',
        fallbackDescription: 'Experiments and toys.',
        host: HOST
      })
    ).toEqual({
      title: 'Playground',
      description: 'Experiments and toys.',
      canonicalUrl: 'https://wustep.me/playground',
      image: null
    })
  })
})
