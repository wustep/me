---
name: lenses-illustrations
description: Helps create or refine Lenses card illustrations and color palettes. Use when adding a new Lenses card, improving an existing Lenses SVG, choosing card bg/fg/accent colors, storyboarding new illustration concepts, or using the Lenses illustration lab.
---

# Lenses Illustrations

## Quick Start

Use this skill for work in `components/wustep/lenses`.

Before making a new illustration:

1. Read `components/wustep/lenses/types.ts`, `registry.tsx`, `illustrations.tsx`, and the relevant animation section in `LensesPage.module.css`.
2. Storyboard first. Propose at least 3 distinct illustration concepts and at least 3 color palettes before editing code.
3. Pick the concept that reads clearly at card size, has a strong at-rest silhouette, and can animate with 1-3 simple targets.
4. Implement the SVG in `illustrations.tsx`, add the `IllustrationId` union value in `types.ts`, map it in `Illustration`, and assign it from `registry.tsx`.
5. Add hover animation CSS only if it clarifies the metaphor. Keep the side-panel hero calm; animations should run from cards via the existing CSS contract.
6. Test the result in `/playground/lenses-illustrations` during development.

## Storyboard Format

For a new lens, propose:

```markdown
## Illustration Concepts

1. [Name]: [one-sentence metaphor]
   Static read: [what the viewer sees before motion]
   Motion: [what moves on hover and why]
   SVG parts: [simple shapes and data-anim-target plan]

2. ...

## Palette Options

1. bg `#...`, fg `#...`, accent `#...` - [mood/readability note]
2. ...
```

## Visual Language

- Favor flat, geometric SVGs with generous negative space and a clear silhouette.
- Treat `fg` as the main ink, `accent` as the focal point, and `bg` as context. Do not hard-code colors inside an illustration unless the existing file already establishes an exception.
- Keep the 100x100 viewBox and the existing `SVG_BASE` convention.
- Use `data-anim="<illustration-id>"` on the root SVG and `data-anim-target="<target>"` on moving elements.
- A good animation is diagrammatic: it explains the lens, not just decorates it.
- Prefer paths, circles, lines, rects, and polygons over complex filters.
- Preserve accessibility by keeping decorative SVGs `aria-hidden='true'`.

## Color Guidance

- Card backgrounds should feel saturated and editorial, not neon.
- `fg` must remain readable over `bg`; use warm off-white (`#F5EFE0`) or near-ink when contrast calls for it.
- `accent` should be visibly different from both `bg` and `fg`, but not louder than the concept.
- Use `/playground/lenses-illustrations` to test current cards, random palettes, and one illustration across many backgrounds.

## Review Checklist

- The concept is recognizable at small card size.
- The card still works with animation disabled.
- No new animation violates `prefers-reduced-motion`.
- The registry title, category, palette, and illustration reinforce the same idea.
- TypeScript, lint, and visual smoke tests pass.
