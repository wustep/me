import { type GetStaticProps } from 'next'
import { parsePageId } from 'notion-utils'

import { NotionPage } from '@/components/NotionPage'
import { domain, isDev, pageUrlAdditions, pageUrlOverrides } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { normalizePageIdPath } from '@/lib/normalize-page-id-path'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { type PageProps, type Params } from '@/lib/types'

async function getNotionFallbackUrl(rawPageId: string): Promise<string | null> {
  const normalizedRawPageId = normalizePageIdPath(rawPageId)
  let notionPageId =
    pageUrlOverrides[rawPageId] ||
    pageUrlAdditions[rawPageId] ||
    pageUrlOverrides[normalizedRawPageId] ||
    pageUrlAdditions[normalizedRawPageId] ||
    parsePageId(normalizedRawPageId, { uuid: false })

  if (!notionPageId) {
    try {
      const siteMap = await getSiteMap()
      notionPageId =
        siteMap.canonicalPageMap[rawPageId] ||
        siteMap.canonicalPageMap[normalizedRawPageId]
    } catch (err) {
      console.warn('error resolving notion fallback URL', rawPageId, err)
    }
  }

  if (!notionPageId) return null
  const normalizedNotionPageId = parsePageId(notionPageId, { uuid: false })
  if (!normalizedNotionPageId) return null

  return `https://wustep.notion.site/${normalizedNotionPageId}`
}

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const requestedPageId = context.params?.pageId as string
  const normalizedPageId = normalizePageIdPath(requestedPageId)

  try {
    const props = await resolveNotionPage(domain, normalizedPageId)

    return { props, revalidate: 86_400 }
  } catch (err: unknown) {
    console.error('page error', domain, requestedPageId, err)

    const fallbackUrl = await getNotionFallbackUrl(normalizedPageId)

    return {
      props: {
        error: {
          message: 'Error',
          statusCode: 500
        },
        ...(fallbackUrl && { notionFallbackUrl: fallbackUrl })
      },
      revalidate: 10
    }
  }
}

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  const siteMap = await getSiteMap()

  // Combine sitemap paths with URL overrides (e.g., /articles, /notes)
  // URL overrides might not be in the sitemap if not directly linked from root
  const allPageIds = [
    ...new Set([
      ...Object.keys(siteMap.canonicalPageMap),
      ...Object.keys(pageUrlOverrides)
    ])
  ]

  const staticPaths = {
    paths: allPageIds.map((pageId) => ({ params: { pageId } })),
    fallback: true
  }

  console.log(staticPaths.paths)
  return staticPaths
}

export default function NotionDomainDynamicPage(props: PageProps) {
  return <NotionPage {...props} />
}
