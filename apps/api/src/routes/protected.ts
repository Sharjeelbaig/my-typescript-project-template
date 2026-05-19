import { Hono } from 'hono'
import { ok } from '../lib/response.js'
import { verifyFirebaseToken } from '../middleware/auth.js'

export const protectedRoutes = new Hono<{ Variables: { firebaseUid: string } }>()

protectedRoutes.use('*', verifyFirebaseToken)

protectedRoutes.get('/me', (c) => {
  return c.json(
    ok({
      firebaseUid: c.get('firebaseUid'),
      note: 'Use packages/db user_profiles table to map this UID to app profile data.',
    }),
  )
})
