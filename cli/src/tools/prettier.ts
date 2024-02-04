import {
  PrettierProfileRecord,
  PrettierDefaults,
  PrettierOverride,
  PrettierProfile,
  PrettierConfig,
} from '../types/prettier'
import {checkIfIgnorePatternsExist} from './misc'
import {computeESLintVersion} from './eslint'
import {angularDefaults} from './angular'
import {staticData} from '../static-data'
import {packageExists} from './npm'
import {jsonDefaults} from './json'
import {clean} from './semver'

import fs = require('fs-extra')
import semver = require('semver')

export const setPrettierIgnorePatterns = (
  prettierIgnorePath = './.prettierignore',
): void => {
  if (!fs.existsSync(prettierIgnorePath))
    fs.ensureFileSync(prettierIgnorePath)
  const ignorePatterns = fs.readFileSync(prettierIgnorePath, 'utf-8')
  !checkIfIgnorePatternsExist(ignorePatterns) &&
        fs.appendFileSync(
          prettierIgnorePath,
          staticData.lintFormatIgnorePatterns.join('\n'),
        )
}

export const getPrettierConfigPath = (
  prettierConfigPath = './.prettierrc',
): string =>  {
  if (fs.existsSync(prettierConfigPath)) return prettierConfigPath
  const prettierConfigJsonFilePath = `${prettierConfigPath}.json`
  if (fs.existsSync(prettierConfigJsonFilePath)) return prettierConfigJsonFilePath
  fs.ensureFileSync(prettierConfigJsonFilePath)
  fs.writeJSONSync(prettierConfigJsonFilePath, prettierDefaults.commonConfig(), jsonDefaults)
  return prettierConfigJsonFilePath
}

export const getPrettierConfiguration = (): PrettierConfig => {
  const prettierConfigPath = getPrettierConfigPath()
  const config = prettierConfigPath.endsWith('.json') ?
    fs.readJSONSync(prettierConfigPath) :
    JSON.parse(fs.readFileSync(prettierConfigPath, 'utf-8') || '{}')
  return config
}

export const setPrettierConfiguration = (
  configuration: PrettierConfig,
): void => {
  if (configuration) {
    const prettierConfigPath = getPrettierConfigPath()
    prettierConfigPath.endsWith('.json') ?
      fs.writeJSONSync(prettierConfigPath, configuration, jsonDefaults) :
      fs.writeFileSync(prettierConfigPath, JSON.stringify(configuration, null, 4), 'utf-8')
  }
}

export const getPrettierPackages = (): string[] => {
  const packages: string[] = []

  if (!packageExists('prettier')) {
    let prettierVersion = staticData.versions.prettier
    console.log('\nSelected Prettier version :', prettierVersion)
    prettierVersion = `${semver.major(clean(prettierVersion))}`
    packages.push(`prettier@^${prettierVersion}`)
  }

  if (!packageExists('eslint-config-prettier')) {
    let eslintVersion = packageExists('eslint')
    !eslintVersion && (eslintVersion = staticData.versions.eslint)
    eslintVersion = computeESLintVersion(eslintVersion)
    console.log('\nSelected eslint-config-prettier version :', eslintVersion)
    const eslintConfigPrettierVersion = semver.major(clean(eslintVersion))
    packages.push(`eslint-config-prettier@~${eslintConfigPrettierVersion}`)
  }

  return packages
}

export const mergeOptions = (
  entry: PrettierOverride,
  newEntry: PrettierOverride,
): void => {
  entry.options = {
    ...entry?.options,
    ...newEntry?.options,
  }
}

const commonConfig = (): PrettierConfig => {
  return {
    semi: true,
    tabWidth: 4,
    useTabs: false,
    printWidth: 80,
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    overrides: [],
  }
}

const prettier = (): PrettierProfileRecord => {
  return {
    overrides: [
      {
        files: '*.html',
        options: {
          parser: 'html',
        },
      },
    ],
    packages: getPrettierPackages(),
  }
}

const profiles = (): PrettierProfile => {
  return {
    prettier: prettier,
    angular: angularDefaults.prettierConfig,
  }
}

export const prettierDefaults: PrettierDefaults = {
  commonConfig,
  profiles,
}
