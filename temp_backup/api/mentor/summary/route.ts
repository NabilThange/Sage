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

    const prompt = `Write a clear, concise summary of ${subject} - ${topic}.
${content ? `\nContent to summarize:\n${content}` : ''}

Guidelines:
- Use bullet points for key concepts
- Include important definitions
- Highlight critical formulas or principles
- Keep it student-friendly and easy to review

Summary:`

    const response = await chatCompletion(
      [{ role: 'user', content: prompt }],
      { temperature: 0.5, maxTokens: 1024 }
    )

    return NextResponse.json({ summary: response })
  } catch (error) {
    console.error('[API] /api/mentor/summary error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
