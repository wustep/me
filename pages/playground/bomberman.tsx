import dynamic from 'next/dynamic'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const Bomberman = dynamic(() => import('@/playground/bomberman'), {
  ssr: false
})

export default function PlaygroundBombermanPage() {
  return (
    <PlaygroundLayout title='Bomberman' breadcrumbs={[{ label: 'Bomberman' }]}>
      <Bomberman />
    </PlaygroundLayout>
  )
}
