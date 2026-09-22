import Head from 'next/head'

import { domain, name, x } from '@/lib/config'

import styles from './contraptions.module.css'

// First-class front door. The playground path redirects here so the show is
// one full-viewport iframe, with no site header, footer, or playground chrome.
const SHOW_URL = 'https://contraptions-wustep.vercel.app/'

const title = 'Contraptions'
const description =
  'One ball on a Rube Goldberg chain that never ends, with a new world behind every portal.'
const previewImage = 'https://wustep.me/playground/covers/contraptions.png'
const canonicalUrl = 'https://wustep.me/contraptions'

export default function ContraptionsPage() {
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
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:image:type' content='image/png' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:domain' content={domain} />
        {x ? <meta name='twitter:creator' content={`@${x}`} /> : null}
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={previewImage} />
      </Head>
      <iframe
        src={SHOW_URL}
        title={title}
        className={styles.frame}
        allow='fullscreen *'
        allowFullScreen
      />
    </>
  )
}
