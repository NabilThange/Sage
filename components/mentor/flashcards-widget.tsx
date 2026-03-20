'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Loader2, ChevronDown, ChevronUp, Sparkles, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Flashcard {
  term: string
  definition: string
}

interface FlashcardsWidgetProps {
  subjectName: string
  moduleName: string
}

export function FlashcardsWidget({ subjectName, moduleName }: FlashcardsWidgetProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  const generateFlashcards = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/mentor/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subjectName, topic: moduleName }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.flashcards?.length > 0) {
          setFlashcards(data.flashcards)
          setCurrentIndex(0)
          setIsFlipped(false)
          setHasGenerated(true)
          return
        }
      }
      throw new Error('No flashcards')
    } catch {
      // Fallback flashcards
      setFlashcards([
        { term: `Key concept in ${moduleName}`, definition: `The fundamental principle of ${moduleName} in ${subjectName} that every student should understand.` },
        { term: `Application of ${moduleName}`, definition: `Real-world usage of this concept in problem solving and practical scenarios.` },
        { term: `Common mistake`, definition: `Students often confuse this with related concepts. Pay attention to the subtle differences.` },
        { term: `Important formula`, definition: `The mathematical relationship between the key variables in this topic.` },
      ])
      setCurrentIndex(0)
      setIsFlipped(false)
      setHasGenerated(true)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!hasGenerated) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Flashcards</span>
        </div>
        <Button
          variant="outline"
          className="w-full gap-2 text-xs h-9"
          onClick={generateFlashcards}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Generate Flashcards
            </>
          )}
        </Button>
      </div>
    )
  }

  const card = flashcards[currentIndex]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Flashcards</span>
        <span className="text-[10px] text-muted-foreground font-mono">
          {currentIndex + 1}/{flashcards.length}
        </span>
      </div>

      {/* Card */}
      <button
        onClick={() => setIsFlipped(!isFlipped)}
        className={cn(
          'w-full min-h-[100px] rounded-xl border border-border/60 p-4',
          'bg-card hover:bg-card/80 transition-all duration-200 cursor-pointer text-left',
          isFlipped && 'border-primary/30 bg-primary/5',
        )}
      >
        <p className={cn(
          'text-xs font-medium',
          isFlipped ? 'text-muted-foreground' : 'text-primary',
        )}>
          {isFlipped ? 'Definition' : 'Term'}
        </p>
        <p className="text-sm text-foreground mt-2 leading-relaxed">
          {isFlipped ? card?.definition : card?.term}
        </p>
        <p className="text-[10px] text-muted-foreground mt-3 text-center">
          tap to {isFlipped ? 'see term' : 'flip'}
        </p>
      </button>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg"
          onClick={() => {
            setCurrentIndex(Math.max(0, currentIndex - 1))
            setIsFlipped(false)
          }}
          disabled={currentIndex === 0}
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg"
          onClick={() => {
            setCurrentIndex(Math.min(flashcards.length - 1, currentIndex + 1))
            setIsFlipped(false)
          }}
          disabled={currentIndex === flashcards.length - 1}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg"
          onClick={() => {
            setHasGenerated(false)
            setFlashcards([])
          }}
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
