# Self-hosted web fonts

Every web font the site loads at build time lives here and is wired up with
`next/font/local`. Nothing is downloaded during `next build`, locally, in CI or
on Vercel.

## Why not `next/font/google`

`next/font/google` fetches the stylesheet from Google Fonts on every build.
Now and then Google answers with an extensionless file URL
(`fonts.gstatic.com/l/font?kit=…&skey=…&v=…`) instead of the usual
`…/<hash>.woff2`. Turbopack can't parse the `&` in that URL and fails the
build with `next/font/google queries have exactly one entry`, on whichever
family drew the odd response (#88, #89 and #90 each failed this way). The
upstream bug is [vercel/next.js#99114](https://github.com/vercel/next.js/issues/99114).
ESLint bans the import so it doesn't come back.

## What's here

Each file is the exact **Latin subset** woff2 that Google Fonts serves for
the family, fetched with the same request `next/font/google` would make. For
Inter, Crimson Pro, Source Serif 4, Fraunces and JetBrains Mono, that's byte
for byte what the site already served. The old code asked for
`subsets: ['latin']`. Characters
outside that range (Latin Extended, Greek, Cyrillic, Vietnamese) fall back to
the next font in each stack. The repo's text, including the generated Notion
index, has none of them.

Google serves one variable file per style, so a family that used several
weights lists the same file once per weight in its `src` array. That keeps the
`@font-face` rules identical to what `next/font/google` generated.

`adjustFontFallback` is `false` throughout. Under Turbopack,
`next/font/google` wasn't emitting metric-adjusted fallback faces either (the
build output had none), so turning it on would change how text looks while
the fonts load.

| Family         | Files                                                       | Axes in file            | Used by                              |
| -------------- | ----------------------------------------------------------- | ----------------------- | ------------------------------------ |
| Inter          | `inter/inter-latin.woff2` (v20)                             | wght 100–900            | `--font-sans`, site-wide             |
| Onest          | `onest/onest-latin.woff2` (v11)                             | wght 100–900            | `--font-display`, site-wide          |
| Crimson Pro    | `crimson-pro/crimson-pro-latin{,-italic}.woff2` (v28)       | wght 200–900            | `--font-serif`, site-wide            |
| Source Serif 4 | `source-serif-4/source-serif-4-latin{,-italic}.woff2` (v15) | wght 200–900, opsz 8–60 | `--pm-serif`, /prompting             |
| Roboto Mono    | `roboto-mono/roboto-mono-latin.woff2` (v31)                 | wght 100–700            | `--pm-mono`, /prompting              |
| Fraunces       | `fraunces/fraunces-latin{,-italic}.woff2` (v38)             | wght 100–900            | `--jev-serif`, Jev Playground covers |
| JetBrains Mono | `jetbrains-mono/jetbrains-mono-latin-500.woff2` (v24)       | static Medium (500)     | `--jev-mono`, Jev Playground covers  |

Onest (display sans) and Roboto Mono (/prompting mono) replaced earlier
picks. Each was chosen as the closest metric match among OFL families on
Google Fonts: Onest's x-height is 0.527 em against 0.530, with sample text
width within 0.2%. Roboto Mono's x-height is 0.528 against 0.530, with the
same 0.6 em advance. Titles and code specimens keep their line breaks. Onest
keeps the same discrete 400/500/600/700 faces. `--font-geist` is still
defined in `pages/_app.tsx` as an alias of `--font-display`, for branches
that predate the rename.

## License

All seven families are licensed under the **SIL Open Font License 1.1**. None
declares a Reserved Font Name. Each folder keeps its `OFL.txt`, copied from
the family's directory in [google/fonts](https://github.com/google/fonts/tree/main/ofl).
The OFL allows bundling and redistributing the fonts with software as long as
the license travels with them. The fonts may not be sold on their own.

## Updating or adding a font

1. Request the family from `https://fonts.googleapis.com/css2?family=…` with a
   modern Chrome `User-Agent` (Google serves woff2 by UA).
2. Download the `/* latin */` file for each style. If the URL is an
   extensionless `/l/font?kit=…` one, fetch the stylesheet again until a
   normal `…/<hash>.woff2` URL comes back.
3. Save it here with the family's `OFL.txt`, then add a `localFont({ src: […] })`
   entry with one `src` item per weight and style you use.
