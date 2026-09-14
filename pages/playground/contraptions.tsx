import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

// The show is the app's front door; the sandbox it grew out of sits behind
// the gear at its top-left, so one URL is enough here.
const SHOW_URL = 'https://contraptions-wustep.vercel.app/'

export default function PlaygroundContraptionsPage() {
  return (
    <PlaygroundLayout
      title='Contraptions'
      breadcrumbs={[{ label: 'Contraptions' }]}
      fullFrame
      openHref={SHOW_URL}
    >
      <iframe
        src={SHOW_URL}
        title='Contraptions'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='fullscreen *'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
