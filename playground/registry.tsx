export type PlaygroundEntry = {
  title: string
  url: string
  description: string
  summary?: string
  date?: string
  year?: string
  disabled?: boolean
  article?: string
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
        title: 'WebGL Shaders',
        url: '/playground/webgl-shaders',
        description: 'Realtime fragment shader sketches rendered in WebGL.',
        summary: 'Interactive shader experiments with WebGL',
        date: 'Jan 2025',
        year: '2025',
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        title: 'Particle Systems',
        url: '/playground/particle-systems',
        description: '10k+ particles with custom physics integrator.',
        summary: 'Dynamic particle animations and physics',
        date: 'Feb 2025',
        year: '2025',
        gradient: 'from-blue-500 to-cyan-500'
      }
    ]
  },
  {
    title: 'Games',
    items: [
      {
        title: 'Bomberman',
        url: '/playground/bomberman',
        description:
          'Two-player Bomberman clone with emojis. Fully vibe coded with Cursor & Claude 3.5 Sonnet.',
        summary: 'Two-player Bomberman clone with pets & power-ups',
        date: 'Nov 2024',
        year: '2024',
        article: '/bomberman',
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
        description: 'Audio-reactive visualizer inspired by Van Gogh.',
        summary: 'Audio-reactive MIDI visualizer inspired by Van Gogh',
        date: 'Dec 2016',
        year: '2016',
        article: '/starry-sequencer',
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
        image: '/playground/covers/tbdbitl.png'
      }
    ]
  }
]

export const playgroundEntries = playgroundSections.flatMap(
  (section) => section.items
)
