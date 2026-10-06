# wustep.me: local theme notes

This file covers what the Graphical guidance can't know about this app: where the theme lives, how modes and presets are wired, which fonts fill the kit's roles, and the exceptions and gaps found during conversion. Read [GUI.md](../GUI.md) first. Per the [theme contract](theme-contract.md), this file and [`styles/tokens.css`](../styles/tokens.css) take precedence over the downloaded [Untitled snapshot](themes/untitled.md).

## Where the theme lives

| Concern | Source |
| --- | --- |
| Token definitions (all literals) | `styles/tokens.css`, imported first in `pages/_app.tsx` |
| Color mode | `body.dark-mode`, toggled by `lib/use-dark-mode.ts`; set before first paint by the noflash script in `pages/_document.tsx` |
| Preset | `html[data-theme-preset]`, set before first paint from `?theme-preset=<name>` or localStorage `w-theme-preset` (`?theme-preset=default` clears it) |
| Fonts | `lib/fonts/fonts.ts` (next/font) sets `--font-sans` (Inter) and `--font-serif` (Crimson Pro) |
| Shared button | `components/ui/button.tsx`, which carries the kit's Button assignments |

**Mode-aware neutrals.** As in the kit, `--neutral-1` is the canvas in both modes and `--neutral-10` is the strongest ink. Light values sit on `:root` and dark values on `.dark-mode`. A non-default preset re-declares both, on `:root[data-theme-preset=…]` and on `:root[data-theme-preset=…] .dark-mode`.

**Derived tokens must be declared on `:root, .dark-mode`.** A custom property's `var()` resolves where it is declared. An alias declared only on `:root` freezes the light value, and `body.dark-mode` inherits that light value. The last block of `tokens.css`, and the alias blocks in `wustep.css` and `globals.css`, use both selectors for this reason.

## Aliases that remain (and why)

These older names resolve to the theme, so the pages that use them follow both mode and preset. Prefer the Graphical names in new code.

| Alias | Defined in | Resolves to | Why it stays |
| --- | --- | --- | --- |
| `--w-primary`, `--w-secondary`, `--w-background`, `--w-surface(-hover)`, `--w-divider(-hover)`, `--w-accent` | `styles/wustep.css` | `--cte-text`, `--cte-text-muted`, `--cte-canvas`, `--cte-surface(-muted)`, `--border-default-color` / `--neutral-10-transparent`, `--neutral-10` | ~80 Notion-track call sites; `/design/theme` previews by overriding exactly these names |
| `--about-*` | `components/AboutPage.module.css` (`.page`) | `--cte-*` / `--w-*` | `/design/theme` preview; also used by `SiteInfoPage` |
| shadcn `--background`, `--foreground`, `--border`, `--muted-foreground`, `--ring`, … | `styles/globals.css` | `--cte-*`, `--neutral-*` | Tailwind utilities and `components/ui/` |
| react-notion-x `--fg-color`, `--bg-color`, `--bg-color-1` | `styles/wustep.css` | `--neutral-9`, `--cte-canvas`, `--cte-surface` | Notion-rendered content |
| `--dw-*` | `styles/globals.css` | unchanged | `/design` workbench chrome, which is fixed-light on purpose |
| `--ease-out-*`, `--z-*` | `styles/globals.css` | unchanged | Existing per-component motion curves and the z-index scale; the kit has no z-index vocabulary |

**Tailwind v4 names.** Tailwind reserves `--color-*`, `--text-*`, `--shadow-*`, `--radius-*` and `--font-*` for its theme. The Graphical names used here (`--color-1`, `--radius-s`, `--shadow-m`, `--font-ui`) are not keys our utilities read, and `tokens.css` is unlayered, so it never competes with `@layer theme`. **Do not** rename shadcn's `--primary-foreground` into the kit's role. The kit's `primaryForeground` is `--primary-action-foreground` here, and it's exposed as `--cte-accent-text`.

## Fonts: kit roles on Crimson Pro and Inter

The snapshot names GT Standard M and Sidebar Geist Mono. Neither is adopted. The roles, weight names and fallback stacks are kept and mapped onto the two loaded families. Don't download, substitute or add font families.

