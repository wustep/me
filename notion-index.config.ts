import fs from 'node:fs/promises'
import path from 'node:path'

import { domain } from './lib/config'
import { getSiteMap } from './lib/get-site-map'

const notionIndexPath = path.join(
  process.cwd(),
  'lib',
  'generated',
  'notion-index.json'
)
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')

export default async function syncNotionIndex(): Promise<void> {
  console.log('Building the rate-limited Notion page index...')
  const siteMap = await getSiteMap()
  const canonicalPageMap = Object.fromEntries(
    Object.entries(siteMap.canonicalPageMap).toSorted(([a], [b]) =>
      a.localeCompare(b)
    )
  )

  if (!Object.keys(canonicalPageMap).length) {
    throw new Error('Refusing to write an empty Notion page index')
  }

  await fs.mkdir(path.dirname(notionIndexPath), { recursive: true })
  await Promise.all([
    writeAtomic(
      notionIndexPath,
      `${JSON.stringify({ schemaVersion: 1, canonicalPageMap }, null, 2)}\n`
    ),
    writeAtomic(sitemapPath, createSitemap(domain, canonicalPageMap))
  ])

  console.log(
    `Indexed ${Object.keys(canonicalPageMap).length} Notion pages and updated sitemap.xml.`
  )
}

function createSitemap(
  siteDomain: string,
  canonicalPageMap: Record<string, string>
): string {
  const origin = `https://${siteDomain}`
  const urls = [
    origin,
    ...Object.keys(canonicalPageMap)
      .filter(
        (canonicalPagePath) =>
          canonicalPagePath !== 'design' &&
          !canonicalPagePath.startsWith('design/')
      )
      .map((canonicalPagePath) =>
        new URL(canonicalPagePath, `${origin}/`).toString()
      )
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`).join('\n')}
</urlset>
`
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

async function writeAtomic(filePath: string, contents: string): Promise<void> {
  const temporaryPath = `${filePath}.tmp`
  await fs.writeFile(temporaryPath, contents)
  await fs.rename(temporaryPath, filePath)
}
