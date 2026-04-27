import Head from 'next/head'

import {
  ColleagueContent,
  PromptingLayout
} from '@/components/wustep/PromptingPage'
import { host, name } from '@/lib/config'

const parentTitle = 'How to talk to coding agents'
const chapterTitle = 'The colleague'
const title = `${chapterTitle} — ${parentTitle}`
const description =
  'Mental model #3: treat the agent as a colleague. Onboard them, brief them, review their work. The discipline gets more important, not less, as the models get smarter.'
const canonicalUrl = `${host}/prompting/colleague`
const previewImage = `${host}/favicon-512x512.png`

export default function PromptingColleaguePage() {
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
          index: 3,
          title: chapterTitle,
          prevHref: '/prompting/tree',
          prevLabel: 'The tree',
          nextHref: '/prompting',
          nextLabel: 'Back to start'
        }}
      >
        <ColleagueContent />
      </PromptingLayout>
    </>
  )
}
