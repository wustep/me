import Head from 'next/head'

import {
  OrchestrationContent,
  PromptingLayout
} from '@/components/wustep/prompting'
import { host, name } from '@/lib/config'

const parentTitle = 'How to talk to coding agents'
const chapterTitle = 'Orchestration'
const title = `${chapterTitle} — ${parentTitle}`
const description =
  'Chapter 06: stop optimizing the next message and start optimizing the next hour. Chain steps, fan out, specialize roles, run long. Conduct the fleet.'
const canonicalUrl = `${host}/prompting/orchestration`
const previewImage = `${host}/favicon-512x512.png`

export default function PromptingOrchestrationPage() {
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
          index: 6,
          title: chapterTitle,
          prevHref: '/prompting/colleague',
          prevLabel: 'The colleague',
          nextHref: '/prompting/recap',
          nextLabel: 'Recap'
        }}
      >
        <OrchestrationContent />
      </PromptingLayout>
    </>
  )
}
