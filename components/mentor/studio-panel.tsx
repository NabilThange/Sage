'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { FlashcardsWidget } from '@/components/mentor/flashcards-widget'
import { SummaryWidget } from '@/components/mentor/summary-widget'
import { MindMapPlaceholder } from '@/components/mentor/mind-map-placeholder'
import { SlideDeckPlaceholder } from '@/components/mentor/slide-deck-placeholder'
import { PomodoroTimer } from '@/components/shared/pomodoro-timer'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ClipboardCheck } from 'lucide-react'
import Link from 'next/link'

interface StudioPanelProps {
  subjectName: string
  moduleName: string
  onPomodoroComplete?: (response: string) => void
}

export function StudioPanel({
  subjectName,
  moduleName,
  onPomodoroComplete,
}: StudioPanelProps) {
  const subjectSlug = encodeURIComponent(subjectName.toLowerCase().replace(/\s+/g, '-'))

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/40">
        <h3 className="text-sm font-semibold text-foreground">Studio</h3>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Flashcards — ✅ Working */}
        <FlashcardsWidget
          subjectName={subjectName}
          moduleName={moduleName}
        />

        <Separator className="opacity-40" />

        {/* Summary — ✅ Working */}
        <SummaryWidget
          subjectName={subjectName}
          moduleName={moduleName}
        />

        <Separator className="opacity-40" />

        {/* Mind Map — 🔲 Placeholder */}
        <MindMapPlaceholder />

        <Separator className="opacity-40" />

        {/* Slide Deck — 🔲 Placeholder */}
        <SlideDeckPlaceholder />

        <Separator className="opacity-40" />

        {/* Quiz — ✅ Working → navigates to /tests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Quiz</span>
          </div>
          <Link
            href={`/tests?subject=${encodeURIComponent(subjectName)}&topic=${encodeURIComponent(moduleName)}&mode=mentor`}
          >
            <Button
              variant="outline"
              className="w-full gap-2 text-xs h-9 border-primary/30 text-primary hover:bg-primary/5"
            >
              <ClipboardCheck className="h-3.5 w-3.5" />
              Take a Quiz
            </Button>
          </Link>
        </div>

        <Separator className="opacity-40" />

        {/* Pomodoro Timer */}
        <PomodoroTimer onComplete={onPomodoroComplete} />
      </div>
    </div>
  )
}
