import { calculateExponentialBackoff } from '../utils'

interface WithRetryCounterOptions {
  baseDelay: number
}

export function withRetryCounter(options: WithRetryCounterOptions): MethodDecorator {
  return (
    _target,
    _propertyKey,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value as (batch: MessageBatch) => unknown

    interface WithRetryCounterContext {
      logQueueRetries: (data: object) => void
    }

    descriptor.value = async function (
      this: WithRetryCounterContext,
      batch: MessageBatch,
    ): Promise<unknown> {
      let retriedCount = 0

      batch.messages.forEach((msg: Message) => {
        const originalRetry = msg.retry?.bind(msg)
        msg.retry = () => {
          retriedCount++
          return originalRetry({
            delaySeconds: calculateExponentialBackoff(msg.attempts, options.baseDelay),
          })
        }
        return msg
      })

      const result = await originalMethod.apply(this, [batch])

      if (typeof this.logQueueRetries === 'function') {
        this.logQueueRetries({
          message: `Retried ${retriedCount} out of ${batch.messages.length} messages `,
        })
      }

      return result
    }

    return descriptor
  }
}
