import { WorkerEntrypoint } from 'cloudflare:workers'

export abstract class DevelitWorkerEntrypoint<TEnv> extends WorkerEntrypoint<TEnv> {
  protected name: string = 'not-set'

  async fetch() {
    return new Response('Service is up and running!')
  }

  log(data: object) {
    console.log({
      entrypoint: this.name,
      ...data,
    })
  }
}
