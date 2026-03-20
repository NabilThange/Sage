/**
 * Hindsight Cloud SDK wrapper
 * Provides retain(), recall(), and reflect() operations for persistent memory
 * Supports multiple API keys with automatic rotation and failover
 */

import { getHindsightKeyManager, executeWithKeyRotation } from './key-manager'

const HINDSIGHT_API_URL = process.env.HINDSIGHT_API_URL || 'https://api.hindsight.cloud'
const keyManager = getHindsightKeyManager()

if (keyManager.getKeyCount() === 0) {
  console.warn('[Hindsight] No API keys configured. Memory features will be mocked.')
}

/**
 * Generate bank ID for a user
 */
export function getBankId(userId: string): string {
  return `user_${userId}`
}

/**
 * Store a natural-language event in Hindsight memory
 */
export async function retain(
  bankId: string,
  event: string,
  content: string
): Promise<void> {
  if (keyManager.getKeyCount() === 0) {
    console.log('[Hindsight Mock] retain:', { bankId, event, content })
    return
  }

  await executeWithKeyRotation(keyManager, async (apiKey) => {
    const response = await fetch(`${HINDSIGHT_API_URL}/retain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ bankId, event, content }),
    })

    if (!response.ok) {
      throw new Error(`Hindsight retain failed: ${response.statusText}`)
    }

    return undefined
  })
}

/**
 * Retrieve contextually relevant memories
 */
export async function recall(bankId: string, query: string): Promise<string> {
  if (keyManager.getKeyCount() === 0) {
    console.log('[Hindsight Mock] recall:', { bankId, query })
    return `[Mock memory context for: ${query}]`
  }

  return executeWithKeyRotation(keyManager, async (apiKey) => {
    const response = await fetch(`${HINDSIGHT_API_URL}/recall`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ bankId, query }),
    })

    if (!response.ok) {
      throw new Error(`Hindsight recall failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result || ''
  })
}

/**
 * Synthesize qualitative insights from accumulated memories
 */
export async function reflect(
  bankId: string,
  question: string
): Promise<string> {
  if (keyManager.getKeyCount() === 0) {
    console.log('[Hindsight Mock] reflect:', { bankId, question })
    return `[Mock reflection for: ${question}]`
  }

  return executeWithKeyRotation(keyManager, async (apiKey) => {
    const response = await fetch(`${HINDSIGHT_API_URL}/reflect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ bankId, question }),
    })

    if (!response.ok) {
      throw new Error(`Hindsight reflect failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result || ''
  })
}
