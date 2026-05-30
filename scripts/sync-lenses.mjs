/**
 * sync-lenses.mjs — compile lenses.md → lenses.json
 *
 *   `lenses.md` is the human source of truth (see the comment at the
 *   top of that file for the format). This script parses it into the
 *   plain-data `lenses.json` that `registry.tsx` imports.
 *
 *   Zero dependencies on purpose — the format is intentionally simple
 *   (no nested YAML) so the parser stays tiny and obvious.
 *
 *   Run: pnpm lenses:sync   (or: node scripts/sync-lenses.mjs)
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const LENS_DIR = path.join(root, 'components/wustep/lenses')
const mdPath = path.join(LENS_DIR, 'lenses.md')
const jsonPath = path.join(LENS_DIR, 'lenses.json')

const REQUIRED = [
  'id',
  'category',
  'title',
  'tagline',
  'bg',
  'fg',
  'illustration',
  'body'
]

const raw = fs.readFileSync(mdPath, 'utf8')

// Each lens is a section opened by an H1. Everything before the first
// H1 (the doc-comment header) is dropped.
const sections = raw.split(/^# /m).slice(1)

const records = []
const errors = []

for (const section of sections) {
  const lines = section.split('\n')
  const title = lines[0].trim()

  // Skip blank lines between the H1 and the metadata block.
  let i = 1
  while (i < lines.length && lines[i].trim() === '') i++

  // Metadata runs until the first blank line.
  const meta = {}
  const readings = []
  for (; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === '') break
    const ci = line.indexOf(':')
    if (ci === -1) continue
    const key = line.slice(0, ci).trim()
    const value = line.slice(ci + 1).trim()
    if (key === 'reading') {
      const sep = value.lastIndexOf(' | ')
      if (sep === -1) {
        errors.push(
          `${title}: reading must be "Label | https://url" → "${value}"`
        )
        continue
      }
      readings.push({
        label: value.slice(0, sep).trim(),
        href: value.slice(sep + 3).trim()
      })
    } else {
      meta[key] = value
    }
  }

  const body = lines
    .slice(i + 1)
    .join('\n')
    .trim()

  // Assemble in a stable key order.
  const rec = {
    id: meta.id,
    category: meta.category,
    title,
    tagline: meta.tagline,
    bg: meta.bg,
    fg: meta.fg
  }
  if (meta.accent) rec.accent = meta.accent
  rec.illustration = meta.illustration
  if (meta.related) {
    rec.related = meta.related
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  if (readings.length) rec.readings = readings
  if (meta.quote) {
    rec.quote = { text: meta.quote }
    if (meta['quote-cite']) rec.quote.cite = meta['quote-cite']
  }
  rec.body = body

  for (const key of REQUIRED) {
    if (!rec[key]) errors.push(`${title || '(untitled)'}: missing "${key}"`)
  }
  records.push(rec)
}

// Duplicate-id guard.
const seen = new Set()
for (const r of records) {
  if (r.id && seen.has(r.id)) errors.push(`duplicate id "${r.id}"`)
  seen.add(r.id)
}

if (errors.length) {
  console.error(`lenses:sync failed with ${errors.length} error(s):`)
  for (const e of errors) console.error(`  • ${e}`)
  process.exit(1)
}

fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2) + '\n')
console.log(
  `Synced ${records.length} lenses → ${path.relative(root, jsonPath)}`
)
