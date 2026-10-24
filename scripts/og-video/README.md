# og-video

Link-preview videos (`og:video`) recorded from the real site.

## /playground

`record-playground.mjs` makes `public/playground/og/playground.mp4` and its
poster, `playground.png` (frame 0). It opens the live `/playground` page in
Playwright and restages it in place as a 1200×630 share card (`stage.js`):
the sidebar's flask mark, the page's own `h1` and lede on the left, and eight
of the real covers as a two-column strip on the right (Things, Contraptions,
Splash Panic!, StageBench, Lenses Illustration Lab, Spot it!, Bomberman,
MIDI Visualizer). The strip scrolls up through them once, and a spotlight
wakes one cover at a time with the same `data-cover-awake` flag the page sets
on touch screens: Contraptions, Splash Panic!, Lenses Illustration Lab,
Bomberman, then MIDI Visualizer.

The text and the strip both sit 72px in from the side edges, clear of the
rounded corners and title overlays that X, Slack and iMessage draw, with a
75px gutter between them. Only the strip runs off the top and bottom. Frame
0 centers the first two rows, with equal slivers of the rows above and
below, and it's the poster, so playback starts without a jump.

```sh
pnpm dev                                    # serves :6363
node scripts/og-video/record-playground.mjs # writes public/playground/og/
```

| Flag           | Default                 | What it does                                                             |
| -------------- | ----------------------- | ------------------------------------------------------------------------ |
| `--base`       | `http://localhost:6363` | Site to record (e.g. `https://wustep.me`)                                |
| `--out`        | `public/playground/og`  | Output directory                                                         |
| `--frames`     | a deleted temp dir      | Keep the 2400×1260 PNG frames here for inspection                        |
| `--check-loop` | off                     | Also render frame 180 and print its PSNR against frame 0 (60+ dB = same) |

Needs `ffmpeg` on `PATH` and Playwright's Chromium
(`pnpm exec playwright install chromium`).

### How it stays deterministic

- **Virtual clock** (`clock.js`). Each step pauses every CSS animation and
  transition and sets its `currentTime` by hand, advancing an animation only
  while its computed `animation-play-state` is `running`. The covers'
  paused-at-rest idiom behaves exactly as it does live, however long a
  screenshot takes. Two runs produce byte-identical frames.
- **Seamless loop.** The eight cards are cloned so the strip is three copies
  long, and the 6 s loop scrolls exactly one copy. A full warm-up loop runs
  before capture, so every cover on screen at frame 0 has the same history
  it has at frame 180. Cloning waits for the covers that lay themselves out
  by width (MIDI's keyboard, the Things shelf) to re-render at the strip's
  column width, or the copies would differ from the originals. To check the
  encoded seam too, concat the clip with itself (ffmpeg's concat demuxer)
  and step across the join.
- **Settled frames.** Chromium can screenshot before a newly exposed tile is
  rastered, which drops a cover for a single frame. Every frame is retaken
  until two shots in a row match.
- **Touch emulation** (`hasTouch`) makes `(hover: none)` match, which is
  where the covers' `data-cover-awake` rules live. No cursor is ever drawn.

The other covers sit out. Most barely move when woken. Starry Night's is an
animated WebP that plays in real time, so it can't be posed frame by frame,
and Shadcn's words fall out with `forwards` and leave an empty black card.

### Output

1200×630, 30 fps, 6 s, H.264 High (CRF 24), yuv420p, `+faststart`, no
audio, about 0.5 MB. Frames are captured at 2× and downscaled with Lanczos.

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
