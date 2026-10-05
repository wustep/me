import Head from 'next/head'

import { LlmsDirectory } from '@/components/wustep/lenses/llms/LlmsDirectory'
import { domain, host, name, x } from '@/lib/config'
import { shareCardMeta, shareCardUrl } from '@/lib/share-card'

const title = 'Lenses, by language models'
const description =
  'Each language model was handed the same empty 28-card deck, in isolation, and asked how it sees the world.'
const previewImage = shareCardUrl('lenses-llms')
const canonicalUrl = `${host}/lenses/llms`

export default function LlmLensesDirectoryPage() {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <link rel='canonical' href={canonicalUrl} />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content={name} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:url' content={canonicalUrl} />
        {shareCardMeta(
          previewImage,
          'Lenses, by language models: the five model decks side by side'
        )}
        <meta name='twitter:domain' content={domain} />
        {x && <meta name='twitter:creator' content={`@${x}`} />}
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
      </Head>
      <LlmsDirectory />
    </>
  )
}
