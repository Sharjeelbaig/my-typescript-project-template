import { z } from 'zod'

export * from './env.js'

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

export type ApiError = z.infer<typeof apiErrorSchema>
