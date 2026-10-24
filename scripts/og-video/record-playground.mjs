#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────
 * Records the /playground link-preview video: the live page,
 * restaged as a 1200×630 share card (stage.js), with eight of
 * the real covers scrolling up one full pass while a spotlight
 * zig-zags down them, waking one cover at a time — the same
 * data-cover-awake flag the page sets on touch screens.
 *
 * Every frame is posed and screenshotted on a virtual clock
 * (clock.js), so the output is identical run to run, and the
 * strip is three copies of those covers long so the last frame
 * leads straight back into the first.
 *
 *   pnpm dev   # in another terminal, or pass --base
 *   node scripts/og-video/record-playground.mjs [--base URL] [--out DIR]
 *
 * Writes playground.mp4 and its poster, playground.png (frame
 * 0), to public/playground/og/. Needs ffmpeg on PATH and
 * Playwright's Chromium (pnpm exec playwright install chromium).
 * ───────────────────────────────────────────────────────── */

import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { parseArgs } from 'node:util'

import { chromium } from 'playwright'

import { installClock } from './clock.js'
import { poseStrip, restagePlayground } from './stage.js'

const { values: args } = parseArgs({
  options: {
    base: { type: 'string', default: 'http://localhost:6363' },
    out: { type: 'string', default: 'public/playground/og' },
    /** Keep the 2x PNG frames here instead of a deleted temp dir. */
    frames: { type: 'string' },
    /** Also render frame N (the next loop's frame 0) and diff it with 0. */
    'check-loop': { type: 'boolean', default: false }
  }
})

const WIDTH = 1200
const HEIGHT = 630
const SCALE = 2
const FPS = 30
const SECONDS = 6
const FRAMES = FPS * SECONDS

/**
 * The strip, two to a row and in the page's order: eight covers, so a pass
 * is four rows and the loop stays short. Five take the spotlight below;
 * Things, StageBench and Spot it! fill out their rows. The rest sit out:
 * most barely move when woken, Starry Night's cover is an animated WebP
 * that plays in real time (it can't be posed frame by frame), and Shadcn's
 * words fall out with `forwards`, leaving an empty black card.
 */
const CARDS = [
  'Things',
  'Contraptions',
  'Splash Panic!',
  'StageBench',
  'Lenses Illustration Lab',
  'Spot it!',
  'Bomberman',
  'MIDI Visualizer'
]

/**
 * Where the visible copy's first row sits at frame 0 (CSS px). With 192px
 * covers and a 20px gap, that centers the Things and Splash Panic! rows,
 * with equal slivers of the rows above and below: the poster frame.
 */
const TOP = 113

/**
 * Who holds the spotlight, in strip order, and for how long. The windows
 * run back to back — one cover awake at a time, as on the page — and add up
 * to the loop. Each is long enough for its cover's beat: the marble's roll,
 * both explosions, the bow's draw, the first notes.
 */
const SPOTLIGHT = [
  { title: 'Contraptions', seconds: 1.2 },
  { title: 'Splash Panic!', seconds: 1.8 },
  { title: 'Lenses Illustration Lab', seconds: 0.8 },
  { title: 'Bomberman', seconds: 1.7 },
  { title: 'MIDI Visualizer', seconds: 0.5 }
]
/**
 * The frame-space y of Contraptions' center when its window opens. Frame
 * 0 lands 0.8s into that window, with the marble mid-roll.
 */
const FIRST_WAKE_Y = 322

const outDir = path.resolve(args.out)
const framesDir = args.frames
  ? path.resolve(args.frames)
  : fs.mkdtempSync(path.join(os.tmpdir(), 'og-playground-'))
const framePath = (name) => path.join(framesDir, name)
fs.mkdirSync(framesDir, { recursive: true })
fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: SCALE,
  // Touch makes (hover: none) match, which is where the covers'
  // data-cover-awake rules live.
  hasTouch: true,
  colorScheme: 'light',
  reducedMotion: 'no-preference'
})
await context.addInitScript(() => {
  localStorage.setItem('darkMode', 'false')
})
const page = await context.newPage()
await page.goto(new URL('/playground', args.base).toString(), {
  waitUntil: 'networkidle'
})
await page.evaluate(() => document.fonts.ready)

const strip = await page.evaluate(restagePlayground, {
  copies: 3,
  cards: CARDS
})
// Copies only tile seamlessly if each one fills its last row.
if (strip.count % 2) throw new Error('The strip needs an even card count')
await page.waitForLoadState('networkidle')
await page.evaluate(() =>
  Promise.all([...document.images].map((img) => img.decode().catch(() => null)))
)
await page.evaluate(installClock)

const indexOf = (title) => {
  const index = strip.titles.indexOf(title)
  if (index === -1) throw new Error(`No playground card titled "${title}"`)
  return index
}
const coverCenter = (index) =>
  Math.floor(index / 2) * strip.pitch + strip.coverHeight / 2

