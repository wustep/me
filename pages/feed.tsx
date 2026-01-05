import type { GetServerSideProps } from 'next'
import { type ExtendedRecordMap } from 'notion-types'
import { getBlockTitle, getPageProperty, uuidToId } from 'notion-utils'
import RSS from 'rss'

import * as config from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { getSocialImageUrl } from '@/lib/get-social-image-url'
import { getCanonicalPageUrl } from '@/lib/map-page-url'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()
    return { props: {} }
  }

  try {
    const siteMap = await getSiteMap()
    const ttlMinutes = 24 * 60 // 24 hours
    const ttlSeconds = ttlMinutes * 60

    const feed = new RSS({
      title: config.name,
      site_url: config.host,
      feed_url: `${config.host}/feed.xml`,
      language: config.language,
      ttl: ttlMinutes
    })

    interface FeedItem {
      title: string
      url: string
      date: Date
      description: string
      enclosure?: { url: string; type: string }
    }

    const feedItems: FeedItem[] = []

    for (const pagePath of Object.keys(siteMap.canonicalPageMap)) {
      const pageId = siteMap.canonicalPageMap[pagePath]!
      const recordMap = siteMap.pageMap[pageId] as ExtendedRecordMap
      if (!recordMap) continue

      const keys = Object.keys(recordMap?.block || {})
      const block = recordMap?.block?.[keys[0]!]?.value
      if (!block) continue

      // Check if this page is from the Posts collection
      const isFromPostsCollection =
        block.type === 'page' &&
        block.parent_table === 'collection' &&
        config.postsCollectionId &&
        uuidToId(block.parent_id) === config.postsCollectionId

      if (!isFromPostsCollection) {
        continue
      }

      // Check if the post is public
      const isPublic = getPageProperty<boolean>('Public', block, recordMap)
      if (!isPublic) {
        continue
      }

      const title = getBlockTitle(block, recordMap) || config.name
      const description =
        getPageProperty<string>('Description', block, recordMap) ||
        config.description
      const url = getCanonicalPageUrl(config.site, recordMap)(pageId)
      const lastUpdatedTime = getPageProperty<number>(
        'Last Updated',
        block,
        recordMap
      )
      const publishedTime = getPageProperty<number>(
        'Published',
        block,
        recordMap
      )
      const date = publishedTime
        ? new Date(publishedTime)
        : lastUpdatedTime
          ? new Date(lastUpdatedTime)
          : new Date()
      const socialImageUrl = getSocialImageUrl(pageId)

      feedItems.push({
        title,
        url,
        date,
        description,
        enclosure: socialImageUrl
          ? {
              url: socialImageUrl,
              type: 'image/jpeg'
            }
          : undefined
      })
    }

    // Sort by date descending (newest first)
    feedItems.sort((a, b) => b.date.getTime() - a.date.getTime())

    // Add sorted items to feed
    for (const item of feedItems) {
      feed.item(item)
    }

    const feedText = feed.xml({ indent: true })

    res.setHeader(
      'Cache-Control',
      `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`
    )
    res.setHeader('Content-Type', 'text/xml; charset=utf-8')
    res.write(feedText)
    res.end()

    return { props: {} }
  } catch (err) {
    console.error('RSS feed error:', err)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.write(
      JSON.stringify({
        error: 'Failed to generate RSS feed',
        message: err instanceof Error ? err.message : 'Unknown error'
      })
    )
    res.end()
    return { props: {} }
  }
}

export default function noop() {
  return null
}
