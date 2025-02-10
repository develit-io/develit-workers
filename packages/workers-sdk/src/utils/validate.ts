import type z from 'zod'
import type { RPCError } from '../types'

export const validateRPCInput = <S extends z.Schema>(
  params: z.infer<S>,
  schema: S,
): RPCError | null => {
  const result = schema.safeParse(params)

  return result.success
    ? null
    : {
        status: 400, // ✅ Bad request
        code: 'INVALID_INPUT', // ✅ Clear error code
        message: result.error.message,
      }
}
