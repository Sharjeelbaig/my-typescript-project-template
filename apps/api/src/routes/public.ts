import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { ok, fail } from '../lib/response.js'

export const publicRoutes = new Hono()

publicRoutes.get('/health', (c) => {
  return c.json(ok({ status: 'ok' }))
})

publicRoutes.post(
  '/echo',
  zValidator(
    'json',
    z.object({
      message: z.string().min(1),
    }),
  ),
  (c) => {
    const body = c.req.valid('json')

    if (!body.message.trim()) {
      return c.json(fail('INVALID_INPUT', 'Message cannot be empty'), 400)
    }

    return c.json(ok({ message: body.message }))
  },
)
