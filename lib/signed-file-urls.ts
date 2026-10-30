const EXPIRING_FILE_HOSTS = new Set([
  'file.notion.com',
  'file.notion.so',
  'img.notionusercontent.com'
])

/**
 * Notion signed file URLs expire in ~1h. `file.notion.com` is the current
 * signed host for uploads that used to appear as `*.amazonaws.com`.
 */
export function isExpiringSignedFileUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return (
      hostname.endsWith('.amazonaws.com') || EXPIRING_FILE_HOSTS.has(hostname)
    )
  } catch {
    return (
      url.includes('.amazonaws.com') ||
      url.includes('file.notion.com') ||
      url.includes('file.notion.so') ||
      url.includes('img.notionusercontent.com')
    )
  }
}

const SIGNABLE_FILE_HOSTS = new Set([
  'file.notion.com',
  'file.notion.so',
  'img.notionusercontent.com'
])
const NOTION_S3_BUCKET_HOST_RE =
  /^prod-files-secure\.s3\.[a-z0-9-]+\.amazonaws\.com$/
const NOTION_S3_PATH_HOST_RE = /^s3[.-][a-z0-9-]+\.amazonaws\.com$/
const NOTION_S3_PATH_RE = /^\/(?:secure|public)\.notion-static\.com\//

/**
 * Sources `/api/notion-file` may ask Notion to sign: `attachment:` ids and
 * HTTPS URLs on Notion's own file hosts. Stricter than
 * `isExpiringSignedFileUrl`, which only decides what to strip from record
 * maps — no substring fallback, and no arbitrary `*.amazonaws.com` bucket.
 */
export function isSignableNotionFileUrl(url: string): boolean {
  if (url.startsWith('attachment:')) return true

  try {
    const { protocol, hostname, pathname } = new URL(url)
    if (protocol !== 'https:') return false
    return (
      SIGNABLE_FILE_HOSTS.has(hostname) ||
      NOTION_S3_BUCKET_HOST_RE.test(hostname) ||
      (NOTION_S3_PATH_HOST_RE.test(hostname) &&
        NOTION_S3_PATH_RE.test(pathname))
    )
  } catch {
    return false
  }
}

const stripQuery = (url: string) => url.replace(/[?#].*$/, '')

/**
 * True when `source` appears in the block's own `properties` or `format`
 * (image/video source, page cover/icon, a files property). Stops the signer
 * from minting URLs for files that merely share a workspace with the block.
 */
export function blockReferencesFile(
  block: { properties?: unknown; format?: unknown },
  source: string
): boolean {
  const target = stripQuery(source)

  const visit = (value: unknown, depth: number): boolean => {
    if (typeof value === 'string') return stripQuery(value) === target
    if (depth <= 0 || !value || typeof value !== 'object') return false
    return Object.values(value).some((child) => visit(child, depth - 1))
  }

  return visit(block.properties, 8) || visit(block.format, 8)
}

export function filterSignedUrls(
  signedUrls: Record<string, string>
): Record<string, string> {
  const next: Record<string, string> = {}

  for (const [blockId, url] of Object.entries(signedUrls)) {
    if (!url || isExpiringSignedFileUrl(url)) {
      continue
    }
    next[blockId] = url
  }

  return next
}
