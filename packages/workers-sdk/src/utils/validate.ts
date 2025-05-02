import type z from 'zod'
import type { InternalError } from '../types'

/**
 * Validates input parameters against a given Zod schema.
 *
 * This function ensures that the provided input matches the expected schema.
 * If validation fails, it returns a structured `RPCError` object.
 *
 * @template S - A Zod schema type.
 * @param params - The input data to be validated.
 * @param schema - The Zod schema used for validation.
 * @returns `null` if validation succeeds, otherwise an `RPCError` object.
 */
export const validateRPCInput = <S extends z.ZodTypeAny>(
  params: unknown,
  schema: S,
): [z.infer<S> | null, InternalError | null] => {
  const result = schema.safeParse(params)

  const error = result.success
    ? null
    : {
        status: 400,
        code: 'INVALID_INPUT',
        message: result.error?.message,
      }

  return [result.data || null, error]
}
