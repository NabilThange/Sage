'use client'

import React, { useState, useCallback } from 'react'
import { AppShell } from '@/components/app/app-shell'
import { useAuth } from '@/providers/auth-provider'
import { useMemory } from '@/providers/memory-provider'
import {
  Task01Icon,
  TickDouble02Icon,
  CancelCircleIcon,
  ArrowRight01Icon,
  Fire01Icon,
  Trophy01Icon,
  Loading03Icon,
  Target01Icon,
} from 'hugeicons-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  subject: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

const DEMO_QUESTIONS: Question[] = [
  {
    id: 'q1',
    subject: 'IOT',
    question: 'What does VSWR stand for in antenna theory?',
    options: [
      'Voltage Standing Wave Ratio',
      'Variable Signal Wave Range',
      'Voltage Signal Width Ratio',
      'Virtual Standing Wave Relay',
    ],
    correct: 0,
    explanation: 'VSWR (Voltage Standing Wave Ratio) measures impedance mismatch between a transmission line and its load. A perfect match gives VSWR = 1.',
  },
  {
    id: 'q2',
    subject: 'Data Structures',
    question: 'What is the time complexity of BFS traversal on a graph with V vertices and E edges?',
    options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V × E)'],
    correct: 2,
    explanation: 'BFS visits each vertex once (O(V)) and processes each edge once (O(E)), giving a total time complexity of O(V + E).',
  },
  {
    id: 'q3',
    subject: 'IOT',
    question: 'Which formula is used to calculate antenna gain in dBi?',
    options: [
      'G = 10 log(P_out / P_in)',
      'G = 4πAe / λ²',
      'G = P_r / P_t',
      'G = E_field × H_field',
    ],
    correct: 1,
    explanation: 'Antenna Gain (G) = 4πAe/λ², where Ae is the effective aperture area and λ is the wavelength. This is the fundamental isotropic gain formula.',
  },
  {
    id: 'q4',
    subject: 'OS',
    question: 'In Round Robin scheduling, what happens when a process\'s time quantum expires?',
    options: [
      'The process is terminated',
      'The process is moved to a waiting state',
      'The process is preempted and added to the back of the ready queue',
      'The time quantum is extended by 50%',
    ],
    correct: 2,
    explanation: 'In Round Robin, when a process exhausts its time quantum, it is preempted by the scheduler and placed at the end of the ready queue, allowing the next process to execute.',
  },
  {
    id: 'q5',
    subject: 'IOT',
    question: 'What is the ISM band commonly used for IoT devices?',
    options: ['433 MHz, 915 MHz, 2.4 GHz', '100 MHz, 200 MHz, 400 MHz', '1.8 GHz, 3.5 GHz, 5 GHz', '60 GHz only'],
    correct: 0,
    explanation: 'ISM (Industrial, Scientific, Medical) bands used for IoT include 433 MHz (EU), 915 MHz (US), and 2.4 GHz (global WiFi/Bluetooth/Zigbee).',
  },
]

type Phase = 'intro' | 'quiz' | 'result'

