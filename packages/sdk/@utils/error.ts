import type { RPCError, RPCErrorResponseStatus } from '@develit-io/workers-sdk/@types'

export const createRPCError = (error: unknown, details?: { status?: RPCErrorResponseStatus, code?: string, message?: string }): RPCError => {
  return {
    status: details?.status || 500,
    code: details?.code || 'UNKNOWN_ERROR',
    message: details?.message || (error instanceof Error ? error.message : 'An unexpected error occurred.'),
  }
}
