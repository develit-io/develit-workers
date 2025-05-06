import { WorkerEntrypoint } from 'cloudflare:workers'
import type z from 'zod'
import { createInternalError, RPCResponse } from '../utils'

export abstract class DevelitWorkerEntrypoint<TEnv> extends WorkerEntrypoint<TEnv> {
  protected name: string = 'not-set'

  async fetch() {
    return new Response('Service is up and running!')
  }

  handleActionInput<T extends z.Schema>({
    name,
    input,
    schema,
  }: { name: string, input: z.infer<T>, schema: T }) {
    this.logInput(name, input)

    const result = schema.safeParse(input)

    // Throw an error when parsing did not eneded successfuly
    if (!result.success) {
      const validationError = {
        status: 400,
        code: 'INVALID_INPUT',
        message: result.error.message,
      }

      this.logError(name, validationError)
      throw RPCResponse.validationError(validationError)
    }

    // Ensure actual data are returned
    if (!result.data) {
      throw createInternalError({
        statusCode: 418,
        message: `Couldn't start processing the request.`,
      })
    }

    return result.data as z.infer<T>
  }

  log(action: string, data: object, identifier?: string) {
    const name = identifier ?? `${this.name}:${action}:log`
    console.log(name, {
      entrypoint: this.name,
      action,
      identifier: name,
      data,
    })
  }

  logQueuePush(action: string, data: object) {
    this.log(action, data, `${this.name}:${action}:queue-push`)
  }

  logQueuePull(action: string, data: object) {
    this.log(action, data, `${this.name}:${action}:queue-pull`)
  }

  logInput(action: string, data: object) {
    this.log(action, data, `${this.name}:${action}:input`)
  }

  logOutput(action: string, data: object) {
    this.log(action, data, `${this.name}:${action}:output`)
  }

  logError(action: string, error: object) {
    this.log(action, error, `${this.name}:${action}:error`)
  }

  pushToQueue<T>(queue: Queue, message: T | T[]): Promise<void> {
    if (!Array.isArray(message))
      return queue.send(message, { contentType: 'v8' })

    return queue.sendBatch(message.map(m => ({
      body: m,
      contentType: 'v8',
    })))
  }

  // pullQueueBatch<T>(batch: MessageBatch<string>): MessageBatch<T> {
  //   const messages = batch.messages.map(message => ({
  //     ...message,
  //     body: superjson.parse<T>(message.body),
  //   }))

  //   return {
  //     ...batch,
  //     messages,
  //   }
  // }
}
