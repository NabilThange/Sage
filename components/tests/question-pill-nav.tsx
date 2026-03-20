'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface QuestionPillNavProps {
  totalQuestions: number
  currentQuestion: number
  answeredQuestions: Set<number>
  onNavigate: (index: number) => void
}

export function QuestionPillNav({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onNavigate,
}: QuestionPillNavProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {Array.from({ length: totalQuestions }, (_, i) => {
        const isCurrent = i === currentQuestion
        const isAnswered = answeredQuestions.has(i)

        return (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className={cn(
              'w-9 h-9 rounded-full text-sm font-medium transition-all duration-200',
              'flex items-center justify-center',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              // Current
              isCurrent && 'bg-primary text-primary-foreground shadow-md scale-110',
              // Answered (not current)
              !isCurrent && isAnswered && 'bg-success/20 text-success border border-success/40',
              // Unanswered (not current)
              !isCurrent && !isAnswered && 'bg-secondary text-secondary-foreground hover:bg-accent'
            )}
            aria-label={`Go to question ${i + 1}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            {i + 1}
          </button>
        )
      })}
    </div>
  )
}
