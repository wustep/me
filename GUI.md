# GUI.md: wustep.me design system

How to build interface on this site so it stays consistent with everything else here. It's written for agents and humans. The tokens live in [`styles/tokens.css`](styles/tokens.css). This file explains when to use each one.

> **Status: draft.** This first pass maps and consolidates the tokens that already exist. It is expected to be reconciled with a Graphical (graphicalui.com) GUI.md and token set. When that happens, keep the token names below stable where you can and change the values.

## Principles

1. **Refine, don't redecorate.** The site is mostly reading: essays, notes, a résumé. The interface should make it easier to read the words and never compete with them. Color is rare and earned.
2. **Two voices.** Crimson Pro carries ideas: names, titles, prose on the About page. Inter carries the interface: navigation, metadata, Notion body text, controls. Don't swap their jobs.
3. **Warm paper, soft ink.** The default palette (Paper) is a barely-warm off-white with warm-gray ink. It extends cues the site already had: the peach glow on the About page, the amber Lenses accent, and Notion's own `#37352f` ink.
4. **One token, one decision.** Pick the semantic token (`--ui-text-muted`), not a hex code and not a palette step (`--gray-7`). If no token fits, add one to `tokens.css` and document it here before using it.
5. **Accessible by default.** Every text token passes WCAG AA on `--ui-bg` and `--ui-surface` in all presets, light and dark. Focus is always visible, and motion has a reduced-motion fallback.

## Token layers

```
scales (theme-independent)   --type-*, --space-*, --radius-*, --stroke-*, --icon-*, --duration-*, --ease-*, --spring-*, --state-*
palette (per preset)         --gray-0…11, --gray-dark-0…11, --accent-*, --glow-*, --shadow-tint      ← never use directly
semantic (light/dark aware)  --ui-*, --elevation-*, --glow                                          ← use these
```

Legacy namespaces still exist and now **alias** the semantic layer, so they follow the active preset and dark mode automatically:

| Namespace | Owner | Now points at | Why it still exists |
|---|---|---|---|
| `--w-*` | `styles/wustep.css` | `--ui-*` | Notion track and the `/design/theme` preview override these names |
| `--about-*` | `AboutPage.module.css` | `--ui-*` / `--w-*` | `/design/theme` preview |
| shadcn (`--background`, `--foreground`, `--border`, …) | `styles/globals.css` | `--ui-*` | Tailwind utilities and `components/ui/` |
| react-notion-x (`--fg-color`, `--bg-color`) | `styles/wustep.css` | `--ui-*` | Notion-rendered content |
| `--dw-*` | `styles/globals.css` | (unchanged) | `/design` workbench chrome, which is fixed-light on purpose |

> **Namespace gotcha.** Tailwind v4 reserves `--color-*`, `--text-*`, `--shadow-*`, `--leading-*`, `--tracking-*`, `--font-*` and `--radius-*` for its theme. Unlayered `:root` variables with those names silently restyle Tailwind utilities. That's why the semantic colors are `--ui-*`, the type scale is `--type-*`, and the shadows are `--elevation-*`. `--radius-*` is shared on purpose: `@theme inline` inlines its values, so ours only affect `var()` readers.

> **Dark-mode gotcha.** A custom property's `var()` resolves on the element where it is declared. An alias such as `--x: var(--ui-text)` declared only on `:root` freezes the light value, and `body.dark-mode` inherits it. Declare aliases on `:root, .dark-mode`, or on a component's own selector. See the last block of `tokens.css`.

## Color

### Presets

Presets are set with `html[data-theme-preset]`. To switch, open any page with `?theme-preset=paper|graphite|ink`; the choice persists in localStorage under `w-theme-preset`. `?theme-preset=default` clears it. The noflash script in `pages/_document.tsx` applies the attribute before first paint.

| Preset | Character | Canvas (light / dark) | Accent | Status |
|---|---|---|---|---|
| **Paper** | warm neutrals, amber accent | `#fdfcfa` / `#100f0e` | `#c2701f` (ink `#9a5313`) | **default** |
| Graphite | today's pure neutrals, cleaned into a ramp | `#ffffff` / `#0d0d0d` | `#2a63d4` | candidate |
| Ink | cool paper, higher-contrast ink, deep green | `#fbfbf9` / `#0b0d0c` | `#2e7454` | candidate |

### Semantic roles

