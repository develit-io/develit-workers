// import type { DrizzleD1Database } from 'drizzle-orm/d1'
// import { drizzle } from 'drizzle-orm/d1'
// import { tables } from '@services/template/src/database/drizzle'
import { Workers } from '@develit-io/workers-sdk'

export default class TemplateService extends Workers.DevelitWorkerEntrypoint<TemplateEnv> {
  // private db: DrizzleD1Database<typeof tables>
  // constructor(ctx: ExecutionContext, env: TemplateEnv) {
  //   super(ctx, env)
  //
  //   this.db = drizzle(this.env.TEMP_DB, { schema: tables })
  // }
}
