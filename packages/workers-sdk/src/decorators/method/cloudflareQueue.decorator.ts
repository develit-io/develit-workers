import { calculateExponentialBackoff } from '../..//utils'
import type { DevelitWorkerEntrypoint } from '../../workers'

interface WithRetryCounterOptions {
  baseDelay: number
}

type AsyncMethod<TArgs extends unknown[] = unknown[], TResult = unknown> = (...args: TArgs) => Promise<TResult>

export function cloudflareQueue<TArgs extends unknown[] = unknown[], TResult = unknown>(
  options: WithRetryCounterOptions,
): (target: unknown, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<AsyncMethod<TArgs, TResult>>) => void {
  return (_target, _propertyKey, descriptor) => {
    const originalMethod = descriptor.value!

    descriptor.value = async function (
      this: DevelitWorkerEntrypoint<unknown>,
      ...args: TArgs
    ): Promise<TResult> {
      const batch = args[0] as MessageBatch

      let retriedCount = 0

      batch.messages.forEach((msg: Message) => {
        const originalRetry = msg.retry?.bind(msg)
        msg.retry = () => {
          retriedCount++
          return originalRetry({
            delaySeconds: calculateExponentialBackoff(msg.attempts, options.baseDelay),
          })
        }
      })

      const result = await originalMethod.apply(this, args)

      if (typeof this.logQueueRetries === 'function') {
        this.logQueueRetries({
          message: `Retried ${retriedCount} out of ${batch.messages.length} messages`,
        })
      }

      return result
    }
  }
}
