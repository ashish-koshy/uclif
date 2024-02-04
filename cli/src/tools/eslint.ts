import {
  ESLintConfig,
  ESLintDefaults,
  ESLintOverride,
  ESLintProfile,
} from '../types/eslint'
import {angularDefaults, getNgMajorVersion, isAngularWorkspace} from './angular'
import {checkIfIgnorePatternsExist} from './misc'
import {typescriptDefaults} from './typescript'
import {getTsConfigPath} from './typescript'
import {staticData} from '../static-data'
import {jsonDefaults} from './json'
import {clean} from './semver'

import fs = require('fs-extra')
import semver = require('semver')

export const setEsLintIgnorePatterns = (
  esLintIgnorePath = './.eslintignore',
): void => {
  if (!fs.existsSync(esLintIgnorePath)) fs.ensureFileSync(esLintIgnorePath)
  const ignorePatterns = fs.readFileSync(esLintIgnorePath, 'utf-8')
  !checkIfIgnorePatternsExist(ignorePatterns) &&
  fs.appendFileSync(esLintIgnorePath, staticData.lintFormatIgnorePatterns.join('\n'))
}

export const getEsLintConfigPath = (
  esLintConfigPath = './.eslintrc',
): string => {
  if (fs.existsSync(esLintConfigPath)) return esLintConfigPath
  const esLintConfigJsonFilePath = `${esLintConfigPath}.json`
  if (fs.existsSync(esLintConfigJsonFilePath)) return esLintConfigJsonFilePath
  fs.ensureFileSync(esLintConfigJsonFilePath)
  fs.writeJSONSync(esLintConfigJsonFilePath, eslintDefaults.commonConfig(), jsonDefaults)
  return esLintConfigJsonFilePath
}

export const getEsLintConfiguration = (): ESLintConfig => {
  const esLintInfoConfigPath = getEsLintConfigPath()
  const config = esLintInfoConfigPath.endsWith('.json') ?
    fs.readJSONSync(esLintInfoConfigPath) :
    JSON.parse(fs.readFileSync(esLintInfoConfigPath, 'utf-8') || '{}')
  return config
}

export const setESLintConfiguration = (configuration: ESLintConfig): void => {
  if (configuration) {
    const esLintInfoConfigPath = getEsLintConfigPath()
    esLintInfoConfigPath.endsWith('.json') ?
      fs.writeJSONSync(esLintInfoConfigPath, configuration, jsonDefaults) :
      fs.writeFileSync(esLintInfoConfigPath, JSON.stringify(configuration, null, 4), 'utf-8')
  }
}

export const setParserOptions = (entry: ESLintOverride): void => {
  if (entry?.files?.includes('*.ts') && !entry?.parserOptions) {
    entry.parserOptions = {
      createDefaultProgram: true,
      project: [getTsConfigPath()],
    }
  }
}

export const mergeExtensions = (
  entry: ESLintOverride,
  newEntry: ESLintOverride,
): void => {
  const extensions = new Set([
    ...(entry?.extends || []),
    ...(newEntry?.extends || []),
  ])
  entry.extends = [...extensions]
}

export const mergeRules = (
  entry: ESLintOverride,
  newEntry: ESLintOverride,
): void => {
  entry.rules = {
    ...entry?.rules,
    ...newEntry?.rules,
  }
}

const commonConfig = (): ESLintConfig => {
  return {
    root: true,
    overrides: [],
    ignorePatterns: [],
    parserOptions: {
      ecmaVersion: 'latest',
    },
  }
}

const profiles = (): ESLintProfile => {
  return {
    angular: angularDefaults.eslintConfig,
    typescript: typescriptDefaults.eslintConfig,
  }
}

export const eslintDefaults : ESLintDefaults = {
  commonConfig,
  profiles,
}

export const computeESLintVersion = (version: string): string => {
  if (isAngularWorkspace()) {
    const ngMajorVersion = semver.major(clean(getNgMajorVersion()))
    return ngMajorVersion < 14 ? '^7.0.0' : version
  }

  return version
}

