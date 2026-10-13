import lqipModern from 'lqip-modern'
import { expect, it } from 'vitest'

it('generates image placeholders with the patched Sharp dependency', async () => {
  const input = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="32"><rect width="48" height="32" fill="red"/></svg>'
  )

  for (const outputFormat of ['webp', 'jpg'] as const) {
    const result = await lqipModern(input, { outputFormat })

    expect(result.metadata.originalWidth).toBe(48)
    expect(result.metadata.originalHeight).toBe(32)
    expect(result.metadata.width).toBeLessThanOrEqual(16)
    expect(result.metadata.height).toBeLessThanOrEqual(16)
    expect(result.metadata.type).toBe(outputFormat)
    expect(result.content.byteLength).toBeGreaterThan(0)
  }
})
