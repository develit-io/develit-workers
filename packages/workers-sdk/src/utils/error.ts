import type { InternalError, InternalErrorResponseStatus } from '../types'

export const createInternalError = (error: unknown, details?: { status?: InternalErrorResponseStatus, code?: string, message?: string }): InternalError => {
  return {
    status: details?.status || 500,
    code: details?.code || 'UNKNOWN_ERROR',
    message: details?.message || (error instanceof Error ? error.message : 'An unexpected error occurred.'),
  }
}

export const isInternalError = (error: unknown): error is InternalError => {
  return (
    typeof error === 'object'
    && error !== null
    && 'message' in error
    && 'code' in error
  )
}
