export const service = (serviceName: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function <T extends new (...args: any[]) => object>(constructor: T) {
    return class extends constructor {
      name = `${serviceName}-service`
    }
  }
}
