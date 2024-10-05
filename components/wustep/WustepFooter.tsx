import * as React from 'react'

import { site } from '@/lib/config'

// import { ApplauseButton } from './ApplauseButton'

/**
 * @wustep: Added my own personal footer
 */
export const WustepFooter = () => {
  return (
    <div className='wustep-post-footer'>
      <div className='wustep-post-footer-left'>
        <a href={`https://${site.domain}`}>
          <img src='/wustep.png' alt='Photo of Stephen Wu'></img>
        </a>
      </div>
      <div className='wustep-post-footer-content'>
        <div className='wustep-post-footer-content-author'>Stephen Wu</div>
        🚀 Building software in San Francisco, CA
      </div>
      {/* Sadly applause is no longer working w/o self-hosting. See https://github.com/ColinEberhardt/applause-button/issues/101
          Disabling for now until working again.
      <div className='wustep-post-footer-right'>
        <ApplauseButton />
      </div> 
      */}
    </div>
  )
}
