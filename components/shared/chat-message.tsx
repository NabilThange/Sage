'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { AiNetworkIcon, UserIcon } from 'hugeicons-react'

interface ChatMessageProps {
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
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          isAI ? 'bg-primary/15' : 'bg-secondary'
        )}
      >
        {isAI ? (
          <Brain className="h-4 w-4 text-primary" />
        ) : (
          <User className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed',
          isAI
            ? 'bg-card border border-border/60 text-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {/* Message content with markdown-like line breaks */}
        <div className="whitespace-pre-wrap">{content}</div>

        {/* Streaming indicator */}
        {isStreaming && (
          <span className="inline-flex gap-1 mt-1 ml-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
          </span>
        )}

        {/* Timestamp */}
        {timestamp && (
          <p
            className={cn(
              'text-[10px] mt-1.5 opacity-60',
              isAI ? 'text-muted-foreground' : 'text-primary-foreground/70'
            )}
          >
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  )
}
