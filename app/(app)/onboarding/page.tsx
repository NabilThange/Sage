'use client'

import { AppShell } from '@/components/app/app-shell'

export default function OnboardingPage() {
  return (
    <AppShell showSidebar={false}>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center animate-step-in">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Onboarding
          </h1>
          <p className="text-muted-foreground text-sm max-w-md">
            8-step Duolingo-style profile builder — coming next.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
