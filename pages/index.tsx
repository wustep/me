import Head from 'next/head'

import { AboutPage, bioText } from '@/components/AboutPage'
import { domain, host, name, x } from '@/lib/config'

const previewImage = `${host}/favicon-512x512.png`
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
        <meta property='og:image' content={previewImage} />
        <meta property='og:image:width' content='512' />
        <meta property='og:image:height' content='512' />
        <meta property='og:image:type' content='image/png' />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:domain' content={domain} />
        {x && <meta name='twitter:creator' content={`@${x}`} />}
        <meta name='twitter:title' content={name} />
        <meta name='twitter:description' content={bioText} />
        <meta name='twitter:image' content={previewImage} />
      </Head>
      <AboutPage />
    </>
  )
}
