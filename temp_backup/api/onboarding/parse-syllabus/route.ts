import { NextRequest, NextResponse } from 'next/server'
import { parseSyllabus } from '@/lib/groq'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text) {
      return NextResponse.json(
        { error: 'Missing required field: text' },
        { status: 400 }
      )
    }

    const result = await parseSyllabus(text)
    return NextResponse.json(result)
  } catch (error) {
    console.error('[API] /api/onboarding/parse-syllabus error:', error)
    return NextResponse.json(
      { error: 'Failed to parse syllabus' },
      { status: 500 }
    )
  }
}
