import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.js'

export const createDb = (connectionString: string) => {
  const pool = new Pool({ connectionString })
  return drizzle({ client: pool, schema })
}
