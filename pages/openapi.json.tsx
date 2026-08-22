import type { GetServerSideProps } from 'next'

import { getOpenApiDocument } from '@/lib/agent-content'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405
    res.setHeader('Allow', 'GET, HEAD')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.write(
      JSON.stringify({
        error: 'method_not_allowed',
        message: 'Use GET',
        status: 405
      })
    )
    res.end()
    return { props: {} }
  }

  const body = JSON.stringify(getOpenApiDocument(), null, 2)
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Content-Length', String(Buffer.byteLength(body)))
  if (req.method === 'GET') {
    res.write(body)
  }
  res.end()

  return { props: {} }
}

export default function noop() {
  return null
}
