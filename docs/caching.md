# Caching & revalidation

This site pulls content from the Notion API, which rate-limits to ~300 requests per 300 seconds per integration. Several layers keep us well under that ceiling. This doc walks through each layer top-down, from the CDN to the Notion API.

## Layer 1 — Next.js ISR (the dominant cache)

Notion pages are rendered by [`pages/[pageId].tsx`](../pages/[pageId].tsx) with `getStaticProps` + `revalidate: 86_400`.

- Pages are statically generated at build time (see `getStaticPaths` → `getSiteMap()`).
- After deploy, each page is served from Vercel's edge cache.
- A page is re-rendered on-demand at most once per 24 hours per region, and only when someone requests it.
- `fallback: true` means pages not in the sitemap can still be generated on first request.
- Error responses use `revalidate: 10` so transient failures clear quickly.

**Effect:** normal page traffic almost never hits Notion. Most of the other caches exist to keep the *revalidation path* fast and to protect the build/sitemap path.

## Layer 2 — HTTP cache headers (CDN)

Server-rendered routes set `Cache-Control` so Vercel's edge can absorb traffic without re-invoking the function.

| Route | Header | Notes |
|---|---|---|
| [`pages/sitemap.xml.tsx`](../pages/sitemap.xml.tsx) | `public, max-age=28800, s-maxage=28800, stale-while-revalidate=28800` | 8h CDN cache. `s-maxage` is required for Vercel's CDN to cache — without it every crawler hit would rebuild the full sitemap. |
| [`pages/feed.tsx`](../pages/feed.tsx) | `public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400` | 24h CDN cache for the RSS feed. |
| [`pages/api/search-notion.ts`](../pages/api/search-notion.ts) | `public, s-maxage=300, max-age=60, stale-while-revalidate=3600` | 5min at CDN, 1h SWR. Tuned so repeated search queries don't hit Notion. |

## Layer 3 — In-memory caches (per serverless instance)

These live in Node memory inside a single Vercel serverless instance. They are cleared on cold start and do not sync across instances. They primarily help during ISR revalidation, sitemap generation, and warm-instance burst traffic.

### `getPage` TTL cache — [`lib/notion.ts`](../lib/notion.ts)

- TTL: **25 minutes**.
- Keyed by `pageId`.
- Caches the full `ExtendedRecordMap` after the AWS-URL fix, navigation merge, preview images, and tweet hydration.
- Stores the in-flight `Promise` so concurrent requests for the same page share a single fetch (in-flight deduplication).
- Rejected promises are evicted so errors aren't cached.

### `search` TTL cache — [`lib/notion.ts`](../lib/notion.ts)

- TTL: **60 seconds**.
- Keyed by `JSON.stringify(params)`.
- Same Promise-sharing behaviour as the page cache.

### `getAllPages` / site map — [`lib/get-site-map.ts`](../lib/get-site-map.ts)

- Wrapped in `pMemoize` (no TTL — lives for the lifetime of the process).
- Cache key: `JSON.stringify([rootNotionPageId, rootNotionSpaceId, opts])`.
- Called by `getStaticPaths`, `sitemap.xml`, and fallback URL resolution in `[pageId].tsx`.
- A cold start rebuilds the entire map, which fans out to a `getPage` call per page — this is the most API-heavy operation in the codebase.

### Navigation link pages — [`lib/notion.ts`](../lib/notion.ts)

- Wrapped in `pMemoize` (no TTL).
- Fetches the pages referenced by `navigationLinks` with minimal options (no collections, no missing blocks, no signed URLs).
- Merged into every page record map when `navigationStyle !== 'default'`.

### Client-side search cache — [`lib/search-notion.ts`](../lib/search-notion.ts)

- Runs in the browser; wraps the `/api/search-notion` fetch.
- Uses `pMemoize` with `ExpiryMap(10_000)` — 10s TTL keyed on query string.
- Stops a user's keystroke-by-keystroke typing from sending duplicate requests.

## Layer 4 — Redis (URI → pageId mappings, optional)

[`lib/db.ts`](../lib/db.ts) wraps Keyv. Redis is controlled by `isRedisEnabled` in [`site.config.ts`](../site.config.ts). **Currently disabled.** With Redis off, Keyv falls back to an in-memory store — meaning the URI→pageId cache in [`lib/resolve-notion-page.ts`](../lib/resolve-notion-page.ts) is effectively per-instance and dies on cold start.

What the Redis cache stores today:

- `uri-to-page-id:<domain>:<env>:<normalized-uri>` → Notion `pageId`. No TTL.
- Used by `resolveNotionPage` so we can skip the full site map lookup for known canonical paths.

To enable Redis, set `isRedisEnabled: true` plus `REDIS_HOST`/`REDIS_PASSWORD` env vars. See [`.env.example`](../.env.example).

## Layer 5 — Retry + rate-limit at the Notion client

[`lib/notion-api.ts`](../lib/notion-api.ts) defines two `NotionAPI` subclasses.

### `notion` — runtime client

- Retries `429/502/503/504` **once** after a 1.1s delay.
- Used by all runtime paths (ISR revalidation, API routes, `getPage`, `search`, RSS feed).
- Short retry budget because runtime requests need to respond fast.

### `buildNotion` — build-time client

- Serializes every fetch through a Promise queue with a **1.1s minimum gap** → stays under 300 req / 300s.
- Retries `429/5xx` up to **5 times** with exponential backoff (5s → 60s cap).
- Used by `getAllPages` / `getSiteMap` during build and sitemap generation.

## Request flow cheat sheet

**A cached page view:**

```
User → Vercel CDN (ISR hit) → HTML
```

Zero Notion API calls.

**An ISR revalidation after 24h:**

```
User → Vercel CDN (stale) → serverless fn
  → resolveNotionPage
    → db.get(uri-to-page-id)           [hit or miss]
    → getPage(pageId)
      → pageCache.get(pageId)          [hit = 0 API calls]
      → notion.getPage(pageId)         [miss = 1 Notion call + retry policy]
```

**A sitemap.xml request (cache miss):**

```
Crawler → serverless fn
  → getSiteMap()
    → pMemoize hit                     [warm instance = 0 calls]
    → getAllPagesInSpace               [cold = N Notion calls via buildNotion,
                                         rate-limited to 1.1s each]
```

## Where to tune

- **Staleness tolerance too low?** Drop `revalidate` in `[pageId].tsx` or the `PAGE_CACHE_TTL_MS` / `SEARCH_CACHE_TTL_MS` constants in `lib/notion.ts`.
- **Hitting 429s during builds?** Increase `BUILD_MIN_FETCH_INTERVAL_MS` in `lib/notion-api.ts`.
- **Want cross-instance persistence?** Enable Redis and extend `db` usage beyond URI mappings (e.g., wrap `getPage` with a Keyv-backed cache).
- **Crawlers causing load?** Increase `s-maxage` on `sitemap.xml` / `feed.tsx`.
