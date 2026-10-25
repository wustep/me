---
name: playground-entry
description: Add a Playground entry to this site — registry wiring, entry page, link preview, and (for entries on the grid) an animated SVG cover picked from a four-variant exploration, plus text variants for the entry copy, all picked by the user. Use whenever the user wants to add a project, demo, game, experiment, or guide to the playground, wants a new or reworked cover for an existing entry, or says anything like "add X to the playground", "make a cover for X", or "animated cover photo". For a cover-only refresh, skip the registry/page steps and start at "The cover".
---

# Playground entry + animated cover

A playground entry is up to four pieces:

1. **Registry entry** — a `PlaygroundEntry` in `playground/registry.tsx`. The
   registry is the single source for the `/playground` grid, the sidebar, and
   each entry page's `<head>`: `PlaygroundHead` (rendered by
   `PlaygroundLayout`) looks the entry up by `url` and emits title,
   description, canonical URL and share card. Pages never hand-write `<Head>`.
2. **Page** — `pages/playground/<slug>.tsx`.
3. **Cover** (grid entries only) — `components/wustep/<Name>Cover.tsx` +
   colocated `.module.css`.
4. **Link preview** — a 1200×630 PNG in `public/og/playground/`, optionally
   with a looping og video.

**Grid or sidebar-only? Decide first.** The grid
(`pages/playground/index.tsx`) shows only entries with a `CoverComponent` or
an `image`. It skips `disabled` entries and `ownerOnly` ones outside owner
mode, and sorts by `date`, newest first. An entry with neither field is
**coverless**: it's listed in the sidebar only, not on the grid. Today that's
Jamming, Jev Playground, Maths and every Guide. A coverless entry skips the
cover workflow: do Steps 0–3 and stop. If the user hasn't said which, ask
before building four covers for something meant to live in the sidebar.

The cover is the deliverable that needs taste, so it gets a structured workflow:
build **four genuinely different concepts**, show them running in the real card,
let the user pick, then ask **specific** improvement questions about the winner.
Don't skip to one cover even if you love your first idea — the variants exist
because the user's taste, not yours, decides, and comparison is how they find
out what they want. The entry copy gets the same treatment in miniature: draft
**text variants** (see "Text variants") and let the user pick a voice.

## Step 0 — absorb the project

A good cover is a caricature, not a screenshot: one scene, one motion idea,
drawn from the project's own visual language. Before designing anything:

- **Local repo?** Read its README/PRODUCT.md and skim the rendering/UI code for
  the real palette (hex values), signature objects, and mascots/characters.
  Authentic colors matter — the cover should look like it escaped from the app.
