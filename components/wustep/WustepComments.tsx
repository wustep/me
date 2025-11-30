import * as React from 'react'

import * as config from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

/**
 * @wustep: Added comments system powered by Giscus
 * Configurable via site.config.ts
 */
export function WustepComments() {
  const { isDarkMode } = useDarkMode()

  React.useEffect(() => {
    if (!config.giscus) return

    const giscusScript = document.createElement('script')
    giscusScript.src = 'https://giscus.app/client.js'
    giscusScript.dataset.repo = config.giscus.repo
    giscusScript.dataset.repoId = config.giscus.repoId
    giscusScript.dataset.category = config.giscus.category
    giscusScript.dataset.categoryId = config.giscus.categoryId
    giscusScript.dataset.mapping = config.giscus.mapping || 'pathname'
    giscusScript.dataset.strict = config.giscus.strict || '1'
    giscusScript.dataset.reactionsEnabled = config.giscus.reactionsEnabled || '0'
    giscusScript.dataset.emitMetadata = config.giscus.emitMetadata || '0'
    giscusScript.dataset.inputPosition = config.giscus.inputPosition || 'top'
    giscusScript.dataset.theme = `${config.host}/giscus/${isDarkMode ? 'dark' : 'light'}.css`
    giscusScript.dataset.lang = config.giscus.lang || 'en'
    giscusScript.dataset.loading = config.giscus.loading || 'lazy'
    giscusScript.setAttribute('crossorigin', 'anonymous')
    giscusScript.setAttribute('async', 'true')
    document.body.append(giscusScript)
    return () => {
      giscusScript.remove()
    }
  })

  // If giscus is not configured, don't render anything
  if (!config.giscus) {
    return null
  }

  return <div className='giscus'></div>
}
