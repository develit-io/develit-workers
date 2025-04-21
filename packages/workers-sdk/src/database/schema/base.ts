import { integer, text } from 'drizzle-orm/sqlite-core'

export const base = {
  id: text('id').primaryKey(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  modifiedAt: integer('modified_at', { mode: 'timestamp_ms' }).$onUpdate(() => new Date()),
}
