import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundStarryNightPage() {
  return (
    <PlaygroundLayout
      title='Starry Night Sequencer'
      breadcrumbs={[{ label: 'Starry Night Sequencer' }]}
    >
      <div className='space-y-6'>
        <p className='text-muted-foreground'>
          At MIDI visualizer I made in 2016, built with MIDI.js, jQuery UI, and
          pure canvas rendering.
        </p>
        <div className='rounded-3xl border bg-card shadow-lg'>
          <iframe
            src='https://wustep.github.io/starry-sequencer/player.html'
            title='Starry Night Sequencer'
            className='h-[700px] w-full rounded-3xl'
          />
        </div>
      </div>
    </PlaygroundLayout>
  )
}
