'use client'

import { AppShell } from '@/components/app/app-shell'

export default function MemoryPage() {
  return (
    <AppShell requireOnboarding>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center animate-step-in">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            🧠 Memory Panel
          </h1>
          <p className="text-muted-foreground text-sm max-w-md">
            All 4 Hindsight memory types — the judge-facing demo screen — coming next.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
