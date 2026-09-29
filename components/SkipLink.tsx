import type * as React from 'react'

/**
 * Visually hidden "Skip to content" link, revealed on keyboard focus. Every
 * surface marks its content with a `<main>` (react-notion-x's `.notion-page`,
 * the Playground `SidebarInset`, the prompting/about/design pages), so the
 * link targets the first one instead of requiring a shared id.
 */
function focusMain(event: React.MouseEvent<HTMLAnchorElement>) {
  const main =
    document.querySelector<HTMLElement>('#main') ??
    document.querySelector<HTMLElement>('main')
  if (!main) return

  event.preventDefault()
  if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1')
  main.focus()
  main.scrollIntoView({ block: 'start' })
}

export function SkipLink() {
  return (
    <a href='#main' className='skip-link' onClick={focusMain}>
      Skip to content
    </a>
  )
}
