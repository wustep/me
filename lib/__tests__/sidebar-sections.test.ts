import { describe, expect, it } from 'vitest'

import { starRank, starredOrder } from '../../playground/starred'
import { pinStarred } from '../sidebar-sections'

const titles = (sections: { title: string; items: { title: string }[] }[]) =>
  sections.map((section) => [
    section.title,
    section.items.map((item) => item.title)
  ])

describe('pinStarred', () => {
  it('pins starred items to the top of their own section, in star order', () => {
    const sections = [
      {
        title: 'Experiments',
        items: [
          { title: 'A' },
          { title: 'B', starred: 3 },
          { title: 'C' },
          { title: 'D', starred: 2 }
        ]
      },
      { title: 'Games', items: [{ title: 'E' }, { title: 'F', starred: 1 }] },
      { title: 'Guides', items: [{ title: 'G' }] },
      { title: 'Empty', items: [] }
    ]
    expect(titles(pinStarred(sections))).toEqual([
      ['Experiments', ['D', 'B', 'A', 'C']],
      ['Games', ['F', 'E']],
      ['Guides', ['G']]
    ])
  })

  it('leaves sections untouched when nothing is starred', () => {
    const plain = [{ title: 'X', items: [{ title: 'A' }, { title: 'B' }] }]
    expect(pinStarred(plain)).toEqual(plain)
  })

  it('orders Instruments above Contraptions above StageBench', () => {
    expect(starredOrder.slice(0, 3)).toEqual([
      'Instruments',
      'Contraptions',
      'StageBench'
    ])
    // Registry-shaped: Instruments and Contraptions share Visualizations,
    // so the star order (not registry order) decides which leads that section.
    const sections = [
      {
        title: 'Experiments',
        items: [
          { title: 'Jamming' },
          { title: 'Lenses' },
          { title: 'StageBench', starred: starRank('StageBench') }
        ]
      },
      {
        title: 'Visualizations',
        items: [
          { title: 'MIDI Visualizer' },
          { title: 'Contraptions', starred: starRank('Contraptions') },
          { title: 'Instruments', starred: starRank('Instruments') }
        ]
      }
    ]
    expect(titles(pinStarred(sections))).toEqual([
      ['Experiments', ['StageBench', 'Jamming', 'Lenses']],
      ['Visualizations', ['Instruments', 'Contraptions', 'MIDI Visualizer']]
    ])
  })
})
