'use client'

import React from 'react'
import { Fire01Icon, Cancel01Icon, Book02Icon, AlarmClockIcon, Target01Icon, AiStar01Icon } from 'hugeicons-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DailyBriefingCardProps {
  streak: number
  name: string
  lastSubject?: string
  daysSince?: number
  upcomingExam?: { subject: string; daysRemaining: number }
  weakestTopic?: string
  aiInsight?: string
  onDismiss: () => void
  isLoading?: boolean
}

export function DailyBriefingCard({
  streak,
  name,
  lastSubject,
  daysSince,
  upcomingExam,
  weakestTopic,
  aiInsight,
  onDismiss,
  isLoading = false,
}: DailyBriefingCardProps) {
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 animate-pulse-subtle">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-48 rounded bg-muted" />
            <div className="h-3 w-64 rounded bg-muted" />
            <div className="flex gap-3 mt-3">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
          </div>
          <div className="h-6 w-6 rounded bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-xl border border-primary/20 bg-gradient-to-r from-primary/8 via-card to-card p-4 animate-step-in overflow-hidden">
      {/* Subtle glow orb */}
      <div className="pointer-events-none absolute -top-8 -left-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Greeting row */}
          <div className="flex items-center gap-2 mb-1">
            {streak > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-xs font-semibold text-amber-400">
                <Flame className="h-3 w-3" />
                {streak}
              </span>
            )}
            <h3 className="text-sm font-semibold text-foreground">
              {greeting}, {name}!
            </h3>
          </div>

          {/* AI insight */}
          {aiInsight && (
            <div className="flex items-start gap-1.5 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">{aiInsight}</p>
            </div>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {lastSubject && (
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Last: <span className="text-foreground font-medium">{lastSubject}</span>
                  {daysSince !== undefined && daysSince > 0 && (
                    <span className="text-muted-foreground/70"> · {daysSince}d ago</span>
                  )}
                </span>
              </div>
            )}

            {upcomingExam && (
              <div className="flex items-center gap-1.5">
                <AlarmClock
                  className={cn(
                    'h-3 w-3',
                    upcomingExam.daysRemaining <= 3
                      ? 'text-destructive'
                      : 'text-amber-400'
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  <span className="text-foreground font-medium">{upcomingExam.subject}</span>{' '}
                  exam in{' '}
                  <span
                    className={cn(
                      'font-semibold',
                      upcomingExam.daysRemaining <= 3
                        ? 'text-destructive'
                        : 'text-amber-400'
                    )}
                  >
                    {upcomingExam.daysRemaining}d
                  </span>
                </span>
              </div>
            )}

            {weakestTopic && (
              <div className="flex items-center gap-1.5">
                <Target className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Weak: <span className="text-foreground font-medium">{weakestTopic}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dismiss */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={onDismiss}
          aria-label="Dismiss briefing"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
