import { consola } from 'consola'

export type RPCResponseStatus = 200 | 400 | 401 | 403 | 404 | 500
export type RPCErrorResponseStatus = Exclude<RPCResponseStatus, 200>

export type RPCError = {
  status: RPCErrorResponseStatus
  code: string
  message: string
}

export type IRPCResponse<T> = {
  status: RPCResponseStatus
  data: T | null
  error: RPCError | null
}

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
