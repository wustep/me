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
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { posthog } from 'posthog-js'
import * as React from 'react'
import {
  initialize as initializeGoogleAnalytics,
  pageview as trackGooglePageview
} from 'react-ga'

import {
  OwnerModeProvider,
  useOwnerMode
} from '@/components/wustep/OwnerModeProvider'
import {
  fathomConfig,
  fathomId,
  googleId,
  posthogConfig,
  posthogId
} from '@/lib/config'
import { crimsonPro, geist, inter } from '@/lib/fonts/fonts'
import { shouldSkipAnalytics } from '@/lib/owner-mode'

function filterOwnerAnalytics(event: BeforeSendEvent) {
  return shouldSkipAnalytics(event.url) ? null : event
}

function setGoogleAnalyticsDisabled(trackingId: string, disabled: boolean) {
  const analyticsWindow = window as unknown as Record<string, unknown>
  analyticsWindow[`ga-disable-${trackingId}`] = disabled
}

function SiteAnalytics() {
  const router = useRouter()
  const { status } = useOwnerMode()
  const previousStatus = React.useRef(status)

  React.useEffect(() => {
    const priorStatus = previousStatus.current
    previousStatus.current = status

    if (status === 'checking') return

    if (status === 'owner') {
      if (fathomId) Fathom.blockTrackingForMe()
      if (posthogId) posthog.opt_out_capturing()
      if (googleId) setGoogleAnalyticsDisabled(googleId, true)
      return
    }

    if (fathomId) {
      if (priorStatus === 'owner') Fathom.enableTrackingForMe()
      Fathom.load(fathomId, { ...fathomConfig, auto: false })
    }

    if (posthogId) {
      if (!posthog.__loaded) {
        posthog.init(posthogId, {
          ...posthogConfig,
          capture_pageview: false
        })
      }
      if (priorStatus === 'owner') posthog.opt_in_capturing()
    }

    if (googleId) {
      setGoogleAnalyticsDisabled(googleId, false)
      initializeGoogleAnalytics(googleId)
    }

    function trackPageview(url: string) {
      if (shouldSkipAnalytics(url)) return

      if (fathomId) Fathom.trackPageview({ url })
      if (posthogId) posthog.capture('$pageview', { $current_url: url })
      if (googleId) trackGooglePageview(url)
    }

    trackPageview(window.location.pathname + window.location.search)
    router.events.on('routeChangeComplete', trackPageview)

    return () => {
      router.events.off('routeChangeComplete', trackPageview)
    }
  }, [router.events, status])

  return status === 'visitor' ? (
    <Analytics beforeSend={filterOwnerAnalytics} />
  ) : null
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <OwnerModeProvider>
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
