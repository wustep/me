import cs from 'classnames'
import { type Block } from 'notion-types'
import { uuidToId } from 'notion-utils'
import * as React from 'react'
import { Text } from 'react-notion-x'

import { type PostsViewMode } from '@/lib/posts-view'

import { PostsViewToggle } from './PostsViewToggle'

interface PostsHeadingToggleProps {
  headingBlock: Block
  currentView: PostsViewMode
  onSelectView: (view: PostsViewMode) => void
  disabled?: boolean
}

export function PostsHeadingToggle({
  headingBlock,
  currentView,
  onSelectView,
  disabled
}: PostsHeadingToggleProps) {
  const HeadingTag =
    headingBlock.type === 'header'
      ? 'h2'
      : headingBlock.type === 'sub_header'
        ? 'h3'
        : 'h4'
  const headingClassName = cs(
    'posts-heading',
    headingBlock.type === 'header' && 'notion-h notion-h1',
    headingBlock.type === 'sub_header' && 'notion-h notion-h2',
    headingBlock.type === 'sub_sub_header' && 'notion-h notion-h3'
  )
  const domId = uuidToId(headingBlock.id)

  return (
    <div className='posts-section'>
      <HeadingTag className={headingClassName}>
        <div id={domId} className='notion-header-anchor' />
        <span className='posts-heading__title'>
          <Text value={headingBlock.properties?.title} block={headingBlock} />
        </span>
        <PostsViewToggle
          currentView={currentView}
          onSelect={onSelectView}
          disabled={disabled}
        />
      </HeadingTag>
    </div>
  )
}

