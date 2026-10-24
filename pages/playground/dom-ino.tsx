import { useEffect, useState } from 'react'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { shareVideo } from '@/lib/share-card'

export default function PlaygroundDominoPage() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <PlaygroundLayout
      title='DOMino'
      breadcrumbs={[{ label: 'DOMino' }]}
      shareVideo={shareVideo('playground/og/dom-ino')}
      fullFrame
    >
      {hasMounted && (
        <iframe
          src='https://dom-ino.vercel.app'
          title='DOMino iframe'
          className='flex-1 w-full border-0'
          loading='lazy'
          allow='autoplay *; fullscreen *'
          allowFullScreen
        />
      )}
    </PlaygroundLayout>
  )
}
