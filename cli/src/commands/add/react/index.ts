import {isValidWorkspace} from '../../../tools/nx'
import {BaseCommand} from '../../../base/command'
import {messages} from '../../../tools/messages'
import {formatFlags} from '../../../tools/oclif'
import {Flags} from '@oclif/core'
import AddReactApp from './app'

export default class AddReact extends BaseCommand<typeof AddReact> {
  static description = 'Add items related to the React ecosystem into your existing Nx workspace.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    /** TODO */
    core: Flags.string({
      default: '',
      description: '',
    }),
    /** TODO */
    schematics: Flags.string({
      default: '',
      description: '',
    }),
    hybridAppName: Flags.string({
      default: AddReactApp.flags.hybridAppName.default as string,
      description: AddReactApp.flags.hybridAppName.description,
    }),
    hostAppName: Flags.string({
      default: AddReactApp.flags.hostAppName.default as string,
      description: AddReactApp.flags.hostAppName.description,
    }),
    remoteAppName: Flags.string({
      default: AddReactApp.flags.remoteAppName.default as string,
      description: AddReactApp.flags.remoteAppName.description,
    }),
    regularAppName: Flags.string({
      default: AddReactApp.flags.regularAppName.default as string,
      description: AddReactApp.flags.regularAppName.description,
    }),
    libraryName: Flags.string({
      default: AddReactApp.flags.libraryName.default as string,
      description: AddReactApp.flags.libraryName.description,
    }),
    styleType: Flags.string({
      default: AddReactApp.flags.styleType.default as string,
      description: AddReactApp.flags.styleType.description,
    }),
    unitTestRunner: Flags.string({
      default: AddReactApp.flags.unitTestRunner.default as string,
      description: AddReactApp.flags.unitTestRunner.description,
    }),
    endToEndTestRunner: Flags.string({
      default: AddReactApp.flags.endToEndTestRunner.default as string,
      description: AddReactApp.flags.endToEndTestRunner.description,
    }),
  }

  public async run(): Promise<void> {
    if (!isValidWorkspace()) {
      this.log(messages.invalidWorkspace())
      return
    }

    const {flags} = await this.parse(AddReact)

    if (Object.keys(flags).length === 0)
      this.log("\nPlease provide a valid input.\nUse 'uclif add:react --help' flag for more details.")

    await this.config.runCommand(
      'add:react:packages',
      formatFlags(this, flags?.hybridAppName ? ['--hybrid=true'] : []),
    )

    await this.config.runCommand(
      'add:react:app',
      formatFlags(
        this,
        [
          `--styleType=${flags?.styleType}`,
          `--hostAppName=${flags?.hostAppName}`,
          `--libraryName=${flags?.libraryName}`,
          `--remoteAppName=${flags?.remoteAppName}`,
          `--hybridAppName=${flags?.hybridAppName}`,
          `--regularAppName=${flags?.regularAppName}`,
          `--unitTestRunner=${flags?.unitTestRunner}`,
          `--endToEndTestRunner=${flags?.endToEndTestRunner}`,
        ],
      ),
    )
  }
}
