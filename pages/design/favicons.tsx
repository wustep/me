import { ArrowLeft, Check, Copy, Download, Moon, Sun } from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'
import * as React from 'react'

import {
  TurtleFavicon,
  type TurtleFaviconVariant,
  type TurtlePose,
  type TurtleShellPattern
} from '@/components/design/TurtleFavicon'

import styles from './favicons.module.css'

type TurtleFamily = 'Top-down' | 'Profiles' | 'Minimal' | 'Experimental'

type TurtleBase = {
  name: string
  slug: string
  family: TurtleFamily
  pose: TurtlePose
  pattern: TurtleShellPattern
  outlined?: boolean
  flipped?: boolean
}

type TurtlePalette = {
  id: string
  name: string
  shell: string
  body: string
  detail: string
  tile?: string
  tileShape?: 'circle' | 'squircle'
}

const bases: TurtleBase[] = [
  {
    name: 'Plain top',
    slug: 'plain-top',
    family: 'Top-down',
    pose: 'top',
    pattern: 'plain'
  },
  {
    name: 'Compass',
    slug: 'compass',
    family: 'Top-down',
    pose: 'top',
    pattern: 'split'
  },
  {
    name: 'Pond shell',
    slug: 'pond-shell',
    family: 'Top-down',
    pose: 'top',
    pattern: 'segments'
  },
  {
    name: 'Coil',
    slug: 'coil',
    family: 'Top-down',
    pose: 'top',
    pattern: 'spiral'
  },
  {
    name: 'Ripple',
    slug: 'ripple',
    family: 'Top-down',
    pose: 'top',
    pattern: 'wave'
  },
  {
    name: 'Orbit',
    slug: 'orbit',
    family: 'Minimal',
    pose: 'top',
    pattern: 'ring'
  },
  {
    name: 'Dome',
    slug: 'dome',
    family: 'Profiles',
    pose: 'side',
    pattern: 'plain'
  },
  {
    name: 'Dome ring',
    slug: 'dome-ring',
    family: 'Profiles',
    pose: 'side',
    pattern: 'ring'
  },
  {
    name: 'Ribbed',
    slug: 'ribbed',
    family: 'Profiles',
    pose: 'side',
    pattern: 'segments'
  },
  {
    name: 'Side coil',
    slug: 'side-coil',
    family: 'Profiles',
    pose: 'side',
    pattern: 'spiral'
  },
  {
    name: 'Tide profile',
    slug: 'tide-profile',
    family: 'Profiles',
    pose: 'side',
    pattern: 'wave'
  },
  {
    name: 'Wire profile',
    slug: 'wire-profile',
    family: 'Experimental',
    pose: 'side',
    pattern: 'plain',
    outlined: true
  },
  {
    name: 'Soft right',
    slug: 'soft-right',
    family: 'Minimal',
    pose: 'soft',
    pattern: 'plain'
  },
  {
    name: 'Soft left',
    slug: 'soft-left',
    family: 'Minimal',
    pose: 'soft',
    pattern: 'plain',
    flipped: true
  },
  {
    name: 'Pebble',
    slug: 'pebble',
    family: 'Minimal',
    pose: 'shell',
    pattern: 'plain'
  },
  {
    name: 'Pebble split',
    slug: 'pebble-split',
    family: 'Minimal',
    pose: 'shell',
    pattern: 'split'
  },
  {
    name: 'Pixel right',
    slug: 'pixel-right',
    family: 'Experimental',
    pose: 'pixel',
    pattern: 'split'
  },
  {
    name: 'Pixel left',
    slug: 'pixel-left',
    family: 'Experimental',
    pose: 'pixel',
    pattern: 'split',
    flipped: true
  },
  {
    name: 'Swimmer',
    slug: 'swimmer',
    family: 'Experimental',
    pose: 'swim',
    pattern: 'plain'
  },
  {
    name: 'Wave swimmer',
    slug: 'wave-swimmer',
    family: 'Experimental',
    pose: 'swim',
    pattern: 'wave'
  }
]

