import { sql } from 'drizzle-orm'
import { integer, text } from 'drizzle-orm/sqlite-core'

export const base = {
  id: text('id').primaryKey(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).default(sql`(unixepoch('subsec'))`),
  modifiedAt: integer('modified_at', { mode: 'timestamp_ms' }).default(sql`null`).$onUpdate(() => new Date()),
}
