import { readFileSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const read = (file: string) =>
  readFileSync(path.join(process.cwd(), file), 'utf8')
const readJson = <T>(file: string) => JSON.parse(read(file)) as T

// pnpm is pinned in three places (see docs/development.md). pnpm 10 switches
// itself to `packageManager` anyway, so a stale pin elsewhere only misleads.
describe('pnpm version pins', () => {
  it('match across package.json, mise.toml and vercel.json', () => {
    const { packageManager } = readJson<{ packageManager: string }>(
      'package.json'
    )
    const { installCommand } = readJson<{ installCommand: string }>(
      'vercel.json'
    )
    const version = packageManager.replace(/^pnpm@/, '')

    expect(read('mise.toml').match(/^pnpm = "(.+)"$/m)?.[1]).toBe(version)
    expect(installCommand.match(/pnpm@(\S+)/)?.[1]).toBe(version)
  })
})
