import Head from 'next/head'

import { MindsetContent, PromptingLayout } from '@/components/wustep/prompting'
import { host, name } from '@/lib/config'

const parentTitle = 'How to talk to coding agents'
const chapterTitle = 'The beginner’s mindset'
const title = `${chapterTitle} — ${parentTitle}`
const description =
  "Chapter 01: AI coding is three years old. We're all around 1200 ELO. The fastest learners stay beginners — they don't blame the model, they ask what they could have done differently."
const canonicalUrl = `${host}/prompting/mindset`
const previewImage = `${host}/favicon-512x512.png`

export default function PromptingMindsetPage() {
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
          index: 1,
          title: chapterTitle,
          prevHref: '/prompting',
          prevLabel: 'Intro',
          nextHref: '/prompting/equation',
          nextLabel: 'The equation'
        }}
      >
        <MindsetContent />
      </PromptingLayout>
    </>
  )
}
