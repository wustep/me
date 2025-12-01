'use client'

import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'
import { Home } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar'
import { PlaygroundSidebar } from '@/components/wustep/PlaygroundSidebar'
import { useDarkMode } from '@/lib/use-dark-mode'

interface PlaygroundLayoutProps {
  children: React.ReactNode
  title: string
  breadcrumbs?: { label: string; href?: string }[]
}

export function PlaygroundLayout({
  children,
  title,
  breadcrumbs = []
}: PlaygroundLayoutProps) {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '16rem'
        } as React.CSSProperties
      }
    >
      <PlaygroundSidebar />
      <LayoutContent
        title={title}
        breadcrumbs={breadcrumbs}
        hasMounted={hasMounted}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      >
        {children}
      </LayoutContent>
    </SidebarProvider>
  )
}

type LayoutContentProps = PlaygroundLayoutProps & {
  hasMounted: boolean
  isDarkMode: boolean
  toggleDarkMode: () => void
}

function LayoutContent({
  children,
  title,
  breadcrumbs,
  hasMounted,
  isDarkMode,
  toggleDarkMode
}: LayoutContentProps) {
  const { state, isMobile } = useSidebar()
  const insetStyle = React.useMemo(() => {
    if (isMobile) return undefined

    const paddingLeft =
      state === 'collapsed'
        ? 'calc(var(--sidebar-width-icon) + theme(spacing.8))'
        : 'calc(var(--sidebar-width) + theme(spacing.8))'

    return { paddingLeft }
  }, [state, isMobile])

  return (
    <SidebarInset
      className='transition-[padding] duration-200 bg-background'
      style={insetStyle as React.CSSProperties}
    >
      <header className='flex h-[54px] shrink-0 items-center gap-2 border-b px-4 pr-3 bg-background'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mr-2 data-[orientation=vertical]:h-4'
        />
        <Breadcrumb>
          <BreadcrumbList>
            {[
              { label: 'Playground', href: '/playground', hideOnMobile: true },
              ...(breadcrumbs ?? [])
            ].map((crumb, index, arr) => (
              <React.Fragment key={`${crumb.label}-${index}`}>
                <BreadcrumbItem
                  className={index === 0 ? 'hidden md:block' : undefined}
                >
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < arr.length - 1 && (
                  <BreadcrumbSeparator
                    className={index === 0 ? 'hidden md:block' : undefined}
                  />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className='ml-auto flex items-center gap-2'>
          <Link
            href='/'
            className='inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors'
            aria-label='Go home'
          >
            <Home className='h-4 w-4' />
          </Link>
          <button
            onClick={toggleDarkMode}
            className='inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors'
            title={
              hasMounted
                ? isDarkMode
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
                : 'Toggle theme'
            }
          >
            {hasMounted ? (
              isDarkMode ? (
                <IoMoonSharp />
              ) : (
                <IoSunnyOutline />
              )
            ) : (
              <IoSunnyOutline />
            )}
          </button>
        </div>
      </header>
      <div className='flex flex-1 flex-col gap-4 p-4 pt-8 bg-background'>
        <div className='w-full max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold mb-8'>{title}</h1>
          {children}
        </div>
      </div>
    </SidebarInset>
  )
}
