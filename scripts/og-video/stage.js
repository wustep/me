/* ─────────────────────────────────────────────────────────
 * Restages the live /playground page as a 1200×630 share
 * card, in the browser, from the page's own elements: the
 * sidebar's flask mark, the page's h1 and lede on the left,
 * and the real cover grid (CSS modules, inline keyframes and
 * all) as a two-column strip on the right.
 *
 * Only the named cards show, in the given order (the rest are
 * hidden), and they're cloned below the originals so the
 * strip can scroll by exactly one copy and land where it
 * started — the loop point. Card bodies and quick links are
 * hidden; only covers show.
 *
 * Layout: the text and the strip both sit 72px in from the
 * side edges, clear of the rounded corners and title overlays
 * unfurlers draw, with a wide gutter between them. The text
 * block is centered vertically. Only the strip runs off the
 * top and bottom, since it scrolls.
 *
 * Runs inside the page (page.evaluate), so it must stay
 * self-contained. Returns the strip's geometry in CSS px.
 * ───────────────────────────────────────────────────────── */

export async function restagePlayground({ copies, cards }) {
  const css = `
    nextjs-portal { display: none !important; }
    html, body { overflow: hidden !important; }
    .og-hidden { visibility: hidden !important; }
    .og-gone { display: none !important; }
    .og-brand {
      position: fixed; left: 72px; top: 190px; z-index: 5;
      display: flex; align-items: center; gap: 9px;
      font-size: 20px; line-height: 1;
    }
    .og-brand svg { width: 20px; height: 20px; }
    .og-brand .og-name { font-weight: 600; color: var(--foreground); }
    .og-brand .og-by { color: var(--muted-foreground); }
    .og-title {
      position: fixed !important; left: 70px; top: 222px; z-index: 5;
      margin: 0 !important; font-size: 76px !important;
      line-height: 1.1 !important; letter-spacing: -0.01em;
    }
    .og-lede {
      position: fixed !important; left: 72px; top: 330px; z-index: 5;
      width: 360px; margin: 0 !important;
      font-size: 25px !important; line-height: 1.36 !important;
    }
    .og-grid {
      position: fixed !important; left: 500px; top: 0; z-index: 1;
      width: 628px; grid-template-columns: 304px 304px !important;
      gap: 20px !important;
    }
    .og-grid .notion-collection-card { border-radius: 16px; }
    .og-grid .notion-collection-card-cover { border-radius: 16px; }
    .og-grid .notion-collection-card-body,
    .og-grid .group > .absolute.z-\\[2\\] { display: none !important; }
    .og-grid [data-cover-cell] { content-visibility: visible !important; }
  `
  const style = document.createElement('style')
  style.textContent = css
  document.head.append(style)

  const main = document.querySelector('main')
  const sidebar = main.parentElement.firstElementChild
  const title = main.querySelector('h1')
  const lede = title.nextElementSibling
  const grid = lede.nextElementSibling

  const brand = document.createElement('div')
  brand.className = 'og-brand'
  brand.innerHTML = `${sidebar.querySelector('svg.playground-sidebar-lab').outerHTML}<span class="og-name">Playground</span><span class="og-by">by wustep</span>`
  document.body.append(brand)

  sidebar.classList.add('og-hidden')
  main.querySelector('header').classList.add('og-hidden')
  title.classList.add('og-title')
  lede.classList.add('og-lede')
  grid.classList.add('og-grid')

  // The strip shows only `cards`, in that order. CSS `order` places the
  // copies after the originals, and data-og-index is each card's place in
  // the strip, which poseStrip goes by.
  const byTitle = new Map(
    [...grid.children].map((card) => [
      card.querySelector('h3')?.textContent,
      card
    ])
  )
  const originals = cards.map((cardTitle) => {
    const card = byTitle.get(cardTitle)
    if (!card) throw new Error(`No playground card titled "${cardTitle}"`)
    return card
  })
  for (const card of grid.children) {
    if (!originals.includes(card)) card.classList.add('og-gone')
  }
  // Some covers lay themselves out for their width (a ResizeObserver and a
  // React render: the MIDI keyboard, the Things shelf). Let them catch up
  // with the strip's narrower columns before copying, or the copies keep
  // the page's layout while the originals change.
  let settled = ''
  while (settled !== grid.innerHTML) {
    settled = grid.innerHTML
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  for (let copy = 0; copy < copies; copy++) {
    for (const [index, original] of originals.entries()) {
      const card = copy ? original.cloneNode(true) : original
      const place = copy * originals.length + index
      card.style.order = String(place)
      card.dataset.ogIndex = String(place)
      if (copy) grid.append(card)
    }
  }

  // The page flags off-screen covers paused (CoverCell) and, on touch,
  // spotlights the one nearest the middle (useSpotlightCover). The capture
  // decides both itself, so strip the page's flags whenever it sets them.
  for (const cell of grid.querySelectorAll('[data-cover-cell]')) {
    delete cell.dataset.animationsPaused
    delete cell.dataset.coverAwake
  }
  new MutationObserver((records) => {
    for (const { target, attributeName } of records) {
      if (
        attributeName === 'data-animations-paused' ||
        !('ogAwake' in target.dataset)
      ) {
        target.removeAttribute(attributeName)
      }
    }
  }).observe(grid, {
    subtree: true,
    attributeFilter: ['data-animations-paused', 'data-cover-awake']
  })

  for (const img of document.images) img.loading = 'eager'

  const first = originals[0].getBoundingClientRect()
  const pitch = originals[2].getBoundingClientRect().top - first.top
  return {
    count: originals.length,
    titles: cards,
    gridTop: grid.getBoundingClientRect().top,
    coverHeight: first.height,
    pitch,
    period: Math.ceil(originals.length / 2) * pitch
  }
}

/**
 * Per-frame scene update: slide the strip and wake the given cards (by
 * index into the strip) — the same data-cover-awake flag the page sets on
 * touch screens.
 */
export function poseStrip({ translateY, awake }) {
  const grid = document.querySelector('.og-grid')
  grid.style.transform = `translateY(${translateY}px)`
  for (const card of grid.querySelectorAll('[data-og-index]')) {
    const index = Number(card.dataset.ogIndex)
    const cell = card.querySelector('[data-cover-cell]')
    if (!cell) continue
    // ogAwake marks the flags the capture set, so the observer above lets
    // them stand.
    if (awake.includes(index)) {
      cell.dataset.ogAwake = ''
      cell.dataset.coverAwake = ''
    } else if ('ogAwake' in cell.dataset) {
      delete cell.dataset.ogAwake
      delete cell.dataset.coverAwake
    }
  }
}
