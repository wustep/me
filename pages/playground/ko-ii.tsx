import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const APP_URL = 'https://ko-ii.vercel.app/'

export default function PlaygroundKoIIPage() {
  return (
    <PlaygroundLayout
      title='EP-133 K.O. II'
      breadcrumbs={[{ label: 'EP-133 K.O. II' }]}
      fullFrame
      openHref={APP_URL}
    >
      <iframe
        src={APP_URL}
        title='EP-133 K.O. II'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='autoplay; fullscreen; midi'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}
