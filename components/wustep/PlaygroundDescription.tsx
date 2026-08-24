import * as React from 'react'

/**
 * Playground descriptions are plain strings — they feed the sidebar About
 * panel and, for entries without a `summary`, the card body. Some of them need
 * to credit a source, so they may carry markdown links.
 *
 * Rather than change the field's type and break the places that want a string,
 * the syntax is resolved at render: `PlaygroundDescription` turns it into real
 * links, and `plainDescription` flattens it for anywhere that cannot take one.
 */
const LINK = /\[([^\]]+)]\(([^)]+)\)/g

/** `[text](href)` → `text`, for contexts that need a bare string. */
export function plainDescription(text: string): string {
  return text.replaceAll(LINK, '$1')
}

export function PlaygroundDescription({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let last = 0

  for (const match of text.matchAll(LINK)) {
    const at = match.index ?? 0
    if (at > last) parts.push(text.slice(last, at))
    parts.push(
      <a
        key={at}
        href={match[2]}
        target='_blank'
        rel='noreferrer'
        className='underline underline-offset-2 hover:text-sidebar-foreground'
      >
        {match[1]}
      </a>
    )
    last = at + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))

  return <>{parts}</>
}
