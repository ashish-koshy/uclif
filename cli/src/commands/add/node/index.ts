import {isValidWorkspace} from '../../../tools/nx'
import {BaseCommand} from '../../../base/command'
import {messages} from '../../../tools/messages'
import {formatFlags} from '../../../tools/oclif'

import {Flags} from '@oclif/core'
import AddNodeApp from './app'

export default class AddNode extends BaseCommand<typeof AddNode> {
  static description = 'Add items related to the Node ecosystem into your existing Nx workspace.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    name: Flags.string({
      default: AddNodeApp.flags.name.default as string,
      description: AddNodeApp.flags.name.description,
    }),
    port: Flags.string({
      default: AddNodeApp.flags.port.default as string,
      description: AddNodeApp.flags.port.description,
    }),
    framework: Flags.string({
      default: AddNodeApp.flags.framework.default as string,
      description: AddNodeApp.flags.framework.description,
    }),
    unitTestRunner: Flags.string({
      default: AddNodeApp.flags.unitTestRunner.default as string,
      description: AddNodeApp.flags.unitTestRunner.description,
    }),
    endToEndTestRunner: Flags.string({
      default: AddNodeApp.flags.endToEndTestRunner.default as string,
      description: AddNodeApp.flags.endToEndTestRunner.description,
    }),
    bundler: Flags.string({
      default: AddNodeApp.flags.bundler.default as string,
      description: AddNodeApp.flags.bundler.description,
    }),
    frontendProject: Flags.string({
      default: AddNodeApp.flags.frontendProject.default as string,
      description: AddNodeApp.flags.frontendProject.description,
    }),
  }

  public async run(): Promise<void> {
    if (!isValidWorkspace()) {
      this.log(messages.invalidWorkspace())
      return
    }

    const {flags} = await this.parse(AddNode)

    if (Object.keys(flags).length === 0)
      this.log("\nPlease provide a valid input.\nUse 'uclif add:node --help' flag for more details.")

    await this.config.runCommand(
      'add:node:packages',
      formatFlags(this, []),
    )

    await this.config.runCommand(
      'add:node:app',
      formatFlags(
        this,
        [
          `--name=${flags?.name}`,
          `--port=${flags?.port}`,
          `--bundler=${flags?.bundler}`,
          `--framework=${flags?.framework}`,
          `--unitTestRunner=${flags?.unitTestRunner}`,
          `--frontendProject=${flags?.frontendProject}`,
          `--endToEndTestRunner=${flags?.endToEndTestRunner}`,
        ],
      ),
    )
  }
}
