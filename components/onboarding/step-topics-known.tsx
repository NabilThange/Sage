'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PillSelect } from '@/components/shared/pill-select'
import { ArrowRight01Icon, Next01Icon } from 'hugeicons-react'
import type { ParsedSubject } from './step-syllabus-upload'

interface StepTopicsKnownProps {
  subjects: ParsedSubject[]
  onComplete: (knownTopics: Record<string, string[]>) => void
}

export function StepTopicsKnown({ subjects, onComplete }: StepTopicsKnownProps) {
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0)
  const [allKnownTopics, setAllKnownTopics] = useState<Record<string, string[]>>({})
  const [selectedForCurrent, setSelectedForCurrent] = useState<string[]>([])

  const currentSubject = subjects[currentSubjectIndex]
  const isLastSubject = currentSubjectIndex === subjects.length - 1

  // Build pill items from chapters + subtopics
  const pillItems = currentSubject?.chapters.flatMap(ch =>
    ch.subtopics.length > 0
      ? ch.subtopics.map(st => ({ id: `${ch.name}::${st}`, label: st }))
      : [{ id: ch.name, label: ch.name }]
  ) ?? []

  const handleToggle = (id: string) => {
    setSelectedForCurrent(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const advanceSubject = () => {
    const updated = {
      ...allKnownTopics,
      [currentSubject.name]: selectedForCurrent,
    }
    setAllKnownTopics(updated)

    if (isLastSubject) {
      onComplete(updated)
    } else {
      setCurrentSubjectIndex(prev => prev + 1)
      setSelectedForCurrent([])
    }
  }

  const skipSubject = () => {
    const updated = {
      ...allKnownTopics,
      [currentSubject.name]: [],
    }
    setAllKnownTopics(updated)

    if (isLastSubject) {
      onComplete(updated)
    } else {
      setCurrentSubjectIndex(prev => prev + 1)
      setSelectedForCurrent([])
    }
  }

  if (!currentSubject) return null

  return (
    <div className="space-y-6 animate-step-in" key={currentSubject.name}>
      {/* Header with sub-progress */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-2">
          Subject {currentSubjectIndex + 1} of {subjects.length}
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {currentSubject.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          Tap every topic you already know — this sets your baseline
        </p>
      </div>

      {/* Per-chapter groupings */}
      <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-1">
        {currentSubject.chapters.map(chapter => {
          const chapterPills = chapter.subtopics.length > 0
            ? chapter.subtopics.map(st => ({ id: `${chapter.name}::${st}`, label: st }))
            : [{ id: chapter.name, label: chapter.name }]

          return (
            <div key={chapter.name} className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {chapter.name}
              </h3>
              <PillSelect
                items={chapterPills}
                selected={selectedForCurrent}
                onToggle={handleToggle}
              />
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="ghost"
          onClick={skipSubject}
          className="rounded-xl gap-2 text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="w-4 h-4" />
          Skip — I&apos;m starting fresh
        </Button>
        <div className="flex-1" />
        <Button
          onClick={advanceSubject}
          className="rounded-xl px-6 gap-2 font-medium"
        >
          {isLastSubject ? 'Finish' : 'Next Subject'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
