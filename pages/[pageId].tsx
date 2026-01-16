import { type GetStaticProps } from 'next'

import { NotionPage } from '@/components/NotionPage'
import { domain, isDev, pageUrlOverrides } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { type PageProps, type Params } from '@/lib/types'

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = context.params?.pageId as string

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    return { props, revalidate: 10 }
  } catch (err: unknown) {
    console.error('page error', domain, rawPageId, err)
    return {
      props: {
        error: {
          message: 'Error',
          statusCode: 500
        }
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

  // ======== @wustep: add sitemap pages to be included ========

  // Get paths from sitemap
  const siteMapPaths = Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
    params: {
      pageId
    }
  }))

  // Add URL override paths (e.g., /articles, /notes, /projects)
  // These might not be in the sitemap if they're not directly linked from root
  const overridePaths = Object.keys(pageUrlOverrides).map((path) => ({
    params: {
      pageId: path
    }
  }))

  // Combine and deduplicate paths
  const allPaths = [...siteMapPaths]
  const existingPageIds = new Set(siteMapPaths.map((p) => p.params.pageId))
  for (const overridePath of overridePaths) {
    if (!existingPageIds.has(overridePath.params.pageId)) {
      allPaths.push(overridePath)
    }
  }

  // ================

  const staticPaths = {
    paths: allPaths,
    fallback: true
  }

  console.log(staticPaths.paths)
  return staticPaths
}

export default function NotionDomainDynamicPage(props: PageProps) {
  return <NotionPage {...props} />
}
