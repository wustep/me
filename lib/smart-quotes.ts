import {
  type Block,
  type Decoration,
  type ExtendedRecordMap
} from 'notion-types'
import { getBlockValue } from 'notion-utils'

/**
 * Typographic quotation marks for prose written in Notion.
 *
 * Posts mix both kinds: text typed on a Mac arrives curly, while text typed
 * in the browser or pasted in stays straight, sometimes within one sentence.
 * This sets every straight quote and apostrophe in prose as its curly form
 * when a page renders. The Notion source is left as written, and code is
 * never touched: straight quotes are syntax there.
 */

const OPEN_DOUBLE = '“'
const CLOSE_DOUBLE = '”'
const OPEN_SINGLE = '‘'
const APOSTROPHE = '’'

/** A quote opens after whitespace, an opening bracket, a dash or slash, or
 *  another opening quote. After anything else it closes. */
const OPENS_AFTER = /[\s([{<=/\-–—‘“]/
const WORD = /[\p{L}\p{N}]/u
const LETTER = /\p{L}/u
const DIGIT = /\d/
/** Elisions that start with an apostrophe, not an opening quote: decades
 *  ('90s) and dropped letters ('em, 'til, 'tis, 'twas, 'cause, rock 'n' roll). */
const ELISION = /^(?:\d\ds?|em|til|tis|twas|cause|n)(?![\p{L}\p{N}])/iu

/**
 * Curl the straight quotes in `chars` in place. `locked[i]` marks a character
 * that must stay as written (inline code); it still counts as context for its
 * neighbors. Every replacement is one character for one, so indexes hold.
 */
function curl(chars: string[], locked?: boolean[]): boolean {
  let changed = false
  let doubleOpen = false
  let singleOpen = false

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    if ((char !== '"' && char !== "'") || locked?.[i]) continue

    const prev = i > 0 ? chars[i - 1]! : ''
    const next = chars[i + 1] ?? ''
    const opens = prev === '' || OPENS_AFTER.test(prev)
    let curled: string | undefined

    if (char === '"') {
      if (opens) {
        curled = OPEN_DOUBLE
        doubleOpen = true
      } else if (DIGIT.test(prev) && !doubleOpen) {
        // An inch mark (6'2"), not the end of a quotation.
      } else {
        curled = CLOSE_DOUBLE
        doubleOpen = false
      }
    } else if (WORD.test(prev)) {
      if (DIGIT.test(prev) && !LETTER.test(next) && !singleOpen) {
        // A foot mark (6'2"), not the apostrophe in 1990's.
      } else {
        curled = APOSTROPHE
        if (!WORD.test(next)) singleOpen = false
      }
    } else if (opens) {
      if (ELISION.test(chars.slice(i + 1, i + 8).join(''))) {
        curled = APOSTROPHE
      } else {
        curled = OPEN_SINGLE
        singleOpen = true
      }
    } else {
      curled = APOSTROPHE
      singleOpen = false
    }

    if (curled) {
      chars[i] = curled
      changed = true
    }
  }

  return changed
}

/** Curl the straight quotes and apostrophes in a plain string. */
export function smartenQuotes(text: string): string {
  if (!text.includes('"') && !text.includes("'")) return text
  // Split by UTF-16 unit, not code point: replacements keep string indexes.
  const chars = text.split('')
  return curl(chars) ? chars.join('') : text
}

function isCode(decoration: Decoration): boolean {
  return !!decoration[1]?.some((format) => format[0] === 'c')
}

/**
 * Curl the quotes in a run of Notion rich text. Quotes are matched across
 * the whole run, so `"` + bold + `"` opens and closes correctly. Returns the
 * same array when there is nothing to change.
 */
export function smartenDecorations(decorations: Decoration[]): Decoration[] {
  if (!Array.isArray(decorations)) return decorations
  if (
    !decorations.some(
      (decoration) =>
        typeof decoration?.[0] === 'string' &&
        (decoration[0].includes('"') || decoration[0].includes("'"))
    )
  ) {
    return decorations
  }

  const chars: string[] = []
  const locked: boolean[] = []
  for (const decoration of decorations) {
    const text = typeof decoration?.[0] === 'string' ? decoration[0] : ''
    const code = isCode(decoration)
    for (const char of text.split('')) {
      chars.push(char)
      locked.push(code)
    }
  }

  if (!curl(chars, locked)) return decorations

  let offset = 0
  return decorations.map((decoration) => {
    const text = typeof decoration?.[0] === 'string' ? decoration[0] : ''
    const curled = chars.slice(offset, offset + text.length).join('')
    offset += text.length
    if (curled === text) return decoration
    return (
      decoration.length > 1 ? [curled, decoration[1]] : [curled]
    ) as Decoration
  })
}

/** Blocks whose text isn't the author's prose: code and equations are
 *  syntax, and a bookmark's title belongs to the page it links to. */
const VERBATIM_BLOCK_TYPES = new Set(['code', 'equation', 'bookmark'])

/** Rich-text properties that hold prose. Other properties (URLs, sources,
 *  languages, a database row's own fields) are left alone. */
const PROSE_PROPERTIES = ['title', 'caption']

function smartenBlock(block: Block): Block {
  if (!block.properties || VERBATIM_BLOCK_TYPES.has(block.type)) return block

  const properties = block.properties as Record<string, Decoration[]>
  // A simple table keeps each cell under its column's id.
  const keys =
    block.type === 'table_row' ? Object.keys(properties) : PROSE_PROPERTIES

  let next: Record<string, Decoration[]> | undefined
  for (const key of keys) {
    const value = properties[key]
    if (!value) continue
    const curled = smartenDecorations(value)
    if (curled !== value) {
      next ??= { ...properties }
      next[key] = curled
    }
  }

  return next ? ({ ...block, properties: next } as Block) : block
}

/**
 * A copy of `recordMap` with typographic quotes in its prose, for rendering.
 * Blocks without straight quotes are shared with the original, and the
 * original is returned as is when no block changes.
 *
 * Use it for display only: slugs, page URLs and feeds should keep reading
 * the record map as Notion returned it.
 */
export function smartenRecordMapQuotes(
  recordMap: ExtendedRecordMap
): ExtendedRecordMap {
  if (!recordMap?.block) return recordMap

  let blocks: ExtendedRecordMap['block'] | undefined
  for (const [id, box] of Object.entries(recordMap.block)) {
    const block = getBlockValue(box)
    if (!block) continue
    const curled = smartenBlock(block)
    if (curled === block) continue

    blocks ??= { ...recordMap.block }
    // Notion boxes a block as { role, value } or { role, value: { role, value } }.
    const inner = box.value as { value?: unknown }
    blocks[id] = (
      inner.value
        ? { ...box, value: { ...inner, value: curled } }
        : { ...box, value: curled }
    ) as ExtendedRecordMap['block'][string]
  }

  return blocks ? { ...recordMap, block: blocks } : recordMap
}