| Token | Use | Don't |
|---|---|---|
| `--ui-bg` | page canvas | use for cards (use surface or a border) |
| `--ui-surface` / `--ui-surface-hover` | callouts, resting cards, hover rows | stack more than two surface levels |
| `--ui-surface-raised` | menus, popovers, segmented thumbs | use without `--elevation-*` and a hairline |
| `--ui-text` | headings, names, primary UI | |
| `--ui-text-body` | long-form Notion body text (a hair softer) | use for UI labels |
| `--ui-text-secondary` | secondary copy that still has to be read | |
| `--ui-text-muted` | dates, meta, captions (AA ≥ 4.9:1) | use for anything interactive on its own |
| `--ui-text-faint` | decorative glyphs and separators (`·`) | carry information (≈3.4:1, fails AA for text) |
| `--ui-border` / `--ui-border-strong` | opaque card and input borders | |
| `--ui-divider` / `--ui-divider-strong` | translucent hairline rules that sit on any surface | |
| `--ui-accent` | icons, rules, focus rings, small marks | set body-size text in it (use `--ui-accent-text`) |
| `--ui-accent-text` | accent used as text or links | |
| `--ui-accent-fill` + `--ui-on-accent` | filled buttons | use `--ui-accent` as a fill under white text (Paper amber is 3.7:1) |
| `--ui-accent-soft` | tinted backgrounds, selected rows | |
| `--ui-success|warning|danger|info` (+ `-soft`) | status text, icons, badges | use for decoration or branding |
| `--ui-focus` | focus outlines | |
| `--ui-selection` | `::selection` | |
| `--ui-hover-overlay` / `--ui-press-overlay` | translucent hover/press wash over any surface | |

Accent budget: **at most one accent moment per viewport**, such as a focus ring, an active nav item, or one link style. Notion's colored text and backgrounds (`.notion-*_background`) belong to the author's content and are not part of the UI palette.

## Typography

Families are loaded by `next/font` in [`lib/fonts/fonts.ts`](lib/fonts/fonts.ts) and are fixed: **Crimson Pro** (400, 600, plus italics) and **Inter** (400, 500, 600). `font-synthesis` is off, so any other weight (e.g. 550) snaps to the nearest loaded file. Don't request weights that aren't loaded. Don't introduce other display faces.

| Token | rem / px | Typical use |
|---|---|---|
| `--type-size-2xs` | 0.6875 / 11 | kbd, tiny meta |
| `--type-size-xs` | 0.75 / 12 | uppercase section labels (with `--type-tracking-caps`) |
| `--type-size-sm` | 0.8125 / 13 | secondary UI, table meta, dates |
| `--type-size-md` | 0.9375 / 15 | default UI text |
| `--type-size-base` | 1 / 16 | Notion body (Inter) |
| `--type-size-lg` | 1.1875 / 19 | serif prose: Crimson sets small, so it steps up one size |
| `--type-size-xl` | 1.375 / 22 | serif card titles, h3 |
| `--type-size-2xl` | 1.75 / 28 | serif h2, site name |
| `--type-size-3xl` | 2.25 / 36 | serif h1 |
| `--type-size-4xl` | 2.75 / 44 | Notion page title |
| `--type-size-display` | clamp 40 → 56 | hero only, one per page |

- **Line height:** `--type-leading-tight` 1.15 for display, `-snug` 1.3 for headings, `-normal` 1.5 for UI, `-relaxed` 1.65 for long-form reading.
- **Tracking:** `--type-tracking-display` −0.02em for serif at 28px and up; `--type-tracking-tight` −0.01em for Inter at 22px and up; `--type-tracking-caps` +0.08em for uppercase labels only.
- **Headings** are Crimson Pro 600, upright. **No oversized italic serif headlines.** Italic is for emphasis inside prose.
- Use `tabular-nums` for dates and numbers in columns (the Experience list, for example).

## Space and layout

4px base. Use `--space-1` (4) through `--space-24` (96); the half steps `--space-0-5` and `--space-1-5` are for icon and text nudges. The legacy aliases (`--space-xs`…`--space-xxl`) map onto the same scale.

- Inside a component: 4, 8, 12, 16. Between components: 24, 32. Between page sections: 48 to 96.
- Reading column: `--measure-prose` (680px). Notion's own `--notion-max-width` is 720 or 900, set in `notion.css`.
- Phone side gutter: `--gutter-page` (24px) or more. Never let the page scroll horizontally.
- Control heights: `--control-h-sm` 28, `-md` 36, `-lg` 44. Anything tappable on touch needs a 44px hit area; pad it with a pseudo-element if the visual is smaller.

## Shape

| Token | px | Use |
|---|---|---|
| `--radius-xs` | 4 | inline highlights, tags, kbd, Notion button-links |
| `--radius-sm` | 6 | header breadcrumbs, small buttons, inputs |
| `--radius-md` | 8 | buttons, select pills, menus |
| `--radius-lg` | 12 | callouts, panels, segmented tracks |
| `--radius-xl` | 16 | gallery cards, media |
| `--radius-pill` | ∞ | pills, avatars, icon buttons |

