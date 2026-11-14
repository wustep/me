/**
 * The favicon turtle is shy: it pulls into its shell while the tab is in the
 * background and comes back out when you return. This module owns the frame
 * names; components/wustep/ShyFavicon.tsx watches the tab and swaps them.
 *
 * The extra frames (`public/favicon-{peek,tucked}-*.png`) are the regular
 * favicon with the legs and tail (and, when tucked, the head) removed and the
 * shell set down on the line the feet stood on.
 */

export type TurtlePose = 'awake' | 'peek' | 'tucked'

// The icons _document.tsx links to: the awake turtle.
const TURTLE_ICONS = new Set([
  '/favicon.ico',
  '/favicon.png',
  '/favicon-32x32.png',
  '/favicon-192x192.png'
])

/**
 * The frame to show for `pose` in place of the favicon at `awakeHref`, or
 * `undefined` to leave that icon alone (it is not one of the turtle icons).
 * `sizes` is the link's `sizes` attribute; anything but the 192px icon gets
 * the 32px frame, which is what a tab strip draws.
 */
export function faviconForPose(
  pose: TurtlePose,
  awakeHref: string,
  sizes?: string | null
): string | undefined {
  let path: string
  try {
    path = new URL(awakeHref, 'https://wustep.me').pathname
  } catch {
    return undefined
  }
  if (!TURTLE_ICONS.has(path)) return undefined
  if (pose === 'awake') return awakeHref
  const size = sizes?.includes('192x192') ? '192x192' : '32x32'
  return `/favicon-${pose}-${size}.png`
}
