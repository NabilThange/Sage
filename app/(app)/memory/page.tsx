'use client'

import React, { useState, useEffect } from 'react'
import { AppShell } from '@/components/app/app-shell'
import { useAuth } from '@/providers/auth-provider'
import { useMemory } from '@/providers/memory-provider'
import {
  AiNetworkIcon,
  Earth01Icon,
  Book02Icon,
  ViewIcon,
  Message01Icon,
  Loading03Icon,
  AiStar01Icon,
  Clock01Icon,
  Tag01Icon,
} from 'hugeicons-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MEMORY_TYPES = [
  {
    id: 'world',
    label: 'World Knowledge',
    icon: Earth01Icon,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    description: 'General facts and domain knowledge Recallio has about your subjects',
  },
  {
    id: 'experiences',
    label: 'Your Experiences',
    icon: Book02Icon,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    description: 'Specific events: quizzes taken, sessions completed, topics studied',
  },
  {
    id: 'observations',
    label: 'Observations',
    icon: ViewIcon,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
    description: 'Patterns Recallio noticed: which topics you struggle with, your learning rhythm',
  },
  {
    id: 'opinions',
    label: 'AI Opinions',
    icon: Message01Icon,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
    description: 'What Recallio thinks you should study, your proficiency estimates per subject',
  },
]

const DEMO_MEMORIES: Record<string, Array<{ content: string; timestamp: string; tags: string[] }>> = {
  world: [
    { content: 'IOT (Internet of Things) covers sensor networks, VSWR, antenna gain, and RF communications. BTech CSE Sem 3 syllabus includes Chapters 1–5.', timestamp: '3 days ago', tags: ['IOT', 'RF', 'antenna'] },
    { content: 'Data Structures includes graph traversal (BFS, DFS), binary heaps, and red-black trees for Sem 3 exam prep.', timestamp: '5 days ago', tags: ['DS', 'graphs', 'trees'] },
    { content: 'Operating Systems exam covers process management, scheduling algorithms (FCFS, Round Robin), and virtual memory.', timestamp: '1 week ago', tags: ['OS', 'processes', 'memory'] },
  ],
  experiences: [
    { content: 'Completed IOT quiz: scored 58/100. Missed questions on VSWR calculation and antenna gain formulas.', timestamp: '2 days ago', tags: ['IOT', 'quiz', 'weak'] },
    { content: 'Studied Data Structures — Graph Traversal for 45 minutes. Completed Chapter 4 flashcards.', timestamp: '3 days ago', tags: ['DS', 'session', 'flashcards'] },
    { content: 'Accepted AI schedule: 3 IOT sessions before exam on Saturday. Declined original Monday plan.', timestamp: '4 days ago', tags: ['schedule', 'planner'] },
    { content: 'Onboarding complete: set BTech CSE Sem 3, 5 subjects uploaded, exams set for next 3 weeks.', timestamp: '1 week ago', tags: ['onboarding', 'setup'] },
  ],
  observations: [
    { content: 'Aryan consistently under-performs on IOT application-level questions (3 consecutive quizzes below 65%).', timestamp: '2 days ago', tags: ['IOT', 'weakness', 'pattern'] },
    { content: 'Study sessions are most productive between 8–11 PM. Average session: 42 minutes.', timestamp: '5 days ago', tags: ['behaviour', 'timing'] },
    { content: 'Aryan tends to accept AI schedule suggestions only when exams are within 5 days.', timestamp: '6 days ago', tags: ['behaviour', 'planning'] },
  ],
  opinions: [
    { content: 'Aryan should prioritise IOT Chapters 3–5 this week. Based on quiz performance, antenna theory needs 2 more focused sessions.', timestamp: '2 days ago', tags: ['IOT', 'recommendation'] },
    { content: 'IOT proficiency estimate: 52%. Data Structures: 71%. OS: 68%. Based on 3 quizzes and onboarding self-assessment.', timestamp: '3 days ago', tags: ['proficiency', 'estimate'] },
    { content: 'Recommend a mixed session Thursday: IOT flashcards (20 min) + quiz (15 min) + one fresh concept (15 min).', timestamp: '4 days ago', tags: ['plan', 'recommendation'] },
  ],
}

