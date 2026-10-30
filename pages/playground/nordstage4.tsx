import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const APP_URL = 'https://nordstage4.vercel.app/'

export default function PlaygroundNordStage4Page() {
  return (
    <PlaygroundLayout
      title='Nord Stage 4'
      breadcrumbs={[{ label: 'Nord Stage 4' }]}
      fullFrame
      openHref={APP_URL}
    >
      <iframe
        src={APP_URL}
        title='Nord Stage 4'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='autoplay; fullscreen; midi'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
