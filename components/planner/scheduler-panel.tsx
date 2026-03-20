'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Book02Icon, Task01Icon, Loading03Icon, Clock01Icon, ArrowRight01Icon } from 'hugeicons-react'
import { cn } from '@/lib/utils'

export interface ScheduleTask {
  id: string
  subject: string
  topic?: string
  mode: 'lesson' | 'quiz' | 'revision'
  estimatedMinutes?: number
  status: 'pending' | 'completed'
}

interface SchedulerPanelProps {
  tasks: ScheduleTask[]
  onTaskComplete: (taskId: string) => void
  className?: string
}

const modeConfig = {
  lesson: {
    icon: BookOpen,
    label: 'Lesson',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  quiz: {
    icon: ClipboardCheck,
    label: 'Quiz',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
  revision: {
    icon: RotateCcw,
    label: 'Revision',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
}

export function SchedulerPanel({ tasks, onTaskComplete, className }: SchedulerPanelProps) {
  const router = useRouter()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  const handleTaskClick = (task: ScheduleTask) => {
    const subject = encodeURIComponent(task.subject.toLowerCase().replace(/\s+/g, '-'))
    const params = new URLSearchParams()
    if (task.topic) params.set('topic', task.topic)
    if (task.mode) params.set('mode', task.mode)
    router.push(`/mentor/${subject}?${params.toString()}`)
  }

  const pending = tasks.filter((t) => t.status === 'pending')
  const completed = tasks.filter((t) => t.status === 'completed')

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Today
        </h3>
        <span className="text-xs text-muted-foreground">{today}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground">
            No tasks scheduled yet. Ask the AI to plan your week!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {pending.map((task) => {
            const cfg = modeConfig[task.mode]
            const Icon = cfg.icon
            return (
              <button
                key={task.id}
                id={`task-${task.id}`}
                onClick={() => handleTaskClick(task)}
                className="w-full group flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-all hover:border-primary/40 hover:bg-card/80 hover:shadow-sm"
              >
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', cfg.bg)}>
                  <Icon className={cn('h-4 w-4', cfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{task.subject}</p>
                  {task.topic && (
                    <p className="text-xs text-muted-foreground truncate">{task.topic}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {task.estimatedMinutes && (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {task.estimatedMinutes}m
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
              </button>
            )
          })}

          {completed.length > 0 && (
            <>
              <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wide pt-1">
                Completed
              </p>
              {completed.map((task) => {
                const cfg = modeConfig[task.mode]
                const Icon = cfg.icon
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/40 p-3 opacity-50"
                  >
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', cfg.bg)}>
                      <Icon className={cn('h-4 w-4', cfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-through truncate">
                        {task.subject}
                      </p>
                      {task.topic && (
                        <p className="text-xs text-muted-foreground truncate">{task.topic}</p>
                      )}
                    </div>
                    <span className="text-[11px] text-green-400 font-medium">Done</span>
                  </div>
                )
              })}
            </>
          )}
        </div>
      )}
    </div>
  )
}
