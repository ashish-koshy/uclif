import {
  isValidWorkspace,
  getNxNamespace,
  getNxWorkspaceVersion,
} from '../../../tools/nx'
import {BaseCommand} from '../../../base/command'
import {messages} from '../../../tools/messages'
import {packageExists} from '../../../tools/npm'
import {PackageLookup} from '../../../types/npm'

import {initializeTsWorkspace} from '../../../tools/typescript'
import {clean} from '../../../tools/semver'
import {execute} from '../../../tools/node'
import {Flags} from '@oclif/core'

import semver = require('semver')

export default class AddReactPackages extends BaseCommand<typeof AddReactPackages> {
  static package = 'Nx React'
  static version: string | undefined | null = null
  static dependencies: PackageLookup | null = null

  static description = `Add ${AddReactPackages.package} packages to an existing Nx workspace.`;

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    hybrid: Flags.string({
      default: 'false',
      description: 'Set this flag to add Nx React Native extension.',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AddReactPackages)
    const hybridEnabled = flags.hybrid === 'true'

    if (!isValidWorkspace()) {
      this.log(messages.invalidWorkspace())
      return
    }

    const nxNamespace = getNxNamespace()
    AddReactPackages.version = getNxWorkspaceVersion()
    const nxMajorVersion = semver.major(clean(AddReactPackages.version))

    initializeTsWorkspace()

    if (!packageExists(`${nxNamespace}/react`)) {
      this.log(`\nPlease wait, installing\n${AddReactPackages.package}`)
      execute(
        'npm',
        [
          'install',
          '--save-exact',
          '@babel/eslint-parser',
          `${nxNamespace}/react@^${nxMajorVersion}.0.0`,
        ],
      )

      if (hybridEnabled && !packageExists(`${nxNamespace}/react-native`)) {
        this.log('\nPlease wait, installing Nx React Native extension...')
        execute(
          'npm',
          [
            'install',
            '--save-dev',
            '--save-exact',
            `${nxNamespace}/react-native@^${nxMajorVersion}.0.0`,
          ],
        )
      }
    }

    if (packageExists(`${nxNamespace}/react`))
      this.log(`\n${AddReactPackages.package}\nhas been setup...`)

    if (hybridEnabled && packageExists(`${nxNamespace}/react-native`))
      this.log(`\n${AddReactPackages.package} Native\nhas been setup...`)
  }
}
