import { describe, expect, it, vi, afterEach } from 'vitest'
import { askModel } from '../src/index.js'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('askModel', () => {
  it('returns mock response when MOCK_OLLAMA=1', async () => {
    vi.stubEnv('MOCK_OLLAMA', '1')
    vi.stubEnv('OLLAMA_BASE_URL', 'https://ollama.com')
    vi.stubEnv('OLLAMA_MODEL', 'gemma3:27b-cloud')

    await expect(askModel('hello')).resolves.toBe('MOCK_RESPONSE: hello')
  })
})
