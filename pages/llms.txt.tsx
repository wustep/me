import type { GetServerSideProps } from 'next'

import { getLlmsTxt } from '@/lib/agent-content'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
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

  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.write(getLlmsTxt())
  res.end()

  return { props: {} }
}

export default function noop() {
  return null
}
