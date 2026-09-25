import { type Block, type ExtendedRecordMap } from 'notion-types'

import { getPageTweet } from '@/lib/get-page-tweet'

import { PageActions } from './PageActions'

export function PageAside({
  block,
  recordMap,
  isBlogPost
}: {
  block: Block
  recordMap: ExtendedRecordMap
  isBlogPost: boolean
}) {
  if (!block) {
    return null
  }

  // only display page actions on blog post pages; the footer carries the
  // social links everywhere else
  if (!isBlogPost) {
    return null
  }

  const tweet = getPageTweet(block, recordMap)
  if (!tweet) {
    return null
  }

  return <PageActions tweet={tweet} />
}
