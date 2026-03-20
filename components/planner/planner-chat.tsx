'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useMemory } from '@/providers/memory-provider'
import { ChatMessage } from '@/components/shared/chat-message'
import { ChatInput } from '@/components/shared/chat-input'
import { ScheduleDiffCard, type ScheduleChange } from '@/components/planner/schedule-diff-card'
import type { ScheduleTask } from '@/components/planner/scheduler-panel'
import type { CalendarEvent } from '@/components/planner/calendar-panel'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  scheduleDiff?: ScheduleChange[]
}

interface PlannerChatProps {
  onTasksChanged: (tasks: ScheduleTask[]) => void
  onEventsChanged: (events: CalendarEvent[]) => void
}

const QUICK_ACTIONS = [
  { label: '📅 Plan my week', value: 'Can you help me plan my study schedule for this week?' },
  { label: '📝 Add an exam', value: 'I have an exam coming up and want to add it to my calendar.' },
  { label: '🎯 What to study today?', value: 'What should I study today based on my progress?' },
  { label: '⚡ Quiz me', value: 'Quiz me on my weakest subject.' },
]

export function PlannerChat({ onTasksChanged, onEventsChanged }: PlannerChatProps) {
  const { userId, userName } = useAuth()
  const { retain } = useMemory()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pendingDiff, setPendingDiff] = useState<{ msgId: string; changes: ScheduleChange[] } | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!userId || isLoading) return

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
      }

      // Add placeholder for AI
      const aiMsgId = crypto.randomUUID()
      const aiPlaceholder: Message = {
        id: aiMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, userMsg, aiPlaceholder])
      setIsLoading(true)

      try {
        const history = messages.map(m => ({ role: m.role, content: m.content }))

        const res = await fetch('/api/planner/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, message: content, conversationHistory: history }),
        })

        if (!res.ok) throw new Error('Chat request failed')
        const data = await res.json()
        const aiContent: string = data.response ?? 'Sorry, something went wrong.'

        // Update AI message with real content
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId
              ? { ...m, content: aiContent, timestamp: new Date() }
              : m
          )
        )

        // Detect schedule diff in AI response (heuristic: contains "move", "add", "schedule")
        const hasDiff =
          /\b(schedule|move|add.*session|plan.*session)\b/i.test(aiContent)
        if (hasDiff) {
          const inferredChanges: ScheduleChange[] = parseScheduleChanges(aiContent)
          if (inferredChanges.length > 0) {
            setPendingDiff({ msgId: aiMsgId, changes: inferredChanges })
          }
        }

        // Auto-detect exam dates mentioned
        const examMatch = aiContent.match(
          /exam.*?(?:on|scheduled for|is on)\s+([A-Za-z]+ \d+)/i
        )
        if (examMatch) {
          const examLabel = examMatch[0]
          await retain('exam_date_mentioned', `Student mentioned: ${examLabel} in planner chat`)
        }
      } catch {
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId
              ? { ...m, content: "I'm having trouble connecting right now. Please try again." }
              : m
          )
        )
      } finally {
        setIsLoading(false)
      }
    },
    [userId, isLoading, messages, retain]
  )

  const handleAcceptDiff = useCallback(async () => {
    if (!pendingDiff) return
    const { changes } = pendingDiff
    // Convert to tasks
    const newTasks: ScheduleTask[] = changes
      .filter(c => c.action !== 'remove')
      .map((c, i) => ({
        id: `task-${Date.now()}-${i}`,
        subject: c.subject,
        topic: undefined,
        mode: (c.mode?.toLowerCase() as ScheduleTask['mode']) ?? 'lesson',
        estimatedMinutes: 50,
        status: 'pending' as const,
      }))
    onTasksChanged(newTasks)
    await retain(
      'schedule_accepted',
      `Student accepted AI schedule suggestion: ${changes.map(c => `${c.action} ${c.subject}`).join(', ')}.`
    )
    setPendingDiff(null)
  }, [pendingDiff, onTasksChanged, retain])

  const handleRejectDiff = useCallback(async () => {
    if (!pendingDiff) return
    await retain(
      'schedule_rejected',
      `Student rejected AI schedule suggestion for: ${pendingDiff.changes.map(c => c.subject).join(', ')}.`
    )
    setPendingDiff(null)
  }, [pendingDiff, retain])

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {isEmpty && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center animate-step-in">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              Hey {userName ?? 'there'}! Ready to plan?
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              I know your syllabus, your weak spots, and your schedule. Ask me anything about what to study.
            </p>
          </div>
        )}

        {messages.map(msg => (
          <React.Fragment key={msg.id}>
            <ChatMessage
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
              isStreaming={isLoading && msg.id === messages[messages.length - 1]?.id && msg.role === 'assistant' && msg.content === ''}
            />
            {/* Render schedule diff below the relevant AI message */}
            {pendingDiff?.msgId === msg.id && (
              <div className="ml-11">
                <ScheduleDiffCard
                  changes={pendingDiff.changes}
                  onAccept={handleAcceptDiff}
                  onReject={handleRejectDiff}
                />
              </div>
            )}
          </React.Fragment>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3">
        <ChatInput
          onSend={sendMessage}
          placeholder="Ask about your schedule, exams, or what to study…"
          quickActions={isEmpty ? QUICK_ACTIONS : undefined}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

// Heuristic parser: extract schedule changes from AI prose
function parseScheduleChanges(text: string): ScheduleChange[] {
  const changes: ScheduleChange[] = []
  const subjects = [
    'Data Structures', 'DS', 'Operating Systems', 'OS', 'DBMS', 'IOT',
    'Computer Networks', 'CN', 'Computer Theory', 'CT', 'Discrete Math', 'DM',
    'Physics', 'Chemistry', 'Mathematics', 'Math',
  ]
  for (const subject of subjects) {
    if (new RegExp(`\\b${subject}\\b`, 'i').test(text)) {
      const isAdd = /\badd|schedule|plan\b/i.test(text)
      const isMove = /\bmove|reschedule|shift\b/i.test(text)
      if (isAdd || isMove) {
        changes.push({
          action: isMove ? 'move' : 'add',
          subject,
          mode: /quiz/i.test(text) ? 'Quiz' : /revision/i.test(text) ? 'Revision' : 'Lesson',
        })
        if (changes.length >= 3) break
      }
    }
  }
  return changes
}
