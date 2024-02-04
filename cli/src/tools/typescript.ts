import {clean} from './semver'
import {packageExists} from './npm'
import {staticData} from '../static-data'
import {getNxWorkspaceVersion} from './nx'
import {computeESLintVersion} from './eslint'
import {ESLintProfileRecord} from '../types/eslint'
import {TypeScriptDefaults} from '../types/typescript'
import {execute} from './node'

import fs = require('fs-extra')
import semver = require('semver')

export const isTypeScriptWorkspace = (): boolean => {
  return packageExists('typescript') !== ''
}

export const getTypeScriptVersion = (): string => {
  return packageExists('typescript') ?? ''
}

export const getTsConfigPath = (
  tsConfigPaths = [
    'tsconfig.json',
    'tsconfig.base.json',
  ],
): string => {
  for (const item of tsConfigPaths)
    if (fs.existsSync(`./${item}`))
      return item
  return ''
}

export const getTsEsLintPackages = (): string[] => {
  const packages: string[] = []

  let eslintVersion = staticData.versions.eslint
  if (!packageExists('eslint')) {
    eslintVersion = computeESLintVersion(eslintVersion)
    console.log('\nSelected eslint version :', eslintVersion)
    packages.push(`eslint@${eslintVersion}`)
  }

  let tsVersion = semver.major(clean(eslintVersion)) > 7 ?
    '^5.0.0' : getTypeScriptVersion()

  if (tsVersion) {
    tsVersion = `^${semver.major(clean(tsVersion))}`

    if (!packageExists('@typescript-eslint/parser')) {
      console.log('\nSelected @typescript-eslint/parser version :', tsVersion)
      packages.push(`@typescript-eslint/parser@${tsVersion}`)
    }

    if (!packageExists('@typescript-eslint/eslint-plugin')) {
      console.log('\nSelected @typescript-eslint/eslint-plugin version :', tsVersion)
      packages.push(`@typescript-eslint/eslint-plugin@${tsVersion}`)
    }

    const nxWorkspaceVersion = getNxWorkspaceVersion()
    const nxMajorVersion = semver.major(clean(nxWorkspaceVersion))
    if (nxMajorVersion > 15 && !packageExists('@nx/eslint-plugin'))
      packages.push(`@nx/eslint-plugin@^${nxMajorVersion}.0.0`)
    else if (!packageExists('@nrwl/eslint-plugin-nx'))
      packages.push(`@nrwl/eslint-plugin-nx@^${nxMajorVersion}.0.0`)
  }

  return packages
}

const eslintConfig = (): ESLintProfileRecord => {
  const tsConfigPath = getTsConfigPath()
  return {
    overrides: [
      {
        files: ['*.ts'],
        parserOptions: {
          createDefaultProgram: true,
          project: [tsConfigPath],
        },
        extends: [
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
          'plugin:@typescript-eslint/recommended-requiring-type-checking',
        ],
        rules: {
          radix: 'warn',
          'no-console': 'error',
          'default-case': 'warn',
          'prefer-const': 'warn',
          'no-fallthrough': 'warn',
          'no-const-assign': 'error',
          'no-return-assign': 'error',
          'no-nested-ternary': 'warn',
          'no-unneeded-ternary': 'warn',
          'prefer-arrow-callback': 'warn',
          '@typescript-eslint/unbound-method': 'off',
          '@typescript-eslint/no-unused-vars': 'off',
          '@typescript-eslint/no-this-alias': 'error',
          '@typescript-eslint/no-unsafe-return': 'warn',
          '@typescript-eslint/no-explicit-any': 'error',
          '@typescript-eslint/no-floating-promises': 'off',
          '@typescript-eslint/no-unsafe-assignment': 'off',
          '@typescript-eslint/no-use-before-define': 'error',
          '@typescript-eslint/no-unsafe-member-access': 'warn',
        },
      },
      {
        files: ['*.tsx'],
        parser: '@babel/eslint-parser',
        parserOptions: {
          sourceType: 'module',
          allowImportExportEverywhere: true,
          project: [tsConfigPath],
        },
      },
    ],
    packages: getTsEsLintPackages(),
  }
}

export const initializeTsWorkspace = (): void => {
  if (!packageExists('@nx/js')) {
    execute(
      'npm',
      [
        'install',
        '--save-dev',
        '@nx/js',
      ],
    )
  }

  if (!fs.existsSync('./tsconfig.base.json')) {
    execute(
      'npx',
      [
        'nx',
        'g',
        '@nx/js:init',
      ],
    )
  }
}

export const typescriptDefaults: TypeScriptDefaults = {
  eslintConfig,
}
