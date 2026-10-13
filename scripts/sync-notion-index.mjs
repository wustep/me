import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { tsImport } from 'tsx/esm/api'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const scriptPath = path.join(rootDir, 'notion-index.config.ts')
const scriptModule = await tsImport(scriptPath, import.meta.url)

await scriptModule.default()
