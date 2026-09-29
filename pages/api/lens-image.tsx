import { type NextApiRequest } from 'next'
import { ImageResponse } from 'next/og'

import { apiErrorResponse } from '@/lib/api-error'
import interSemiBoldFont from '@/lib/fonts/inter-semibold'
import { getLensCard } from '@/lib/lens-card'

export const runtime = 'edge'

/**
 * Social card for a lens (`?deck=<slug>&id=<lensId>`) or a deck cover
 * (`?deck=<slug>`). Drawn in the lens's own colors from the static deck
 * data — no Notion dependency — so every /lenses/<id> link unfurls as that
 * lens instead of the favicon.
 */
export default function LensImage(req: NextApiRequest) {
  const { searchParams } = new URL(req.url!)
  const card = getLensCard(
    searchParams.get('deck') ?? 'wustep',
    searchParams.get('id')
  )
  if (!card) {
    return apiErrorResponse(404, 'not_found', 'No such lens or deck.')
  }

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 88px',
        backgroundColor: card.bg,
        color: card.fg,
        fontFamily: 'Inter'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontSize: 28,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: card.accent
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 9999,
            backgroundColor: card.accent
          }}
        />
        {card.eyebrow}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div
          style={{
            fontSize: card.title.length > 18 ? 96 : 128,
            lineHeight: 1,
            letterSpacing: '-0.03em'
          }}
        >
          {card.title}
        </div>
        <div
          style={{
            fontSize: 44,
            lineHeight: 1.25,
            maxWidth: 960,
            opacity: 0.85
          }}
        >
          {card.tagline}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 26,
          opacity: 0.7
        }}
      >
        <div style={{ width: 48, height: 3, backgroundColor: card.accent }} />
        {card.path}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBoldFont,
          style: 'normal',
          weight: 700
        }
      ],
      // Deck content only changes on deploy; let the CDN hold cards for a day.
      headers: {
        'Cache-Control':
          'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800'
      }
    }
  )
}
