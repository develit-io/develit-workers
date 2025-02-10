import type { ZodSchema, infer as ZodInfer } from 'zod'
import type { RPCError } from '../types'

export const validateRPCInput = (
  params: ZodInfer<ZodSchema>,
  schema: ZodSchema,
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
