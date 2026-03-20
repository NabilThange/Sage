'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Brain, ArrowRight, Sparkles } from 'lucide-react'

interface StepNameConfirmProps {
  name: string
  onNext: () => void
}

export function StepNameConfirm({ name, onNext }: StepNameConfirmProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-8 animate-step-in">
      {/* Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Brain className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#F5A524]/20 flex items-center justify-center animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5 text-[#F5A524]" />
        </div>
      </div>

      {/* Greeting */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Hey {name}! 👋
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
          Let&apos;s build your study profile so your AI tutor can learn everything about how you study best.
        </p>
      </div>

      {/* Subtext */}
      <p className="text-xs text-muted-foreground/70 max-w-xs mx-auto">
        This takes about 2 minutes. Every answer helps your AI get smarter — from day one.
      </p>

      {/* CTA */}
      <Button
        onClick={onNext}
        size="lg"
        className="rounded-xl text-base font-medium gap-2 px-8 h-12"
      >
        Let&apos;s Go
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
