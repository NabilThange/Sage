'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/app/app-shell'
import { useAuth } from '@/providers/auth-provider'
import { useMemory } from '@/providers/memory-provider'
import { TestConfigPanel } from '@/components/tests/test-config-panel'
import { TestInterface, type QuizQuestion } from '@/components/tests/test-interface'
import { ResultsScreen } from '@/components/tests/results-screen'

type TestPhase = 'config' | 'loading' | 'test' | 'results'

interface TestConfig {
  subject: string
  topic: string
  questionCount: number
  timeLimit: number
}

export default function TestsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { profile, updateProfile } = useAuth()
  const { retain } = useMemory()

  const [phase, setPhase] = useState<TestPhase>('config')
  const [config, setConfig] = useState<TestConfig | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [timeSpent, setTimeSpent] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Check for Mentor-assigned mode via query params
  useEffect(() => {
    const subject = searchParams.get('subject')
    const topic = searchParams.get('topic')
    const count = searchParams.get('count')
    const time = searchParams.get('time')

    if (subject) {
      // Mentor-assigned mode: auto-start
      const mentorConfig: TestConfig = {
        subject,
        topic: topic ?? '',
        questionCount: count ? parseInt(count) : 10,
        timeLimit: time ? parseInt(time) : 15,
      }
      handleStartTest(mentorConfig)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Generate quiz questions from API
  const handleStartTest = useCallback(async (testConfig: TestConfig) => {
    setConfig(testConfig)
    setPhase('loading')
    setError(null)

    try {
      const res = await fetch('/api/mentor/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile?.userId,
          subject: testConfig.subject,
          topic: testConfig.topic === '_all' ? '' : testConfig.topic,
          questionCount: testConfig.questionCount,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to generate quiz')
      }

      const data = await res.json()
      if (!data.questions?.length) {
        throw new Error('No questions received')
      }

      setQuestions(data.questions)
      setPhase('test')
    } catch (err) {
      console.error('[Tests] Quiz generation failed:', err)
      setError('Failed to generate quiz questions. Please try again.')
      setPhase('config')
    }
  }, [profile?.userId])

  // Handle test submission
  const handleSubmit = useCallback(async (
    submittedAnswers: Record<number, number>,
    submittedTimeSpent: number
  ) => {
    setAnswers(submittedAnswers)
    setTimeSpent(submittedTimeSpent)
    setPhase('results')

    if (!config) return

    // Calculate score
    const correct = questions.reduce(
      (acc, q, i) => (submittedAnswers[i] === q.correctAnswer ? acc + 1 : acc),
      0
    )
    const percentage = questions.length > 0
      ? Math.round((correct / questions.length) * 100)
      : 0

    // Build retain content
    const wrongQuestions = questions
      .filter((q, i) => submittedAnswers[i] !== q.correctAnswer)
      .map((q, i) => {
        const origIdx = questions.indexOf(q)
        return `Q: "${q.question}" — Student answered: "${q.options[submittedAnswers[origIdx]] ?? 'skipped'}", Correct: "${q.options[q.correctAnswer]}"`
      })

    const retainContent = [
      `Quiz completed: ${config.subject}${config.topic && config.topic !== '_all' ? ` — ${config.topic}` : ''}.`,
      `Score: ${correct}/${questions.length} (${percentage}%).`,
      `Time spent: ${Math.floor(submittedTimeSpent / 60)}m ${submittedTimeSpent % 60}s.`,
      `Mode: student-designed.`,
      wrongQuestions.length > 0
        ? `Wrong answers: ${wrongQuestions.join(' | ')}`
        : 'Perfect score — all answers correct.',
      `Date: ${new Date().toISOString()}.`,
    ].join(' ')

    // Fire retain()
    try {
      await retain('quiz_completed', retainContent)
    } catch {
      console.error('[Tests] retain() failed on submit')
    }

    // Save test result to localStorage for profile
    try {
      const existingResults = JSON.parse(
        localStorage.getItem('recallio_test_results') ?? '[]'
      )
      existingResults.push({
        date: new Date().toISOString(),
        subject: config.subject,
        topic: config.topic,
        score: correct,
        total: questions.length,
        percentage,
        timeSpent: submittedTimeSpent,
        questions: questions.map((q, i) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          selectedAnswer: submittedAnswers[i] ?? -1,
          explanation: q.explanation,
        })),
      })
      localStorage.setItem('recallio_test_results', JSON.stringify(existingResults))
    } catch {
      console.error('[Tests] Failed to save results to localStorage')
    }
  }, [config, questions, retain])

  // Navigation handlers
  const handleGoToMentor = useCallback(() => {
    if (config) {
      router.push(`/mentor/${encodeURIComponent(config.subject)}${config.topic ? `?topic=${encodeURIComponent(config.topic)}` : ''}`)
    } else {
      router.push('/mentor')
    }
  }, [config, router])

  const handleRetake = useCallback(() => {
    if (config) {
      setAnswers({})
      setTimeSpent(0)
      setPhase('test')
    }
  }, [config])

  const handleNewTest = useCallback(() => {
    setConfig(null)
    setQuestions([])
    setAnswers({})
    setTimeSpent(0)
    setError(null)
    setPhase('config')
  }, [])

  return (
    <AppShell requireOnboarding>
      <div className="flex-1 flex flex-col min-h-0">
        {/* Config phase */}
        {phase === 'config' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full">
              {error && (
                <div className="max-w-lg mx-auto mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
                  {error}
                </div>
              )}
              <TestConfigPanel
                onStart={handleStartTest}
                isLoading={false}
              />
            </div>
          </div>
        )}

        {/* Loading phase */}
        {phase === 'loading' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center animate-step-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                <span className="animate-spin inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Generating Questions…
              </h2>
              <p className="text-muted-foreground text-sm">
                AI is crafting questions targeting your weak areas in {config?.subject}.
              </p>
            </div>
          </div>
        )}

        {/* Test phase */}
        {phase === 'test' && questions.length > 0 && config && (
          <TestInterface
            subject={config.subject}
            questions={questions}
            timeLimitMinutes={config.timeLimit}
            onSubmit={handleSubmit}
          />
        )}

        {/* Results phase */}
        {phase === 'results' && config && (
          <div className="flex-1 overflow-y-auto">
            <ResultsScreen
              subject={config.subject}
              topic={config.topic}
              questions={questions}
              answers={answers}
              timeSpent={timeSpent}
              onGoToMentor={handleGoToMentor}
              onRetake={handleRetake}
              onNewTest={handleNewTest}
            />
          </div>
        )}
      </div>
    </AppShell>
  )
}
