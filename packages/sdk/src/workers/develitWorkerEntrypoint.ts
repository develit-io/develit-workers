import { WorkerEntrypoint } from 'cloudflare:workers'

export abstract class DevelitWorkerEntrypoint<TEnv> extends WorkerEntrypoint<TEnv> {}
