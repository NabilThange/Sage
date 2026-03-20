/**
 * Groq SDK wrapper for LLM operations
 * Uses llama-3.3-70b-versatile model for chat, question generation, and PDF parsing
 * Supports multiple API keys with automatic rotation and failover
 */

import { getGroqKeyManager, executeWithKeyRotation } from './key-manager'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

const keyManager = getGroqKeyManager()

if (keyManager.getKeyCount() === 0) {
  console.warn('[Groq] No API keys configured. LLM features will be mocked.')
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * Send a chat completion request to Groq with automatic key rotation
 */
export async function chatCompletion(
  messages: ChatMessage[],
  options?: {
    temperature?: number
    maxTokens?: number
  }
): Promise<string> {
  if (keyManager.getKeyCount() === 0) {
    console.log('[Groq Mock] chat:', messages)
    return '[Mock AI response]'
  }

  return executeWithKeyRotation(keyManager, async (apiKey) => {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1024,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Groq API error: ${response.statusText} - ${error}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  })
}

/**
 * Parse syllabus PDF text into structured subjects/chapters
 */
export async function parseSyllabus(text: string): Promise<{
  subjects: Array<{
    name: string
    chapters: Array<{
      name: string
      subtopics: string[]
    }>
  }>
}> {
  const prompt = `You are a syllabus parser. Extract subjects, chapters, and subtopics from the following syllabus text.

Return ONLY valid JSON in this exact format:
{
  "subjects": [
    {
      "name": "Subject Name",
      "chapters": [
        {
          "name": "Chapter Name",
          "subtopics": ["Subtopic 1", "Subtopic 2"]
        }
      ]
    }
  ]
}

Syllabus text:
${text}

JSON:`

  const response = await chatCompletion(
    [{ role: 'user', content: prompt }],
    { temperature: 0.3, maxTokens: 2048 }
  )

  try {
    return JSON.parse(response)
  } catch {
    // Fallback if parsing fails
    return {
      subjects: [
        {
          name: 'General Studies',
          chapters: [
            { name: 'Introduction', subtopics: ['Overview', 'Basics'] },
          ],
        },
      ],
    }
  }
}
