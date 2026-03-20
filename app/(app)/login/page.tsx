'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AiNetworkIcon, ArrowRight01Icon, AiStar01Icon } from 'hugeicons-react'
import { cn } from '@/lib/utils'

const DEMO_USERS = [
  {
    name: 'Aryan',
    description: 'BTech CSE Sem 3 · 12-day streak · Rich memory',
    gradient: 'from-primary/20 to-primary/5',
    borderColor: 'border-primary/30',
  },
  {
    name: 'Priya',
    description: 'Class 12 CBSE · 2-day streak · Early-stage',
    gradient: 'from-amber-400/20 to-amber-400/5',
    borderColor: 'border-amber-400/30',
  },
]

export default function LoginPage() {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (userName: string, isDemo = false) => {
    if (!userName.trim()) return
    setIsLoading(true)

    try {
      login(userName.trim(), isDemo)

      // For demo users, they already have onboarding complete
      // For new users, redirect to onboarding
      if (isDemo) {
        router.push('/planner')
      } else {
        router.push('/onboarding')
      }
    } catch {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin(name)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#7C6AF5]/5 via-transparent to-[#F5A524]/5 pointer-events-none" />

      <div className="relative w-full max-w-md space-y-8 animate-step-in">
        {/* Logo + Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
            <Brain className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Welcome to Recallio
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            The AI tutor that never forgets. Enter your name to get started.
          </p>
        </div>

        {/* Name Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Input
              id="login-name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 text-base bg-card border-border/60 px-4 rounded-xl focus-visible:ring-primary/40"
              autoFocus
              disabled={isLoading}
              autoComplete="name"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-base font-medium gap-2"
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>
                Get Started
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border/60" />
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            or try a demo
          </span>
          <div className="flex-1 h-px bg-border/60" />
        </div>

        {/* Demo User Pills */}
        <div className="grid grid-cols-2 gap-3">
          {DEMO_USERS.map((user) => (
            <button
              key={user.name}
              onClick={() => handleLogin(user.name, true)}
              disabled={isLoading}
              className={cn(
                'group relative flex flex-col items-start gap-1.5 p-4 rounded-xl border transition-all duration-200',
                'bg-gradient-to-b hover:scale-[1.02] active:scale-[0.98]',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                user.gradient,
                user.borderColor
              )}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary opacity-70" />
                <span className="font-medium text-sm text-foreground">
                  {user.name}
                </span>
              </div>
              <span className="text-xs text-muted-foreground leading-tight text-left">
                {user.description}
              </span>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground/70 pt-2">
          No real account needed. Data stays in your browser.
        </p>
      </div>
    </div>
  )
}
