'use client'

import React, { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ArrowUp01Icon, Loading03Icon } from 'hugeicons-react'
import { Button } from '@/components/ui/button'

interface QuickAction {
  label: string
  value: string
}

interface ChatInputProps {
  onSend: (message: string) => void
  placeholder?: string
  quickActions?: QuickAction[]
  isLoading?: boolean
}

export function ChatInput({
  onSend,
  placeholder = 'Type your message...',
  quickActions,
  isLoading = false,
}: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue('')
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, isLoading, onSend])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    // Auto-resize
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }

  return (
    <div className="space-y-2">
      {/* Quick action chips */}
      {quickActions && quickActions.length > 0 && !value && (
        <div className="flex flex-wrap gap-1.5">
          {quickActions.map((action) => (
            <button
              key={action.value}
              onClick={() => {
                setValue(action.value)
                textareaRef.current?.focus()
              }}
              className={cn(
                'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium',
                'bg-card border border-border/60 text-muted-foreground',
                'hover:bg-primary/5 hover:border-primary/30 hover:text-foreground',
                'transition-all duration-150 cursor-pointer',
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="relative flex items-end gap-2 rounded-xl border border-border/60 bg-card/50 px-4 py-3 focus-within:border-primary/40 transition-colors">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
          className={cn(
            'flex-1 resize-none bg-transparent text-sm text-foreground',
            'placeholder:text-muted-foreground/60 outline-none',
            'max-h-40 min-h-[20px]',
            'disabled:opacity-50',
          )}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="h-8 w-8 shrink-0 rounded-lg"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
