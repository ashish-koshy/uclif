import {
  getNxWorkspaceVersion,
  isValidWorkspace,
  getNxNamespace,
} from '../../../tools/nx'
import {initializeTsWorkspace} from '../../../tools/typescript'
import {BaseCommand} from '../../../base/command'
import {messages} from '../../../tools/messages'
import {packagesExist} from '../../../tools/npm'
import {PackageLookup} from '../../../types/npm'
import {clean} from '../../../tools/semver'
import {execute} from '../../../tools/node'

import {Flags} from '@oclif/core'

import semver = require('semver')

export default class AddNgPackages extends BaseCommand<typeof AddNgPackages> {
  static package = 'Nx Angular'
  static version: string | undefined | null = null
  static dependencies: PackageLookup | null = null

  static description = `Add ${AddNgPackages.package} packages to an existing Nx workspace.`;

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    hybrid: Flags.string({
      default: 'false',
      description: 'Set this flag to add Nx Ionic Angular extension.',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AddNgPackages)

    if (!isValidWorkspace()) {
      this.log(messages.invalidWorkspace())
      return
    }

    const nxNamespace = getNxNamespace()
    AddNgPackages.dependencies = {
      dependencies: [
        `${nxNamespace}/angular`,
      ],
      devDependencies: [
        '@angular-devkit/core',
      ],
    }

    AddNgPackages.version = getNxWorkspaceVersion()
    const ngMajorVersion = semver.major(clean(AddNgPackages.version))

    if (flags?.hybrid === 'true' && ngMajorVersion >= 14)
      AddNgPackages
      .dependencies
      ?.devDependencies
      ?.push('@nxext/ionic-angular')

    initializeTsWorkspace()

    if (!packagesExist(AddNgPackages.dependencies)) {
      this.log(`\nPlease wait, installing\n${AddNgPackages.package}`)
      execute(
        'npm',
        [
          'install',
          '--save-exact',
          `${nxNamespace}/angular@${AddNgPackages.version}`,
        ],
      )

      const ngVersion = `${ngMajorVersion}.0.0`
      execute(
        'npm',
        [
          'install',
          '--save-dev',
          `@angular-devkit/core@~${ngVersion}`,
          `@angular-devkit/schematics@~${ngVersion}`,
          `@schematics/angular@~${ngVersion}`,
        ],
      )

      if (AddNgPackages.dependencies?.devDependencies?.includes('@nxext/ionic-angular')) {
        this.log('\nPlease wait, installing Nx Angular Ionic extension...')
        execute(
          'npm',
          [
            'install',
            '--save-dev',
            '--save-exact',
            `@nxext/ionic-angular@^${ngMajorVersion}`,
          ],
        )
      }

      if (packagesExist(AddNgPackages.dependencies))
        this.log(`\n${AddNgPackages.package}\nhas been setup...`)
    }
  }
}
