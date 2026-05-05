'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import BodyClassName from 'react-body-classname'

import { LabsButton } from '@/components/wustep/LabsButton'
import { ThemeToggle } from '@/components/wustep/ThemeToggle'
import { isDev } from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion'

import { Canvas } from './Canvas'
import { CenterDialog } from './CenterDialog'
import { DesignPanel } from './DesignPanel'
import styles from './LensesPage.module.css'
import { keyToDirection, neighborInDirection } from './navigation'
import { LENS_BY_ID } from './registry'
import { SidePanel } from './SidePanel'
import { type LensesPageProps, STAGE, type Stage, TIMING } from './types'

/**
 * Build the next URL search string given the current path's params plus
 * an override patch. Empty values strip the key entirely. We mutate the
 * URL via `history.replaceState` rather than `router.replace` so we
 * don't trigger a Next re-render (state already reflects the change).
 */
function syncUrl(
  pathname: string,
  current: URLSearchParams,
  patch: Record<string, string | null>
) {
  const next = new URLSearchParams(current)
  for (const [k, v] of Object.entries(patch)) {
    if (v == null || v === '') next.delete(k)
    else next.set(k, v)
  }
  const qs = next.toString()
  const url = qs ? `${pathname}?${qs}` : pathname
  if (url === window.location.pathname + window.location.search) return
  window.history.replaceState(null, '', url)
}

/**
 * LensesPage — top-level Lenses experience.
 *
 *   The page drives a single `stage` integer that fans out to children:
 *     stage 0 → mounted but everything hidden (SSR-safe initial state)
 *     stage 1 → canvas faded in
 *     stage 2 → center "Lenses" card scaled into place
 *     stage 3 → surrounding cards staggering in
 *
 *   Reduced motion? We snap straight to the final stage on mount so
 *   nothing animates — but the visual end-state is identical.
 *
 *   When `embedded` is true, the page renders only the canvas + portaled
 *   panels and skips its own header / theme toggle / body classes. Use
 *   this when mounting `<LensesPage embedded />` inside another chrome
 *   (e.g. `PlaygroundLayout`). `previewOverride` is a lab-only embedding
 *   path: it opens one lens inside the frame and swaps that panel's art.
 */
