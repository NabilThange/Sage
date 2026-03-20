import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/groq'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, topic, content } = body

    if (!subject || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, topic' },
        { status: 400 }
      )
    }

    const prompt = `Generate 8-10 flashcards for ${subject} - ${topic}.
${content ? `\nContent to base flashcards on:\n${content}` : ''}

Return ONLY valid JSON in this exact format:
{
  "flashcards": [
    {
      "front": "Question or term",
      "back": "Answer or definition"
    }
  ]
}

JSON:`

    const response = await chatCompletion(
      [{ role: 'user', content: prompt }],
      { temperature: 0.5, maxTokens: 1536 }
    )

    try {
      const parsed = JSON.parse(response)
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json({
        flashcards: [
          {
            front: `Key concept in ${topic}`,
            back: 'Definition or explanation',
          },
        ],
      })
    }
  } catch (error) {
    console.error('[API] /api/mentor/flashcards error:', error)
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    )
  }
}
