import { useEffect, useState } from 'react'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundDominoPage() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <PlaygroundLayout
      title='DOMino'
      breadcrumbs={[{ label: 'DOMino' }]}
      fullFrame
    >
      {hasMounted && (
        <iframe
          src='https://dom-ino.vercel.app'
          title='DOMino iframe'
          className='flex-1 w-full border-0'
          loading='lazy'
          allow='fullscreen *'
          allowFullScreen
        />
      )}
    </PlaygroundLayout>
  )
}
