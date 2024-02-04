import {BaseCommand} from '../base/command'
import {getFigletText} from '../tools/figlet'
import {staticData} from '../static-data'
export default class Version extends BaseCommand<typeof Version> {
  static description = 'Display the installed version of uclif.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {}
  static args = {}

  public async run(): Promise<void> {
    this.log(
      getFigletText(
        'UCLIF',
        {
          width: 80,
          font: 'Standard',
          whitespaceBreak: true,
        },
      ),
    )

    this.log(`@uclif/cli - ${this.config?.version || '0'}`)
    this.log('--------------------------------')
    this.log(`Author(s) - ${staticData.authors.join(', ')}`)
    this.log('--------------------------------')
    this.log("Use the command 'uclif --help'\nfor more details")
    this.log('--------------------------------')
  }
}
