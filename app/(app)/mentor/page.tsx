'use client'

import { AppShell } from '@/components/app/app-shell'

export default function MentorPage() {
  return (
    <AppShell requireOnboarding>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center animate-step-in">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Mentor
          </h1>
          <p className="text-muted-foreground text-sm max-w-md">
            Subject grid and AI tutor — coming next.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
