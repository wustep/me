type SidebarItem = { title: string; starred?: number }
type SidebarSection<T extends SidebarItem> = { title: string; items: T[] }

/**
 * Splits starred items out to pin at the top of the sidebar, sorted by their
 * `starred` position, and drops them from their own sections so nothing is
 * listed twice. Sections left empty are removed.
 */
export function pinStarred<T extends SidebarItem>(
  sections: SidebarSection<T>[]
): { pinned: T[]; sections: SidebarSection<T>[] } {
  const pinned = sections
    .flatMap((section) =>
      section.items.filter((item) => item.starred !== undefined)
    )
    .toSorted((a, b) => (a.starred ?? 0) - (b.starred ?? 0))
  const rest = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.starred === undefined)
    }))
    .filter((section) => section.items.length > 0)
  return { pinned, sections: rest }
}
