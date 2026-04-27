import Head from 'next/head'

import {
  PromptingLayout,
  TechniquesContent
} from '@/components/wustep/PromptingPage'
import { host, name } from '@/lib/config'

const parentTitle = 'How to talk to coding agents'
const chapterTitle = 'Techniques'
const title = `${chapterTitle} — ${parentTitle}`
const description =
  "Chapter 04: a small repertoire of prompting techniques worth practicing. AI coding is roughly three years old; we're all about 1200 ELO at this."
const canonicalUrl = `${host}/prompting/techniques`
const previewImage = `${host}/favicon-512x512.png`

export default function PromptingTechniquesPage() {
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
        <meta property='og:image' content={previewImage} />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
      </Head>
      <PromptingLayout
        chapter={{
          index: 4,
          title: chapterTitle,
          prevHref: '/prompting/colleague',
          prevLabel: 'The colleague',
          nextHref: '/prompting',
          nextLabel: 'Back to start'
        }}
      >
        <TechniquesContent />
      </PromptingLayout>
    </>
  )
}
