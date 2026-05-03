import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as React from 'react'

import { CloseIcon } from './icons'
import { Illustration } from './illustrations'
import styles from './LensesPage.module.css'
import { LENSES } from './registry'

/**
 * CenterDialog — the central "Lenses" index. Presents the philosophy
 * of using lenses + a jump list to every lens in the registry.
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
          <div className={styles.dialogInner}>
            <span className={styles.dialogEyebrow}>Index</span>
            <DialogPrimitive.Title className={styles.dialogTitle}>
              Lenses
            </DialogPrimitive.Title>
            <div className={styles.dialogIntro}>
              <p>
                A lens is a way of looking — a model the mind reaches for to
                make a complicated thing legible. Each one foregrounds something
                real, and each one quietly hides everything else.
              </p>
              <p>
                The mistake is to pick one and live inside it. Hold many,
                lightly. Look at the same situation through three different ones
                in a row and notice what each surfaces and what each occludes.
                The combined image is never finished — but it is more honest
                than any single frame can be.
              </p>
            </div>

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

            <DialogPrimitive.Close
              className={styles.dialogCloseBtn}
              aria-label='Close'
            >
              <CloseIcon />
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
