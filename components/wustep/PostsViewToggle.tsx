import { BiGridAlt } from '@react-icons/all-files/bi/BiGridAlt'
import { BiListUl } from '@react-icons/all-files/bi/BiListUl'
import cs from 'classnames'
import * as React from 'react'

import { type PostsViewMode } from '@/lib/posts-view'

interface PostsViewToggleProps {
  currentView: PostsViewMode
  onSelect: (view: PostsViewMode) => void
  disabled?: boolean
}

const options: Array<{
  id: PostsViewMode
  label: string
  Icon: typeof BiGridAlt
}> = [
  {
    id: 'gallery',
    label: 'Gallery view',
    Icon: BiGridAlt
  },
  {
    id: 'list',
    label: 'List view',
    Icon: BiListUl
  }
]

export function PostsViewToggle({
  currentView,
  onSelect,
  disabled
}: PostsViewToggleProps) {
  return (
    <nav className='posts-view-toggle' aria-label='Posts layout toggle'>
      {options.map(({ id, label, Icon }) => {
        const isActive = id === currentView

        return (
          <button
            key={id}
            type='button'
            className={cs('posts-view-toggle__button', {
              'posts-view-toggle__button--active': isActive
            })}
            aria-pressed={isActive}
            title={label}
            onClick={() => onSelect(id)}
            disabled={disabled}
          >
            <Icon aria-hidden='true' />
            <span className='sr-only'>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

