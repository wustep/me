import * as React from 'react'

import { BombermanCover } from '@/components/wustep/BombermanCover'
import { BombermanCoverA } from '@/components/wustep/BombermanCoverA'
import { BombermanCoverC } from '@/components/wustep/BombermanCoverC'
import { BombermanCoverD } from '@/components/wustep/BombermanCoverD'
import { ContraptionsCover } from '@/components/wustep/ContraptionsCover'
import { JevCover } from '@/components/wustep/JevCover'
import { JevCoverB } from '@/components/wustep/JevCoverB'
import { JevCoverC } from '@/components/wustep/JevCoverC'
import { JevCoverD } from '@/components/wustep/JevCoverD'
import { JevCoverE } from '@/components/wustep/JevCoverE'
import { JevCoverF } from '@/components/wustep/JevCoverF'
import { JevCoverG } from '@/components/wustep/JevCoverG'
import { JevCoverH } from '@/components/wustep/JevCoverH'
import { JevCoverI } from '@/components/wustep/JevCoverI'
import { JevCoverJ } from '@/components/wustep/JevCoverJ'
import { JevCoverK } from '@/components/wustep/JevCoverK'
import { JevCoverL } from '@/components/wustep/JevCoverL'
import { JevCoverM } from '@/components/wustep/JevCoverM'
import { JevCoverN } from '@/components/wustep/JevCoverN'
import { JevCoverO } from '@/components/wustep/JevCoverO'
import { JevCoverP } from '@/components/wustep/JevCoverP'
import { JevCoverQ } from '@/components/wustep/JevCoverQ'
import { JevCoverR } from '@/components/wustep/JevCoverR'
import { JevCoverS } from '@/components/wustep/JevCoverS'
import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { SplashPanicCover } from '@/components/wustep/SplashPanicCover'
import { SplashPanicCoverB } from '@/components/wustep/SplashPanicCoverB'
import { SplashPanicCoverC } from '@/components/wustep/SplashPanicCoverC'

// Dev-only workbench for playground covers: one tab per project, each
// rendering its covers inside real card markup at the two widths that
// matter — the shipped cover first, then the unshipped variants from the
// exploration (playground-entry skill), kept so the comparison record
// survives the pick.
export const getStaticProps = () =>
  process.env.NODE_ENV === 'production'
    ? { notFound: true as const }
    : { props: {} }

type CoverPreview = {
  label: string
  hint: string
  Cover: React.ComponentType
}

type Tab = {
  id: string
  title: string
  summary: string
  covers: CoverPreview[]
}

