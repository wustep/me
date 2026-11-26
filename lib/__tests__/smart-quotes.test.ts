import { type Decoration, type ExtendedRecordMap } from 'notion-types'
import { describe, expect, it } from 'vitest'

import {
  smartenDecorations,
  smartenQuotes,
  smartenRecordMapQuotes
} from '../smart-quotes'

const box = (value: Record<string, unknown>) => ({ role: 'reader', value })
const recordMapWith = (blocks: Record<string, unknown>) =>
  ({ block: blocks }) as unknown as ExtendedRecordMap
const title = (recordMap: ExtendedRecordMap, id: string) =>
  (recordMap.block[id]!.value as any).properties.title

describe('smartenQuotes', () => {
  it('curls double quotes around a phrase', () => {
    expect(smartenQuotes('your "headspace."')).toBe('your “headspace.”')
    expect(smartenQuotes('"Ooh," they said. "Nice!"')).toBe(
      '“Ooh,” they said. “Nice!”'
    )
  })

  it('sets apostrophes in contractions and possessives', () => {
    expect(smartenQuotes("I'm sure it's Stephen's")).toBe(
      'I’m sure it’s Stephen’s'
    )
    expect(smartenQuotes("the users' trust")).toBe('the users’ trust')
  })

  it('curls single quotes around a phrase', () => {
    expect(smartenQuotes("a 'right' answer")).toBe('a ‘right’ answer')
    expect(smartenQuotes('"She said \'no,\'" he wrote')).toBe(
      '“She said ‘no,’” he wrote'
    )
  })

  it('opens a quote after brackets and dashes', () => {
    expect(smartenQuotes('(your "neural network")')).toBe(
      '(your “neural network”)'
    )
    expect(smartenQuotes('a thought—"why not?"—passed')).toBe(
      'a thought—“why not?”—passed'
    )
  })

  it('uses an apostrophe, not an opening quote, for elisions', () => {
    expect(smartenQuotes("the '90s")).toBe('the ’90s')
    expect(smartenQuotes("rock 'n' roll")).toBe('rock ’n’ roll')
    expect(smartenQuotes("get 'em, 'til then")).toBe('get ’em, ’til then')
    expect(smartenQuotes("in the 1990's")).toBe('in the 1990’s')
  })

  it('leaves foot and inch marks straight', () => {
    expect(smartenQuotes('he is 6\'2" tall')).toBe('he is 6\'2" tall')
  })

  it('closes a quotation that ends in a digit', () => {
    expect(smartenQuotes('"about 5" was the answer')).toBe(
      '“about 5” was the answer'
    )
  })

  it('keeps quotes that are already curly', () => {
    const text = '“cognitive empathy,” where it’s clear'
    expect(smartenQuotes(text)).toBe(text)
  })
})

describe('smartenDecorations', () => {
  it('matches quotes across formatting runs', () => {
    const title: Decoration[] = [
      ['call this your "'],
      ['headspace.', [['b']]],
      ['"']
    ]
    expect(smartenDecorations(title)).toEqual([
      ['call this your “'],
      ['headspace.', [['b']]],
      ['”']
    ])
  })

  it('never touches inline code, but reads it as context', () => {
    const title: Decoration[] = [
      ['run '],
      ['$("div").on(\'click\')', [['c']]],
      ['\'s handler, it\'s "fine"']
    ]
    expect(smartenDecorations(title)).toEqual([
      ['run '],
      ['$("div").on(\'click\')', [['c']]],
      ['’s handler, it’s “fine”']
    ])
  })

  it('returns the same array when nothing changes', () => {
    const title: Decoration[] = [['No quotes here'], ['at all', [['i']]]]
    expect(smartenDecorations(title)).toBe(title)
  })
})

describe('smartenRecordMapQuotes', () => {
  it('curls prose blocks and leaves code blocks as written', () => {
    const recordMap = recordMapWith({
      text: box({
        id: 'text',
        type: 'text',
        properties: { title: [['it\'s "fine"']] }
      }),
      code: box({
        id: 'code',
        type: 'code',
        properties: { title: [['alert("it\'s loaded")']] }
      })
    })

    const curled = smartenRecordMapQuotes(recordMap)

    expect(title(curled, 'text')).toEqual([['it’s “fine”']])
    expect(curled.block.code).toBe(recordMap.block.code)
  })

  it('curls captions and simple-table cells', () => {
    const recordMap = recordMapWith({
      image: box({
        id: 'image',
        type: 'image',
        properties: {
          source: [["https://example.com/it's.png"]],
          caption: [["Stephen's desk"]]
        }
      }),
      row: box({
        id: 'row',
        type: 'table_row',
        properties: { abc: [["don't"]], def: [['do']] }
      })
    })

    const curled = smartenRecordMapQuotes(recordMap)
    const image = (curled.block.image!.value as any).properties
    const row = (curled.block.row!.value as any).properties

    expect(image.caption).toEqual([['Stephen’s desk']])
    expect(image.source).toEqual([["https://example.com/it's.png"]])
    expect(row.abc).toEqual([['don’t']])
  })

  it('does not mutate the record map it was given', () => {
    const recordMap = recordMapWith({
      text: box({
        id: 'text',
        type: 'text',
        properties: { title: [["it's"]] }
      })
    })

    const curled = smartenRecordMapQuotes(recordMap)

    expect(curled).not.toBe(recordMap)
    expect(title(recordMap, 'text')).toEqual([["it's"]])
  })

  it('returns the same record map when no block changes', () => {
    const recordMap = recordMapWith({
      text: box({
        id: 'text',
        type: 'text',
        properties: { title: [['Already “curly”']] }
      })
    })
    expect(smartenRecordMapQuotes(recordMap)).toBe(recordMap)
  })

  it('handles the doubly boxed block shape', () => {
    const recordMap = recordMapWith({
      text: {
        role: 'reader',
        value: {
          role: 'reader',
          value: {
            id: 'text',
            type: 'text',
            properties: { title: [["it's"]] }
          }
        }
      }
    })

    const curled = smartenRecordMapQuotes(recordMap)
    const inner = (curled.block.text!.value as any).value

    expect(inner.properties.title).toEqual([['it’s']])
  })
})
