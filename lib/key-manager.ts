/**
 * API Key Manager with automatic rotation and error handling
 * Supports multiple API keys for load balancing and failover
 */

interface KeyStatus {
  key: string
  failures: number
  lastFailure: number | null
  isBlocked: boolean
}

class KeyManager {
  private keys: KeyStatus[] = []
  private currentIndex = 0
  private readonly MAX_FAILURES = 3
  private readonly BLOCK_DURATION = 60000 // 1 minute in ms

  constructor(keyPrefix: string) {
    this.loadKeys(keyPrefix)
  }

  /**
   * Load all API keys from environment variables
   * Supports GROQ_API_KEY, GROQ_API_KEY_1, GROQ_API_KEY_2, etc.
   */
  private loadKeys(prefix: string): void {
    const keys: string[] = []

    // Check for single key (backward compatibility)
    const singleKey = process.env[`${prefix}_API_KEY`]
    if (singleKey) {
      keys.push(singleKey)
    }

    // Check for numbered keys
    let index = 1
    while (true) {
      const key = process.env[`${prefix}_API_KEY_${index}`]
      if (!key) break
      keys.push(key)
      index++
    }

    // Initialize key status tracking
    this.keys = keys.map((key) => ({
      key,
      failures: 0,
      lastFailure: null,
      isBlocked: false,
    }))

    if (this.keys.length === 0) {
      console.warn(`[KeyManager] No API keys found for ${prefix}`)
    } else {
      console.log(`[KeyManager] Loaded ${this.keys.length} API key(s) for ${prefix}`)
    }
  }

  /**
   * Get the next available API key
   * Automatically skips blocked keys and rotates through available ones
   */
  getKey(): string | null {
    if (this.keys.length === 0) {
      return null
    }

    // Unblock keys that have been blocked for longer than BLOCK_DURATION
    const now = Date.now()
    this.keys.forEach((keyStatus) => {
      if (
        keyStatus.isBlocked &&
        keyStatus.lastFailure &&
        now - keyStatus.lastFailure > this.BLOCK_DURATION
      ) {
        keyStatus.isBlocked = false
        keyStatus.failures = 0
        console.log('[KeyManager] Unblocked key after cooldown period')
      }
    })

    // Find next available (non-blocked) key
    const startIndex = this.currentIndex
    let attempts = 0

    while (attempts < this.keys.length) {
      const keyStatus = this.keys[this.currentIndex]

      if (!keyStatus.isBlocked) {
        const key = keyStatus.key
        // Move to next key for next call (round-robin)
        this.currentIndex = (this.currentIndex + 1) % this.keys.length
        return key
      }

      this.currentIndex = (this.currentIndex + 1) % this.keys.length
      attempts++

      // Prevent infinite loop
      if (this.currentIndex === startIndex) {
        break
      }
    }

    // All keys are blocked
    console.error('[KeyManager] All API keys are currently blocked')
    return null
  }

  /**
   * Report a successful API call
   * Resets failure count for the key
   */
  reportSuccess(key: string): void {
    const keyStatus = this.keys.find((k) => k.key === key)
    if (keyStatus) {
      keyStatus.failures = 0
      keyStatus.isBlocked = false
    }
  }

  /**
   * Report a failed API call
   * Increments failure count and blocks key if threshold exceeded
   */
  reportFailure(key: string, error?: Error): void {
    const keyStatus = this.keys.find((k) => k.key === key)
    if (!keyStatus) return

    keyStatus.failures++
    keyStatus.lastFailure = Date.now()

    console.warn(
      `[KeyManager] Key failure ${keyStatus.failures}/${this.MAX_FAILURES}`,
      error?.message || 'Unknown error'
    )

    if (keyStatus.failures >= this.MAX_FAILURES) {
      keyStatus.isBlocked = true
      console.error(
        `[KeyManager] Key blocked after ${this.MAX_FAILURES} failures. Will retry after ${this.BLOCK_DURATION / 1000}s`
      )
    }
  }

  /**
   * Get status of all keys (for debugging/monitoring)
   */
  getStatus(): Array<{
    index: number
    failures: number
    isBlocked: boolean
    lastFailure: string | null
  }> {
    return this.keys.map((keyStatus, index) => ({
      index: index + 1,
      failures: keyStatus.failures,
      isBlocked: keyStatus.isBlocked,
      lastFailure: keyStatus.lastFailure
        ? new Date(keyStatus.lastFailure).toISOString()
        : null,
    }))
  }

  /**
   * Check if any keys are available
   */
  hasAvailableKeys(): boolean {
    return this.keys.some((k) => !k.isBlocked)
  }

  /**
   * Get total number of keys
   */
  getKeyCount(): number {
    return this.keys.length
  }
}

// Singleton instances for different services
let groqKeyManager: KeyManager | null = null
let hindsightKeyManager: KeyManager | null = null

/**
 * Get Groq key manager instance
 */
export function getGroqKeyManager(): KeyManager {
  if (!groqKeyManager) {
    groqKeyManager = new KeyManager('GROQ')
  }
  return groqKeyManager
}

/**
 * Get Hindsight key manager instance
 */
export function getHindsightKeyManager(): KeyManager {
  if (!hindsightKeyManager) {
    hindsightKeyManager = new KeyManager('HINDSIGHT')
  }
  return hindsightKeyManager
}

/**
 * Helper function to execute an API call with automatic key rotation
 */
export async function executeWithKeyRotation<T>(
  keyManager: KeyManager,
  apiCall: (apiKey: string) => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const apiKey = keyManager.getKey()

    if (!apiKey) {
      throw new Error('No API keys available')
    }

    try {
      const result = await apiCall(apiKey)
      keyManager.reportSuccess(apiKey)
      return result
    } catch (error) {
      lastError = error as Error
      keyManager.reportFailure(apiKey, lastError)

      // If this was the last retry, throw the error
      if (attempt === maxRetries - 1) {
        break
      }

      // Wait a bit before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('API call failed after all retries')
}
