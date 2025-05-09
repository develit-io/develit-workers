import { createInternalError, isInternalError } from '.'
import type { InternalError } from '../types'

/**
 * A utility function to handle operations and return a standardized result.
 *
 * This function wraps the call and ensures that both the resolved value
 * and any potential errors are captured in a structured tuple format.
 *
 * @template T - The type of the expected result.
 * @returns A call that resolves to a tuple containing:
 *          - The resolved data (`T | null`) if successful.
 *          - An `RPCError` object (`RPCError | null`) if an error occurs.
 */
type Result<T> = [data: T | null, error: InternalError | null]

/**
 * Executes a given promise and returns the result in a structured format.
 *
 * Instead of throwing errors, this function catches them and returns
 * a standardized `RPCError` object, making error handling more predictable.
 *
 * @template T - The expected return type of the promise.
 * @param promise - A promise representing an asynchronous operation.
 * @returns A promise that resolves to a tuple:
 *          - `[data, null]` if the operation succeeds.
 *          - `[null, error]` if the operation fails.
 */
export const useResult = async <T>(promise: Promise<T>): Promise<Result<T>> => {
  try {
    return [await promise, null]
  } catch (error) {
    return [null, isInternalError(error) ? error : createInternalError(error)]
  }
}

/**
 * Executes a given function and returns the result in a structured format.
 *
 * Instead of throwing errors, this function catches them and returns
 * a standardized `RPCError` object, making error handling more predictable.
 *
 * @template T - The expected return type of the function.
 * @param function - A function representing an synchronous operation.
 * @returns A a tuple:
 *          - `[data, null]` if the operation succeeds.
 *          - `[null, error]` if the operation fails.
 */
export const useResultSync = <T>(fn: () => T): Result<T> => {
  try {
    return [fn(), null]
  } catch (error) {
    return [null, isInternalError(error) ? error : createInternalError(error)]
  }
}
