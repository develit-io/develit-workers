import { createError } from 'h3'

export const handleActionResponse = <T>({
  error,
  status,
  message,
  data,
}: { error: boolean; status: number; message: string; data: T }) => {
  if (error) {
    throw createError({ status, message })
  }

  if (data === undefined || data === null) {
    throw createError({
      statusCode: 500,
      message: 'Could not process the request. (ACTION_RESPONSE_FAILED)',
    })
  }

  return data
}
