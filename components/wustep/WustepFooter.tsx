import * as React from 'react'

import { site } from '@/lib/config'

// import { ApplauseButton } from './ApplauseButton'

/**
 * @wustep: Added my own personal footer
 */
export function WustepFooter() {
  return (
    <div className='wustep-post-footer'>
      <div className='wustep-post-footer-left'>
        <a href={`https://${site.domain}`}>
          <img src='/wustep.png' alt='Stephen Wu' className='w-10 h-10' />
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
