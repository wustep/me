/* ─────────────────────────────────────────────────────────
 * Per-entry <head> metadata for Playground pages, derived from
 * playground/registry.tsx so each demo gets a real title,
 * description and link preview without a hand-written <Head>.
 * Pure (no React / registry import) so it's unit-testable.
 * ───────────────────────────────────────────────────────── */

type PlaygroundMetaEntry = {
  title: string
  url: string
  description: string
  image?: string
  ogImage?: string
}

export type PlaygroundMeta = {
  title: string
  description: string
  canonicalUrl: string
  /** Absolute preview image URL, or null to use the caller's fallback. */
  image: string | null
}

// Link unfurlers (X, Slack, iMessage…) reliably render only raster
// PNG/JPEG previews — SVG and WebP covers need a dedicated `ogImage`.
const SHAREABLE_IMAGE = /\.(png|jpe?g)$/i

export function getPlaygroundPreviewImage(
  entry: Pick<PlaygroundMetaEntry, 'image' | 'ogImage'>
): string | undefined {
  if (entry.ogImage) return entry.ogImage
  if (entry.image && SHAREABLE_IMAGE.test(entry.image)) return entry.image
  return undefined
}

export function findPlaygroundEntry<T extends { url: string }>(
  sections: { items: T[] }[],
  pathname: string
): T | undefined {
  for (const section of sections) {
    const entry = section.items.find((item) => item.url === pathname)
    if (entry) return entry
  }
  return undefined
}

export function getPlaygroundMeta({
  entry,
  pathname,
  fallbackTitle,
  fallbackDescription,
  host
}: {
  entry: PlaygroundMetaEntry | undefined
  pathname: string
  fallbackTitle: string
  fallbackDescription: string
  host: string
}): PlaygroundMeta {
  const image = entry ? getPlaygroundPreviewImage(entry) : undefined
  const pageTitle = entry?.title ?? fallbackTitle
  return {
    // Don't double up ("Jev Playground — Playground", or the index itself).
    title: /playground/i.test(pageTitle)
      ? pageTitle
      : `${pageTitle} — Playground`,
    description: entry?.description ?? fallbackDescription,
    canonicalUrl: `${host}${pathname}`,
    image: image ? new URL(image, host).toString() : null
  }
}
