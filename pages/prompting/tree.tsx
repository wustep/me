import Head from 'next/head'

import {
  PromptingLayout,
  TreeContent
} from '@/components/wustep/PromptingPage'
import { host, name } from '@/lib/config'

const parentTitle = 'How to talk to coding agents'
const chapterTitle = 'The tree'
const title = `${chapterTitle} — ${parentTitle}`
const description =
  'Mental model #2: every change lives somewhere on a 2D map. Pick a coordinate, pick a move; the prompt almost writes itself.'
const canonicalUrl = `${host}/prompting/tree`
const previewImage = `${host}/favicon-512x512.png`

export default function PromptingTreePage() {
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
          index: 2,
          title: chapterTitle,
          prevHref: '/prompting/equation',
          prevLabel: 'The equation',
          nextHref: '/prompting/colleague',
          nextLabel: 'The colleague'
        }}
      >
        <TreeContent />
      </PromptingLayout>
    </>
  )
}
