export type PlaygroundEntry = {
  title: string
  url: string
  description: string
  summary?: string
  date?: string
  year?: string
  disabled?: boolean
  article?: string
  source?: string
  gradient?: string
  image?: string
}

export type PlaygroundSection = {
  title: string
  items: PlaygroundEntry[]
}

export const playgroundSections: PlaygroundSection[] = [
  {
    title: 'Experiments',
    items: [
      {
        title: 'Bookshelf',
        url: '/playground/bookshelf',
        description: 'An interactive bookshelf of some of my favorite books.',
        summary: 'An interactive bookshelf of my favorite books',
        date: 'Dec 2025',
        year: '2025',
        source: 'https://github.com/wustep/bookshelf',
        image: '/playground/covers/bookshelf.svg'
      },
      {
        title: 'Shadcn + Physics',
        url: '/playground/shadcn-physics',
        description: 'An iframe-powered physics sandbox built with shadcn UI.',
        summary:
          'Throw, stack, and collide shadcn/ui components with Matter.js',
        date: 'May 2025',
        year: '2025',
        source:
          'https://github.com/wustep/shadbook/blob/main/src/app/pages/experiments/physics-playground.tsx',
        image: '/playground/covers/shadcn-physics.png'
      }
    ]
  },
  {
    title: 'Games',
    items: [
      {
        title: 'Spot it!',
        url: '/playground/spot-it',
        description:
          'An exploration of Spot it!, the symbols matching game and its mathematical properties.',
        summary: 'Explore the symbol matching card game and its mechanics',
        date: 'Dec 2025',
        year: '2025',
        source: 'https://github.com/wustep/spot-it',
        gradient: 'from-amber-400 to-pink-500',
        image: '/playground/covers/spot-it.png'
      },
      {
        title: 'Bomberman',
        url: '/playground/bomberman',
        description:
          'Two-player Bomberman clone with emojis. Fully vibe coded with Cursor & Claude 3.5 Sonnet.',
        summary: 'Two-player Bomberman clone with pets & power-ups',
        date: 'Nov 2024',
        year: '2024',
        article: '/bomberman',
        source: 'https://github.com/wustep/bomberman',
        gradient: 'from-orange-500 to-rose-500',
        image: '/playground/covers/bomberman.png'
      }
    ]
  },
  {
    title: 'Visualizations',
    items: [
      {
        title: 'Starry Night Sequencer',
        url: '/playground/starry-sequencer',
        description: 'MIDI visualizer inspired by Van Gogh.',
        summary: 'Audio-reactive MIDI visualizer inspired by Van Gogh',
        date: 'Dec 2016',
        year: '2016',
        article: '/starry-sequencer',
        source: 'https://github.com/wustep/starry-sequencer',
        gradient: 'from-indigo-500 via-sky-500 to-emerald-400',
        image: '/playground/covers/starry-sequencer.png'
      },
      {
        title: 'TBDBITL',
        url: '/playground/tbdbitl',
        description: 'Interactive D3.js infographic for the OSU Marching Band.',
        summary: 'D3.js infographic celebrating the Ohio State Marching band',
        date: 'Dec 2016',
        year: '2016',
        article: '/tbdbitl',
        source: 'http://github.com/wustep/tbdbitl',
        image: '/playground/covers/tbdbitl.png'
      }
    ]
  }
]

export const playgroundEntries = playgroundSections.flatMap(
  (section) => section.items
)
