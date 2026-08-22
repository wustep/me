import { normalizeRequestPath } from './accept'
import { canonicalPageMap } from './notion-index'
import {
  bioText,
  githubUrl,
  linkedinUrl,
  notionContactUrl,
  siteDomain,
  siteJobTitle,
  siteName,
  siteUrl,
  siteWorksFor,
  writingPersonal,
  writingSoftware,
  xUrl
} from './site-identity'

const OVERRIDE_SLUGS = [
  'articles',
  'notes',
  'projects',
  'essays',
  'updates',
  'writing'
] as const

const FIRST_PARTY_PREFIXES = [
  '/prompting',
  '/lenses',
  '/playground',
  '/design'
] as const

const FIRST_PARTY_EXACT = new Set([
  '/',
  '/about',
  '/privacy',
  '/contact',
  '/feed',
  '/site',
  '/owner'
])

function absolute(path: string) {
  return `${siteUrl}${path}`
}

function writingList(
  items: readonly { title: string; href: string; note: string }[]
) {
  return items
    .map((item) => `- [${item.title}](${absolute(item.href)}) — ${item.note}`)
    .join('\n')
}

export function getHomeMarkdown() {
  return `# ${siteName}

${bioText}

**${siteJobTitle} at ${siteWorksFor}.** Previously software engineer at Notion (2022–2025) and Facebook (2019–2022). B.S. Computer Science & Engineering, Ohio State (2015–2019).

## Writing

Software:

${writingList(writingSoftware)}

Personal:

${writingList(writingPersonal)}

## Projects

- [Lenses](${absolute('/lenses')}) — a canvas of lenses for seeing the world
- [Playground](${absolute('/playground')}) — small web experiments
- [Projects](${absolute('/projects')}) — a longer list of work and side projects

## For agents

This is a personal site, not a product API. Prefer \`Accept: text/markdown\` (or \`text/plain\`) on these pages.

- [Home](${absolute('/')})
- [Prompting](${absolute('/prompting')})
- [Lenses](${absolute('/lenses')})
- [Playground](${absolute('/playground')})
- [Feed](${absolute('/feed')})
- [Sitemap](${absolute('/sitemap.xml')})
- [llms.txt](${absolute('/llms.txt')})
- [OpenAPI](${absolute('/openapi.json')})
- [Contact](${absolute('/contact')})
- [Privacy](${absolute('/privacy')})

## Links

- [GitHub](${githubUrl})
- [LinkedIn](${linkedinUrl})
- [X](${xUrl})
`
}

export function getPrivacyMarkdown() {
  return `# Privacy — ${siteName}

${siteUrl}/privacy

This is a personal site. No accounts, no cookies beyond hosting defaults, no data sales.

Hosted on Vercel, which keeps normal server logs (IP, path, timestamp). I may use Vercel Analytics for anonymous page-view counts. You can block that with their \`va-disable\` flag.

Writing comes from public Notion pages. If it's on wustep.me, it's public. Playground experiments run in your browser.

Questions: see [Contact](${absolute('/contact')}).
`
}

export function getContactMarkdown() {
  return `# Contact — ${siteName}

${siteUrl}/contact

I'm easiest to find as wustep on [X](${xUrl}), [GitHub](${githubUrl}), or [LinkedIn](${linkedinUrl}). There's also a [Notion contact form](${notionContactUrl}) if you'd rather not reply in public.
`
}

export function getPromptingMarkdown() {
  return `# How to talk to coding agents

A field guide to prompting coding agents — what works, what does not, and why.

Read the HTML version at ${absolute('/prompting')}. Related notes live under /prompting/mindset, /prompting/techniques, /prompting/tree, /prompting/colleague, /prompting/equation, /prompting/orchestration, and /prompting/recap.

This is writing on ${siteDomain}, not a hosted model API.
`
}

export function getLensesMarkdown() {
  return `# Lenses

A canvas of lenses for seeing the world — headspace, dopamine, incentives, taste, status, and more. No single lens sees everything.

HTML: ${absolute('/lenses')}
`
}

