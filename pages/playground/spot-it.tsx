import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundSpotItPage() {
  return (
    <PlaygroundLayout title='Spot it!' breadcrumbs={[{ label: 'Spot it!' }]}>
      <div className='relative w-full overflow-hidden rounded-3xl border bg-card shadow-lg'>
        <iframe
          src='https://spot-its.vercel.app/'
          title='Spot it! iframe'
          className='h-[calc(100vh-200px)] min-h-[600px] w-full border-0'
          loading='lazy'
          allow='fullscreen *'
          allowFullScreen
        />
      </div>
    </PlaygroundLayout>
  )
}

