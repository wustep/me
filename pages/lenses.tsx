import Head from 'next/head'

import { LensesPage } from '@/components/wustep/lenses'
import { domain, host, name, x } from '@/lib/config'

const title = 'Lenses'
const description =
  'A canvas of lenses for seeing the world — Great Man theory, evolutionary psychology, minimalism, utility functions, status, and more. No single lens sees everything.'
const previewImage = `${host}/favicon-512x512.png`
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
        <meta property='og:image' content={previewImage} />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:domain' content={domain} />
        {x && <meta name='twitter:creator' content={`@${x}`} />}
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={previewImage} />
      </Head>
      <LensesPage />
    </>
  )
}
