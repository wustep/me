import { useEffect, useState } from 'react'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { useDarkMode } from '@/lib/use-dark-mode'

const SPINE_COLORS = [
  '#e74c3c',
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#a855f7',
  '#06b6d4',
  '#ec4899'
]

const SPINE_HEIGHTS = ['70%', '85%', '60%', '90%', '75%', '65%', '80%']

function BookshelfLoading() {
  return (
    <div
      className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background'
      role='status'
      aria-live='polite'
    >
      <div className='flex h-16 items-end gap-1.5' aria-hidden='true'>
        {SPINE_COLORS.map((color, i) => (
          <span
            key={color}
            className='w-3 animate-pulse rounded-t-sm'
            style={{
              background: color,
              height: SPINE_HEIGHTS[i],
              animationDelay: `${i * 80}ms`
            }}
          />
        ))}
      </div>
      <p className='text-sm text-muted-foreground'>Loading the bookshelf…</p>
    </div>
  )
}

export default function PlaygroundBookshelfPage() {
  const [hasMounted, setHasMounted] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { isDarkMode } = useDarkMode()
  const mode = isDarkMode ? 'dark' : 'light'

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Cross-origin onLoad usually fires; if the embed hangs, drop the
  // overlay so a failed frame is still visible instead of a forever wait.
  useEffect(() => {
    if (!hasMounted) return
    const timeout = window.setTimeout(() => setLoaded(true), 8000)
    return () => window.clearTimeout(timeout)
  }, [hasMounted])

  return (
    <PlaygroundLayout
      title='Bookshelf'
      breadcrumbs={[{ label: 'Bookshelf' }]}
      fullFrame
    >
      <div className='relative min-h-0 flex-1'>
        {(!hasMounted || !loaded) && <BookshelfLoading />}
        {hasMounted && (
          <iframe
            src={`https://wustep-bookshelf.vercel.app/?mode=${mode}`}
            title='Bookshelf'
            className='absolute inset-0 h-full w-full border-0'
            allow='fullscreen *'
            allowFullScreen
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>
    </PlaygroundLayout>
  )
}
