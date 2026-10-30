import path from 'node:path'
import { fileURLToPath } from 'node:url'

import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  // eslint-disable-next-line no-process-env
  enabled: process.env.ANALYZE === 'true'
})

const dirname = path.dirname(fileURLToPath(import.meta.url))

// eslint-disable-next-line no-process-env
const isDev = process.env.NODE_ENV === 'development'

// Baseline browser hardening for every response. Permissions-Policy only
// turns off features nothing here uses — the playground iframes delegate
// autoplay/fullscreen/midi/gamepad/sensors, and /playground uses Web MIDI.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  }
]

// Report-only for now: Notion content can embed arbitrary https iframes,
// images and media, so watch the console for violations before enforcing.
// 'unsafe-inline' scripts cover the dark-mode bootstrap in _document.tsx.
const contentSecurityPolicyReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:",
  "connect-src 'self' https:",
  "frame-src 'self' https:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'"
].join('; ')

export default withBundleAnalyzer({
  staticPageGenerationTimeout: 300,
  experimental: {
    // Notion's public API is rate-limited. Keep each route's static paths in a
    // single batch and render one at a time after the index crawl completes.
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 100
  },
  turbopack: {
    root: dirname
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'notion.so' },
      { protocol: 'https', hostname: 'file.notion.com' },
      { protocol: 'https', hostname: 'file.notion.so' },
      { protocol: 'https', hostname: 'img.notionusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'abs.twimg.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' }
    ],
    // Keep optimized copies around after Notion file URLs expire (~1h).
    minimumCacheTTL: 60 * 60 * 24,
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  redirects: async () => {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true
      },
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
        source: '/:path*',
        headers: securityHeaders
      },
      // Pages only: /_next/image sets its own sandboxing CSP for SVGs, and
      // API routes return JSON/images. Skipped in dev (eval, HMR sockets).
      ...(isDev
        ? []
        : [
            {
              source: '/((?!_next/|api/).*)',
              headers: [
                {
                  key: 'Content-Security-Policy-Report-Only',
                  value: contentSecurityPolicyReportOnly
                }
              ]
            }
          ]),
      {
        source: '/giscus/:path',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://giscus.app' }
        ]
      },
      {
        source: '/',
        headers: [{ key: 'Vary', value: 'Accept' }]
      },
      {
        source: '/privacy',
        headers: [{ key: 'Vary', value: 'Accept' }]
      },
      {
        source: '/contact',
        headers: [{ key: 'Vary', value: 'Accept' }]
      },
      {
        source: '/prompting',
        headers: [{ key: 'Vary', value: 'Accept' }]
      },
      {
        source: '/lenses',
        headers: [{ key: 'Vary', value: 'Accept' }]
      },
      {
        source: '/playground',
        headers: [{ key: 'Vary', value: 'Accept' }]
      }
    ]
  },
  rewrites: async () => {
    return [
      {
        source: '/feed.xml',
        destination: '/feed'
      },
      {
        source: '/feeds',
        destination: '/feed'
      },
      {
        source: '/feeds.xml',
        destination: '/feed'
      },
      {
        source: '/rss',
        destination: '/feed'
      },
      {
        source: '/rss.xml',
        destination: '/feed'
      }
    ]
  },
  webpack: (config) => {
    // Workaround for ensuring that `react` and `react-dom` resolve correctly
    // when using a locally-linked version of `react-notion-x`.
    // @see https://github.com/vercel/next.js/issues/50391
    config.resolve.alias.react = path.resolve(dirname, 'node_modules/react')
    config.resolve.alias['react-dom'] = path.resolve(
      dirname,
      'node_modules/react-dom'
    )
    return config
  },
  // See https://react-tweet.vercel.app/next#troubleshooting
  transpilePackages: ['react-tweet']
})
