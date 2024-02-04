
import {PackageLookup} from '../types/npm'
import {nxApplicationExists} from './nx'
import {jsonDefaults} from './json'
import {execute} from './node'

import fs = require('fs-extra');

const getPackageJson = (): Record<string, any> => {
  try {
    return fs.readJsonSync('package.json')
  } catch {
    return {}
  }
}

const setPackageJson = (
  packageJson: Record<string, any>,
): void => {
  try {
    fs.writeJsonSync('package.json', packageJson, jsonDefaults)
  } catch {
    /** Do nothing */
  }
}

/*
 * Probes to check the existence of one specific package
 */
export const packageExists = (name: string): string => {
  try {
    const packageJson = getPackageJson()
    const dependencies = packageJson?.dependencies || {}
    const devDependencies = packageJson?.devDependencies || {}
    const packageVersion: string = dependencies[name] || devDependencies[name] || ''
    return packageVersion
  } catch {
    return ''
  }
}

/*
 * Probes to check the existence of one or more packages
 */
export const packagesExist = (packageTypes: PackageLookup | null): boolean => {
  try {
    let allPackagesExist = 1
    const packageJson = getPackageJson()
    for (const type in packageTypes) {
      if (type) {
        const packages = (packageTypes[type] as string[]) ?? []
        for (const item of packages) {
          const packageList = packageJson[type] ?? ({} as typeof packageJson)
          const packageListed = typeof packageList[item] !== 'undefined'
          const packageInstalled = fs.existsSync(`./node_modules/${item}`)
          const packageExists = packageListed && packageInstalled
          allPackagesExist *= packageExists ? 1 : 0
        }
      }
    }

    return allPackagesExist === 1
  } catch {
    return false
  }
}

export const setCustomPackageJsonObject = (
  key: string,
  object: Record<string, unknown>,
): void => {
  if (!key) return
  const packageJson = getPackageJson() || {}
  if (Object.keys(packageJson).length > 0) {
    !packageJson[key] && (packageJson[key] = {})
    packageJson[key] = {...packageJson[key], ...object}
    setPackageJson(packageJson)
  }
}

export const setStandardPackageScripts = (): void => {
  execute(
    'npm',
    [
      'pkg',
      'set',
      `scripts.test="${'npx nx run-many --target=test --all'}"`,
      `scripts.lint="${'npx nx run-many --target=lint --all'}"`,
      `scripts.build="${'npx nx run-many --target=build --all'}"`,
    ],
  )
}

export const setupProjectScripts = (projectName: string): void => {
  if (!nxApplicationExists(projectName)) return

  execute(
    'npm',
    [
      'pkg',
      'set',
      `scripts.start-${projectName}="${`npx nx serve ${projectName}`}"`,
      `scripts.build-${projectName}="${`npx nx build ${projectName}`}"`,
      `scripts.test-${projectName}="${`npx nx test ${projectName}`}"`,
      `scripts.lint-${projectName}="${`npx nx lint ${projectName}`}"`,
    ],
  )
}
