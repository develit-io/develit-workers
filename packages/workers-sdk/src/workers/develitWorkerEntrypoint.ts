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

  logInput(action: string, data: object) {
    this.log(action, data, `${this.name}:${action}:input`)
  }

  logOutput(action: string, data: object) {
    this.log(action, data, `${this.name}:${action}:output`)
  }

  logError(action: string, error: object) {
    this.log(action, error, `${this.name}:${action}:error`)
  }
}
