# Routing

How a URL like `/articles` or `/my-post-slug-2bc5cb08cf2c8036a1e3cddcb2c61d97` becomes a rendered Notion page.

## Route structure

- `/` — custom static homepage, [`pages/index.tsx`](../pages/index.tsx). Does not touch Notion.
- `/[pageId]` — catch-all for every Notion page, [`pages/[pageId].tsx`](../pages/[pageId].tsx).
- `/sitemap.xml`, `/feed`, `/robots.txt`, `/site`, `/404`, `/_error` — special pages.
- `/api/search-notion`, `/api/social-image` — API routes.

## Resolving `[pageId]` → recordMap

Logic lives in [`lib/resolve-notion-page.ts`](../lib/resolve-notion-page.ts). For a request to `/<rawPageId>`:

```
1. Normalize the raw path
   normalizePageIdPath()              ← strips dashes from trailing UUID
       "foo-2bc5cb08-cf2c-8036-..."  →  "foo-2bc5cb08cf2c8036..."

2. Try to extract a UUID directly from the path
   parsePageId(normalizedRawPageId)

3. If no UUID, check manual overrides
   pageUrlOverrides[rawPath]          ← from site.config.ts
   pageUrlAdditions[rawPath]

4. If still no UUID, check the generated page index
   canonicalPageMap[rawPath]

5. If resolved, fetch
   getPage(pageId) → ExtendedRecordMap

6. Run ACL check (lib/acl.ts) to reject pages from other workspaces
```

If nothing resolves, return a 404. Newly-added or renamed pages appear after `pnpm notion:index` runs, which also happens automatically before a production build.

## `pageUrlOverrides` vs. `pageUrlAdditions`

Both live in `site.config.ts` and are processed by [`lib/config.ts`](../lib/config.ts):

- **`pageUrlOverrides`** — canonical, bidirectional. `/articles → <uuid>` means `/articles` resolves to that page **and** that page's outbound links render as `/articles`. Used for the "clean" URLs of top-level sections.
- **`pageUrlAdditions`** — one-way alias. `/old-post → <uuid>` resolves inbound but does not change how the page URL is displayed elsewhere. Useful for redirects.

Example from [`site.config.ts`](../site.config.ts):

```ts
pageUrlOverrides: {
  '/articles': 'e40efc6731ea4e1da2626d709950fbe4',
  '/notes':    'a9d2669020314160b70110639617e822',
  '/projects': '511994667bac45fda9fd8f9db136e476',
  // ...
}
```

## Canonical slug generation

For pages _not_ in `pageUrlOverrides`, the URL is built from the Notion page title by [`lib/get-canonical-page-id.ts`](../lib/get-canonical-page-id.ts) → `notion-utils`' `getCanonicalPageId`. In production this produces slugs like `my-post-title` (no UUID). In dev, `includeNotionIdInUrls` appends the UUID for easier debugging.

The outbound URL mapper lives in [`lib/map-page-url.ts`](../lib/map-page-url.ts) and is handed to `react-notion-x` via `NotionPage` so internal links render correctly.

## Static path generation

`getStaticPaths` in [`pages/[pageId].tsx`](../pages/[pageId].tsx) builds the full set of paths to pre-render:

```ts
const allPageIds = [
  ...new Set([
    ...Object.keys(canonicalPageMap), // every public page
    ...Object.keys(pageUrlOverrides) // + manual overrides
  ])
]
```

- `fallback: true` — paths outside this set still work; they're rendered on first request and cached from then on.
- In dev, `paths: []` with `fallback: true` skips pre-rendering; slug resolution still uses the committed generated index.

## Site map construction

Before a build, [`notion-index.config.ts`](../notion-index.config.ts) calls [`lib/get-site-map.ts`](../lib/get-site-map.ts), which walks from `rootNotionPageId` outward, following links and collections up to `maxDepth: 1`. For each discovered page:

- Skip if the page's `Public` property is `false`.
- Compute a canonical ID and insert into `canonicalPageMap`.
- Warn (and skip the duplicate) if two pages collide on canonical ID.

This is the most API-heavy operation in the codebase—one `getPage` per discovered page, all serialized through the build-time rate limiter. Its output is written to [`lib/generated/notion-index.json`](../lib/generated/notion-index.json), and the same pass writes `public/sitemap.xml`.

## Workspace scoping

[`lib/acl.ts`](../lib/acl.ts) rejects pages whose `space_id` doesn't match `rootNotionSpaceId`. This prevents someone from crafting a URL that loads an unrelated Notion page (e.g. from someone else's public workspace) through this site's domain.
