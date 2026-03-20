import Groq from 'groq-sdk'

// Lazy-init so the module can be imported even when GROQ_API_KEY is not set (build-time)
let _client: Groq | null = null

function getClient(): Groq {
  if (!_client) {
    _client = new Groq({
      apiKey: process.env.GROQ_API_KEY ?? '',
    })
  }
  return _client
}

export async function chatCompletion(
  systemPrompt: string,
  userMessage: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const client = getClient()
  const res = await client.chat.completions.create({
    model: 'qwen-qwq-32b',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4096,
  })
  return res.choices[0]?.message?.content ?? ''
}

/**
 * Generate MCQ quiz questions via Groq.
 * Returns a JSON array of questions.
 */
export async function generateQuizQuestions(
  subject: string,
  topic: string,
  questionCount: number,
  weakAreas?: string,
  memoryContext?: string
): Promise<
  Array<{
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }>
> {
  const systemPrompt = `You are an expert quiz generator for students. Generate exactly ${questionCount} multiple-choice questions (MCQs) about ${subject}${topic ? ` — specifically on the topic: ${topic}` : ''}.

${weakAreas ? `The student has known weak areas: ${weakAreas}. Bias 40-60% of questions toward these weak spots.` : ''}
${memoryContext ? `Student context from memory:\n${memoryContext}` : ''}

RULES:
- Each question must have exactly 4 options labelled A, B, C, D
- Only ONE correct answer per question
- Questions should range from easy to hard
- Include a brief explanation for the correct answer
- Output ONLY valid JSON — no markdown, no code fences

Output format (JSON array):
[
  {
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": 0,
    "explanation": "..."
  }
]

Where correctAnswer is the 0-based index of the correct option.`

  const raw = await chatCompletion(systemPrompt, `Generate ${questionCount} MCQ questions now.`, {
    temperature: 0.8,
    maxTokens: 4096,
  })

  try {
    // Strip markdown code fences if present
    const cleaned = raw
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()
    const parsed = JSON.parse(cleaned)
    if (Array.isArray(parsed)) return parsed
    return []
  } catch {
    console.error('[Groq] Failed to parse quiz JSON:', raw.slice(0, 200))
    return []
  }
}
