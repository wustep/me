import { type NextRequest, NextResponse } from 'next/server'

import { prefersMarkdown } from '@/lib/accept'

export const config = {
  matcher: [
    // Skip Next internals, API routes, and files with extensions
    // (llms.txt, openapi.json, sitemap.xml, images, etc.).
    '/((?!_next/|api/|favicon.ico|.*\\.[\\w]+$).*)'
  ]
}

function withVaryAccept(response: NextResponse) {
  const existing = response.headers.get('Vary')
  if (!existing) {
    response.headers.set('Vary', 'Accept')
    return response
  }
  const parts = existing.split(',').map((part) => part.trim())
  if (!parts.some((part) => part.toLowerCase() === 'accept')) {
    response.headers.set('Vary', `${existing}, Accept`)
  }
  return response
}

export function middleware(request: NextRequest) {
  if (!prefersMarkdown(request.headers.get('accept'))) {
    return withVaryAccept(NextResponse.next())
  }

  // Rewrite to a pages API route. Vercel drops Content-Type from empty
  // middleware HEAD bodies, which breaks `curl -sI` / acceptmarkdown.
  // Pass the original path in a header — rewritten query strings do not
  // reliably reach pages API routes.
  const headers = new Headers(request.headers)
  headers.set('x-markdown-path', request.nextUrl.pathname)
  const url = request.nextUrl.clone()
  url.pathname = '/api/site-markdown'
  url.search = ''
  return NextResponse.rewrite(url, { request: { headers } })
}
