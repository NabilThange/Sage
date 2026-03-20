import { NextResponse } from 'next/server'
import { getGroqKeyManager, getHindsightKeyManager } from '@/lib/key-manager'

/**
 * Admin endpoint to check API key status
 * GET /api/admin/key-status
 */
export async function GET() {
  try {
    const groqManager = getGroqKeyManager()
    const hindsightManager = getHindsightKeyManager()

    return NextResponse.json({
      groq: {
        totalKeys: groqManager.getKeyCount(),
        hasAvailableKeys: groqManager.hasAvailableKeys(),
        keyStatus: groqManager.getStatus(),
      },
      hindsight: {
        totalKeys: hindsightManager.getKeyCount(),
        hasAvailableKeys: hindsightManager.hasAvailableKeys(),
        keyStatus: hindsightManager.getStatus(),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[API] /api/admin/key-status error:', error)
    return NextResponse.json(
      { error: 'Failed to get key status' },
      { status: 500 }
    )
  }
}