// Non-empty tuple type so the active-tab fallback below typechecks under
// noUncheckedIndexedAccess.
const tabs: [Tab, ...Tab[]] = [
  {
    id: 'jev',
    title: 'Jev Playground',
    summary: 'Jev picks the labels; code does the rest',
    covers: [
      {
        label: 'The dial writes the staff (shipped)',
        hint: 'Hover: the dial steps Bach, Chopin, Debussy, Glass, and each stop engraves its phrase — noteheads take the stop accent as they sound.',
        Cover: JevCover
      },
      {
        label: 'B — Poster (unshipped)',
        hint: 'Hover: a reading light walks Music, Trolley, Inbox, Match — the active tick thickens and the name takes its accent.',
        Cover: JevCoverB
      },
      {
        label: 'C — The pick (unshipped)',
        hint: 'Hover: the stop resolves Bach → Beethoven → Chopin → Debussy; the long bar takes that accent and the note changes pitch.',
        Cover: JevCoverC
      },
      {
        label: 'D — Four doors (unshipped)',
        hint: 'Hover: one landing card at a time — a note hops, the trolley chooses a rail, the inbox stamp cycles, the match rank slides.',
        Cover: JevCoverD
      },
      {
        label: 'E — The ballot (unshipped)',
        hint: 'Hover: the answer sheet is re-asked row by row — the fill hops across each room’s options, then lands on the pick with its probability.',
        Cover: JevCoverE
      },
      {
        label: 'F — Stamped (unshipped)',
        hint: 'Hover: the pile is worked — a prize-desk letter gets DELETE, a manager’s note REVIEW, then the library notice is stamped LEAVE again.',
        Cover: JevCoverF
      },
      {
        label: 'G — Match card (unshipped)',
        hint: 'Hover: the shortlist scrambles and empties, each candidate’s match.fit bar fills in turn, then code sorts the rows and the top slot lights.',
        Cover: JevCoverG
      },
      {
        label: 'H — Lever (unshipped)',
        hint: 'Hover: the trolley takes the siding and leaves; the next rolls in while the lever wavers wait / pull / wait, then lands on pull .64.',
        Cover: JevCoverH
      },
      {
        label: 'I — Pipeline (unshipped)',
        hint: 'Hover: outputs dim, then Jev sends one label chip per room down its pipe — the pipe inks behind it and the room’s effect lights.',
        Cover: JevCoverI
      },
      {
        label: 'J — Shape sorter (unshipped)',
        hint: 'A wooden toy turns four shaped choices into four little worlds. Hover: the chosen music block settles into its slot.',
        Cover: JevCoverJ
      },
      {
        label: 'K — Paper piano (unshipped)',
        hint: 'A punched paper strip drives a miniature music box. Hover: the brass roller moves and the notes lift.',
        Cover: JevCoverK
      },
      {
        label: 'L — The mobile (unshipped)',
        hint: 'Four peer rooms hang in balance from one small bead. Hover: the mobile rocks and its musical pendant swings.',
        Cover: JevCoverL
      },
      {
        label: 'M — Paper flight (unshipped)',
        hint: 'An envelope becomes a paper plane above a full inbox. Hover: the selected letter glides free of the pile.',
        Cover: JevCoverM
      },
      {
        label: 'N — Magnetic chemistry (unshipped)',
        hint: 'A horseshoe magnet lifts the closest match from a crowd. Hover: attraction draws the purple figure upward.',
        Cover: JevCoverN
      },
      {
        label: 'O — The dollhouse (unshipped)',
        hint: 'A house cut open at night, four lit rooms under one attic firefly. Hover: the firefly touches each lamp in turn and that room plays itself — notes rise, the couple leans in, a letter files itself, the toy trolley takes the siding.',
        Cover: JevCoverO
      },
      {
        label: 'P — The magic lantern (unshipped)',
        hint: 'A brass lantern throws one small glass slide onto a sheet as a big silhouette show, an audience in the dark. Hover: slides swap from the rack — pianist, letters flocking to a post box, two on a bench shuffling closer, a tram under its wire.',
        Cover: JevCoverP
      },
      {
        label: 'Q — Snow globes (unshipped)',
        hint: 'Four snow globes on a sunny sill, one world each; a cat’s paw dangles from the shelf above. Hover: the paw taps each globe in turn — it wobbles, the snow lifts, and the world inside plays.',
        Cover: JevCoverQ
      },
      {
        label: 'R — The marionettes (unshipped)',
        hint: 'One gold control cross, every string fanning down to four puppets on a red stage. Hover: the cross tilts toward each in turn and that puppet performs — violin, a tossed letter, a heart balloon let go, a trot in a toy tram.',
        Cover: JevCoverR
      },
      {
        label: 'S — The pop-up book (unshipped)',
        hint: 'An open pop-up book with four ribbon tabs; the concert shell stands out of the gutter. Hover: each tab is pulled in turn, a leaf turns, and the post office, the couple’s tree, and the tram’s hill fold up.',
        Cover: JevCoverS
      }
    ]
  },
  {
    id: 'contraptions',
    title: 'Contraptions',
    summary: 'Rube goldberg experiments in <canvas>',
    covers: [
      {
        label: 'The hop (shipped)',
        hint: 'Follows the site theme — Risograph on paper in light, Noir in dark; same map either way. Hover: the ball comes out of one portal, rolls off the rail, is thrown by the trampoline up to the shelf and pulled into the other portal, and the same instant comes back out of the first.',
        Cover: ContraptionsCover
      }
    ]
  },
  {
    id: 'splashpanic',
    title: 'Splash Panic!',
    summary: 'Multiplayer water-balloon chaos with bubble traps & rescues',
    covers: [
      {
        label: 'Meadow standoff (shipped)',
        hint: 'Hover: the fuse runs — throb, blush, plus-splash along the grid axes, flinch, re-inflate.',
        Cover: SplashPanicCover
      },
      {
        label: 'B — Poster (unshipped)',
        hint: 'Hover: wordmark wiggles, balloon drifts, bubbled Pip bobs, droplets twinkle.',
        Cover: SplashPanicCoverB
      },
      {
        label: 'C — Bubbled! (unshipped)',
        hint: 'Ambient bob; hover pops the bubble — Splash drops free, then it re-forms.',
        Cover: SplashPanicCoverC
      }
    ]
  },
  {
    id: 'bomberman',
    title: 'Bomberman',
    summary: 'Two-player Bomberman clone with pets & power-ups',
    covers: [
      {
        label: 'Board vignette (shipped)',
        hint: 'Hover: the 💣 heats red like in-game, then every blast tile blooms the game’s 🌸 explosion.',
        Cover: BombermanCover
      },
      {
        label: 'A — Prompt → game (unshipped)',
        hint: 'Chat card asks, the arena answers. Hover: typing dots, bomb wobble, plus-burst of 🔥.',
        Cover: BombermanCoverA
      },
      {
        label: 'C — The prompt file (unshipped)',
        hint: 'bomberman.tsx in a dark editor. Hover: caret blinks, literals glow, 💥 beside explode().',
        Cover: BombermanCoverC
      },
      {
        label: 'D — The bomb (unshipped)',
        hint: 'Giant 💣 under a spotlight, tokens drifting. Hover: fuse shiver → hard-cut 💥 + shockwave.',
        Cover: BombermanCoverD
      }
    ]
  }
]

