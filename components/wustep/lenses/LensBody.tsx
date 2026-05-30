import * as React from 'react'

/**
 * LensBody — renders a lens body authored as markdown in `lenses.md`.
 *
 *   Supports the small subset the essays use: paragraphs separated by
 *   blank lines, *emphasis*, and [text](href) links. The content is
 *   author-controlled (compiled from `lenses.md` at build time via
 *   `pnpm lenses:sync`), so there's no untrusted-HTML surface here —
 *   we build real React nodes rather than dangerouslySetInnerHTML.
 */

const INLINE = /\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  INLINE.lastIndex = 0
  while ((m = INLINE.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[1] != null) {
      nodes.push(<em key={key++}>{m[1]}</em>)
    } else {
      const href = m[3]!
      const external = /^https?:\/\//.test(href)
      nodes.push(
        <a
          key={key++}
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {m[2]}
        </a>
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export function LensBody({ markdown }: { markdown: string }) {
  const paragraphs = markdown.trim().split(/\n{2,}/)
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i}>{renderInline(p.replaceAll(/\s*\n\s*/g, ' '))}</p>
      ))}
    </>
  )
}
