import type { RPCError } from '../types'
import { createRPCError } from '.'

type Result<T> = [data: T | null, error: RPCError | null]

export const useResult = async <T>(promise: Promise<T>): Promise<Result<T>> => {
  try {
    return [await promise, null]
  }
  catch (error) {
    return [null, createRPCError(error)]
  }
}
