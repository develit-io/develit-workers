import type { StatusCodes as RPCResponseStatus } from 'http-status-codes'
import { ReasonPhrases as RPCResponsePhrase } from 'http-status-codes'

export { RPCResponseStatus }
export { RPCResponsePhrase }

export type RPCErrorResponseStatus = Exclude<RPCResponseStatus, 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207>

export type RPCError = {
  status: RPCErrorResponseStatus
  code: string
  message: string
}

export type IRPCResponse<T> = {
  status: RPCResponseStatus
  message: string
  data: T | null | undefined
  error: RPCError | null
  phrase?: RPCResponsePhrase
}
