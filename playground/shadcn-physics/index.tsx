'use client'

import Link from 'next/link'

const PHYSICS_URL = 'https://shadbook-app.vercel.app/physics'

export default function ShadcnPhysicsExperiment() {
  return (
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
      <div className='rounded-2xl border bg-muted/30 shadow-inner overflow-hidden'>
        <iframe
          src={PHYSICS_URL}
          title='shadcn + Physics'
          className={`h-[720px] w-full border-0`}
          loading='lazy'
          allow='accelerometer; ambient-light-sensor; fullscreen; gyroscope; magnetometer; xr-spatial-tracking'
          allowFullScreen
        />
      </div>
    </div>
  )
}
