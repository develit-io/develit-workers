import { WorkerEntrypoint } from 'cloudflare:workers'

export abstract class DevelitWorkerEntrypoint<TEnv> extends WorkerEntrypoint<TEnv> {
  async fetch() {
    return new Response('Service is up and running!')
  }
}
