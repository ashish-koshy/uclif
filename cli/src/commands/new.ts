import AddNgApp from './add/ng/app'
import AddCodeLinter from './add/code-linter'
import AddCommitHooks from './add/commit-hooks'
import AddCodeFormatter from './add/code-formatter'

import {execute} from '../tools/node'
import {prompt} from '../tools/prompt'
import {nxDefaults} from '../tools/nx'
import {staticData} from '../static-data'
import {messages} from '../tools/messages'
import {BaseCommand} from '../base/command'
import {setStandardPackageScripts} from '../tools/npm'
import {clean, validatePackageVersion} from '../tools/semver'
import {describeCommandFlag, formatFlags} from '../tools/oclif'

import fs = require('fs-extra')
import semver = require('semver')

import isCI = require('is-ci')

import {Args, Flags} from '@oclif/core'

export default class New extends BaseCommand<typeof New> {
  static package = 'Client Project Nx Workspace'
  static version: string | undefined | null = null
  static description = `Create new ${New.package}.`

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    nx: Flags.string({
      default: staticData.versions.nx,
      description: 'Compatible versions of Nx: >=14.0.0 and <=17.0.0',
    }),
    framework: Flags.string({
      default: nxDefaults.framework,
      description: `Available framework types ${describeCommandFlag(nxDefaults.frameworks)}`,
    }),
    hybridAppName: Flags.string({
      default: AddNgApp.flags.hybridAppName.default as string,
      description: AddNgApp.flags.hybridAppName.description,
    }),
    hostAppName: Flags.string({
      default: AddNgApp.flags.hybridAppName.default as string,
      description: AddNgApp.flags.hostAppName.description,
    }),
    remoteAppName: Flags.string({
      default: AddNgApp.flags.hybridAppName.default as string,
      description: AddNgApp.flags.remoteAppName.description,
    }),
    regularAppName: Flags.string({
      default: AddNgApp.flags.hybridAppName.default as string,
      description: AddNgApp.flags.regularAppName.description,
    }),
    libraryName: Flags.string({
      default: AddNgApp.flags.hybridAppName.default as string,
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
    core: Flags.string({
      default: '',
      description: 'Override package version for organization specific client core modules.',
    }),
    schematics: Flags.string({
      default: '',
      description: 'Override package version for organization specific client schematics library.',
    }),
    addCommitChecks: Flags.string({
      default: 'true',
      description: 'Set this to false if you do no wish to add commit validations',
    }),
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
  }

  static args = {
    name: Args.string({description: `Name of the new ${New.package}`}),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(New)
    const {flags} = await this.parse(New)

    await this.config.runCommand('version')

    New.version = validatePackageVersion(flags?.nx, `${this.config?.version || staticData.versions.nx}`)
    const nxMajor = semver.major(clean(New.version))

    if (nxMajor < 14) {
      console.error('\nSorry, this CLI only supports Nx versions >= 14')
      return
    }

    args.name = await prompt.workspaceName(this, args.name)
    if (!args.name) return

    execute(
      'npx',
      [
        `create-nx-workspace@${nxMajor}`,
        `--name=${args.name}`,
        `--style=${flags.styleType}`,
        `--preset=${nxDefaults.preset}`,
        `--nxCloud=${nxDefaults.nxCloud}`,
        `--workspaceType=${nxDefaults.workspaceType}`,
        `--packageManager=${nxDefaults.packageManager}`,
      ],
    )

    if (!fs.existsSync(`./${args.name}/nx.json`)) {
      this.log(messages.setupFailed())
      return
    }

    this.log(`\n${New.package} - '${args.name}'\nhas been created successfully...`)

    process.chdir(`./${args.name}`)

    try {
      const flagInputs = formatFlags(
        this,
        [
          `--core=${flags?.core}`,
          `--schematics=${flags?.schematics}`,
          `--styleType=${flags?.styleType}`,
          `--hostAppName=${flags?.hostAppName}`,
          `--libraryName=${flags?.libraryName}`,
          `--remoteAppName=${flags?.remoteAppName}`,
          `--hybridAppName=${flags?.hybridAppName}`,
          `--regularAppName=${flags?.regularAppName}`,
          `--unitTestRunner=${flags?.unitTestRunner}`,
          `--endToEndTestRunner=${flags?.endToEndTestRunner}`,
        ],
      )

      switch (flags.framework) {
      case 'angular':
        await this.config.runCommand('add:ng', flagInputs)
        break
      case 'react':
        await this.config.runCommand('add:react', flagInputs)
        break
      default:
        break
      }

      setStandardPackageScripts()

      flags.addCommitChecks === 'true' &&
      await this.config.runCommand(
        'add:commit-checks',
        formatFlags(
          this,
          [
            `--projectPath=${flags?.projectPath}`,
            `--relativeGitFolderPath=${flags?.relativeGitFolderPath}`,
            `--autoLintOnSave=${flags?.autoLintOnSave}`,
            `--autoFormatOnSave=${flags?.autoFormatOnSave}`,
            `--organizeImportsOnSave=${flags?.organizeImportsOnSave}`,
            `--formatter=${flags?.formatter}`,
            `--tabSize=${flags?.tabSize}`,
          ],
        ),
      )

      if (!isCI) {
        execute(
          'git',
          [
            'add',
            '*',
          ],
        )
        execute(
          'git',
          [
            'commit',
            '-m',
            '"chore: workspace setup by uclif"',
            '--no-verify',
          ],
        )
      }

      this.log(messages.setupComplete(args.name))
    } catch (error) {
      console.error(`\nAn error occurred while setting up ${New.package}...`, error)
    }
  }
}
