import { loadEnv } from '@packages/shared'
import { z } from 'zod'

loadEnv()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.url().default('http://localhost:5173'),
  API_URL: z.url().default('http://localhost:8787'),
  DATABASE_URL: z.string().min(1),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
})

export const env = envSchema.parse(process.env)
