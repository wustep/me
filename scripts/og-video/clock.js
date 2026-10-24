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
 * Transitions always run. Everything starts from 0 when the
 * clock is installed.
 * ───────────────────────────────────────────────────────── */

export function installClock() {
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

  globalThis.__ogClock = {
    /** Advance to `time` (ms) and pin every animation there. */
    step(time) {
      const delta = time - now
      now = time
      for (const animation of document.getAnimations()) {
        let clip = clips.get(animation)
        if (!clip) {
          clip = { currentTime: 0 }
          clips.set(animation, clip)
        } else if (isRunning(animation)) {
          clip.currentTime += delta
        }
        animation.pause()
        animation.currentTime = clip.currentTime
      }
    }
  }
}
