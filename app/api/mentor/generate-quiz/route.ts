import { NextRequest, NextResponse } from 'next/server'
import { generateQuizQuestions } from '@/lib/groq'
import { recall } from '@/lib/hindsight'

export async function POST(req: NextRequest) {
  try {
    const { userId, subject, topic, questionCount, weakAreas } = await req.json()

    if (!subject) {
      return NextResponse.json({ error: 'subject is required' }, { status: 400 })
    }

    const count = Math.min(Math.max(questionCount ?? 10, 5), 20)

    // Recall weak areas from Hindsight for this student + subject
    let memoryContext = ''
    if (userId) {
      memoryContext = await recall(
        userId,
        `What are ${subject} weak areas, past quiz mistakes, and topics that need practice?`
      )
    }

    const questions = await generateQuizQuestions(
      subject,
      topic ?? '',
      count,
      weakAreas,
      memoryContext
    )

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate questions. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('[API] /mentor/generate-quiz error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
