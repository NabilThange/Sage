'use client'

import React, { createContext, useContext, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'

interface MemoryContextType {
  /**
   * Stores a natural-language event in Hindsight memory.
   * @param event  Short label for the event type (e.g. "quiz_completed")
   * @param content  Full narrative description of what happened
   */
  retain: (event: string, content: string) => Promise<void>

  /**
   * Retrieves contextually relevant memories for a given query.
   * @param query  Natural-language question or context hint
   * @returns  Recalled memory text to inject into system prompts
   */
  recall: (query: string) => Promise<string>

  /**
   * Synthesises qualitative insights from accumulated memories.
   * @param question  The reflective question to answer (e.g. "What should this student focus on?")
   * @returns  Insight text with confidence-backed conclusions
   */
  reflect: (question: string) => Promise<string>
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined)

export function MemoryProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth()

  const retain = useCallback(
    async (event: string, content: string): Promise<void> => {
      if (!userId) return
      try {
        await fetch('/api/memory/retain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, event, content }),
        })
      } catch (err) {
        console.error('[Memory] retain() failed:', err)
      }
    },
    [userId],
  )

  const recall = useCallback(
    async (query: string): Promise<string> => {
      if (!userId) return ''
      try {
        const res = await fetch('/api/memory/recall', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, query }),
        })
        if (!res.ok) return ''
        const data = await res.json()
        return (data.result as string) ?? ''
      } catch (err) {
        console.error('[Memory] recall() failed:', err)
        return ''
      }
    },
    [userId],
  )

  const reflect = useCallback(
    async (question: string): Promise<string> => {
      if (!userId) return ''
      try {
        const res = await fetch('/api/memory/reflect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, question }),
        })
        if (!res.ok) return ''
        const data = await res.json()
        return (data.result as string) ?? ''
      } catch (err) {
        console.error('[Memory] reflect() failed:', err)
        return ''
      }
    },
    [userId],
  )

  return (
    <MemoryContext.Provider value={{ retain, recall, reflect }}>
      {children}
    </MemoryContext.Provider>
  )
}

export function useMemory(): MemoryContextType {
  const context = useContext(MemoryContext)
  if (!context) {
    throw new Error('useMemory must be used within a MemoryProvider')
  }
  return context
}
