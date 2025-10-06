import { drizzle } from 'drizzle-orm/node-postgres-js';
import { Pool } from 'pg';
import * as schema from './schema';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the drizzle client
export const db = drizzle(pool, { schema });

// Export the schema for use in other files
export { schema };

// Export the pool for direct access if needed
export { pool };