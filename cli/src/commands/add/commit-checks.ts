import {Flags} from '@oclif/core'
import {BaseCommand} from '../../base/command'
import {formatFlags} from '../../tools/oclif'
import AddCodeFormatter from './code-formatter'
import AddCodeLinter from './code-linter'
import AddCommitHooks from './commit-hooks'

export default class AddCommitChecks extends BaseCommand<typeof AddCommitChecks> {
  static description = "Sequentially runs 'add:commit-hooks' => 'add:code-linter' => 'add:code-formatter'"

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    projectPath: Flags.string({
      default: AddCommitHooks.flags.projectPath.default as string,
      description: AddCommitHooks.flags.projectPath.description,
    }),
    relativeGitFolderPath: Flags.string({
      default: AddCommitHooks.flags.relativeGitFolderPath.default as string,
      description: AddCommitHooks.flags.relativeGitFolderPath.description,
    }),
    autoLintOnSave: Flags.string({
      default: AddCodeLinter.flags.autoLintOnSave.default as string,
      description: AddCodeLinter.flags.autoLintOnSave.description,
    }),
    autoFormatOnSave: Flags.string({
      default: AddCodeFormatter.flags.autoFormatOnSave.default as string,
      description: AddCodeFormatter.flags.autoFormatOnSave.description,
    }),
    organizeImportsOnSave: Flags.string({
      default: AddCodeFormatter.flags.organizeImportsOnSave.default as string,
      description: AddCodeFormatter.flags.organizeImportsOnSave.description,
    }),
    formatter: Flags.string({
      default: AddCodeFormatter.flags.formatter.default as string,
      description: AddCodeFormatter.flags.formatter.description,
    }),
    tabSize: Flags.integer({
      default: AddCodeFormatter.flags.tabSize.default as number,
      description: AddCodeFormatter.flags.tabSize.description,
    }),
  };

  public async run(): Promise<void> {
    const {flags} = await this.parse(AddCommitChecks)

    try {
      await this.config.runCommand(
        'add:commit-hooks',
        formatFlags(this,
          [
            `--projectPath=${flags?.projectPath}`,
            `--relativeGitFolderPath=${flags?.relativeGitFolderPath}`,
          ],
        ),
      )

      await this.config.runCommand(
        'add:code-linter',
        formatFlags(this,
          [
            `--autoLintOnSave=${flags?.autoLintOnSave}`,
          ],
        ),
      )

      await this.config.runCommand(
        'add:code-formatter',
        formatFlags(this,
          [
            `--autoFormatOnSave=${flags?.autoFormatOnSave}`,
            `--organizeImportsOnSave=${flags?.organizeImportsOnSave}`,
            `--formatter=${flags?.formatter}`,
            `--tabSize=${flags?.tabSize}`,
          ],
        ),
      )

      await this.generateCliDoc()
    } catch (error) {
      console.error('\nAn error occurred while setting up commit checks', error)
    }
  }
}
