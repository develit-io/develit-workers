import * as crypto from 'node:crypto'
import { defineConfig } from 'drizzle-kit'

export const drizzleConfig = defineConfig({
  dialect: 'sqlite',
  schema: './src/database/schema/',
  out: './src/database/migrations/',
})

export function first<T>(rows: T[]): T | undefined {
  return rows.length > 0 ? rows[0] : undefined
}

export function firstOrError<T>(rows: T[]): T {
  if (rows.length === 0) {
    throw new Error('Query did not return any data.')
  }

  return rows[0]
}

export const uuidv4 = crypto.randomUUID
