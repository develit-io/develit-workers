import { WorkerEntrypoint } from 'cloudflare:workers'

export abstract class DevelitWorkerEntrypoint<TEnv> extends WorkerEntrypoint<TEnv> {
  protected name: string = 'not-set'

  async fetch() {
    return new Response('Service is up and running!')
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
