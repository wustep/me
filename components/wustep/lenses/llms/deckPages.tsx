import type { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'

import { domain, host, name, x } from '@/lib/config'
import { deckSlugFromBasePath, getLensImageUrl } from '@/lib/lens-card'
import { shareCardMeta } from '@/lib/share-card'

import type { Deck } from '../deck'
import { LensesPage } from '../LensesPage'

/* ─────────────────────────────────────────────────────────
 * Route factories for the model decks.
 *
 *   Each deck owns two routes — `${basePath}` (the canvas) and
 *   `${basePath}/<lensId>` (same canvas, panel seeded from the path,
 *   per-lens SEO). The pages are identical apart from the deck and
 *   copy, so the three deck directories under pages/lenses/llms
 *   stay ~10 lines each.
 * ───────────────────────────────────────────────────────── */

function DeckHead({
  title,
  description,
  canonicalUrl,
  previewImage
}: {
  title: string
  description: string
  canonicalUrl: string
  previewImage: string
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} />
      <link rel='canonical' href={canonicalUrl} />
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content={name} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={canonicalUrl} />
      {shareCardMeta(previewImage)}
      <meta name='twitter:domain' content={domain} />
      {x && <meta name='twitter:creator' content={`@${x}`} />}
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
    </Head>
  )
}

/** The deck's canvas route (e.g. /lenses/llms/opus). */
export function makeDeckIndexPage(deck: Deck, seoTitle: string) {
  function DeckIndexPage() {
    return (
      <>
        <DeckHead
          title={seoTitle}
          description={`${deck.center.tagline} ${deck.dialog.title}`}
          canonicalUrl={`${host}${deck.basePath}`}
          previewImage={getLensImageUrl(
            host,
            deckSlugFromBasePath(deck.basePath)
          )}
        />
        <LensesPage deck={deck} />
      </>
    )
  }
  return DeckIndexPage
}

type DeckLensProps = {
  lensTitle: string
  lensTagline: string
  lensId: string
}

/** The deck's per-lens deep-link route (e.g. /lenses/llms/opus/tempo).
 *  LensesPage reads `router.query.lensId` to seed the open panel. */
export function makeDeckLensRoute(deck: Deck, seoSuffix: string) {
  function DeckLensPage({ lensTitle, lensTagline, lensId }: DeckLensProps) {
    return (
      <>
        <DeckHead
          title={`${lensTitle} — ${seoSuffix}`}
          description={lensTagline}
          canonicalUrl={`${host}${deck.basePath}/${lensId}`}
          previewImage={getLensImageUrl(
            host,
            deckSlugFromBasePath(deck.basePath),
            lensId
          )}
        />
        <LensesPage deck={deck} />
      </>
    )
  }

  const getStaticPaths: GetStaticPaths = () => ({
    paths: deck.lenses.map((lens) => ({ params: { lensId: lens.id } })),
    fallback: false
  })

  const getStaticProps: GetStaticProps<DeckLensProps> = ({ params }) => {
    const lensId = typeof params?.lensId === 'string' ? params.lensId : ''
    const lens = deck.lensById[lensId]
    if (!lens) return { notFound: true }
    return {
      props: {
        lensId,
        lensTitle: lens.title,
        lensTagline: lens.tagline
      }
    }
  }

  return { Page: DeckLensPage, getStaticPaths, getStaticProps }
}