export default function TestsPage() {
  const { userId, userName } = useAuth()
  const { retain } = useMemory()

  const [phase, setPhase] = useState<Phase>('intro')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [answers, setAnswers] = useState<Array<number | null>>([])
  const [isShaking, setIsShaking] = useState(false)

  const currentQuestion = DEMO_QUESTIONS[currentIndex]
  const totalQuestions = DEMO_QUESTIONS.length
  const progress = (currentIndex / totalQuestions) * 100

  const correctCount = answers.filter((a, i) => a === DEMO_QUESTIONS[i]?.correct).length
  const scorePercent = Math.round((correctCount / totalQuestions) * 100)

  const handleSelect = (optionIndex: number) => {
    if (isConfirmed) return
    setSelectedOption(optionIndex)
  }

  const handleConfirm = useCallback(() => {
    if (selectedOption === null) return
    const isCorrect = selectedOption === currentQuestion.correct
    setIsConfirmed(true)
    if (!isCorrect) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 400)
    }
  }, [selectedOption, currentQuestion])

  const handleNext = useCallback(async () => {
    const newAnswers = [...answers, selectedOption]
    setAnswers(newAnswers)

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(i => i + 1)
      setSelectedOption(null)
      setIsConfirmed(false)
    } else {
      // Quiz complete
      const score = Math.round(
        (newAnswers.filter((a, i) => a === DEMO_QUESTIONS[i]?.correct).length / totalQuestions) * 100
      )
      if (userId) {
        await retain(
          'quiz_completed',
          `${userName ?? 'Student'} completed IOT/DS/OS quiz: scored ${score}%. Weak: ${
            newAnswers
              .map((a, i) => (a !== DEMO_QUESTIONS[i]?.correct ? DEMO_QUESTIONS[i]?.subject : null))
              .filter(Boolean)
              .slice(0, 3)
              .join(', ')
          }.`
        ).catch(() => {})
      }
      setPhase('result')
    }
  }, [answers, currentIndex, totalQuestions, selectedOption, userId, userName, retain])

  const handleRestart = () => {
    setPhase('intro')
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsConfirmed(false)
    setAnswers([])
  }

  const isCorrect = isConfirmed && selectedOption === currentQuestion?.correct
  const isWrong = isConfirmed && selectedOption !== currentQuestion?.correct

  return (
    <AppShell requireOnboarding>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-6 py-4 shrink-0 flex items-center gap-3">
          <h1 className="text-base font-semibold text-foreground">Tests</h1>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            AI-targeted
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* INTRO */}
          {phase === 'intro' && (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center animate-step-in">
              <div className="rounded-2xl bg-primary/10 p-5 mb-6">
                <Target01Icon className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Adaptive Quiz
              </h2>
              <p className="text-muted-foreground max-w-sm leading-relaxed mb-2">
                {totalQuestions} questions targeting your weakest areas — IOT (Antenna Theory), 
                Data Structures (Graphs), and OS (Scheduling).
              </p>
              <p className="text-xs text-muted-foreground/70 mb-8">
                Based on your Hindsight memory from the last 2 weeks.
              </p>
              <Button
                id="start-quiz-btn"
                size="lg"
                className="rounded-full px-10 gap-2"
                onClick={() => setPhase('quiz')}
              >
                Start Quiz
                <ArrowRight01Icon className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* QUIZ */}
          {phase === 'quiz' && (
            <div className="flex flex-col h-full">
              {/* Progress bar */}
              <div className="px-6 pt-4 pb-2 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground/60">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* Subject tag */}
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {currentQuestion.subject}
                </span>

                {/* Question text */}
                <p
                  className={cn(
                    'text-lg font-semibold text-foreground leading-relaxed',
                    isShaking && 'animate-shake'
                  )}
                >
                  {currentQuestion.question}
                </p>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx
                    const isOptionCorrect = idx === currentQuestion.correct
                    const showCorrect = isConfirmed && isOptionCorrect
                    const showWrong = isConfirmed && isSelected && !isOptionCorrect

                    return (
                      <button
                        key={idx}
                        id={`option-${idx}`}
                        onClick={() => handleSelect(idx)}
                        disabled={isConfirmed}
                        className={cn(
                          'w-full text-left flex items-center gap-3 rounded-xl border p-4 transition-all duration-200',
                          'disabled:cursor-default',
                          !isConfirmed && !isSelected && 'border-border bg-card hover:border-primary/40 hover:bg-primary/5',
                          !isConfirmed && isSelected && 'border-primary bg-primary/10',
                          showCorrect && 'border-green-400/40 bg-green-400/10',
                          showWrong && 'border-destructive/40 bg-destructive/10',
                        )}
                      >
                        {/* Option letter */}
                        <span className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors',
                          !isConfirmed && !isSelected && 'bg-secondary text-muted-foreground',
                          !isConfirmed && isSelected && 'bg-primary text-primary-foreground',
                          showCorrect && 'bg-green-400 text-white',
                          showWrong && 'bg-destructive text-white',
                        )}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className={cn(
                          'text-sm leading-relaxed',
                          showCorrect && 'text-green-400 font-medium',
                          showWrong && 'text-destructive',
                          !showCorrect && !showWrong && 'text-foreground',
                        )}>
                          {option}
                        </span>
                        {showCorrect && <TickDouble02Icon className="h-4 w-4 text-green-400 ml-auto shrink-0" />}
                        {showWrong && <CancelCircleIcon className="h-4 w-4 text-destructive ml-auto shrink-0" />}
                      </button>
                    )
                  })}
                </div>

                {/* Explanation */}
                {isConfirmed && (
                  <div className={cn(
                    'rounded-xl border p-4 animate-step-in',
                    isCorrect ? 'border-green-400/20 bg-green-400/5' : 'border-destructive/20 bg-destructive/5'
                  )}>
                    <p className="text-xs font-semibold mb-1.5">
                      {isCorrect ? '✓ Correct!' : '✗ Not quite.'}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom action bar */}
              <div className="border-t border-border px-6 py-4 shrink-0">
                {!isConfirmed ? (
                  <Button
                    id="confirm-answer-btn"
                    className="w-full rounded-xl h-12"
                    onClick={handleConfirm}
                    disabled={selectedOption === null}
                  >
                    Confirm Answer
                  </Button>
                ) : (
                  <Button
                    id="next-question-btn"
                    className="w-full rounded-xl h-12 gap-2"
                    onClick={handleNext}
                  >
                    {currentIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}
                    <ArrowRight01Icon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* RESULT */}
          {phase === 'result' && (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center animate-step-in">
              <div className={cn(
                'rounded-2xl p-5 mb-6',
                scorePercent >= 70 ? 'bg-green-400/10' : scorePercent >= 50 ? 'bg-amber-400/10' : 'bg-destructive/10'
              )}>
                <Trophy01Icon className={cn(
                  'h-10 w-10',
                  scorePercent >= 70 ? 'text-green-400' : scorePercent >= 50 ? 'text-amber-400' : 'text-destructive'
                )} />
              </div>

              <h2 className="text-3xl font-bold text-foreground mb-1">
                {scorePercent}%
              </h2>
              <p className="text-muted-foreground mb-1">
                {correctCount} / {totalQuestions} correct
              </p>
              <p className="text-sm text-muted-foreground/70 mb-8">
                {scorePercent >= 70 ? 'Great work! Memory updated.' : 
                 scorePercent >= 50 ? 'Keep practising. Focus on your weak topics.' :
                 'Needs more work — Recallio will schedule revision sessions.'}
              </p>

              {/* Answer review */}
              <div className="w-full max-w-md space-y-2 mb-8 text-left">
                {DEMO_QUESTIONS.map((q, i) => {
                  const userAnswer = answers[i]
                  const correct = userAnswer === q.correct
                  return (
                    <div key={q.id} className={cn(
                      'flex items-center gap-3 rounded-xl border p-3',
                      correct ? 'border-green-400/20 bg-green-400/5' : 'border-destructive/20 bg-destructive/5'
                    )}>
                      {correct ? (
                        <TickDouble02Icon className="h-4 w-4 text-green-400 shrink-0" />
                      ) : (
                        <CancelCircleIcon className="h-4 w-4 text-destructive shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{q.subject}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{q.question.slice(0, 60)}…</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="rounded-full gap-2" onClick={handleRestart}>
                  <Loading03Icon className="h-4 w-4" />
                  Retry
                </Button>
                <Button className="rounded-full">
                  Back to Planner
                  <ArrowRight01Icon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
