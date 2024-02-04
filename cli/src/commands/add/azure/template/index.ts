import {BaseCommand} from '../../../../base/command'

export default class AddAzureTemplate extends BaseCommand<typeof AddAzureTemplate> {
  static description = "Add '.YML' templates for Microsoft Azure DevOps."

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(AddAzureTemplate)

    Object.keys(args).length === 0 &&
      this.log("\nPlease provide a valid input.\nUse 'uclif add:azure:template --help' flag for more details.")
  }
}
