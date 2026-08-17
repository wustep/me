// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
// global styles shared across the entire site
import 'styles/globals.css'
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion
import 'styles/notion.css'
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'
// @wustep: applause button
import 'styles/applause.css'
// @wustep: overides
import 'styles/wustep.css'

import type { AppProps } from 'next/app'
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/react'
import Head from 'next/head'
import { useLayoutEffect } from 'react'

import {
  OwnerModeProvider,
  useOwnerMode
} from '@/components/wustep/OwnerModeProvider'
import {
  applyVaDisableQueryParam,
  isVaDisableSet
} from '@/lib/analytics-opt-out'
import { crimsonPro, geist, inter } from '@/lib/fonts/fonts'
import { shouldSkipAnalytics } from '@/lib/owner-mode'

function filterAnalytics(event: BeforeSendEvent) {
  if (isVaDisableSet()) return null
  return shouldSkipAnalytics(event.url) ? null : event
}

function SiteAnalytics() {
  const { status } = useOwnerMode()

  // Persist `?va-disable=` before Analytics can send a pageview. Owner-mode
  // starts as `checking`, so the first paint never mounts <Analytics />.
  useLayoutEffect(() => {
    applyVaDisableQueryParam()
  }, [])

  // Vercel Analytics auto-tracks pageviews; render it only for visitors so
  // owner-mode traffic is excluded. beforeSend drops /owner and browsers
  // that set the official `va-disable` localStorage flag.
  return status === 'visitor' ? (
    <Analytics beforeSend={filterAnalytics} />
  ) : null
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OwnerModeProvider>
      {/* viewport-fit=cover lets env(safe-area-inset-*) resolve on every
          page (PageHead repeats this for Notion pages, but custom surfaces
          like /lenses don't render PageHead). */}
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover'
        />
      </Head>
      <style jsx global>{`
        :root {
          --font-sans: ${inter.style.fontFamily};
          --font-serif: ${crimsonPro.style.fontFamily};
          --font-geist: ${geist.style.fontFamily};
        }
      `}</style>
      <div
        data-font-root
        className={`${inter.variable} ${crimsonPro.variable} ${geist.variable}`}
      >
        <Component {...pageProps} />
      </div>
      <SiteAnalytics />
    </OwnerModeProvider>
  )
}
