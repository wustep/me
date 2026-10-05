import Head from 'next/head'

import { PromptingLayout, TreeContent } from '@/components/wustep/prompting'
import { host, name } from '@/lib/config'
import { shareCardMeta, shareCardUrl } from '@/lib/share-card'

const parentTitle = 'How to talk to coding agents'
const chapterTitle = 'The tree'
const title = `${chapterTitle} — ${parentTitle}`
const description =
  'Mental model #2: every change lives somewhere on a 2D map. Pick a coordinate, pick a move; the prompt almost writes itself.'
const canonicalUrl = `${host}/prompting/tree`
const previewImage = shareCardUrl('prompting-tree')

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
        {shareCardMeta(
          previewImage,
          'The tree: ask, plan, or delegate at any breadth and depth'
        )}
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
      </Head>
      <PromptingLayout
        chapter={{
          index: 4,
          title: chapterTitle,
          prevHref: '/prompting/techniques',
          prevLabel: 'Techniques',
          nextHref: '/prompting/colleague',
          nextLabel: 'The colleague'
        }}
      >
        <TreeContent />
      </PromptingLayout>
    </>
  )
}
