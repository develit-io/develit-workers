import * as fs from 'fs/promises'
import * as path from 'path'
import { defineCommand } from 'citty'
import * as p from '@clack/prompts'
import { capitalize, replaceTemplateContent, execAsync } from '../utils'

const __templateDir = path.resolve(process.cwd(), 'templates/entrypoint')

export const createWorkerCommand = defineCommand({
  meta: {
    name: 'create-worker',
    description: 'Create a new Develit Service Worker',
  },
  async run() {
    p.intro('🚀 Create Develit Service Worker CLI')

    const responses = await p.group(
      {
        targetDirName: () => p.text({
          message: 'Enter service worker (folder) name:',
          defaultValue: 'template',
        }),
        packageName: ({ results }) => p.text({
          message: 'Enter package name',
          defaultValue: results.targetDirName,
        }),
      },
      {
        onCancel: () => {
          p.cancel('Operation cancelled.')
          process.exit(0)
        },
      },
    )

    const { targetDirName, packageName } = responses

    const workerClassName = capitalize(targetDirName)
    const __targetDir = path.join(process.cwd(), targetDirName)

    await fs.access(__targetDir)
    const overwrite = await p.confirm({
      message: 'Target directory already exists. Overwrite?',
    })
    if (!overwrite) {
      p.outro('Operation cancelled.')
      return
    }
    await fs.rm(__targetDir, { recursive: true })

    const copyTemplateSpinner = p.spinner()
    try {
      copyTemplateSpinner.start('Creating new Service Worker...')

      await fs.cp(__templateDir, __targetDir, { recursive: true })
      await replaceTemplateContent(targetDirName, workerClassName, packageName as string)

      copyTemplateSpinner.stop(`${workerClassName} Worker created successfully!`)

      const installDeps = await p.confirm({
        message: 'Install dependencies ? ',
      })

      if (installDeps) {
        try {
          await p.tasks([
            {
              title: 'Installing dependencies via pnpm...',
              task: async (_) => {
                await execAsync('pnpm install', { cwd: __targetDir })
                return 'Installed dependencies via pnpm'
              },
            },
          ])
        }
        catch (error) {
          p.log.error(`${error}`)
          p.outro('Operation failed.')
        }
      }

      p.outro(`Navigate to ${targetDirName} and start building! 🚀`)
    }
    catch (error) {
      copyTemplateSpinner.stop('Failed to create Service Worker.')
      p.log.error(`${error}`)
    }
  },
})
