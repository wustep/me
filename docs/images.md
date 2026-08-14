# Images

Three somewhat-tangled concerns: **preview images (LQIP)**, **social/OG images**, and the **signed-URL expiration fix**. Covered separately below.

## Signed-URL expiration fix

Notion serves user-uploaded images via short-lived signed URLs (`*.amazonaws.com`, and now `file.notion.com`). If we cache a record map that contains these URLs, the URLs expire (~1h) and images 404 until the next ISR revalidation. Passing `file.notion.com` through `next/image` (PR #21) also leaves HEIC uploads as raw `.heic` files, which most browsers cannot display.

### Fix

[`lib/notion.ts`](../lib/notion.ts) drops expiring signed hosts from `recordMap.signed_urls` after every `getPage` fetch (see [`lib/signed-file-urls.ts`](../lib/signed-file-urls.ts)). `react-notion-x` then falls back to the unsigned `attachment:` / S3 source, which [`mapImageUrl`](../lib/map-image-url.ts) wraps in Notion's image proxy. That proxy stays valid and converts HEIC → JPEG.

`www.notion.so/image` now 302s to `img.notionusercontent.com`. `next/image` treats that redirect as an invalid upstream response, so Notion-proxied (and HEIC) srcs are rendered `unoptimized` and the browser follows the redirect.

Credit to the upstream S3-expiry approach: [transitive-bullshit/nextjs-notion-starter-kit#279](https://github.com/transitive-bullshit/nextjs-notion-starter-kit/issues/279#issuecomment-1245467818).

## Preview images (LQIP)

"LQIP" = Low-Quality Image Placeholder — a tiny blurred base64 data URI that's rendered instantly while the real image loads. Gives pages a smooth fade-in instead of a pop-in.

### Flow

1. `getPage` in [`lib/notion.ts`](../lib/notion.ts) calls `getPreviewImageMap(recordMap)` after fetching.
2. [`lib/preview-images.ts`](../lib/preview-images.ts) collects every image URL referenced by the page (via `notion-utils`' `getPageImageUrls`).
3. For each URL:
   - Check Keyv (Redis if enabled, in-memory otherwise) using a normalized URL as the cache key.
   - On miss: fetch the image bytes, run `lqip-modern` to produce `{ dataURIBase64, originalWidth, originalHeight }`, write to Keyv.
4. The resulting `PreviewImageMap` is attached to `recordMap.preview_images` and passed into `react-notion-x`.

Concurrency is limited to 8 at a time via `pMap`.

### Gated by config

Controlled by `isPreviewImageSupportEnabled` in [`site.config.ts`](../site.config.ts). When off, no preview images are generated and `recordMap.preview_images` stays undefined.

### Cache key

`normalizeUrl(url)` — strips query string and fragments so the same logical image always hits the same cache entry regardless of signed-URL variations.

### Why Redis matters here

LQIP generation is expensive: it downloads each image and runs a blur pipeline. Without Redis, the in-memory Keyv cache dies on every serverless cold start, so a cold instance regenerates preview images for every page it renders. With Redis, these survive across instances. The `REDIS_NAMESPACE` default of `preview-images` reflects this as the primary use case.

## Social / OG images

Dynamic Open Graph images generated per page via `next/og`.

### Endpoint

[`pages/api/social-image.tsx`](../pages/api/social-image.tsx) — runs on the Edge runtime.

- `GET /api/social-image?id=<pageId>` returns a 1200×630 PNG.
- Falls back to `rootNotionPageId` when no ID is passed.
- Bundles Inter SemiBold as a font blob (`lib/fonts/inter-semibold`).

### What it draws

Layered composition:

- Full-bleed cover image (from the page's `Social Image` property, falling back to `page_cover`, then `defaultPageCover`).
- Centered white card with:
  - Page title.
  - "Detail" line — published date for posts, otherwise author or domain.
- Top-left circular avatar (from the page's icon, falling back to `defaultPageIcon`).

### Page metadata extraction

`getNotionPageInfo()` pulls values out of the record map:

- `title` — from `getBlockTitle`.
- `image` — `Social Image` property → `page_cover` → `defaultPageCover`, checked for reachability with `ky.head` before use. Unsplash URLs get `?w=1200&fit=max` appended.
- `authorImage` — block icon if it's a URL, else `defaultPageIcon`.
- `date` — `Published` property, formatted as "Month YYYY" for posts only.
- Enforces `rootNotionSpaceId` — refuses to render OG images for pages in other workspaces.

### Where it's referenced

- `getSocialImageUrl(pageId)` in [`lib/get-social-image-url.ts`](../lib/get-social-image-url.ts) builds the URL.
- Used by `PageHead` for per-page OG tags.
- Used by `pages/feed.tsx` for RSS `<enclosure>`.

### Caching

Edge responses are cached by Vercel's CDN by default. No explicit `Cache-Control` is set, so the function may re-run more often than necessary — consider adding `s-maxage` here if it shows up as a hot path.

## Image URL mapping

[`lib/map-image-url.ts`](../lib/map-image-url.ts) wraps `notion-utils`' `defaultMapImageUrl`, which rewrites Notion image URLs (signed S3, notion proxy, attachment paths) into stable, fetchable URLs. The only local addition is a passthrough for `defaultPageIcon` / `defaultPageCover` so those are never rewritten. Used by `getPreviewImageMap`, `getNotionPageInfo`, and `NotionPage`.
