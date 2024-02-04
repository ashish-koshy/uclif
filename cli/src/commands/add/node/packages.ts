import {
  isValidWorkspace,
  getNxNamespace,
  getNxWorkspaceVersion,
} from '../../../tools/nx'
import {BaseCommand} from '../../../base/command'
import {messages} from '../../../tools/messages'
import {packagesExist} from '../../../tools/npm'
import {PackageLookup} from '../../../types/npm'
import {execute} from '../../../tools/node'

export default class AddNodePackages extends BaseCommand<typeof AddNodePackages> {
  static package = 'Nx Node'
  static version: string | undefined | null = null
  static dependencies: PackageLookup | null = null

  static description = `Add ${AddNodePackages.package} packages to an existing Nx workspace.`;

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {}

  public async run(): Promise<void> {
    if (!isValidWorkspace()) {
      this.log(messages.invalidWorkspace())
      return
    }

    const nxNamespace = getNxNamespace()
    AddNodePackages.dependencies = {
      dependencies: [
        `${nxNamespace}/node`,
      ],
    }

    AddNodePackages.version = getNxWorkspaceVersion()

    if (!packagesExist(AddNodePackages.dependencies)) {
      this.log(`\nPlease wait, installing\n${AddNodePackages.package}`)
      execute(
        'npm',
        [
          'install',
          `${nxNamespace}/node@${AddNodePackages.version}`,
        ],
      )

      if (packagesExist(AddNodePackages.dependencies))
        this.log(`\n${AddNodePackages.package}\nhas been setup...`)
    }
  }
}
