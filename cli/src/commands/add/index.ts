import {BaseCommand} from '../../base/command'

export default class Add extends BaseCommand<typeof Add> {
  static description = 'Add items to your workspace.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {}

  static args = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(Add)
    Object.keys(args).length === 0 && this.log("\nPlease provide a valid input.\nUse 'uclif add --help' flag for more details.")
  }
}
