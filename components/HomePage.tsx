import * as React from 'react'
import BodyClassName from 'react-body-classname'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'
import { usePostsViewMode } from '@/lib/use-posts-view-mode'

import { NotionPage } from './NotionPage'
import { PostsHeadingToggle } from './wustep/PostsHeadingToggle'

export function HomePage(props: types.PageProps) {
  const [viewMode, setViewMode, isInitialized] = usePostsViewMode()
  const toggleRef = React.useRef<HTMLDivElement>(null)

  const hasPostsToggle =
    config.homePostsCalloutBlockId &&
    config.homePostsHeadingBlockId &&
    config.homeGalleryBlockIds.length > 0 &&
    config.homeListBlockIds.length > 0

  // Insert the posts toggle after the callout block
  // This is a bit hacky and non-Reacty, but it's sorta a workaround that must be done because we can't otherwise override the components inside.
  React.useEffect(() => {
    if (!hasPostsToggle || !toggleRef.current) {
      return
    }

    // Find the callout block by its ID
    const calloutBlock = document.querySelector(
      `.notion-block-${config.homePostsCalloutBlockId}`
    )

    if (calloutBlock && toggleRef.current) {
      // Insert the toggle after the callout block
      calloutBlock.after(toggleRef.current)
    }
  }, [hasPostsToggle, props.recordMap])

  // Build CSS classes to hide the appropriate blocks
  const bodyClasses = React.useMemo(() => {
    if (!hasPostsToggle) {
      return undefined
    }

    const classes = ['home-posts-toggle-enabled', `home-view-mode-${viewMode}`]
    return classes.join(' ')
  }, [hasPostsToggle, viewMode])

  // Generate dynamic CSS to hide blocks based on view mode
  const dynamicCSS = React.useMemo(() => {
    if (!hasPostsToggle) {
      return null
    }

    const css: string[] = []

    // Hide the original heading block
    if (config.homePostsHeadingBlockId) {
      css.push(`
        .home-posts-toggle-enabled .notion-block-${config.homePostsHeadingBlockId} {
          display: none !important;
        }
      `)
    }

    // Hide ALL posts blocks by default (both gallery and list)
    const allBlockIds = [
      ...config.homeGalleryBlockIds,
      ...config.homeListBlockIds
    ]

    if (allBlockIds.length > 0) {
      const allSelectors = allBlockIds
        .map((id) => `.home-posts-toggle-enabled .notion-block-${id}`)
        .join(',\n')
      css.push(`
        ${allSelectors} {
          display: none !important;
        }
      `)
    }

    // Only show blocks if initialized
    if (isInitialized) {
      // Show list blocks in list mode
      if (config.homeListBlockIds.length > 0) {
        const listSelectors = config.homeListBlockIds
          .map(
            (id) =>
              `.home-posts-toggle-enabled.home-view-mode-list .notion-block-${id}`
          )
          .join(',\n')
        css.push(`
          ${listSelectors} {
            display: block !important;
          }
        `)
      }

      // Show gallery blocks in gallery mode
      if (config.homeGalleryBlockIds.length > 0) {
        const gallerySelectors = config.homeGalleryBlockIds
          .map(
            (id) =>
              `.home-posts-toggle-enabled.home-view-mode-gallery .notion-block-${id}`
          )
          .join(',\n')
        css.push(`
          ${gallerySelectors} {
            display: block !important;
          }
        `)
      }
    }

    return css.join('\n')
  }, [hasPostsToggle, isInitialized])

  console.log(bodyClasses, dynamicCSS, isInitialized)

  if (!hasPostsToggle) {
    return <NotionPage {...props} />
  }

  return (
    <>
      {bodyClasses && <BodyClassName className={bodyClasses} />}

      {/* Inject dynamic CSS for hiding blocks */}
      {dynamicCSS && <style dangerouslySetInnerHTML={{ __html: dynamicCSS }} />}

      {/* Render the toggle - will be moved into position by useEffect */}
      <div
        ref={toggleRef}
        className='custom-posts-toggle-wrapper'
        style={{ display: isInitialized ? 'block' : 'none' }}
      >
        <PostsHeadingToggle
          blockId={config.homePostsHeadingBlockId!}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      <NotionPage {...props} />
    </>
  )
}
