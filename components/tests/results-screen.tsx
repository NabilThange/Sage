'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { QuestionCard } from '@/components/tests/question-card'
import { useMemory } from '@/providers/memory-provider'
import {
  Trophy01Icon,
  Target01Icon,
  Clock01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Book02Icon,
  Loading03Icon,
  AiNetworkIcon,
  AiStar01Icon,
} from 'hugeicons-react'
import { cn } from '@/lib/utils'

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface ResultsScreenProps {
  subject: string
  topic?: string
  questions: QuizQuestion[]
  answers: Record<number, number>
  timeSpent: number // in seconds
  onGoToMentor: () => void
  onRetake: () => void
  onNewTest: () => void
}

export function ResultsScreen({
  subject,
  topic,
  questions,
  answers,
  timeSpent,
  onGoToMentor,
  onRetake,
  onNewTest,
}: ResultsScreenProps) {
  const { reflect } = useMemory()
  const [insight, setInsight] = useState('')
  const [insightLoading, setInsightLoading] = useState(true)
  const [expandedQ, setExpandedQ] = useState<number | null>(null)

  // Calculate results
  const totalQuestions = questions.length
  const correctCount = questions.reduce(
    (acc, q, i) => (answers[i] === q.correctAnswer ? acc + 1 : acc),
    0
  )
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const timeMinutes = Math.floor(timeSpent / 60)
  const timeSeconds = timeSpent % 60

  // Get reflect() insight
  useEffect(() => {
    const wrongTopics = questions
      .filter((q, i) => answers[i] !== q.correctAnswer)
      .map((q) => q.question.slice(0, 80))
      .join('; ')

    const reflectQuestion = `The student just completed a ${subject}${topic ? ` (${topic})` : ''} quiz. They scored ${correctCount}/${totalQuestions} (${percentage}%). They got these questions wrong: ${wrongTopics || 'none — perfect score!'}. Give a one-sentence qualitative insight about their performance and what they should focus on next.`

    const fetchInsight = async () => {
      try {
        const result = await reflect(reflectQuestion)
        setInsight(result || getLocalInsight())
      } catch {
        setInsight(getLocalInsight())
      } finally {
        setInsightLoading(false)
      }
    }

    fetchInsight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fallback local insight if reflect() fails
  const getLocalInsight = () => {
    if (percentage >= 90) return `Excellent performance in ${subject}! You have a strong grasp of this material.`
    if (percentage >= 70) return `Good understanding of ${subject}. Focus on the questions you missed to close the remaining gaps.`
    if (percentage >= 50) return `Decent effort in ${subject}, but several areas need attention. Consider reviewing the missed topics with your Mentor.`
    return `${subject} needs significant review. We recommend going back to your Mentor for a focused study session on the areas you struggled with.`
  }

  // Determine score color
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-success'
    if (percentage >= 60) return 'text-warning'
    return 'text-destructive'
  }

  return (
    <div className="animate-step-in max-w-2xl mx-auto px-6 py-8">
      {/* Score header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-card border-2 border-border mb-4">
          <Trophy className={cn('w-10 h-10', getScoreColor())} />
        </div>

        <h1 className="text-3xl font-semibold text-foreground mb-1">
          <span className={getScoreColor()}>{correctCount}</span>
          <span className="text-muted-foreground">/{totalQuestions}</span>
        </h1>

        <div className={cn('text-5xl font-bold mb-4 font-mono', getScoreColor())}>
          {percentage}%
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            {subject}{topic && topic !== '_all' ? ` · ${topic}` : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {timeMinutes}m {timeSeconds}s
          </span>
        </div>
      </div>

      {/* AI Insight card */}
      <div className="bg-card border border-primary/30 rounded-xl p-5 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-info to-primary" />
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
            {insightLoading ? (
              <Sparkles className="w-4 h-4 text-primary animate-pulse-subtle" />
            ) : (
              <Brain className="w-4 h-4 text-primary" />
            )}
          </div>
          <div>
            <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
              AI Insight
            </p>
            {insightLoading ? (
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded animate-pulse-subtle w-full" />
                <div className="h-3 bg-muted rounded animate-pulse-subtle w-3/4" />
              </div>
            ) : (
              <p className="text-sm text-foreground leading-relaxed">{insight}</p>
            )}
          </div>
        </div>
      </div>

      {/* Q&A Review */}
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Question Review
      </h2>

      <div className="space-y-3 mb-8">
        {questions.map((q, i) => {
          const isCorrect = answers[i] === q.correctAnswer
          const isExpanded = expandedQ === i

          return (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              {/* Collapsed row */}
              <button
                onClick={() => setExpandedQ(isExpanded ? null : i)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/50 transition-colors"
              >
                {/* Status indicator */}
                <span
                  className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                    isCorrect
                      ? 'bg-success/20 text-success'
                      : 'bg-destructive/20 text-destructive'
                  )}
                >
                  {i + 1}
                </span>

                <span className="flex-1 text-sm text-foreground truncate">
                  {q.question}
                </span>

                {isExpanded
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                }
              </button>

              {/* Expanded — full question review */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border pt-4">
                  <QuestionCard
                    questionNumber={i + 1}
                    totalQuestions={totalQuestions}
                    question={q.question}
                    options={q.options}
                    selectedOption={answers[i] ?? null}
                    onSelect={() => {}}
                    isReview
                    correctAnswer={q.correctAnswer}
                  />
                  {q.explanation && (
                    <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs text-primary font-medium mb-1">Explanation</p>
                      <p className="text-sm text-muted-foreground">{q.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button
          id="go-to-mentor-btn"
          onClick={onGoToMentor}
          className="w-full sm:flex-1 h-12 gap-2"
          size="lg"
        >
          <BookOpen className="w-4 h-4" />
          Go to Mentor
        </Button>
        <Button
          id="retake-test-btn"
          variant="outline"
          onClick={onRetake}
          className="w-full sm:flex-1 h-12 gap-2"
          size="lg"
        >
          <RotateCcw className="w-4 h-4" />
          Retake
        </Button>
        <Button
          id="new-test-btn"
          variant="ghost"
          onClick={onNewTest}
          className="w-full sm:flex-1 h-12 gap-2"
          size="lg"
        >
          New Test
        </Button>
      </div>
    </div>
  )
}
