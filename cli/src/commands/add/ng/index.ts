import AddNgApp from './app'
import AddNgCore from './core'
import AddNgSchematics from './schematics'

import {Flags} from '@oclif/core'

import {messages} from '../../../tools/messages'
import {formatFlags} from '../../../tools/oclif'
import {BaseCommand} from '../../../base/command'
import {isValidWorkspace} from '../../../tools/nx'

export default class AddNg extends BaseCommand<typeof AddNg> {
  static description = 'Add items related to the Angular ecosystem into your existing Nx workspace.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    core: Flags.string({
      default: AddNgCore.flags.version.default as string,
      description: AddNgCore.flags.version.description,
    }),
    schematics: Flags.string({
      default: AddNgSchematics.flags.version.default as string,
      description: AddNgSchematics.flags.version.description,
    }),
    hybridAppName: Flags.string({
      default: AddNgApp.flags.hybridAppName.default as string,
      description: AddNgApp.flags.hybridAppName.description,
    }),
    hostAppName: Flags.string({
      default: AddNgApp.flags.hostAppName.default as string,
      description: AddNgApp.flags.hostAppName.description,
    }),
    remoteAppName: Flags.string({
      default: AddNgApp.flags.remoteAppName.default as string,
      description: AddNgApp.flags.remoteAppName.description,
    }),
    regularAppName: Flags.string({
      default: AddNgApp.flags.regularAppName.default as string,
      description: AddNgApp.flags.regularAppName.description,
    }),
    libraryName: Flags.string({
      default: AddNgApp.flags.libraryName.default as string,
      description: AddNgApp.flags.libraryName.description,
    }),
    styleType: Flags.string({
      default: AddNgApp.flags.styleType.default as string,
      description: AddNgApp.flags.styleType.description,
    }),
    unitTestRunner: Flags.string({
      default: AddNgApp.flags.unitTestRunner.default as string,
      description: AddNgApp.flags.unitTestRunner.description,
    }),
    endToEndTestRunner: Flags.string({
      default: AddNgApp.flags.endToEndTestRunner.default as string,
      description: AddNgApp.flags.endToEndTestRunner.description,
    }),
  }

  public async run(): Promise<void> {
    if (!isValidWorkspace()) {
      this.log(messages.invalidWorkspace())
      return
    }

    const {flags} = await this.parse(AddNg)

    if (Object.keys(flags).length === 0)
      this.log("\nPlease provide a valid input.\nUse 'uclif add:ng --help' flag for more details.")

    await this.config.runCommand(
      'add:ng:packages',
      formatFlags(
        this,
        flags?.hybridAppName ? ['--hybrid=true'] : [],
      ),
    )

    await this.config.runCommand(
      'add:ng:app',
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

    await this.config.runCommand(
      'add:ng:helpers',
      formatFlags(
        this,
        [
          `--core=${flags?.core}`,
          `--schematics=${flags?.schematics}`,
        ],
      ),
    )
  }
}
