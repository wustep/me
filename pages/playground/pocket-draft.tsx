import Head from 'next/head'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { PocketDraft } from '@/components/wustep/PocketDraft'

export default function PlaygroundPocketDraftPage() {
  return (
    <>
      <Head>
        <title>Pocket Draft</title>
      </Head>
      <PlaygroundLayout
        title='Pocket Draft'
        breadcrumbs={[{ label: 'Pocket Draft' }]}
      >
        <p className='text-muted-foreground mb-6'>
          Draft a five-card pocket recital against Silence. Pick 1 of 3 each
          round, then play it in one click. Same seed, same draft.
        </p>
        <PocketDraft />
      </PlaygroundLayout>
    </>
  )
}
