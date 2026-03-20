import { NextRequest, NextResponse } from 'next/server'
import { recall } from '@/lib/hindsight'

export async function POST(req: NextRequest) {
  try {
    const { userId, query } = await req.json()

    if (!userId || !query) {
      return NextResponse.json({ error: 'userId and query are required' }, { status: 400 })
    }

    const bankId = userId
    const result = await recall(bankId, query)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('[API] /memory/recall error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
