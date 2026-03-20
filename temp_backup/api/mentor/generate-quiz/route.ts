import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/groq'
import { recall, getBankId } from '@/lib/hindsight'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, subject, topic, questionCount = 10 } = body

    if (!userId || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, subject' },
        { status: 400 }
      )
    }

    // Recall weak areas to target questions
    const bankId = getBankId(userId)
    const memoryContext = await recall(
      bankId,
      `${subject} weak areas, past mistakes, topics that need practice`
    )

    const prompt = `Generate ${questionCount} multiple-choice questions for ${subject}${topic ? ` - ${topic}` : ''}.

Student's weak areas and past mistakes:
${memoryContext}

Target questions toward their weak areas when possible.

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct"
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
      // Fallback questions if parsing fails
      return NextResponse.json({
        questions: [
          {
            question: `What is a key concept in ${subject}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            explanation: 'This is the correct answer.',
          },
        ],
      })
    }
  } catch (error) {
    console.error('[API] /api/mentor/generate-quiz error:', error)
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
