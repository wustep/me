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
family drew the odd response: Inter on #88 and #89, Geist on #90. The upstream
bug is [vercel/next.js#99114](https://github.com/vercel/next.js/issues/99114).
ESLint bans the import so it doesn't come back.

## What's here

Each file is the exact **Latin subset** woff2 that Google Fonts serves for
these families, byte for byte the same as what `next/font/google` used to
download and self-host. The old code asked for `subsets: ['latin']`. Characters
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

| Family         | Files                                        | Axes in file                 | Used by                                    |
| -------------- | -------------------------------------------- | ---------------------------- | ------------------------------------------ |
| Inter          | `inter/inter-latin.woff2` (v20)              | wght 100–900                 | `--font-sans`, site-wide                   |
| Geist          | `geist/geist-latin.woff2` (v5)               | wght 100–900                 | `--font-geist`, site-wide                  |
| Crimson Pro    | `crimson-pro/crimson-pro-latin{,-italic}.woff2` (v28) | wght 200–900        | `--font-serif`, site-wide                  |
| Source Serif 4 | `source-serif-4/source-serif-4-latin{,-italic}.woff2` (v15) | wght 200–900, opsz 8–60 | `--pm-serif`, /prompting            |
| Geist Mono     | `geist-mono/geist-mono-latin.woff2` (v6)     | wght 100–900                 | `--pm-mono`, /prompting                    |
| Fraunces       | `fraunces/fraunces-latin{,-italic}.woff2` (v38) | wght 100–900              | `--jev-serif`, Jev Playground covers       |
| JetBrains Mono | `jetbrains-mono/jetbrains-mono-latin-500.woff2` (v24) | static Medium (500) | `--jev-mono`, Jev Playground covers        |

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
