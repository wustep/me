/**
 * Public identity for wustep.me — shared by the homepage, JSON-LD,
 * markdown negotiation, and agent files. Keep this aligned with AboutPage.
 */

export const siteName = 'Stephen Wu'
export const siteDomain = 'wustep.me'
export const siteUrl = `https://${siteDomain}`
export const siteJobTitle = 'Tech Lead Manager'
export const siteWorksFor = 'Notion'
export const siteWorksForUrl = 'https://notion.com'
export const siteTagline = 'Engineering at Notion'

export const githubHandle = 'wustep'
export const linkedinHandle = 'wustep'
export const xHandle = 'wustep'

export const githubUrl = `https://github.com/${githubHandle}`
export const linkedinUrl = `https://linkedin.com/in/${linkedinHandle}`
export const xUrl = `https://x.com/${xHandle}`

export const sameAs = [githubUrl, linkedinUrl, xUrl] as const

// Plain-text mirror of the homepage bio — used for meta, JSON-LD, and markdown.
export const bioText = `I'm Stephen, a product & design engineer who now also manages engineers. I think a lot about tools for thought, software design, and personal philosophy. I grew up mostly in Toledo, Ohio, and live in San Francisco now. I also enjoy roguelike deckbuilders, piano improvisation, and making random web projects.`

export const workHistory = [
  {
    company: 'Notion',
    icon: 'notion',
    url: siteWorksForUrl,
    roles: [
      { title: 'Tech Lead Manager', period: '2025–' },
      { title: 'Software Engineer', period: '2022–2025' }
    ]
  },
  {
    company: 'Facebook',
    icon: 'facebook',
    roles: [{ title: 'Software Engineer', period: '2019–2022' }]
  },
  {
    company: 'Ohio State',
    icon: 'osu',
    roles: [
      { title: 'B.S. Computer Science & Engineering', period: '2015–2019' }
    ]
  }
]

export const writingSoftware = [
  {
    title: 'Prompting',
    href: '/prompting',
    note: 'talking to coding agents'
  },
  {
    title: 'Advice for students',
    href: '/advice-students',
    note: 'career pathfinding'
  },
  {
    title: 'Graphs of knowledge',
    href: '/cs-knowledge-graph',
    note: 'careers as infinite trees'
  },
  {
    title: "Don't thrash the user",
    href: '/thrash',
    note: 'empathetic ui/ux'
  }
] as const

export const writingPersonal = [
  {
    title: 'Headspace',
    href: '/headspace',
    note: 'identity, growth, thought-space'
  },
  {
    title: 'Foraging',
    href: '/foraging',
    note: 'ADHD, dopamine, attention'
  },
  {
    title: 'On philosophy',
    href: '/philosophy',
    note: 'moral philosophy, lenses'
  },
  {
    title: "oct '25",
    href: '/oct-25',
    note: 'life update'
  }
] as const

export const notionContactUrl =
  'https://wustep.notion.site/1425cb08cf2c80cc89d4f322774aa02b'

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: siteName,
        url: siteUrl,
        description: bioText,
        jobTitle: siteJobTitle,
        worksFor: {
          '@type': 'Organization',
          name: siteWorksFor,
          url: siteWorksForUrl
        },
        sameAs: [...sameAs]
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
        description: bioText,
        author: { '@id': `${siteUrl}/#person` }
      }
    ]
  }
}
