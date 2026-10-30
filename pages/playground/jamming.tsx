import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const APP_URL = 'https://jamming.wustep.me/'

export default function PlaygroundJammingPage() {
  return (
    <PlaygroundLayout
      title='Jamming'
      breadcrumbs={[{ label: 'Jamming' }]}
      fullFrame
      openHref={APP_URL}
    >
      <iframe
        src={APP_URL}
        title='Jamming'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='autoplay; fullscreen; midi'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
