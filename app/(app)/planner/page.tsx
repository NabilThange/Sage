'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AppShell } from '@/components/app/app-shell'
import { useAuth } from '@/providers/auth-provider'
import { useMemory } from '@/providers/memory-provider'
import { DailyBriefingCard } from '@/components/planner/daily-briefing-card'
import { PlannerChat } from '@/components/planner/planner-chat'
import { SchedulerPanel, type ScheduleTask } from '@/components/planner/scheduler-panel'
import { CalendarPanel, type CalendarEvent } from '@/components/planner/calendar-panel'
import { Calendar03Icon, LayoutLeftIcon } from 'hugeicons-react'
import { cn } from '@/lib/utils'

interface BriefingData {
  streak: number
  lastSubject?: string
  daysSince?: number
  upcomingExam?: { subject: string; daysRemaining: number }
  weakestTopic?: string
  aiInsight?: string
}

// Demo seed data for Aryan when Hindsight keys not configured
const ARYAN_BRIEFING: BriefingData = {
  streak: 12,
  lastSubject: 'IOT',
  daysSince: 3,
  upcomingExam: { subject: 'IOT', daysRemaining: 4 },
  weakestTopic: 'VSWR, Antenna Gain',
  aiInsight: 'Based on your last 3 quizzes, you consistently miss IOT application-level questions. 2 focused sessions this week + a revision quiz Thursday is ideal.',
}

const DEMO_TASKS: ScheduleTask[] = [
  { id: '1', subject: 'IOT', topic: 'Chapter 3 — Antenna Theory', mode: 'lesson', estimatedMinutes: 50, status: 'pending' },
  { id: '2', subject: 'Data Structures', topic: 'Graph Traversal', mode: 'quiz', estimatedMinutes: 25, status: 'pending' },
  { id: '3', subject: 'OS', topic: 'Process Management', mode: 'revision', estimatedMinutes: 30, status: 'completed' },
]

const today = new Date()
const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }

const DEMO_EVENTS: CalendarEvent[] = [
  { date: fmt(addDays(today, 4)), type: 'exam', label: 'IOT Exam' },
  { date: fmt(addDays(today, 14)), type: 'exam', label: 'OS Exam' },
  { date: fmt(addDays(today, -1)), type: 'session', label: 'Data Structures — Binary Trees' },
  { date: fmt(today), type: 'scheduled', label: 'IOT — Antenna Theory' },
  { date: fmt(today), type: 'scheduled', label: 'DS — Graph Quiz' },
]

