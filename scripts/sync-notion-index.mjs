import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { transpileConfig } from 'next/dist/build/next-config-ts/transpile-config.js'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const scriptPath = path.join(rootDir, 'notion-index.config.ts')
const scriptModule = await transpileConfig({
  nextConfigPath: scriptPath,
  configFileName: path.basename(scriptPath),
  cwd: rootDir
})

await scriptModule.default()
