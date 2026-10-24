import { describe, expect, it } from 'vitest'

import { scrollTopToReveal } from '../sidebar-scroll'

describe('scrollTopToReveal', () => {
  const viewportHeight = 400

  it('keeps the scroll position when the item is already visible', () => {
    expect(
      scrollTopToReveal({
        scrollTop: 300,
        viewportHeight,
        itemTop: 500,
        itemHeight: 32
      })
    ).toBe(300)
  })

  it('scrolls down just enough for an item below the fold', () => {
    expect(
      scrollTopToReveal({
        scrollTop: 0,
        viewportHeight,
        itemTop: 600,
        itemHeight: 32
      })
    ).toBe(600 + 32 + 8 - 400)
  })

  it('scrolls up just enough for an item above the fold', () => {
    expect(
      scrollTopToReveal({
        scrollTop: 500,
        viewportHeight,
        itemTop: 100,
        itemHeight: 32
      })
    ).toBe(92)
  })

  it('never returns a negative scrollTop', () => {
    expect(
      scrollTopToReveal({
        scrollTop: 50,
        viewportHeight,
        itemTop: 2,
        itemHeight: 32
      })
    ).toBe(0)
  })
})
