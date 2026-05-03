import Head from 'next/head'

import {
  EquationContent,
  PromptingLayout
} from '@/components/wustep/prompting'
import { host, name } from '@/lib/config'

const parentTitle = 'How to talk to coding agents'
const chapterTitle = 'The equation'
const title = `${chapterTitle} — ${parentTitle}`
const description =
  "Mental model #1: whatever a coding agent gives you falls out of two things multiplied together. Here's how to pull each lever."
const canonicalUrl = `${host}/prompting/equation`
const previewImage = `${host}/favicon-512x512.png`

export default function PromptingEquationPage() {
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
          nextHref: '/prompting/tree',
          nextLabel: 'The tree'
        }}
      >
        <EquationContent />
      </PromptingLayout>
    </>
  )
}
