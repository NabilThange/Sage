import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/groq'
import { recall, getBankId } from '@/lib/hindsight'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, message, subject, topic, conversationHistory = [] } = body

    if (!userId || !message || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, message, subject' },
        { status: 400 }
      )
    }

    // Recall relevant memories for this subject
    const bankId = getBankId(userId)
    const memoryContext = await recall(
      bankId,
      `${subject} ${topic || ''} weak areas, past mistakes, learning style: ${message}`
    )

    // Build system prompt with memory context
    const systemPrompt = `You are Recallio, an AI tutor specializing in ${subject}${topic ? ` - ${topic}` : ''}.

Memory context about this student:
${memoryContext}

Guidelines:
- Teach conversationally, adapting to their level
- Reference their past struggles and progress when relevant
- If they seem confused, offer to re-explain differently
- Use examples and analogies
- Break down complex concepts
- Encourage questions
- After sufficient teaching, suggest taking a quiz to test understanding`

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ]

    const response = await chatCompletion(messages)

    // Detect confusion signals for retention
    const confusionSignals = [
      'i don\'t understand',
      'confused',
      'can you explain again',
      're-explain',
      'what do you mean',
    ]
    const isConfused = confusionSignals.some((signal) =>
      message.toLowerCase().includes(signal)
    )

    return NextResponse.json({ response, memoryContext, isConfused })
  } catch (error) {
    console.error('[API] /api/mentor/chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
