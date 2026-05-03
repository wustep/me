import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'

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

  React.useEffect(() => {
    if (lens) {
      setShown(lens)
      setBodyKey((k) => k + 1)
    }
  }, [lens])

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose()
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.panelOverlay} />
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
                    onClick={() => {
                      const prev = neighborInDirection(shown.id, 'left')
                      if (prev) onOpenLens(prev)
                    }}
                  >
                    <ChevronIcon direction='left' />
                  </button>
                  <button
                    type='button'
                    className={styles.panelNavBtn}
                    aria-label='Next lens'
                    onClick={() => {
                      const next = neighborInDirection(shown.id, 'right')
                      if (next) onOpenLens(next)
                    }}
                  >
                    <ChevronIcon direction='right' />
                  </button>
                  <DialogPrimitive.Close
                    className={styles.panelClose}
                    aria-label='Close panel'
                  >
                    <CloseIcon />
                  </DialogPrimitive.Close>
                </div>
              </div>
              <div key={bodyKey} className={styles.panelBody}>
                {shown.body}
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
