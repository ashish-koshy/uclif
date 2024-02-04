import {jsonDefaults} from './json'
import {VSCodeSettings} from '../types/vscode'

import fs = require('fs-extra')

export const getVSCodeSettingsPath = (): string => {
  const VSCodeSettingsFilePath = './.vscode/settings.json'
  if (fs.existsSync(VSCodeSettingsFilePath)) return VSCodeSettingsFilePath
  fs.ensureFileSync(VSCodeSettingsFilePath)
  fs.writeJSONSync(VSCodeSettingsFilePath, vsCodeDefaults)
  return VSCodeSettingsFilePath
}

export const getVSCodeSettings = (): VSCodeSettings => {
  return fs.readJSONSync(getVSCodeSettingsPath())
}

export const setVSCodeSettings = (settings: VSCodeSettings): void => {
  settings && fs.writeJsonSync(getVSCodeSettingsPath(), settings, jsonDefaults)
}

export const vsCodeDefaults = {
  'files.exclude': {
    '**/.git': true,
    '**/.svn': true,
    '**/.hg': true,
    '**/CVS': true,
    '**/.DS_Store': true,
  },
  'search.exclude': {
    '**/node_modules/**': true,
    '**/.angular/**': true,
    '**/.vscode/**': true,
    '**/.husky/**': true,
    '**/dist/**': true,
  },
  'files.watcherExclude': {
    '**/node_modules/*/**': true,
    '**/.git/subtree-cache/**': true,
    '**/.git/objects/**': true,
  },
  'editor.codeActionsOnSave': {},
  '[typescript]': {},
  '[html]': {},
  '[scss]': {},
} as VSCodeSettings
