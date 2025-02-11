import * as fs from 'fs'
import * as path from 'path'

function replaceContent(filepath: string, replacer: (content: string) => string) {
  const content = fs.readFileSync(filepath, 'utf8')
  fs.writeFileSync(filepath, replacer(content))
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const replaceTemplateWithWorkerName = (rootDir: string) => {
  const entryPath = path.resolve(rootDir, 'src/main.ts')
  const entryTypesPath = path.resolve(rootDir, '@types/index.ts')
  replaceContent(entryPath, content => content.replace('class TemplateService', `class ${capitalize(rootDir)}Service`))
  replaceContent(entryTypesPath, content => content.replaceAll('Template', capitalize(rootDir)))
}
