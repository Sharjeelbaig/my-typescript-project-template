import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { env } from './config/env.js'
import { publicRoutes } from './routes/public.js'
import { protectedRoutes } from './routes/protected.js'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: env.APP_URL,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Authorization', 'Content-Type'],
  }),
)

app.route('/api/public', publicRoutes)
app.route('/api/protected', protectedRoutes)

serve(
  {
    fetch: app.fetch,
    port: 8787,
  },
  (info) => {
    console.log(`API running on http://localhost:${info.port}`)
  },
)
