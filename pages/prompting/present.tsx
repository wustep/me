import Head from 'next/head'

import { PromptingPresentation } from '@/components/wustep/prompting/PromptingPresentation'
import { domain, host, name, x } from '@/lib/config'

const title = 'Talking to machines'
const description =
  'A 30-minute presentation version of How to talk to coding agents.'
const previewImage = `${host}/favicon-512x512.png`
const canonicalUrl = `${host}/prompting/present`

export default function PromptingPresentationPage() {
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
        <meta name='twitter:domain' content={domain} />
        {x && <meta name='twitter:creator' content={`@${x}`} />}
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={previewImage} />
      </Head>
      <PromptingPresentation />
    </>
  )
}
