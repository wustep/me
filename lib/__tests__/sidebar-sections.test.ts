import { describe, expect, it } from 'vitest'

import { STARRED_SECTION_TITLE, withStarredSection } from '../sidebar-sections'

const sections = [
  {
    title: 'Experiments',
    items: [{ title: 'A' }, { title: 'B', starred: true }, { title: 'C' }]
  },
  { title: 'Games', items: [{ title: 'D', starred: true }] },
  { title: 'Guides', items: [{ title: 'E' }, { title: 'F', starred: true }] }
]

const titles = (s: ReturnType<typeof withStarredSection>) =>
  s.map((section) => [section.title, section.items.map((item) => item.title)])

describe('withStarredSection', () => {
  it('pins starred items to a top section in registry order, listed once', () => {
    expect(titles(withStarredSection(sections))).toEqual([
      [STARRED_SECTION_TITLE, ['B', 'D', 'F']],
      ['Experiments', ['A', 'C']],
      ['Guides', ['E']]
    ])
  })

  it('adds no Starred section when nothing is starred', () => {
    const plain = [{ title: 'X', items: [{ title: 'A' }] }]
    expect(withStarredSection(plain)).toEqual(plain)
  })
})
