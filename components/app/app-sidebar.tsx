'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Calendar03Icon,
  MortarboardIcon,
  Task01Icon,
  UserIcon,
  AiNetworkIcon,
  Logout01Icon,
  Fire01Icon,
} from 'hugeicons-react'
import { useAuth } from '@/providers/auth-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const navItems = [
  {
    label: 'Planner',
    href: '/planner',
    icon: Calendar03Icon,
  },
  {
    label: 'Mentor',
    href: '/mentor',
    icon: MortarboardIcon,
  },
  {
    label: 'Tests',
    href: '/tests',
    icon: Task01Icon,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: UserIcon,
  },
]

interface AppSidebarProps {
  onMemoryClick?: () => void
}

export function AppSidebar({ onMemoryClick }: AppSidebarProps) {
  const pathname = usePathname()
  const { userName, profile, logout } = useAuth()
  const streakCount = profile?.streakCount ?? 0

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      {/* Header — Brand */}
      <SidebarHeader className="px-4 py-5">
        <Link href="/planner" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <AiNetworkIcon className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            Recallio
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Streak badge */}
      {streakCount > 0 && (
        <div className="mx-4 mt-3 mb-1 flex items-center gap-2 rounded-lg bg-amber-400/10 px-3 py-2">
          <Fire01Icon className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-400">
            {streakCount}-day streak
          </span>
        </div>
      )}

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href))

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        'transition-colors duration-150',
                        isActive &&
                          'bg-primary/10 text-primary font-medium'
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4.5 w-4.5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Memory Panel button */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onMemoryClick}
                  className={cn(
                    'transition-colors duration-150 cursor-pointer',
                    pathname === '/memory' && 'bg-primary/10 text-primary font-medium'
                  )}
                >
                  <AiNetworkIcon className="h-4.5 w-4.5" />
                  <span>Memory</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — user + logout */}
      <SidebarFooter className="px-3 pb-4">
        <div className="flex items-center justify-between rounded-lg bg-sidebar-accent/50 px-3 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {userName?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {userName ?? 'Guest'}
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={logout}
              >
                <Logout01Icon className="h-3.5 w-3.5" />
                <span className="sr-only">Log out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Log out</TooltipContent>
          </Tooltip>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
