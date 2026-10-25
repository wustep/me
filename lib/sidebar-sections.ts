type SidebarItem = { title: string; starred?: number }
type SidebarSection<T extends SidebarItem> = { title: string; items: T[] }

/**
 * Pins starred items to the top of their own section, sorted by their
 * `starred` position; the rest keep their registry order below them.
 * Sections left empty (e.g. after owner-only filtering) are removed.
 */
export function pinStarred<T extends SidebarItem>(
  sections: SidebarSection<T>[]
): SidebarSection<T>[] {
  return sections
    .map((section) => ({
      ...section,
      items: [
        ...section.items
          .filter((item) => item.starred !== undefined)
          .toSorted((a, b) => (a.starred ?? 0) - (b.starred ?? 0)),
        ...section.items.filter((item) => item.starred === undefined)
      ]
    }))
    .filter((section) => section.items.length > 0)
}
