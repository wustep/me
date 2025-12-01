import dynamic from 'next/dynamic'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const ShadcnPhysics = dynamic(() => import('@/playground/shadcn-physics'), {
  ssr: false
})

export default function ShadcnPhysicsPage() {
  return (
    <PlaygroundLayout
      title='Shadcn Physics'
      breadcrumbs={[{ label: 'Shadcn Physics' }]}
    >
      <ShadcnPhysics />
    </PlaygroundLayout>
  )
}
