import {staticData} from '../static-data'
import {packageExists} from './npm'
import {clean} from './semver'

import semver = require('semver')
import fs = require('fs-extra')

export const getNxWorkspaceVersion = (): string => {
  const nx = packageExists('@nx/workspace')
  const nrwl = packageExists('@nrwl/workspace')
  return nrwl || nx || staticData.versions.nx
}

export const getNxNamespace = (): string => {
  const version = getNxWorkspaceVersion()
  if (version) {
    const cleanedVersion = clean(version) || ''
    if (semver?.satisfies(cleanedVersion, '<16.0.0')) return '@nrwl'
  }

  return '@nx'
}

export const setCommonNxCommandParams = (
  command: string,
  params: string[],
): string[] => {
  if (command === 'npx') {
    if (params[0] === 'nx' || params[0]?.startsWith('create-nx-workspace'))
      params.push('--interactive=false')

    params = ['--yes', ...params]
  }

  return params || []
}

export const nxApplicationExists = (name = ''): boolean => {
  try {
    const projectJson = fs.readJSONSync(`./apps/${name}/project.json`)
    return name !== '' && (
      projectJson?.name === name ||
      projectJson?.root === `apps/${name}`
    )
  } catch {
    return false
  }
}

export const isValidWorkspace = (): boolean => {
  try {
    return fs.existsSync('./package.json') && fs.existsSync('./nx.json')
  } catch {
    return false
  }
}

export const nxDefaults = {
  namespace: '@nrwl',
  namespaces: ['@nx', '@nrwl'],
  styleType: 'scss',
  styleTypes: ['scss', 'css'],
  uniTestRunner: 'jest',
  uniTestRunners: ['jest', 'none'],
  endToEndTestRunner: 'none',
  endToEndTestRunners: ['cypress', 'none'],
  workspaceType: 'integrated',
  packageManager: 'npm',
  nxCloud: false,
  preset: 'apps',
  environments: ['production', 'development'],
  framework: 'angular',
  frameworks: ['angular', 'vue', 'react', 'typescript'],
  node: {
    framework: 'express',
    frameworks: ['express', 'fastify', 'koa', 'nest', 'none'],
    uniTestRunner: 'jest',
    uniTestRunners: ['jest', 'none'],
    endToEndTestRunner: 'jest',
    endToEndTestRunners: ['jest', 'none'],
    bundler: 'esbuild',
    bundlers: ['esbuild', 'webpack'],
  },
}
