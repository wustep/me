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
import { Analytics } from '@vercel/analytics/react'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { posthog } from 'posthog-js'
import * as React from 'react'
// @wustep: add ReactGA and Vercel analytics
import ReactGA from 'react-ga'

import {
  fathomConfig,
  fathomId,
  googleId,
  posthogConfig,
  posthogId
} from '@/lib/config'
import { crimsonPro, inter } from '@/lib/fonts/fonts'

const TRACKING_ID = 'UA-43013610-2'
ReactGA.initialize(TRACKING_ID)

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    function onRouteChangeComplete() {
      if (fathomId) {
        Fathom.trackPageview()
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    if (googleId) {
      ReactGA.initialize(googleId)
      ReactGA.pageview(window.location.pathname + window.location.search)
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${inter.style.fontFamily};
          --font-serif: ${crimsonPro.style.fontFamily};
        }
      `}</style>
      <div className={`${inter.variable} ${crimsonPro.variable}`}>
        <Component {...pageProps} />
      </div>
      <Analytics />
    </>
  )
}
