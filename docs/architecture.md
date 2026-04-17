# Architecture

This is a Next.js (Pages Router) site that renders content authored in Notion. It's a fork of [nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit) with custom styling and a few extensions.

## High-level data flow

```
Notion workspace
    ↓ (unofficial API via `notion-client`)
lib/notion-api.ts        ← retry + rate-limit wrappers
    ↓
lib/notion.ts            ← getPage / search with TTL caches
    ↓
lib/resolve-notion-page.ts
    ↓
pages/[pageId].tsx       ← getStaticProps (ISR, 24h revalidate)
    ↓
components/NotionPage    ← react-notion-x renderer
    ↓
Browser (HTML + hydrated React)
```

## Directory layout

| Path | Purpose |
|---|---|
| `site.config.ts` | User-facing site configuration (page IDs, domain, social links, etc.) |
| `lib/config.ts` | Normalizes `site.config.ts` + env vars into typed exports |
| `lib/notion-api.ts` | `notion` (runtime) and `buildNotion` (build-time, rate-limited) clients |
| `lib/notion.ts` | `getPage` and `search` wrappers with in-memory TTL caches |
| `lib/resolve-notion-page.ts` | URL → pageId → recordMap pipeline, with Redis URI cache |
| `lib/get-site-map.ts` | Fans out from root page to build `pageMap` + `canonicalPageMap` |
| `lib/preview-images.ts` | LQIP placeholder generation for images, stored via Keyv |
| `lib/acl.ts` | Workspace-scoping check (rejects pages from other Notion workspaces) |
| `lib/map-page-url.ts` | pageId → URL mapping (honors `pageUrlOverrides`) |
| `pages/[pageId].tsx` | The catch-all Notion page route |
| `pages/index.tsx` | Custom homepage (static, no Notion fetch) |
| `pages/feed.tsx` | RSS feed from the Posts collection |
| `pages/sitemap.xml.tsx` | Sitemap generated from `getSiteMap()` |
| `pages/api/search-notion.ts` | Proxy for Notion search (currently disabled via config) |
| `pages/api/social-image.tsx` | Edge-runtime OG image generator (uses `next/og`) |
| `components/NotionPage.tsx` | The main page shell wrapping `react-notion-x` |

## Rendering modes

- **Homepage (`/`)** — pure static, no Notion data. See [`pages/index.tsx`](../pages/index.tsx).
- **Notion pages (`/[pageId]`)** — ISR with 24h revalidate. Built paths come from `getSiteMap()`; unknown slugs fall through to `fallback: true`.
- **Sitemap / feed** — `getServerSideProps` with long CDN `Cache-Control`. They never execute per-request under normal load.
- **Social image** — edge API route using `next/og`, regenerated on demand and cached by the CDN.
- **Search** — client calls `/api/search-notion`, which proxies to Notion. Currently disabled (`isSearchEnabled: false`).

## The unofficial Notion API

This site uses [`notion-client`](https://github.com/NotionX/react-notion-x/tree/master/packages/notion-client), which scrapes Notion's public frontend API. That means:

- No API token needed — pages just need to be publicly shared.
- Rich block types supported by `react-notion-x` render well; custom Notion blocks may not.
- Rate limits are on Notion's end (~300 req / 300s). See [caching.md](caching.md) for the mitigation stack.
- `signed_urls` (AWS S3 URLs for uploaded images) expire. See [images.md](images.md) for how we handle that.

## Build vs. runtime

Two distinct phases use different Notion clients:

- **Build time** (`next build`): `getStaticPaths` calls `getSiteMap()`, which walks every page. Uses `buildNotion` — serializes all fetches 1.1s apart and retries 429s up to 5× with exponential backoff.
- **Runtime** (ISR revalidation, API routes): Uses `notion` — retries once after 1.1s on 429/5xx.

See [`lib/notion-api.ts`](../lib/notion-api.ts).

## Third-party integrations

Listed here for orientation; most are optional and gated on env vars.

- **Redis (Keyv)** — `REDIS_HOST` + `REDIS_PASSWORD`. Currently disabled.
- **Fathom Analytics** — `NEXT_PUBLIC_FATHOM_ID`.
- **PostHog** — `NEXT_PUBLIC_POSTHOG_ID`.
- **Google Analytics** — `NEXT_PUBLIC_GOOGLE_ID`.
- **Giscus comments** — configured in `site.config.ts` (commented out).
