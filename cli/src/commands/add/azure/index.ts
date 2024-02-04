import {BaseCommand} from '../../../base/command'

export default class AddAzure extends BaseCommand<typeof AddAzure> {
  static description = 'Add items related to Microsoft Azure DevOps.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(AddAzure)

    Object.keys(args).length === 0 &&
      this.log("\nPlease provide a valid input.\nUse 'uclif add:azure --help' flag for more details.")
  }
}
