import type { ZodSchema, infer as ZodInfer } from 'zod'
import type { RPCError } from '@develit-io/workers-sdk/@types'

export const validateRPCInput = <S extends ZodSchema>(
  params: ZodInfer<S>,
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
