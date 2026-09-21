import dynamic from 'next/dynamic'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const JevMatch = dynamic(
  () => import('@/components/wustep/jev-match').then((m) => m.JevMatch),
  { ssr: false }
)

export default function PlaygroundJevMatchPage() {
  return (
    <PlaygroundLayout
      title='Jev Match'
      breadcrumbs={[{ label: 'Jev Match' }]}
      fullFrame
    >
      <JevMatch />
    </PlaygroundLayout>
  )
}
