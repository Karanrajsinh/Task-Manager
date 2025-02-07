import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@/db/schema"


// Create the database connection
const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);


// Initialize drizzle with the connection
export const db = drizzle(sql, {schema});