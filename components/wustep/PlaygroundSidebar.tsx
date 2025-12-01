import { Beaker } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'

const sections = [
  {
    title: 'Live Experiments',
    items: [
      { title: 'WebGL Shaders', url: '/playground/webgl-shaders' },
      { title: 'Particle Systems', url: '/playground/particle-systems' }
    ]
  },
  {
    title: 'In Progress',
    items: [
      { title: 'Generative Art', url: '#', disabled: true },
      { title: 'Audio Visualizer', url: '#', disabled: true }
    ]
  }
]

export function PlaygroundSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  return (
    <Sidebar {...props}>
      <SidebarHeader className='gap-3'>
        <div className='flex items-center gap-3  p-3'>
          <div className='leading-tight'>
            <p className='text-sm font-semibold'>Playground</p>
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
                      disabled={item.disabled}
                    >
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
