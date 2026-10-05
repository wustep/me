import Head from 'next/head'
import { useRouter } from 'next/router'

import { domain, host, name, x } from '@/lib/config'
import { findPlaygroundEntry, getPlaygroundMeta } from '@/lib/playground-meta'
import { shareCardMeta, shareCardUrl } from '@/lib/share-card'
import { playgroundSections } from '@/playground/registry'

const FALLBACK_DESCRIPTION =
  'A collection of interactive experiments, demos, and creative projects by Stephen Wu.'

/**
 * Title, description, canonical and link-preview tags for a Playground page,
 * looked up from the registry by path so every entry shares consistently
 * without its own hand-written <Head>. Pages outside the registry (the
 * index, hidden entries) fall back to the layout title.
 */
export function PlaygroundHead({
  title,
  description
}: {
  title: string
  description?: string
}) {
  const { pathname } = useRouter()
  const meta = getPlaygroundMeta({
    entry: findPlaygroundEntry(playgroundSections, pathname),
    pathname,
    fallbackTitle: title,
    fallbackDescription: description ?? FALLBACK_DESCRIPTION,
    host
  })
  // The index and pages outside the registry share the Playground card.
  const image = meta.image ?? shareCardUrl('playground')

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name='description' content={meta.description} />
      <link rel='canonical' href={meta.canonicalUrl} />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content={name} />
      <meta property='og:title' content={meta.title} />
      <meta property='og:description' content={meta.description} />
      <meta property='og:url' content={meta.canonicalUrl} />
      {shareCardMeta(image)}
      <meta name='twitter:domain' content={domain} />
      {x && <meta name='twitter:creator' content={`@${x}`} />}
      <meta name='twitter:title' content={meta.title} />
      <meta name='twitter:description' content={meta.description} />
    </Head>
  )
}
