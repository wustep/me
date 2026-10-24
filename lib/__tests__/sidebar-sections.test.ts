import { describe, expect, it } from 'vitest'

import { pinStarred } from '../sidebar-sections'

const sections = [
  {
    title: 'Experiments',
    items: [{ title: 'A' }, { title: 'B', starred: 2 }, { title: 'C' }]
  },
  { title: 'Games', items: [{ title: 'D', starred: 3 }] },
  { title: 'Guides', items: [{ title: 'E' }, { title: 'F', starred: 1 }] }
]

describe('pinStarred', () => {
  it('pins starred items in star order and lists each only once', () => {
    const { pinned, sections: rest } = pinStarred(sections)
    expect(pinned.map((item) => item.title)).toEqual(['F', 'B', 'D'])
    expect(
      rest.map((section) => [
        section.title,
        section.items.map((item) => item.title)
      ])
    ).toEqual([
      ['Experiments', ['A', 'C']],
      ['Guides', ['E']]
    ])
  })

  it('pins nothing when nothing is starred', () => {
    const plain = [{ title: 'X', items: [{ title: 'A' }] }]
    expect(pinStarred(plain)).toEqual({ pinned: [], sections: plain })
  })
})
