import Head from 'next/head'

import { AboutPage } from '@/components/AboutPage'
import { domain, host, name, x } from '@/lib/config'
import { shareCardMeta, shareCardUrl } from '@/lib/share-card'
import { bioText, personJsonLd } from '@/lib/site-identity'

const previewImage = shareCardUrl('home')
const canonicalUrl = `${host}/`

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>{name}</title>
        <meta name='description' content={bioText} />
        <link rel='canonical' href={canonicalUrl} />
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content={name} />
        <meta property='og:title' content={name} />
        <meta property='og:description' content={bioText} />
        <meta property='og:url' content={canonicalUrl} />
        {shareCardMeta(
          previewImage,
          'Stephen Wu, Engineering at Notion: portrait and bio'
        )}
        <meta name='twitter:domain' content={domain} />
        {x && <meta name='twitter:creator' content={`@${x}`} />}
        <meta name='twitter:title' content={name} />
        <meta name='twitter:description' content={bioText} />
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
      </Head>
      <AboutPage />
    </>
  )
}
