/**
 * Every /playground page renders its own PlaygroundLayout, so the sidebar
 * remounts on each navigation and its scroll box would start at the top.
 * The sidebar saves its scrollTop here and restores it on mount.
 */
const STORAGE_KEY = 'playground-sidebar-scroll:v1'

// Survives client-side navigation even when sessionStorage is unavailable.
let memoryScrollTop: number | null = null

export function loadSidebarScrollTop(): number | null {
  if (memoryScrollTop !== null) return memoryScrollTop
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    const value = stored === null ? Number.NaN : Number(stored)
    return Number.isFinite(value) && value >= 0 ? value : null
  } catch {
    return null
  }
}

export function saveSidebarScrollTop(scrollTop: number) {
  memoryScrollTop = scrollTop
  try {
    window.sessionStorage.setItem(STORAGE_KEY, String(Math.round(scrollTop)))
  } catch {
    // sessionStorage can be disabled; the in-memory copy still covers SPA nav.
  }
}

/**
 * The scrollTop that brings an item fully into view, or the current one when
 * it is already visible — so restoring never jumps for an on-screen item.
 * `itemTop` is relative to the scroll content (offset from its top edge).
 */
export function scrollTopToReveal({
  scrollTop,
  viewportHeight,
  itemTop,
  itemHeight,
  margin = 8
}: {
  scrollTop: number
  viewportHeight: number
  itemTop: number
  itemHeight: number
  margin?: number
}): number {
  const itemBottom = itemTop + itemHeight
  if (itemTop - margin < scrollTop) return Math.max(0, itemTop - margin)
  if (itemBottom + margin > scrollTop + viewportHeight) {
    return itemBottom + margin - viewportHeight
  }
  return scrollTop
}
