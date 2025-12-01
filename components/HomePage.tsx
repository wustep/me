import type { Block } from 'notion-types'
import cs from 'classnames'
import { getBlockTitle, parsePageId } from 'notion-utils'
import * as React from 'react'
import BodyClassName from 'react-body-classname'

import { NotionPage } from '@/components/NotionPage'
import * as config from '@/lib/config'
import { type PostsViewMode } from '@/lib/posts-view'
import { type PageProps } from '@/lib/types'
import { useHomePostsViewPreference } from '@/lib/use-home-posts-view'

import { PostsHeadingToggle } from './wustep/PostsHeadingToggle'

const POSTS_HEADING_TEXT = 'posts'
const POSTS_HEADING_TYPES = new Set(['header', 'sub_header', 'sub_sub_header'])

const HOME_VIEW_VISIBILITY_STYLES = [
  config.homeGalleryBlockId
    ? `.home-view-list .notion-block-${config.homeGalleryBlockId} { display: none !important; }`
    : '',
  ...(config.homeListBlockIds ?? []).map(
    (blockId) =>
      `.home-view-gallery .notion-block-${blockId} { display: none !important; }`
  ),
  config.homePostsHeadingBlockId
    ? `.home-view .notion-block-${config.homePostsHeadingBlockId} { display: none !important; }`
    : ''
]
  .filter(Boolean)
  .join('\n')

export function HomePage(props: PageProps) {
  const { recordMap } = props
  const [view, setView] = useHomePostsViewPreference('gallery')

  const headingBlock = React.useMemo(() => {
    const overrideBlock = getBlockValue(
      recordMap,
      normalizeNotionId(config.homePostsHeadingBlockId)
    )

    if (overrideBlock) {
      return overrideBlock
    }

    return getBlockValue(
      recordMap,
      findHeadingBlockId(recordMap, POSTS_HEADING_TEXT)
    )
  }, [recordMap])

  const bodyClassName = cs('home-view', `home-view-${view}`)

  const handleSelectView = React.useCallback(
    (nextView: PostsViewMode) => {
      setView(nextView)
    },
    [setView]
  )

  return (
    <>
      <BodyClassName className={bodyClassName} />
      {HOME_VIEW_VISIBILITY_STYLES && (
        <style jsx global>{HOME_VIEW_VISIBILITY_STYLES}</style>
      )}

      {headingBlock && (
        <PostsHeadingToggle
          headingBlock={headingBlock}
          currentView={view}
          onSelectView={handleSelectView}
        />
      )}

      <NotionPage {...props} />
    </>
  )
}

function findHeadingBlockId(
  recordMap: PageProps['recordMap'],
  title: string
): string | null {
  if (!recordMap?.block) {
    return null
  }

  const normalizedTitle = title.trim().toLowerCase()

  for (const [blockId, block] of Object.entries(recordMap.block)) {
    const blockValue = block?.value as Block | undefined

    if (!blockValue || !POSTS_HEADING_TYPES.has(blockValue.type)) {
      continue
    }

    const blockTitle = getBlockTitle(blockValue, recordMap)

    if (blockTitle?.trim().toLowerCase() === normalizedTitle) {
      return normalizeNotionId(blockId)
    }
  }

  return null
}

function getBlockValue(
  recordMap: PageProps['recordMap'],
  blockId?: string | null
) {
  if (!recordMap?.block || !blockId) {
    return null
  }

  return recordMap.block[blockId]?.value ?? null
}

function normalizeNotionId(id?: string | null) {
  if (!id) {
    return null
  }

  return parsePageId(id, { uuid: false })
}

