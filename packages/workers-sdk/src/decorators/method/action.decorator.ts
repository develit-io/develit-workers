import type { DevelitWorkerEntrypoint } from '../../workers'

/**
 * Method decorator that sets `this.action` to a specific name before method execution.
 *
 * This is used to enforce logging context and input validation via `handleActionInput`.
 */
export const action = (name: string): MethodDecorator => {
  return (
    _target: unknown,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value as (...args: unknown[]) => unknown

    descriptor.value = function (
      this: DevelitWorkerEntrypoint<unknown>,
      ...args: unknown[]
    ): unknown {
      this.action = name
      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}
