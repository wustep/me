# Agent guide

Notes for AI agents (and humans) working in this repo.

## Design system

Read **[`GUI.md`](GUI.md)** before touching UI. Tokens live in
`styles/tokens.css`; use the semantic `--ui-*`, `--type-*`, `--space-*`,
`--radius-*` and `--duration-*` tokens rather than raw values.

## Lenses (`components/wustep/lenses/`)

The Lenses deck is authored in **`lenses.md`** — that file is the source of
truth. Each lens is one `# Title` section with `key: value` metadata followed
by a markdown body (see the comment block at the top of `lenses.md` for the
full format).

- **Do not edit `lenses.json` directly** — it is generated from `lenses.md`,
  and any hand-edit will be overwritten on the next sync.
- After editing any deck's `lenses.md` (the original deck, or a model deck
  under `llms/<slug>/`), run `pnpm lenses:sync` to regenerate every deck's
  `lenses.json`. A pre-commit hook runs this automatically whenever a
  `lenses.md` is staged, and CI fails if any deck's JSON drifts from its
  markdown.
- `registry.tsx` imports `lenses.json` and assigns card positions; the
  markdown `body` string is rendered to React by `LensBody.tsx`.
- `scripts/sync-lenses.mjs` validates required fields and fails the commit on
  a malformed entry (missing field, bad `reading` line, duplicate `id`).
