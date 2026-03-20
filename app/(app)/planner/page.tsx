'use client'

import { AppShell } from '@/components/app/app-shell'

export default function PlannerPage() {
  return (
    <AppShell requireOnboarding>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center animate-step-in">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Planner
          </h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Your AI-powered study command centre. Chat, schedule, and plan — coming next.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
