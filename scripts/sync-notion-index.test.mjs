import { execFileSync } from 'node:child_process'
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, it } from 'vitest'

it('runs the TypeScript index entry point and its extensionless imports', () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const fixture = mkdtempSync(path.join(root, '.sync-index-test-'))

  try {
    mkdirSync(path.join(fixture, 'scripts'))
    mkdirSync(path.join(fixture, 'lib'))
    copyFileSync(
      path.join(root, 'scripts', 'sync-notion-index.mjs'),
      path.join(fixture, 'scripts', 'sync-notion-index.mjs')
    )
    writeFileSync(
      path.join(fixture, 'lib', 'value.ts'),
      'export const value: number = 42\n'
    )
    writeFileSync(
      path.join(fixture, 'notion-index.config.ts'),
      `import { writeFile } from 'node:fs/promises'
import { value } from './lib/value'
export default async function sync(): Promise<void> {
  await writeFile('result.json', JSON.stringify({ value }))
}
`
    )

    execFileSync(process.execPath, ['scripts/sync-notion-index.mjs'], {
      cwd: fixture,
      timeout: 30_000
    })
    expect(JSON.parse(readFileSync(path.join(fixture, 'result.json'), 'utf8')))
      .toEqual({ value: 42 })
  } finally {
    rmSync(fixture, { recursive: true, force: true })
  }
})
