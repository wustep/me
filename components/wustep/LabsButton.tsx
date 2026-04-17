import cs from 'classnames'
import Link from 'next/link'
import * as React from 'react'

import { LabFillIcon } from '@/components/icons/InlineIcons'

import styles from './LabsButton.module.css'

export type LabsButtonProps = {
  className?: string
  label?: string
}

/**
 * Shared "open playground" link with the LabFillIcon fill animation.
 * The liquid fill is driven by generic `a:hover .lab-fill-liquid` rules
 * in wustep.css, so it works wherever the component is placed.
 */
export function LabsButton({
  className,
  label = 'Open playground'
}: LabsButtonProps) {
  return (
    <Link
      href='/playground'
      className={cs(styles.labsButton, className)}
      data-lab-fill-trigger=''
      aria-label={label}
      title={label}
    >
      <LabFillIcon />
    </Link>
  )
}
