import { parsePageId } from 'notion-utils'

import { inversePageUrlOverrides } from './config'

export type PageShareOverride = {
  /** Replaces the Notion page title in <title> and og:title. */
  title?: string
  description: string
  /** Name of a 1200×630 card in public/og/ (see shareCardUrl). */
  card: string
}

/**
 * Share copy and cards for the Notion pages mounted at fixed paths in
 * site.config.ts `pageUrlOverrides`. These index pages have no Description
 * or cover of their own, so they would otherwise unfurl with the site
 * tagline and a generic generated title card. Posts are untouched: they keep
 * their own Description and /api/social-image card.
 */
const pageShareOverrides: Record<string, PageShareOverride> = {
  updates: {
    // The root Notion page, whose own title is just "Stephen Wu".
    title: 'Updates · Stephen Wu',
    description:
      'Various musings about navigating work & life, written while building Notion in San Francisco.',
    card: 'updates'
  },
  writing: {
    description:
      'Articles on building software, and personal essays on headspace, philosophy, music, and play.',
    card: 'writing'
  },
  articles: {
    description:
      'Articles on building software: experimentation, debugging, UI thrash, and advice for students.',
    card: 'articles'
  },
  essays: {
    description:
      'Personal essays on headspace, philosophy, music improvisation, ADHD, vulnerability, and play.',
    card: 'essays'
  },
  projects: {
    description:
      'Things I’ve built at Notion, at Facebook, and on the side, from dashboards and databases to Spot it! and Bomberman.',
    card: 'projects'
  },
  notes: {
    description:
      'Running lists: tech I love, and books, audiobooks, and podcasts that stuck with me.',
    card: 'notes'
  }
}

export function getPageShareOverride(
  pageId: string | undefined
): PageShareOverride | undefined {
  const id = pageId && parsePageId(pageId, { uuid: false })
  const path = id ? inversePageUrlOverrides[id] : undefined
  return path ? pageShareOverrides[path] : undefined
}
