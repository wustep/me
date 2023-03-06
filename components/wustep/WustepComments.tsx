import * as React from 'react'

import * as config from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

/**
 * @wustep: Added comments system powered by Giscus
 * TODO: could make this configurable in the future.
 */
export const WustepComments = () => {
  const { isDarkMode } = useDarkMode()

  React.useEffect(() => {
    const giscusScript = document.createElement('script')
    giscusScript.src = 'https://giscus.app/client.js'
    giscusScript.setAttribute('data-repo', 'wustep/me')
    giscusScript.setAttribute('data-repo-id', 'R_kgDOId_ODg')
    giscusScript.setAttribute('data-category', 'Posts')
    giscusScript.setAttribute('data-category-id', 'DIC_kwDOId_ODs4CUre0')
    giscusScript.setAttribute('data-mapping', 'pathname')
    giscusScript.setAttribute('data-strict', '1')
    giscusScript.setAttribute('data-reactions-enabled', '0')
    giscusScript.setAttribute('data-emit-metadata', '0')
    giscusScript.setAttribute('data-input-position', 'top')
    giscusScript.setAttribute(
      'data-theme',
      `${config.host}/giscus/${isDarkMode ? 'dark' : 'light'}.css`
    )
    giscusScript.setAttribute('data-lang', 'en')
    giscusScript.setAttribute('data-loading', 'lazy')
    giscusScript.setAttribute('crossorigin', 'anonymous')
    giscusScript.setAttribute('async', 'true')
    document.body.appendChild(giscusScript)
    return () => {
      document.body.removeChild(giscusScript)
    }
  })
  return <div className='giscus'></div>
}
