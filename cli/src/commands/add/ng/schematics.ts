import {Flags} from '@oclif/core'

import {execute} from '../../../tools/node'
import {staticData} from '../../../static-data'
import {packageExists} from '../../../tools/npm'
import {BaseCommand} from '../../../base/command'
import {cliMajorVersion} from '../../../tools/oclif'
import {schematicsConfig} from '../../../tools/angular'
import {clean, validatePackageVersion} from '../../../tools/semver'

import semver = require('semver')

export default class AddNgSchematics extends BaseCommand<typeof AddNgSchematics> {
  static package = 'Uclif Schematics'
  static description = `Add ${AddNgSchematics.package} for generating Angular code.`
  static version: string | undefined | null = null
  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    version: Flags.string({
      char: 'v',
      default: '',
      description: `Overrides default version for ${AddNgSchematics.package} package supported by this CLI.`,
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AddNgSchematics)

    if (!packageExists('@angular-devkit/core')) {
      const ngVersion = packageExists('@angular/core') || staticData.versions.nx
      const ngMajorVersion = semver.major(clean(ngVersion))
      this.log(`\nPlease wait, installing\n@angular-devkit/core@^${ngMajorVersion}.0.0`)
      execute(
        'npm',
        [
          'install',
          '--save-dev',
          `@angular-devkit/core@^${ngMajorVersion}.0.0`,
        ],
      )
    }

    AddNgSchematics.version = validatePackageVersion(flags?.version, cliMajorVersion(this))
    this.log(`\nPlease wait, installing\n${AddNgSchematics.package} package.`)

    execute(
      'npm',
      [
        'install',
        '--save-dev',
        `@uclif/ng-schematics@^${AddNgSchematics.version}`,
      ],
    )

    if (packageExists('@uclif/ng-schematics')) {
      this.log(`\n${AddNgSchematics.package} package\nhas been installed...`)
      execute(
        'npm',
        [
          'pkg',
          'set',
          `scripts.schematic="${(`node ${schematicsConfig.runner}`).trim()}"`,
        ],
      )
    }
  }
}
