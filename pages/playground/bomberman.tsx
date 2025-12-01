import dynamic from 'next/dynamic'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const Bomberman = dynamic(() => import('@/playground/bomberman'), {
  ssr: false
})

export default function PlaygroundBombermanPage() {
  return (
    <PlaygroundLayout title='Bomberman' breadcrumbs={[{ label: 'Bomberman' }]}>
      <div className='space-y-6'>
        <p className='text-muted-foreground'>
          Bomberman clone with emojis. Fully vibe coded with Cursor & Claude 3.5
          Sonnet in half a day.
        </p>
        <Bomberman />
      </div>
    </PlaygroundLayout>
  )
}
