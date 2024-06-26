// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      's3.us-west-2.amazonaws.com',
      'transitivebullsh.it'
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  redirects: async () => {
    return [
      {
        source: '/articles/:slug',
        destination: '/:slug',
        permanent: true
      },
      {
        source: '/projects/:slug',
        destination: '/:slug',
        permanent: true
      },
      {
        source: '/notes/:slug',
        destination: '/:slug',
        permanent: true
      }
    ]
  },
  headers: async () => {
    return [
      {
        source: '/giscus/:path',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://giscus.app' }
        ]
      }
    ]
  }
})
