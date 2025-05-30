import type { StatusCodes as InternalResponseStatus } from 'http-status-codes'
import { ReasonPhrases as InternalResponsePhrase } from 'http-status-codes'

export { InternalResponseStatus }
export { InternalResponsePhrase }

export type InternalErrorResponseStatus = Exclude<
  InternalResponseStatus,
  200 | 201 | 202 | 203 | 204 | 205 | 206 | 207
>

export interface InternalError {
  status: InternalErrorResponseStatus
  code: string
  message: string
}

export interface IRPCResponse<T> {
  status: InternalResponseStatus
  message: string
  data: T | null | undefined
  error: boolean
  phrase?: InternalResponsePhrase
}

export interface GatewayResponse<T> {
  status?: number
  message: string
  data?: T
}
