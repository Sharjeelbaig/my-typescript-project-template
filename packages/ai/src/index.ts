import { Ollama } from 'ollama'
import { z } from 'zod'

const aiEnvSchema = z.object({
  OLLAMA_API_KEY: z.string().optional(),
  OLLAMA_BASE_URL: z.url().default('https://ollama.com'),
  OLLAMA_MODEL: z.string().default('gemma3:27b-cloud'),
  MOCK_OLLAMA: z.enum(['0', '1']).default('0'),
})

export type VectorMemoryStore = {
  upsert: (id: string, text: string, metadata?: Record<string, string>) => Promise<void>
  search: (query: string, limit?: number) => Promise<Array<{ id: string; text: string }>>
}

class InMemoryVectorStore implements VectorMemoryStore {
  private items = new Map<string, string>()

  async upsert(id: string, text: string): Promise<void> {
    this.items.set(id, text)
  }

  async search(query: string, limit = 5): Promise<Array<{ id: string; text: string }>> {
    const normalized = query.toLowerCase()
    return [...this.items.entries()]
      .filter(([, value]) => value.toLowerCase().includes(normalized))
      .slice(0, limit)
      .map(([id, text]) => ({ id, text }))
  }
}

export const vectorMemoryStore: VectorMemoryStore = new InMemoryVectorStore()

let cachedClient: Ollama | null = null

export const getOllamaClient = () => {
  if (cachedClient) {
    return cachedClient
  }

  const env = aiEnvSchema.parse(process.env)
  cachedClient = new Ollama({
    host: env.OLLAMA_BASE_URL,
    headers: env.OLLAMA_API_KEY ? { Authorization: `Bearer ${env.OLLAMA_API_KEY}` } : undefined,
  })

  return cachedClient
}

export const askModel = async (prompt: string): Promise<string> => {
  const env = aiEnvSchema.parse(process.env)

  if (env.MOCK_OLLAMA === '1') {
    return `MOCK_RESPONSE: ${prompt}`
  }

  const client = getOllamaClient()

  let lastError: unknown
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await client.chat({
        model: env.OLLAMA_MODEL,
        messages: [{ role: 'user', content: prompt }],
      })
      return response.message.content
    } catch (error) {
      lastError = error
    }
  }

  throw new Error(`Ollama request failed after retries: ${String(lastError)}`)
}
