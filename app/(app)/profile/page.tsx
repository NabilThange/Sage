'use client'

import React, { useState } from 'react'
import { AppShell } from '@/components/app/app-shell'
import { useAuth } from '@/providers/auth-provider'
import {
  UserIcon,
  Fire01Icon,
  Trophy01Icon,
  Task01Icon,
  TrendingUp01Icon,
  TrendingDown01Icon,
  Remove01Icon,
  Calendar03Icon,
  Target01Icon,
  FavouriteIcon,
} from 'hugeicons-react'
import { cn } from '@/lib/utils'

interface TestResult {
  id: string
  subject: string
  score: number
  total: number
  date: string
  topics: string[]
}

const DEMO_RESULTS: TestResult[] = [
  { id: '1', subject: 'IOT', score: 58, total: 100, date: '2 days ago', topics: ['VSWR', 'Antenna Gain'] },
  { id: '2', subject: 'Data Structures', score: 78, total: 100, date: '4 days ago', topics: ['Graph BFS', 'Binary Heap'] },
  { id: '3', subject: 'OS', score: 72, total: 100, date: '6 days ago', topics: ['Round Robin', 'Virtual Memory'] },
  { id: '4', subject: 'IOT', score: 64, total: 100, date: '1 week ago', topics: ['Modulation Types', 'RF Propagation'] },
  { id: '5', subject: 'DBMS', score: 81, total: 100, date: '10 days ago', topics: ['Normalisation', 'SQL Joins'] },
]

interface ProficiencyBar {
  subject: string
  score: number
  phase: 1 | 2 | 3
  trend: 'up' | 'down' | 'stable'
  color: string
  bg: string
}

const PROFICIENCY: ProficiencyBar[] = [
  { subject: 'IOT', score: 52, phase: 2, trend: 'up', color: 'bg-primary', bg: 'bg-primary/10' },
  { subject: 'Data Structures', score: 71, phase: 3, trend: 'up', color: 'bg-amber-400', bg: 'bg-amber-400/10' },
  { subject: 'Operating Systems', score: 68, phase: 2, trend: 'stable', color: 'bg-violet-400', bg: 'bg-violet-400/10' },
  { subject: 'Computer Networks', score: 44, phase: 1, trend: 'down', color: 'bg-green-400', bg: 'bg-green-400/10' },
  { subject: 'DBMS', score: 60, phase: 2, trend: 'stable', color: 'bg-rose-400', bg: 'bg-rose-400/10' },
  { subject: 'Discrete Math', score: 35, phase: 1, trend: 'down', color: 'bg-cyan-400', bg: 'bg-cyan-400/10' },
]

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  if (trend === 'up') return <TrendingUp01Icon className="h-3.5 w-3.5 text-green-400" />
  if (trend === 'down') return <TrendingDown01Icon className="h-3.5 w-3.5 text-destructive" />
  return <Remove01Icon className="h-3.5 w-3.5 text-muted-foreground" />
}

const phaseLabel: Record<number, string> = {
  1: 'Early estimate',
  2: 'Early estimate',
  3: 'Accurate',
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'text-green-400 bg-green-400/10 border-green-400/20' :
    score >= 60 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
    'text-destructive bg-destructive/10 border-destructive/20'
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold', color)}>
      {score}%
    </span>
  )
}

export default function ProfilePage() {
  const { userName, profile } = useAuth()
  const streakCount = profile?.streakCount ?? 12
  const avgScore = Math.round(DEMO_RESULTS.reduce((s, r) => s + r.score, 0) / DEMO_RESULTS.length)
  const testsCompleted = DEMO_RESULTS.length

  return (
    <AppShell requireOnboarding>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-6 py-4 shrink-0">
          <h1 className="text-base font-semibold text-foreground">Profile</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* User card */}
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              {userName?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-foreground">{userName ?? 'Student'}</h2>
              <p className="text-sm text-muted-foreground">BTech CSE · Semester 3</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Fire01Icon, label: 'Streak', value: `${streakCount}d`, color: 'text-amber-400', bg: 'bg-amber-400/10' },
              { icon: Task01Icon, label: 'Tests', value: String(testsCompleted), color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Trophy01Icon, label: 'Avg Score', value: `${avgScore}%`, color: 'text-green-400', bg: 'bg-green-400/10' },
            ].map(stat => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4">
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', stat.bg)}>
                    <Icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                  <span className="text-xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              )
            })}
          </div>

          {/* Proficiency bars */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-5">
              <Target01Icon className="h-4.5 w-4.5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Subject Proficiency</h3>
              <span className="ml-auto text-[11px] text-muted-foreground">Hindsight-computed</span>
            </div>
            <div className="space-y-4">
              {PROFICIENCY.map((bar) => (
                <div key={bar.subject}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{bar.subject}</span>
                      {bar.phase < 3 && (
                        <span className="text-[10px] text-muted-foreground">· {phaseLabel[bar.phase]}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendIcon trend={bar.trend} />
                      <span className="text-sm font-semibold text-foreground">{bar.score}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full animate-bar-fill', bar.color)}
                      style={{ width: `${bar.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test history */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-5">
              <Calendar03Icon className="h-4.5 w-4.5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Test History</h3>
            </div>
            <div className="space-y-3">
              {DEMO_RESULTS.map((result) => (
                <div key={result.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{result.subject}</span>
                      <span className="text-[11px] text-muted-foreground">{result.date}</span>
                    </div>
                    {result.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.topics.map(t => (
                          <span key={t} className="text-[10px] text-muted-foreground bg-secondary/60 rounded-full px-1.5 py-0.5">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ScoreBadge score={result.score} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
