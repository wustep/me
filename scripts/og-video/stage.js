/* ─────────────────────────────────────────────────────────
 * Restages the live /playground page as a 1200×630 share
 * card, in the browser, from the page's own elements: the
 * sidebar's flask mark, the page's h1 and lede on the left,
 * and the real cover grid (CSS modules, inline keyframes and
 * all) as a two-column strip on the right, laid out like the
 * still card in public/og/playground.png.
 *
 * The grid's cards are cloned twice below the originals so
 * the strip can scroll by exactly one copy and land where it
 * started — the loop point. Card bodies and quick links are
 * hidden; only covers show.
 *
 * Runs inside the page (page.evaluate), so it must stay
 * self-contained. Returns the strip's geometry in CSS px.
 * ───────────────────────────────────────────────────────── */

export function restagePlayground({ copies }) {
  const css = `
    nextjs-portal { display: none !important; }
    html, body { overflow: hidden !important; }
    .og-hidden { visibility: hidden !important; }
    .og-brand {
      position: fixed; left: 80px; top: 176px; z-index: 5;
      display: flex; align-items: center; gap: 10px;
      font-size: 22px; line-height: 1;
    }
    .og-brand svg { width: 22px; height: 22px; }
    .og-brand .og-name { font-weight: 600; color: var(--foreground); }
    .og-brand .og-by { color: var(--muted-foreground); }
    .og-title {
      position: fixed !important; left: 78px; top: 214px; z-index: 5;
      margin: 0 !important; font-size: 84px !important;
      line-height: 1.1 !important; letter-spacing: -0.01em;
    }
    .og-lede {
      position: fixed !important; left: 80px; top: 336px; z-index: 5;
      width: 400px; margin: 0 !important;
      font-size: 28px !important; line-height: 1.36 !important;
    }
    .og-grid {
      position: fixed !important; left: 532px; top: 0; z-index: 1;
      width: 678px; grid-template-columns: 330px 330px !important;
      gap: 18px !important;
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

  const originals = [...grid.children]
  for (let copy = 1; copy < copies; copy++) {
    for (const card of originals) grid.append(card.cloneNode(true))
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
    titles: originals.map((card) => card.querySelector('h3')?.textContent),
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
  for (const [index, card] of [...grid.children].entries()) {
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
