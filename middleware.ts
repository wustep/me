import { type NextRequest, NextResponse } from 'next/server'

import { markdownContentType, prefersMarkdown } from '@/lib/accept'
import { markdownForPath } from '@/lib/agent-content'

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
  const accept = request.headers.get('accept')

  if (!prefersMarkdown(accept)) {
    return withVaryAccept(NextResponse.next())
  }

  const { body, status } = markdownForPath(request.nextUrl.pathname)
  return new NextResponse(body, {
    status,
    headers: {
      'Content-Type': markdownContentType(accept),
      Vary: 'Accept',
      'Cache-Control': 'public, max-age=0, s-maxage=3600'
    }
  })
}
