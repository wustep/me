import {
  ArrowRight,
  Check,
  Copy,
  Image as ImageIcon,
  LoaderCircle,
  RotateCcw
} from 'lucide-react'
import Head from 'next/head'
import * as React from 'react'

import { DesignWorkbench } from '@/components/design/DesignWorkbench'

import styles from './social.module.css'

type SocialMetadata = {
  title: string
  description: string
  image: string
  siteName: string
  url: string
}

const defaultMetadata: SocialMetadata = {
  title: 'Stephen Wu',
  description:
    "I'm Stephen, a product engineer building software in San Francisco, CA.",
  image: '/favicon-512x512.png',
  siteName: 'wustep.me',
  url: 'https://wustep.me/'
}

function getMeta(doc: Document, key: string) {
  return (
    doc.querySelector<HTMLMetaElement>(`meta[property='${key}']`)?.content ||
    doc.querySelector<HTMLMetaElement>(`meta[name='${key}']`)?.content ||
    ''
  )
}

function normalizeLocalPath(value: string) {
  const url = new URL(value.trim() || '/', window.location.origin)
  if (url.origin !== window.location.origin) {
    throw new Error('Load a path from this site, such as / or /headspace.')
  }
  if (url.pathname.startsWith('/design')) {
    throw new Error('Choose a public site page outside the design tools.')
  }
  return `${url.pathname}${url.search}`
}

