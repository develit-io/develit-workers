import * as fs from 'fs/promises'
import * as path from 'path'
import * as url from 'url'
import { exec } from 'child_process'
import { promisify } from 'util'
import { intro, outro, text, confirm, spinner, isCancel, cancel } from '@clack/prompts'
import { capitalize, replaceTemplateContent } from './utils'

const execAsync = promisify(exec)

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const __templateDir = path.resolve(__dirname, '../templates/entrypoint')

async function main() {
  intro('🚀 Create Develit Service Worker CLI')

  const targetDirName = await text({
    message: 'Enter service worker (folder) name:',
    defaultValue: 'template',
  })

  const packageName = await text({
    message: 'Enter package name',
    defaultValue: targetDirName.toString(),
  })

  if (isCancel(targetDirName) || isCancel(packageName)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  const workerClassName = capitalize(targetDirName.toString())
  const __targetDir = path.join(process.cwd(), targetDirName)

  try {
    await fs.access(__targetDir) // Check if the directory exists
    const overwrite = await confirm({
      message: 'Target directory already exists. Overwrite?',
    })
    if (!overwrite) {
      outro('Operation cancelled.')
      return
    }
    else
      await fs.rm(__targetDir, { recursive: true })
  }
  catch {
  //   When folder does not exist access throws error which in this case means we can generate the project
  }

  const copyTemplateSpinner = spinner()
  try {
    copyTemplateSpinner.start('Creating new Service Worker...')

    await fs.cp(__templateDir, __targetDir, { recursive: true })
    await replaceTemplateContent(targetDirName, workerClassName, packageName.toString())

    copyTemplateSpinner.stop(`${workerClassName} Worker created successfully!`)
    const installDeps = await confirm({
      message: 'Install dependencies... ?',
    })

    if (installDeps) {
      const installSpinner = spinner()
      installSpinner.start('Installing dependencies...')

      try {
        await execAsync('pnpm install', { cwd: __targetDir }) // Run npm install inside the new directory
        installSpinner.stop('Dependencies installed successfully!')
      }
      catch (error) {
        installSpinner.stop('Failed to install dependencies.')
        console.error(error)
      }
    }

    outro(`Navigate to ${targetDirName} and start building! 🚀`)
  }
  catch (error) {
    copyTemplateSpinner.stop('Failed to create Service Worker.')
    console.error(error)
  }
}

main().catch(console.error)
