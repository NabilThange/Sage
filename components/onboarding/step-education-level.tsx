'use client'

import React from 'react'
import { TapCard } from '@/components/shared/tap-card'
import { GraduationCap, School, BookOpen, Trophy } from 'lucide-react'

const EDUCATION_LEVELS = [
  { id: 'class-10-12', label: 'Class 10–12', icon: <School className="w-6 h-6" /> },
  { id: 'undergraduate', label: 'Undergraduate', icon: <GraduationCap className="w-6 h-6" /> },
  { id: 'postgraduate', label: 'Postgraduate', icon: <BookOpen className="w-6 h-6" /> },
  { id: 'competitive', label: 'Competitive Exam', icon: <Trophy className="w-6 h-6" /> },
]

interface StepEducationLevelProps {
  value: string
  onSelect: (level: string) => void
}

export function StepEducationLevel({ value, onSelect }: StepEducationLevelProps) {
  return (
    <div className="space-y-6 animate-step-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          What are you studying?
        </h2>
        <p className="text-sm text-muted-foreground">
          Tap to select your education level
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {EDUCATION_LEVELS.map((level) => (
          <TapCard
            key={level.id}
            label={level.label}
            icon={level.icon}
            isSelected={value === level.id}
            onClick={() => onSelect(level.id)}
            variant="glow"
          />
        ))}
      </div>
    </div>
  )
}
