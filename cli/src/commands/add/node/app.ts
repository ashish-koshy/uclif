import {Flags} from '@oclif/core'
import {BaseCommand} from '../../../base/command'
import {getNxNamespace, nxDefaults} from '../../../tools/nx'
import {describeCommandFlag} from '../../../tools/oclif'
import {packagesExist, setupProjectScripts} from '../../../tools/npm'
import {messages} from '../../../tools/messages'
import {PackageLookup} from '../../../types/npm'
import {prompt} from '../../../tools/prompt'
import {execute} from '../../../tools/node'

const nxNodeDefaults = nxDefaults.node

export default class AddNodeApp extends BaseCommand<typeof AddNodeApp> {
  static dependencies: PackageLookup | null = null
  static description = 'Add a basic NodeJS + Express application that uses TypeScript'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    name: Flags.string({
      default: '',
      description: 'Name of you NodeJS application',
    }),
    port: Flags.string({
      default: '3000',
      description: 'The port which the server will be run on',
    }),
    framework: Flags.string({
      default: nxNodeDefaults.framework,
      description: `Available node frameworks ${describeCommandFlag(nxNodeDefaults.frameworks)}`,
    }),
    unitTestRunner: Flags.string({
      default: nxNodeDefaults.uniTestRunner,
      description: `Available unit test runners ${describeCommandFlag(nxNodeDefaults.uniTestRunners)}`,
    }),
    endToEndTestRunner: Flags.string({
      default: nxNodeDefaults.endToEndTestRunner,
      description: `Available end to end test runners ${describeCommandFlag(nxNodeDefaults.endToEndTestRunners)}`,
    }),
    bundler: Flags.string({
      default: nxNodeDefaults.bundler,
      description: `Available bundlers ${describeCommandFlag(nxNodeDefaults.bundlers)}`,
    }),
    frontendProject: Flags.string({
      default: '',
      description: 'Frontend project that needs to access this application. This sets up proxy configuration.',
    }),
  }

  static args = {}

  public async run(): Promise<void> {
    const {flags} = await this.parse(AddNodeApp)

    const nxNamespace = getNxNamespace()

    AddNodeApp.dependencies = {
      dependencies: [
        `${nxNamespace}/node`,
      ],
    }

    if (!packagesExist(AddNodeApp.dependencies)) {
      this.log(messages.missingDependencies(AddNodeApp.dependencies, 'uclif add:node:app --help'))
      return
    }

    const nodeAppName = await prompt.nodeAppName(this, flags?.name)
    if (nodeAppName) {
      execute(
        'npx',
        [
          'nx',
          'g',
          `${nxNamespace}/node:application`,
          `--name=${nodeAppName}`,
          `--port=${flags?.port}`,
          `--bundler=${flags?.bundler}`,
          `--framework=${flags?.framework}`,
          `--frontendProject=${flags?.frontendProject}`,
          `--unitTestRunner=${flags?.unitTestRunner}`,
          `--endToEndTestRunner=${flags?.endToEndTestRunner}`,
        ],
      )
      setupProjectScripts(nodeAppName)
    }
  }
}