function PreviewCard({
  Cover,
  id,
  title,
  summary,
  width
}: {
  Cover: React.ComponentType
  id: string
  title: string
  summary: string
  width: number
}) {
  // An anchor, like the real card on /playground, so hover/focus behave
  // identically; the self-href keeps it focusable without navigating away.
  return (
    <a
      id={id}
      href={`#${id}`}
      className='group notion-collection-card overflow-hidden'
      style={{ width }}
    >
      <div className='notion-collection-card-cover aspect-video w-full'>
        <Cover />
      </div>
      <div className='notion-collection-card-body p-4'>
        <h3 className='font-semibold mb-1'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{summary}</p>
      </div>
    </a>
  )
}

/* ─────────────────────────────────────────────────────────
 * TAB INTERACTION STORYBOARD
 *
 *  hover    text lifts to foreground, soft wash fades in (150ms)
 *  press    button dips to 98% while held
 *  select   the underline slides and resizes to the new tab
 *           (240ms, ease-out quint — no bounce)
 *  keyboard ←/→ move + select, Home/End jump, ring on :focus-visible
 *  reduced  wash still fades; the underline jumps instead of sliding
 * ───────────────────────────────────────────────────────── */

// Underline slide; hover/press timing lives in the Tailwind classes below.
const TAB_SLIDE_MS = 240
const TAB_SLIDE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export default function CoversPreviewPage() {
  const [active, setActive] = React.useState(0)
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([])
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 })
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    setReduceMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])

  // The underline is one shared element measured off the active tab, so it
  // can travel between tabs instead of blinking from one to the other.
  const measure = React.useCallback(() => {
    const el = tabRefs.current[active]
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
  }, [active])

  React.useEffect(() => {
    measure()
    // Re-measure on reflow (sidebar collapse, font swap, window resize).
    const list = listRef.current
    if (!list || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [measure])

  // Standard tablist keyboarding: arrows move + select, Home/End jump.
  const onTabKeyDown = (event: React.KeyboardEvent) => {
    const last = tabs.length - 1
    let next: number | null = null
    if (event.key === 'ArrowRight') next = active === last ? 0 : active + 1
    else if (event.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    if (next !== null) {
      event.preventDefault()
      setActive(next)
      tabRefs.current[next]?.focus()
    }
  }

  const activeTab = tabs[active] ?? tabs[0]

  return (
    <PlaygroundLayout
      title='Covers preview'
      breadcrumbs={[{ label: 'Covers preview' }]}
    >
      <div className='space-y-8'>
        <p className='text-muted-foreground'>
          Playground covers inside real card markup at grid width (420px),
          full-column width (620px), and a wide stress test (880px) — the cover
          height is fixed while width varies, so wide is where covers break.
          Hover or focus a card to run its animation.
        </p>

        <div
          ref={listRef}
          role='tablist'
          aria-label='Cover previews by project'
          className='relative flex gap-1 border-b border-border pb-0.5'
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              role='tab'
              id={`tab-${tab.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${tab.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onTabKeyDown}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-all duration-150 hover:bg-muted/60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:active:scale-100 ${
                i === active
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.title}
            </button>
          ))}
          {/* Shared underline; travels between tabs (see storyboard). The
              transition is inlined because arbitrary transition-property
              utilities proved unreliable here; reduced motion zeroes the
              duration so the underline jumps instead. */}
          <span
            aria-hidden='true'
            className='absolute -bottom-px left-0 h-0.5 rounded-full bg-foreground'
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: indicator.width,
              transitionProperty: 'transform, width',
              transitionDuration: reduceMotion ? '0ms' : `${TAB_SLIDE_MS}ms`,
              transitionTimingFunction: TAB_SLIDE_EASE
            }}
          />
        </div>

        <div
          role='tabpanel'
          id={`panel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          className='space-y-8'
        >
          {activeTab.covers.map(({ label, hint, Cover }) => (
            <section key={label} className='space-y-3'>
              <h2 className='font-semibold'>{label}</h2>
              <p className='text-sm text-muted-foreground'>{hint}</p>
              <div className='flex flex-wrap items-start gap-6'>
                {[420, 620, 880].map((width) => (
                  <PreviewCard
                    key={width}
                    Cover={Cover}
                    id={`${activeTab.id}-${width}`}
                    title={activeTab.title}
                    summary={activeTab.summary}
                    width={width}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PlaygroundLayout>
  )
}
