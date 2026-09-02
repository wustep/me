import * as React from 'react'

type AgentOnlyTag = 'span' | 'nav' | 'div'

/**
 * Machine-readable chrome: stays in the HTML for crawlers / LLM browsers,
 * but is visually hidden and out of the normal tab order for humans.
 *
 * Uses the shared `.sr-only` clip recipe from `styles/wustep.css`.
 */
export function AgentOnly({
  as: Comp = 'span',
  children
}: {
  as?: AgentOnlyTag
  children: React.ReactNode
}) {
  return (
    <Comp className='sr-only' aria-hidden='true'>
      {children}
    </Comp>
  )
}

export function AgentOnlyLink({
  href,
  children
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <AgentOnly>
      <a href={href} tabIndex={-1}>
        {children}
      </a>
    </AgentOnly>
  )
}
