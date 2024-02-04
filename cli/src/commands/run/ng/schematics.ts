import {Flags} from '@oclif/core'

import {execute} from '../../../tools/node'
import {prompt} from '../../../tools/prompt'
import {packagesExist} from '../../../tools/npm'
import {PackageLookup} from '../../../types/npm'
import {messages} from '../../../tools/messages'
import {BaseCommand} from '../../../base/command'
import {schematicsConfig} from '../../../tools/angular'

export default class RunNgSchematics extends BaseCommand<typeof RunNgSchematics> {
  static module = 'Ng Schematics'
  static description = `Run ${RunNgSchematics.module} for an existing Angular application.`
  static dependencies: PackageLookup = {
    dependencies: [
      '@uclif/ng-core',
    ],
    devDependencies: [
      '@uclif/ng-schematics',
    ],
  }

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    schema: Flags.string({
      default: '',
      description: 'Name of the schema you\nwould like to run from - @uclif/ng-schematics',
    }),
    appName: Flags.string({
      default: '',
      description: 'If your workspace has multiple apps, specify the name of the app for which you\nwould like to run the schema.',
    }),
    schemaRunnerFlag: Flags.string({
      default: '',
      description: 'Any flag that you wish to pass into the Angular Schematics CLI runner.',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(RunNgSchematics)

    if (!packagesExist(RunNgSchematics.dependencies)) {
      this.log(
        messages.missingDependencies(
          RunNgSchematics.dependencies,
          'uclif add:ng:core --help',
          'uclif add:ng:schematics --help',
        ),
      )
      return
    }

    if (!flags.schema)
      flags.schema = await prompt.schematicName(this)

    this.log(`\nPlease wait, attempting to run schematic - ${flags.schema}`)

    try {
      execute(
        'node',
        [
          `${schematicsConfig.runner}`,
          `${schematicsConfig.collection}:${flags.schema}`,
          '--dry-run=false',
          `${flags?.schemaRunnerFlag ? `--${flags.schemaRunnerFlag}` : ''}`,
          `${flags?.appName ? `--app-name=${flags.appName}` : ''}`,
        ],
      )

      await this.generateCliDoc()
    } catch (error) {
      console.error(`\nThere was an error while running ${RunNgSchematics.module}`, error)
    }
  }
}
