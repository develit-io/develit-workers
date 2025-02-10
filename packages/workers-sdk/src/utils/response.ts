import { consola } from 'consola'
import type { IRPCResponse, RPCError, RPCResponseStatus } from '../types'

export const RPCResponse = {
  /** ✅ Success response */
  ok<T>(data: T, status: RPCResponseStatus = 200): IRPCResponse<T> {
    return { status, data, error: null }
  },

  /** ❌ Generic error response */
  serviceError<T>(error: RPCError): IRPCResponse<T> {
    consola.error(error.message)
    return { status: error.status, data: null as T, error }
  },

  /** ❌ Validation error (400) */
  validationError<T>(error: RPCError): IRPCResponse<T> {
    return RPCResponse.serviceError(error)
  },
}
