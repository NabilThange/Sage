import { NextRequest, NextResponse } from 'next/server'
import { retain } from '@/lib/hindsight'

export async function POST(req: NextRequest) {
  try {
    const { userId, event, content } = await req.json()

    if (!userId || !content) {
      return NextResponse.json({ error: 'userId and content are required' }, { status: 400 })
    }

    const bankId = userId
    const fullContent = event ? `[${event}] ${content}` : content

    await retain(bankId, fullContent)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] /memory/retain error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