// Spotlight windows in strip space, where m is the strip coordinate under
// the frame's vertical middle. A cover's frame-space center is
// `center + HEIGHT / 2 - m`.
const pxPerSecond = strip.period / SECONDS
let start = coverCenter(indexOf(SPOTLIGHT[0].title)) + HEIGHT / 2 - FIRST_WAKE_Y
const windows = SPOTLIGHT.map(({ title, seconds }) => {
  const window = {
    index: indexOf(title),
    from: start,
    to: start + seconds * pxPerSecond
  }
  start = window.to
  return window
})
const total = windows.at(-1).to - windows[0].from
if (Math.abs(total - strip.period) > 0.5) {
  throw new Error(`Spotlight covers ${total}px, not the ${strip.period}px loop`)
}
// As on the page, a cover only wakes while it's wholly on screen.
for (const { index, from, to } of windows) {
  for (const m of [from, to]) {
    const y = coverCenter(index) + HEIGHT / 2 - m
    const half = strip.coverHeight / 2
    if (y < half || y > HEIGHT - half) {
      throw new Error(`${strip.titles[index]} is awake while clipped (y ${y})`)
    }
  }
}

function scene(frame) {
  const translateY = TOP - strip.period - (strip.period * frame) / FRAMES
  const m = HEIGHT / 2 - strip.gridTop - translateY
  const awake = []
  for (let copy = 0; copy < 3; copy++) {
    const shift = copy * strip.period
    for (const { index, from, to } of windows) {
      if (m >= from + shift && m < to + shift) {
        awake.push(copy * strip.count + index)
      }
    }
  }
  return { translateY, awake }
}

// Chromium rasterizes tiles off the main thread, and a screenshot can land
// before a newly exposed tile (or a large image's decode) is ready — a cover
// blinks out for one frame. Retake until two shots in a row agree.
let retakes = 0
async function settledScreenshot() {
  const options = { animations: 'allow', caret: 'hide' }
  let shot = await page.screenshot(options)
  for (let tries = 0; tries < 10; tries++) {
    const again = await page.screenshot(options)
    if (again.equals(shot)) return shot
    shot = again
    retakes++
  }
  throw new Error('Frame never settled')
}

// One loop of warm-up first, so every cover on screen at frame 0 already
// has the history it will have at frame FRAMES — that's what makes the
// last frame run seamlessly into the first.
const lastFrame = args['check-loop'] ? FRAMES : FRAMES - 1
for (let frame = -FRAMES; frame <= lastFrame; frame++) {
  await page.evaluate(poseStrip, scene(frame))
  await page.evaluate(
    (time) => globalThis.__ogClock.step(time),
    ((frame + FRAMES) * 1000) / FPS
  )
  if (frame < 0) continue
  const name =
    frame === FRAMES
      ? 'loop-check.png'
      : `${String(frame).padStart(5, '0')}.png`
  fs.writeFileSync(framePath(name), await settledScreenshot())
  if (frame % FPS === 0) console.log(`frame ${frame}/${FRAMES}`)
}
await browser.close()
if (retakes) console.log(`retook ${retakes} unsettled frames`)

const ffmpeg = (...ffArgs) =>
  spawnSync('ffmpeg', ['-hide_banner', '-y', ...ffArgs], { encoding: 'utf8' })
const downscale = `scale=${WIDTH}:${HEIGHT}:flags=lanczos`

// H.264 High at yuv420p for every player, a keyframe every 2s, the moov
// atom up front (+faststart) so it starts before it's fully fetched, and no
// audio track at all. CRF 24 still measures ~46 dB against the frames, at
// about half the size of CRF 20.
// prettier-ignore
const encode = ffmpeg(
  '-framerate', String(FPS), '-i', framePath('%05d.png'),
  '-vf', `${downscale},format=yuv420p`,
  '-c:v', 'libx264', '-preset', 'veryslow', '-crf', '24', '-tune', 'animation',
  '-g', String(FPS * 2), '-movflags', '+faststart', '-an',
  path.join(outDir, 'playground.mp4')
)
// The poster is frame 0, so an unfurler that shows it and then starts the
// video doesn't jump. TOP is what makes frame 0 the composed one.
// prettier-ignore
const poster = ffmpeg(
  '-i', framePath('00000.png'), '-vf', downscale,
  path.join(outDir, 'playground.png')
)
for (const { status, stderr } of [encode, poster]) {
  if (status !== 0) throw new Error(stderr)
}

if (args['check-loop']) {
  // PSNR of the would-be frame N against frame 0. Sub-pixel raster noise
  // alone lands around 60–70 dB; two neighboring frames, with the strip
  // moving, are ~18 dB apart, and a visible seam is far lower still.
  // prettier-ignore
  const { stderr } = ffmpeg(
    '-i', framePath('00000.png'), '-i', framePath('loop-check.png'),
    '-lavfi', 'psnr', '-f', 'null', '-'
  )
  console.log(`loop seam: ${stderr.match(/PSNR .*/)?.[0] ?? stderr}`)
}

if (!args.frames) fs.rmSync(framesDir, { recursive: true, force: true })
console.log(`wrote ${path.join(outDir, 'playground.mp4')} and playground.png`)