- **Concentric rule:** inner radius = outer radius − the padding between them. A 12px track with 3px padding gets a 9px thumb.
- **Strokes:** `--stroke-hairline` (1px) for borders and dividers, `--stroke-strong` (1.5px) for selected and active outlines, `--stroke-focus` (2px) at `--focus-offset` (2px) for focus rings.
- **Elevation:** prefer a hairline border over a shadow. When something truly floats (menu, popover, dialog, a hovered card), use `--elevation-xs/sm/md/lg`. In light mode they are tinted to the preset (warm brown for Paper). In dark mode they're plain black and stronger, but pair them with `--ui-surface-raised` because shadows barely read on dark.

## Icons

- **Family:** [Lucide](https://lucide.dev) (`lucide-react`). It's already used across `components/` and `pages/`. Social marks live in `icons/SocialIcons.tsx`, and bespoke animated glyphs (the flask, the house) are inline SVG. FontAwesome remains only in `MidiVisualizer` and shouldn't spread.
- **Sizes:** `--icon-xs` 14, `--icon-sm` 16 (inline with UI text), `--icon-md` 20 (header and toolbar buttons), `--icon-lg` 24 (standalone).
- **Stroke:** `--icon-stroke` = 1.75 at 16–20px, which matches Inter's stem weight. Use 1.5 at 24px and up, and 2 at 14px.
- Icons take `currentColor`. They inherit text color and never get their own hex values. Icon-only buttons need an `aria-label`.

## Component states

Every interactive element defines all five states. They're layered, so a hovered and focused control shows both.

| State | Treatment |
|---|---|
| Rest | text or `--ui-text-muted` icon, no fill (or `--ui-surface`) |
| Hover | `--ui-hover-overlay` wash, or step the surface up one level; text goes to `--ui-text`. Gate it behind `@media (hover: hover)`. Animate in over `--duration-fast` with `--ease-hover`. |
| Press | `--ui-press-overlay` and/or `scale(var(--state-press-scale))`, `--duration-instant` |
| Focus-visible | `outline: var(--stroke-focus) solid var(--ui-focus); outline-offset: var(--focus-offset)`. Keyboard focus only. Never `outline: none` without a replacement. |
| Disabled | `opacity: var(--state-disabled-opacity)`, `cursor: not-allowed`, no hover |
| Selected / current | `--ui-accent-soft` fill or a `--stroke-strong` outline, plus `aria-current` / `aria-pressed` |

Cards may lift on hover (`translateY(var(--state-hover-lift))` with `--elevation-md`) but only when the whole card is the link.

## Motion

| Token | Value | Use |
|---|---|---|
| `--duration-instant` | 80ms | press feedback |
| `--duration-fast` | 160ms | hover color, small toggles |
| `--duration-base` | 240ms | popovers, segmented thumbs, small transforms |
| `--duration-slow` | 400ms | panels, card lift, icon flourishes, theme crossfade |
| `--duration-page` | 600ms | page fade-in |

| Easing | Use |
|---|---|
| `--ease-standard` | default for anything that moves |
| `--ease-enter` | elements arriving (decelerate) |
| `--ease-exit` | elements leaving (accelerate). Make exits ~75% the length of enters. |
| `--ease-hover` | short hover and press transforms |
| `--spring-snappy` (~300ms) | toggles, segmented controls; no visible overshoot |
| `--spring-gentle` (~500ms) | panels, cards settling |
| `--spring-bouncy` (~450ms) | playful moments only: applause, icon hops. About 4% overshoot. |

The older curves in `globals.css` (`--ease-out-quart/-quint/-expo/-snap/-swift/-smooth`) remain valid. `--ease-hover` is the same curve as `--ease-out-snap`.

Rules:

- Animate `transform` and `opacity`. Animate color only for hover and theme changes. Never animate layout properties (width, height, top).
- Everything in `prefers-reduced-motion: reduce` must still communicate the change. `wustep.css` already zeroes transitions and animations globally, so don't rely on motion to convey state.
- Motion should feel quick and quiet. If someone notices the animation itself, it's too much.

## Avoid

- Instrument Serif/Sans, Fraunces, Newsreader, Playfair, Recoleta, Geist (outside its existing tooling use), Bricolage Grotesque, Plus Jakarta Sans, Space Grotesk as interface or display type.
- Oversized italic serif headlines; purple or indigo gradients; glassmorphism; neon glows.
- Uniform SaaS card grids, gratuitous shadows, more than one accent per viewport.
- Hardcoded hex, px radii, or ms durations in new CSS. Reach for a token instead.

## Checklist for a UI change

- [ ] Uses `--ui-*` / `--type-*` / `--space-*` / `--radius-*` / `--duration-*` tokens, with no raw values unless a comment says why.
- [ ] Checked in light **and** dark mode, and in at least the default preset.
- [ ] Checked at 390px wide: no horizontal scroll, and 44px touch targets.
- [ ] Keyboard focus is visible, and every state in the table above is defined.
- [ ] Respects `prefers-reduced-motion`.
- [ ] Visual PRs include Before | After screenshots in the PR body.
