'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/app/app-shell'
import { useAuth } from '@/providers/auth-provider'
import {
  MortarboardIcon,
  Cpu01Icon,
  BinaryCodeIcon,
  ComputerIcon,
  WifiConnected03Icon,
  DatabaseIcon,
  Book02Icon,
  Calculator01Icon,
  ArrowRight01Icon,
  TrendingUp01Icon,
  TrendingDown01Icon,
  Remove01Icon,
} from 'hugeicons-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Subject {
  id: string
  name: string
  icon: React.ElementType
  progress: number // 0–100
  trend: 'up' | 'down' | 'stable'
  lastStudied?: string
  chapters: number
  completedChapters: number
  color: string
  bg: string
  border: string
}

const SUBJECTS: Subject[] = [
  {
    id: 'iot',
    name: 'Internet of Things',
    icon: Cpu01Icon,
    progress: 52,
    trend: 'up',
    lastStudied: '2 days ago',
    chapters: 5,
    completedChapters: 2,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    icon: BinaryCodeIcon,
    progress: 71,
    trend: 'up',
    lastStudied: '3 days ago',
    chapters: 6,
    completedChapters: 4,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
  },
  {
    id: 'operating-systems',
    name: 'Operating Systems',
    icon: ComputerIcon,
    progress: 68,
    trend: 'stable',
    lastStudied: '5 days ago',
    chapters: 5,
    completedChapters: 3,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    border: 'border-violet-400/20',
  },
  {
    id: 'computer-networks',
    name: 'Computer Networks',
    icon: WifiConnected03Icon,
    progress: 44,
    trend: 'down',
    lastStudied: '1 week ago',
    chapters: 4,
    completedChapters: 1,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
  },
  {
    id: 'dbms',
    name: 'Database Management',
    icon: DatabaseIcon,
    progress: 60,
    trend: 'stable',
    lastStudied: '4 days ago',
    chapters: 5,
    completedChapters: 3,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20',
  },
  {
    id: 'discrete-math',
    name: 'Discrete Mathematics',
    icon: Calculator01Icon,
    progress: 35,
    trend: 'down',
    lastStudied: '2 weeks ago',
    chapters: 6,
    completedChapters: 1,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20',
  },
]

const TrendIcon = ({ trend }: { trend: Subject['trend'] }) => {
  if (trend === 'up') return <TrendingUp01Icon className="h-3.5 w-3.5 text-green-400" />
  if (trend === 'down') return <TrendingDown01Icon className="h-3.5 w-3.5 text-destructive" />
  return <Remove01Icon className="h-3.5 w-3.5 text-muted-foreground" />
}

function SubjectCard({ subject, onNavigate }: { subject: Subject; onNavigate: (id: string) => void }) {
  const Icon = subject.icon

  return (
    <button
      id={`subject-card-${subject.id}`}
      onClick={() => onNavigate(subject.id)}
      className={cn(
        'group relative flex flex-col gap-4 rounded-2xl border p-5 text-left',
        'bg-card transition-all duration-200',
        'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
        'animate-card-stagger',
        subject.border
      )}
    >
      {/* Icon + trend */}
      <div className="flex items-start justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', subject.bg)}>
          <Icon className={cn('h-5.5 w-5.5', subject.color)} />
        </div>
        <div className="flex items-center gap-1">
          <TrendIcon trend={subject.trend} />
          <span className="text-xs font-semibold text-foreground">{subject.progress}%</span>
        </div>
      </div>

      {/* Subject name */}
      <div>
        <h3 className="font-semibold text-foreground leading-tight text-base">{subject.name}</h3>
        {subject.lastStudied && (
          <p className="text-xs text-muted-foreground mt-0.5">Last: {subject.lastStudied}</p>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-muted-foreground font-medium">
            {subject.completedChapters}/{subject.chapters} chapters
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary/60 overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700', subject.color.replace('text-', 'bg-'))}
            style={{ width: `${subject.progress}%` }}
          />
        </div>
      </div>

      {/* Go arrow */}
      <ArrowRight01Icon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </button>
  )
}

export default function MentorPage() {
  const { userName } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = SUBJECTS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const weakest = [...SUBJECTS].sort((a, b) => a.progress - b.progress)[0]

  const handleNavigate = (subjectId: string) => {
    router.push(`/mentor/${subjectId}`)
  }

  return (
    <AppShell requireOnboarding>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-6 py-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-base font-semibold text-foreground">Mentor</h1>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {SUBJECTS.length} subjects
              </span>
            </div>
          </div>

          {/* Quick insight */}
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-3 py-2">
            <TrendingDown01Icon className="h-3.5 w-3.5 text-destructive shrink-0" />
            <span className="text-xs text-muted-foreground">
              Weakest subject:{' '}
              <span className="font-medium text-foreground">{weakest.name}</span>
              {' '}at{' '}
              <span className="font-semibold text-destructive">{weakest.progress}%</span>
              {' '}— tap to practice
            </span>
          </div>
        </div>

        {/* Subject grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((subject, idx) => (
              <div key={subject.id} style={{ animationDelay: `${idx * 60}ms` }}>
                <SubjectCard subject={subject} onNavigate={handleNavigate} />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Book02Icon className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <p className="text-sm text-muted-foreground">No subjects found.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
