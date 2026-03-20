'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { TickDouble02Icon, CancelCircleIcon } from 'hugeicons-react'

interface QuestionCardProps {
  questionNumber: number
  totalQuestions: number
  question: string
  options: string[]
  selectedOption: number | null
  onSelect: (index: number) => void
  /** Review mode — show correct/incorrect */
  isReview?: boolean
  correctAnswer?: number
}

export function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  options,
  selectedOption,
  onSelect,
  isReview = false,
  correctAnswer,
}: QuestionCardProps) {
  const getOptionState = (index: number) => {
    if (!isReview) {
      return selectedOption === index ? 'selected' : 'default'
    }
    // Review mode
    if (index === correctAnswer) return 'correct'
    if (index === selectedOption && index !== correctAnswer) return 'incorrect'
    return 'default'
  }

  return (
    <div className="animate-step-in">
      {/* Question header */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-2 font-mono">
          Question {questionNumber} of {totalQuestions}
        </p>
        <h2 className="text-xl font-medium text-foreground leading-relaxed">
          {question}
        </h2>
      </div>

      {/* 2×2 Option grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option, index) => {
          const state = getOptionState(index)
          return (
            <button
              key={index}
              onClick={() => !isReview && onSelect(index)}
              disabled={isReview}
              className={cn(
                'relative flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all duration-200',
                'hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                // Default
                state === 'default' && 'border-border bg-card hover:border-muted-foreground/30 cursor-pointer',
                // Selected (during test)
                state === 'selected' && 'border-primary bg-primary/10 glow-primary cursor-pointer',
                // Correct (review)
                state === 'correct' && 'border-success bg-success/10 cursor-default',
                // Incorrect (review)
                state === 'incorrect' && 'border-destructive bg-destructive/10 animate-shake cursor-default',
                // Disabled in review
                isReview && state === 'default' && 'opacity-50 cursor-default'
              )}
            >
              {/* Option letter badge */}
              <span
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold',
                  state === 'default' && 'bg-secondary text-secondary-foreground',
                  state === 'selected' && 'bg-primary text-primary-foreground',
                  state === 'correct' && 'bg-success text-white',
                  state === 'incorrect' && 'bg-destructive text-white'
                )}
              >
                {String.fromCharCode(65 + index)}
              </span>

              {/* Option text */}
              <span className="flex-1 text-sm text-foreground pt-1">
                {option.replace(/^[A-D]\.\s*/, '')}
              </span>

              {/* Review icons */}
              {isReview && state === 'correct' && (
                <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-success mt-1" />
              )}
              {isReview && state === 'incorrect' && (
                <XCircle className="flex-shrink-0 w-5 h-5 text-destructive mt-1" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
