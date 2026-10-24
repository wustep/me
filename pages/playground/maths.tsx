import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const APP_URL = 'https://maths.wustep.me/'

export default function PlaygroundMathsPage() {
  return (
    <PlaygroundLayout
      title='Maths'
      breadcrumbs={[{ label: 'Maths' }]}
      fullFrame
      openHref={APP_URL}
    >
      <iframe
        src={APP_URL}
        title='Maths'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='autoplay *; fullscreen *; midi *'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
