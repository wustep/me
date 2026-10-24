/* ─────────────────────────────────────────────────────────
 * A virtual clock for every CSS animation and transition on the
 * page, injected into the page under capture. Real time keeps
 * running while a 2x screenshot is taken, so instead of letting
 * the document timeline advance, each step pauses every
 * animation and sets its currentTime by hand. Frames come out
 * identical on every run, however slow the screenshots are.
 *
 * An animation advances only while CSS says it's running
 * (animation-play-state), so the covers' paused-at-rest idiom
 * and their data-cover-awake wake rules behave as they do live.
 * Transitions always run. Everything starts from 0 the first
 * time the clock sees it.
 *
 * Given a `loop` (ms), every infinite animation is retimed to
 * fit a whole number of its cycles into it, so the page as a
 * whole repeats every `loop` however mismatched the covers'
 * own periods are. The rate depends only on an animation's
 * duration, so animations that share a period stay in step. A
 * `data-og-phase` (ms of loop time) on an ancestor starts that
 * subtree's loops that far in instead of at 0.
 * ───────────────────────────────────────────────────────── */

export function installClock({ loop } = {}) {
  const clips = new Map()
  let now = 0

  // Stays inside installClock: page.evaluate serializes this one function.
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const isRunning = (animation) => {
    if (!(animation instanceof CSSAnimation)) return true
    const { target, pseudoElement } = animation.effect ?? {}
    if (!target) return false
    const style = getComputedStyle(target, pseudoElement)
    const names = style.animationName.split(',').map((name) => name.trim())
    const states = style.animationPlayState.split(',').map((s) => s.trim())
    const index = names.indexOf(animation.animationName)
    if (index === -1) return false
    return states[index % states.length] === 'running'
  }

  // How fast a loop plays (1 = as written): the nearest whole number of
  // cycles per `loop`. Transitions and finite animations keep their pace.
  const rateOf = (animation) => {
    const { duration, iterations } = animation.effect?.getComputedTiming() ?? {}
    if (!loop || iterations !== Infinity || !(duration > 0)) return 1
    return (Math.max(1, Math.round(loop / duration)) * duration) / loop
  }

  // Where a loop starts, in loop time: the nearest data-og-phase above it.
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const phaseOf = (animation) => {
    const { effect } = animation
    if (effect?.getComputedTiming().iterations !== Infinity) return 0
    const owner = effect.target?.closest('[data-og-phase]')
    return Number(owner?.dataset.ogPhase ?? 0)
  }

  globalThis.__ogClock = {
    /** Advance to `time` (ms) and pin every animation there. */
    step(time) {
      const delta = time - now
      now = time
      for (const animation of document.getAnimations()) {
        let clip = clips.get(animation)
        if (!clip) {
          clip = { currentTime: phaseOf(animation) * rateOf(animation) }
          clips.set(animation, clip)
        } else if (isRunning(animation)) {
          clip.currentTime += delta * rateOf(animation)
        }
        animation.pause()
        animation.currentTime = clip.currentTime
      }
    }
  }
}
