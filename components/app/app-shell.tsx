'use client'

import React, { useState } from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/app/app-sidebar'
import { ProtectedRoute } from '@/components/app/protected-route'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { AiNetworkIcon } from 'hugeicons-react'

interface AppShellProps {
  children: React.ReactNode
  /** Set to false for routes like /onboarding where sidebar should not render */
  showSidebar?: boolean
  /** If true, also checks onboarding completion */
  requireOnboarding?: boolean
}

export function AppShell({
  children,
  showSidebar = true,
  requireOnboarding = false,
}: AppShellProps) {
  const [isMemoryOpen, setIsMemoryOpen] = useState(false)

  return (
    <ProtectedRoute requireOnboarding={requireOnboarding}>
      <TooltipProvider delayDuration={200}>
        {showSidebar ? (
          <SidebarProvider>
            <AppSidebar onMemoryClick={() => setIsMemoryOpen(true)} />
            <SidebarInset className="flex flex-col min-h-screen">
              {children}
            </SidebarInset>
          </SidebarProvider>
        ) : (
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        )}

        {/* Memory Drawer — accessible from any page via sidebar icon */}
        <Sheet open={isMemoryOpen} onOpenChange={setIsMemoryOpen}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-lg overflow-y-auto bg-background"
          >
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <AiNetworkIcon className="h-5 w-5 text-primary" />
                Memory Panel
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 px-1">
              {/* Memory Panel content will be injected here in Feature 8 */}
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <AiNetworkIcon className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">Memory Panel coming soon</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </TooltipProvider>
    </ProtectedRoute>
  )
}
