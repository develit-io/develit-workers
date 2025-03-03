import type { H3Event } from 'h3'
import { eventHandler } from 'h3'
import type { NitroGuard, OnComplete } from '../types/guard'

export function defineNitroGuard(def: NitroGuard): NitroGuard {
  return def
}

export function defineGuardEventHandler<T>(config: { guards: NitroGuard[] }, onComplete: OnComplete<T>) {
  return eventHandler(async (event: H3Event) => {
    config.guards.forEach(guard => guard(event))
    return onComplete(event)
  })
}
