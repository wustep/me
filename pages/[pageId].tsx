import { type GetStaticProps } from 'next'
import { parsePageId } from 'notion-utils'

import { NotionPage } from '@/components/NotionPage'
import { domain, isDev, pageUrlAdditions, pageUrlOverrides } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { type PageProps, type Params } from '@/lib/types'

function getNotionFallbackUrl(rawPageId: string): string | null {
  const notionPageId =
    pageUrlOverrides[rawPageId] ||
    pageUrlAdditions[rawPageId] ||
    parsePageId(rawPageId, { uuid: false })

  if (!notionPageId) return null
  return `https://wustep.notion.site/${notionPageId}`
}

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = context.params?.pageId as string

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    return { props, revalidate: 86_400 }
  } catch (err: unknown) {
    console.error('page error', domain, rawPageId, err)

    const fallbackUrl = getNotionFallbackUrl(rawPageId)

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
