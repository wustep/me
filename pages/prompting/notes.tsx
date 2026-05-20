import Head from 'next/head'
import Link from 'next/link'
import BodyClassName from 'react-body-classname'

import { SLIDES } from '@/components/wustep/prompting/PromptingPresentation'
import styles from '@/components/wustep/prompting/PromptingPresentation.module.css'
import { host, name } from '@/lib/config'

const title = 'Talking to machines notes'
const description = 'Talk-track notes for the prompting presentation.'
const canonicalUrl = `${host}/prompting/notes`

export default function PromptingNotesPage() {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <link rel='canonical' href={canonicalUrl} />
        <meta property='og:type' content='article' />
        <meta property='og:site_name' content={name} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:url' content={canonicalUrl} />
      </Head>
      <BodyClassName className='notion dark-mode' />
      <main className={styles.notesPage}>
        <header className={styles.notesPageHeader}>
          <div>
            <Link href='/prompting/present'>Back to presentation</Link>
            <h1>Talk track</h1>
          </div>
          <span>{SLIDES.length} slides</span>
        </header>
        <ol className={styles.notesList}>
          {SLIDES.map((slide, index) => (
            <li key={`${slide.title}-${index + 1}`} id={String(index + 1)}>
              <Link href={`/prompting/present#${index + 1}`}>
                {String(index + 1).padStart(2, '0')}
              </Link>
              <div>
                <span>{slide.eyebrow}</span>
                <h2>{slide.title || 'Chess pawn'}</h2>
                <p>{slide.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </main>
    </>
  )
}
