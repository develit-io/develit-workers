import { Queue } from '@cloudflare/workers-types'
import superjson from 'superjson'
import type z from 'zod/v4'
import { RPCResponse, createInternalError } from '../utils'

// biome-ignore lint/suspicious/noExplicitAny: required for TS mixin pattern
export type Constructor<T = {}> = abstract new (...args: any[]) => T

export interface DevelitWorkerMethods {
  name: string
  action: string

  fetch(): Promise<Response>
  log(data: object, identifier?: string): void
  logQueuePush(data: object): void
  logQueuePull(data: object): void
  logQueueRetries(data: object): void
  logInput(data: object): void
  logOutput(data: object): void
  logError(error: object): void
  pushToQueue<T>(queue: Queue, message: T | T[]): Promise<void>
  handleActionInput<T extends z.Schema>(args: {
    input: z.infer<T>
    schema: T
  }): z.infer<T>
}

export function develitWorker<TWorker extends Constructor>(
  Worker: TWorker,
): TWorker & Constructor<DevelitWorkerMethods> {
  abstract class DevelitWorker extends Worker {
    public name: string = 'not-set'
    public action: string = 'not-set'

    async fetch() {
      return new Response('Service is up and running!')
    }

    handleActionInput<T extends z.Schema>({
      input,
      schema,
    }: { input: z.infer<T>; schema: T }) {
      this.logInput({ input })

      const result = schema.safeParse(input)

      if (!result.success) {
        const validationError = {
          status: 400,
          code: 'INVALID_INPUT',
          message: result.error.message,
        }

        this.logError(validationError)
        throw RPCResponse.validationError(validationError)
      }

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

    logQueueRetries(data: object) {
      this.log(data, `${this.name}:${this.action}:queue-retries`)
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

      return queue.sendBatch(
        message.map((m) => ({
          body: m,
          contentType: 'v8',
        })),
      )
    }
  }

  return DevelitWorker
}
