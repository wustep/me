import Head from 'next/head'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { domain, host, name, x } from '@/lib/config'

// The show is the app's front door; the sandbox it grew out of sits behind
// the gear at its top-left, so one URL is enough here.
const SHOW_URL = 'https://contraptions-wustep.vercel.app/'

const title = 'Contraptions'
const description =
  'One ball on a Rube Goldberg chain that never ends, with a new world behind every portal.'
const previewImage = `${host}/playground/covers/contraptions.png`
const canonicalUrl = `${host}/playground/contraptions`

export default function PlaygroundContraptionsPage() {
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
        {x && <meta name='twitter:creator' content={`@${x}`} />}
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={previewImage} />
      </Head>
      <PlaygroundLayout
        title='Contraptions'
        breadcrumbs={[{ label: 'Contraptions' }]}
        fullFrame
        openHref={SHOW_URL}
      >
        <iframe
          src={SHOW_URL}
          title='Contraptions'
          className='flex-1 w-full border-0'
          loading='lazy'
          allow='fullscreen *'
          allowFullScreen
        />
      </PlaygroundLayout>
    </>
  )
}
