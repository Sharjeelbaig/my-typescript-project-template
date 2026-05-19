import type { Context, Next } from 'hono'
import { getFirebaseAdminAuth } from '../lib/firebase-admin.js'
import { fail } from '../lib/response.js'

type Variables = {
  firebaseUid: string
}

export type AuthContext = Context<{ Variables: Variables }>

export const verifyFirebaseToken = async (
  c: AuthContext,
  next: Next,
): Promise<Response | void> => {
  const authHeader = c.req.header('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json(fail('UNAUTHORIZED', 'Missing bearer token'), 401)
  }

  try {
    const token = authHeader.slice(7)
    const decoded = await getFirebaseAdminAuth().verifyIdToken(token)
    c.set('firebaseUid', decoded.uid)
    await next()
  } catch (error) {
    if (error instanceof Error && error.message.includes('not configured')) {
      return c.json(fail('SERVICE_UNAVAILABLE', error.message), 503)
    }

    return c.json(fail('UNAUTHORIZED', 'Invalid Firebase token'), 401)
  }
}
