import Head from 'next/head'

import { LensesIllustrationLab } from '@/components/wustep/lenses/LensesIllustrationLab'
import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundLensesIllustrationsPage() {
  return (
    <>
      <Head>
        <title>Lenses Illustration Lab</title>
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
