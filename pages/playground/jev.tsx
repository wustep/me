import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

// The landing is the front door; Music, Trolley, Inbox, and Match are
// routes on the same deployment, so one URL reaches all four.
const APP_URL = 'https://jev-playground.vercel.app/'

const description =
  'Can a System One model steer music? Jev chooses only enums — character, form, key, chords — and the app writes the sheet, the sound, and the MIDI. Trolley problems, inbox triage, and match ranking sit in the other rooms.'

export default function PlaygroundJevPage() {
  return (
    <PlaygroundLayout
      title='Jev Playground'
      breadcrumbs={[{ label: 'Jev Playground' }]}
      fullFrame
      openHref={APP_URL}
      // Hidden from the registry for now, so pass the description directly.
      description={description}
    >
      <iframe
        src={APP_URL}
        title='Jev Playground'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='fullscreen *'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
