import {Flags} from '@oclif/core'

import {execute} from '../../../tools/node'
import {PackageLookup} from '../../../types/npm'
import {messages} from '../../../tools/messages'
import {BaseCommand} from '../../../base/command'
import {cliMajorVersion} from '../../../tools/oclif'
import {getNxWorkspaceVersion} from '../../../tools/nx'
import {packageExists, packagesExist} from '../../../tools/npm'
import {clean, validatePackageVersion} from '../../../tools/semver'

import semver = require('semver')

export default class AddNgCore extends BaseCommand<typeof AddNgCore> {
  static package = 'Uclif Core'
  static description = `Add ${AddNgCore.package} package to import commonly used Angular modules.`
  static version: string | undefined | null = null
  static dependencies: PackageLookup = {
    dependencies: [
      '@angular/core',
      '@angular/common',
    ],
  }

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    version: Flags.string({
      char: 'v',
      default: '',
      description: `Overrides default version for ${AddNgCore.package} package supported by this CLI.`,
    }),
  }

  static args = {}

  public async run(): Promise<void> {
    const nxMajorVersion = semver.major(clean(getNxWorkspaceVersion()))
    if (nxMajorVersion < 14) return

    const {flags} = await this.parse(AddNgCore)

    if (!packagesExist(AddNgCore.dependencies)) {
      this.log(
        messages.missingDependencies(
          AddNgCore.dependencies,
          `npm i @angular/core@^${nxMajorVersion}.0.0`,
          `npm i @angular/common@^${nxMajorVersion}.0.0`,
        ),
      )
      return
    }

    AddNgCore.version = validatePackageVersion(flags?.version, cliMajorVersion(this))

    this.log(`\nPlease wait, installing\n${AddNgCore.package} package.`)

    execute(
      'npm',
      [
        'install',
        `@uclif/ng-core@^${AddNgCore.version}`,
      ],
    )

    if (packageExists('@uclif/ng-core'))
      this.log(`\n${AddNgCore.package}\nhas been installed...`)
  }
}