- **Live URL?** Open it in the Browser pane and screenshot the money shot
  (home screen, mid-game, whatever the project's best face is).
- Distill into notes: a 4–8 color palette, 2–3 signature objects, and the
  **one moment** hover should play (a run starting, a balloon bursting, a note
  rising). One moment — covers that animate everything read as noise.

For a coverless entry, gather just enough to write the copy and pick the
section.

## Step 1 — registry entry

Add the entry to the right section of `playgroundSections`, in the order it
should appear in the sidebar (the grid orders by `date` instead):

- **Experiments**, **Games**, **Visualizations** — projects, usually with a
  cover.
- **Guides** — walkthroughs and references (Nord Stage 4, EP-133 K.O. II),
  coverless. A Guide may point outside `/playground`: Prompting's `url` is
  `/prompting`.

Fields (see the `PlaygroundEntry` type):

- `title`, `url: '/playground/<slug>'` — required. `PlaygroundHead` finds the
  entry by `url`, so it must equal the page path exactly.
- `description` — required. Full sentence(s), shown in the sidebar About
  panel and used as the meta and og description. May contain
  `[text](href)` links: the About panel renders them and the card's
  `summary` fallback flattens them, but the meta and og description get the
  raw markdown, so keep links out of entries that will be shared. If an AI
  pair-built the project, credit it in a short closing sentence, the way
  existing entries do ("Fully vibe coded with Cursor & Claude 3.5
  Sonnet."). Which phrasing ships is a text-variant decision (below).
- `summary` — short line for the card body (falls back to the plain
  `description`); the card looks best when it fits one line.
- `date: 'Oct 2026'`, `year: '2026'` — `date` sorts the grid, newest first;
  `year` shows beside the sidebar item.
- `source` — the **Source** link in the sidebar About panel. Use the GitHub
  repo when it's public (`https://github.com/wustep/<repo>`). When the repo
  is private, link the deployed app instead (StageBench, Nord Stage 4,
  EP-133 K.O. II), never a GitHub URL that 404s for visitors. Leave it out
  for projects that live in this repo (Lenses, MIDI Visualizer, Prompting).
- `article` — site path of a companion write-up, if one exists. Shows as an
  Article link in the sidebar About panel and as an icon chip on the card.
- `starred: starRank('<title>')` — optional; stars the entry and pins it to
  the top of its own sidebar section (not a separate group). Add the title to
  `starredOrder` in `playground/starred.ts`, which keeps Contraptions above
  StageBench above Lenses. The grid ignores it and stays sorted by `date`.
- `x` — URL of a companion X post; same treatments as `article`.
- `CoverComponent` — the animated cover. Wire the recommended variant now,
  swap after the pick. Puts the entry on the grid.
- `image` — a static cover in `public/playground/covers/`. Also puts the
  entry on the grid; with a `CoverComponent` the grid renders the component
  and `image` only feeds the link preview (Step 3).
- `ogImage` — `'/og/playground/<slug>.png'`, the 1200×630 link-preview card
  (Step 3).
- `gradient` — Tailwind stops (`'from-… via-… to-…'`) matching the cover's
  palette. The grid paints it only for a card with no `CoverComponent` or
  `image`, which the coverless filter now keeps off the grid, so it's
  optional; existing covered entries set it to keep the palette on record.
- `ownerOnly` — hidden from the grid and sidebar unless owner mode is on
  (`/owner`). Navigation only, not access control: the URL still works.
- `disabled` — greyed out in the sidebar and left off the grid.

## Step 2 — page

Every page wraps its content in `PlaygroundLayout` with `title` and
`breadcrumbs={[{ label: '<Title>' }]}`.

- **External deployment** (most entries) — a full-frame iframe; copy
  `pages/playground/jamming.tsx`. `fullFrame` lets the iframe fill the frame,
  and `openHref={APP_URL}` adds the header's "open in its own tab" action.
  The iframe gets `className='flex-1 w-full border-0'`, `loading='lazy'`,
  `allowFullScreen`, and an `allow` list for what the app uses
  (`'autoplay *; fullscreen *'`, plus `midi *` for Jamming). Games that
  capture arrow keys/space inside an iframe still scroll the host page in
  some browsers, so always set `openHref` for a game.
- **Built in this repo** — render the component directly in a `fullFrame`
  layout; see `pages/playground/midi-visualizer.tsx`, which loads its heavy,
  client-only component through `next/dynamic` with `ssr: false`.

`PlaygroundLayout` also takes `shareImage` and `shareVideo` (Step 3), and a
`description` that only matters for pages outside the registry.

## Step 3 — link preview

`PlaygroundHead` picks the og:image in this order (rules in
`lib/playground-meta.ts`, unit-tested in
`lib/__tests__/playground-meta.test.ts`):

1. a `shareImage` passed to `PlaygroundLayout` (an absolute URL; the index
   passes its og-video poster);
2. the entry's `ogImage`;
3. its `image`, only if it's a PNG or JPEG (unfurlers don't reliably render
   SVG or WebP);
4. the shared Playground card, `public/og/playground.png`.

- **Card**: commit a 1200×630 PNG at `public/og/playground/<slug>.png` and
  set `ogImage: '/og/playground/<slug>.png'`, unless `image` is already a
  1200×630 PNG/JPEG (Things relies on its `image`). The app's money shot or
  the cover's rest pose both work. A coverless entry may skip this and share
  the Playground card, as all of them do today.
- **Video** (optional): commit `public/playground/og/<slug>.mp4` (1200×630,
  H.264, silent loop) and pass
  `shareVideo={shareVideo('playground/og/<slug>')}` (from
  `@/lib/share-card`) to `PlaygroundLayout`, as `dom-ino.tsx` does. It adds
  `og:video*` tags alongside the og:image, never instead of it, so the card
  is still required. `dom-ino.mp4` was recorded in the DOM-ino repo; the
  index clip comes from `scripts/og-video/record-playground.mjs` (see
  `scripts/og-video/README.md`).

**Coverless entry? You're done after this step:** run `pnpm typecheck` and
`pnpm test`, then check that the entry shows in its sidebar section with its
`year`, that the About panel shows the description and links, and that it
is not on the grid.

## The cover — anatomy

Study one existing cover before writing your own; they encode the house style:

- `StageBenchCover` — hover "starts a run"; paused-timeline idiom; fixed-viewBox scene on a stage background.
- `MidiVisualizerCover` — DOM (not SVG) bars + keys, synced keyframe loops, container queries.
- `LensesCover` — apply-on-hover idiom (exact rest pose), gaze/blink choreography.

Rules that hold across all of them:

- **Card geometry**: covers render in a 16:9 box (`aspect-video`), roughly
  300–620px wide on the grid, top corners rounded by the card. Draw the scene
  as one **fixed-viewBox SVG** on a `.cover` background (gradient/color),
  either as an extra-wide stage with `preserveAspectRatio='xMidYMid slice'`
  (preferred; see "Preview harness") or with `meet`, where the background
  absorbs the letterboxing at varying widths. Never let `meet` letterbox
  against a mismatched background.
- **Decorative**: wrapper div gets `aria-hidden='true'`. No text alternatives
  needed — the card title below carries the semantics.
- **Unique ids**: SVG `defs` ids collide across card instances. Use
  `const uid = useId().replaceAll(':', '')` and an `id(name)` helper (colons
  break `url(#…)` references).
- **SVG text** sizes in viewBox units so it scales with the scene.
- **Comment density**: match the house style — every non-obvious geometry or
  timing constant gets a why-comment (read `StageBenchCover.module.css` for
  the register).

### Motion

The rest pose is a complete, designed frame — the cover must look finished
with zero animation. Hover/focus brings it to life. Two house idioms:

**Paused timeline** (StageBench, MidiVisualizer) — declare everything up
front, paused; hover resumes. Hovering out freezes mid-flight, hovering back
resumes — feels like a machine you switch on:

```css
.thing {
  animation: doThing 2.8s linear infinite;
  animation-play-state: paused;
}
@media (hover: hover) {
  :global(.group):hover .cover *,
  .cover:hover * {
    animation-play-state: running;
  }
}
:global(.group):focus-within .cover *,
.cover:focus-within * {
  animation-play-state: running;
}
/* Touch: play while this cover holds the grid's spotlight. */
@media (hover: none) {
  :global([data-cover-awake]) .cover * {
    animation-play-state: running;
  }
}
```

**Apply-on-hover** (LensesCover) — animation assigned only under hover/focus
selectors; restarts from 0% each entry. Use when the rest pose must be exact
(the paused idiom rests wherever the timeline stopped).

Either way:

- `:global(.group)` targets the card `<Link>` on `/playground`; also keep the
  plain `.cover:hover` so the cover animates anywhere it's rendered. The
  `:focus-within` mirror is what keyboard users get — never omit it.
- Gate hover selectors behind `@media (hover: hover)` so touch devices don't
  stick mid-animation after a tap.
- **Touch** can't hover a card that is one big link, so on `(hover: none)`
  screens `useSpotlightCover` (`pages/playground/index.tsx`) sets
  `data-cover-awake` on the one cover cell nearest the middle of the
  viewport (if at least half visible). Mirror the hover rule under
  `:global([data-cover-awake])` inside `@media (hover: none)`, as above.
- One shared loop duration (with per-element `animation-delay` staggers) keeps
  a multi-part scene in sync and makes retiming a one-number edit.
- A subtle **ambient** loop (always running) is allowed when the card earns it
  — `CoverCell` on the index pauses off-screen animations globally
  (`[data-animations-paused] *`), so idle covers don't burn paint. Keep
  ambient motion gentle; the hover moment should still be the payoff.
- **`prefers-reduced-motion: reduce`** → `animation: none !important` on every
  animated class, and force a static pose that still sells the card (opacity/
  transform overrides, not just frozen randomness).

## Four variants

Build the concepts as sibling components so they can be compared honestly:

- Files: `<Name>CoverA.tsx` / `B` / `C` / `D`, each with its own
  `.module.css`, each headed by a doc comment naming the concept in one line.
- The variants must differ in **concept** — different scene, composition, or
  motion story. Four palette tweaks of one idea is a wasted comparison.
  A reliable spread: (1) a **gameplay vignette** (the app mid-action, in
  miniature), (2) a **brand/poster treatment** (wordmark, OG-image energy),
  (3) a **signature-mechanic close-up** (the one interaction, made huge),
  (4) a **wildcard** that breaks from the other three — the making-of story
  (e.g., the prompt that vibe-coded it), a motif blown up into pattern, or
  the app's own home screen reimagined.
- Reuse the project's real palette in all four; vary everything else.
- Grid-based scenes earn their credibility from alignment: snap props and
  characters to tile centers and keep blast/effect lines on the grid axes —
  eyeballed placement reads as a bug at card size.

## Text variants

While the covers render, draft the words the same way — 2–3 options each for:

- the `summary` (card line), and
- the `description` closer, especially the attribution sentence when an AI
  pair-built the project ("Fully vibe coded with…", "Built with Claude …").

Apply the strongest option to the registry immediately so nothing sits empty,
and present the alternatives in the same AskUserQuestion as the cover pick —
copy is cheap to swap and users often have a stronger opinion about voice
than about art.

### Preview harness

`pages/playground/covers-preview.tsx` is a **persistent, dev-only workbench**:
one tab per project (see the `tabs` array), each rendering covers inside the
real card markup at 420px, 620px, and a wide 880px stress test — the cover
box height is pinned (~190px) while its width varies ~300–900px, so wide is
where covers break. Design covers as an extra-wide stage (wider than any
card, action centered, expendable filler in the wings) with
`preserveAspectRatio='xMidYMid slice'`, so the full height always fits and
wide cards just reveal more stage. Its `getStaticProps` returns `notFound`
in production — keep that guard.

- **New exploration**: add a tab for the project whose `covers` array lists
  all four variants (label + one-line hover hint each).
- **After finalize**: reorder that tab's `covers` to the shipped component
  first, relabel the rest "(unshipped)" — the losing variants stay in the
  repo and on the tab so the comparison record survives the pick.
- The preview cards are anchors (like the real card `<Link>`), so
  hover/focus-driven cover animations behave identically; the self-`href`
  keeps them focusable without navigating.

### Verify before presenting

1. `preview_start` the `me-dev` server, open `/playground/covers-preview`.
2. Console clean; hover each card (`computer` hover) and confirm the motion
   actually plays; screenshot each variant at rest **and** mid-animation.
3. Check both themes if the cover backgrounds differ from the card surface.
4. Eyeball the reduced-motion block: does the forced pose look intentional?

## Present and ask

Leave the Browser pane on the harness so the user can hover the real thing.
In chat, give each variant one line: concept + what hover does. Then
`AskUserQuestion`:

- **Q1: which variant?** Options A/B/C/D with your recommendation first,
  marked "(Recommended)" — say why in the description. The user can
  multi-pick or reject all; "Other" is free.
- **One question for the text variants** — summary/description options from
  the "Text variants" step, quoted verbatim so the user picks exact words.
- **Q2 (+Q3): improvement questions.** These must be *specific to what you
  built* — surface the real judgment calls you weren't sure about (pacing:
  "burst on hover instantly, or keep the 1s fuse?"; density: "keep all six
  characters or feature two?"; palette: "meadow green or the cream poster
  background?"; idle pose: "should the rest frame show the splash frozen or
  pre-burst?"). Generic "any feedback?" questions are banned — the point is to
  hand the user decisions they can actually make from looking at the preview.

Iterate on the winner until the user is happy (small rounds: apply, refresh
harness, re-ask only if a genuine fork remains).

## Finalize

1. Rename the winning files to `<Name>Cover.tsx` / `.module.css`. Keep the
   losing variants (mark their doc comments "Unshipped variant, kept for the
   covers-preview workbench") and reorder the project's harness tab: shipped
   first, unshipped after.
2. Wire `CoverComponent` (and a `gradient` matching its palette) in the
   registry.
3. Link preview per Step 3, if not done yet.
4. `pnpm typecheck` and `pnpm test` (lint, Prettier and unit tests; match
   Prettier's formatting: single quotes, no semis).
5. Reload `/playground`: entry sorted right, cover animates on hover, card
   body reads well at one line, nothing overflows. Then open the entry page
   and check its `<head>`: registry title and description, and the og:image
   you expect from Step 3.
