import { existsSync, cpSync } from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { intro, outro, text, confirm, spinner, isCancel, cancel } from '@clack/prompts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const templateDir = path.resolve(__dirname, '../templates/entrypoint')

async function main() {
  intro('🚀 Create Develit Service Worker CLI')

  const projectName = await text({
    message: 'Enter your project name:',
    // validate: value => (value || 'Project name is required'),
  })

  if (isCancel(projectName)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  const targetDir = path.join(process.cwd(), projectName)
  if (existsSync(targetDir)) {
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

  cpSync(templateDir, targetDir, { recursive: true })

  s.stop('Service Worker scaffolded successfully!')
  outro(`Navigate to ${projectName} and start building! 🚀`)
}

main().catch(console.error)
