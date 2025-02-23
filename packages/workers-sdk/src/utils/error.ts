import type { RPCError, RPCErrorResponseStatus } from '../types'

export const createRPCError = (error: unknown, details?: { status?: RPCErrorResponseStatus, code?: string, message?: string }): RPCError => {
  return {
    status: details?.status || 500,
    code: details?.code || 'UNKNOWN_ERROR',
    message: details?.message || (error instanceof Error ? error.message : 'An unexpected error occurred.'),
  }
}

export const isRPCError = (error: unknown): error is RPCError => {
  return (
    typeof error === 'object'
    && error !== null
    && 'message' in error
    && 'code' in error
  )
}
