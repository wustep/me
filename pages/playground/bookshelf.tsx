import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundBookshelfPage() {
  return (
    <PlaygroundLayout
      title='Bookshelf'
      breadcrumbs={[{ label: 'Bookshelf' }]}
      fullFrame
    >
      <iframe
        src='https://wustep-bookshelf.vercel.app/'
        title='Bookshelf iframe'
        className='flex-1 w-full border-0'
        loading='lazy'
        allow='fullscreen *'
        allowFullScreen
      />
    </PlaygroundLayout>
  )
}

