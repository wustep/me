# Agent guide

Notes for AI agents (and humans) working in this repo.

## Lenses (`components/wustep/lenses/`)

The Lenses deck is authored in **`lenses.md`** — that file is the source of
truth. Each lens is one `# Title` section with `key: value` metadata followed
by a markdown body (see the comment block at the top of `lenses.md` for the
full format).

- **Do not edit `lenses.json` directly** — it is generated from `lenses.md`,
  and any hand-edit will be overwritten on the next sync.
- After editing `lenses.md`, run `pnpm lenses:sync` to regenerate
  `lenses.json`. A pre-commit hook runs this automatically whenever
  `lenses.md` is staged, so the JSON is always committed in lockstep.
- `registry.tsx` imports `lenses.json` and assigns card positions; the
  markdown `body` string is rendered to React by `LensBody.tsx`.
- `scripts/sync-lenses.mjs` validates required fields and fails the commit on
  a malformed entry (missing field, bad `reading` line, duplicate `id`).
