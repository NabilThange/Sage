import { NextRequest, NextResponse } from 'next/server'
import { retain, getBankId } from '@/lib/hindsight'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, event, content } = body

    if (!userId || !event || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, event, content' },
        { status: 400 }
      )
    }

    const bankId = getBankId(userId)
    await retain(bankId, event, content)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] /api/memory/retain error:', error)
    return NextResponse.json(
      { error: 'Failed to retain memory' },
      { status: 500 }
    )
  }
}
