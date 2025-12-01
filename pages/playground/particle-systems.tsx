import dynamic from 'next/dynamic'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const ParticleSystems = dynamic(() => import('@/playground/particle-systems'), {
  ssr: false
})

export default function ParticleSystemsPage() {
  return (
    <PlaygroundLayout
      title='Particle Systems'
      breadcrumbs={[{ label: 'Particle Systems' }]}
    >
      <ParticleSystems />
    </PlaygroundLayout>
  )
}
