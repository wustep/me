import type * as types from 'notion-types'
import cs from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { Breadcrumbs, Header, Search, useNotionContext } from 'react-notion-x'

import {
  ImLab,
  IoMoonSharp,
  IoSunnyOutline
} from '@/components/icons/InlineIcons'
import {
  isSearchEnabled,
  navigationLinks,
  navigationStyle,
  pageUrlOverrides
} from '@/lib/config'
import { useDarkMode } from '@/lib/use-dark-mode'

import styles from './styles.module.css'

const auxiliaryPaths = new Set(
  Object.keys(pageUrlOverrides).map((path) => `/${path}`)
)

export function NotionPageHeader({
  block
}: {
  block: types.CollectionViewPageBlock | types.PageBlock
}) {
  const { components, mapPageUrl } = useNotionContext()
  const router = useRouter()
  const isAuxiliaryPage = auxiliaryPaths.has(router.asPath.split('?')[0]!.split('#')[0]!)

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        {isAuxiliaryPage ? (
          <Link href='/' className={styles.homeBackButton} aria-label='Back to home'>
            <span className={styles.homeBackArrow}>←</span>
          </Link>
        ) : (
          <Breadcrumbs block={block} rootOnly={true} />
        )}

        <div className='notion-nav-header-rhs breadcrumbs'>
          {navigationLinks
            ?.map((link, index) => {
              if (!link?.pageId && !link?.url) {
                return null
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.PageLink>
                )
              } else {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.Link>
                )
              }
            })
            .filter(Boolean)}

          <PlaygroundButton />
          <ToggleThemeButton />

          {isSearchEnabled && <Search block={block} title={null} />}
        </div>
      </div>
    </header>
  )
}

function ToggleThemeButton() {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const onToggleTheme = React.useCallback(() => {
    toggleDarkMode()
  }, [toggleDarkMode])

  return (
    <button
      type='button'
      className={cs(
        'breadcrumb',
        'button',
        styles.themeButton,
        !hasMounted && styles.hidden
      )}
      onClick={onToggleTheme}
      aria-label={hasMounted && isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={hasMounted ? isDarkMode : undefined}
      title='Toggle theme'
    >
      {hasMounted && isDarkMode ? (
        <IoMoonSharp
          className={cs('w-4 h-4', styles.themeIcon, styles.moonIcon)}
        />
      ) : (
        <IoSunnyOutline
          className={cs('w-4 h-4', styles.themeIcon, styles.sunIcon)}
        />
      )}
    </button>
  )
}

function PlaygroundButton() {
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <Link
      href='/playground'
      className={cs(
        'breadcrumb',
        'button',
        styles.playgroundButton,
        !hasMounted && styles.hidden
      )}
      aria-label='Open playground'
      title='Open playground'
    >
      <ImLab className={cs('w-4 h-4', styles.playgroundIcon)} />
    </Link>
  )
}
