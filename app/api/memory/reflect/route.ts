import { NextRequest, NextResponse } from 'next/server'
import { reflect } from '@/lib/hindsight'

export async function POST(req: NextRequest) {
  try {
    const { userId, question } = await req.json()

    if (!userId || !question) {
      return NextResponse.json({ error: 'userId and question are required' }, { status: 400 })
    }

    const bankId = userId
    const result = await reflect(bankId, question)

    return NextResponse.json({ result })
  } catch (error) {
    console.error('[API] /memory/reflect error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
