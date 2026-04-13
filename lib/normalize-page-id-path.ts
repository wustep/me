const pageIdSuffixPattern =
  /(?<prefix>.*?)(?<uuid>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i

export function normalizePageIdPath(rawPageId: string): string {
  const match = rawPageId.match(pageIdSuffixPattern)

  if (!match?.groups) {
    return rawPageId
  }

  const { prefix, uuid } = match.groups
  return `${prefix}${uuid?.replaceAll('-', '')}`
}
