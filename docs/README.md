# Docs

Notes on how this site works. Each doc is focused on a single concern and links to the relevant source files.

- [architecture.md](architecture.md) — high-level overview of how data flows from Notion to the browser
- [routing.md](routing.md) — how a URL becomes a Notion page, including `pageUrlOverrides` and canonical slugs
- [configuration.md](configuration.md) — `site.config.ts`, `lib/config.ts`, and env vars
- [caching.md](caching.md) — ISR, CDN headers, in-memory caches, Redis, and Notion client retry/rate-limit
- [images.md](images.md) — preview images (LQIP), social/OG images, and the signed-URL fix
- [development.md](development.md) — local setup, commands, debugging tips
- [styling.md](styling.md) — CSS file structure, Tailwind/shadcn vs. the Notion stylesheet
- [customizations.md](customizations.md) — this site's extensions on top of nextjs-notion-starter-kit

Start with `architecture.md` if you're new to the repo.
