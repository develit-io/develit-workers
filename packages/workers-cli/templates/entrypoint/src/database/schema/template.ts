import { sqliteTable } from 'drizzle-orm/sqlite-core'
import { Database } from '@develit-io/workers-sdk'

export const template = sqliteTable('template', {
  ...Database.base,
})
