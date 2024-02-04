import {Flags} from '@oclif/core'
import {BaseCommand} from '../../../base/command'
import {formatFlags} from '../../../tools/oclif'

import AddNgCore from './core'
import AddNgSchematics from './schematics'

export default class AddNgHelpers extends BaseCommand<typeof AddNgCore> {
  static description = "Sequentially runs 'add:ng:core' => 'add:ng:schematics'"
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
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AddNgHelpers)

    await this.config.runCommand(
      'add:ng:core',
      formatFlags(
        this,
        [
          `--version=${flags?.core}`,
        ],
      ),
    )

    await this.config.runCommand(
      'add:ng:schematics',
      formatFlags(
        this,
        [
          `--version=${flags?.schematics}`,
        ],
      ),
    )

    await this.generateCliDoc()
  }
}