| Role | Family | regular / medium / heavy | Use |
| --- | --- | --- | --- |
| `ui` | Inter | 400 / 500 / 600 | navigation, metadata, controls, Notion body |
| `brand` | Crimson Pro | 400 / 600 / 600 | site name, page and card titles, headings |
| `editorial` | Crimson Pro | 400 / 600 / 600 | long-form serif reading (About bio, contact) |
| `data` | system monospace | 400 / 500 / 600 | code, tabular figures (the kit's Geist Mono is not used) |

Inter 700 isn't loaded, so `heavy` is 600. Crimson Pro only loads 400 and 600, and `font-synthesis` is off, so brand and editorial `medium` resolve to 600. Never use oversized italic serif headlines; italic is for emphasis inside prose.

## Text steps (local values)

The kit's step names are kept. Their values are tuned for a reading site, where Untitled jumps 16 → 24 with nothing between:

| Step | Size / line | Tracking | Typical role |
| --- | --- | --- | --- |
| `xxs` | 11 / 16 | 0.01em | tiny meta |
| `xs` | 12 / 16 | 0 | uppercase section labels, notes, tooltips |
| `s` | 14 / 20 | 0 | work rows, card descriptions, dates |
| `m` | 16 / 24 | 0 | UI text, Notion body, buttons |
| `l` | 18 / 30 | 0 | serif prose, card titles |
| `xl` | 24 / 30 | -0.01em | site name, section titles |
| `xxl` | 44 / 48 | -0.02em | page titles |

## Presets (candidate configurations)

All three share the type, spacing and border scales. They differ in palette, shape, elevation and motion.

| | **Paper** (default) | Untitled | Ink |
| --- | --- | --- | --- |
| Character | warm paper, soft ink, amber | the downloaded Graphical snapshot | cool paper, crisp ink, deep green |
| Canvas light / dark | `#fdfcfa` / `#100f0e` | `#ffffff` / `#000000` | `#fbfbf9` / `#0b0d0c` |
| `color-1` light / dark | `#a85d17` / `#f0a85a` | `#e0e709` / `#f4f83b` | `#2e7454` / `#6fc39a` |
| Radius xs/s/m/l/xl | 4 / 6 / 8 / 12 / 16 | 3 / 6 / 9 / 17 / 26 | 2 / 4 / 6 / 8 / 12 |
| Elevation | realistic, warm-tinted | flat (all shadows at 0 opacity) | realistic, green-tinted |
| Motion | easing 160ms / 320ms | easing 150ms / 300ms | spring (bounce ≈ 0.15) 300ms / 500ms |
| Focus ring | `color-1` | 50% ink, the kit's `--focus-ring-outline` | `color-1` |
| Text on `color-1` | `neutral-1` (4.8:1) | `neutral-9` per the kit's `primaryForeground` (11.4:1) | `neutral-1` (5.6:1) |

Why Paper is the default:

- It keeps the site's personality. The warm canvas, the peach glow on the About page and the amber accent were already there; Paper names them and makes them consistent.
- Its soft corners fit the existing rounded cards.
- It changes the least visually while making everything token-driven.

Untitled is kept as a faithful reference to the downloaded kit. Its neon yellow and 26px corners read as a product UI rather than a personal reading site, and its status colors (`#76ef6b`, `#ff5263`) are fills that fail as text. Ink is the strongest alternative: it suits a sharper, more technical tone, but loses the warmth.

Every preset's `neutral-7` (muted text) and `neutral-10` (text) pass WCAG AA on `neutral-1` and `neutral-2` in both modes.

## Exceptions and gaps from the conversion

- **Caps tracking (gap).** Uppercase section labels use the `xs` step plus a local `letter-spacing: 0.08em`. The kit's per-step tracking has no role for uppercase text. If more caps labels appear, consider adding a theme-level caps tracking value deliberately.
- **Tooltip text step (exception).** The About page tooltip follows the kit's Tooltip popover treatment (inverted neutrals, radius `s`, shadow `s`, padding `xxs`/`xs`) but uses text step `xs`, not the kit's `m`. It labels cards rather than controls, and the inline variant has to fit on one line inside its 300px cap.
- **Lenses identity color (exception).** `--about-lenses-accent` stays `#c2701f` / `#f0a85a` in every preset. Each lens keeps its own color (PRODUCT.md).
- **Artwork (exception).** Playground and project covers (`components/wustep/*Cover*`), the lenses deck art, and the cover titles inside About project cards (`.domino`, `.lenses`, `.contraptions`, `.stagebench` headings) are illustrations with their own palettes and type.
- **Notion content (exception).** Colors the author chooses in Notion (`.notion-*_background`, `--notion-red` and so on) and react-notion-x's internal heading scale are content, not theme.
- **Data font (gap).** No licensed monospace is chosen; `--font-data` uses the system mono stack.

## Remaining conversion work (by owner)

These still contain literal radii, durations or colors that predate the kit. They're listed so a later pass can continue without repeating the inventory. Run `graphical-audit` scoped to one owner at a time.

- `styles/wustep.css`: posts view toggle (`10px` / `7px` radii, literal shadows), gallery card hover transitions, header button colors (`#09c772`, `#0f67cf`, `#2795e9`), callouts/select pills.
- `components/AboutPage.module.css`: card and icon-button radii and hover transitions outside the text roles converted here.
- `components/styles.module.css`, `Page404.module.css`, `SiteInfoPage.module.css`, `ThemeToggle`/`LabsButton`/`OwnerModeToggle` modules: literal durations and radii.
- `components/ui/` beyond `button.tsx` (input, sheet, sidebar, tooltip): still on shadcn classes, which now resolve to the theme through the aliases but don't yet carry the kit's component assignments.
- `pages/design/*` (the workbench) and `components/wustep/lenses`, `prompting`: these have their own deliberate local systems (`--dw-*`, lenses springs). Only shared names (`--radius-full`) were migrated.
