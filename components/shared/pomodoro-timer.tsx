'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type TimerMode = '25min' | 'shortBreak' | 'longBreak'

const MODE_CONFIG: Record<TimerMode, { label: string; duration: number; color: string }> = {
  '25min': { label: 'Focus', duration: 25 * 60, color: 'text-primary' },
  'shortBreak': { label: 'Short Break', duration: 5 * 60, color: 'text-[#17C964]' },
  'longBreak': { label: 'Long Break', duration: 15 * 60, color: 'text-[#F5A524]' },
}

interface PomodoroTimerProps {
  onComplete?: (checkinResponse: string) => void
}

export function PomodoroTimer({ onComplete }: PomodoroTimerProps) {
  const [mode, setMode] = useState<TimerMode>('25min')
  const [secondsLeft, setSecondsLeft] = useState(MODE_CONFIG['25min'].duration)
  const [isRunning, setIsRunning] = useState(false)
  const [showCheckin, setShowCheckin] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const config = MODE_CONFIG[mode]

  // Timer tick
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            // Show check-in for focus sessions
            if (mode === '25min') {
              setShowCheckin(true)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, secondsLeft, mode])

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode)
    setSecondsLeft(MODE_CONFIG[newMode].duration)
    setIsRunning(false)
  }, [])

  const toggleTimer = () => setIsRunning((prev) => !prev)

  const resetTimer = () => {
    setIsRunning(false)
    setSecondsLeft(config.duration)
  }

  const handleCheckin = (response: string) => {
    setShowCheckin(false)
    onComplete?.(response)
    // Auto-switch to short break after focus
    switchMode('shortBreak')
  }

  // Format time
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  const progress = 1 - secondsLeft / config.duration

  return (
    <>
      <div className="rounded-xl border border-border/60 bg-card/30 p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Coffee className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Pomodoro</span>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 rounded-lg bg-secondary/30 p-1">
          {(Object.keys(MODE_CONFIG) as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={cn(
                'flex-1 rounded-md px-2 py-1.5 text-[10px] font-medium transition-all',
                mode === m
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {MODE_CONFIG[m].label}
            </button>
          ))}
        </div>

        {/* Timer display */}
        <div className="relative flex items-center justify-center">
          {/* Circular progress */}
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              className="text-secondary/40"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              className={cn(config.color, 'transition-all duration-1000')}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress)}`}
            />
          </svg>
          <span className={cn('absolute font-mono text-2xl font-medium', config.color)}>
            {timeString}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={resetTimer}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            className={cn(
              'h-10 w-10 rounded-xl',
              isRunning ? 'bg-destructive hover:bg-destructive/90' : '',
            )}
            onClick={toggleTimer}
          >
            {isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </Button>
          <div className="w-8" /> {/* Spacer for symmetry */}
        </div>
      </div>

      {/* Post-session check-in dialog */}
      <Dialog open={showCheckin} onOpenChange={setShowCheckin}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Session done! 🎉</DialogTitle>
            <DialogDescription className="text-center">
              How was your study session?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            {[
              { emoji: '😊', label: 'Great', value: 'great' },
              { emoji: '😐', label: 'Mixed', value: 'mixed' },
              { emoji: '😔', label: 'Struggled', value: 'struggled' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => handleCheckin(option.value)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60',
                  'bg-card hover:bg-primary/5 hover:border-primary/30',
                  'transition-all duration-150 cursor-pointer text-left',
                )}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-sm font-medium text-foreground">{option.label}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
