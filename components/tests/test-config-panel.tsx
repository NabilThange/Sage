'use client'

import React, { useState, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Book02Icon, Clock01Icon, Zap01Icon, MortarboardIcon } from 'hugeicons-react'

interface TestConfig {
  subject: string
  topic: string
  questionCount: number
  timeLimit: number // in minutes
}

interface TestConfigPanelProps {
  onStart: (config: TestConfig) => void
  isLoading?: boolean
}

export function TestConfigPanel({ onStart, isLoading = false }: TestConfigPanelProps) {
  const { profile } = useAuth()
  const subjects = profile?.subjects ?? []

  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [questionCount, setQuestionCount] = useState(10)
  const [timeLimit, setTimeLimit] = useState(15)

  const selectedSubject = subjects.find((s) => s.name === subject)
  const chapters = selectedSubject?.chapters ?? []

  const handleStart = useCallback(() => {
    if (!subject) return
    onStart({ subject, topic, questionCount, timeLimit })
  }, [subject, topic, questionCount, timeLimit, onStart])

  return (
    <div className="animate-step-in max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-4">
          <GraduationCap className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Design Your Test
        </h1>
        <p className="text-muted-foreground text-sm">
          Configure your quiz below. Questions will target your weak areas automatically.
        </p>
      </div>

      <div className="space-y-6 bg-card rounded-xl p-6 border border-border">
        {/* Subject select */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <BookOpen className="w-4 h-4 text-primary" />
            Subject
          </Label>
          <Select value={subject} onValueChange={(v) => { setSubject(v); setTopic('') }}>
            <SelectTrigger id="subject-select">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.length > 0 ? (
                subjects.map((s) => (
                  <SelectItem key={s.name} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="_none" disabled>
                  Complete onboarding first
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Topic select (optional) */}
        {chapters.length > 0 && (
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              Topic (optional)
            </Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger id="topic-select">
                <SelectValue placeholder="All topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All topics</SelectItem>
                {chapters.map((ch) => (
                  <SelectItem key={ch.name} value={ch.name}>
                    {ch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Question count slider */}
        <div className="space-y-3">
          <Label className="flex items-center justify-between text-sm font-medium">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              Questions
            </span>
            <span className="text-primary font-mono">{questionCount}</span>
          </Label>
          <Slider
            id="question-count-slider"
            min={5}
            max={20}
            step={1}
            value={[questionCount]}
            onValueChange={([v]) => setQuestionCount(v)}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5</span>
            <span>20</span>
          </div>
        </div>

        {/* Time limit slider */}
        <div className="space-y-3">
          <Label className="flex items-center justify-between text-sm font-medium">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-info" />
              Time Limit
            </span>
            <span className="text-primary font-mono">{timeLimit} min</span>
          </Label>
          <Slider
            id="time-limit-slider"
            min={1}
            max={60}
            step={1}
            value={[timeLimit]}
            onValueChange={([v]) => setTimeLimit(v)}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 min</span>
            <span>60 min</span>
          </div>
        </div>

        {/* Start button */}
        <Button
          id="start-test-btn"
          onClick={handleStart}
          disabled={!subject || isLoading}
          className="w-full h-12 text-base font-semibold"
          size="lg"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              Generating Questions…
            </span>
          ) : (
            'Start Test →'
          )}
        </Button>
      </div>
    </div>
  )
}
