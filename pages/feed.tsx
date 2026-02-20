import type { GetServerSideProps } from 'next'
import type { CollectionInstance, ExtendedRecordMap } from 'notion-types'
import {
  getBlockTitle,
  getBlockValue,
  getPageProperty,
  idToUuid,
  parsePageId
} from 'notion-utils'
import RSS from 'rss'

import * as config from '@/lib/config'
import { getSocialImageUrl } from '@/lib/get-social-image-url'
import { notion } from '@/lib/notion-api'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()
    return { props: {} }
  }

  if (!config.postsCollectionId || !config.postsCollectionViewId) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.write(
      JSON.stringify({
        error: 'postsCollectionId/postsCollectionViewId not configured'
      })
    )
    res.end()
    return { props: {} }
  }

  try {
    // Fetch the posts collection directly using collection + view IDs
    const postsCollectionUuid = idToUuid(config.postsCollectionId)
    const postsCollectionViewUuid = idToUuid(config.postsCollectionViewId)
    const collectionData = (await notion.getCollectionData(
      postsCollectionUuid,
      postsCollectionViewUuid
    )) as CollectionInstance
    const recordMap = collectionData.recordMap as ExtendedRecordMap | undefined

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

    if (!recordMap) {
      // Collection record map missing, return empty feed
      const feedText = feed.xml({ indent: true })
      res.setHeader(
        'Cache-Control',
        `public, max-age=${ttlSeconds}, s-maxage=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`
      )
      res.setHeader('Content-Type', 'text/xml; charset=utf-8')
      res.write(feedText)
      res.end()
      return { props: {} }
    }

    const collectionResult = collectionData.result
    const collectionBlockIds =
      collectionResult?.blockIds ??
      collectionResult?.collection_group_results?.blockIds ??
      collectionResult?.reducerResults?.collection_group_results?.blockIds ??
      []

    if (!collectionBlockIds.length) {
      const feedText = feed.xml({ indent: true })
      res.setHeader(
        'Cache-Control',
        `public, max-age=${ttlSeconds}, s-maxage=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`
      )
      res.setHeader('Content-Type', 'text/xml; charset=utf-8')
      res.write(feedText)
      res.end()
      return { props: {} }
    }

    // Get all pages that belong to this collection
    for (const blockId of collectionBlockIds) {
      const block =
        getBlockValue(recordMap.block?.[blockId]) ??
        getBlockValue(recordMap.block?.[idToUuid(blockId)])
      if (!block) continue

      // Check if this is a page from our posts collection
      if (
        block.type !== 'page' ||
        block.parent_table !== 'collection' ||
        parsePageId(block.parent_id, { uuid: false }) !==
          config.postsCollectionId
      ) {
        continue
      }

      // Check if the post is public
      const isPublic = getPageProperty<boolean>('Public', block, recordMap)
      if (!isPublic) {
        continue
      }

      const pageId = parsePageId(blockId, { uuid: false })!
      const title = getBlockTitle(block, recordMap) || config.name
      const description =
        getPageProperty<string>('Description', block, recordMap) ||
        config.description

      // Build the URL using the page slug or ID
      const slug =
        getPageProperty<string>('Slug', block, recordMap) ||
        title
          .toLowerCase()
          .replaceAll(/[^a-z0-9]+/g, '-')
          .replaceAll(/^-|-$/g, '')
      const url = `${config.host}/${slug}`

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
      `public, max-age=${ttlSeconds}, s-maxage=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`
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
