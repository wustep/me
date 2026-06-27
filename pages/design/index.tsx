import { ArrowLeft, ArrowUpRight, Type } from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'

import styles from './index.module.css'

export default function DesignIndexPage() {
  return (
    <>
      <Head>
        <title>Design playground · Stephen Wu</title>
        <meta
          name='description'
          content='A workspace for testing design decisions on wustep.me.'
        />
        <meta name='robots' content='noindex,nofollow' />
      </Head>

      <main className={styles.page}>
        <header className={styles.header}>
          <Link href='/' className={styles.backLink}>
            <ArrowLeft aria-hidden='true' />
            wustep.me
          </Link>
        </header>

        <section className={styles.intro}>
          <h1>Design playground</h1>
        </section>

        <section className={styles.studies} aria-labelledby='studies-heading'>
          <h2 id='studies-heading'>Tools</h2>

          <Link href='/design/fonts' className={styles.studyCard}>
            <div className={styles.studyIcon} aria-hidden='true'>
              <Type strokeWidth={1.7} />
            </div>
            <div className={styles.studyCopy}>
              <h3>Font pairer</h3>
              <p>Compare type combinations on the home page and articles.</p>
            </div>
            <ArrowUpRight className={styles.openIcon} aria-hidden='true' />
          </Link>
        </section>
      </main>
    </>
  )
}
