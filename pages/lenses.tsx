import Head from 'next/head'

import { LensesPage } from '@/components/wustep/lenses'
import { domain, host, name, x } from '@/lib/config'
import { getLensImageUrl, WUSTEP_DECK_SLUG } from '@/lib/lens-card'
import { shareCardMeta } from '@/lib/share-card'

const title = 'Lenses'
const description =
  'A canvas of lenses for seeing the world — headspace, dopamine, incentives, taste, status, and more. No single lens sees everything.'
const previewImage = getLensImageUrl(host, WUSTEP_DECK_SLUG)
const canonicalUrl = `${host}/lenses`

export default function LensesIndexPage() {
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
          'Lenses: a way of looking. Pick one. Try it on.'
        )}
        <meta name='twitter:domain' content={domain} />
        {x && <meta name='twitter:creator' content={`@${x}`} />}
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
      </Head>
      <LensesPage />
    </>
  )
}
