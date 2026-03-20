import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/groq'
import { recall, getBankId } from '@/lib/hindsight'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, message, conversationHistory = [] } = body

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, message' },
        { status: 400 }
      )
    }

    // Recall relevant memories
    const bankId = getBankId(userId)
    const memoryContext = await recall(
      bankId,
      `study schedule, exams, preferences, recent sessions: ${message}`
    )

    // Build system prompt with memory context
    const systemPrompt = `You are Recallio, an AI study planner assistant. You help students manage their study schedule.

Memory context about this student:
${memoryContext}

Guidelines:
- Be conversational and supportive
- Reference their past study sessions and preferences when relevant
- Suggest schedule changes when appropriate
- If you suggest a schedule change, format it clearly
- Help them prepare for upcoming exams
- Encourage good study habits`

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ]

    const response = await chatCompletion(messages)

    return NextResponse.json({ response, memoryContext })
  } catch (error) {
    console.error('[API] /api/planner/chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
