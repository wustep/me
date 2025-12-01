import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundBombermanPage() {
  return (
    <PlaygroundLayout title='Bomberman' breadcrumbs={[{ label: 'Bomberman' }]}>
      <div className='space-y-6'>
        <p className='text-muted-foreground'>
          Bomberman clone with emojis. Fully vibe coded with Cursor & Claude 3.5
          Sonnet in half a day for fun.
        </p>
        <div className='relative w-full overflow-hidden rounded-3xl border bg-card shadow-lg'>
          <iframe
            src='https://wustep-bomberman.vercel.app/'
            title='Bomberman iframe'
            className='h-[720px] w-full border-0'
            loading='lazy'
            allow='fullscreen *; gamepad *'
            allowFullScreen
          />
        </div>
      </div>
    </PlaygroundLayout>
  )
}