export function LensesPage({
  embedded = false,
  previewOverride
}: LensesPageProps = {}) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const previewLensId = previewOverride?.lensId
  const [hasMounted, setHasMounted] = React.useState(false)
  const [stage, setStage] = React.useState<Stage>(() =>
    previewLensId ? STAGE.cards : STAGE.hidden
  )
  const prefersReducedMotion = usePrefersReducedMotion()
  const [previewContainer, setPreviewContainer] =
    React.useState<HTMLDivElement | null>(null)

  const router = useRouter()
  const [hydratedFromUrl, setHydratedFromUrl] = React.useState(false)

  const [openLensId, setOpenLensId] = React.useState<string | null>(
    previewLensId ?? null
  )
  const [centerOpen, setCenterOpen] = React.useState(false)

  /* Keyboard cursor across the canvas. The cursor is the lens that
     currently shows the "selected" treatment when no panel is open —
     a way to steer with arrow keys without committing to opening a
     panel. Pressing Enter promotes the cursor to an open panel.

     When a panel is open, the cursor is conceptually pinned to
     `openLensId` (the open lens is what's "selected"). Rather than
     try to keep two state slots aligned, we derive the canvas
     selection from `openLensId ?? cursorLensId` at render time. */
  const [cursorLensId, setCursorLensId] = React.useState<string | null>(
    previewLensId ?? null
  )

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  /* Hydrate panel + dialog state from the URL once the router is ready.
     `router.isReady` flips to true on the client after Next has parsed
     `query`. Reading on first render in SSR would yield empty values
     and overwrite a real `?lens=…` after hydration, hence this guard.
     We only seed once — the user takes over from there. */
  React.useEffect(() => {
    if (previewLensId) return
    if (!router.isReady || hydratedFromUrl) return
    const lensRaw =
      typeof router.query.lens === 'string' ? router.query.lens : null
    const indexRaw =
      typeof router.query.index === 'string' ? router.query.index : null
    if (lensRaw && LENS_BY_ID[lensRaw]) {
      setOpenLensId(lensRaw)
      setCursorLensId(lensRaw)
    }
    if (indexRaw === 'open') setCenterOpen(true)
    setHydratedFromUrl(true)
  }, [
    router.isReady,
    router.query.lens,
    router.query.index,
    hydratedFromUrl,
    previewLensId
  ])

  /* Push state -> URL whenever the user opens / closes / swaps a panel
     or the index dialog. We use `history.replaceState` rather than
     `router.replace` so we don't re-render the page tree (state already
     reflects the change) and we don't re-trigger the entrance
     animation. We never touch `pathname`, so this is safe for both
     standalone (/lenses) and embedded (/playground/lenses) mounts. */
  React.useEffect(() => {
    if (previewLensId) return
    if (!hydratedFromUrl) return
    const current = new URLSearchParams(window.location.search)
    syncUrl(window.location.pathname, current, {
      lens: openLensId,
      index: centerOpen ? 'open' : null
    })
  }, [hydratedFromUrl, openLensId, centerOpen, previewLensId])

  /* Drive the entrance storyboard. Snap to final stage instantly when
     the user prefers reduced motion.
     `entranceTick` is bumped by the dev DesignPanel ("Replay" action)
     to re-run the entrance from stage 0 — handy when tweaking timing.

     Repeat-visit skip: once a user has seen the entrance during this
     browser session, subsequent navigations to the page snap straight
     to the final stage. The flag lives in sessionStorage so it resets
     on a new tab/window but persists across in-session navigation.
     The dev panel's "Replay" path bypasses the flag (entranceTick > 0)
     so designers can re-run the storyboard at will. */
  const [entranceTick, setEntranceTick] = React.useState(0)

  React.useEffect(() => {
    if (!hasMounted) return
    if (previewLensId) {
      setStage(STAGE.cards)
      return
    }

    const SESSION_KEY = 'lenses:entrance-played'
    const replayRequested = entranceTick > 0
    let alreadyPlayed = false
    try {
      alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      /* Private mode or storage disabled — fall through to the
         normal entrance. Not worth blocking on. */
    }

    if (prefersReducedMotion || (alreadyPlayed && !replayRequested)) {
      setStage(STAGE.cards)
      return
    }

    setStage(STAGE.hidden)
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setStage(STAGE.canvas), TIMING.canvasIn),
      setTimeout(() => setStage(STAGE.center), TIMING.centerIn),
      setTimeout(() => {
        setStage(STAGE.cards)
        try {
          sessionStorage.setItem(SESSION_KEY, '1')
        } catch {}
      }, TIMING.cardsInBase)
    ]
    return () => {
      for (const t of timers) clearTimeout(t)
    }
  }, [hasMounted, prefersReducedMotion, entranceTick, previewLensId])

  React.useEffect(() => {
    if (!previewLensId) return
    setStage(STAGE.cards)
    setOpenLensId(previewLensId)
    setCursorLensId(previewLensId)
    setCenterOpen(false)
  }, [previewLensId])

  /* Listen for the dev panel's replay event. Only relevant in dev,
     and the listener is cheap when no event is dispatched. */
  React.useEffect(() => {
    if (!isDev || previewLensId) return
    const onReplay = () => setEntranceTick((t) => t + 1)
    window.addEventListener('lenses:replay-entrance', onReplay)
    return () => window.removeEventListener('lenses:replay-entrance', onReplay)
  }, [previewLensId])

  /* Cursor parallax — sets `--mx` / `--my` on the document root
     so the .cards CSS rule (gated by data-design-parallax) can
     translate the deck. Throttled with rAF, cheap, and only
     active when the design panel turns parallax on. */
  React.useEffect(() => {
    if (!isDev || previewLensId) return
    let raf = 0
    let pendingX = 0
    let pendingY = 0
    const tick = () => {
      raf = 0
      document.documentElement.style.setProperty('--mx', String(pendingX))
      document.documentElement.style.setProperty('--my', String(pendingY))
    }
    const onMove = (e: MouseEvent) => {
      pendingX = (e.clientX / window.innerWidth - 0.5) * -2
      pendingY = (e.clientY / window.innerHeight - 0.5) * -2
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [previewLensId])

  const openLens = React.useCallback((id: string) => {
    setCenterOpen(false)
    setOpenLensId(id)
    setCursorLensId(id)
  }, [])

  const closeLens = React.useCallback(() => {
    /* Park the cursor on the lens that was open so the next arrow
       press picks up where the user left off, instead of resetting
       to "no cursor" and re-seeding from the canvas center. */
    setOpenLensId((prev) => {
      if (prev) setCursorLensId(prev)
      return null
    })
  }, [])

  /* Single keyboard handler for the whole Lenses experience. Three
     distinct modes, in priority order:

       1. Center dialog open → ignore arrows entirely; the dialog has
          its own focus + scroll behavior.
       2. Side panel open → arrows swap the open lens to its
          spatial / reading-order neighbor.
       3. Otherwise → arrows move the canvas cursor (selection
          treatment without opening the panel). Enter / Space on
          the cursor lens opens its panel. If a card button currently
          has DOM focus, we move focus along with the cursor so the
          two stay aligned for screen reader / keyboard users.

     We always skip arrows when the user is typing somewhere
     (input, textarea, contentEditable). */
  React.useEffect(() => {
    if (centerOpen || previewLensId) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) {
        return
      }
      // Don't steal modifiers; let browser keybindings work.
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const dir = keyToDirection(event.key)

      if (openLensId) {
        if (!dir) return
        const next = neighborInDirection(openLensId, dir)
        if (!next) return
        event.preventDefault()
        setOpenLensId(next)
        setCursorLensId(next)
        return
      }

      if (dir) {
        const next = neighborInDirection(cursorLensId, dir)
        if (!next) return
        event.preventDefault()
        setCursorLensId(next)

        /* If a card button currently has focus, follow the cursor
           with focus too — otherwise leave focus where it was, so
           we don't yank focus into the canvas just because the user
           moved their mouse off-page and tapped an arrow. */
        const active = document.activeElement as HTMLElement | null
        if (active && active.dataset && active.dataset.lensId) {
          const nextEl = document.querySelector<HTMLElement>(
            `[data-lens-id="${next}"]`
          )
          nextEl?.focus()
        }
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        /* Buttons handle their own Enter/Space when focused, so we
           only act when focus is *not* on a card button. */
        const active = document.activeElement as HTMLElement | null
        if (active && active.dataset && active.dataset.lensId) return
        if (!cursorLensId) return
        event.preventDefault()
        openLens(cursorLensId)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [centerOpen, openLensId, cursorLensId, openLens, previewLensId])

  const activeLens = previewLensId
    ? (LENS_BY_ID[previewLensId] ?? null)
    : openLensId
      ? (LENS_BY_ID[openLensId] ?? null)
      : null

  /* Selection treatment on the canvas reflects the open panel when
     one is open, otherwise the keyboard cursor. */
  const selectedLensId = previewLensId ?? openLensId ?? cursorLensId

  const frameClass = embedded
    ? `${styles.frame} ${styles.frameEmbedded}`
    : styles.frame

  return (
    <>
      {/* Standalone mode owns the body class (notion + dark mode). When
          embedded, the host layout (e.g. PlaygroundLayout) sets these. */}
      {!embedded && (
        <BodyClassName className={isDarkMode ? 'notion dark-mode' : 'notion'} />
      )}

      <div
        ref={previewOverride ? setPreviewContainer : undefined}
        className={frameClass}
      >
        {!embedded && (
          <header className={styles.header}>
            <div className={styles.headerInner}>
              <Link
                href='/'
                className={styles.homeBackButton}
                aria-label='Back to home'
              >
                <span className={styles.homeBackArrow} aria-hidden='true'>
                  ←
                </span>
              </Link>

              <div className={styles.headerRhs}>
                <LabsButton className={styles.headerButton} />
                <ThemeToggle
                  isDark={hasMounted ? isDarkMode : false}
                  onToggle={toggleDarkMode}
                  className={styles.headerButton}
                />
              </div>
            </div>
          </header>
        )}

        <Canvas
          stage={stage}
          prefersReducedMotion={prefersReducedMotion}
          activeLensId={selectedLensId}
          onOpenCenter={
            previewLensId ? () => undefined : () => setCenterOpen(true)
          }
          onOpenLens={previewOverride ? () => undefined : openLens}
        />
      </div>

      {previewOverride && !previewContainer ? null : (
        <SidePanel
          lens={activeLens}
          onClose={previewOverride ? () => undefined : closeLens}
          onOpenLens={previewOverride ? () => undefined : openLens}
          previewOverride={
            previewOverride && previewContainer
              ? {
                  container: previewContainer,
                  palette: previewOverride.palette,
                  renderIllustration: previewOverride.renderIllustration
                }
              : undefined
          }
        />
      )}

      {!previewOverride && (
        <CenterDialog
          open={centerOpen}
          onOpenChange={setCenterOpen}
          onOpenLens={openLens}
        />
      )}

      {/* Dev-only design panel. Tree-shakes out in production because
          the JSX is gated on a build-time `isDev` constant. */}
      {isDev && hasMounted && !previewOverride && <DesignPanel />}
    </>
  )
}