const palettes: TurtlePalette[] = [
  {
    id: 'pond',
    name: 'Pond',
    shell: '#176b4d',
    body: '#58b887',
    detail: '#d9f7e8'
  },
  {
    id: 'kelp',
    name: 'Kelp',
    shell: '#075d54',
    body: '#28a893',
    detail: '#d8fff7'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    shell: '#164e72',
    body: '#4c93b6',
    detail: '#e1f4ff'
  },
  {
    id: 'coral',
    name: 'Coral',
    shell: '#d45441',
    body: '#f09a68',
    detail: '#fff1dc'
  },
  {
    id: 'ochre',
    name: 'Ochre',
    shell: '#a96e16',
    body: '#d7a63b',
    detail: '#fff1c4'
  },
  {
    id: 'plum',
    name: 'Plum',
    shell: '#68456f',
    body: '#ad7cae',
    detail: '#faeafa'
  },
  {
    id: 'ink',
    name: 'Ink',
    shell: '#171817',
    body: '#171817',
    detail: '#ffffff'
  },
  {
    id: 'reverse',
    name: 'Reverse',
    shell: '#ffffff',
    body: '#ffffff',
    detail: '#171817',
    tile: '#171817',
    tileShape: 'squircle'
  }
]

const families: TurtleFamily[] = [
  'Top-down',
  'Profiles',
  'Minimal',
  'Experimental'
]

type PreviewTone = 'light' | 'dark'

function makeVariant(
  base: TurtleBase,
  palette: TurtlePalette
): TurtleFaviconVariant {
  return {
    name: base.name,
    slug: base.slug,
    pose: base.pose,
    pattern: base.pattern,
    outlined: base.outlined,
    flipped: base.flipped,
    shell: palette.shell,
    body: palette.body,
    detail: palette.detail,
    tile: palette.tile,
    tileShape: palette.tileShape
  }
}

