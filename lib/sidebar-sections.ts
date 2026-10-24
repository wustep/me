type SidebarItem = { title: string; starred?: boolean }
type SidebarSection<T extends SidebarItem> = { title: string; items: T[] }

export const STARRED_SECTION_TITLE = 'Starred'

/**
 * Moves starred items into a Starred section at the top, in registry order,
 * and drops them from their own sections so nothing is listed twice.
 * Sections left empty are removed.
 */
export function withStarredSection<T extends SidebarItem>(
  sections: SidebarSection<T>[]
): SidebarSection<T>[] {
  const starred = sections.flatMap((section) =>
    section.items.filter((item) => item.starred)
  )
  const rest = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.starred)
    }))
    .filter((section) => section.items.length > 0)
  return starred.length > 0
    ? [{ title: STARRED_SECTION_TITLE, items: starred }, ...rest]
    : rest
}
