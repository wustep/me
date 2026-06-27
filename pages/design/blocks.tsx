import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  Code2,
  Image as ImageIcon,
  List,
  Monitor,
  Moon,
  Search,
  Smartphone,
  Sun,
  Tablet,
  Type
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import * as React from 'react'

import { DesignWorkbench } from '@/components/design/DesignWorkbench'
import {
  createDesignBlocksRecordMap,
  type DesignBlockCategory,
  designBlockDefinitions,
  designBlocksRootId
} from '@/lib/design-blocks-record-map'

import styles from './blocks.module.css'

const DesignBlocksPreview = dynamic(
  () => import('@/components/design/DesignBlocksPreview'),
  {
    ssr: false,
    loading: () => (
      <div className={styles.previewLoading}>Loading production renderer…</div>
    )
  }
)

const categories: Array<'All blocks' | DesignBlockCategory> = [
  'All blocks',
  'Typography',
  'Lists',
  'Rich content',
  'Media'
]

function jumpToBlock(blockId: string, fallbackSelector?: string) {
  const block =
    document.querySelector(`.notion-block-${blockId.replaceAll('-', '')}`) ??
    (fallbackSelector ? document.querySelector(fallbackSelector) : null)

  block?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export default function BlocksDesignPage() {
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const [search, setSearch] = React.useState('')
  const [category, setCategory] =
    React.useState<(typeof categories)[number]>('All blocks')
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')
  const [articleWidth, setArticleWidth] = React.useState<
    'narrow' | 'reading' | 'wide'
  >('reading')
  const [viewport, setViewport] = React.useState<
    'desktop' | 'tablet' | 'phone'
  >('desktop')

  React.useEffect(() => {
    const roots = [document.documentElement, document.body]
    const previousModes = roots.map((root) => ({
      dark: root.classList.contains('dark-mode'),
      light: root.classList.contains('light-mode')
    }))

    for (const root of roots) {
      root.classList.remove('dark-mode')
      root.classList.add('light-mode')
    }

    return () => {
      for (const [index, root] of roots.entries()) {
        const previousMode = previousModes[index]!
        root.classList.toggle('dark-mode', previousMode.dark)
        root.classList.toggle('light-mode', previousMode.light)
      }
    }
  }, [])

  React.useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  const normalizedSearch = search.trim().toLowerCase()
  const visibleGroups = designBlockDefinitions.filter(
    (group) =>
      (category === 'All blocks' || group.category === category) &&
      `${group.label} ${group.category}`
        .toLowerCase()
        .includes(normalizedSearch)
  )
  const recordMap = React.useMemo(
    () => createDesignBlocksRecordMap(visibleGroups.map((group) => group.id)),
    [visibleGroups]
  )

  const articleWidths = {
    narrow: '620px',
    reading: '720px',
    wide: '900px'
  }

  const controls = (
    <>
      <section className={styles.controlSection}>
        <label className={styles.searchField}>
          <Search aria-hidden='true' />
          <span className={styles.visuallyHidden}>Search blocks</span>
          <input
            ref={searchInputRef}
            type='search'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder='Search blocks'
          />
          <kbd>⌘K</kbd>
        </label>

        <div className={styles.filterList} aria-label='Block category'>
          {categories.map((item) => (
            <button
              key={item}
              type='button'
              className={category === item ? styles.selectedFilter : ''}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.controlSection}>
        <div className={styles.controlLabel}>Production page settings</div>
        <div className={styles.segmented} aria-label='Color mode'>
          <button
            type='button'
            className={theme === 'light' ? styles.selectedSegment : ''}
            onClick={() => setTheme('light')}
            aria-pressed={theme === 'light'}
          >
            <Sun aria-hidden='true' /> Light
          </button>
          <button
            type='button'
            className={theme === 'dark' ? styles.selectedSegment : ''}
            onClick={() => setTheme('dark')}
            aria-pressed={theme === 'dark'}
          >
            <Moon aria-hidden='true' /> Dark
          </button>
        </div>

        <div className={styles.controlRow}>
          <span>Article width</span>
          <div className={styles.iconSegments} aria-label='Article width'>
            {(
              [
                ['narrow', AlignCenter, 'Narrow'],
                ['reading', AlignLeft, 'Reading'],
                ['wide', AlignJustify, 'Wide']
              ] as const
            ).map(([value, Icon, label]) => (
              <button
                key={value}
                type='button'
                className={articleWidth === value ? styles.selectedIcon : ''}
                onClick={() => setArticleWidth(value)}
                aria-label={label}
                aria-pressed={articleWidth === value}
              >
                <Icon aria-hidden='true' />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.blockIndex}>
        <div className={styles.indexHeader}>
          <span>Rendered blocks</span>
          <span>{visibleGroups.length}</span>
        </div>
        {visibleGroups.map((group) => (
          <button
            key={group.id}
            type='button'
            onClick={() =>
              jumpToBlock(
                group.blockIds[0]!,
                group.id === 'code' ? '.notion-code' : undefined
              )
            }
          >
            {group.category === 'Typography' && <Type aria-hidden='true' />}
            {group.category === 'Lists' && <List aria-hidden='true' />}
            {group.category === 'Rich content' && <Code2 aria-hidden='true' />}
            {group.category === 'Media' && <ImageIcon aria-hidden='true' />}
            <span>{group.label}</span>
          </button>
        ))}
        {visibleGroups.length === 0 && (
          <p className={styles.emptyIndex}>No blocks match “{search}”.</p>
        )}
      </section>
    </>
  )

  const toolbar = (
    <>
      <div className={styles.toolbarLabel}>
        <span className={styles.localDot} />
        Production renderer · local record map
      </div>
      <div className={styles.viewportControls} aria-label='Preview viewport'>
        {(
          [
            ['desktop', Monitor, 'Desktop'],
            ['tablet', Tablet, 'Tablet'],
            ['phone', Smartphone, 'Phone']
          ] as const
        ).map(([value, Icon, label]) => (
          <button
            key={value}
            type='button'
            className={viewport === value ? styles.selectedViewport : ''}
            onClick={() => setViewport(value)}
            aria-label={label}
            aria-pressed={viewport === value}
          >
            <Icon aria-hidden='true' />
          </button>
        ))}
      </div>
      <span className={styles.toolbarSummary}>
        {visibleGroups.length} groups · {theme}
      </span>
    </>
  )

  return (
    <>
      <Head>
        <title>Blocks · Design workbench</title>
        <meta
          name='description'
          content='A local visual fixture for the production block renderer.'
        />
        <meta name='robots' content='noindex,nofollow' />
      </Head>

      <DesignWorkbench
        activeTool='blocks'
        title='Blocks'
        description='The actual production renderer, driven by a deterministic local record map.'
        controls={controls}
        toolbar={toolbar}
      >
        <div className={styles.previewSurface}>
          <div
            className={`${styles.rendererFrame} ${styles[viewport]}`}
            style={
              {
                '--notion-max-width': articleWidths[articleWidth]
              } as React.CSSProperties
            }
          >
            <DesignBlocksPreview
              recordMap={recordMap}
              rootPageId={designBlocksRootId}
              darkMode={theme === 'dark'}
            />
          </div>
        </div>
      </DesignWorkbench>
    </>
  )
}
