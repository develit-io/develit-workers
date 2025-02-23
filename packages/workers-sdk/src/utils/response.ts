import { consola } from 'consola'
import type { IRPCResponse, RPCError, RPCResponseStatus } from '../types'

export const RPCResponse = {
  /**
   * ✅ Constructs a successful RPC response.
   *
   * This method wraps the provided data in a standardized response format,
   * ensuring consistency across API responses.
   *
   * @template T - The type of the response data.
   * @param data - The data to return in the response.
   * @param message - Response message
   * @param status - (Optional) HTTP status code, defaults to 200.
   * @returns An `IRPCResponse<T>` with the provided data and no error.
   */
  ok<T>(data: T, message: string, status: RPCResponseStatus = 200): IRPCResponse<T> {
    return { status, data, error: null, message }
  },

  /**
   * ❌ Constructs a generic service error response.
   *
   * This method logs the error and returns a standardized error response.
   *
   * @template T - The expected response type (typically ignored in errors).
   * @param error - An `RPCError` containing error details.
   * @returns An `IRPCResponse<T>` with `null` data and the provided error.
   */
  serviceError<T>(error: RPCError): IRPCResponse<T> {
    consola.error(error.message)
    return { status: error.status, message: error.message, data: null as T, error }
  },

  /**
   * ❌ Constructs a validation error response (HTTP 400).
   *
   * This is a convenience method for returning validation errors.
   * It internally delegates to `serviceError()`.
   *
   * @template T - The expected response type (typically ignored in errors).
   * @param error - An `RPCError` representing a validation failure.
   * @returns An `IRPCResponse<T>` with `null` data and the provided error.
   */
  validationError<T>(error: RPCError): IRPCResponse<T> {
    return RPCResponse.serviceError(error)
  },
}
