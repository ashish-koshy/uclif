
import {PrettierProfileRecord} from '../types/prettier'
import {nxApplicationExists, nxDefaults} from './nx'
import {ESLintProfileRecord} from '../types/eslint'
import {AngularDefaults} from '../types/angular'
import {packageExists} from './npm'
import {jsonDefaults} from './json'
import {clean} from './semver'

import semver = require('semver')
import fs = require('fs-extra')

export const isAngularWorkspace = (): boolean => {
  return packageExists('@angular/core') !== ''
}

export const getNgMajorVersion = (): string => {
  const version = packageExists('@angular/core')
  return version ?
    `^${semver?.major(clean(version))}.0.0` : ''
}

export const addNgEnvironments = (projectName = ''): void => {
  if (
    !nxApplicationExists(projectName) ||
    fs.existsSync(`./apps/${projectName}/src/environments`)
  ) return

  /** Nx environment generator schematics are unreliable. So this manually creates a file */
  fs.ensureFileSync(`./apps/${projectName}/src/environments/environment.ts`)
  fs.writeFileSync(`./apps/${projectName}/src/environments/environment.ts`,  'export const environment = {}')

  const projectJson = fs.readJSONSync(`./apps/${projectName}/project.json`)
  if (projectJson?.projectType !== 'application') return
  const configurations = new Set(nxDefaults.environments)
  for (const configuration in (projectJson?.targets?.build?.configurations || [])) {
    if (configurations.has(configuration)) {
      const configurationFilePath = `./apps/${projectName}/src/environments/environment.${configuration}.ts`
      if (!fs.existsSync(configurationFilePath)) {
        fs.ensureFileSync(configurationFilePath)
        fs.writeFileSync(configurationFilePath, 'export const environment = {}')
      }

      projectJson
      .targets
      .build
      .configurations[configuration]
      .fileReplacements = [
        {
          replace: `apps/${projectName}/src/environments/environment.ts`,
          with: `apps/${projectName}/src/environments/environment.${configuration}.ts`,
        },
      ]
    }
  }

  fs.writeJSONSync(`./apps/${projectName}/project.json`, projectJson, jsonDefaults)
}

export const getNgAccessibilityTemplateLintRules = (): Record<string, string> => {
  const rules: Record<string, string> = {
    '@angular-eslint/template/accessibility-alt-text': 'error',
    '@angular-eslint/template/accessibility-valid-aria': 'warn',
    '@angular-eslint/template/accessibility-table-scope': 'warn',
    '@angular-eslint/template/accessibility-elements-content': 'warn',
    '@angular-eslint/template/accessibility-label-has-associated-control': 'warn',
  }
  if (semver.major(clean(getNgMajorVersion())) > 15) {
    for (let key in rules) {
      if (key && rules[key]) {
        const value = rules[key]
        delete rules[key]
        key = key.replace('@angular-eslint/template/accessibility-', '@angular-eslint/template/')
        rules[key] = value
      }
    }
  }

  return rules
}

export const getNgEsLintPackages = (): string[] => {
  const packages: string[] = []
  const version = getNgMajorVersion()

  if (version) {
    !packageExists('@angular-eslint/eslint-plugin') &&
    packages.push(`@angular-eslint/eslint-plugin@~${version}`)

    !packageExists('@angular-eslint/template-parser') &&
    packages.push(`@angular-eslint/template-parser@~${version}`)

    !packageExists('@angular-eslint/eslint-plugin-template') &&
    packages.push(`@angular-eslint/eslint-plugin-template@~${version}`)
  }

  return packages
}

const eslintConfig = (): ESLintProfileRecord => {
  return {
    overrides: [
      {
        files: ['*.ts'],
        extends: [
          'plugin:@angular-eslint/recommended',
          'plugin:@angular-eslint/template/process-inline-templates',
        ],
        rules: {
          '@angular-eslint/directive-selector': [
            'error',
            {
              type: 'attribute',
              style: 'camelCase',
            },
          ],
          '@angular-eslint/component-selector': [
            'error',
            {
              type: 'element',
              style: 'kebab-case',
            },
          ],
        },
      },
      {
        files: ['*.html'],
        extends: [
          'plugin:@angular-eslint/template/recommended',
        ],
        rules: getNgAccessibilityTemplateLintRules(),
      },
    ],
    packages: getNgEsLintPackages(),
  }
}

const prettierConfig = (): PrettierProfileRecord => {
  return {
    overrides: [
      {
        files: '*.component.html',
        options: {
          parser: 'angular',
        },
      },
    ],
  }
}

export const angularDefaults: AngularDefaults = {
  eslintConfig,
  prettierConfig,
}

export const schematicsConfig = {
  runner: './node_modules/@angular-devkit/schematics-cli/bin/schematics.js',
  collection: './node_modules/@uclif/ng-schematics/src/collection.json',
}
