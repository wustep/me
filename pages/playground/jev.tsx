import Head from 'next/head'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { domain, name, x } from '@/lib/config'

// The landing is the front door; Music, Trolley, Inbox, and Match are
// routes on the same deployment, so one URL reaches all four.
const APP_URL = 'https://jev-playground.vercel.app/'

const title = 'Jev Playground'
const description =
  'Can a System One model steer music? Jev chooses only enums — character, form, key, chords — and the app writes the sheet, the sound, and the MIDI. Trolley problems, inbox triage, and match ranking sit in the other rooms.'
const canonicalUrl = 'https://wustep.me/playground/jev'

export default function PlaygroundJevPage() {
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
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:domain' content={domain} />
        {x && <meta name='twitter:creator' content={`@${x}`} />}
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
      </Head>
      <PlaygroundLayout
        title='Jev Playground'
        breadcrumbs={[{ label: 'Jev Playground' }]}
        fullFrame
        openHref={APP_URL}
      >
        <iframe
          src={APP_URL}
          title='Jev Playground'
          className='flex-1 w-full border-0'
          loading='lazy'
          allow='fullscreen *'
          allowFullScreen
        />
      </PlaygroundLayout>
    </>
  )
}
