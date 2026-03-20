'use client'

import React, { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { SentIcon } from 'hugeicons-react'
import { Button } from '@/components/ui/button'

export interface QuickAction {
  label: string
  value: string
}

interface ChatInputProps {
  onSend: (message: string) => void
  placeholder?: string
  quickActions?: QuickAction[]
  isLoading?: boolean
  className?: string
}

export function ChatInput({
  onSend,
  placeholder = 'Type a message…',
  quickActions,
  isLoading = false,
  className,
}: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, isLoading, onSend])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    // Auto-resize
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const handleQuickAction = (val: string) => {
    setValue(val)
    textareaRef.current?.focus()
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Quick-action chips */}
      {quickActions && quickActions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickActions.map((qa) => (
            <button
              key={qa.label}
              onClick={() => handleQuickAction(qa.value)}
              disabled={isLoading}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-40"
            >
              {qa.label}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2 rounded-xl border border-border bg-card px-3 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
        <textarea
          ref={textareaRef}
          id="chat-input"
          value={value}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 leading-relaxed py-0.5"
          style={{ minHeight: '24px', maxHeight: '160px' }}
        />
        <Button
          id="chat-send-btn"
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          size="icon"
          className="h-8 w-8 shrink-0 rounded-lg"
        >
          {isLoading ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <SentIcon className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </div>
      <p className="text-[11px] text-muted-foreground/50 text-right">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
