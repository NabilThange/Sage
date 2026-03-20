'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/app/app-shell'
import { SourcesPanel } from '@/components/mentor/sources-panel'
import { MentorChat } from '@/components/mentor/mentor-chat'
import { StudioPanel } from '@/components/mentor/studio-panel'
import { useAuth } from '@/providers/auth-provider'
import { useMemory } from '@/providers/memory-provider'
import { PanelLeftClose, PanelRightClose, PanelLeft, PanelRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MentorSubjectPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { profile } = useAuth()
  const { recall, retain } = useMemory()

  const [showSources, setShowSources] = useState(true)
  const [showStudio, setShowStudio] = useState(true)
  const [lastStudied, setLastStudied] = useState<string | undefined>()
  const [weakAreas, setWeakAreas] = useState<string[]>([])
  const [scoreTrend, setScoreTrend] = useState<'up' | 'down' | 'stable'>('stable')
  const [score, setScore] = useState<number | undefined>()
  const [selectedModule, setSelectedModule] = useState<string>('')

  // Decode the subject slug from URL
  const subjectSlug = decodeURIComponent(params.subject as string)

  // Find the matching subject in user profile
  const subject = profile?.subjects?.find(
    (s) => s.name.toLowerCase().replace(/\s+/g, '-') === subjectSlug
  )

  // Get initial topic from query params (from Planner scheduler click)
  const initialTopic = searchParams.get('topic') || undefined

  // Fetch Hindsight memory for this subject on mount
  useEffect(() => {
    const fetchSubjectMemory = async () => {
      try {
        const memories = await recall(
          `${subject?.name} study history, last session, weak areas, test scores, performance trend`
        )
        if (memories) {
          // Parse memory for metadata — in production this would be structured
          if (memories.includes('VSWR')) setWeakAreas(['VSWR', 'Antenna Gain'])
          else if (memories.includes('graph')) setWeakAreas(['Graph Traversal'])
          else if (memories.includes('scheduling')) setWeakAreas(['Round Robin'])

          const scoreMatch = memories.match(/(\d+)%/)
          if (scoreMatch) setScore(parseInt(scoreMatch[1]))

          setLastStudied('3 days ago')
          setScoreTrend('up')
        }
      } catch {
        // API not ready — use defaults
      }
    }

    if (subject) {
      fetchSubjectMemory()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject?.name])

  // Handle Pomodoro completion → retain to memory
  const handlePomodoroComplete = useCallback(async (response: string) => {
    if (!subject) return
    try {
      await retain(
        'pomodoro_complete',
        `Student completed a Pomodoro session studying ${subject.name}${selectedModule ? `, topic: ${selectedModule}` : ''}. Self-assessment: "${response}". Timestamp: ${new Date().toISOString()}`
      )
    } catch {
      // API not ready
    }
  }, [subject, selectedModule, retain])

  // Not found state
  if (!subject) {
    return (
      <AppShell requireOnboarding>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center animate-step-in">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Subject not found
            </h1>
            <p className="text-muted-foreground text-sm max-w-md">
              Could not find a matching subject in your profile. Go back to the subject grid and try again.
            </p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell requireOnboarding>
      <div className="flex-1 flex flex-col h-[calc(100vh-0px)] animate-step-in">
        {/* Top bar with panel toggles */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-card/30">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg"
            onClick={() => setShowSources(!showSources)}
          >
            {showSources ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </Button>

          <span className="text-xs text-muted-foreground font-medium">
            {subject.name}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg"
            onClick={() => setShowStudio(!showStudio)}
          >
            {showStudio ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* 3-panel layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left — Sources panel */}
          {showSources && (
            <div className="w-64 shrink-0 border-r border-border/40 bg-card/20 overflow-y-auto hidden lg:block">
              <SourcesPanel
                subjectName={subject.name}
                lastStudied={lastStudied}
                weakAreas={weakAreas}
                scoreTrend={scoreTrend}
                score={score}
              />
            </div>
          )}

          {/* Centre — Chat */}
          <div className="flex-1 min-w-0 flex flex-col">
            <MentorChat
              subjectName={subject.name}
              chapters={subject.chapters}
              initialTopic={initialTopic}
              lastStudied={lastStudied}
              weakAreas={weakAreas}
              scoreTrend={scoreTrend}
              score={score}
            />
          </div>

          {/* Right — Studio panel */}
          {showStudio && (
            <div className="w-72 shrink-0 border-l border-border/40 bg-card/20 overflow-y-auto hidden lg:block">
              <StudioPanel
                subjectName={subject.name}
                moduleName={selectedModule || subject.chapters[0]?.name || subject.name}
                onPomodoroComplete={handlePomodoroComplete}
              />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
