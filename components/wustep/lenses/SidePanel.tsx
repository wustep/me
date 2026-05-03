import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'

import { isDev } from '@/lib/config'

import { ignoreDesignPanelOutside, useDesignFlag } from './DesignPanel'
import { ChevronIcon, CloseIcon } from './icons'
import { Illustration } from './illustrations'
import styles from './LensesPage.module.css'
import { neighborInDirection } from './navigation'
import { LENS_BY_ID } from './registry'
import { type Lens } from './types'

/**
 * SidePanel — slide-in detail view for a single lens.
 *
 *   The panel cross-fades its body when the active lens changes (via
 *   bumping `bodyKey`) so navigating between related lenses feels like
 *   flipping pages within the same surface rather than re-opening.
 */
type SidePanelProps = {
  lens: Lens | null
  onClose: () => void
  onOpenLens: (id: string) => void
}

export function SidePanel({ lens, onClose, onOpenLens }: SidePanelProps) {
  const open = !!lens
  const [shown, setShown] = React.useState<Lens | null>(lens)
  const [bodyKey, setBodyKey] = React.useState(0)
  const closeBtnRef = React.useRef<HTMLButtonElement>(null)
  /* Body density mode comes from the dev DesignPanel. In production
     this hook always returns 'full' (the schema default), which
     renders the full essay — identical to the prior behavior. */
  const bodyDensity = useDesignFlag<string>('bodyDensity', 'full')

  React.useEffect(() => {
    if (lens) {
      setShown(lens)
      setBodyKey((k) => k + 1)
    }
  }, [lens])

  /* Expose "side panel is open" as a global data attribute so the dev
     DesignPanel can dodge to a non-overlapping spot. We don't read
     this from React — DesignPanel is dev-only and uses a CSS-only
     selector against this attribute. No-op cost in prod. */
  React.useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (open) {
      root.setAttribute('data-lenses-side-open', 'true')
      return () => {
        root.removeAttribute('data-lenses-side-open')
      }
    }
    return undefined
  }, [open])

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose()
      }}
      /* In dev, run non-modally so the floating DesignPanel keeps
         receiving pointer events. Radix's modal mode wraps the body
         with `react-remove-scroll`, which suppresses interactions on
         everything outside the dialog content tree — including the
         DesignPanel's sliders/selects, even though `z-index: 9999`
         puts it visually on top. Non-modal still keeps ESC; only the
         focus trap, pointer-events lock, and the auto-rendered
         overlay are dropped (we re-render the overlay manually below
         so the dimming/blur treatment still shows). Production stays
         modal. */
      modal={!isDev}
    >
      <DialogPrimitive.Portal>
        {/* Radix only renders <Overlay> in modal mode. In dev (non-
            modal) we paint our own div with identical classes so the
            backdrop blur/dim doesn't disappear. We keep default
            pointer-events so the overlay still blocks card hover/
            click underneath (the lens panel should "pause" the
            canvas, same as production). The DesignPanel sits at a
            higher z-index (9999 > 60), so it stays interactive
            because the browser hit-tests top-down. Clicking the
            overlay itself dismisses, mirroring Radix's modal-mode
            behavior. */}
        {isDev ? (
          open ? (
            <div
              className={styles.panelOverlay}
              data-state='open'
              aria-hidden='true'
              onClick={onClose}
            />
          ) : null
        ) : (
          <DialogPrimitive.Overlay className={styles.panelOverlay} />
        )}
        <DialogPrimitive.Content
          className={styles.panel}
          style={
            shown
              ? ({
                  ['--panel-bg' as string]: shown.bg,
                  ['--panel-fg' as string]: shown.fg,
                  ['--panel-accent' as string]: shown.accent ?? shown.fg
                } as React.CSSProperties)
              : undefined
          }
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => {
            // Radix's default is to focus the first focusable element,
            // which is now the prev/next chevron. That makes the panel
            // open with a focus ring on a navigation button — too loud.
            // Send focus to the Close button instead (still keyboard
            // accessible, but visually unobtrusive next to the X glyph).
            event.preventDefault()
            closeBtnRef.current?.focus({ preventScroll: true })
          }}
          /* The dev DesignPanel sits at z-index 9999, visually above
             this dialog, but Radix treats a click anywhere outside
             `Content` as an "outside" interaction and closes the
             dialog. Tell Radix to ignore design-panel clicks so the
             two surfaces compose. No-op in prod (panel isn't mounted). */
          onPointerDownOutside={ignoreDesignPanelOutside}
          onInteractOutside={ignoreDesignPanelOutside}
        >
          {shown && (
            <>
              <div className={styles.panelHero}>
                <span className={styles.panelArt} aria-hidden='true'>
                  <Illustration
                    id={shown.illustration}
                    fg={shown.fg}
                    bg={shown.bg}
                    accent={shown.accent ?? shown.fg}
                  />
                </span>
                <div className={styles.panelHeroText}>
                  <span className={styles.panelEyebrow}>{shown.category}</span>
                  <DialogPrimitive.Title className={styles.panelTitle}>
                    {shown.title}
                  </DialogPrimitive.Title>
                  <p className={styles.panelTagline}>{shown.tagline}</p>
                </div>
                <div className={styles.panelControls}>
                  <button
                    type='button'
                    className={styles.panelNavBtn}
                    aria-label='Previous lens'
                    onClick={(event) => {
                      const prev = neighborInDirection(shown.id, 'left')
                      if (prev) {
                        // Drop focus from the chevron after a mouse
                        // click so the new panel doesn't open with a
                        // ring stuck on a navigation control.
                        event.currentTarget.blur()
                        onOpenLens(prev)
                      }
                    }}
                  >
                    <ChevronIcon direction='left' />
                  </button>
                  <button
                    type='button'
                    className={styles.panelNavBtn}
                    aria-label='Next lens'
                    onClick={(event) => {
                      const next = neighborInDirection(shown.id, 'right')
                      if (next) {
                        event.currentTarget.blur()
                        onOpenLens(next)
                      }
                    }}
                  >
                    <ChevronIcon direction='right' />
                  </button>
                  <DialogPrimitive.Close
                    ref={closeBtnRef}
                    className={styles.panelClose}
                    aria-label='Close panel'
                  >
                    <CloseIcon />
                  </DialogPrimitive.Close>
                </div>
              </div>
              <div key={bodyKey} className={styles.panelBody}>
                {bodyDensity === 'tagline' ? (
                  <p>
                    <em>{shown.tagline}</em>
                  </p>
                ) : bodyDensity === 'tldr' ? (
                  // First paragraph only — find the first <p> in the
                  // freeform body. We don't try to parse arbitrary JSX,
                  // so we cheat: render the body and clamp via CSS.
                  // In practice every lens body is `<><p>…</p>…</>`.
                  <div className={styles.panelBodyTldr}>{shown.body}</div>
                ) : (
                  shown.body
                )}
                {shown.related && shown.related.length > 0 && (
                  <div className={styles.relatedBlock}>
                    <span className={styles.relatedLabel}>Related lenses</span>
                    <div className={styles.relatedChips}>
                      {shown.related.map((id) => {
                        const r = LENS_BY_ID[id]
                        if (!r) return null
                        return (
                          <button
                            key={id}
                            type='button'
                            className={styles.relatedChip}
                            onClick={() => onOpenLens(id)}
                            style={
                              {
                                ['--chip-bg' as string]: r.bg,
                                ['--chip-fg' as string]: r.fg
                              } as React.CSSProperties
                            }
                          >
                            <span
                              className={styles.relatedChipSwatch}
                              aria-hidden='true'
                            />
                            {r.title}
                            <span
                              className={styles.relatedChipArrow}
                              aria-hidden='true'
                            >
                              →
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
