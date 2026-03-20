'use client'

import React from 'react'
import { TapCard } from '@/components/shared/tap-card'

// Dynamic options based on education level
const CURRICULUM_OPTIONS: Record<string, Array<{ id: string; label: string }>> = {
  'undergraduate': [
    { id: 'engineering', label: 'Engineering' },
    { id: 'medical', label: 'Medical' },
    { id: 'commerce', label: 'Commerce' },
    { id: 'arts', label: 'Arts' },
    { id: 'other-ug', label: 'Other' },
  ],
  'class-10-12': [
    { id: 'cbse', label: 'CBSE' },
    { id: 'icse', label: 'ICSE' },
    { id: 'ib', label: 'IB' },
    { id: 'state-board', label: 'State Board' },
    { id: 'other-school', label: 'Other' },
  ],
  'postgraduate': [
    { id: 'mtech', label: 'M.Tech / MS' },
    { id: 'mba', label: 'MBA' },
    { id: 'msc', label: 'M.Sc' },
    { id: 'ma', label: 'M.A' },
    { id: 'other-pg', label: 'Other' },
  ],
  'competitive': [
    { id: 'jee', label: 'JEE' },
    { id: 'neet', label: 'NEET' },
    { id: 'upsc', label: 'UPSC' },
    { id: 'cat', label: 'CAT' },
    { id: 'other-comp', label: 'Other' },
  ],
}

interface StepCurriculumProps {
  educationLevel: string
  value: string
  onSelect: (curriculum: string) => void
}

export function StepCurriculum({ educationLevel, value, onSelect }: StepCurriculumProps) {
  const options = CURRICULUM_OPTIONS[educationLevel] ?? CURRICULUM_OPTIONS['undergraduate']

  const title =
    educationLevel === 'class-10-12'
      ? 'Which board are you in?'
      : educationLevel === 'competitive'
        ? 'Which exam are you preparing for?'
        : 'What stream are you in?'

  return (
    <div className="space-y-6 animate-step-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">
          This helps us pick the right syllabus
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <TapCard
            key={opt.id}
            label={opt.label}
            isSelected={value === opt.id}
            onClick={() => onSelect(opt.id)}
            variant="glow"
          />
        ))}
      </div>
    </div>
  )
}
