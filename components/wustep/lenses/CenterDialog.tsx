import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'

import { CloseIcon } from './icons'
import { Illustration } from './illustrations'
import styles from './LensesPage.module.css'
import { LENSES } from './registry'

/**
 * CenterDialog — the central "Lenses" index.
 *
 *   Two jobs share one frame:
 *     • A short philosophy lede (the deck's premise)
 *     • A grid of every lens, immediately browsable.
 *
 *   The lede stays small on top so the index isn't gated behind 200
 *   words of prose — the most common goal here is "find a lens
 *   quickly," and the grid serves that without scrolling.
 */
type CenterDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenLens: (id: string) => void
}

export function CenterDialog({
  open,
  onOpenChange,
  onOpenLens
}: CenterDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.dialogOverlay} />
        <DialogPrimitive.Content
          className={styles.dialog}
          aria-describedby={undefined}
        >
          <header className={styles.dialogHeader}>
            <div className={styles.dialogHeaderText}>
              <span className={styles.dialogEyebrow}>
                The deck · {LENSES.length} lenses
              </span>
              <p className={styles.dialogIntro}>
                Every model of the world is partial. A lens names what it
                foregrounds — and quietly hides the rest.
              </p>
              <DialogPrimitive.Title className={styles.dialogTitle}>
                Hold many. Lightly.
              </DialogPrimitive.Title>
              <p className={styles.dialogLede}>
                Don't pick one. Look through three in a row, notice what each
                surfaces, then set them down. The world will keep being too
                big for any single frame.
              </p>
            </div>
            <DialogPrimitive.Close
              className={styles.dialogCloseBtn}
              aria-label='Close'
            >
              <CloseIcon />
            </DialogPrimitive.Close>
          </header>

          <ul className={styles.dialogList}>
            {LENSES.map((lens) => (
              <li key={lens.id} className={styles.dialogListItem}>
                <button
                  type='button'
                  className={styles.dialogJumpBtn}
                  onClick={() => onOpenLens(lens.id)}
                  style={
                    {
                      ['--jump-bg' as string]: lens.bg,
                      ['--jump-fg' as string]: lens.fg,
                      ['--jump-accent' as string]: lens.accent ?? lens.fg
                    } as React.CSSProperties
                  }
                >
                  <span className={styles.dialogJumpArt} aria-hidden='true'>
                    <Illustration
                      id={lens.illustration}
                      fg={lens.fg}
                      bg={lens.bg}
                      accent={lens.accent ?? lens.fg}
                    />
                  </span>
                  <span className={styles.dialogJumpText}>
                    <span className={styles.dialogJumpCategory}>
                      {lens.category}
                    </span>
                    <span className={styles.dialogJumpTitle}>
                      {lens.title}
                    </span>
                    <span className={styles.dialogJumpTagline}>
                      {lens.tagline}
                    </span>
                  </span>
                  <span className={styles.dialogJumpArrow} aria-hidden='true'>
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
