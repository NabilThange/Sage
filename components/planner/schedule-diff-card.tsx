'use client'

import React from 'react'
import { Tick02Icon, Cancel01Icon, ArrowRight01Icon } from 'hugeicons-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ScheduleChange {
  action: 'add' | 'move' | 'remove'
  subject: string
  from?: string
  to?: string
  time?: string
  duration?: string
  mode?: string
}

interface ScheduleDiffCardProps {
  changes: ScheduleChange[]
  onAccept: () => void
  onReject: () => void
  isLoading?: boolean
}

const actionLabel: Record<ScheduleChange['action'], string> = {
  add: 'Add',
  move: 'Move',
  remove: 'Remove',
}

const actionColor: Record<ScheduleChange['action'], string> = {
  add: 'text-[#17C964]',
  move: 'text-[#F5A524]',
  remove: 'text-destructive',
}

export function ScheduleDiffCard({
  changes,
  onAccept,
  onReject,
  isLoading,
}: ScheduleDiffCardProps) {
  return (
    <div className="rounded-xl border border-[#F5A524]/30 bg-[#F5A524]/5 p-4 animate-step-in">
      <p className="mb-3 text-xs font-semibold text-[#F5A524] uppercase tracking-wide">
        Suggested schedule update
      </p>

      <ul className="space-y-2 mb-4">
        {changes.map((change, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className={cn('font-semibold shrink-0', actionColor[change.action])}>
              {actionLabel[change.action]}
            </span>
            <span className="text-foreground font-medium">{change.subject}</span>
            {change.mode && (
              <span className="text-muted-foreground">— {change.mode}</span>
            )}
            {change.from && change.to && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <span>{change.from}</span>
                <ArrowRight className="h-3 w-3" />
                <span className="text-foreground">{change.to}</span>
              </span>
            )}
            {change.time && !change.from && (
              <span className="text-muted-foreground">at {change.time}</span>
            )}
            {change.duration && (
              <span className="text-muted-foreground">· {change.duration}</span>
            )}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Button
          id="schedule-diff-accept"
          size="sm"
          className="gap-1.5 h-8 rounded-lg text-xs"
          onClick={onAccept}
          disabled={isLoading}
        >
          <Check className="h-3.5 w-3.5" />
          Accept
        </Button>
        <Button
          id="schedule-diff-reject"
          variant="outline"
          size="sm"
          className="gap-1.5 h-8 rounded-lg text-xs"
          onClick={onReject}
          disabled={isLoading}
        >
          <X className="h-3.5 w-3.5" />
          Reject
        </Button>
      </div>
    </div>
  )
}
