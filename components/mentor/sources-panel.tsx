'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { FileAttachmentIcon, Add01Icon, AiNetworkIcon } from 'hugeicons-react'
import { Button } from '@/components/ui/button'
import { HindsightStrip } from '@/components/shared/hindsight-strip'
import { Separator } from '@/components/ui/separator'

interface SourcesPanelProps {
  subjectName: string
  lastStudied?: string
  weakAreas?: string[]
  scoreTrend?: 'up' | 'down' | 'stable'
  score?: number
}

export function SourcesPanel({
  subjectName,
  lastStudied,
  weakAreas = [],
  scoreTrend,
  score,
}: SourcesPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/40">
        <h3 className="text-sm font-semibold text-foreground">Sources</h3>
      </div>

      {/* Sources list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Auto-loaded syllabus */}
        <div
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg',
            'bg-primary/5 border border-primary/20',
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              syllabus.pdf
            </p>
            <p className="text-[10px] text-muted-foreground">{subjectName} curriculum</p>
          </div>
          <span className="ml-auto text-[10px] text-[#17C964] font-medium">✓</span>
        </div>

        {/* Add source button */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 h-10 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
          Add source
        </Button>
      </div>

      <Separator />

      {/* Hindsight History */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">🧠 History</span>
        </div>
        <HindsightStrip
          variant="sidebar"
          lastStudied={lastStudied}
          weakAreas={weakAreas}
          scoreTrend={scoreTrend}
          score={score}
        />
      </div>
    </div>
  )
}
