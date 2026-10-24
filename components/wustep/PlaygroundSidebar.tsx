import { Info, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

import { ImLab } from '@/components/icons/InlineIcons'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { useOwnerMode } from '@/components/wustep/OwnerModeProvider'
import { PlaygroundDescription } from '@/components/wustep/PlaygroundDescription'
import {
  loadSidebarScrollTop,
  saveSidebarScrollTop,
  scrollTopToReveal
} from '@/lib/sidebar-scroll'
import { withStarredSection } from '@/lib/sidebar-sections'
import { type PlaygroundEntry, playgroundSections } from '@/playground/registry'

const defaultDescription = "Welcome to Stephen's code playground."

type AboutInfo = Pick<
  PlaygroundEntry,
  'description' | 'date' | 'article' | 'source' | 'x'
>

const defaultAbout: AboutInfo = { description: defaultDescription }

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect

const metadataLinkClass =
  'underline underline-offset-2 hover:text-sidebar-primary transition-colors'

function AboutContent({ info }: { info: AboutInfo }) {
  const metadataItems: React.ReactNode[] = []
  if (info.date) metadataItems.push(<span key='date'>{info.date}</span>)
  if (info.article) {
    metadataItems.push(
      <Link key='article' href={info.article} className={metadataLinkClass}>
        Article
      </Link>
    )
  }
  if (info.x) {
    metadataItems.push(
      <Link key='x' href={info.x} className={metadataLinkClass}>
        Post
      </Link>
    )
  }
  if (info.source) {
    metadataItems.push(
      <Link key='source' href={info.source} className={metadataLinkClass}>
        Source
      </Link>
    )
  }

  return (
    <>
      <p>
        <PlaygroundDescription text={info.description} />
      </p>
      {metadataItems.length ? (
        <p className='mt-1 text-[11px] text-muted-foreground flex items-center gap-1'>
          {metadataItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 ? <span aria-hidden='true'>&bull;</span> : null}
              {item}
            </React.Fragment>
          ))}
        </p>
      ) : null}
    </>
  )
}

/**
 * The menu's scroll box. Each playground page mounts its own layout, so this
 * remounts on every navigation (and each time the phone drawer opens). It
 * restores the last scrollTop before paint, then nudges the active item into
 * view only when it would otherwise be off-screen.
 */
function PersistentSidebarContent({
  children,
  ...props
}: React.ComponentProps<typeof SidebarContent>) {
  const ref = React.useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    // Phones first render the desktop sidebar hidden (display: none) before
    // switching to the drawer; a hidden box reads scrollTop 0, so leave the
    // saved position alone until a visible copy mounts.
    if (!el || el.clientHeight === 0) return

    const stored = loadSidebarScrollTop()
    if (stored !== null) el.scrollTop = stored

    const active = el.querySelector<HTMLElement>('[aria-current="page"]')
    if (active) {
      const elRect = el.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      el.scrollTop = scrollTopToReveal({
        scrollTop: el.scrollTop,
        viewportHeight: el.clientHeight,
        itemTop: activeRect.top - elRect.top + el.scrollTop,
        itemHeight: activeRect.height
      })
    }
    saveSidebarScrollTop(el.scrollTop)

    const onScroll = () => saveSidebarScrollTop(el.scrollTop)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <SidebarContent ref={ref} {...props}>
      {children}
    </SidebarContent>
  )
}

export function PlaygroundSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { isOwner } = useOwnerMode()
  const visibleSections = React.useMemo(
    () =>
      withStarredSection(
        playgroundSections.map((section) => ({
          ...section,
          items: section.items.filter((item) => !item.ownerOnly || isOwner)
        }))
      ),
    [isOwner]
  )
  const activeItem =
    visibleSections
      .flatMap((section) => section.items)
      .find((item) => {
        return item.url === router.pathname
      }) ?? null

  // The hovered/focused item previews in About; leaving the whole menu (not
  // each item) returns to the active page, so crossing the gaps between
  // items doesn't flash the active description in between.
  const [previewItem, setPreviewItem] = React.useState<PlaygroundEntry | null>(
    null
  )
  const aboutInfo: AboutInfo = previewItem ?? activeItem ?? defaultAbout
  const aboutCandidates = React.useMemo<AboutInfo[]>(
    () => [
      defaultAbout,
      ...visibleSections.flatMap((section) => section.items)
    ],
    [visibleSections]
  )

  const handleMenuBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setPreviewItem(null)
    }
  }

  return (
    <Sidebar className='sidebar-animate' {...props}>
      <SidebarHeader className='gap-3'>
        <div className='flex items-center gap-2 rounded-lg border border-border/60 bg-sidebar p-3'>
          <Link href='/playground' aria-label='Playground home'>
            <ImLab className='playground-sidebar-lab size-4' />
          </Link>
          <div className='leading-tight flex items-center gap-1 align-baseline'>
            <Link href='/playground' className='text-sm font-semibold'>
              Playground
            </Link>
            <Link
              href='https://wustep.me'
              className='text-xs text-muted-foreground hover:text-sidebar-primary transition-colors'
              target='_blank'
              rel='noreferrer'
            >
              by wustep
            </Link>
          </div>
        </div>
      </SidebarHeader>
      <PersistentSidebarContent
        onMouseLeave={() => setPreviewItem(null)}
        onBlur={handleMenuBlur}
      >
        {visibleSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={router.pathname === item.url}
                      disabled={!!item.disabled}
                      onMouseEnter={() => setPreviewItem(item)}
                      onFocus={() => setPreviewItem(item)}
                    >
                      {item.disabled ? (
                        // The menu button's aria-disabled:opacity-50 is the
                        // single dimmer; don't stack a second opacity here.
                        <span className='flex w-full items-center justify-between gap-2 text-muted-foreground'>
                          <span className='truncate'>{item.title}</span>
                          {item.year ? (
                            <span className='text-[11px]'>{item.year}</span>
                          ) : null}
                        </span>
                      ) : (
                        <Link
                          href={item.url}
                          aria-current={
                            router.pathname === item.url ? 'page' : undefined
                          }
                          className='flex w-full items-center justify-between gap-2'
                        >
                          <span className='flex min-w-0 items-center gap-1.5'>
                            <span className='truncate'>{item.title}</span>
                            {item.starred ? (
                              <Star
                                aria-label='Starred'
                                className='size-3 shrink-0 fill-amber-400 text-amber-400'
                              />
                            ) : null}
                          </span>
                          {item.year ? (
                            <span className='text-[11px] text-muted-foreground'>
                              {item.year}
                            </span>
                          ) : null}
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </PersistentSidebarContent>
      <SidebarFooter className='border-t border-sidebar-border/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground'>
        <div className='flex items-center gap-1 text-sidebar-foreground mb-1 font-medium'>
          <Info className='size-3.5' />
          <span>About</span>
        </div>
        {/* Every entry's text is stacked invisibly in one grid cell, so the
            footer is always as tall as the longest one. A footer that grew
            on hover used to cover the bottom links, so the hover flipped on
            and off under a still pointer. */}
        <div className='grid' data-playground-about>
          {aboutCandidates.map((info, index) => (
            <div
              key={index}
              aria-hidden='true'
              className='invisible col-start-1 row-start-1'
            >
              <AboutContent info={info} />
            </div>
          ))}
          <div className='col-start-1 row-start-1'>
            <AboutContent info={aboutInfo} />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
