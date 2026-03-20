'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { AiNetworkIcon } from 'hugeicons-react'

export interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
  isStreaming?: boolean
}

export function ChatMessage({ role, content, timestamp, isStreaming }: ChatMessageProps) {
  const isAI = role === 'assistant'

  return (
    <div
      className={cn(
        'flex gap-3 animate-step-in',
        isAI ? 'items-start' : 'items-start flex-row-reverse'
      )}
    >
      {/* Avatar */}
      {isAI ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
          <AiNetworkIcon className="h-4 w-4 text-primary" />
        </div>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary ring-1 ring-border">
          <span className="text-[11px] font-semibold text-secondary-foreground">U</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isAI
            ? 'bg-card border border-border text-foreground rounded-tl-sm'
            : 'bg-primary text-primary-foreground rounded-tr-sm'
        )}
      >
        {/* Streaming dot animation */}
        {isStreaming && content === '' ? (
          <span className="flex gap-1 items-center py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:300ms]" />
          </span>
        ) : (
          <p className="whitespace-pre-wrap">{content}</p>
        )}

        {timestamp && !isStreaming && (
          <p
            className={cn(
              'mt-1.5 text-[11px] opacity-50',
              isAI ? 'text-muted-foreground' : 'text-primary-foreground'
            )}
          >
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  )
}