function downloadSvg(svgId: string, filename: string) {
  const svg = document.getElementById(svgId)
  if (!svg) return

  const source = `<?xml version="1.0" encoding="UTF-8"?>\n${svg.outerHTML}`
  const url = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function FaviconsDesignPage() {
  const [tone, setTone] = React.useState<PreviewTone>('light')
  const [selectedBaseSlug, setSelectedBaseSlug] = React.useState(bases[0]!.slug)
  const [selectedPaletteId, setSelectedPaletteId] = React.useState(
    palettes[0]!.id
  )
  const [copied, setCopied] = React.useState(false)

  const selectedBase =
    bases.find((base) => base.slug === selectedBaseSlug) || bases[0]!
  const selectedPalette =
    palettes.find((palette) => palette.id === selectedPaletteId) || palettes[0]!
  const selected = makeVariant(selectedBase, selectedPalette)

  React.useEffect(() => {
    const svg = document.getElementById('selected-favicon')
    if (!svg) return

    const favicon = svg.cloneNode(true) as SVGElement
    favicon.removeAttribute('id')
    favicon.setAttribute('width', '64')
    favicon.setAttribute('height', '64')

    const link = document.createElement('link')
    link.rel = 'icon'
    link.type = 'image/svg+xml'
    link.dataset.designFavicon = 'true'
    link.href = `data:image/svg+xml,${encodeURIComponent(favicon.outerHTML)}`
    document.head.append(link)

    return () => link.remove()
  }, [selectedBaseSlug, selectedPaletteId])

  const copySelectedSvg = async () => {
    const svg = document.getElementById('selected-favicon')
    if (!svg) return
    await navigator.clipboard.writeText(svg.outerHTML)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <>
      <Head>
        <title>Favicons · Design playground</title>
        <meta
          name='description'
          content='Explore original turtle favicon directions at real browser sizes.'
        />
        <meta name='robots' content='noindex,nofollow' />
      </Head>

      <main className={`${styles.page} ${styles[tone]}`}>
        <header className={styles.header}>
          <Link href='/design' className={styles.backLink}>
            <ArrowLeft aria-hidden='true' />
            Design playground
          </Link>
          <div className={styles.headerSelection} aria-live='polite'>
            <TurtleFavicon variant={selected} size={20} />
            <span>
              {selectedBase.name} · {selectedPalette.name}
            </span>
          </div>
          <div className={styles.toneSwitch} aria-label='Preview background'>
            <button
              type='button'
              className={tone === 'light' ? styles.activeTone : ''}
              onClick={() => setTone('light')}
              aria-pressed={tone === 'light'}
              aria-label='Light preview background'
            >
              <Sun aria-hidden='true' />
            </button>
            <button
              type='button'
              className={tone === 'dark' ? styles.activeTone : ''}
              onClick={() => setTone('dark')}
              aria-pressed={tone === 'dark'}
              aria-label='Dark preview background'
            >
              <Moon aria-hidden='true' />
            </button>
          </div>
        </header>

        <section className={styles.intro}>
          <div>
            <p>Pages / Favicons</p>
            <h1>Build a turtle.</h1>
            <span>
              Choose one of twenty base marks, then test it across a separate
              set of color palettes at actual favicon sizes.
            </span>
          </div>
          <div className={styles.previewColumn}>
            <div className={styles.browserPreview}>
              <div className={styles.browserDots} aria-hidden='true'>
                <i />
                <i />
                <i />
              </div>
              <div className={styles.browserTab}>
                <TurtleFavicon
                  id='selected-favicon'
                  variant={selected}
                  size={16}
                />
                <span>Stephen Wu</span>
                <b aria-hidden='true'>×</b>
              </div>
              <div className={styles.newTab} aria-hidden='true'>
                +
              </div>
            </div>
            <div className={styles.selectedActions}>
              <div>
                <span>Selected</span>
                <strong>
                  {selectedBase.name} · {selectedPalette.name}
                </strong>
              </div>
              <button type='button' onClick={() => void copySelectedSvg()}>
                {copied ? (
                  <Check aria-hidden='true' />
                ) : (
                  <Copy aria-hidden='true' />
                )}
                {copied ? 'Copied' : 'Copy SVG'}
              </button>
              <button
                type='button'
                onClick={() =>
                  downloadSvg(
                    'selected-favicon',
                    `turtle-${selectedBase.slug}-${selectedPalette.id}.svg`
                  )
                }
              >
                <Download aria-hidden='true' /> Download
              </button>
            </div>
          </div>
        </section>

        <section
          className={styles.paletteSection}
          aria-labelledby='palettes-title'
        >
          <div className={styles.galleryHeading}>
            <div>
              <h2 id='palettes-title'>Color palettes</h2>
              <span>{palettes.length}</span>
            </div>
          </div>
          <div className={styles.paletteList}>
            {palettes.map((palette) => {
              const isSelected = palette.id === selectedPalette.id
              return (
                <button
                  key={palette.id}
                  type='button'
                  className={`${styles.paletteButton} ${
                    isSelected ? styles.selectedPalette : ''
                  }`}
                  onClick={() => setSelectedPaletteId(palette.id)}
                  aria-pressed={isSelected}
                >
                  <span className={styles.swatches} aria-hidden='true'>
                    <i style={{ background: palette.shell }} />
                    <i style={{ background: palette.body }} />
                    <i style={{ background: palette.detail }} />
                  </span>
                  <strong>{palette.name}</strong>
                </button>
              )
            })}
          </div>
        </section>

        <section className={styles.gallery} aria-labelledby='bases-title'>
          <div className={styles.galleryHeading}>
            <div>
              <h2 id='bases-title'>Base turtles</h2>
              <span>{bases.length}</span>
            </div>
          </div>

          <div className={styles.familyList}>
            {families.map((family) => {
              const familyBases = bases.filter((base) => base.family === family)
              return (
                <section key={family} className={styles.familyGroup}>
                  <header>
                    <h3>{family}</h3>
                    <span>{familyBases.length}</span>
                  </header>
                  <div className={styles.grid}>
                    {familyBases.map((base) => {
                      const variant = makeVariant(base, selectedPalette)
                      const isSelected = base.slug === selectedBase.slug

                      return (
                        <article
                          key={base.slug}
                          className={`${styles.card} ${
                            isSelected ? styles.selectedCard : ''
                          }`}
                        >
                          <button
                            type='button'
                            className={styles.selectCandidate}
                            onClick={() => setSelectedBaseSlug(base.slug)}
                            aria-pressed={isSelected}
                          >
                            <span className={styles.mainMark}>
                              <TurtleFavicon
                                variant={variant}
                                size={64}
                                title={`${base.name} turtle favicon`}
                              />
                            </span>
                            <span
                              className={styles.sizeChecks}
                              aria-hidden='true'
                            >
                              <span>
                                <TurtleFavicon variant={variant} size={32} />
                                <small>32</small>
                              </span>
                              <span>
                                <TurtleFavicon variant={variant} size={16} />
                                <small>16</small>
                              </span>
                            </span>
                            <strong>{base.name}</strong>
                          </button>
                        </article>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </section>
      </main>
    </>
  )
}
