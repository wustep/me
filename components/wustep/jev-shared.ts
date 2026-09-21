export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

export function softmax(values: number[], temperature = 0.42): number[] {
  const t = Math.max(0.12, temperature)
  let max = Number.NEGATIVE_INFINITY
  for (const value of values) {
    if (value > max) max = value
  }
  const exps = values.map((value) => Math.exp((value - max) / t))
  let sum = 0
  for (const exp of exps) sum += exp
  if (sum <= 0) return values.map(() => 1 / Math.max(1, values.length))
  return exps.map((exp) => exp / sum)
}

/** TypeSafe-style confidence: how concentrated the choice distribution is. */
export function choiceConfidence(probabilities: number[]): number {
  if (probabilities.length < 2) return 1
  const logN = Math.log(probabilities.length)
  let entropy = 0
  for (const p of probabilities) {
    if (p > 1e-12) entropy -= p * Math.log(p)
  }
  return clamp01(1 - entropy / logN)
}

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d_2b_79_f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4_294_967_296
  }
}

export function shuffleInPlace<T>(items: T[], rng: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const a = items[i]
    const b = items[j]
    if (a === undefined || b === undefined) continue
    items[i] = b
    items[j] = a
  }
  return items
}
