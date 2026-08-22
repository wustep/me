import type { GetServerSideProps } from 'next'

import { host } from '@/lib/config'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405
    res.setHeader('Allow', 'GET, HEAD')
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()

    return {
      props: {}
    }
  }

  const body =
    process.env.VERCEL_ENV === 'production'
      ? `User-agent: *
Allow: /
Disallow: /api/get-tweet-ast/*
Disallow: /api/search-notion

Sitemap: ${host}/sitemap.xml
# llms.txt: ${host}/llms.txt
`
      : `User-agent: *
Disallow: /

Sitemap: ${host}/sitemap.xml
# llms.txt: ${host}/llms.txt
`

  // cache for up to one day
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Content-Length', String(Buffer.byteLength(body)))
  if (req.method === 'GET') {
    res.write(body)
  }
  res.end()

  return {
    props: {}
  }
}

export default function noop() {
  return null
}
