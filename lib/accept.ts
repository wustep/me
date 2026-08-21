/**
 * Lightweight Accept parsing for markdown content negotiation.
 * Safe for Edge middleware — no Node-only or site-config imports.
 */

type AcceptOffer = {
  type: string
  q: number
  index: number
}

function parseAccept(header: string | null | undefined): AcceptOffer[] {
  if (!header) return []

  return header.split(',').map((part, index) => {
    const [rawType, ...params] = part.trim().split(';')
    const type = (rawType ?? '').trim().toLowerCase()
    let q = 1
    for (const param of params) {
      const [key, value] = param.trim().split('=')
      if (key?.trim() === 'q' && value) {
        const parsed = Number.parseFloat(value)
        if (Number.isFinite(parsed)) q = parsed
      }
    }
    return { type, q, index }
  })
}

function best(
  offers: AcceptOffer[],
  match: (type: string) => boolean
): AcceptOffer | undefined {
  return offers
    .filter((offer) => match(offer.type))
    .toSorted((a, b) => b.q - a.q || a.index - b.index)[0]
}

function isMarkdownType(type: string) {
  return type === 'text/markdown' || type === 'text/x-markdown'
}

function isPlainType(type: string) {
  return type === 'text/plain'
}

function isHtmlType(type: string) {
  return type === 'text/html' || type === 'application/xhtml+xml'
}

/**
 * True when the client prefers markdown or plain text over HTML.
 * Browser defaults (text/html plus a catch-all) stay on HTML.
 */
export function prefersMarkdown(header: string | null | undefined): boolean {
  const offers = parseAccept(header)
  if (offers.length === 0) return false

  const markdown = best(
    offers,
    (type) => isMarkdownType(type) || isPlainType(type)
  )
  if (!markdown) return false

  const html = best(offers, isHtmlType)
  if (!html) return true
  if (markdown.q !== html.q) return markdown.q > html.q
  return markdown.index < html.index
}

export function markdownContentType(
  header: string | null | undefined
): 'text/markdown; charset=utf-8' | 'text/plain; charset=utf-8' {
  const offers = parseAccept(header)
  const markdown = best(offers, isMarkdownType)
  const plain = best(offers, isPlainType)

  if (
    plain &&
    (!markdown ||
      plain.q > markdown.q ||
      (plain.q === markdown.q && plain.index < markdown.index))
  ) {
    return 'text/plain; charset=utf-8'
  }

  return 'text/markdown; charset=utf-8'
}

export function normalizeRequestPath(pathname: string): string {
  if (!pathname || pathname === '/') return '/'
  const withLeading = pathname.startsWith('/') ? pathname : `/${pathname}`
  return withLeading.length > 1 && withLeading.endsWith('/')
    ? withLeading.slice(0, -1)
    : withLeading
}
