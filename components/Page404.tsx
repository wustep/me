import * as React from 'react'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'

import { AgentOnly } from './AgentOnly'
import styles from './Page404.module.css'
import { PageHead } from './PageHead'

export function Page404({ site, pageId, error }: types.PageProps) {
  // Lead with the status so the tab and history entry say what happened;
  // `site.name` alone read as a normal "Stephen Wu" page.
  const title = `Page not found · ${site?.name || config.name}`

  return (
    <>
      <PageHead site={site} title={title} />

      <main className={styles.page}>
        <div className={styles.content}>
          <LookingCode />

          <div className={styles.divider} />

          <h1 className={styles.heading}>Page not found</h1>

          <p className={styles.description}>
            The page you&rsquo;re looking for doesn&rsquo;t exist or has been
            moved. Maybe wander somewhere else instead?
          </p>

          <p className={styles.hints}>
            <a href='/playground'>Playground</a>
            <span aria-hidden='true'> · </span>
            <a href='/lenses'>Lenses</a>
            <span aria-hidden='true'> · </span>
            <AgentOnly>
              <a href='/llms.txt' tabIndex={-1}>
                llms.txt
              </a>
              {' · '}
            </AgentOnly>
            <a href='/sitemap.xml'>sitemap.xml</a>
          </p>

          <a className={styles.homeLink} href={config.host}>
            <svg
              viewBox='0 0 16 16'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
            >
              <path d='M10 3L5 8l5 5' />
            </svg>
            Back home
          </a>

          {config.isDev && (
            <div className={styles.devError}>
              {error ? (
                <p>{error.message}</p>
              ) : (
                pageId && (
                  <p>
                    Notion page &ldquo;{pageId}&rdquo; is not publicly
                    accessible.
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

/* ---------- The 404 that looks for the page ----------
   The zero is an eye: a pupil sits in its counter and looks around for the
   missing page. With a pointer on the page it follows that instead, then goes
   back to searching once the pointer has been still for a while. The idle
   search and the pupil geometry live in Page404.module.css.

   Reduced motion skips all of it: the pupil keeps its rest pose, glancing
   down at the message. */

// Where the middle of the zero's counter sits inside its 1em-tall box, in em.
// Must match the pupil's `left` / `top` in Page404.module.css.
const EYE_X = 0.2845
const EYE_Y = 0.5555
// Pointer distance, in px, at which the pupil reaches the rim of the counter.
const EYE_REACH = 220
// Go back to searching after this long without the pointer moving. A tap has
// no hover to linger on, so touch gets a shorter look.
const EYE_IDLE_MS = 3500
const EYE_IDLE_TOUCH_MS = 1600

function LookingCode() {
  const zeroRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    const zero = zeroRef.current
    if (!zero) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let idle: ReturnType<typeof setTimeout> | undefined
    let pointer: { x: number; y: number } | undefined

    const look = () => {
      frame = 0
      if (!pointer) return
      const rect = zero.getBoundingClientRect()
      // line-height is 1, so the box is exactly one em tall.
      const em = rect.height
      const dx = pointer.x - (rect.left + EYE_X * em)
      const dy = pointer.y - (rect.top + EYE_Y * em)
      const distance = Math.hypot(dx, dy)
      const reach = Math.min(distance / EYE_REACH, 1)
      const x = distance > 0 ? (dx / distance) * reach : 0
      const y = distance > 0 ? (dy / distance) * reach : 0
      zero.style.setProperty('--look-x', x.toFixed(3))
      zero.style.setProperty('--look-y', y.toFixed(3))
      zero.dataset.tracking = 'true'
    }

    const search = () => {
      clearTimeout(idle)
      pointer = undefined
      delete zero.dataset.tracking
      zero.style.removeProperty('--look-x')
      zero.style.removeProperty('--look-y')
    }

    const onPointer = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
      if (!frame) frame = requestAnimationFrame(look)
      clearTimeout(idle)
      idle = setTimeout(
        search,
        event.pointerType === 'touch' ? EYE_IDLE_TOUCH_MS : EYE_IDLE_MS
      )
    }

    // A mouse leaving the window stops being followed at once. A finger
    // "leaves" every time it lifts, so touch waits out its idle timer instead.
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') search()
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerdown', onPointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
      clearTimeout(idle)
    }
  }, [])

  return (
    <p className={styles.code}>
      4
      <span ref={zeroRef} className={styles.zero}>
        0
        <span className={styles.pupil} aria-hidden='true' />
      </span>
      4
    </p>
  )
}