export default function PlannerPage() {
  const { userId, userName, profile } = useAuth()
  const { recall, reflect } = useMemory()

  const [briefing, setBriefing] = useState<BriefingData | null>(null)
  const [briefingLoading, setBriefingLoading] = useState(true)
  const [isBriefingDismissed, setIsBriefingDismissed] = useState(false)
  const [tasks, setTasks] = useState<ScheduleTask[]>(DEMO_TASKS)
  const [events, setEvents] = useState<CalendarEvent[]>(DEMO_EVENTS)
  const [rightTab, setRightTab] = useState<'scheduler' | 'calendar'>('scheduler')

  // Load daily briefing on mount via Hindsight recall() + reflect()
  useEffect(() => {
    if (!userId) return

    const loadBriefing = async () => {
      setBriefingLoading(true)
      try {
        const [memoryCtx, insight] = await Promise.all([
          recall('last study session, upcoming exams, weak areas, streak'),
          reflect('What should this student focus on today? What are the most important things to know?'),
        ])

        // Parse key info from memory context (natural-language → structured)
        const streakMatch = memoryCtx.match(/(\d+)[- ]day streak/i)
        const lastSubjectMatch = memoryCtx.match(/(?:studied|session|studying)\s+([A-Z][A-Za-z\s]+?)(?:\s+for|\s+on|\.|,)/i)
        const examMatch = memoryCtx.match(/([A-Z][A-Za-z\s]+?)\s+exam\s+(?:in|on)\s+(\d+)/i)
        const weakMatch = memoryCtx.match(/(?:weak|struggle|miss|fail)[^.]*?(?:in|on|with)?\s+([A-Z][A-Za-z\s,]+)/i)

        const parsed: BriefingData = {
          streak: streakMatch ? parseInt(streakMatch[1]) : (profile?.streakCount ?? 0),
          lastSubject: lastSubjectMatch?.[1]?.trim() ?? undefined,
          daysSince: undefined,
          upcomingExam: examMatch
            ? { subject: examMatch[1].trim(), daysRemaining: parseInt(examMatch[2]) }
            : undefined,
          weakestTopic: weakMatch?.[1]?.trim() ?? undefined,
          aiInsight: insight || undefined,
        }

        // If memory context is empty/mock, use demo data for Aryan
        if (!memoryCtx || memoryCtx.startsWith('[Mock')) {
          const isAryan = userName?.toLowerCase() === 'aryan'
          setBriefing(isAryan ? ARYAN_BRIEFING : { streak: 0 })
        } else {
          setBriefing(parsed)
        }
      } catch {
        const isAryan = userName?.toLowerCase() === 'aryan'
        setBriefing(isAryan ? ARYAN_BRIEFING : { streak: 0 })
      } finally {
        setBriefingLoading(false)
      }
    }

    loadBriefing()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleTaskComplete = useCallback((taskId: string) => {
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t)
    )
  }, [])

  const handleTasksChanged = useCallback((newTasks: ScheduleTask[]) => {
    setTasks(prev => [...prev, ...newTasks])
  }, [])

  const handleEventsChanged = useCallback((newEvents: CalendarEvent[]) => {
    setEvents(prev => [...prev, ...newEvents])
  }, [])

  const showBriefing =
    !isBriefingDismissed &&
    (briefingLoading || (briefing !== null && (briefing.streak > 0 || briefing.aiInsight || briefing.upcomingExam)))

  return (
    <AppShell requireOnboarding>
      <div className="flex h-screen overflow-hidden">

        {/* ── Center: Chat column ── */}
        <div className="flex flex-1 flex-col min-w-0 border-r border-border">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3 shrink-0">
            <h1 className="text-base font-semibold text-foreground">Planner</h1>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              AI-powered
            </span>
          </div>

          {/* Daily briefing card */}
          {showBriefing && (
            <div className="px-4 pt-3 shrink-0">
              <DailyBriefingCard
                streak={briefing?.streak ?? 0}
                name={userName ?? 'Student'}
                lastSubject={briefing?.lastSubject}
                daysSince={briefing?.daysSince}
                upcomingExam={briefing?.upcomingExam}
                weakestTopic={briefing?.weakestTopic}
                aiInsight={briefing?.aiInsight}
                onDismiss={() => setIsBriefingDismissed(true)}
                isLoading={briefingLoading}
              />
            </div>
          )}

          {/* Chat */}
          <div className="flex-1 min-h-0">
            <PlannerChat
              onTasksChanged={handleTasksChanged}
              onEventsChanged={handleEventsChanged}
            />
          </div>
        </div>

        {/* ── Right: Scheduler + Calendar column ── */}
        <div className="hidden lg:flex w-72 xl:w-80 shrink-0 flex-col">
          {/* Tab switcher */}
          <div className="flex border-b border-border shrink-0">
            <button
              onClick={() => setRightTab('scheduler')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 py-3 text-xs font-medium transition-colors',
                rightTab === 'scheduler'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutList className="h-3.5 w-3.5" />
              Today
            </button>
            <button
              onClick={() => setRightTab('calendar')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 py-3 text-xs font-medium transition-colors',
                rightTab === 'calendar'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Calendar
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto p-4">
            {rightTab === 'scheduler' ? (
              <SchedulerPanel
                tasks={tasks}
                onTaskComplete={handleTaskComplete}
              />
            ) : (
              <CalendarPanel events={events} />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
