import { config } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const hasWorkspaces = (packageJsonPath: string) => {
  try {
    const raw = fs.readFileSync(packageJsonPath, 'utf8')
    const parsed = JSON.parse(raw) as { workspaces?: unknown }
    return Boolean(parsed.workspaces)
  } catch {
    return false
  }
}

const findWorkspaceRoot = (startDir: string) => {
  let current = path.resolve(startDir)
  let parent = ''

  while (current !== parent) {
    const packageJsonPath = path.join(current, 'package.json')
    if (fs.existsSync(packageJsonPath) && hasWorkspaces(packageJsonPath)) {
      return current
    }
    parent = current
    current = path.dirname(current)
  }

  return startDir
}

let envLoaded = false
let envPath: string | null = null

export const loadEnv = () => {
  if (envLoaded) {
    return envPath
  }

  const moduleDir = path.dirname(fileURLToPath(import.meta.url))
  const workspaceRoot = findWorkspaceRoot(moduleDir)
  const resolvedEnvPath = path.join(workspaceRoot, '.env')

  config({ path: resolvedEnvPath })

  envLoaded = true
  envPath = resolvedEnvPath
  return envPath
}