export default function SocialDesignPage() {
  const [path, setPath] = React.useState('/')
  const [metadata, setMetadata] =
    React.useState<SocialMetadata>(defaultMetadata)
  const [loadedMetadata, setLoadedMetadata] =
    React.useState<SocialMetadata>(defaultMetadata)
  const [view, setView] = React.useState<'all' | 'og' | 'x' | 'search'>('all')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [copied, setCopied] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  React.useEffect(() => {
    setImageError(false)
  }, [metadata.image])

  const loadMetadata = async () => {
    setLoading(true)
    setError('')

    try {
      const localPath = normalizeLocalPath(path)
      const response = await fetch(localPath)
      if (!response.ok) {
        throw new Error(`That page returned ${response.status}.`)
      }

      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const title =
        getMeta(doc, 'og:title') || doc.title || defaultMetadata.title
      const description =
        getMeta(doc, 'og:description') ||
        getMeta(doc, 'description') ||
        defaultMetadata.description
      const image = getMeta(doc, 'og:image') || defaultMetadata.image
      const siteName = getMeta(doc, 'og:site_name') || defaultMetadata.siteName
      const url =
        getMeta(doc, 'og:url') ||
        new URL(localPath, window.location.origin).toString()
      const nextMetadata = { title, description, image, siteName, url }

      setPath(localPath)
      setMetadata(nextMetadata)
      setLoadedMetadata(nextMetadata)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load that page.')
    } finally {
      setLoading(false)
    }
  }

  const resetOverrides = () => {
    setMetadata(loadedMetadata)
    setError('')
  }

  const copyMetadata = async () => {
    await navigator.clipboard.writeText(JSON.stringify(metadata, null, 2))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const controls = (
    <>
      <section className={styles.controlSection}>
        <label className={styles.controlLabel} htmlFor='social-path'>
          Load existing metadata
        </label>
        <form
          className={styles.pathForm}
          onSubmit={(event) => {
            event.preventDefault()
            void loadMetadata()
          }}
        >
          <input
            id='social-path'
            value={path}
            onChange={(event) => setPath(event.target.value)}
            placeholder='/headspace'
            spellCheck={false}
            aria-invalid={Boolean(error)}
          />
          <button type='submit' disabled={loading}>
            {loading ? (
              <LoaderCircle className={styles.spinner} aria-hidden='true' />
            ) : (
              <ArrowRight aria-hidden='true' />
            )}
            <span className={styles.visuallyHidden}>Load metadata</span>
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </section>

      <section className={styles.controlSection}>
        <div className={styles.sectionHeading}>
          <span>Temporary overrides</span>
          <span>Live preview</span>
        </div>
        <label className={styles.field}>
          <span>
            Title <output>{metadata.title.length}/70</output>
          </span>
          <textarea
            rows={2}
            value={metadata.title}
            onChange={(event) =>
              setMetadata((current) => ({
                ...current,
                title: event.target.value
              }))
            }
          />
        </label>
        <label className={styles.field}>
          <span>
            Description <output>{metadata.description.length}/160</output>
          </span>
          <textarea
            rows={4}
            value={metadata.description}
            onChange={(event) =>
              setMetadata((current) => ({
                ...current,
                description: event.target.value
              }))
            }
          />
        </label>
        <label className={styles.field}>
          <span>Image URL</span>
          <div className={styles.inputWithIcon}>
            <ImageIcon aria-hidden='true' />
            <input
              value={metadata.image}
              onChange={(event) =>
                setMetadata((current) => ({
                  ...current,
                  image: event.target.value
                }))
              }
              spellCheck={false}
            />
          </div>
        </label>
        <label className={styles.field}>
          <span>Site name</span>
          <input
            value={metadata.siteName}
            onChange={(event) =>
              setMetadata((current) => ({
                ...current,
                siteName: event.target.value
              }))
            }
          />
        </label>
        <label className={styles.field}>
          <span>Canonical URL</span>
          <input
            value={metadata.url}
            onChange={(event) =>
              setMetadata((current) => ({
                ...current,
                url: event.target.value
              }))
            }
            spellCheck={false}
          />
        </label>
      </section>
    </>
  )

  const controlsFooter = (
    <div className={styles.footerActions}>
      <button type='button' onClick={resetOverrides}>
        <RotateCcw aria-hidden='true' /> Reset overrides
      </button>
      <button type='button' onClick={() => void copyMetadata()}>
        {copied ? <Check aria-hidden='true' /> : <Copy aria-hidden='true' />}
        {copied ? 'Copied' : 'Copy JSON'}
      </button>
    </div>
  )

  const toolbar = (
    <>
      <div className={styles.viewTabs} aria-label='Preview format'>
        {(
          [
            ['all', 'All'],
            ['og', 'Open Graph'],
            ['x', 'X'],
            ['search', 'Search']
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type='button'
            className={view === value ? styles.selectedView : ''}
            onClick={() => setView(value)}
            aria-pressed={view === value}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  )

  const showOg = view === 'all' || view === 'og'
  const showX = view === 'all' || view === 'x'
  const showSearch = view === 'all' || view === 'search'

  return (
    <>
      <Head>
        <title>Social · Design workbench</title>
        <meta
          name='description'
          content='Preview and edit social metadata for site pages.'
        />
        <meta name='robots' content='noindex,nofollow' />
      </Head>

      <DesignWorkbench
        activeTool='social'
        title='Social'
        description='Load real page metadata, then test temporary overrides across formats.'
        controls={controls}
        controlsFooter={controlsFooter}
        toolbar={toolbar}
        status={loading ? 'Loading' : copied ? 'Copied' : 'Ready'}
      >
        <div className={styles.previewGrid}>
          {showOg && (
            <section className={styles.previewSection}>
              <header>
                <h2>Open Graph</h2>
                <span>1.91:1</span>
              </header>
              <div className={styles.ogCard}>
                <div className={styles.ogImage}>
                  {!imageError ? (
                    <img
                      src={metadata.image}
                      alt='Open Graph preview'
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className={styles.imageFallback}>
                      <ImageIcon aria-hidden='true' />
                      <span>Image failed to load</span>
                    </div>
                  )}
                </div>
                <div className={styles.ogCopy}>
                  <span>{metadata.siteName}</span>
                  <strong>{metadata.title || 'Untitled page'}</strong>
                  <p>{metadata.description || 'No description provided.'}</p>
                </div>
              </div>
            </section>
          )}

          {showX && (
            <section className={styles.previewSection}>
              <header>
                <h2>X large image</h2>
                <span>Summary card</span>
              </header>
              <div className={styles.xCard}>
                <div className={styles.xImage}>
                  {!imageError ? (
                    <img src={metadata.image} alt='X card preview' />
                  ) : (
                    <ImageIcon aria-hidden='true' />
                  )}
                </div>
                <div className={styles.xCopy}>
                  <strong>{metadata.title || 'Untitled page'}</strong>
                  <p>{metadata.description || 'No description provided.'}</p>
                  <span>{metadata.siteName}</span>
                </div>
              </div>
            </section>
          )}

          {showSearch && (
            <section className={styles.previewSection}>
              <header>
                <h2>Search result</h2>
                <span>Desktop</span>
              </header>
              <div className={styles.searchCard}>
                <div className={styles.searchSite}>
                  <img src='/favicon-32x32.png' alt='' />
                  <span>
                    <strong>{metadata.siteName}</strong>
                    <small>{metadata.url}</small>
                  </span>
                </div>
                <h3>{metadata.title || 'Untitled page'}</h3>
                <p>{metadata.description || 'No description provided.'}</p>
              </div>
            </section>
          )}
        </div>
      </DesignWorkbench>
    </>
  )
}
