import { defineCommand, runMain } from 'citty'
import { createWorkerCommand } from './commands/create-worker'

const main = defineCommand({
  meta: {
    name: 'dvl',
    description: 'Develit CLI - Manage Service Workers',
  },
  subCommands: {
    'create-worker': createWorkerCommand,
  },
})

runMain(main)
