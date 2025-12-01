import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp'
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline'
import Link from 'next/link'
import * as React from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
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
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 px-4 border-b relative z-10'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href='/playground'>Playground</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={index}>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className='ml-auto'>
            <button
              onClick={toggleDarkMode}
              className='inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors'
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
        <div className='flex flex-1 flex-col gap-4 p-4 pt-8'>
          <div className='max-w-4xl mx-auto w-full'>
            <h1 className='text-4xl font-bold mb-8'>{title}</h1>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
