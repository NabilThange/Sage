import { NextRequest, NextResponse } from 'next/server'
import { recall, getBankId } from '@/lib/hindsight'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, query } = body

    if (!userId || !query) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, query' },
        { status: 400 }
      )
    }

    const bankId = getBankId(userId)
    const result = await recall(bankId, query)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('[API] /api/memory/recall error:', error)
    return NextResponse.json(
      { error: 'Failed to recall memory' },
      { status: 500 }
    )
  }
}
