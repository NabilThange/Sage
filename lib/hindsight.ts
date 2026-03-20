/**
 * Hindsight Cloud SDK wrapper.
 *
 * If the `hindsight-core` SDK is not installed or the API key is missing,
 * all operations degrade gracefully — returning empty strings / no-ops.
 * This lets the app compile and run without Hindsight credentials.
 */

const HINDSIGHT_API_KEY = process.env.HINDSIGHT_API_KEY ?? ''
const HINDSIGHT_BASE_URL = process.env.HINDSIGHT_BASE_URL ?? 'https://api.vectorize.io/v1'

// ---------------------------------------------------------------------------
// Low-level fetch helper
// ---------------------------------------------------------------------------
async function hindsightFetch(path: string, body: Record<string, unknown>): Promise<unknown> {
  if (!HINDSIGHT_API_KEY) {
    console.warn('[Hindsight] No API key — skipping', path)
    return null
  }

  const res = await fetch(`${HINDSIGHT_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${HINDSIGHT_API_KEY}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`[Hindsight] ${path} failed (${res.status}):`, text.slice(0, 300))
    return null
  }

  return res.json()
}

// ---------------------------------------------------------------------------
// Public API — mirrors the 3 Hindsight operations
// ---------------------------------------------------------------------------

/**
 * Store a natural-language memory event.
 */
export async function retain(bankId: string, content: string): Promise<void> {
  await hindsightFetch('/memory/retain', { bankId, content })
}

/**
 * Retrieve relevant memories for a given query.
 */
export async function recall(bankId: string, query: string): Promise<string> {
  const data = (await hindsightFetch('/memory/recall', { bankId, query })) as {
    result?: string
  } | null
  return data?.result ?? ''
}

/**
 * Synthesise qualitative insights from accumulated memories.
 */
export async function reflect(bankId: string, question: string): Promise<string> {
  const data = (await hindsightFetch('/memory/reflect', { bankId, question })) as {
    result?: string
  } | null
  return data?.result ?? ''
}
