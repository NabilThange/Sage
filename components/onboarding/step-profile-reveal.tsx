'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight01Icon, AiStar01Icon, Alert01Icon } from 'hugeicons-react'
import { cn } from '@/lib/utils'
import type { ParsedSubject } from './step-syllabus-upload'

interface ProficiencyData {
  subject: string
  percentage: number
  weakAreas: string[]
}

interface StepProfileRevealProps {
  name: string
  subjects: ParsedSubject[]
  knownTopics: Record<string, string[]>
  onFinish: (proficiency: Record<string, number>) => void
}

export function StepProfileReveal({
  name,
  subjects,
  knownTopics,
  onFinish,
}: StepProfileRevealProps) {
  const [revealed, setRevealed] = useState(false)
  const [showWeakAreas, setShowWeakAreas] = useState(false)

  // Calculate baseline proficiency
  const proficiencyData: ProficiencyData[] = subjects.map(subject => {
    const totalTopics = subject.chapters.reduce(
      (sum, ch) => sum + (ch.subtopics.length > 0 ? ch.subtopics.length : 1),
      0
    )
    const known = knownTopics[subject.name]?.length ?? 0
    const percentage = totalTopics > 0 ? Math.round((known / totalTopics) * 100) : 0

    // Find weak chapters (where < 30% of subtopics are known)
    const weakAreas: string[] = []
    subject.chapters.forEach(ch => {
      const chapterTopics = ch.subtopics.length > 0 ? ch.subtopics : [ch.name]
      const knownInChapter = chapterTopics.filter(st => {
        const id = ch.subtopics.length > 0 ? `${ch.name}::${st}` : ch.name
        return (knownTopics[subject.name] ?? []).includes(id)
      }).length
      if (knownInChapter / chapterTopics.length < 0.3) {
        weakAreas.push(ch.name)
      }
    })

    return { subject: subject.name, percentage, weakAreas }
  })

  // Start reveal animations
  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 300)
    const t2 = setTimeout(() => setShowWeakAreas(true), 300 + subjects.length * 600 + 400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [subjects.length])

  const handleFinish = () => {
    const profMap: Record<string, number> = {}
    proficiencyData.forEach(p => {
      profMap[p.subject] = p.percentage
    })
    onFinish(profMap)
  }

  return (
    <div className="space-y-8 animate-step-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Your study profile is ready, {name}!
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Based on what you told us, here&apos;s your starting point
        </p>
      </div>

      {/* Proficiency bars */}
      <div className="space-y-4">
        {proficiencyData.map((data, index) => (
          <div
            key={data.subject}
            className="space-y-2"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(8px)',
              transition: `all 0.4s ease-out ${index * 150}ms`,
            }}
          >
            {/* Label + Percentage */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {data.subject}
              </span>
              <span className="text-sm font-mono text-muted-foreground">
                {data.percentage}%
              </span>
            </div>

            {/* Bar */}
            <div className="h-2.5 w-full bg-secondary/60 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  data.percentage >= 70
                    ? 'bg-[#17C964]'
                    : data.percentage >= 40
                      ? 'bg-primary'
                      : 'bg-[#F5A524]',
                )}
                style={{
                  width: revealed ? `${data.percentage}%` : '0%',
                  transition: `width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 150 + 200}ms`,
                }}
              />
            </div>

            {/* Weak areas */}
            {showWeakAreas && data.weakAreas.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1 animate-step-in">
                {data.weakAreas.slice(0, 3).map(area => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-[#F5A524]/10 text-[#F5A524] border border-[#F5A524]/20"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom message + CTA */}
      <div
        className="text-center space-y-5"
        style={{
          opacity: showWeakAreas ? 1 : 0,
          transform: showWeakAreas ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.4s ease-out 200ms',
        }}
      >
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Your AI now knows your complete study profile — and will remember 
          everything from here. Every quiz, every session, every improvement.
        </p>

        <Button
          onClick={handleFinish}
          size="lg"
          className="rounded-xl text-base font-medium gap-2 px-8 h-12"
        >
          Enter Dashboard
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
