'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { QuestionCard } from '@/components/tests/question-card'
import { QuestionPillNav } from '@/components/tests/question-pill-nav'
import { TimeWarningOverlay } from '@/components/tests/time-warning-overlay'
import { Clock, ChevronLeft, ChevronRight, Send } from 'lucide-react'

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface TestInterfaceProps {
  subject: string
  questions: QuizQuestion[]
  timeLimitMinutes: number
  onSubmit: (answers: Record<number, number>, timeSpent: number) => void
}

export function TestInterface({
  subject,
  questions,
  timeLimitMinutes,
  onSubmit,
}: TestInterfaceProps) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(timeLimitMinutes * 60)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const startTimeRef = useRef(Date.now())

  const totalQuestions = questions.length
  const answeredSet = new Set(Object.keys(answers).map(Number))
  const showWarning = timeRemaining <= 10 && timeRemaining > 0 && !isSubmitted

  // Timer
  useEffect(() => {
    if (isSubmitted) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isSubmitted])

  // Auto-submit at 0
  useEffect(() => {
    if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, isSubmitted])

  const handleSubmit = useCallback(() => {
    if (isSubmitted) return
    setIsSubmitted(true)
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
    onSubmit(answers, timeSpent)
  }, [answers, isSubmitted, onSubmit])

  const selectAnswer = useCallback((index: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: index }))
  }, [currentQ])

  const goToQuestion = useCallback((index: number) => {
    setCurrentQ(Math.max(0, Math.min(index, totalQuestions - 1)))
  }, [totalQuestions])

  // Format timer
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const timerStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isTimeLow = timeRemaining <= 60

  if (!questions.length) return null

  const q = questions[currentQ]

  return (
    <div className="flex flex-col h-full animate-step-in">
      {/* Warning overlay */}
      {showWarning && <TimeWarningOverlay secondsLeft={timeRemaining} />}

      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        {/* Timer */}
        <div className={`flex items-center gap-2 font-mono text-lg font-semibold ${isTimeLow ? 'text-destructive animate-pulse-subtle' : 'text-foreground'}`}>
          <Clock className="w-5 h-5" />
          {timerStr}
        </div>

        {/* Subject name */}
        <h1 className="text-base font-medium text-foreground hidden sm:block">
          {subject}
        </h1>

        {/* Submit button */}
        <Button
          id="submit-test-btn"
          variant={answeredSet.size === totalQuestions ? 'default' : 'outline'}
          size="sm"
          onClick={handleSubmit}
          className="gap-2"
        >
          <Send className="w-4 h-4" />
          Submit
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <QuestionCard
            questionNumber={currentQ + 1}
            totalQuestions={totalQuestions}
            question={q.question}
            options={q.options}
            selectedOption={answers[currentQ] ?? null}
            onSelect={selectAnswer}
          />
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Pill nav */}
          <div className="flex justify-center">
            <QuestionPillNav
              totalQuestions={totalQuestions}
              currentQuestion={currentQ}
              answeredQuestions={answeredSet}
              onNavigate={goToQuestion}
            />
          </div>

          {/* Prev / Next */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToQuestion(currentQ - 1)}
              disabled={currentQ === 0}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>

            <p className="text-xs text-muted-foreground">
              {answeredSet.size}/{totalQuestions} answered
            </p>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToQuestion(currentQ + 1)}
              disabled={currentQ === totalQuestions - 1}
              className="gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
