'use client'

import * as React from 'react'

import { Illustration } from './lenses/illustrations'
import styles from './LensesIllustrationLabCover.module.css'

const SWATCHES = ['#B43A2E', '#243449', '#204A40', '#A75B22', '#8F3E62']
/** The preview card's resting background — the green swatch. */
const CARD_BASE_COLOR = '#204A40'
const CARD_BASE_INDEX = SWATCHES.indexOf(CARD_BASE_COLOR)
const MATRIX_CELLS = 18
/** Time between matrix presses (ms). Exceeds the 600ms press animation so
 *  only one cell is ever lit at a time. */
const PRESS_INTERVAL = 700
/** Time between color picks (ms) — each pick recolors the preview card. */
const COLOR_INTERVAL = 3000

export function LensesIllustrationLabCover() {
  const coverRef = React.useRef<HTMLDivElement>(null)
  const matrixRef = React.useRef<HTMLDivElement>(null)
  const swatchesRef = React.useRef<HTMLDivElement>(null)
  const previewRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const matrix = matrixRef.current
    const cover = coverRef.current
    const swatchesEl = swatchesRef.current
    const preview = previewRef.current
    const pressing = styles.pressing
    const swatchActive = styles.swatchActive
    const swatchPressing = styles.swatchPressing
    if (
      !matrix ||
      !cover ||
      !swatchesEl ||
      !preview ||
      !pressing ||
      !swatchActive ||
      !swatchPressing
    ) {
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    // Animate on the same hover surface as the rest of the cover — the
    // playground card wrapper (`.group`), falling back to the cover root.
    const hoverTarget = cover.closest('.group') ?? cover

    let matrixTimer: ReturnType<typeof setInterval> | undefined
    let colorTimer: ReturnType<typeof setInterval> | undefined
    let lastIndex = -1
    // Seed with the base color so the first pick is never green (no-op).
    let lastSwatch = CARD_BASE_INDEX

    const cells = () => Array.from(matrix.children) as HTMLElement[]
    const swatches = () => Array.from(swatchesEl.children) as HTMLElement[]

    /** Pick a random index in [0, length) that isn't `last`. */
    const pickIndex = (length: number, last: number) => {
      let index = Math.floor(Math.random() * length)
      while (length > 1 && index === last) {
        index = Math.floor(Math.random() * length)
      }
      return index
    }

    const pressRandom = () => {
      const list = cells()
      if (list.length === 0) return
      lastIndex = pickIndex(list.length, lastIndex)
      const cell = list[lastIndex]!
      for (const c of list) c.classList.remove(pressing)
      // Force reflow so the animation restarts even on a recently-used cell.
      void cell.offsetWidth
      cell.classList.add(pressing)
    }

    const pickColor = () => {
      const list = swatches()
      if (list.length === 0) return
      lastSwatch = pickIndex(list.length, lastSwatch)
      const swatch = list[lastSwatch]!
      for (const s of list) {
        s.classList.remove(swatchActive)
        s.classList.remove(swatchPressing)
      }
      // Force reflow so the press animation restarts on re-selection.
      void swatch.offsetWidth
      swatch.classList.add(swatchActive)
      swatch.classList.add(swatchPressing)
      // Recolor the preview card to the picked color.
      preview.style.backgroundColor = SWATCHES[lastSwatch]!
    }

    const start = () => {
      if (matrixTimer || reduceMotion.matches || !canHover.matches) return
      pressRandom()
      matrixTimer = setInterval(pressRandom, PRESS_INTERVAL)
      // The card starts green, so show green as the selected color. The
      // first recolor (to a different color) happens after one interval.
      swatches()[CARD_BASE_INDEX]?.classList.add(swatchActive)
      colorTimer = setInterval(pickColor, COLOR_INTERVAL)
    }

    const stop = () => {
      if (matrixTimer) {
        clearInterval(matrixTimer)
        matrixTimer = undefined
      }
      if (colorTimer) {
        clearInterval(colorTimer)
        colorTimer = undefined
      }
      lastIndex = -1
      lastSwatch = CARD_BASE_INDEX
      for (const c of cells()) c.classList.remove(pressing)
      for (const s of swatches()) {
        s.classList.remove(swatchActive)
        s.classList.remove(swatchPressing)
      }
      // Reset the card to its resting green.
      preview.style.backgroundColor = ''
    }

    hoverTarget.addEventListener('pointerenter', start)
    hoverTarget.addEventListener('pointerleave', stop)

    return () => {
      hoverTarget.removeEventListener('pointerenter', start)
      hoverTarget.removeEventListener('pointerleave', stop)
      stop()
    }
  }, [])

  return (
    <div className={styles.cover} ref={coverRef}>
      <div className={styles.gridGlow} aria-hidden />
      <div className={styles.workbench}>
        <div className={styles.previewCard} ref={previewRef}>
          <span className={styles.illustration} aria-hidden>
            <Illustration
              id='expertise'
              fg='#F5EFE0'
              bg='#204A40'
              accent='#F2C77A'
            />
          </span>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span />
            <span />
            <span />
          </div>
          <div className={styles.swatches} ref={swatchesRef}>
            {SWATCHES.map((color) => (
              <span key={color} style={{ background: color }} />
            ))}
          </div>
          <div className={styles.matrix} ref={matrixRef}>
            {Array.from({ length: MATRIX_CELLS }, (_, index) => (
              <span key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
