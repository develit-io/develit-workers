import * as crypto from 'node:crypto'
import { defineConfig } from 'drizzle-kit'

export const drizzleConfig = defineConfig({
  dialect: 'sqlite',
  schema: './src/database/schema/',
  out: './src/database/migrations/',
})

export function first<T>(rows: T[]): T | undefined {
  return rows[0] || undefined
}

export const uuidv4 = crypto.randomUUID
