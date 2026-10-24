# og-video

Link-preview videos (`og:video`) recorded from the real site.

## /playground

`record-playground.mjs` makes `public/playground/og/playground.mp4` and its
poster, `playground.png` (frame 0). It opens the live `/playground` page in
Playwright and restages it in place as the 1200×630 share card
(`public/og/playground.png`): the sidebar's flask mark, the page's own `h1`
and lede on the left, and the real cover grid as a two-column strip on the
right (`stage.js`). The strip scrolls up through every card once, and a
spotlight wakes one cover at a time with the same `data-cover-awake` flag the
page sets on touch screens: Contraptions, Splash Panic!, Lenses Illustration
Lab, DOM-ino, Bookshelf, Spot it!, MIDI Visualizer, then Bomberman.

```sh
pnpm dev                                    # serves :6363
node scripts/og-video/record-playground.mjs # writes public/playground/og/
```

| Flag           | Default                 | What it does                                                            |
| -------------- | ----------------------- | ----------------------------------------------------------------------- |
| `--base`       | `http://localhost:6363` | Site to record (e.g. `https://wustep.me`)                               |
| `--out`        | `public/playground/og`  | Output directory                                                        |
| `--frames`     | a deleted temp dir      | Keep the 2400×1260 PNG frames here for inspection                       |
| `--check-loop` | off                     | Also render frame 300 and print its PSNR against frame 0 (~70 dB = same) |

Needs `ffmpeg` on `PATH` and Playwright's Chromium
(`pnpm exec playwright install chromium`).

### How it stays deterministic

- **Virtual clock** (`clock.js`). Each step pauses every CSS animation and
  transition and sets its `currentTime` by hand, advancing an animation only
  while its computed `animation-play-state` is `running`. The covers'
  paused-at-rest idiom behaves exactly as it does live, however long a
  screenshot takes. Two runs produce byte-identical frames.
- **Seamless loop.** The grid is cloned so the strip is three copies long,
  and the 10 s loop scrolls exactly one copy. A full warm-up loop runs before
  capture, so every cover on screen at frame 0 has the same history it has
  at frame 300.
- **Settled frames.** Chromium can screenshot before a newly exposed tile is
  rastered, which drops a cover for a single frame. Every frame is retaken
  until two shots in a row match.
- **Touch emulation** (`hasTouch`) makes `(hover: none)` match, which is
  where the covers' `data-cover-awake` rules live. No cursor is ever drawn.

Starry Night's cover is an animated WebP that plays in real time, so it
can't be posed frame by frame, and it stays asleep. Shadcn's words fall out
with `forwards` and leave an empty black card, so it stays asleep too.

### Output

1200×630, 30 fps, 10 s, H.264 High, yuv420p, `+faststart`, no audio,
about 1.6 MB. Frames are captured at 2× and downscaled with Lanczos.

## /playground/dom-ino

`public/playground/og/dom-ino.mp4` is recorded from the app itself in the
DOM-ino repo (wustep/dom-ino, `scripts/og-video/`) and copied here. The page
keeps its `public/og/playground/dom-ino.png` card as `og:image`.

## Wiring

`shareVideo()` and `shareVideoMeta()` in `lib/share-card.tsx` emit
`og:video`, `og:video:secure_url`, `og:video:type`, `og:video:width` and
`og:video:height`. Both `PageHead` and `PlaygroundHead` (via
`PlaygroundLayout`) take an optional `shareVideo`. The `og:image` card stays
as it is, so unfurlers that don't play video still show the still.
