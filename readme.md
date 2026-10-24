# wustep.me

Source for [wustep.me](https://wustep.me), Stephen Wu's personal site. It is a
Next.js (Pages Router) app that serves two kinds of pages:

- **Notion-backed pages**: writing and project pages authored in Notion and
  rendered with [`react-notion-x`](https://github.com/NotionX/react-notion-x).
- **Custom Next.js pages**: the home page, `/playground`, `/prompting`,
  `/lenses`, `/design` and a few utility routes.

Started from
[transitive-bullshit/nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit).
Deeper notes live in [`docs/`](docs/README.md).

## Notion pages

- [`site.config.ts`](site.config.ts) holds the root Notion page and space IDs,
  the posts collection used for the RSS feed, the homepage posts-switcher
  block IDs, feature flags (`isPreviewImageSupportEnabled`, `isRedisEnabled`,
  `isSearchEnabled`), and URL mapping:
  - `pageUrlOverrides`: fixed paths for Notion pages (`/articles`, `/notes`,
    `/projects`, `/essays`, `/updates`, `/writing`).
  - `pageUrlAdditions`: inbound-only aliases for old slugs.
- Import settings from [`lib/config.ts`](lib/config.ts), which normalizes
  `site.config.ts` and env vars into typed exports.
- `pnpm notion:index` runs
  [`scripts/sync-notion-index.mjs`](scripts/sync-notion-index.mjs), which
  executes [`notion-index.config.ts`](notion-index.config.ts). It crawls the
  site map (rate-limited) and writes:
  - `lib/generated/notion-index.json`: canonical slug to page ID map.
  - `public/sitemap.xml`: skips pages marked External and `/design`.
  - `lib/generated/preview-images.json`: LQIP placeholders, when preview
    images are enabled. Kept as-is if generation fails.
- `prebuild` runs `notion:index`, so every `pnpm build` refreshes the index.
- [`pages/[pageId].tsx`](pages/[pageId].tsx) renders any Notion page through
  [`components/NotionPage.tsx`](components/NotionPage.tsx) with ISR
  (`revalidate: 1800`). In production it pre-renders every indexed page and
  override. In dev, or with `SKIP_NOTION_STATIC_BUILD=true`, it pre-renders
  nothing and renders on demand.
- `/` is the custom [`AboutPage`](components/AboutPage.tsx), not the Notion
  root. The root Notion page is served at `/updates` (and `/site`).
- Notion posts get generated link-preview cards from `/api/social-image`. The
  fixed-path index pages use committed cards from `public/og/` instead
  ([`lib/page-share-overrides.ts`](lib/page-share-overrides.ts)).
- A pnpm patch in [`patches/`](patches/) fixes `notion-client@7.10.0`. See
  [docs/customizations.md](docs/customizations.md#patches).

See [docs/architecture.md](docs/architecture.md),
[docs/routing.md](docs/routing.md) and [docs/caching.md](docs/caching.md).

## Playground (`/playground`)

A section of ordinary Next.js pages for experiments, games, visualizations and
guides. Most entries embed a separately deployed app in an iframe.

### Registry

[`playground/registry.tsx`](playground/registry.tsx) is the single source for
the grid, the sidebar and each entry's `<head>` metadata. It exports
`playgroundSections` (ordered sections of `PlaygroundEntry` items) and
`playgroundEntries` (the flattened list).

Sections, in sidebar order: **Experiments**, **Games**, **Visualizations**,
**Guides**. Guides holds walkthroughs (Nord Stage 4, EP-133 K.O. II) and links
to `/prompting`.

### Grid and sidebar

- **Grid** ([`pages/playground/index.tsx`](pages/playground/index.tsx)): shows
  only entries with a `CoverComponent` or an `image`. It skips `disabled`
  entries and `ownerOnly` entries (unless owner mode is on), and sorts by
  `date`, newest first.
- **Coverless entries** have neither field. They appear in the sidebar only
  (for example Jamming, Jev Playground, Maths and the Guides).
- **Sidebar** ([`PlaygroundSidebar.tsx`](components/wustep/PlaygroundSidebar.tsx)):
  lists every section in registry order with each entry's `year` (`ownerOnly`
  entries only in owner mode). Hovering or focusing an item shows its
  description, date and Article / Post / Source links in the About panel.
  `disabled` items are greyed out.
- **Layout** ([`PlaygroundLayout.tsx`](components/wustep/PlaygroundLayout.tsx)):
  sidebar, breadcrumbs, home/owner-mode/theme buttons, and an optional "open
  in its own tab" link (`openHref`). `fullFrame` lets an iframe fill the
  frame. The sidebar's open state is kept in `localStorage`.

### Covers

Animated covers are React components in `components/wustep/<Name>Cover.tsx`,
usually with a colocated `.module.css`, rendered in a 16:9 cell.

- **Rest**: each cover has a complete static pose.
- **Awake on desktop**: the animation runs on card hover or focus (gated
  behind `@media (hover: hover)`, with a `:focus-within` mirror).
- **Awake on touch**: on `(hover: none)` screens, `useSpotlightCover` sets
  `data-cover-awake` on the cover cell nearest the middle of the viewport
  (only if at least half visible). Covers style `:global([data-cover-awake])`
  to play.
- **Off screen**: `CoverCell` sets `data-animations-paused`, which pauses
  animations (`styles/globals.css`).
- **Reduced motion**: covers handle `prefers-reduced-motion`.
- **Workbench**: [`/playground/covers-preview`](pages/playground/covers-preview.tsx)
  compares cover variants inside real card markup. Dev only; it returns 404 in
  production.

### Link previews (og image and og video)

- [`PlaygroundHead`](components/wustep/PlaygroundHead.tsx) looks up the entry
  by path and emits title, description, canonical URL and the share card. No
  hand-written `<Head>` is needed.
- **Image order**: a `shareImage` passed to `PlaygroundLayout` (the index
  uses the og-video poster), then the entry's `ogImage` (a 1200×630 PNG in
  `public/og/playground/`), then its `image` if that is a PNG or JPEG, then
  the shared Playground card (`public/og/playground.png`). The entry rules
  live in [`lib/playground-meta.ts`](lib/playground-meta.ts) and are
  unit-tested.
- **Video**: `PlaygroundLayout` takes an optional `shareVideo`.
  `shareVideo('playground/og/<name>')` in
  [`lib/share-card.tsx`](lib/share-card.tsx) points at
  `public/playground/og/<name>.mp4` and emits `og:video*` tags alongside, not
  instead of, `og:image`.
- **Where the clips come from**:
  - `public/playground/og/playground.mp4` and its poster `playground.png`
    come from
    [`scripts/og-video/record-playground.mjs`](scripts/og-video/README.md).
    It restages the live `/playground` page as a 1200×630 card and records
    eight covers on a deterministic virtual clock. It needs `ffmpeg` and
    Playwright's Chromium:

    ```sh
    pnpm dev                                    # serves :6363
    node scripts/og-video/record-playground.mjs # writes public/playground/og/
    ```

    Flags: `--base`, `--out`, `--frames`, `--check-loop`.

  - `dom-ino.mp4` is recorded in the DOM-ino repo and copied in.

## Other sections

- **`/prompting`**: "How to talk to coding agents", a field guide with
  chapters `mindset`, `techniques`, `tree`, `colleague`, `equation`,
  `orchestration` and `recap`, plus `/prompting/present` (slides) and
  `/prompting/notes` (talk track). Code lives in
  [`components/wustep/prompting/`](components/wustep/prompting/).
- **`/lenses`**: a canvas deck of mental models, with a page per lens at
  `/lenses/<id>`.
  - Source of truth is
    [`components/wustep/lenses/lenses.md`](components/wustep/lenses/lenses.md).
    `pnpm lenses:sync` ([`scripts/sync-lenses.mjs`](scripts/sync-lenses.mjs))
    compiles every deck's `lenses.md` to `lenses.json` and checks that each
    deck has exactly 28 lenses. Never edit `lenses.json` by hand.
  - Model-authored decks (`fable`, `gpt`, `grok`, `haiku`, `opus`) live under
    `components/wustep/lenses/llms/<slug>/` and are served at
    `/lenses/llms/<slug>`.
  - `/api/lens-image` draws their share cards.
  - See [AGENTS.md](AGENTS.md) and [PRODUCT.md](PRODUCT.md).
- **`/design`**: internal tools: font pairer, blocks fixtures, social-card
  preview, theme tokens and favicons.
- **`/owner`**: turns on owner mode (signed cookie via `/api/owner-mode`) when
  `OWNER_MODE_SECRET` is set. `ownerOnly` hides entries from navigation; it is
  not access control.
- **`/contact`, `/privacy`**: static info pages.
- **`/feed`**: RSS built from the Notion posts collection. `/rss`, `/rss.xml`,
  `/feed.xml`, `/feeds` and `/feeds.xml` rewrite to it.
- **`/llms.txt`, `/openapi.json`, `/robots.txt`**: served from `pages/`.
  `robots.txt` allows crawling only when `VERCEL_ENV=production`.
- **API routes** (`pages/api/`): `social-image`, `lens-image`, `notion-file`
  (re-signs Notion file URLs), `owner-mode`, `search-notion` (returns 404
  while search is disabled), `site-markdown`, `tweet/[tweetId]`.

## Local development

Toolchain:

- [`mise.toml`](mise.toml) pins Node 22 and pnpm 10.34.5. CI uses these
  versions; run `mise install` to match.
- `package.json` declares `engines.node >=20` and
  `packageManager: pnpm@10.34.7`.

```sh
pnpm install          # also installs git hooks (simple-git-hooks)
pnpm dev              # http://localhost:6363
```

No env vars are needed for local dev: the site reads the public Notion
workspace configured in `site.config.ts`. For overrides, copy
[`.env.example`](.env.example) to `.env.local`. All of these are optional:

| Variable                                                                                      | Purpose                                                     |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `OWNER_MODE_SECRET`                                                                           | Enables `/owner` (at least 8 characters)                    |
| `NOTION_TOKEN_V2`, `NOTION_ACTIVE_USER`                                                       | Send Notion requests as a logged-in session if 403s persist |
| `NOTION_API_BASE_URL`                                                                         | Override the Notion API base URL                            |
| `REDIS_HOST`, `REDIS_PASSWORD`, `REDIS_USER`, `REDIS_URL`, `REDIS_NAMESPACE`, `REDIS_ENABLED` | Redis cache for preview images (off by default)             |
| `PORT`                                                                                        | Port used to build `host` locally                           |
| `NEXT_PUBLIC_SITE_CONFIG`                                                                     | JSON that overrides `site.config.ts` fields                 |
| `ANALYZE`                                                                                     | `true` enables `@next/bundle-analyzer`                      |
| `SKIP_NOTION_STATIC_BUILD`                                                                    | `true` skips Notion fetches at build time (CI)              |

When set, `OWNER_MODE_SECRET`, `NOTION_API_BASE_URL`, `REDIS_URL` and `PORT`
are format-checked at startup (`lib/validate-env.ts`).
`VERCEL_ENV` and `VERCEL_URL` come from Vercel. Full reference:
[docs/configuration.md](docs/configuration.md).

## Scripts

| Script                                          | What it does                                                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------------- |
| `pnpm dev`                                      | `next dev -p 6363`                                                            |
| `pnpm build`                                    | `next build`, after `prebuild` runs `pnpm notion:index`                       |
| `pnpm start`                                    | `next start`                                                                  |
| `pnpm notion:index`                             | Refresh the Notion slug index, sitemap and LQIP cache                         |
| `pnpm lenses:sync`                              | Regenerate every deck's `lenses.json` from `lenses.md`                        |
| `pnpm test`                                     | `run-p test:*`: `test:lint`, `test:prettier` and `test:unit`                  |
| `pnpm test:lint`                                | `eslint .`                                                                    |
| `pnpm test:prettier`                            | `prettier --check` on `**/*.{js,jsx,ts,tsx}`                                  |
| `pnpm test:unit`                                | `vitest run`                                                                  |
| `pnpm typecheck`                                | `tsc --noEmit`                                                                |
| `pnpm deploy`                                   | `vercel deploy`                                                               |
| `pnpm deps:upgrade`, `deps:link`, `deps:unlink` | Upgrade the Notion packages, or link/unlink `../react-notion-x`. No-ops in CI |

## Tests and CI

- **Unit tests**: Vitest in the Node environment
  ([`vitest.config.ts`](vitest.config.ts)). Files matching `*.test.ts`,
  `*.test.tsx` or `*.test.mjs`, currently in `lib/__tests__/` and
  `scripts/__tests__/`. Watch mode: `pnpm exec vitest`.
- **Lint**: ESLint flat config ([`eslint.config.js`](eslint.config.js)) on top
  of `@fisch0920/config`.
- **Format**: Prettier, using the `@fisch0920/config/prettier` config.
- **Git hooks**:
  - pre-commit runs `lint-staged`: Prettier and `eslint --fix` on staged
    `.ts`/`.tsx` files, and `lenses:sync` when a `lenses.md` is staged.
  - pre-push runs `pnpm typecheck`.
- **CI** ([`.github/workflows/build.yml`](.github/workflows/build.yml)) runs on
  every push:
  1. Toolchain from `mise.toml`, then `pnpm install --frozen-lockfile`.
  2. `pnpm test`, then `pnpm typecheck`.
  3. `pnpm lenses:sync`, failing if anything under
     `components/wustep/lenses/` changes.
  4. `pnpm exec next build` with `SKIP_NOTION_STATIC_BUILD=true`. This skips
     the Notion crawl and static Notion pages, so the build runs offline.

## Project structure

```
components/   React components
  wustep/       site-specific: playground layout, sidebar and covers, lenses/, prompting/
  ui/           shadcn/Radix primitives
  notion/       react-notion-x block overrides (code, collection, equation)
  design/       /design workbench pieces
docs/         notes on architecture, routing, config, caching, images, styling
icons/        social icon components
lib/          config, Notion client and caching, routing, share cards, hooks
  generated/    notion-index.json and preview-images.json (from notion:index)
  __tests__/    unit tests
pages/        Next.js routes (Notion catch-all, playground, prompting, lenses, design, api)
patches/      pnpm patch for notion-client
playground/   registry.tsx: playground entries and sections
public/       static assets: og/ share cards, playground/ covers and og videos, midi, giscus themes
review/       before/after screenshots
scripts/      sync-notion-index, sync-lenses (+ parse-lenses), og-video/
styles/       global CSS (globals, notion, wustep, prism theme, applause)
.claude/      agent skills (playground-entry, llm-lens-deck)
```

Top-level config: `site.config.ts`, `notion-index.config.ts`, `next.config.js`,
`middleware.ts`, `vercel.json`, `mise.toml`.

## Deploy

The site deploys on Vercel.

- [`vercel.json`](vercel.json) only sets the install command
  (`npx --yes pnpm@10.12.1 install --frozen-lockfile`).
- Per the CI workflow, production builds on Vercel run the full `pnpm build`,
  so they crawl Notion first. `next.config.js` renders static pages one at a
  time to stay under Notion's rate limit.
- [`middleware.ts`](middleware.ts) runs on page routes (not `_next/`, `api/`,
  or paths with a file extension):
  - When the `Accept` header prefers `text/markdown`, it rewrites the request
    to `/api/site-markdown`, passing the original path in `x-markdown-path`.
  - Otherwise it passes the request through and adds `Vary: Accept`.
- `next.config.js` also defines redirects (`/about` to `/`, and
  `/articles/:slug`, `/projects/:slug`, `/notes/:slug` to `/:slug`) and the
  feed rewrites.

## Adding a playground entry

The [`playground-entry`](.claude/skills/playground-entry/SKILL.md) skill
covers the full cover-design workflow. The short version:

1. **Page.** Create `pages/playground/<slug>.tsx` and wrap it in
   `PlaygroundLayout` with `title` and `breadcrumbs`.
   - For an external app, use an iframe with `fullFrame` and
     `openHref={APP_URL}` (copy
     [`jamming.tsx`](pages/playground/jamming.tsx)).
   - For a local component, render it directly (see
     [`midi-visualizer.tsx`](pages/playground/midi-visualizer.tsx)).
2. **Registry entry.** Add a `PlaygroundEntry` to the right section in
   `playgroundSections`:

   | Field                     | Notes                                                                                             |
   | ------------------------- | ------------------------------------------------------------------------------------------------- |
   | `title`, `url`            | Required. `url` is the page path; the head metadata is looked up by it                            |
   | `description`             | Required. Sidebar About panel and meta description; may contain `[text](href)` links              |
   | `summary`                 | Card body line; falls back to the plain `description`                                             |
   | `date`, `year`            | `date` is `'Oct 2026'` style and sorts the grid; `year` shows beside the sidebar item             |
   | `source`, `article`, `x`  | Source repo or app URL, companion article path, X post URL. `article` and `x` also add card chips |
   | `CoverComponent`, `image` | Either one puts the entry on the grid; with neither it is sidebar-only                            |
   | `gradient`                | Tailwind `from-… via-… to-…` stops, the card's fallback background                                |
   | `ogImage`                 | 1200×630 PNG under `public/og/playground/`; needed when `image` is SVG/WebP or absent             |
   | `ownerOnly`               | Hidden from the grid and sidebar unless owner mode is on (not access control)                     |
   | `disabled`                | Greyed out in the sidebar and left off the grid                                                   |

3. **Without a cover**, stop here. The entry is sidebar-only, which is how the
   Guides are listed. A Guides item may point outside `/playground` (Prompting
   links to `/prompting`).
4. **With a cover**, add `components/wustep/<Name>Cover.tsx` and
   `.module.css`, then set `CoverComponent`. The grid renders it in place of
   `image`, which then only matters for the link preview.
   - Give it a finished rest pose.
   - Play on hover/`:focus-within` and on `[data-cover-awake]`.
   - Handle `prefers-reduced-motion`.
   - Check it in `/playground/covers-preview`.
5. **Link preview.** Commit an `ogImage` PNG, or rely on a PNG/JPEG `image`.
   For a video, commit `public/playground/og/<name>.mp4` (1200×630 H.264) and
   pass `shareVideo={shareVideo('playground/og/<name>')}` to
   `PlaygroundLayout`.
6. **Check.** Run `pnpm typecheck` and `pnpm test`.

## Credits and license

Based on
[nextjs-notion-starter-kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
by Travis Fischer, built on
[react-notion-x](https://github.com/NotionX/react-notion-x). The upstream
README is kept as [readme-origin.md](readme-origin.md), and
[contributing.md](contributing.md) covers local development and linking
against `react-notion-x`.

MIT. See [license](license).
