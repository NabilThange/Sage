import { NextRequest, NextResponse } from 'next/server'
import { reflect, getBankId } from '@/lib/hindsight'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, question } = body

    if (!userId || !question) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, question' },
        { status: 400 }
      )
    }

    const bankId = getBankId(userId)
    const result = await reflect(bankId, question)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('[API] /api/memory/reflect error:', error)
    return NextResponse.json(
      { error: 'Failed to reflect on memory' },
      { status: 500 }
    )
  }
}
