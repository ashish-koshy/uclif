import {BaseCommand} from '../../../base/command'

export default class RunNg extends BaseCommand<typeof RunNg> {
  static description = 'Run custom tools, generators or schematics for the Angular ecosystem.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static args = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(RunNg)

    Object.keys(args).length === 0 &&
      this.log("\nPlease provide a valid input.\nUse 'uclif run:ng --help' flag for more details.")
  }
}
