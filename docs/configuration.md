# Configuration

The site pulls settings from two places:

1. [`site.config.ts`](../site.config.ts) — hand-authored defaults (page IDs, domain, social handles, feature flags).
2. Environment variables — secrets and deploy-specific values.

Both are normalized and re-exported as typed values from [`lib/config.ts`](../lib/config.ts). Import from `lib/config.ts`, never from `site.config.ts` directly — the latter returns raw values without validation or type narrowing.

## `site.config.ts` reference

### Required

| Field | Notes |
|---|---|
| `rootNotionPageId` | The Notion page served at `/`. Also the starting point for `getSiteMap()`. |
| `name` | Display name. |
| `domain` | Production domain (`wustep.me`). Used for canonical URLs, OG tags, etc. |
| `author` | Author name used in OG meta and RSS feed. |

### Recommended

| Field | Notes |
|---|---|
| `rootNotionSpaceId` | Restricts all pages to one Notion workspace. Enforced by [`lib/acl.ts`](../lib/acl.ts). |
| `description` | Used in OG tags and RSS description. |
| `postsCollectionId` / `postsCollectionViewId` | Required for `/feed` to work. The view ID determines which posts are included and their order. |

### Homepage Posts switcher

A custom extension. The homepage has a "Posts" toggle that swaps between Gallery and List views.

| Field | Notes |
|---|---|
| `homePostsCalloutBlockId` | Block above which the switcher UI is rendered. |
| `homePostsHeadingBlockId` | Heading block that gets the switcher attached. |
| `homeGalleryBlockIds` | Blocks shown in Gallery mode. |
| `homeListBlockIds` | Blocks shown in List mode. |

See the `usePostsViewMode` hook for how the state is persisted.

### URL mapping

| Field | Notes |
|---|---|
| `pageUrlOverrides` | Canonical clean URLs (bidirectional). See [routing.md](routing.md). |
| `pageUrlAdditions` | One-way aliases for inbound redirects. |
| `includeNotionIdInUrls` | Default: `true` in dev, `false` in prod. |

### Navigation

| Field | Notes |
|---|---|
| `navigationStyle` | `'default'` (Notion's breadcrumbs) or `'custom'`. |
| `navigationLinks` | Custom nav entries (used when `navigationStyle === 'custom'`). |

### Feature flags

| Field | Default | Notes |
|---|---|---|
| `isPreviewImageSupportEnabled` | `false` | LQIP placeholders for all page images. See [images.md](images.md). |
| `isSearchEnabled` | `true` | Currently `false` in this repo — search was disabled in 2024-11. |
| `isRedisEnabled` | `false` | Enables Keyv+Redis for URI and preview image caches. |

### Visual defaults

| Field | Notes |
|---|---|
| `defaultPageIcon` | Fallback icon if a page has none. |
| `defaultPageCover` | Fallback cover image. |
| `defaultPageCoverPosition` | Vertical focal point (0–1) for covers. |

### Social / integrations

`x`, `github`, `linkedin`, `mastodon`, `youtube`, `newsletter`, `zhihu`, `giscus` — all optional. Giscus is configured as an object with repo/category/mapping fields; see the commented example in `site.config.ts`.

## Environment variables

Set in `.env.local` for development, Vercel project settings for production. All are optional unless noted.

### Redis (only if `isRedisEnabled: true`)

| Var | Notes |
|---|---|
| `REDIS_HOST` | Required. |
| `REDIS_PASSWORD` | Required. |
| `REDIS_USER` | Defaults to `default`. |
| `REDIS_URL` | Overrides the auto-built URL if set. |
| `REDIS_NAMESPACE` | Key prefix. Defaults to `preview-images`. |
| `REDIS_ENABLED` | Alternative to the site-config flag. |

### Analytics

| Var | Notes |
|---|---|
| `NEXT_PUBLIC_FATHOM_ID` | Fathom site ID. |
| `NEXT_PUBLIC_POSTHOG_ID` | PostHog project key. |
| `NEXT_PUBLIC_GOOGLE_ID` | GA measurement ID. |

### Misc

| Var | Notes |
|---|---|
| `PORT` | Dev server port. Defaults to `3000`. |
| `NOTION_API_BASE_URL` | Override the unofficial Notion API host. Rarely needed. |
| `VERCEL_URL` | Auto-set by Vercel; used to build `apiHost` in preview deploys. |

## Deriving values

A few exports in `lib/config.ts` are computed from the above, not authored:

- `environment` — `process.env.NODE_ENV` or `'development'`.
- `isDev` — `true` when `NODE_ENV === 'development'`.
- `isServer` — `typeof window === 'undefined'`.
- `host` — `http://localhost:PORT` in dev, `https://<domain>` in prod.
- `apiHost` — uses `VERCEL_URL` on preview deploys so API calls don't go to the production domain.
- `site` — the subset of config passed around as `PageProps.site`.
- `api.*` — absolute paths to API routes.
- `inversePageUrlOverrides` — `pageId → URI` map for outbound link generation.

## Validation

`site.config.ts` is validated at import time:

- `rootNotionPageId` must parse to a UUID; otherwise the import throws.
- Every `pageUrlOverrides` / `pageUrlAdditions` URI must start with `/`.
- Every mapped value must be a valid Notion page ID.

If you add a new top-level URL mapping and the build fails early, check the error message from `cleanPageUrlMap` — it tells you which entry is bad.
