'use client'

import React from 'react'
import { TapCard } from '@/components/shared/tap-card'

const SEMESTER_OPTIONS = [
  { id: 'sem-1', label: 'Sem 1' },
  { id: 'sem-2', label: 'Sem 2' },
  { id: 'sem-3', label: 'Sem 3' },
  { id: 'sem-4', label: 'Sem 4' },
  { id: 'sem-5', label: 'Sem 5' },
  { id: 'sem-6', label: 'Sem 6' },
  { id: 'sem-7', label: 'Sem 7' },
  { id: 'sem-8', label: 'Sem 8' },
]

const YEAR_OPTIONS = [
  { id: 'year-1', label: 'Year 1' },
  { id: 'year-2', label: 'Year 2' },
  { id: 'year-3', label: 'Year 3' },
  { id: 'year-4', label: 'Year 4' },
]

interface StepSemesterProps {
  educationLevel: string
  curriculum: string
  value: string
  onSelect: (semester: string) => void
}

export function StepSemester({ educationLevel, value, onSelect }: StepSemesterProps) {
  // Engineering uses semesters, everything else uses years
  const isEngineering = educationLevel === 'undergraduate' && curriculum === 'engineering'
  const options = isEngineering ? SEMESTER_OPTIONS : YEAR_OPTIONS

  return (
    <div className="space-y-6 animate-step-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {isEngineering ? 'Which semester?' : 'Which year?'}
        </h2>
        <p className="text-sm text-muted-foreground">
          We&apos;ll find the right subjects for you
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
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
