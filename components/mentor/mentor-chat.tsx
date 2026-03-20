'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/components/shared/chat-message'
import { ChatInput } from '@/components/shared/chat-input'
import { HindsightStrip } from '@/components/shared/hindsight-strip'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMemory } from '@/providers/memory-provider'
import { useAuth } from '@/providers/auth-provider'

interface Chapter {
  name: string
  subtopics: string[]
}

interface MentorChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MentorChatProps {
  subjectName: string
  chapters: Chapter[]
  initialTopic?: string
  lastStudied?: string
  weakAreas?: string[]
  scoreTrend?: 'up' | 'down' | 'stable'
  score?: number
}

export function MentorChat({
  subjectName,
  chapters,
  initialTopic,
  lastStudied,
  weakAreas = [],
  scoreTrend,
  score,
}: MentorChatProps) {
  const { recall, retain } = useMemory()
  const { userName } = useAuth()
  const [selectedModule, setSelectedModule] = useState(initialTopic || chapters[0]?.name || '')
  const [messages, setMessages] = useState<MentorChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  // Build AI opening message on mount using reflect()
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const buildOpeningMessage = async () => {
      // Try to get memory context
      let memoryContext = ''
      try {
        memoryContext = await recall(`${subjectName} study history, weak areas, past interactions`)
      } catch {
        /* API not ready */
      }

      let opening: string
      if (memoryContext && weakAreas.length > 0) {
        opening = `Welcome back, ${userName || 'there'}! I see you've been working on ${subjectName}. ${
          weakAreas.length > 0
            ? `Last time you had some trouble with ${weakAreas.slice(0, 2).join(' and ')}. Want to revisit those or move on to something new?`
            : `Ready to continue where you left off?`
        }`
      } else {
        opening = `Hey ${userName || 'there'}! 👋 I'm your ${subjectName} tutor. I'll adapt to your pace and remember everything we cover together.\n\nSelect a chapter from the dropdown above, and let's get started! What would you like to learn about?`
      }

      setMessages([
        {
          id: 'opening',
          role: 'assistant',
          content: opening,
          timestamp: new Date(),
        },
      ])
    }

    buildOpeningMessage()
  }, [subjectName, userName, weakAreas, recall])

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Detect if user is asking for re-explanation
  const isReExplainRequest = (msg: string): boolean => {
    const patterns = [
      /explain again/i,
      /re-?explain/i,
      /don't understand/i,
      /confused/i,
      /what do you mean/i,
      /can you clarify/i,
      /still don't get/i,
      /one more time/i,
      /say that again/i,
      /i'm lost/i,
    ]
    return patterns.some((p) => p.test(msg))
  }

  const handleSendMessage = async (content: string) => {
    const userMsg: MentorChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    // Check for re-explain signal → retain confusion
    if (isReExplainRequest(content)) {
      try {
        await retain(
          'confusion_signal',
          `Student asked to re-explain a concept in ${subjectName}, chapter "${selectedModule}". Message: "${content}". This indicates the topic needs more attention.`
        )
      } catch {
        /* API may not be ready */
      }
    }

    try {
      // Recall memories for context
      let memoryContext = ''
      try {
        memoryContext = await recall(
          `${subjectName} ${selectedModule} student knowledge, weak areas, past questions`
        )
      } catch {
        /* API not ready */
      }

      // Call mentor chat API
      let aiResponse: string
      try {
        const res = await fetch('/api/mentor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: subjectName,
            module: selectedModule,
            message: content,
            memoryContext,
            conversationHistory: messages.slice(-10).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        })

        if (res.ok) {
          const data = await res.json()
          aiResponse = data.response || data.message || "I'd be happy to help with that topic. Let me explain..."
        } else {
          throw new Error('API error')
        }
      } catch {
        // Fallback response if API isn't ready
        aiResponse = generateFallbackResponse(content, subjectName, selectedModule)
      }

      const aiMsg: MentorChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      const errorMsg: MentorChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header: Module dropdown + Hindsight strip */}
      <div className="p-4 border-b border-border/40 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">{subjectName}</span>
          <span className="text-muted-foreground">›</span>
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select chapter" />
            </SelectTrigger>
            <SelectContent>
              {chapters.map((ch) => (
                <SelectItem key={ch.name} value={ch.name}>
                  {ch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <HindsightStrip
          variant="inline"
          lastStudied={lastStudied}
          weakAreas={weakAreas}
          scoreTrend={scoreTrend}
          score={score}
        />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <ChatMessage
            role="assistant"
            content=""
            isStreaming
          />
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/40">
        <ChatInput
          onSend={handleSendMessage}
          placeholder={`Ask about ${selectedModule || subjectName}...`}
          isLoading={isLoading}
          quickActions={[
            { label: 'Explain this topic', value: `Can you explain ${selectedModule}?` },
            { label: 'Give me examples', value: `Give me practical examples for ${selectedModule}` },
            { label: `Quiz me`, value: `Quiz me on what we just covered` },
          ]}
        />
      </div>
    </div>
  )
}

function generateFallbackResponse(message: string, subject: string, module: string): string {
  const lower = message.toLowerCase()

  if (lower.includes('explain') || lower.includes('what is') || lower.includes('tell me about')) {
    return `Great question! Let me break down **${module}** for you.\n\nThis is a fundamental topic in ${subject}. The key concepts you need to understand are:\n\n1. **Core Principles** — The foundational ideas that everything else builds upon\n2. **Applications** — How these concepts are used in practice\n3. **Common Pitfalls** — What students typically get wrong\n\nWould you like me to go deeper into any of these areas? I can also give you practice problems to test your understanding.`
  }

  if (lower.includes('quiz') || lower.includes('test')) {
    return `I'd love to test your knowledge! Would you like to:\n\n1. **Quick Quiz** — I'll ask you a few questions right here in chat\n2. **Full Test** — Head over to the Tests section for a timed MCQ quiz on ${module}\n\nThe full test will also track your score and help me understand where you need more practice. What do you prefer?`
  }

  if (lower.includes('example') || lower.includes('practice')) {
    return `Here's a practical example related to **${module}**:\n\nConsider a scenario where you need to apply these concepts in a real-world setting. Think about how the theoretical framework maps to practical implementation.\n\n**Try this:** Can you identify the key steps needed to solve a problem involving ${module}? Walk me through your thinking, and I'll guide you along the way.`
  }

  return `That's a great point about ${module} in ${subject}! Let me help you understand this better.\n\nBased on our conversation, I can see you're developing a good foundation. Keep asking questions like this — it shows critical thinking.\n\nWould you like to explore this further, or shall we move on to the next topic?`
}
