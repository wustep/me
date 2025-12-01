import type * as React from 'react'
import cs from 'classnames'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'

import { PageHead } from './PageHead'
import styles from './styles.module.css'

/**
 * @wustep: revised text and styling, added go home button
 */
export function Page404({ site, pageId, error }: types.PageProps) {
  const title = site?.name || 'Page Not Found'

  const devErrorMessage =
    config.isDev &&
    (error ? (
      <p>{error.message}</p>
    ) : (
      pageId && (
        <p>
          Make sure that Notion page &quot;{pageId}&quot; is publicly
          accessible.
        </p>
      )
    ))

  return (
    <>
      <PageHead site={site} title={title} />

      <div className={styles.container}>
        <main className={cs(styles.main, 'error-404')}>
          <h1 className={styles.errorHeading}>😳 Page not found</h1>
          {devErrorMessage}
          <p>
            Oops, not sure how we got here!
            <br />
            <a className='notion-link' href={config.host}>
              <span className='notion-blue_background'>
                Let&apos;s go back home!
              </span>
            </a>
          </p>
          <img
            src='/404.png'
            alt='404 Not Found'
            className={styles.errorImage}
          />
        </main>
      </div>
    </>
  )
}
