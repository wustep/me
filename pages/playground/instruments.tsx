import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const APP_URL = 'https://instruments-wustep.vercel.app/'

export default function PlaygroundInstrumentsPage() {
  return (
    <PlaygroundLayout
      title='Instruments'
      breadcrumbs={[{ label: 'Instruments' }]}
      fullFrame
      openHref={APP_URL}
    >
      <iframe
        src={APP_URL}
        title='Instruments'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='autoplay; fullscreen; midi'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
