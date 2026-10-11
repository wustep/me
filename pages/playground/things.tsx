import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const THINGS_URL = 'https://things.wustep.me/'

export default function PlaygroundThingsPage() {
  return (
    <PlaygroundLayout
      title='Things'
      breadcrumbs={[{ label: 'Things' }]}
      fullFrame
      openHref={THINGS_URL}
    >
      <iframe
        src={THINGS_URL}
        title='Things'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='fullscreen *'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
