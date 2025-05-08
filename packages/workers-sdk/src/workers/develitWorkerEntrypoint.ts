import { WorkerEntrypoint } from 'cloudflare:workers'
import superjson from 'superjson'
import type z from 'zod'
import { createInternalError, RPCResponse } from '../utils'

export abstract class DevelitWorkerEntrypoint<TEnv> extends WorkerEntrypoint<TEnv> {
  protected abstract name: string

  protected action: string = 'not-set'

  async fetch() {
    return new Response('Service is up and running!')
  }

  handleActionInput<T extends z.Schema>({
    input,
    schema,
  }: { input: z.infer<T>, schema: T }) {
    this.logInput(input)

    const result = schema.safeParse(input)

    // Throw an error when parsing did not eneded successfuly
    if (!result.success) {
      const validationError = {
        status: 400,
        code: 'INVALID_INPUT',
        message: result.error.message,
      }

      this.logError(validationError)
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

  log(data: object, identifier?: string) {
    const name = identifier ?? `${this.name}:${this.action}:log`
    console.log(name, {
      entrypoint: this.name,
      action: this.action,
      identifier: name,
      data: superjson.stringify(data),
    })
  }

  logQueuePush(data: object) {
    this.log(data, `${this.name}:${this.action}:queue-push`)
  }

  logQueuePull(data: object) {
    this.log(data, `${this.name}:${this.action}:queue-pull`)
  }

  logInput(data: object) {
    this.log(data, `${this.name}:${this.action}:input`)
  }

  logOutput(data: object) {
    this.log(data, `${this.name}:${this.action}:output`)
  }

  logError(error: object) {
    this.log(error, `${this.name}:${this.action}:error`)
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
