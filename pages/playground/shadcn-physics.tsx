import Link from 'next/link'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function ShadcnPhysicsPage() {
  return (
    <PlaygroundLayout
      title='Shadcn Physics'
      breadcrumbs={[{ label: 'Shadcn Physics' }]}
    >
      <div className='space-y-6'>
        <p className='text-muted-foreground'>
          Stack and fling shadcn/ui components inside a playful physics sandbox.
          <br />
          Built with{' '}
          <Link href='https://brm.io/matter-js/' target='_blank'>
            Matter.js
          </Link>
          . Click 'Spawn' to begin.
        </p>
        <div className='rounded-3xl border bg-card shadow-lg overflow-hidden'>
          <iframe
            src={'https://shadbook-app.vercel.app/physics'}
            title='shadcn + Physics'
            className={`h-[720px] w-full border-0`}
            loading='lazy'
            allow='accelerometer; ambient-light-sensor; fullscreen; gyroscope; magnetometer; xr-spatial-tracking'
            allowFullScreen
          />
        </div>
      </div>
    </PlaygroundLayout>
  )
}
