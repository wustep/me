import type { GetStaticProps } from 'next'
import Head from 'next/head'

import { LensesIllustrationLab } from '@/components/wustep/lenses/LensesIllustrationLab'
import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { isDev } from '@/lib/config'

export const getStaticProps = (async () => {
  if (!isDev) {
    return { notFound: true }
  }

  return { props: {} }
}) satisfies GetStaticProps

export default function PlaygroundLensesIllustrationsPage() {
  if (!isDev) return null

  return (
    <>
      <Head>
        <title>Lenses Illustration Lab</title>
        <meta name='robots' content='noindex,nofollow' />
      </Head>
      <PlaygroundLayout
        title='Lenses Illustration Lab'
        breadcrumbs={[
          { label: 'Lenses', href: '/playground/lenses' },
          { label: 'Illustrations' }
        ]}
        fullFrame
      >
        <LensesIllustrationLab />
      </PlaygroundLayout>
    </>
  )
}
