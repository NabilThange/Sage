'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface OnboardingShellProps {
  currentStep: number
  totalSteps: number
  children: React.ReactNode
}

export function OnboardingShell({
  currentStep,
  totalSteps,
  children,
}: OnboardingShellProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-[#F5A524]/[0.03] pointer-events-none" />

      {/* Progress bar */}
      <div className="relative z-10 w-full px-6 pt-6">
        <div className="max-w-xl mx-auto">
          {/* Step counter */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-xs font-mono text-muted-foreground/60">
              {Math.round(progress)}%
            </span>
          </div>
          {/* Bar */}
          <div className="h-1.5 w-full bg-secondary/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step content — centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-xl">
          {children}
        </div>
      </div>
    </div>
  )
}
