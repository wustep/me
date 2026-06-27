import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Search,
  Type
} from 'lucide-react'
import Head from 'next/head'
import * as React from 'react'

import { DesignWorkbenchNav } from '@/components/design/DesignWorkbench'
import { designPreviewPages } from '@/lib/design-preview-pages'
import {
  type DesignFont,
  designFontPairs,
  designFontsStylesheetUrl,
  designSansFonts,
  designSerifFonts,
  getDesignFont
} from '@/lib/fonts/design-fonts'

import styles from './fonts.module.css'

const storageKey = 'design-font-tester-settings'

function ensureDesignFonts(doc: Document) {
  if (doc.querySelector('link[data-design-fonts]')) return

  const stylesheet = doc.createElement('link')
  stylesheet.rel = 'stylesheet'
  stylesheet.href = designFontsStylesheetUrl
  stylesheet.dataset.designFonts = 'true'
  doc.head.append(stylesheet)
}

type StoredSettings = {
  sansId: string
  serifId: string
  scale: number
  path: string
}

function FontOptionList({
  fonts,
  selectedId,
  onSelect,
  emptyLabel
}: {
  fonts: DesignFont[]
  selectedId: string
  onSelect: (id: string) => void
  emptyLabel: string
}) {
  if (fonts.length === 0) {
    return <p className={styles.emptyFonts}>{emptyLabel}</p>
  }

  return (
    <div className={styles.fontList}>
      {fonts.map((font) => {
        const isSelected = font.id === selectedId
        return (
          <button
            key={font.id}
            type='button'
            className={`${styles.fontOption} ${isSelected ? styles.activeFont : ''}`}
            onClick={() => onSelect(font.id)}
            aria-pressed={isSelected}
          >
            <span
              className={styles.fontSample}
              style={{ fontFamily: font.family }}
              aria-hidden='true'
            >
              Aa
            </span>
            <span className={styles.fontCopy}>
              <strong style={{ fontFamily: font.family }}>{font.name}</strong>
              <small>{font.note}</small>
            </span>
            <span className={styles.fontSelected} aria-hidden='true'>
              {isSelected && <Check />}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function normalizeLocalPath(value: string) {
  const url = new URL(value.trim() || '/', window.location.origin)
  if (url.origin !== window.location.origin) {
    throw new Error('Preview paths must stay on this site.')
  }
  if (url.pathname.startsWith('/design')) {
    throw new Error('Choose a site page outside the design tools.')
  }
  return `${url.pathname}${url.search}${url.hash}`
}

export default function FontTesterPage() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const [sansId, setSansId] = React.useState('inter')
  const [serifId, setSerifId] = React.useState('crimson-pro')
  const [scale, setScale] = React.useState(1)
  const [previewPath, setPreviewPath] = React.useState('/')
  const [draftPath, setDraftPath] = React.useState('/')
  const [pathError, setPathError] = React.useState('')
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(true)
  const [copied, setCopied] = React.useState(false)
  const [isReady, setIsReady] = React.useState(false)
  const [panelMode, setPanelMode] = React.useState<'pairs' | 'library'>('pairs')
  const [fontSearch, setFontSearch] = React.useState('')

  const sansFont = getDesignFont(designSansFonts, sansId, 'inter')
  const serifFont = getDesignFont(designSerifFonts, serifId, 'crimson-pro')

  const activePair = designFontPairs.find(
    (pair) => pair.sansId === sansFont.id && pair.serifId === serifFont.id
  )
  const normalizedSearch = fontSearch.trim().toLowerCase()
  const filteredSansFonts = designSansFonts.filter((font) =>
    `${font.name} ${font.note}`.toLowerCase().includes(normalizedSearch)
  )
  const filteredSerifFonts = designSerifFonts.filter((font) =>
    `${font.name} ${font.note}`.toLowerCase().includes(normalizedSearch)
  )

  const applyPreviewTypography = React.useCallback(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) return

    ensureDesignFonts(doc)

    const fontRoot = doc.querySelector<HTMLElement>('[data-font-root]')
    const targets: HTMLElement[] = [
      doc.documentElement,
      ...(fontRoot ? [fontRoot] : [])
    ]

    for (const target of targets) {
      target.style.setProperty('--font-sans', sansFont.family)
      target.style.setProperty('--font-serif', serifFont.family)
    }

    if (doc.body) {
      doc.body.style.setProperty('--font-sans', sansFont.family)
      doc.body.style.setProperty('--font-serif', serifFont.family)
      doc.body.style.setProperty('--notion-font', sansFont.family)
    }

    doc.documentElement.style.fontSize =
      scale === 1 ? '' : `${Math.round(scale * 100)}%`
    doc.documentElement.dataset.designFontPreview = 'true'
  }, [sansFont.family, serifFont.family, scale])

  React.useEffect(() => {
    ensureDesignFonts(document)
  }, [])

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const saved = JSON.parse(
        localStorage.getItem(storageKey) || 'null'
      ) as StoredSettings | null

      const nextSansId = params.get('sans') || saved?.sansId || 'inter'
      const nextSerifId = params.get('serif') || saved?.serifId || 'crimson-pro'
      const nextScale = Number(params.get('scale') || saved?.scale || 1)
      const nextPath = normalizeLocalPath(
        params.get('path') || saved?.path || '/'
      )

      if (designSansFonts.some((font) => font.id === nextSansId)) {
        setSansId(nextSansId)
      }
      if (designSerifFonts.some((font) => font.id === nextSerifId)) {
        setSerifId(nextSerifId)
      }
      if (nextScale >= 0.9 && nextScale <= 1.15) {
        setScale(nextScale)
      }
      setPreviewPath(nextPath)
      setDraftPath(nextPath)
    } catch {
      // Ignore malformed saved settings and keep the known-good defaults.
    } finally {
      setIsReady(true)
    }
  }, [])

  React.useEffect(() => {
    applyPreviewTypography()

    if (!isReady) return

    const settings: StoredSettings = {
      sansId: sansFont.id,
      serifId: serifFont.id,
      scale,
      path: previewPath
    }
    localStorage.setItem(storageKey, JSON.stringify(settings))

    const url = new URL(window.location.href)
    url.searchParams.set('sans', sansFont.id)
    url.searchParams.set('serif', serifFont.id)
    url.searchParams.set('scale', String(scale))
    url.searchParams.set('path', previewPath)
    window.history.replaceState(window.history.state, '', url)
  }, [
    applyPreviewTypography,
    isReady,
    previewPath,
    sansFont.id,
    scale,
    serifFont.id
  ])

  const navigateTo = React.useCallback((value: string) => {
    try {
      const path = normalizeLocalPath(value)
      setPathError('')
      setDraftPath(path)
      setPreviewPath(path)
      setIsLoading(true)

      const frame = iframeRef.current
      if (frame?.contentWindow) {
        frame.contentWindow.location.assign(path)
      }
    } catch (err) {
      setPathError(
        err instanceof Error ? err.message : 'Enter a valid local path.'
      )
    }
  }, [])

  const handleFrameLoad = React.useCallback(() => {
    applyPreviewTypography()
    setIsLoading(false)

    try {
      const location = iframeRef.current?.contentWindow?.location
      if (!location || location.origin !== window.location.origin) return
      const path = `${location.pathname}${location.search}${location.hash}`
      if (!path.startsWith('/design')) {
        setPreviewPath(path)
        setDraftPath(path)
      }
    } catch {
      // A link may briefly leave the origin; the next local load will resync.
    }
  }, [applyPreviewTypography])

  React.useEffect(() => {
    if (
      isReady &&
      iframeRef.current?.contentDocument?.readyState === 'complete'
    ) {
      handleFrameLoad()
    }
  }, [handleFrameLoad, isReady])

  const applyPair = (sans: string, serif: string) => {
    setSansId(sans)
    setSerifId(serif)
  }

  const resetSettings = () => {
    setSansId('inter')
    setSerifId('crimson-pro')
    setScale(1)
  }

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const selectedPage = designPreviewPages.some(
    (page) => page.path === previewPath
  )
    ? previewPath
    : 'custom'

  return (
    <>
      <Head>
        <title>Font pairer · Design workbench</title>
        <meta
          name='description'
          content='Test font pairings against real pages on wustep.me.'
        />
        <meta name='robots' content='noindex,nofollow' />
      </Head>

      <div className={styles.page}>
        <DesignWorkbenchNav
          activeTool='fonts'
          status={isLoading ? 'Loading' : copied ? 'Copied' : 'Ready'}
        />
        <main className={`${styles.lab} ${sidebarOpen ? '' : styles.compact}`}>
          <aside className={styles.sidebar} aria-label='Font controls'>
            <div className={styles.sidebarHeader}>
              <div>
                <div className={styles.titleRow}>
                  <div>
                    <h1>Font pairer</h1>
                    <p>
                      {designSansFonts.length} sans · {designSerifFonts.length}{' '}
                      serif · real site preview
                    </p>
                  </div>
                </div>
              </div>
              <button
                type='button'
                className={styles.iconButton}
                onClick={() => setSidebarOpen(false)}
                aria-label='Close controls'
              >
                <PanelLeftClose aria-hidden='true' />
              </button>
            </div>

            <div className={styles.controls}>
              <section className={styles.controlSection}>
                <h2 className={styles.sectionTitle}>Preview page</h2>
                <select
                  id='preview-page'
                  className={styles.select}
                  aria-label='Preview page'
                  value={selectedPage}
                  onChange={(event) => {
                    if (event.target.value !== 'custom') {
                      navigateTo(event.target.value)
                    }
                  }}
                >
                  {designPreviewPages.map((page) => (
                    <option key={page.path} value={page.path}>
                      {page.label}
                    </option>
                  ))}
                  <option value='custom' disabled={selectedPage !== 'custom'}>
                    Custom path
                  </option>
                </select>

                <form
                  className={styles.pathForm}
                  onSubmit={(event) => {
                    event.preventDefault()
                    navigateTo(draftPath)
                  }}
                >
                  <div className={styles.pathInputRow}>
                    <input
                      id='preview-path'
                      aria-label='Custom preview path'
                      placeholder='/any-page'
                      value={draftPath}
                      onChange={(event) => setDraftPath(event.target.value)}
                      spellCheck={false}
                      aria-invalid={Boolean(pathError)}
                    />
                    <button type='submit' aria-label='Load path'>
                      <ArrowRight aria-hidden='true' />
                    </button>
                  </div>
                  {pathError && <p className={styles.error}>{pathError}</p>}
                </form>
              </section>

              <section className={styles.fontBrowserSection}>
                <div
                  className={styles.panelTabs}
                  role='tablist'
                  aria-label='Fonts'
                >
                  <button
                    type='button'
                    role='tab'
                    aria-selected={panelMode === 'pairs'}
                    className={panelMode === 'pairs' ? styles.activeTab : ''}
                    onClick={() => setPanelMode('pairs')}
                  >
                    Pairs
                    <span>{designFontPairs.length}</span>
                  </button>
                  <button
                    type='button'
                    role='tab'
                    aria-selected={panelMode === 'library'}
                    className={panelMode === 'library' ? styles.activeTab : ''}
                    onClick={() => setPanelMode('library')}
                  >
                    Library
                    <span>
                      {designSansFonts.length + designSerifFonts.length}
                    </span>
                  </button>
                </div>

                {panelMode === 'pairs' ? (
                  <div className={styles.pairList} role='tabpanel'>
                    {designFontPairs.map((pair) => {
                      const isActive = pair.id === activePair?.id
                      const pairSans = getDesignFont(
                        designSansFonts,
                        pair.sansId,
                        'inter'
                      )
                      const pairSerif = getDesignFont(
                        designSerifFonts,
                        pair.serifId,
                        'crimson-pro'
                      )

                      return (
                        <button
                          key={pair.id}
                          type='button'
                          className={`${styles.pairButton} ${isActive ? styles.activePair : ''}`}
                          onClick={() => applyPair(pair.sansId, pair.serifId)}
                          aria-pressed={isActive}
                        >
                          <span
                            className={styles.pairSample}
                            style={{ fontFamily: pairSerif.family }}
                            aria-hidden='true'
                          >
                            Ag
                          </span>
                          <span className={styles.pairCopy}>
                            <strong style={{ fontFamily: pairSans.family }}>
                              {pair.name}
                            </strong>
                            <small>{pair.note}</small>
                          </span>
                          <span className={styles.pairCheck} aria-hidden='true'>
                            {isActive && <Check />}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className={styles.library} role='tabpanel'>
                    <label className={styles.searchField}>
                      <Search aria-hidden='true' />
                      <span className={styles.visuallyHidden}>
                        Search fonts
                      </span>
                      <input
                        type='search'
                        value={fontSearch}
                        onChange={(event) => setFontSearch(event.target.value)}
                        placeholder={`Search ${designSansFonts.length + designSerifFonts.length} fonts`}
                      />
                    </label>

                    <div className={styles.fontGroup}>
                      <div className={styles.fontGroupHeading}>
                        <h2>Sans-serif</h2>
                        <span>{filteredSansFonts.length}</span>
                      </div>
                      <FontOptionList
                        fonts={filteredSansFonts}
                        selectedId={sansFont.id}
                        onSelect={setSansId}
                        emptyLabel='No sans-serif matches.'
                      />
                    </div>

                    <div className={styles.fontGroup}>
                      <div className={styles.fontGroupHeading}>
                        <h2>Serif</h2>
                        <span>{filteredSerifFonts.length}</span>
                      </div>
                      <FontOptionList
                        fonts={filteredSerifFonts}
                        selectedId={serifFont.id}
                        onSelect={setSerifId}
                        emptyLabel='No serif matches.'
                      />
                    </div>
                  </div>
                )}
              </section>

              <section className={styles.scaleSection}>
                <div className={styles.scaleField}>
                  <span className={styles.scaleLabel}>
                    <label className={styles.fieldLabel} htmlFor='font-scale'>
                      Type scale
                    </label>
                    <output>{Math.round(scale * 100)}%</output>
                  </span>
                  <input
                    id='font-scale'
                    type='range'
                    min='0.9'
                    max='1.15'
                    step='0.01'
                    value={scale}
                    onChange={(event) => setScale(Number(event.target.value))}
                  />
                  <span className={styles.rangeLabels} aria-hidden='true'>
                    <span>90</span>
                    <span>100</span>
                    <span>115</span>
                  </span>
                </div>
              </section>
            </div>

            <div className={styles.sidebarFooter}>
              <button type='button' onClick={resetSettings}>
                <RotateCcw aria-hidden='true' /> Reset
              </button>
              <button type='button' onClick={copyShareLink}>
                {copied ? (
                  <Check aria-hidden='true' />
                ) : (
                  <Copy aria-hidden='true' />
                )}
                {copied ? 'Copied' : 'Copy setup'}
              </button>
            </div>
          </aside>

          <section className={styles.stage} aria-label='Site preview'>
            <header className={styles.stageToolbar}>
              {!sidebarOpen && (
                <button
                  type='button'
                  className={styles.iconButton}
                  onClick={() => setSidebarOpen(true)}
                  aria-label='Open controls'
                >
                  <PanelLeftOpen aria-hidden='true' />
                </button>
              )}
              <div className={styles.browserButtons}>
                <button
                  type='button'
                  onClick={() =>
                    iframeRef.current?.contentWindow?.history.back()
                  }
                  aria-label='Go back in preview'
                >
                  <ArrowLeft aria-hidden='true' />
                </button>
                <button
                  type='button'
                  onClick={() =>
                    iframeRef.current?.contentWindow?.history.forward()
                  }
                  aria-label='Go forward in preview'
                >
                  <ArrowRight aria-hidden='true' />
                </button>
              </div>
              <div className={styles.location} title={previewPath}>
                <span
                  className={isLoading ? styles.loadingDot : styles.readyDot}
                />
                <span>wustep.me{previewPath}</span>
              </div>
              <div className={styles.currentFonts}>
                <Type aria-hidden='true' />
                <span>{sansFont.name}</span>
                <span className={styles.fontPlus}>+</span>
                <span>{serifFont.name}</span>
              </div>
              <button
                type='button'
                className={styles.openPageButton}
                onClick={() =>
                  window.open(previewPath, '_blank', 'noopener,noreferrer')
                }
                aria-label='Open original page in a new tab'
              >
                <ExternalLink aria-hidden='true' />
              </button>
            </header>

            <div className={styles.canvas}>
              <div className={styles.browserFrame}>
                <iframe
                  ref={iframeRef}
                  src={previewPath}
                  title={`Typography preview of ${previewPath}`}
                  onLoad={handleFrameLoad}
                />
              </div>
              <div className={styles.canvasMeta} aria-hidden='true'>
                <span>LIVE / SAME-ORIGIN</span>
                <span>
                  SANS {sansFont.name.toUpperCase()} · SERIF{' '}
                  {serifFont.name.toUpperCase()}
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
