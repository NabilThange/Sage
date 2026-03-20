'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, X, Plus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ParsedSubject } from './step-syllabus-upload'

interface StepSubjectConfirmProps {
  subjects: ParsedSubject[]
  onConfirm: (confirmedSubjects: ParsedSubject[]) => void
}

export function StepSubjectConfirm({ subjects, onConfirm }: StepSubjectConfirmProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(subjects.map(s => s.name))
  )
  const [showAddInput, setShowAddInput] = useState(false)
  const [newSubjectName, setNewSubjectName] = useState('')

  const toggleSubject = (name: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(name)) {
        next.delete(name)
      } else {
        next.add(name)
      }
      return next
    })
  }

  const addCustomSubject = () => {
    if (!newSubjectName.trim()) return
    // subjects array is treated as immutable for display;
    // we just add the name to selected set
    selected.add(newSubjectName.trim())
    setSelected(new Set(selected))
    setNewSubjectName('')
    setShowAddInput(false)
  }

  const handleConfirm = () => {
    const confirmed = subjects.filter(s => selected.has(s.name))
    // Also add any custom subjects that aren't in supplied list
    const existingNames = new Set(subjects.map(s => s.name))
    selected.forEach(name => {
      if (!existingNames.has(name)) {
        confirmed.push({ name, chapters: [] })
      }
    })
    onConfirm(confirmed)
  }

  return (
    <div className="space-y-6 animate-step-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          I found these subjects in your syllabus
        </h2>
        <p className="text-sm text-muted-foreground">
          Tap to deselect any you don&apos;t want, or add one
        </p>
      </div>

      {/* Subject cards — staggered entrance */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {subjects.map((subject, index) => {
          const isActive = selected.has(subject.name)
          return (
            <button
              key={subject.name}
              onClick={() => toggleSubject(subject.name)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-2 p-5 rounded-xl border',
                'transition-all duration-200 animate-card-stagger cursor-pointer select-none',
                'hover:scale-[1.02] active:scale-[0.97]',
                isActive
                  ? 'border-primary bg-primary/5 glow-primary'
                  : 'border-border/40 bg-card/40 opacity-50',
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Toggle badge */}
              <div className={cn(
                'absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center transition-all',
                isActive ? 'bg-primary' : 'bg-secondary/60',
              )}>
                {isActive ? (
                  <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                ) : (
                  <X className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                )}
              </div>

              <span className={cn(
                'font-medium text-sm text-center',
                isActive ? 'text-foreground' : 'text-muted-foreground',
              )}>
                {subject.name}
              </span>

              {subject.chapters.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {subject.chapters.length} chapters
                </span>
              )}
            </button>
          )
        })}

        {/* Add subject button */}
        {!showAddInput ? (
          <button
            onClick={() => setShowAddInput(true)}
            className={cn(
              'flex flex-col items-center justify-center gap-2 p-5 rounded-xl',
              'border border-dashed border-border/60 text-muted-foreground',
              'hover:border-primary/30 hover:text-foreground transition-all cursor-pointer',
            )}
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Add Subject</span>
          </button>
        ) : (
          <div className="flex flex-col gap-2 p-3 rounded-xl border border-primary/30 bg-card/60">
            <Input
              value={newSubjectName}
              onChange={e => setNewSubjectName(e.target.value)}
              placeholder="Subject name"
              className="h-8 text-sm bg-transparent border-border/40"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && addCustomSubject()}
            />
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="ghost"
                className="flex-1 h-7 text-xs"
                onClick={() => setShowAddInput(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1 h-7 text-xs"
                onClick={addCustomSubject}
                disabled={!newSubjectName.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm button */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={handleConfirm}
          disabled={selected.size === 0}
          className="rounded-xl px-8 h-11 gap-2 font-medium"
        >
          These look right
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
