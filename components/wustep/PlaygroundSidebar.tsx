import { Beaker, Info } from 'lucide-react'
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

type SidebarItem = {
  title: string
  url: string
  description: string
  date?: string
  year?: string
  disabled?: boolean
}

const sections: { title: string; items: SidebarItem[] }[] = [
  {
    title: 'Experiments',
    items: [
      {
        title: 'WebGL Shaders',
        url: '/playground/webgl-shaders',
        description: 'Realtime fragment shader sketches rendered in WebGL.',
        date: 'Jan 2025',
        year: '2025'
      },
      {
        title: 'Particle Systems',
        url: '/playground/particle-systems',
        description: '10k+ particles with custom physics integrator.',
        date: 'Feb 2025',
        year: '2025'
      }
    ]
  },
  {
    title: 'Games',
    items: [
      {
        title: 'Bomberman',
        url: '/playground/bomberman',
        disabled: false,
        description:
          'Two-player Bomberman clone with emojis. Fully vibe coded with Cursor & Claude 3.5 Sonnet.',
        date: 'Nov 2024',
        year: '2024'
      }
    ]
  },
  {
    title: 'Visualizations',
    items: [
      {
        title: 'Starry Night Sequencer',
        url: '/playground/starry-night',
        disabled: true,
        description: 'Audio-reactive orchestration inspired by Van Gogh.',
        year: '2016'
      }
    ]
  }
]

const defaultDescription = "Welcome to Stephen's code playground."

type AboutState = {
  description: string
  date?: string
}

export function PlaygroundSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const activeItem =
    sections
      .flatMap((section) => section.items)
      .find((item) => {
        return item.url === router.pathname
      }) ?? null

  const [aboutInfo, setAboutInfo] = React.useState<AboutState>({
    description: activeItem?.description ?? defaultDescription,
    date: activeItem?.date
  })

  React.useEffect(() => {
    setAboutInfo({
      description: activeItem?.description ?? defaultDescription,
      date: activeItem?.date
    })
  }, [activeItem?.description, activeItem?.date])

  const resetDescription = () =>
    setAboutInfo({
      description: activeItem?.description ?? defaultDescription,
      date: activeItem?.date
    })

  return (
    <Sidebar className='sidebar-animate' {...props}>
      <SidebarHeader className='gap-3'>
        <div className='flex items-center gap-3 rounded-lg border border-border/60 bg-sidebar p-3'>
          <div className='flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground'>
            <Beaker className='size-4' />
          </div>
          <div className='leading-tight'>
            <p className='text-sm font-semibold'>Playground</p>
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
        {sections.map((section) => (
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
                          date: item.date
                        })
                      }
                      onFocus={() =>
                        setAboutInfo({
                          description: item.description,
                          date: item.date
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
      <SidebarFooter className='border-t border-sidebar-border/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground min-h-[130px]'>
        <div className='flex items-center gap-1 text-sidebar-foreground mb-1 font-medium'>
          <Info className='size-3.5' />
          <span>About</span>
        </div>
        <p>{aboutInfo.description}</p>
        {aboutInfo.date ? (
          <p className='mt-1 text-[11px] text-muted-foreground/80'>
            {aboutInfo.date}
          </p>
        ) : null}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
