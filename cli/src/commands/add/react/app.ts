import {getNxNamespace, isValidWorkspace, nxDefaults} from '../../../tools/nx'
import {packageExists, setupProjectScripts} from '../../../tools/npm'
import {describeCommandFlag} from '../../../tools/oclif'
import {BaseCommand} from '../../../base/command'
import {PackageLookup} from '../../../types/npm'
import {messages} from '../../../tools/messages'
import {prompt} from '../../../tools/prompt'
import {execute} from '../../../tools/node'
import {Flags} from '@oclif/core'

export default class AddReactApp extends BaseCommand<typeof AddReactApp> {
  static description = 'Add new React applications to an existing Nx workspace.'
  static dependencies: PackageLookup | null = null

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    hybridAppName: Flags.string({
      default: '',
      description: "Name for 'React Native' application in 'kebab-case'",
    }),
    hostAppName: Flags.string({
      default: '',
      description: "Name for 'host' application in 'kebab-case'",
    }),
    remoteAppName: Flags.string({
      default: '',
      description: "Name for 'remote' application in 'kebab-case'. Comma separated for multiple entries",
    }),
    libraryName: Flags.string({
      default: '',
      description: "Name for React 'library' in 'kebab-case'. Comma separated for multiple entries",
    }),
    regularAppName: Flags.string({
      default: '',
      description: "Name for 'regular' React application in 'kebab-case'",
    }),
    styleType: Flags.string({
      default: nxDefaults.styleType,
      description: `Available style types ${describeCommandFlag(nxDefaults.styleTypes)}`,
    }),
    unitTestRunner: Flags.string({
      default: nxDefaults.uniTestRunner,
      description: `Available unit test runners ${describeCommandFlag(nxDefaults.uniTestRunners)}`,
    }),
    endToEndTestRunner: Flags.string({
      default: nxDefaults.endToEndTestRunner,
      description: `Available end to end test runners ${describeCommandFlag(nxDefaults.endToEndTestRunners)}`,
    }),
  }

  static args = {}

  public async run(): Promise<void> {
    const {flags} = await this.parse(AddReactApp)

    if (!isValidWorkspace()) {
      this.log(messages.invalidWorkspace())
      return
    }

    const nxNamespace = getNxNamespace()

    AddReactApp.dependencies = {
      dependencies: [
        `${nxNamespace}/react`,
      ],
      devDependencies: flags?.hybridAppName ?
        [`${nxNamespace}/react-native`] : [],
    }

    if (!packageExists(`${nxNamespace}/react`)) {
      this.log(messages.missingDependencies(AddReactApp.dependencies, 'uclif add:react:packages --help'))
      return
    }

    this.log(messages.whatIsAHostApp())
    const hostAppName = await prompt.hostAppName(this, flags?.hostAppName)
    if (hostAppName) {
      execute(
        'npx',
        [
          'nx',
          'g',
          `${nxNamespace}/react:host`,
          `--name=${hostAppName}`,
          `--style=${flags.styleType}`,
          `--unitTestRunner=${flags.unitTestRunner}`,
          `--e2eTestRunner=${flags.endToEndTestRunner}`,
        ],
      )
      setupProjectScripts(hostAppName)
    }

    this.log(messages.whatIsARemoteApp())
    const remoteAppName = await prompt.remoteAppName(this, flags?.remoteAppName)
    const remotes = remoteAppName.split(',').map(item => item.trim()).filter(item => item)
    if (remotes.length > 0) {
      for (const remote of remotes) {
        if (remote) {
          this.log(`\nPlease wait, setting up remote application : ${remote}...`)
          execute(
            'npx',
            [
              'nx',
              'g',
              `${nxNamespace}/react:remote`,
              `--name=${remote}`,
              `--style=${flags.styleType}`,
              `--unitTestRunner=${flags.unitTestRunner}`,
              `--e2eTestRunner=${flags.endToEndTestRunner}`,
            ],
          )
          setupProjectScripts(remote)
        }
      }
    }

    const regularAppName = await prompt.regularAppName(this, flags?.regularAppName)
    if (regularAppName) {
      execute(
        'npx',
        [
          'nx',
          'g',
          `${nxNamespace}/react:application`,
          `--name=${regularAppName}`,
          `--style=${flags.styleType}`,
          `--unitTestRunner=${flags.unitTestRunner}`,
          `--e2eTestRunner=${flags.endToEndTestRunner}`,
          '--routing',
        ],
      )
      setupProjectScripts(regularAppName)
    }

    const hybridAppName = await prompt.hybridAppName(this, flags?.hybridAppName)
    if (hybridAppName && AddReactApp.dependencies?.devDependencies?.includes(`${nxNamespace}/react-native`)) {
      execute(
        'npx',
        [
          'nx',
          'g',
          `${nxNamespace}/react-native:application`,
          `--name=${hybridAppName}`,
          '--template=blank',
          `--unitTestRunner=${flags.unitTestRunner}`,
          `--e2eTestRunner=${flags.endToEndTestRunner}`,
        ],
      )
      setupProjectScripts(hybridAppName)
    }

    const libraryName = await prompt.libraryName(this, flags?.libraryName)
    const libraries = libraryName.split(',').map(item => item.trim()).filter(item => item)
    if (libraries.length > 0) {
      for (const library of libraries) {
        if (library) {
          this.log(`\nPlease wait, setting up library - ${library}...`)
          execute(
            'npx',
            [
              'nx',
              'g',
              `${nxNamespace}/react:lib`,
              `--name=shared/${library}`,
              `--unitTestRunner=${flags.unitTestRunner}`,
            ],
          )
        }
      }
    }
  }
}
