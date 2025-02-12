export type RPCResponseStatus = 200 | 400 | 401 | 403 | 404 | 409 | 422 | 500
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
