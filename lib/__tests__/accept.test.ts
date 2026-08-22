import { describe, expect, it } from 'vitest'

import {
  markdownContentType,
  normalizeRequestPath,
  prefersMarkdown
} from '../accept'

describe('prefersMarkdown', () => {
  it('treats a markdown-only Accept as markdown', () => {
    expect(prefersMarkdown('text/markdown')).toBe(true)
    expect(prefersMarkdown('text/plain')).toBe(true)
  })

  it('keeps browser Accept headers on HTML', () => {
    expect(
      prefersMarkdown(
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      )
    ).toBe(false)
  })

  it('does not treat */* as markdown', () => {
    expect(prefersMarkdown('*/*')).toBe(false)
    expect(prefersMarkdown(null)).toBe(false)
  })

  it('prefers the higher-q type when both are offered', () => {
    expect(prefersMarkdown('text/html;q=0.9, text/markdown;q=1')).toBe(true)
    expect(prefersMarkdown('text/markdown;q=0.1, text/html')).toBe(false)
  })
})

describe('markdownContentType', () => {
  it('uses text/plain when that is the preferred offer', () => {
    expect(markdownContentType('text/plain')).toBe('text/plain; charset=utf-8')
  })

  it('defaults to text/markdown', () => {
    expect(markdownContentType('text/markdown')).toBe(
      'text/markdown; charset=utf-8'
    )
  })
})

describe('normalizeRequestPath', () => {
  it('strips a trailing slash except on root', () => {
    expect(normalizeRequestPath('/')).toBe('/')
    expect(normalizeRequestPath('/privacy/')).toBe('/privacy')
    expect(normalizeRequestPath('contact')).toBe('/contact')
  })
})