export default function MemoryPage() {
  const { userId, userName } = useAuth()
  const { recall, reflect } = useMemory()
  const [activeType, setActiveType] = useState('world')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [insight, setInsight] = useState<string | null>(null)
  const [insightLoading, setInsightLoading] = useState(false)

  const currentType = MEMORY_TYPES.find(t => t.id === activeType)!
  const memories = DEMO_MEMORIES[activeType] ?? []

  const handleRefresh = async () => {
    if (!userId) return
    setIsRefreshing(true)
    try {
      await recall('all memory types, subjects, study sessions')
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000)
    }
  }

  const handleReflect = async () => {
    if (!userId) return
    setInsightLoading(true)
    try {
      const result = await reflect('What are the most important insights about this student\'s learning patterns?')
      setInsight(result || 'Memory reflection complete. Insights updated.')
    } catch {
      setInsight('Reflection complete based on accumulated memory.')
    } finally {
      setInsightLoading(false)
    }
  }

  return (
    <AppShell requireOnboarding>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <AiNetworkIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">Memory Panel</h1>
              <p className="text-xs text-muted-foreground">Hindsight AI memory for {userName ?? 'you'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-8 text-xs"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <Loading03Icon className={cn('h-3 w-3', isRefreshing && 'animate-spin')} />
              Sync
            </Button>
            <Button
              size="sm"
              className="gap-2 h-8 text-xs"
              onClick={handleReflect}
              disabled={insightLoading}
            >
              <AiStar01Icon className="h-3 w-3" />
              {insightLoading ? 'Reflecting…' : 'Reflect'}
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Memory type tabs */}
          <div className="w-64 shrink-0 border-r border-border flex flex-col overflow-y-auto">
            <div className="p-3 space-y-1">
              {MEMORY_TYPES.map(type => {
                const Icon = type.icon
                const isActive = activeType === type.id
                return (
                  <button
                    key={type.id}
                    onClick={() => setActiveType(type.id)}
                    className={cn(
                      'w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all duration-200',
                      isActive
                        ? `${type.bg} ${type.border} border`
                        : 'hover:bg-secondary/50 border border-transparent'
                    )}
                  >
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5', type.bg)}>
                      <Icon className={cn('h-4 w-4', type.color)} />
                    </div>
                    <div className="min-w-0">
                      <p className={cn('text-sm font-medium leading-tight', isActive ? type.color : 'text-foreground')}>
                        {type.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                        {DEMO_MEMORIES[type.id]?.length ?? 0} memories
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Reflect insight */}
            {insight && (
              <div className="mx-3 mb-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <AiStar01Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary">AI Reflection</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight}</p>
              </div>
            )}
          </div>

          {/* Right: Memory entries */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Type header */}
            <div className="mb-6 flex items-start gap-4">
              <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', currentType.bg)}>
                <currentType.icon className={cn('h-6 w-6', currentType.color)} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{currentType.label}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">{currentType.description}</p>
              </div>
            </div>

            {/* Memory cards */}
            <div className="space-y-3">
              {memories.map((memory, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'rounded-xl border bg-card p-4 animate-card-stagger',
                    currentType.border
                  )}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <p className="text-sm text-foreground leading-relaxed">{memory.content}</p>
                  
                  <div className="flex items-center justify-between mt-3 gap-3">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {memory.tags.map(tag => (
                        <span
                          key={tag}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                            currentType.bg,
                            currentType.color
                          )}
                        >
                          <Tag01Icon className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* Timestamp */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Clock01Icon className="h-3 w-3 text-muted-foreground/50" />
                      <span className="text-[11px] text-muted-foreground">{memory.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {memories.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <currentType.icon className="h-12 w-12 text-muted-foreground/20 mb-4" />
                <p className="text-sm text-muted-foreground">No memories yet in this category.</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Study more to fill this panel.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
