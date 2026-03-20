'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Loading03Icon, AiStar01Icon, Loading03Icon as RotateIcon, FileAttachmentIcon } from 'hugeicons-react'
import { Button } from '@/components/ui/button'

interface SummaryWidgetProps {
  subjectName: string
  moduleName: string
}

export function SummaryWidget({ subjectName, moduleName }: SummaryWidgetProps) {
  const [summary, setSummary] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  const generateSummary = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/mentor/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subjectName, topic: moduleName }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.summary) {
          setSummary(data.summary)
          setHasGenerated(true)
          return
        }
      }
      throw new Error('No summary')
    } catch {
      // Fallback summary
      setSummary(
        `**${moduleName}** is a core topic in ${subjectName}.\n\n` +
        `This chapter covers the fundamental concepts, key principles, and practical applications that form the foundation of your understanding.\n\n` +
        `**Key Points:**\n` +
        `• Core concepts and definitions\n` +
        `• Theoretical framework and principles\n` +
        `• Practical applications and examples\n` +
        `• Common problem-solving approaches\n\n` +
        `Understanding this topic is essential for building upon more advanced concepts in ${subjectName}. Focus on the relationships between the key ideas and practice applying them to different scenarios.`
      )
      setHasGenerated(true)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!hasGenerated) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Summary</span>
        </div>
        <Button
          variant="outline"
          className="w-full gap-2 text-xs h-9"
          onClick={generateSummary}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="h-3.5 w-3.5 text-primary" />
              Generate Summary
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Summary</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-md"
          onClick={() => {
            setHasGenerated(false)
            setSummary('')
          }}
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/30 p-4 max-h-[300px] overflow-y-auto">
        <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
          {summary}
        </div>
      </div>
    </div>
  )
}
