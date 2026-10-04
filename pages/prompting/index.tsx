import Head from 'next/head'

import { IntroContent, PromptingLayout } from '@/components/wustep/prompting'
import { domain, host, name, x } from '@/lib/config'
import { shareCardMeta, shareCardUrl } from '@/lib/share-card'

const title = 'How to talk to coding agents'
const description =
  'A field guide to prompting coding agents — what works, what does not, and why.'
const previewImage = shareCardUrl('prompting')
const canonicalUrl = `${host}/prompting`

export default function PromptingIntroPage() {
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
          'How to talk to coding agents, with the prompt box from Fig. 0.1'
        )}
        <meta name='twitter:domain' content={domain} />
        {x && <meta name='twitter:creator' content={`@${x}`} />}
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
      </Head>
      <PromptingLayout>
        <IntroContent />
      </PromptingLayout>
    </>
  )
}
