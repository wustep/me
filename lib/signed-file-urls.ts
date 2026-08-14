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
