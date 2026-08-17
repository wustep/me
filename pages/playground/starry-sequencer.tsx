import { ExternalLink } from 'lucide-react'
import { useState } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { cn } from '@/lib/utils'

const PLAYER_URL = 'https://wustep.github.io/starry-sequencer/player.html'
const POSTER = '/playground/covers/starry-sequencer-poster.webp'

export default function PlaygroundStarryNightPage() {
  const [loaded, setLoaded] = useState(false)

  return (
    <PlaygroundLayout
      title='Starry Night Sequencer'
      breadcrumbs={[{ label: 'Starry Night Sequencer' }]}
      fullFrame
    >
      <div className='flex min-h-0 min-w-0 flex-1 flex-col'>
        <div className='flex shrink-0 flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-muted-foreground text-sm'>
            A MIDI visualizer I made in 2016, built with MIDI.js, jQuery UI, and
            canvas. Best on desktop — mobile browsers often block the audio.
          </p>
          <a
            href={PLAYER_URL}
            target='_blank'
            rel='noreferrer'
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'shrink-0 self-start sm:self-auto'
            )}
          >
            Open in its own tab
            <ExternalLink aria-hidden='true' />
          </a>
        </div>
        <div className='relative min-h-0 flex-1 bg-[#1a2744]'>
          {!loaded && (
            <div
              className='absolute inset-0 bg-cover bg-center'
              style={{ backgroundImage: `url(${POSTER})` }}
              aria-hidden='true'
            >
              <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                <p className='rounded-full bg-black/55 px-3 py-1.5 text-sm text-white'>
                  Loading the sequencer…
                </p>
              </div>
            </div>
          )}
          <iframe
            src={PLAYER_URL}
            title='Starry Night Sequencer'
            className={cn(
              'absolute inset-0 h-full w-full border-0',
              loaded ? 'opacity-100' : 'opacity-0'
            )}
            allow='autoplay; midi; fullscreen'
            allowFullScreen
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </PlaygroundLayout>
  )
}