export function getPlaygroundMarkdown() {
  return `# Playground

Small web experiments: games, visualizers, and other things that did not belong on a Notion page.

HTML: ${absolute('/playground')}
`
}

export function get404Markdown() {
  return `# 404 — Page not found

Nothing lives at this path on ${siteDomain}.

Try:

- [Home](${absolute('/')})
- [llms.txt](${absolute('/llms.txt')})
- [sitemap.xml](${absolute('/sitemap.xml')})
`
}

function getStubMarkdown(path: string, title: string) {
  return `# ${title}

This page is published as HTML on ${siteName}'s site.

- HTML: ${absolute(path)}
- Site index: ${absolute('/llms.txt')}
- Homepage markdown: request ${absolute('/')} with \`Accept: text/markdown\`
`
}

export function isKnownSitePath(path: string): boolean {
  const normalized = normalizeRequestPath(path)
  if (FIRST_PARTY_EXACT.has(normalized)) return true
  if (
    FIRST_PARTY_PREFIXES.some(
      (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
    )
  ) {
    return true
  }

  const slug = normalized.slice(1)
  if (!slug) return true
  if ((OVERRIDE_SLUGS as readonly string[]).includes(slug)) return true
  return Boolean(canonicalPageMap[slug])
}

export function markdownForPath(pathname: string): {
  body: string
  status: number
} {
  const path = normalizeRequestPath(pathname)

  switch (path) {
    case '/':
    case '/about':
      return { body: getHomeMarkdown(), status: 200 }
    case '/privacy':
      return { body: getPrivacyMarkdown(), status: 200 }
    case '/contact':
      return { body: getContactMarkdown(), status: 200 }
    case '/prompting':
      return { body: getPromptingMarkdown(), status: 200 }
    case '/lenses':
      return { body: getLensesMarkdown(), status: 200 }
    case '/playground':
      return { body: getPlaygroundMarkdown(), status: 200 }
    default:
      break
  }

  if (isKnownSitePath(path)) {
    const title = path.slice(1) || siteName
    return { body: getStubMarkdown(path, title), status: 200 }
  }

  return { body: get404Markdown(), status: 404 }
}

export function getLlmsTxt() {
  return `# ${siteDomain}

${siteName}'s personal site — writing, prompting notes, and playground projects.
${siteUrl}

## When to use this

Use this site when you want ${siteName} (wustep): essays and notes, how he thinks about prompting coding agents, the Lenses deck, or small projects in the playground.

Do not treat wustep.me as a product, SaaS, or public data API. There is no CRUD API to integrate with and no developer portal. The machine-readable files below describe the site itself.

## Markdown

Request \`Accept: text/markdown\` (or \`text/plain\`) on the homepage and other key pages. Those responses use \`Content-Type: text/markdown; charset=utf-8\` and \`Vary: Accept\`.

## Important URLs

- ${absolute('/')} — about / home
- ${absolute('/about')} — same as home
- ${absolute('/prompting')} — prompting notes
- ${absolute('/lenses')} — lenses deck
- ${absolute('/playground')} — experiments
- ${absolute('/feed')} — RSS
- ${absolute('/sitemap.xml')} — sitemap
- ${absolute('/contact')} — how to reach me
- ${absolute('/privacy')} — privacy notes
- ${absolute('/llms.txt')} — this file
- ${absolute('/openapi.json')} — the real public surfaces only

## Contact

- GitHub: ${githubUrl}
- LinkedIn: ${linkedinUrl}
- X: ${xUrl}
`
}

export function getOpenApiDocument() {
  const markdownOrHtml = {
    '200': {
      description:
        'HTML for browsers; markdown when Accept prefers text/markdown or text/plain.',
      content: {
        'text/html': { schema: { type: 'string' } },
        'text/markdown': { schema: { type: 'string' } }
      }
    }
  }

  return {
    openapi: '3.1.0',
    info: {
      title: siteDomain,
      summary: `${siteName}'s personal site`,
      description:
        'Public, agent-facing surfaces for wustep.me. This is a personal site — writing, prompting notes, and playground projects — not a product API. There are no authenticated CRUD resources to integrate with.',
      version: '1.0.0',
      contact: {
        name: siteName,
        url: absolute('/contact')
      }
    },
    servers: [{ url: siteUrl }],
    paths: {
      '/': {
        get: {
          operationId: 'getHome',
          summary: 'Homepage / about',
          description: `${siteName}'s homepage. Send Accept: text/markdown for a text index.`,
          responses: markdownOrHtml
        }
      },
      '/about': {
        get: {
          operationId: 'getAbout',
          summary: 'About (same as home)',
          description:
            'Redirects to / in HTML; markdown is the same as the homepage.',
          responses: markdownOrHtml
        }
      },
      '/contact': {
        get: {
          operationId: 'getContact',
          summary: 'Contact',
          description:
            'How to reach Stephen. Public socials only; no phone number.',
          responses: markdownOrHtml
        }
      },
      '/privacy': {
        get: {
          operationId: 'getPrivacy',
          summary: 'Privacy',
          description:
            'What this personal site collects (hosting logs, optional analytics) and what it does not.',
          responses: markdownOrHtml
        }
      },
      '/prompting': {
        get: {
          operationId: 'getPrompting',
          summary: 'Prompting notes',
          description: 'Field guide to talking to coding agents.',
          responses: markdownOrHtml
        }
      },
      '/lenses': {
        get: {
          operationId: 'getLenses',
          summary: 'Lenses',
          description: 'A canvas of lenses for seeing the world.',
          responses: markdownOrHtml
        }
      },
      '/playground': {
        get: {
          operationId: 'getPlayground',
          summary: 'Playground',
          description: 'Small web experiments.',
          responses: markdownOrHtml
        }
      },
      '/feed': {
        get: {
          operationId: 'getFeed',
          summary: 'RSS feed',
          description:
            'RSS of published posts from the public Notion collection.',
          responses: {
            '200': {
              description: 'RSS 2.0 XML',
              content: { 'application/rss+xml': { schema: { type: 'string' } } }
            }
          }
        }
      },
      '/sitemap.xml': {
        get: {
          operationId: 'getSitemap',
          summary: 'Sitemap',
          description: 'Static sitemap of public pages.',
          responses: {
            '200': {
              description: 'XML sitemap',
              content: { 'application/xml': { schema: { type: 'string' } } }
            }
          }
        }
      },
      '/llms.txt': {
        get: {
          operationId: 'getLlmsTxt',
          summary: 'Agent instructions',
          description:
            'When to use this site, important URLs, and markdown negotiation.',
          responses: {
            '200': {
              description: 'Plain-text agent instructions',
              content: { 'text/plain': { schema: { type: 'string' } } }
            }
          }
        }
      },
      '/openapi.json': {
        get: {
          operationId: 'getOpenApi',
          summary: 'OpenAPI document',
          description: 'This specification.',
          responses: {
            '200': {
              description: 'OpenAPI 3.1 JSON',
              content: { 'application/json': { schema: { type: 'object' } } }
            }
          }
        }
      },
      '/api/social-image': {
        get: {
          operationId: 'getSocialImage',
          summary: 'Open Graph image',
          description:
            'Renders a 1200×630 PNG for link unfurls from a public Notion page id. Errors are JSON.',
          parameters: [
            {
              name: 'id',
              in: 'query',
              required: false,
              description: 'Notion page id. Defaults to the site root page.',
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'PNG image',
              content: {
                'image/png': { schema: { type: 'string', format: 'binary' } }
              }
            },
            '400': {
              description: 'Invalid page id or workspace mismatch',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiError' }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        ApiError: {
          type: 'object',
          required: ['error', 'message', 'status'],
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            status: { type: 'integer' }
          }
        }
      }
    }
  }
}
