import { ImLab } from '@react-icons/all-files/im/ImLab'
import { Info } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

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
import { playgroundSections } from '@/playground/registry'

const defaultDescription = "Welcome to Stephen's code playground."

type AboutState = {
  description: string
  date?: string
  article?: string
}

export function PlaygroundSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const activeItem =
    playgroundSections
      .flatMap((section) => section.items)
      .find((item) => {
        return item.url === router.pathname
      }) ?? null

  const [aboutInfo, setAboutInfo] = React.useState<AboutState>({
    description: activeItem?.description ?? defaultDescription,
    date: activeItem?.date,
    article: activeItem?.article
  })

  React.useEffect(() => {
    setAboutInfo({
      description: activeItem?.description ?? defaultDescription,
      date: activeItem?.date,
      article: activeItem?.article
    })
  }, [activeItem])

  const resetDescription = () =>
    setAboutInfo({
      description: activeItem?.description ?? defaultDescription,
      date: activeItem?.date,
      article: activeItem?.article
    })

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
      <SidebarContent>
        {playgroundSections.map((section) => (
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
                      onMouseEnter={() =>
                        setAboutInfo({
                          description: item.description,
                          date: item.date,
                          article: item.article
                        })
                      }
                      onFocus={() =>
                        setAboutInfo({
                          description: item.description,
                          date: item.date,
                          article: item.article
                        })
                      }
                      onMouseLeave={resetDescription}
                      onBlur={resetDescription}
                    >
                      {item.disabled ? (
                        <span className='flex w-full items-center justify-between gap-2 text-muted-foreground/60'>
                          <span className='truncate'>{item.title}</span>
                          {item.year ? (
                            <span className='text-[11px] text-muted-foreground/60'>
                              {item.year}
                            </span>
                          ) : null}
                        </span>
                      ) : (
                        <Link
                          href={item.url}
                          className='flex w-full items-center justify-between gap-2'
                        >
                          <span className='truncate'>{item.title}</span>
                          {item.year ? (
                            <span className='text-[11px] text-muted-foreground/60'>
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
      </SidebarContent>
      <SidebarFooter className='border-t border-sidebar-border/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground min-h-[145px]'>
        <div className='flex items-center gap-1 text-sidebar-foreground mb-1 font-medium'>
          <Info className='size-3.5' />
          <span>About</span>
        </div>
        <p>{aboutInfo.description}</p>
        {aboutInfo.date || aboutInfo.article ? (
          <p className='mt-1 text-[11px] text-muted-foreground/80 flex items-center gap-1'>
            {aboutInfo.date ? <span>{aboutInfo.date}</span> : null}
            {aboutInfo.date && aboutInfo.article ? (
              <span aria-hidden='true'>&bull;</span>
            ) : null}
            {aboutInfo.article ? (
              <Link
                href={aboutInfo.article}
                className='underline underline-offset-2 hover:text-sidebar-primary transition-colors'
              >
                Article
              </Link>
            ) : null}
          </p>
        ) : null}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
