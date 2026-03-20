import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/groq'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, chapters } = body

    if (!subject || !chapters) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, chapters' },
        { status: 400 }
      )
    }

    const chapterList = Array.isArray(chapters)
      ? chapters.map((ch: { name: string }) => ch.name).join(', ')
      : chapters

    const prompt = `Generate 6 adaptive pre-test questions for ${subject}.
Chapters to cover: ${chapterList}

These questions should assess baseline knowledge across difficulty levels (2 easy, 2 medium, 2 hard).

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "difficulty": "easy",
      "chapter": "Chapter name"
    }
  ]
}

JSON:`

    const response = await chatCompletion(
      [{ role: 'user', content: prompt }],
      { temperature: 0.7, maxTokens: 2048 }
    )

    try {
      const parsed = JSON.parse(response)
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json({
        questions: [
          {
            question: `What is a fundamental concept in ${subject}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            difficulty: 'easy',
            chapter: 'Introduction',
          },
        ],
      })
    }
  } catch (error) {
    console.error('[API] /api/onboarding/generate-test error:', error)
    return NextResponse.json(
      { error: 'Failed to generate test' },
      { status: 500 }
    )
  }
}
