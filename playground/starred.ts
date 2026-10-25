/**
 * Starred Playground entries, in the order they're pinned within their own
 * sidebar sections. Kept apart from the registry (which imports React
 * covers) so plain unit tests can import it.
 */
export const starredOrder = [
  'Contraptions',
  'StageBench',
  'Lenses',
  'Splash Panic!'
] as const

export type StarredTitle = (typeof starredOrder)[number]

/** The `starred` sort key for an entry: its 1-based place in `starredOrder`. */
export function starRank(title: StarredTitle): number {
  return starredOrder.indexOf(title) + 1
}
