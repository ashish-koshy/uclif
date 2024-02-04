import {PrettierProfileType} from '../types/prettier'
import {isTypeScriptWorkspace} from './typescript'
import {ESLintProfileType} from '../types/eslint'
import {isAngularWorkspace} from './angular'
import {isReactWorkspace} from './react'
import {isVueWorkspace} from './vue'

import fs = require('fs-extra')

export const checkIfIgnorePatternsExist = (content: string): boolean => {
  const parsedContent = content?.replace(/\r\n|\r|\n/g, '|')?.split('|')
  return (
    parsedContent?.includes('# uclif-cli ignore patterns start') &&
    parsedContent?.includes('# uclif-cli ignore patterns end')
  )
}

export const isValidLinterProfile = (
  profile: ESLintProfileType,
): boolean => {
  switch (profile) {
  case 'angular':
    return isAngularWorkspace()
  case 'react':
    return isReactWorkspace()
  case 'vue':
    return isVueWorkspace()
  case 'typescript':
    return isTypeScriptWorkspace()
  default:
    return false
  }
}

export const isValidPrettierProfile = (
  profile: PrettierProfileType,
): boolean => {
  switch (profile) {
  case 'prettier':
    return true
  case 'angular':
    return isAngularWorkspace()
  default:
    return false
  }
}

export const generateBase64 = (
  input = '',
): string => {
  if (input)
    return Buffer.from(`${input}`.trim()).toString('base64') || ''
  return ''
}

export const hasCustomGitFolderPath = (): boolean =>
  !fs.existsSync('./.git')
