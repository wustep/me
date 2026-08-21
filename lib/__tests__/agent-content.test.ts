import { describe, expect, it } from 'vitest'

import {
  getLlmsTxt,
  getOpenApiDocument,
  markdownForPath
} from '../agent-content'
import { apiError } from '../api-error'

describe('markdownForPath', () => {
  it('serves the homepage and about as the same markdown', () => {
    const home = markdownForPath('/')
    const about = markdownForPath('/about')
    expect(home.status).toBe(200)
    expect(about.body).toBe(home.body)
    expect(home.body).toMatch(/^# Stephen Wu/m)
    expect(home.body).toContain('Accept: text/markdown')
  })

  it('returns a 404 markdown body for unknown paths', () => {
    const missing = markdownForPath('/this-path-does-not-exist-xyz')
    expect(missing.status).toBe(404)
    expect(missing.body).toContain('/llms.txt')
    expect(missing.body).toContain('/sitemap.xml')
  })

  it('knows published Notion slugs', () => {
    const page = markdownForPath('/headspace')
    expect(page.status).toBe(200)
    expect(page.body).toContain('https://wustep.me/headspace')
  })
})

describe('getLlmsTxt', () => {
  it('identifies the site and when to use it', () => {
    const text = getLlmsTxt()
    expect(text).toContain('wustep.me')
    expect(text).toMatch(/## When to use this/)
    expect(text).toContain('as a product, SaaS, or public data API')
    expect(text).toContain('/prompting')
    expect(text).toContain('/lenses')
    expect(text).toContain('/playground')
    expect(text).toContain('Accept: text/markdown')
  })
})

describe('getOpenApiDocument', () => {
  it('describes real public surfaces with unique operationIds', () => {
    const spec = getOpenApiDocument()
    const operations = Object.values(spec.paths).flatMap((pathItem) =>
      Object.values(pathItem).map((op) => op.operationId)
    )
    expect(new Set(operations).size).toBe(operations.length)
    expect(operations.every(Boolean)).toBe(true)
    expect(spec.paths['/'].get.description).toBeTruthy()
    expect(JSON.stringify(spec)).not.toMatch(/\/users|\/orders|\/invoices/)
    expect(Object.hasOwn(spec.paths, '/api/search-notion')).toBe(false)
    expect(Object.hasOwn(spec.paths, '/api/owner-mode')).toBe(false)
  })
})

describe('apiError', () => {
  it('returns a structured error body', () => {
    expect(apiError(404, 'not_found', 'Nothing here')).toEqual({
      error: 'not_found',
      message: 'Nothing here',
      status: 404
    })
  })
})
