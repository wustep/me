import * as React from 'react'

import ApplauseButton from './ApplauseButton'

export const PostFooter: React.FC = () => {
  return (
    <div className='wustep-post-footer'>
      <div className='wustep-post-footer-left'>
        <img src='/wustep.png' alt='Photo of Stephen Wu'></img>
      </div>
      <div className='wustep-post-footer-content'>
        <div className='wustep-post-footer-content-author'>Stephen Wu</div>
        🚀 Building software in San Francisco, CA
      </div>
      <div className='wustep-post-footer-right'>
        <ApplauseButton />
      </div>
    </div>
  )
}
