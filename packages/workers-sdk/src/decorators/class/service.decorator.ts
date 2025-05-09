export const service = (serviceName: string) => {
  // biome-ignore lint: A mixin class must have a constructor with a single rest parameter of type 'any[]'. (ts 2545)
  return function <T extends new (...args: any[]) => object>(constructor: T) {
    return class extends constructor {
      name = `${serviceName}-service`
    }
  }
}
