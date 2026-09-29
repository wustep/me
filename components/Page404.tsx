import type * as types from '@/lib/types'
import * as config from '@/lib/config'

import { AgentOnly } from './AgentOnly'
import styles from './Page404.module.css'
import { PageHead } from './PageHead'

export function Page404({ site, pageId, error }: types.PageProps) {
  // Lead with the status so the tab and history entry say what happened;
  // `site.name` alone read as a normal "Stephen Wu" page.
  const title = `Page not found · ${site?.name || config.name}`

  return (
    <>
      <PageHead site={site} title={title} />

      <main className={styles.page}>
        <div className={styles.content}>
          <p className={styles.code}>404</p>

          <div className={styles.divider} />

          <h1 className={styles.heading}>Page not found</h1>

          <p className={styles.description}>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Maybe wander somewhere else instead?
          </p>

          <p className={styles.hints}>
            <a href='/playground'>Playground</a>
            <span aria-hidden='true'> · </span>
            <a href='/lenses'>Lenses</a>
            <span aria-hidden='true'> · </span>
            <AgentOnly>
              <a href='/llms.txt' tabIndex={-1}>
                llms.txt
              </a>
              {' · '}
            </AgentOnly>
            <a href='/sitemap.xml'>sitemap.xml</a>
          </p>

          <a className={styles.homeLink} href={config.host}>
            <svg
              viewBox='0 0 16 16'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
            >
              <path d='M10 3L5 8l5 5' />
            </svg>
            Back home
          </a>

          {config.isDev && (
            <div className={styles.devError}>
              {error ? (
                <p>{error.message}</p>
              ) : (
                pageId && (
                  <p>
                    Notion page &quot;{pageId}&quot; is not publicly accessible.
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
