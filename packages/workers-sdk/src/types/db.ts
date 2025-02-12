import type { BuildQueryResult, DBQueryConfig, ExtractTablesWithRelations } from 'drizzle-orm'

/**
 * Utility type to infer possible relation includes (`with`) for a given table.
 * This helps define which relations (one-to-many, many-to-one) can be included in a query.
 *
 * @template Tables - The Drizzle ORM schema object.
 * @template TableName - The table for which relations should be inferred.
 */
export type IncludeRelation<
  Tables extends Record<string, unknown>,
  TableName extends keyof ExtractTablesWithRelations<Tables>,
> = DBQueryConfig<
    'one' | 'many',
  boolean,
  ExtractTablesWithRelations<Tables>,
  ExtractTablesWithRelations<Tables>[TableName]
>['with']

/**
 * Infers the result type of Drizzle ORM select query with optional relations.
 * This ensures correct TypeScript inference when querying tables and their relations.
 *
 * @template Tables - The Drizzle ORM schema object.
 * @template TableName - The table for which the query result is being inferred.
 * @template With - (Optional) Specifies which relations should be included in the result.
 */
export type InferResultType<
  Tables extends Record<string, unknown>,
  TableName extends keyof ExtractTablesWithRelations<Tables>,
  With extends IncludeRelation<Tables, TableName> | undefined = undefined,
> = BuildQueryResult<
  ExtractTablesWithRelations<Tables>,
  ExtractTablesWithRelations<Tables>[TableName],
  {
    with: With
  }
>

/**
 * ✅ **Usage Example**
 * ```ts
 * type UserWithPosts = InferResultType<typeof tables, 'users', { posts: true }>;
 * ```
 */
