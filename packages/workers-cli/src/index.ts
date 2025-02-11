import * as fs from 'fs'
import * as path from 'path'
import * as url from 'url'
import { intro, outro, text, confirm, spinner, isCancel, cancel } from '@clack/prompts'
import { replaceTemplateWithWorkerName } from './utils'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const templateDir = path.resolve(__dirname, '../templates/entrypoint')

async function main() {
  intro('🚀 Create Develit Service Worker CLI')

  const workerName = await text({
    message: 'Enter service worker (folder) name:',
  })

  if (isCancel(workerName)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  const targetDir = path.join(process.cwd(), workerName)
  if (fs.existsSync(targetDir)) {
    const overwrite = await confirm({
      message: 'Target directory already exists. Overwrite?',
    })
    if (!overwrite) {
      outro('Operation cancelled.')
      return
    }
  }

  const s = spinner()
  s.start('Create new Service Worker...')

  fs.cpSync(templateDir, targetDir, { recursive: true })

  replaceTemplateWithWorkerName(workerName)

  s.stop('Service Worker created successfully!')
  outro(`Navigate to ${workerName} and start building! 🚀`)
}

main().catch(console.error)
